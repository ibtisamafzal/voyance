import { motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import { useReduceMotion } from '../hooks/useReduceMotion';

export function LandingHero() {
  const reduceMotion = useReduceMotion();
  const anim = reduceMotion
    ? { initial: {}, animate: {} }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

  const words1 = ['Research', 'the', 'web', 'the', 'way'];
  const words2 = ['an', 'analyst', 'does'];

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Grid background pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.14 }}>
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="var(--text-tertiary)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
        {/* Fade-out mask at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[40%]"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}
        />
      </div>

      {/* Radial glow — top-right accent + bottom-left vera */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-24 right-[10%] w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 65%)',
            filter: 'blur(100px)',
            opacity: 0.12,
          }}
        />
        <div
          className="absolute top-[40%] -left-16 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--vera-voice) 0%, transparent 65%)',
            filter: 'blur(100px)',
            opacity: 0.08,
          }}
        />
        {/* Center glow */}
        <div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, var(--accent) 0%, transparent 70%)',
            filter: 'blur(120px)',
            opacity: 0.1,
          }}
        />
      </div>

      {/* ── Hero top ── */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 text-center">
        {/* Badge */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, scale: 0.96 }}
          animate={reduceMotion ? {} : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3, type: 'spring' }}
        >
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-8"
            style={{
              backgroundColor: 'var(--accent-glow)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-pill-border)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
            }}
          >
            AI-Powered Competitive Intelligence
          </span>
        </motion.div>

        {/* Headline — word-by-word spring animation */}
        <h1 className="mb-6 overflow-hidden">
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
            {words1.map((word, i) => (
              <motion.span
                key={i}
                initial={reduceMotion ? {} : { y: 100, opacity: 0 }}
                animate={reduceMotion ? {} : { y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
                style={{ color: 'var(--text-primary)', display: 'inline-block' }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
            {words2.map((word, i) => (
              <motion.span
                key={i}
                initial={reduceMotion ? {} : { y: 100, opacity: 0 }}
                animate={reduceMotion ? {} : { y: 0, opacity: 1 }}
                transition={{ delay: 0.45 + i * 0.05, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
                style={{ color: 'var(--accent)', display: 'inline-block' }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="text-base sm:text-lg max-w-[620px] mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Voyance sends an AI agent to browse live websites, extract structured data
          with vision, verify every fact, and deliver spoken briefings — in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, scale: 0.95 }}
          animate={reduceMotion ? {} : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.35, type: 'spring', damping: 20, stiffness: 300 }}
          className="flex flex-wrap justify-center gap-4 mb-6"
        >
          <Link
            to="/research"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-[15px] font-semibold text-white transition-all hover:scale-[1.04] active:scale-[0.97] shadow-lg"
            style={{ backgroundColor: 'var(--accent)', boxShadow: '0 4px 24px var(--accent-glow)' }}
          >
            Start Researching
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-[15px] font-semibold border transition-all hover:scale-[1.04]"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }}
          >
            See How It Works
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="pt-6 flex flex-col items-center gap-1"
        >
          <ChevronDown className="w-5 h-5 animate-bounce" style={{ color: 'var(--text-tertiary)' }} />
        </motion.div>
      </div>
    </section>
  );
}
