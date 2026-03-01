import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Eye, Zap, CheckCircle2 } from 'lucide-react';

interface ScreenState {
  url: string;
  title: string;
  transcript: string;
  progress: number;
  step: string;
  status: 'scanning' | 'analyzing' | 'captured';
  targetData: string;
  accentColor: string;
}

const screenStates: ScreenState[] = [
  {
    url: 'pipedrive.com/pricing',
    title: 'Pipedrive',
    transcript: 'Pipedrive Essential: $14 per seat per month. Core CRM, full pipeline management, 3,000 open deals. Perplexity verified — confirmed as of March 2026.',
    progress: 71,
    step: '5/7',
    status: 'captured',
    targetData: 'Pricing: $14/seat/month',
    accentColor: 'var(--success)',
  },
  {
    url: 'monday.com/pricing',
    title: 'Monday.com',
    transcript: 'Monday.com Standard tier: $10 per seat monthly. Automation workflows, timeline views, up to 250 items per board. Cross-checking with official docs...',
    progress: 45,
    step: '3/7',
    status: 'analyzing',
    targetData: 'Feature matrix scanning...',
    accentColor: 'var(--accent)',
  },
  {
    url: 'hubspot.com/pricing/crm',
    title: 'HubSpot',
    transcript: 'HubSpot Professional CRM: $800 monthly for 3 users. Full marketing suite, email tracking, custom reporting. Checking limits and restrictions...',
    progress: 88,
    step: '6/7',
    status: 'analyzing',
    targetData: 'Tier limits: analyzing...',
    accentColor: 'var(--warning)',
  },
  {
    url: 'salesforce.com/editions-pricing',
    title: 'Salesforce',
    transcript: 'Salesforce Essentials: $25 per user per month. Contact and opportunity management, mobile app, email integration. Data captured and structured.',
    progress: 100,
    step: '7/7',
    status: 'captured',
    targetData: 'Complete data set ✓',
    accentColor: 'var(--success)',
  },
];

