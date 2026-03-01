import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Github, FileText } from 'lucide-react';

export function CommunitySection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const credits = ['Gemini Live API', 'Google ADK', 'ElevenLabs', 'Firecrawl', 'Perplexity'];

  return (
    <section
      id="community"
      ref={ref}
      className="py-16 sm:py-20 md:py-28 lg:py-36"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-[800px] mx-auto px-4 sm:px-5 md:px-10 text-center">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 mb-12"
        >
          <h2 style={{ color: 'var(--text-primary)' }}>
            Voyance is open source.
          </h2>
          <p className="text-lg max-w-[600px] mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Built during Gemini Live Agent Challenge 2026. All code on GitHub. All credits disclosed.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-12"
        >
          <a
            href="https://github.com/ibtisamafzal/voyance"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-[10px] font-medium border transition-all hover:scale-105"
            style={{
              borderColor: 'var(--border-strong)',
              color: 'var(--text-primary)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
          <a
            href="https://github.com/ibtisamafzal/voyance#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-[10px] font-medium border transition-all hover:scale-105"
            style={{
              borderColor: 'var(--border-strong)',
              color: 'var(--text-primary)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FileText className="w-5 h-5" />
            Read the Docs
          </a>
        </motion.div>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <div
            className="text-xs uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}
          >
            POWERED BY
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {credits.map((credit, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                className="px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              >
                {credit}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}