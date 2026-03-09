import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'What is Voyance?',
    a: 'Voyance is an AI-powered competitive research agent. It autonomously browses live websites using Gemini Vision, extracts structured data, cross-verifies facts via Perplexity, and delivers results as sortable tables and spoken briefings.',
  },
  {
    q: 'How does Voyance browse the web?',
    a: 'Voyance uses Playwright to visit live websites and capture full-page screenshots. Gemini 2.0 Flash then reads those screenshots like a human analyst — no DOM parsing, no fragile selectors. This works on any site, including SPAs and dynamically-rendered pages.',
  },
  {
    q: 'What data does Voyance extract?',
    a: 'For each competitor or company, Voyance extracts: company name, website URL, pricing tiers, key features, target segment, source URL, and a confidence score. Everything is returned as structured JSON for easy comparison.',
  },
  {
    q: 'How are facts verified?',
    a: 'After extraction, Voyance sends key facts to Perplexity for cross-referencing against the live web. Each result gets a confidence rating: verified, unconfirmed, or low.',
  },
  {
    q: 'What is Vera?',
    a: 'Vera is Voyance\'s voice persona powered by ElevenLabs. After research completes, Vera generates a spoken briefing summarizing the competitive landscape — you can listen to it directly in the app.',
  },
  {
    q: 'Can I redirect the agent mid-research?',
    a: 'Yes. Voyance supports voice barge-in — you can interrupt Vera mid-session with a new instruction, and the agent replans within seconds. You can also type redirect instructions.',
  },
  {
    q: 'What technologies power Voyance?',
    a: 'Gemini 2.0 Flash (intent + vision), Google ADK (agent orchestration), Playwright (headless browsing), Firecrawl (fast extraction fallback), Perplexity (fact verification), ElevenLabs (Vera TTS), FastAPI + Cloud Run (backend), React + Vite (frontend).',
  },
  {
    q: 'Is Voyance free to use?',
    a: 'Yes. Voyance was built for the Gemini Live Agent Challenge 2026 and is fully open source under MIT license. You can self-host with your own API keys.',
  },
  {
    q: 'Can I export the research results?',
    a: 'Yes. Results can be exported as CSV or full HTML reports directly from the output table. You can also sort by any column and filter by confidence level.',
  },
  {
    q: 'How can I contribute or report issues?',
    a: 'Visit our Contact page to reach out with feedback or bug reports. You can also open issues or pull requests directly on GitHub.',
  },
];

const FAQ_TITLE_WORDS = ['Frequently', 'Asked', 'Questions'];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <motion.div
      style={{ backgroundColor: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <section className="pt-12 sm:pt-16 pb-10 sm:pb-12 text-center">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 md:px-10 space-y-4">
          <h1 className="overflow-hidden">
            <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
              {FAQ_TITLE_WORDS.map((word, i) => (
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
            className="text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            Everything you need to know about the Voyance platform.
          </motion.p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="pb-24 sm:pb-32">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.04, duration: 0.3, type: 'spring', damping: 20, stiffness: 300 }}
                >
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between py-5 sm:py-6 text-left gap-4"
                    style={{ background: 'none', border: 'none' }}
                  >
                    <span
                      className="text-sm sm:text-base font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.q}
                    </span>
                    <ChevronDown
                      className="w-5 h-5 shrink-0 transition-transform duration-300"
                      style={{
                        color: isOpen ? 'var(--accent)' : 'var(--text-tertiary)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? '300px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <p
                      className="pb-5 sm:pb-6 text-sm leading-relaxed pr-8"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.a}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
