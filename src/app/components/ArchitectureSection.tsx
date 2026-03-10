import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Brain, Globe, Zap, Eye, CheckCircle, Database, FileJson, Volume2, Monitor, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export function ArchitectureSection() {
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

  return (
    <section
      id="architecture"
      ref={ref}
      className="py-14 sm:py-18 md:py-24 lg:py-28"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 space-y-4 sm:space-y-6">
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
            SYSTEM ARCHITECTURE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            How Voyance works end-to-end
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-base sm:text-lg max-w-[700px] mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Your query flows through three layers: input, processing (browser + AI vision + verification), and output (structured report + Vera's spoken briefing).
          </motion.p>
        </div>

        {/* GCP Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-10 sm:mb-16"
        >
          <div
            className="px-5 py-2.5 rounded-full border"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--accent-pill-border)',
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            Hosted on Google Cloud Run
          </div>
        </motion.div>

        {/* Architecture Diagram - Desktop */}
        <div className="hidden lg:block">
          <div className="relative max-w-[1200px] mx-auto">
            <div className="grid grid-cols-3 gap-12 xl:gap-20">
              {/* Zone 1 - Input */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-8"
              >
                <div className="mb-10">
                  <div
                    className="inline-block px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: 'var(--accent-glow)',
                      border: '1px solid var(--accent-pill-border)',
                    }}
                  >
                    <div
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                    >
                      01 · Your input
                    </div>
                  </div>
                </div>

                <ArchBox icon={<Mic className="w-5 h-5" />} label="You type or speak" color="var(--text-secondary)" description="e.g. &#34;Compare top 5 CRM tools&#34; — text or voice in the hero" />
                <FlowArrow />
                <ArchBox icon={<Brain className="w-5 h-5" />} label="Gemini 2.0 Flash" color="var(--accent)" description="Understands your intent and optional voice transcription" isKey />
                <FlowArrow />
                <ArchBox icon={<Brain className="w-5 h-5" />} label="ADK Agent Loop" color="var(--accent)" description="Plans which sites to visit and what to extract" />
              </motion.div>

              {/* Zone 2 - Processing */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-8"
              >
                <div className="mb-10">
                  <div
                    className="inline-block px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    <div
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--warning)', fontFamily: 'var(--font-mono)' }}
                    >
                      02 · How we research the web
                    </div>
                  </div>
                </div>

                <ArchBox icon={<Globe className="w-5 h-5" />} label="Playwright Browser" color="var(--text-secondary)" description="Visits live sites and captures screenshots (no DOM access)" />
                <ArchBox icon={<Zap className="w-5 h-5" />} label="Firecrawl API" color="var(--warning)" description="Fast structured extraction when the page allows it" />
                <ArchBox icon={<Eye className="w-5 h-5" />} label="Gemini Vision" color="var(--accent)" description="Reads screenshots like a human — works on any site" />
                <FlowArrow />
                <ArchBox icon={<CheckCircle className="w-5 h-5" />} label="Perplexity Verify" color="var(--success)" description="Cross-checks key facts against the live web" />
                <ArchBox icon={<Database className="w-5 h-5" />} label="Firestore Session" color="var(--accent)" description="Stores session state and results" />
              </motion.div>

              {/* Zone 3 - Output */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-8"
              >
                <div className="mb-10">
                  <div
                    className="inline-block px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: 'rgba(16, 217, 122, 0.1)',
                      border: '1px solid rgba(16, 217, 122, 0.3)',
                    }}
                  >
                    <div
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}
                    >
                      03 · What you get
                    </div>
                  </div>
                </div>

                <ArchBox icon={<FileJson className="w-5 h-5" />} label="Structured JSON" color="var(--success)" description="Comparison table: company, pricing, features, confidence" />
                <FlowArrow />
                <ArchBox icon={<Volume2 className="w-5 h-5" />} label="ElevenLabs Vera" color="var(--vera-voice)" description="Spoken briefing you can listen to in the app" />
                <FlowArrow />
                <ArchBox icon={<Monitor className="w-5 h-5" />} label="This app" color="var(--text-secondary)" description="Sort, export CSV/HTML, view sources, replay Vera" />
              </motion.div>
            </div>

            {/* Connecting Flow Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.3 }} />
                  <stop offset="50%" style={{ stopColor: 'var(--warning)', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: 'var(--success)', stopOpacity: 0.3 }} />
                </linearGradient>
              </defs>
              <motion.line
                x1="33%"
                y1="50%"
                x2="67%"
                y2="50%"
                stroke="url(#flowGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.4 } : { opacity: 0 }}
                transition={{ delay: 1, duration: 1.5, ease: 'easeInOut' }}
              />
            </svg>
          </div>
        </div>

        {/* Architecture Diagram - Mobile/Tablet: swipeable carousel */}
        <MobileArchCarousel inView={inView} />
      </div>
    </section>
  );
}

