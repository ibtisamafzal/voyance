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
      ref={ref}
      className="py-24 md:py-32"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        {/* Section Header */}
        <div className="text-center mb-24 space-y-6">
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
            GCP-native. Production-grade.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-lg max-w-[700px] mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Serverless infrastructure orchestrating vision, voice, and verification in real-time.
          </motion.p>
        </div>

        {/* GCP Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-16"
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
                      01 · Input Layer
                    </div>
                  </div>
                </div>

                <ArchBox icon={<Mic className="w-5 h-5" />} label="User Voice" color="#94A3B8" description="Natural language query" />
                <FlowArrow />
                <ArchBox icon={<Brain className="w-5 h-5" />} label="Gemini Live API" color="#3B82F6" description="Realtime STT + LLM" isKey />
                <FlowArrow />
                <ArchBox icon={<Brain className="w-5 h-5" />} label="ADK Agent Loop" color="#3B82F6" description="Multi-step orchestration" />
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
                      02 · Processing Engine
                    </div>
                  </div>
                </div>

                <ArchBox icon={<Globe className="w-5 h-5" />} label="Playwright Browser" color="#94A3B8" description="Headless navigation" />
                <ArchBox icon={<Zap className="w-5 h-5" />} label="Firecrawl API" color="#F59E0B" description="Web scraping" />
                <ArchBox icon={<Eye className="w-5 h-5" />} label="Gemini Vision" color="#3B82F6" description="Screenshot analysis" />
                <FlowArrow />
                <ArchBox icon={<CheckCircle className="w-5 h-5" />} label="Perplexity Verify" color="#10D97A" description="Fact checking" />
                <ArchBox icon={<Database className="w-5 h-5" />} label="Firestore Session" color="#3B82F6" description="State persistence" />
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
                      03 · Output Layer
                    </div>
                  </div>
                </div>

                <ArchBox icon={<FileJson className="w-5 h-5" />} label="JSON Report" color="#10D97A" description="Structured data" />
                <FlowArrow />
                <ArchBox icon={<Volume2 className="w-5 h-5" />} label="ElevenLabs Vera" color="#818CF8" description="Text-to-speech" />
                <FlowArrow />
                <ArchBox icon={<Monitor className="w-5 h-5" />} label="Frontend Display" color="#94A3B8" description="User interface" />
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

        {/* Architecture Diagram - Mobile/Tablet */}
        <div className="lg:hidden space-y-10 max-w-[600px] mx-auto">
          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
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
                01 · Input Layer
              </div>
            </div>
            <ArchBox icon={<Mic className="w-5 h-5" />} label="User Voice" color="#94A3B8" description="Natural language query" />
            <ArchBox icon={<Brain className="w-5 h-5" />} label="Gemini Live API" color="#3B82F6" description="Realtime STT + LLM" isKey />
            <ArchBox icon={<Brain className="w-5 h-5" />} label="ADK Agent Loop" color="#3B82F6" description="Multi-step orchestration" />
          </motion.div>

          <div className="flex justify-center">
            <ArrowRight className="w-8 h-8" style={{ color: 'var(--accent)', opacity: 0.4 }} />
          </div>

          {/* Processing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-6"
          >
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
                02 · Processing Engine
              </div>
            </div>
            <ArchBox icon={<Globe className="w-5 h-5" />} label="Playwright Browser" color="#94A3B8" description="Headless navigation" />
            <ArchBox icon={<Zap className="w-5 h-5" />} label="Firecrawl API" color="#F59E0B" description="Web scraping" />
            <ArchBox icon={<Eye className="w-5 h-5" />} label="Gemini Vision" color="#3B82F6" description="Screenshot analysis" />
            <ArchBox icon={<CheckCircle className="w-5 h-5" />} label="Perplexity Verify" color="#10D97A" description="Fact checking" />
            <ArchBox icon={<Database className="w-5 h-5" />} label="Firestore Session" color="#3B82F6" description="State persistence" />
          </motion.div>

          <div className="flex justify-center">
            <ArrowRight className="w-8 h-8" style={{ color: 'var(--accent)', opacity: 0.4 }} />
          </div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-6"
          >
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
                03 · Output Layer
              </div>
            </div>
            <ArchBox icon={<FileJson className="w-5 h-5" />} label="JSON Report" color="#10D97A" description="Structured data" />
            <ArchBox icon={<Volume2 className="w-5 h-5" />} label="ElevenLabs Vera" color="#818CF8" description="Text-to-speech" />
            <ArchBox icon={<Monitor className="w-5 h-5" />} label="Frontend Display" color="#94A3B8" description="User interface" />
          </motion.div>
        </div>

        {/* Key Technologies Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-24 pt-16 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="text-center mb-10">
            <div
              className="text-xs uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}
            >
              CORE TECHNOLOGIES
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
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
}

function ArchBox({ icon, label, color, description, isKey }: ArchBoxProps) {
  return (
    <motion.div
      className="relative flex items-start gap-4 px-6 py-5 rounded-xl border transition-all hover:scale-[1.02]"
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
        className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
        style={{
          backgroundColor: `${color}15`,
          color: color,
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="font-semibold text-sm mb-1"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
        >
          {label}
        </div>
        {description && (
          <div className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
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
