import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Target, BarChart3, Briefcase, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

const USE_CASES = [
  {
    icon: <Target className="w-5 h-5" />,
    persona: 'Startup Founders',
    headline: '5 competitors researched in 90 seconds',
    description:
      'Get pricing, features, and positioning for every rival — ready before your next investor meeting.',
    color: 'var(--accent)',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    persona: 'Consultants',
    headline: '47 data points extracted and verified',
    description:
      'Build industry benchmarks automatically — no manual browsing or copy-paste required.',
    color: 'var(--vera-voice)',
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    persona: 'Investment Analysts',
    headline: 'Full landscape map in under 3 minutes',
    description:
      'Map competitive landscapes for entire portfolio verticals, on demand, with cited sources.',
    color: 'var(--success)',
  },
];

const STATS = [
  { icon: <Clock className="w-4 h-4" />, value: '< 90s', label: 'Per research' },
  { icon: <CheckCircle2 className="w-4 h-4" />, value: '98%', label: 'Accuracy' },
  { icon: <TrendingUp className="w-4 h-4" />, value: '10×', label: 'Faster than manual' },
];

export function ImpactSection() {
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
      ref={ref}
      className="py-14 sm:py-18 md:py-24 lg:py-28 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
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
            REAL IMPACT
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ color: 'var(--text-primary)' }}
          >
            Hours of research. Seconds to deliver.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-base sm:text-lg max-w-[600px] mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            See how real professionals use Voyance to accelerate their research workflows.
          </motion.p>
        </div>

        {/* Use case cards — stacked rows */}
        <div className="space-y-4 mb-12 sm:mb-16">
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                borderLeft: `3px solid ${uc.color}`,
              }}
            >
              {/* Icon + persona */}
              <div className="flex items-center gap-3 flex-shrink-0 sm:w-[180px]">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${uc.color}15`, color: uc.color }}
                >
                  {uc.icon}
                </div>
                <span
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: uc.color, fontFamily: 'var(--font-mono)' }}
                >
                  {uc.persona}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {uc.headline}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {uc.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid grid-cols-3 gap-3 sm:gap-6 max-w-[640px] mx-auto"
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 sm:p-6 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
              }}
            >
              <div className="flex justify-center mb-3" style={{ color: 'var(--accent)' }}>
                {stat.icon}
              </div>
              <div
                className="text-xl sm:text-2xl font-bold mb-1"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
              >
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}