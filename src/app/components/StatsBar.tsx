import { motion } from 'motion/react';
import { Search, Eye, Cpu, ShieldCheck, Headphones } from 'lucide-react';
import { useReduceMotion } from '../hooks/useReduceMotion';

const CAPABILITIES = [
  {
    icon: <Search className="w-5 h-5" />,
    title: 'Query Understanding',
    desc: 'Gemini interprets your research intent and builds a multi-step plan automatically.',
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Visual Browsing',
    desc: 'A headless browser captures live screenshots, and Gemini Vision reads them like a human.',
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'Structured Extraction',
    desc: 'Firecrawl and vision work together to pull tables, pricing, and feature data.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Fact Verification',
    desc: 'Key pricing claims are cross-checked through Perplexity for accuracy and confidence scoring.',
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    title: 'Spoken Briefings',
    desc: 'Vera, powered by ElevenLabs, narrates your findings as a polished analyst-grade summary.',
  },
];

export function StatsBar() {
  const reduceMotion = useReduceMotion();

  return (
    <section
      className="border-t"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-14">
        <motion.p
          initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center text-[11px] font-semibold uppercase tracking-wider mb-6 sm:mb-10"
          style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}
        >
          What happens when you hit &ldquo;Research&rdquo;
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
              className="rounded-xl p-5 transition-colors"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}
              >
                {cap.icon}
              </div>
              <h3
                className="text-sm font-semibold mb-1.5"
                style={{ color: 'var(--text-primary)' }}
              >
                {cap.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {cap.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
