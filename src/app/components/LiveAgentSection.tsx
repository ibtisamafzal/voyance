import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, ShieldCheck, Headphones, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

interface DemoStep {
  icon: React.ReactNode;
  phase: string;
  title: string;
  detail: string;
  color: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    icon: <Search className="w-5 h-5" />,
    phase: 'STEP 1',
    title: 'You ask a question',
    detail: '"Compare CRM pricing for Salesforce, HubSpot, Pipedrive, and Monday.com"',
    color: 'var(--accent)',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    phase: 'STEP 2',
    title: 'Agent visits live websites',
    detail: 'Playwright opens each site. Gemini Vision reads the screen — no APIs, no DOM scraping.',
    color: 'var(--accent)',
  },
  {
    icon: <Eye className="w-5 h-5" />,
    phase: 'STEP 3',
    title: 'Data is extracted visually',
    detail: 'Pricing tiers, features, and limits are pulled into a structured comparison table.',
    color: 'var(--warning)',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    phase: 'STEP 4',
    title: 'Facts are cross-checked',
    detail: 'Every data point is verified through Perplexity with confidence scores assigned.',
    color: 'var(--success)',
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    phase: 'STEP 5',
    title: 'Vera delivers your briefing',
    detail: 'A spoken analyst-grade summary plus exportable CSV/HTML comparison table.',
    color: 'var(--vera-voice)',
  },
];

const SAMPLE_RESULTS = [
  { company: 'Salesforce', plan: 'Essentials', price: '$25/user/mo', confidence: '98%' },
  { company: 'HubSpot', plan: 'Professional', price: '$800/mo (3 users)', confidence: '95%' },
  { company: 'Pipedrive', plan: 'Essential', price: '$14/seat/mo', confidence: '97%' },
  { company: 'Monday.com', plan: 'Standard', price: '$10/seat/mo', confidence: '94%' },
];

export function LiveAgentSection() {
  const [inView, setInView] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle steps
  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % DEMO_STEPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [inView]);

  const current = DEMO_STEPS[activeStep];

  return (
    <section
      id="live-agent"
      ref={ref}
      className="py-14 sm:py-18 md:py-24 lg:py-28 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 space-y-4 sm:space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full"
            style={{
              backgroundColor: 'var(--accent-glow)',
              border: '1px solid var(--accent-pill-border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--accent)',
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
            style={{ color: 'var(--text-primary)' }}
          >
            From question to briefing in seconds.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-base sm:text-lg max-w-[640px] mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            See how Voyance researches, extracts, verifies, and reports — step by step.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-8 lg:gap-12 items-start">
          {/* Left — Step list */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-2"
          >
            {DEMO_STEPS.map((step, i) => {
              const isActive = i === activeStep;
              return (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className="w-full text-left rounded-xl p-3 sm:p-4 transition-all flex items-start gap-3 sm:gap-4"
                  style={{
                    backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--border-strong)' : 'transparent'}`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      backgroundColor: isActive ? `${step.color}15` : 'var(--bg-elevated)',
                      color: isActive ? step.color : 'var(--text-tertiary)',
                    }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{
                        color: isActive ? step.color : 'var(--text-tertiary)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {step.phase}
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                    >
                      {step.title}
                    </div>
                  </div>
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="step-indicator"
                      className="w-1.5 h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: step.color }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>

          {/* Right — Active step detail + output preview */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Detail card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl p-4 sm:p-6 md:p-8 border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-strong)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${current.color}15`, color: current.color }}
                  >
                    {current.icon}
                  </div>
                  <div>
                    <div
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: current.color, fontFamily: 'var(--font-mono)' }}
                    >
                      {current.phase}
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {current.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {current.detail}
                </p>

                {/* Progress dots */}
                <div className="flex gap-2 mt-6">
                  {DEMO_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full flex-1 transition-all duration-300"
                      style={{
                        backgroundColor: i <= activeStep ? current.color : 'var(--border)',
                        opacity: i <= activeStep ? 1 : 0.4,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Sample output table — hidden on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="hidden md:block rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-strong)',
              }}
            >
              <div
                className="px-5 py-3 border-b flex items-center justify-between"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
                >
                  SAMPLE OUTPUT
                </span>
                <span
                  className="text-[10px] font-medium px-2 py-1 rounded-md"
                  style={{
                    backgroundColor: 'var(--success-glow)',
                    color: 'var(--success)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  4 results verified
                </span>
              </div>

              {/* Table header */}
              <div
                className="grid grid-cols-[1fr_100px_120px_70px] sm:grid-cols-[1fr_120px_140px_80px] gap-0 text-[10px] sm:text-xs font-bold uppercase border-b"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <div className="px-4 sm:px-5 py-2.5">Company</div>
                <div className="px-3 py-2.5">Plan</div>
                <div className="px-3 py-2.5">Price</div>
                <div className="px-3 py-2.5 text-right">Score</div>
              </div>

              {/* Table rows */}
              {SAMPLE_RESULTS.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
                  className="grid grid-cols-[1fr_100px_120px_70px] sm:grid-cols-[1fr_120px_140px_80px] gap-0 border-b last:border-b-0"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="px-4 sm:px-5 py-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {row.company}
                  </div>
                  <div className="px-3 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {row.plan}
                  </div>
                  <div
                    className="px-3 py-3 text-xs font-semibold"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                  >
                    {row.price}
                  </div>
                  <div className="px-3 py-3 text-right">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: 'var(--success-glow)',
                        color: 'var(--success)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {row.confidence}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="flex justify-center lg:justify-start"
            >
              <Link
                to="/research"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.04]"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Try It Yourself
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
