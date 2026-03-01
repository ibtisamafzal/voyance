import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Mic, MicOff, Loader2, CheckCircle, Play, Navigation, Globe, Sparkles } from 'lucide-react';
import { startResearch, connectToResearchStream, getResearchResults, sendInterruptViaWS, interruptResearch, transcribeAudio, type AgentUpdate } from '../../lib/api';
import { useResearch } from '../context/ResearchContext';

const SAMPLE_PROMPTS = [
  'Compare top 5 Voice Agent Tools',
  'Best CRM software for SMB',
  'Project management tools pricing',
  'Email marketing platforms',
];

export function HeroSection() {
  const words1 = ['See', 'the', 'Web.'];
  const words2 = ['Hear', 'the', 'Insight.'];
  const words3 = ['In', 'Seconds.'];

  const { appendResult, setResults, clearResults } = useResearch();
  const [query, setQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [agentStep, setAgentStep] = useState('');
  const [agentProgress, setAgentProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const [showRedirect, setShowRedirect] = useState(false);
  const [redirectInstruction, setRedirectInstruction] = useState('');
  /** Input mode: which voice engine — browser (Web Speech API) or Gemini transcribe. Voice is always allowed. */
  const [inputMode, setInputMode] = useState<'browser_voice' | 'gemini_voice'>('gemini_voice');
  const [isGeminiTranscribing, setIsGeminiTranscribing] = useState(false);
  /** Voice barge-in: recording redirect instruction by voice */
  const [isRedirectRecording, setIsRedirectRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const redirectRecorderRef = useRef<MediaRecorder | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const currentSidRef = useRef<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const API = (window as { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition
      || (window as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;
    setVoiceSupported(!!API);
    return () => {
      recognitionRef.current?.stop();
      if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      setShowRedirect(false);
      setRedirectInstruction('');
    }
  }, [isRunning]);

  const toggleVoiceInput = useCallback(async () => {
    if (inputMode === 'gemini_voice') {
      // Gemini: MediaRecorder → POST /transcribe (low-latency path)
      if (isRecording && mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
        recorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          if (chunksRef.current.length === 0) {
            setIsRecording(false);
            setIsGeminiTranscribing(false);
            return;
          }
          setIsGeminiTranscribing(true);
          try {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
            const { text } = await transcribeAudio(blob);
            if (text) setQuery((t) => (t ? `${t} ${text}` : text).trim());
          } catch (e) {
            console.error('Gemini transcribe failed:', e);
          } finally {
            setIsGeminiTranscribing(false);
            setIsRecording(false);
          }
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (e) {
        console.error('Microphone access failed:', e);
      }
      return;
    }

    if (inputMode === 'browser_voice') {
      // Web Speech API
      const SpeechRecognitionAPI = (window as { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition
        || (window as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) return;
      if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
        return;
      }
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
        let transcript = '';
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i];
          const last = r[r.length - 1];
          if (last) transcript += last.transcript;
        }
        if (transcript) setQuery(t => (t ? `${t} ${transcript}` : transcript).trim());
      };
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      return;
    }
  }, [isRecording, inputMode]);

  const handleResearch = async () => {
    const q = query.trim() || 'Compare pricing for the top 5 CRM tools';
    setIsRunning(true);
    setIsComplete(false);
    setError('');
    setAgentStep('Connecting...');
    setAgentProgress(0.02);
    clearResults();

    try {
      const res = await startResearch({ query: q, max_sites: 5 });
      const sid = res.session_id;
      currentSidRef.current = sid;

      // Connect WebSocket for real-time updates
      wsRef.current = connectToResearchStream(
        sid,
        (update) => {
          const upd = update as AgentUpdate;
          if (upd.step) {
            setAgentStep(upd.message ?? upd.step);
            setAgentProgress(upd.progress ?? 0);
            // Accumulate competitor data as it streams in
            if (upd.data) appendResult(upd.data);
            if (upd.step === 'complete') {
              setIsRunning(false);
              setIsComplete(true);
              // Set Vera summary immediately from WebSocket (for Listen button)
              setResults(sid, undefined, upd.vera_speech ?? upd.message, q, undefined);
              // Fetch full results from backend (authoritative)
              getResearchResults(sid).then((data) => {
                const results = data.results ?? [];
                const veraSummary = data.vera_summary ?? data.message;
                setResults(sid, results, veraSummary, q, data.total_sites ?? results.length);
              }).catch(() => {
                // API failed — state already has data from appendResult; don't overwrite
              });
              setTimeout(() => {
                document.querySelector('#output')?.scrollIntoView({ behavior: 'smooth' });
              }, 800);
            }
          }
        },
        () => {
          if (isRunning) {
            const sid = currentSidRef.current;
            if (sid) {
              // WS dropped (e.g. LB idle timeout). Poll for results so we still get them.
              let attempts = 0;
              const maxAttempts = 24; // 2 min at 5s
              const poll = () => {
                attempts += 1;
                getResearchResults(sid)
                  .then((data) => {
                    const done = data.status === 'complete' || data.status === 'error' || attempts >= maxAttempts;
                    if (done) {
                      setIsRunning(false);
                      setIsComplete(true);
                      setResults(sid, data.results ?? [], data.vera_summary ?? data.message, q, data.total_sites ?? data.results?.length ?? 0);
                      return;
                    }
                    if (attempts < maxAttempts) setTimeout(poll, 5000);
                  })
                  .catch(() => {
                    if (attempts < maxAttempts) setTimeout(poll, 5000);
                    else {
                      setIsRunning(false);
                      setIsComplete(true);
                      setResults(sid, [], 'Connection lost. Partial results may be available.', q, 0);
                    }
                  });
              };
              poll();
            } else {
              setIsRunning(false);
            }
          }
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Backend connection failed. Make sure the server is running on port 8000.';
      setError(msg);
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isRunning) handleResearch();
  };

  /** Send redirect instruction (text or from voice). */
  const sendRedirect = useCallback((instruction: string) => {
    const inst = instruction.trim();
    if (!inst) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      sendInterruptViaWS(wsRef.current, inst);
    } else {
      const sid = currentSidRef.current;
      if (sid) interruptResearch(sid, inst).catch(console.error);
    }
    setRedirectInstruction('');
    setShowRedirect(false);
  }, []);

  /** Voice barge-in (AC-04 / F4): record redirect instruction, transcribe, send. */
  const toggleRedirectVoice = useCallback(async () => {
    if (isRedirectRecording && redirectRecorderRef.current?.state === 'recording') {
      redirectRecorderRef.current.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsRedirectRecording(false);
        if (chunks.length === 0) return;
        try {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const { text } = await transcribeAudio(blob);
          if (text?.trim()) sendRedirect(text);
        } catch (e) {
          console.error('Redirect voice transcribe failed:', e);
        }
      };
      recorder.start();
      redirectRecorderRef.current = recorder;
      setIsRedirectRecording(true);
    } catch (e) {
      console.error('Microphone for redirect failed:', e);
      setIsRedirectRecording(false);
    }
  }, [isRedirectRecording, sendRedirect]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] dark:opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            filter: 'blur(80px)',
            bottom: '-10%',
            left: '-5%',
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] dark:opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, var(--vera-voice) 0%, transparent 70%)',
            filter: 'blur(80px)',
            top: '-5%',
            right: '-5%',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 4,
          }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] dark:opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, var(--success) 0%, transparent 70%)',
            filter: 'blur(80px)',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 8,
          }}
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 md:px-10 py-8 sm:py-10 md:py-12 relative z-10">
        <div className="text-center max-w-[900px] mx-auto space-y-8">
          {/* Eyebrow Label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3, type: 'spring' }}
            className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border text-center max-w-[95vw]"
            style={{
              backgroundColor: 'var(--accent-glow)',
              borderColor: 'rgba(10, 95, 232, 0.3)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(9px, 2.2vw, 11px)',
              color: 'var(--accent)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            GEMINI LIVE AGENT CHALLENGE 2026 — UI NAVIGATOR
          </motion.div>

          {/* Main Headline */}
          <div className="space-y-2 px-1">
            <h1 className="overflow-hidden">
              {/* Line 1 */}
              <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
                {words1.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.2 + i * 0.05,
                      duration: 0.5,
                      type: 'spring',
                      damping: 20,
                      stiffness: 300,
                    }}
                    style={{ color: 'var(--text-primary)', display: 'inline-block' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              {/* Line 2 */}
              <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
                {words2.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.4 + i * 0.05,
                      duration: 0.5,
                      type: 'spring',
                      damping: 20,
                      stiffness: 300,
                    }}
                    style={{ color: 'var(--text-primary)', display: 'inline-block' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              {/* Line 3 - Accent Color */}
              <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
                {words3.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.55 + i * 0.05,
                      duration: 0.5,
                      type: 'spring',
                      damping: 20,
                      stiffness: 300,
                    }}
                    style={{ color: 'var(--accent)', display: 'inline-block' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="text-base sm:text-lg md:text-xl max-w-[700px] mx-auto leading-relaxed px-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Voyance navigates any website visually — no APIs, no DOM access. Just pure AI vision,
              orchestrated by Gemini + Google ADK, delivered through Vera's voice.
            </motion.p>
          </div>

          {/* Research Input Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.85, duration: 0.35, type: 'spring', damping: 20, stiffness: 300 }}
            className="w-full max-w-[720px] mx-auto"
          >
            <div
              className="relative flex flex-wrap items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-[14px] shadow-2xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1.5px solid var(--border-strong)',
                boxShadow: isRecording ? '0 0 20px rgba(14, 165, 233, 0.4)' : '0 0 0 0 var(--accent-glow)',
              }}
            >
              {/* Mic: voice prompt always allowed — uses Browser or Gemini based on toggle */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={isRunning || isGeminiTranscribing}
                className="shrink-0 ml-0 sm:ml-2 p-2 rounded-full transition-all hover:scale-110 disabled:opacity-50 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                style={{
                  color: isRecording || isGeminiTranscribing ? 'var(--vera-voice)' : 'var(--accent)',
                  backgroundColor: isRecording || isGeminiTranscribing ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                }}
                aria-label={isRecording ? 'Stop voice recording' : isGeminiTranscribing ? 'Transcribing audio...' : 'Start voice input'}
                title={isRecording ? 'Stop recording' : isGeminiTranscribing ? 'Transcribing...' : 'Start voice input'}
              >
                {isRecording || isGeminiTranscribing ? (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    {isGeminiTranscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : <MicOff className="w-5 h-5" />}
                  </motion.div>
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
              {/* Voice engine: Browser (Web Speech) or Gemini — icons on mobile, text on desktop */}
              <div
                className="shrink-0 flex rounded-lg border overflow-hidden"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
                role="group"
                aria-label="Voice engine"
              >
                {([
                  { mode: 'browser_voice' as const, label: 'Browser', icon: Globe, title: 'Voice via browser (Web Speech API)' },
                  { mode: 'gemini_voice' as const, label: 'Gemini', icon: Sparkles, title: 'Voice via Gemini transcription' },
                ]).map(({ mode, label, icon: Icon, title }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => !isRunning && !isRecording && setInputMode(mode)}
                    disabled={isRunning || isRecording}
                    className="flex items-center justify-center gap-1.5 px-2 py-1.5 sm:px-2.5 text-[10px] font-semibold transition-all disabled:opacity-50 min-w-[36px] sm:min-w-0"
                    style={{
                      borderColor: inputMode === mode ? 'var(--accent)' : 'transparent',
                      color: inputMode === mode ? 'var(--accent)' : 'var(--text-tertiary)',
                      backgroundColor: inputMode === mode ? 'rgba(10, 95, 232, 0.12)' : 'transparent',
                    }}
                    title={title}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
              <label htmlFor="research-query" className="sr-only">Research query</label>
              <input
                id="research-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRunning}
                placeholder="Compare pricing for top 5 CRM tools..."
                className="flex-1 min-w-0 w-full sm:w-auto bg-transparent outline-none text-sm md:text-base"
                aria-label="Research query — type or speak your research question"
                autoComplete="off"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-geist)',
                }}
              />
              <button
                id="start-research-btn"
                onClick={handleResearch}
                disabled={isRunning}
                className="shrink-0 flex items-center justify-center gap-2 px-4 py-3 sm:px-5 rounded-[10px] font-semibold text-white text-sm transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px] w-full sm:w-auto"
                style={{ backgroundColor: 'var(--accent)' }}
                aria-label={isRunning ? 'Research in progress' : isComplete ? 'View research results' : 'Start research'}
              >
                {isRunning ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Running...</>
                ) : isComplete ? (
                  <><CheckCircle className="w-4 h-4" /> View Results</>
                ) : (
                  <>Research <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>

            {/* Recording indicator */}
            <AnimatePresence>
              {(isRecording || isGeminiTranscribing) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex items-center justify-center gap-2"
                >
                  <motion.span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--vera-voice)' }}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <span className="text-xs" style={{ color: 'var(--vera-voice)', fontFamily: 'var(--font-mono)' }}>
                    {isGeminiTranscribing ? 'Transcribing via Gemini...' : 'Listening... speak your research query'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Bar */}
            <AnimatePresence>
              {isRunning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 px-2"
                >
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--border)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: 'var(--accent)' }}
                      animate={{ width: `${agentProgress * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p
                    className="text-xs mt-2 truncate"
                    style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
                  >
                    {agentStep}
                  </p>
                  {/* Redirect control (AC-04 / F4): Type or Speak — both options visible */}
                  <div className="mt-3 flex flex-col gap-2">
                    {!showRedirect ? (
                      <button
                        type="button"
                        onClick={() => setShowRedirect(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all hover:scale-[1.02]"
                        style={{
                          borderColor: 'var(--accent)',
                          color: 'var(--accent)',
                          backgroundColor: 'rgba(10, 95, 232, 0.08)',
                        }}
                      >
                        <Navigation className="w-3.5 h-3.5" /> Redirect research
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                          <span>Type</span>
                          <span style={{ color: 'var(--border)' }}>|</span>
                          <span>Speak</span>
                        </div>
                        <div className="flex gap-2 flex-wrap items-center">
                          <input
                            type="text"
                            value={redirectInstruction}
                            onChange={(e) => setRedirectInstruction(e.target.value)}
                            placeholder="e.g. skip Salesforce, focus on HubSpot"
                            className="flex-1 min-w-0 sm:min-w-[180px] px-3 py-2 rounded-lg text-xs bg-transparent border outline-none"
                            style={{
                              borderColor: 'var(--border-strong)',
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-mono)',
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                sendRedirect(redirectInstruction);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={toggleRedirectVoice}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all"
                            style={{
                              borderColor: isRedirectRecording ? 'var(--vera-voice)' : 'var(--border-strong)',
                              color: isRedirectRecording ? 'var(--vera-voice)' : 'var(--text-secondary)',
                              backgroundColor: isRedirectRecording ? 'rgba(14, 165, 233, 0.12)' : 'transparent',
                            }}
                            title="Say your redirect instruction (voice barge-in)"
                          >
                            {isRedirectRecording ? (
                              <><MicOff className="w-3.5 h-3.5" /> Speaking...</>
                            ) : (
                              <><Mic className="w-3.5 h-3.5" /> Speak</>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => sendRedirect(redirectInstruction)}
                            disabled={!redirectInstruction.trim()}
                            className="px-3 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                            style={{ backgroundColor: 'var(--accent)' }}
                          >
                            Send
                          </button>
                          <button
                            type="button"
                            onClick={() => { setShowRedirect(false); setRedirectInstruction(''); }}
                            className="px-3 py-2 rounded-lg text-xs font-medium border"
                            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs mt-3 px-2"
                  style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}
                >
                  ⚠ {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Sample prompt pills */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.3 }}
              className="flex flex-wrap justify-center gap-2 mt-4 px-1"
            >
              {SAMPLE_PROMPTS.map((prompt, i) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => { setQuery(prompt); }}
                  disabled={isRunning}
                  className="px-4 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </motion.div>

            {/* Watch Agent Run link */}
            {!isRunning && !isComplete && !isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="flex justify-center mt-4"
              >
                <a
                  href="#live-agent"
                  className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Play className="w-4 h-4" /> Watch a live demo ↓
                </a>
              </motion.div>
            )}
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.3, staggerChildren: 0.06 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {['✓ Gemini Live API', '✓ Google Cloud Run', '✓ ADK Orchestrated'].map((item, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.95 + i * 0.06 }}
                className="text-sm"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}
              >
                {item}
              </motion.span>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="hidden md:flex justify-center pt-12"
          >
            <div className="relative w-px h-12" style={{ backgroundColor: 'var(--border-strong)' }}>
              <motion.div
                className="absolute w-1.5 h-1.5 rounded-full left-1/2 -translate-x-1/2"
                style={{ backgroundColor: 'var(--accent)' }}
                animate={{ y: [0, 40, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}