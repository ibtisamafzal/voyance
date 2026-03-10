import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Search, Eye, ShieldCheck, Headphones, Sparkles, Zap } from 'lucide-react';

interface GuideStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Welcome to Voyance',
    description:
      'Voyance is an AI-powered competitive intelligence agent built for the Gemini Live Agent Challenge. It browses live websites, extracts structured data, verifies facts, and delivers spoken briefings — all automatically.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Why Voyance Exists',
    description:
      'Unlike chatbots that answer from cached data, Voyance sends a real browser to see websites visually. Every data point is cross-verified. No hallucinations — just real, structured competitive intelligence in seconds.',
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: 'Enter Your Research Query',
    description:
      'Type or speak a competitive research question — for example, "Compare CRM pricing for Salesforce, HubSpot, and Pipedrive." Voyance will plan and execute the research automatically.',
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'AI Agent Browses & Extracts',
    description:
      'A headless browser visits each target website while Gemini Vision reads live screenshots. Data like pricing, features, and plans is extracted into a structured comparison table.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Facts Are Verified',
    description:
      'Every extracted data point is cross-checked through Perplexity. Each result receives a confidence score so you can trust the output.',
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    title: 'Get Your Briefing',
    description:
      'Review the comparison table, export it as CSV or HTML, or listen to Vera — our AI voice analyst who narrates key insights as a spoken briefing.',
  },
];

interface TourGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TourGuide({ isOpen, onClose }: TourGuideProps) {
  const [step, setStep] = useState(0);
  const current = GUIDE_STEPS[step];
  const isLast = step === GUIDE_STEPS.length - 1;
  const isFirst = step === 0;

  // Reset step on open
  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && !isLast) setStep(s => s + 1);
      if (e.key === 'ArrowLeft' && !isFirst) setStep(s => s - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isLast, isFirst, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="w-[90vw] max-w-[420px] min-h-[470px] max-h-[88vh] sm:min-h-[500px] rounded-2xl p-6 sm:p-8 shadow-2xl mx-4 flex flex-col"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
            }}
          >
            {/* Close */}
            <div className="flex items-center justify-between mb-5">
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
              >
                Quick Guide &middot; {step + 1}/{GUIDE_STEPS.length}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                aria-label="Close guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content region with stable height */}
            <div className="flex-1 min-h-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto pr-1"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}
                  >
                    {current.icon}
                  </div>

                  <h3
                    className="text-lg font-bold mb-2 tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {current.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {current.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div
              className="h-1 rounded-full mt-4 mb-6 overflow-hidden"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((step + 1) / GUIDE_STEPS.length) * 100}%`,
                  backgroundColor: 'var(--accent)',
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                Skip
              </button>

              <div className="flex items-center gap-2">
                {!isFirst && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-xl border transition-colors"
                    style={{
                      borderColor: 'var(--border-strong)',
                      color: 'var(--text-primary)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (isLast) onClose();
                    else setStep(s => s + 1);
                  }}
                  className="flex items-center gap-1 text-sm font-semibold px-5 py-2 rounded-xl text-white transition-all hover:scale-[1.04]"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {isLast ? 'Got It' : 'Next'}
                  {!isLast && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