export function LiveAgentSection() {
  const [inView, setInView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const currentState = screenStates[currentIndex];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-cycle through states
  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenStates.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [inView]);

  // Typing effect for transcript
  useEffect(() => {
    if (!inView) return;

    setTranscript('');
    let index = 0;
    const fullText = currentState.transcript;

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTranscript(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [inView, currentState, currentIndex]);

  return (
    <section
      id="live-agent"
      ref={ref}
      className="py-16 sm:py-20 md:py-24 lg:py-32 flex items-center relative overflow-hidden"
      style={{ backgroundColor: '#060B14' }}
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            filter: 'blur(100px)',
            top: '10%',
            left: '10%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, var(--vera-voice) 0%, transparent 70%)',
            filter: 'blur(100px)',
            bottom: '10%',
            right: '10%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 md:px-10 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-24 space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full"
            style={{
              backgroundColor: 'var(--vera-glow)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--vera-voice)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            VOYANCE IN ACTION
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ color: '#F1F5F9' }}
          >
            Watch Vera work in real-time.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-lg max-w-[700px] mx-auto"
            style={{ color: '#94A3B8' }}
          >
            Vision-powered navigation. No APIs. No DOM. Just pure AI seeing and understanding websites like a human.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 xl:gap-24 items-center">
          {/* Left - Dynamic Browser Screen */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto w-full max-w-[480px]"
          >
            {/* Screen State Indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {screenStates.map((state, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className="relative h-1 rounded-full overflow-hidden cursor-pointer"
                  style={{
                    width: i === currentIndex ? '48px' : '32px',
                    backgroundColor: i === currentIndex ? 'var(--accent)' : 'rgba(255, 255, 255, 0.2)',
                  }}
                  whileHover={{ scale: 1.1 }}
                  aria-label={`View ${state.title} analysis`}
                  aria-current={i === currentIndex ? 'true' : 'false'}
                >
                  {i === currentIndex && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: 'var(--accent)' }}
                      initial={{ scaleX: 0, transformOrigin: 'left' }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5, ease: 'linear' }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: 'min(680px, 85vh)',
                  margin: '0 auto',
                  backgroundColor: 'var(--bg-elevated)',
                  border: 'clamp(8px, 3vw, 14px) solid var(--bg-secondary)',
                }}
              >
                {/* Scan Line */}
                <motion.div
                  className="absolute left-0 w-full h-1 z-20 pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${currentState.accentColor}, transparent)`,
                    boxShadow: `0 0 20px ${currentState.accentColor}`,
                  }}
                  animate={{
                    y: ['0%', '100%'],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Browser Chrome */}
                <div
                  className="flex items-center gap-2 px-4 py-3 border-b"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
                >
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28CA42' }} />
                  </div>
                  <div
                    className="flex-1 flex items-center gap-2 ml-2 px-3 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      fontFamily: 'var(--font-mono)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span className="text-xs">🔒</span>
                    <motion.span
                      key={currentState.url}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px]"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {currentState.url}
                    </motion.span>
                  </div>
                </div>

                {/* Browser Content */}
                <div className="p-6 h-full relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  {/* Simulated Content */}
                  <motion.div
                    key={`content-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="h-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)', width: '80%' }} />
                    <div className="h-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)', width: '60%' }} />
                    <div className="h-28 rounded-lg mt-8 border-2" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: currentState.accentColor }} />
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="h-20 rounded-lg border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} />
                      <div className="h-20 rounded-lg border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="h-16 rounded-lg border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} />
                      <div className="h-16 rounded-lg border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} />
                      <div className="h-16 rounded-lg border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} />
                    </div>
                  </motion.div>

                  {/* AI Annotation */}
                  <motion.div
                    key={`annotation-${currentIndex}`}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-24 left-6 right-6 rounded-lg border-2 p-4"
                    style={{
                      borderColor: currentState.accentColor,
                      backgroundColor: `${currentState.accentColor}15`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {currentState.status === 'captured' ? (
                        <CheckCircle2 className="w-4 h-4" style={{ color: currentState.accentColor }} />
                      ) : currentState.status === 'analyzing' ? (
                        <Zap className="w-4 h-4" style={{ color: currentState.accentColor }} />
                      ) : (
                        <Eye className="w-4 h-4" style={{ color: currentState.accentColor }} />
                      )}
                      <span
                        className="text-xs font-bold uppercase"
                        style={{ color: currentState.accentColor, fontFamily: 'var(--font-mono)' }}
                      >
                        {currentState.status === 'captured' ? 'CAPTURED' : 'ANALYZING'}
                      </span>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
                      {currentState.targetData}
                    </span>
                  </motion.div>

                  {/* Status Badge */}
                  <motion.div
                    key={`status-${currentIndex}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute top-6 right-6 flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentState.accentColor }}
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
                    >
                      Step {currentState.step}
                    </span>
                  </motion.div>

                  {/* Progress Bar */}
                  <motion.div
                    key={`progress-${currentIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute bottom-6 left-6 right-6 px-4 py-3 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        Gemini Vision
                      </p>
                      <span className="text-xs font-bold" style={{ color: currentState.accentColor, fontFamily: 'var(--font-mono)' }}>
                        {currentState.progress}%
                      </span>
                    </div>
                    <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{ backgroundColor: currentState.accentColor }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${currentState.progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right - Vera Output */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-10"
          >
            {/* Current Target Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-mono)', color: '#94A3B8' }}
                >
                  NOW ANALYZING
                </span>
                <div className="w-px h-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
                  {currentState.title}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Vera Card */}
            <div
              className="rounded-2xl p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Vera Header */}
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, var(--vera-voice), #3B82F6)',
                  }}
                >
                  <span className="relative z-10">V</span>
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.3), transparent)',
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg" style={{ color: '#F1F5F9' }}>
                    Vera · Research Agent
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--success)' }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                      Speaking
                    </span>
                  </div>
                </div>
              </div>

              {/* Waveform */}
              <div className="flex items-end justify-center gap-1 h-16">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full"
                    style={{
                      background: 'linear-gradient(to top, var(--vera-voice), #3B82F6)',
                    }}
                    animate={{
                      height: ['25%', `${Math.random() * 60 + 40}%`, '25%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.03,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>

              {/* Transcript */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-base leading-relaxed min-h-[120px]"
                  style={{ color: '#CBD5E1', fontFamily: 'var(--font-geist)' }}
                >
                  {transcript}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-5 ml-1"
                    style={{ backgroundColor: 'var(--vera-voice)' }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Source Pills */}
              <div className="flex flex-wrap gap-3">
                {['✓ HubSpot', '✓ Salesforce', '● Pipedrive', '● Monday.com'].map((source, i) => (
                  <motion.span
                    key={source}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="px-4 py-2 rounded-full text-sm"
                    style={{
                      backgroundColor: source.startsWith('✓') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: source.startsWith('✓') ? 'var(--success)' : 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                      border: `1px solid ${source.startsWith('✓') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                    }}
                  >
                    {source}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { label: 'Sites/Session', value: '5+' },
                { label: 'Avg Time', value: '2.8s' },
                { label: 'Accuracy', value: '99%' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="text-center p-3 sm:p-4 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div
                    className="text-xl sm:text-2xl font-bold mb-1"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1.3 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-[10px] font-semibold text-white transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--accent)' }}
              whileHover={{ boxShadow: '0 0 0 4px var(--accent-glow)' }}
              aria-label="Run your own research with Voyance"
              onClick={() => document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Run Your Own Research <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
