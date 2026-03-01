import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Target, Search, Briefcase } from 'lucide-react';

interface UseCase {
  icon: React.ReactNode;
  stat: string;
  title: string;
  description: string;
  badge: string;
  iconColor: string;
}

export function ImpactSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const useCases: UseCase[] = [
    {
      icon: <Target className="w-8 h-8" />,
      stat: '5 competitors',
      title: 'Researched in 90 seconds.',
      description: 'A SaaS founder gets pricing, features, and positioning for 5 rivals before their investor meeting.',
      badge: 'STARTUP FOUNDERS',
      iconColor: '#3B82F6',
    },
    {
      icon: <Search className="w-8 h-8" />,
      stat: '47 data points',
      title: 'Structured and verified.',
      description: 'Management consultants build industry benchmarks with zero manual browsing or copy-paste.',
      badge: 'CONSULTANTS',
      iconColor: '#818CF8',
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      stat: '< 3 minutes',
      title: 'Full landscape map.',
      description: 'Investment analysts map competitive landscapes for entire portfolio verticals, on demand.',
      badge: 'INVESTMENT ANALYSTS',
      iconColor: '#10D97A',
    },
  ];

  const techStack = ['Gemini Live API', 'Google ADK', 'Cloud Run', 'ElevenLabs', 'Perplexity'];

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 md:py-28 lg:py-36 relative overflow-hidden"
      style={{ backgroundColor: '#060B14' }}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle at center top, var(--accent), transparent 60%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 md:px-10 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#3B82F6',
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
            style={{ color: '#F1F5F9' }}
          >
            Hours of research. Seconds to deliver.
          </motion.h2>
        </div>

        {/* Use Case Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {useCases.map((useCase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              className="rounded-2xl sm:rounded-[20px] p-6 sm:p-7 md:p-9 space-y-4 sm:space-y-6"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Icon */}
              <div style={{ color: useCase.iconColor }}>
                {useCase.icon}
              </div>

              {/* Stat */}
              <div
                className="font-bold text-3xl sm:text-4xl md:text-[42px] leading-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: useCase.iconColor,
                }}
              >
                {useCase.stat}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold leading-tight" style={{ color: '#F1F5F9' }}>
                {useCase.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                {useCase.description}
              </p>

              {/* Badge */}
              <div
                className="inline-block px-4 py-2 rounded-full text-xs uppercase"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#94A3B8',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                }}
              >
                {useCase.badge}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div
            className="text-xs uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-mono)', color: '#94A3B8' }}
          >
            BUILT ON
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.7 + i * 0.05, duration: 0.3 }}
                className="px-4 py-2 rounded-full text-xs transition-all hover:border-opacity-100"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  color: '#94A3B8',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
                }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}