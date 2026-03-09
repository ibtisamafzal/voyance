import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Zap, Clock, Eye, ShieldCheck, Headphones, Globe } from 'lucide-react';

interface ComparisonRow {
  feature: string;
  manual: boolean;
  chatbots: boolean;
  voyance: boolean;
}

const COMPARISONS: ComparisonRow[] = [
  { feature: 'Browses live websites in real-time', manual: true, chatbots: false, voyance: true },
  { feature: 'Reads pages visually (like a human)', manual: true, chatbots: false, voyance: true },
  { feature: 'Structures data into comparison tables', manual: false, chatbots: false, voyance: true },
  { feature: 'Cross-checks facts automatically', manual: false, chatbots: false, voyance: true },
  { feature: 'Delivers spoken analyst briefings', manual: false, chatbots: false, voyance: true },
  { feature: 'Completes in under 90 seconds', manual: false, chatbots: true, voyance: true },
];

const DIFFERENTIATORS = [
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Vision-First Browsing',
    description: 'Unlike chatbots that rely on cached data, Voyance sends a real browser to capture live screenshots and reads them with Gemini Vision.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Built-In Fact Checking',
    description: 'Every extracted data point is cross-verified through Perplexity before it reaches you. No hallucinated numbers.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Works on Any Website',
    description: 'No APIs or integrations needed. If you can see it in a browser, Voyance can read and extract from it.',
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    title: 'Voice-First Output',
    description: 'Get spoken briefings from Vera, our AI analyst. Listen to insights on the go instead of reading reports.',
  },
];

export function WhyVoyanceSection() {
  const [inView, setInView] = useState(false);
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

  return (
    <section
      id="why-voyance"
      ref={ref}
      className="py-14 sm:py-18 md:py-24 lg:py-28 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle at 30% 50%, var(--accent), transparent 60%)',
        }}
      />

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
            WHY VOYANCE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ color: 'var(--text-primary)' }}
          >
            Not another chatbot.{' '}
            <span style={{ color: 'var(--accent)' }}>A real research agent.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-base sm:text-lg max-w-[640px] mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Most AI tools answer from memory. Voyance actually opens a browser,
            sees the page, extracts data, and verifies facts — just like an analyst would.
          </motion.p>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="rounded-2xl border overflow-hidden mb-14 sm:mb-20"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-strong)',
          }}
        >
          {/* Table Header */}
          <div
            className="grid grid-cols-[1fr_80px_80px_80px] sm:grid-cols-[1fr_120px_120px_120px] gap-0 border-b"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
          >
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <span
                className="text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
              >
                Capability
              </span>
            </div>
            <div className="px-2 sm:px-4 py-3 sm:py-4 text-center">
              <span
                className="text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
              >
                Manual
              </span>
            </div>
            <div className="px-2 sm:px-4 py-3 sm:py-4 text-center">
              <span
                className="text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
              >
                Chatbots
              </span>
            </div>
            <div className="px-2 sm:px-4 py-3 sm:py-4 text-center">
              <span
                className="text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
              >
                Voyance
              </span>
            </div>
          </div>

          {/* Table Rows */}
          {COMPARISONS.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
              className="grid grid-cols-[1fr_80px_80px_80px] sm:grid-cols-[1fr_120px_120px_120px] gap-0 border-b last:border-b-0"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center">
                <span className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {row.feature}
                </span>
              </div>
              <div className="px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-center">
                {row.manual ? (
                  <Check className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                ) : (
                  <X className="w-4 h-4" style={{ color: 'var(--text-tertiary)', opacity: 0.4 }} />
                )}
              </div>
              <div className="px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-center">
                {row.chatbots ? (
                  <Check className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                ) : (
                  <X className="w-4 h-4" style={{ color: 'var(--text-tertiary)', opacity: 0.4 }} />
                )}
              </div>
              <div className="px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-center">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--accent-glow)' }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Differentiator Cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {DIFFERENTIATORS.map((diff, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              className="rounded-xl p-6 sm:p-7 border transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border)',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}
              >
                {diff.icon}
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {diff.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {diff.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
