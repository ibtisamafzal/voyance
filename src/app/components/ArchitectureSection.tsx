import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Mic, Brain, Globe, Zap, Eye, CheckCircle, Database, FileJson, Volume2, Monitor, ArrowRight } from 'lucide-react';

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
      className="py-16 sm:py-20 md:py-24 lg:py-32"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 md:px-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-24 space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full"
            style={{
              backgroundColor: 'var(--accent-glow)',
              border: '1px solid rgba(10, 95, 232, 0.3)',
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
            className="text-lg max-w-[700px] mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Your query flows through three layers: input (voice or text), processing (browser + AI vision + verification), and output (structured report + Vera’s spoken briefing). All running on Google Cloud Run.
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
            className="px-6 py-3 rounded-full"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              boxShadow: '0 0 0 4px var(--accent-glow)',
            }}
          >
            ☁️ HOSTED ON GOOGLE CLOUD RUN
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
                      border: '1px solid rgba(10, 95, 232, 0.3)',
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

                <ArchBox icon={<Mic className="w-5 h-5" />} label="You type or speak" color="#94A3B8" description="e.g. “Compare top 5 CRM tools” — text or voice in the hero" />
                <FlowArrow />
                <ArchBox icon={<Brain className="w-5 h-5" />} label="Gemini 2.0 Flash" color="#3B82F6" description="Understands your intent and optional voice transcription" isKey />
                <FlowArrow />
                <ArchBox icon={<Brain className="w-5 h-5" />} label="ADK Agent Loop" color="#3B82F6" description="Plans which sites to visit and what to extract" />
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
                      style={{ color: '#F59E0B', fontFamily: 'var(--font-mono)' }}
                    >
                      02 · How we research the web
                    </div>
                  </div>
                </div>

                <ArchBox icon={<Globe className="w-5 h-5" />} label="Playwright Browser" color="#94A3B8" description="Visits live sites and captures screenshots (no DOM access)" />
                <ArchBox icon={<Zap className="w-5 h-5" />} label="Firecrawl API" color="#F59E0B" description="Fast structured extraction when the page allows it" />
                <ArchBox icon={<Eye className="w-5 h-5" />} label="Gemini Vision" color="#3B82F6" description="Reads screenshots like a human — works on any site" />
                <FlowArrow />
                <ArchBox icon={<CheckCircle className="w-5 h-5" />} label="Perplexity Verify" color="#10D97A" description="Cross-checks key facts against the live web" />
                <ArchBox icon={<Database className="w-5 h-5" />} label="Firestore Session" color="#3B82F6" description="Stores session state and results" />
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
                      style={{ color: '#10D97A', fontFamily: 'var(--font-mono)' }}
                    >
                      03 · What you get
                    </div>
                  </div>
                </div>

                <ArchBox icon={<FileJson className="w-5 h-5" />} label="Structured JSON" color="#10D97A" description="Comparison table: company, pricing, features, confidence" />
                <FlowArrow />
                <ArchBox icon={<Volume2 className="w-5 h-5" />} label="ElevenLabs Vera" color="#818CF8" description="Spoken briefing you can listen to in the app" />
                <FlowArrow />
                <ArchBox icon={<Monitor className="w-5 h-5" />} label="This app" color="#94A3B8" description="Sort, export CSV/HTML, view sources, replay Vera" />
              </motion.div>
            </div>

            {/* Connecting Flow Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.3 }} />
                  <stop offset="50%" style={{ stopColor: '#F59E0B', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#10D97A', stopOpacity: 0.3 }} />
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

        {/* Architecture Diagram - Mobile/Tablet: layer cards with step flow */}
        <div className="lg:hidden max-w-[600px] mx-auto space-y-6">
          {/* Step indicator: 1 — 2 — 3 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center justify-center gap-2 sm:gap-4"
          >
            {[
              { step: 1, label: 'Input', color: 'var(--accent)' },
              { step: 2, label: 'Process', color: '#F59E0B' },
              { step: 3, label: 'Output', color: '#10D97A' },
            ].map(({ step, label, color }) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full border-2 font-bold text-xs"
                  style={{ borderColor: color, color, fontFamily: 'var(--font-mono)' }}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className="w-6 h-0.5 rounded"
                    style={{ backgroundColor: 'var(--border-strong)' }}
                  />
                )}
              </div>
            ))}
          </motion.div>

          {/* Layer 1: Input — card with accent strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: 0.4, duration: 0.5 }}
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
                backgroundColor: 'var(--accent-glow)',
                borderBottom: '1px solid rgba(10, 95, 232, 0.2)',
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
              >
                01 · Your input
              </span>
            </div>
            <div className="p-4 space-y-3">
              <ArchBox compact icon={<Mic className="w-4 h-4" />} label="You type or speak" color="#94A3B8" description="e.g. “Compare top 5 CRM tools” — text or voice in the hero" />
              <ArchBox compact icon={<Brain className="w-4 h-4" />} label="Gemini 2.0 Flash" color="#3B82F6" description="Understands your intent and optional voice transcription" isKey />
              <ArchBox compact icon={<Brain className="w-4 h-4" />} label="ADK Agent Loop" color="#3B82F6" description="Plans which sites to visit and what to extract" />
            </div>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.55, duration: 0.3 }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-elevated)', border: '2px solid var(--border-strong)' }}
            >
              <ArrowRight className="w-5 h-5 rotate-90" style={{ color: 'var(--accent)', opacity: 0.8 }} />
            </motion.div>
          </div>

          {/* Layer 2: Processing — card with orange strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: 0.55, duration: 0.5 }}
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
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: '#F59E0B', fontFamily: 'var(--font-mono)' }}
              >
                02 · How we research the web
              </span>
            </div>
            <div className="p-4 space-y-3">
              <ArchBox compact icon={<Globe className="w-4 h-4" />} label="Playwright Browser" color="#94A3B8" description="Visits live sites and captures screenshots (no DOM access)" />
              <ArchBox compact icon={<Zap className="w-4 h-4" />} label="Firecrawl API" color="#F59E0B" description="Fast structured extraction when the page allows it" />
              <ArchBox compact icon={<Eye className="w-4 h-4" />} label="Gemini Vision" color="#3B82F6" description="Reads screenshots like a human — works on any site" />
              <ArchBox compact icon={<CheckCircle className="w-4 h-4" />} label="Perplexity Verify" color="#10D97A" description="Cross-checks key facts against the live web" />
              <ArchBox compact icon={<Database className="w-4 h-4" />} label="Firestore Session" color="#3B82F6" description="Stores session state and results" />
            </div>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-elevated)', border: '2px solid var(--border-strong)' }}
            >
              <ArrowRight className="w-5 h-5 rotate-90" style={{ color: '#F59E0B', opacity: 0.8 }} />
            </motion.div>
          </div>

          {/* Layer 3: Output — card with green strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: 0.7, duration: 0.5 }}
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
                backgroundColor: 'rgba(16, 217, 122, 0.1)',
                borderBottom: '1px solid rgba(16, 217, 122, 0.25)',
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: '#10D97A', fontFamily: 'var(--font-mono)' }}
              >
                03 · What you get
              </span>
            </div>
            <div className="p-4 space-y-3">
              <ArchBox compact icon={<FileJson className="w-4 h-4" />} label="Structured JSON" color="#10D97A" description="Comparison table: company, pricing, features, confidence" />
              <ArchBox compact icon={<Volume2 className="w-4 h-4" />} label="ElevenLabs Vera" color="#818CF8" description="Spoken briefing you can listen to in the app" />
              <ArchBox compact icon={<Monitor className="w-4 h-4" />} label="This app" color="#94A3B8" description="Sort, export CSV/HTML, view sources, replay Vera" />
            </div>
          </motion.div>
        </div>

        {/* Key Technologies Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 sm:mt-20 md:mt-24 pt-10 sm:pt-14 md:pt-16 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="text-center mb-10">
            <div
              className="text-xs uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
            >
              CORE TECHNOLOGIES
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { name: 'Gemini 2.0', type: 'LLM' },
              { name: 'Google ADK', type: 'Orchestration' },
              { name: 'Playwright', type: 'Browser' },
              { name: 'Firecrawl', type: 'Scraping' },
              { name: 'Perplexity', type: 'Verification' },
              { name: 'ElevenLabs', type: 'Voice' },
              { name: 'Firestore', type: 'Database' },
              { name: 'Cloud Run', type: 'Hosting' },
            ].map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.9 + i * 0.05, duration: 0.3 }}
                className="px-5 py-3 rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-strong)',
                }}
              >
                <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  {tech.name}
                </div>
                <div
                  className="text-xs"
                  style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
                >
                  {tech.type}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
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