const CAROUSEL_CARDS = [
  {
    label: '01 · Your input',
    headerBg: 'var(--accent-glow)',
    headerBorder: '1px solid var(--accent-pill-border)',
    labelColor: 'var(--accent)',
    items: [
      { icon: <Mic className="w-4 h-4" />, label: 'You type or speak', color: 'var(--text-secondary)', description: 'e.g. "Compare top 5 CRM tools" — text or voice in the hero' },
      { icon: <Brain className="w-4 h-4" />, label: 'Gemini 2.0 Flash', color: 'var(--accent)', description: 'Understands your intent and optional voice transcription', isKey: true },
      { icon: <Brain className="w-4 h-4" />, label: 'ADK Agent Loop', color: 'var(--accent)', description: 'Plans which sites to visit and what to extract' },
    ],
  },
  {
    label: '02 · How we research the web',
    headerBg: 'rgba(245, 158, 11, 0.12)',
    headerBorder: '1px solid rgba(245, 158, 11, 0.25)',
    labelColor: 'var(--warning)',
    items: [
      { icon: <Globe className="w-4 h-4" />, label: 'Playwright Browser', color: 'var(--text-secondary)', description: 'Visits live sites and captures screenshots (no DOM access)' },
      { icon: <Zap className="w-4 h-4" />, label: 'Firecrawl API', color: 'var(--warning)', description: 'Fast structured extraction when the page allows it' },
      { icon: <Eye className="w-4 h-4" />, label: 'Gemini Vision', color: 'var(--accent)', description: 'Reads screenshots like a human — works on any site' },
      { icon: <CheckCircle className="w-4 h-4" />, label: 'Perplexity Verify', color: 'var(--success)', description: 'Cross-checks key facts against the live web' },
      { icon: <Database className="w-4 h-4" />, label: 'Firestore Session', color: 'var(--accent)', description: 'Stores session state and results' },
    ],
  },
  {
    label: '03 · What you get',
    headerBg: 'rgba(16, 217, 122, 0.1)',
    headerBorder: '1px solid rgba(16, 217, 122, 0.25)',
    labelColor: 'var(--success)',
    items: [
      { icon: <FileJson className="w-4 h-4" />, label: 'Structured JSON', color: 'var(--success)', description: 'Comparison table: company, pricing, features, confidence' },
      { icon: <Volume2 className="w-4 h-4" />, label: 'ElevenLabs Vera', color: 'var(--vera-voice)', description: 'Spoken briefing you can listen to in the app' },
      { icon: <Monitor className="w-4 h-4" />, label: 'This app', color: 'var(--text-secondary)', description: 'Sort, export CSV/HTML, view sources, replay Vera' },
    ],
  },
];

function MobileArchCarousel({ inView }: { inView: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  }, [activeIndex]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    if (activeIndex < CAROUSEL_CARDS.length - 1) goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  const card = CAROUSEL_CARDS[activeIndex];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <div className="lg:hidden max-w-[600px] mx-auto">
      {/* Step indicator dots + arrows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex items-center justify-center gap-4 mb-6"
      >
        <button
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="w-9 h-9 rounded-full flex items-center justify-center border transition-all disabled:opacity-30"
          style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {CAROUSEL_CARDS.map((c, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="flex items-center gap-2"
            aria-label={`Go to step ${i + 1}`}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full border-2 font-bold text-xs transition-all"
              style={{
                borderColor: i === activeIndex ? c.labelColor : 'var(--border-strong)',
                color: i === activeIndex ? c.labelColor : 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
                backgroundColor: i === activeIndex ? `${c.labelColor}15` : 'transparent',
              }}
            >
              {i + 1}
            </div>
          </button>
        ))}

        <button
          onClick={goNext}
          disabled={activeIndex === CAROUSEL_CARDS.length - 1}
          className="w-9 h-9 rounded-full flex items-center justify-center border transition-all disabled:opacity-30"
          style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}
          aria-label="Next card"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Swipeable card area */}
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ minHeight: 280 }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-strong)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{
                backgroundColor: card.headerBg,
                borderBottom: card.headerBorder,
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: card.labelColor, fontFamily: 'var(--font-mono)' }}
              >
                {card.label}
              </span>
            </div>
            <div className="p-4 space-y-3">
              {card.items.map((item, j) => (
                <ArchBox
                  key={j}
                  compact
                  icon={item.icon}
                  label={item.label}
                  color={item.color}
                  description={item.description}
                  isKey={item.isKey}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Swipe hint */}
      <p className="text-center mt-4 text-[11px]" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        Swipe or tap to navigate
      </p>
    </div>
  );
}

interface ArchBoxProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  description?: string;
  isKey?: boolean;
  compact?: boolean;
}

function ArchBox({ icon, label, color, description, isKey, compact }: ArchBoxProps) {
  return (
    <motion.div
      className={`relative flex items-start gap-3 sm:gap-4 rounded-xl border transition-all ${compact ? 'px-4 py-3' : 'px-6 py-5'} hover:scale-[1.02]`}
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-strong)',
      }}
      whileHover={{
        borderColor: color,
        boxShadow: `0 0 0 1px ${color}40`,
      }}
    >
      {isKey && (
        <div
          className="absolute -top-2 -right-2 px-2.5 py-1 rounded-md text-[10px] font-bold shadow-lg"
          style={{
            backgroundColor: color,
            color: 'white',
            fontFamily: 'var(--font-mono)',
          }}
        >
          KEY
        </div>
      )}
      <div
        className={`flex items-center justify-center rounded-lg flex-shrink-0 ${compact ? 'w-9 h-9' : 'w-10 h-10'}`}
        style={{
          backgroundColor: `${color}15`,
          color: color,
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`font-semibold mb-0.5 sm:mb-1 ${compact ? 'text-xs' : 'text-sm'}`}
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
        >
          {label}
        </div>
        {description && (
          <div className={`leading-relaxed ${compact ? 'text-[11px]' : 'text-xs'}`} style={{ color: 'var(--text-secondary)' }}>
            {description}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center py-2">
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <div className="w-px h-6" style={{ backgroundColor: 'var(--accent)' }} />
        <div
          className="w-2 h-2 rotate-45 border-r-2 border-b-2"
          style={{ borderColor: 'var(--accent)' }}
        />
      </motion.div>
    </div>
  );
}
