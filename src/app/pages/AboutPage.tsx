import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Cpu, Lock, Bot, Eye, Brain, Volume2, Shield, Zap, Database } from 'lucide-react';

const PILLARS = [
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Our Mission',
    description:
      'To democratize competitive research by automating the entire browse-extract-verify-narrate pipeline — so anyone can get analyst-grade intelligence in seconds.',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'How It Works',
    description:
      "Voyance's agentic loop uses Gemini 2.0 Flash for intent understanding and visual navigation, Playwright for live browsing, Firecrawl for fast extraction, and Perplexity for fact verification.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Open & Transparent',
    description:
      'Built for the Gemini Live Agent Challenge 2026. All source code is on GitHub. Every API and model used is disclosed.',
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: 'AI-Powered',
    description:
      "Gemini powers intent + vision, Google ADK orchestrates the agent loop, ElevenLabs powers Vera's voice briefings, and Perplexity + Firecrawl power research workflows.",
  },
];

const TECH_STACK = [
  { category: '🧠 Intelligence', items: 'Gemini 2.0 Flash, Google ADK, Perplexity' },
  { category: '🔧 App Stack', items: 'React 18, Vite, Tailwind CSS v4, FastAPI, Cloud Run' },
  { category: '🎙️ AI + Voice', items: 'ElevenLabs (Vera TTS), Firecrawl, Playwright' },
];

const TITLE_WORDS = ['About', 'Voyance'];

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      style={{ backgroundColor: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-16 text-center">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-10 space-y-5">
          <h1 className="overflow-hidden">
            <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
              {TITLE_WORDS.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
                  style={{ color: 'var(--text-primary)', display: 'inline-block' }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-base sm:text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            An AI-powered research agent that sees the web like an analyst does —
            delivering verified, structured competitive intelligence with voice briefings.
          </motion.p>
        </div>
      </section>

      {/* Pillars */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
                className="rounded-2xl p-6 sm:p-8 border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}
                >
                  {pillar.icon}
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-10">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
            className="text-center mb-10"
            style={{ color: 'var(--text-primary)' }}
          >
            Verified Tech Stack In Use
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TECH_STACK.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4, type: 'spring', damping: 20, stiffness: 300 }}
                className="rounded-xl p-5 border text-center"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="text-xl mb-2">{group.category.split(' ')[0]}</div>
                <h4
                  className="font-semibold text-sm mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {group.category.split(' ').slice(1).join(' ')}
                </h4>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
                >
                  {group.items}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
