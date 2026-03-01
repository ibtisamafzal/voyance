import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Eye, Zap, Search, Brain, Volume2 } from 'lucide-react';

interface PipelineNode {
  number: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export function PipelineSection() {
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

  const nodes: PipelineNode[] = [
    {
      number: '01',
      label: 'CAPTURE',
      icon: <Camera className="w-6 h-6" />,
      description: 'Playwright headless browser takes screenshot',
    },
    {
      number: '02',
      label: 'INTERPRET',
      icon: <Eye className="w-6 h-6" />,
      description: 'Gemini 2.0 Flash reads pixels — zero DOM',
    },
    {
      number: '03',
      label: 'EXTRACT',
      icon: <Zap className="w-6 h-6" />,
      description: 'Firecrawl fast-path OR Gemini vision fallback',
    },
    {
      number: '04',
      label: 'VERIFY',
      icon: <Search className="w-6 h-6" />,
      description: 'Perplexity grounds key facts live',
    },
    {
      number: '05',
      label: 'SYNTHESIZE',
      icon: <Brain className="w-6 h-6" />,
      description: 'ADK agent loop compiles structured JSON',
    },
    {
      number: '06',
      label: 'DELIVER',
      icon: <Volume2 className="w-6 h-6" />,
      description: 'ElevenLabs Vera speaks the briefing',
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-16 sm:py-20 md:py-28 lg:py-36"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 md:px-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 space-y-4 sm:space-y-6">
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
            THE AGENT PIPELINE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            AI chain. Under 3 seconds.
          </motion.h2>
        </div>

        {/* Pipeline Nodes - Desktop Horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connecting Line */}
            <svg className="absolute top-7 left-0 w-full h-0.5" style={{ zIndex: 0 }}>
              <motion.line
                x1="4%"
                y1="50%"
                x2="96%"
                y2="50%"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="6 4"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
              />
            </svg>

            {/* Nodes */}
            <div className="grid grid-cols-6 gap-4 relative" style={{ zIndex: 1 }}>
              {nodes.map((node, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5, type: 'spring' }}
                  className="flex flex-col items-center"
                >
                  {/* Circle Node */}
                  <div
                    className="relative w-14 h-14 rounded-full flex items-center justify-center mb-3 border group transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-strong)',
                      color: 'var(--accent)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 8px var(--accent-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span
                      className="absolute -top-2 -left-2 text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: 'white',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {node.number}
                    </span>
                    {node.icon}
                  </div>

                  {/* Label */}
                  <div className="text-center max-w-[120px]">
                    <div
                      className="font-semibold mb-1"
                      style={{
                        fontSize: '15px',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-geist)',
                      }}
                    >
                      {node.label}
                    </div>
                    <div
                      className="text-xs leading-tight"
                      style={{
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {node.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline Nodes - Mobile: timeline + step cards */}
        <div className="md:hidden relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-5 top-2 bottom-2 w-0.5 rounded-full"
            style={{ backgroundColor: 'var(--accent)', opacity: 0.35 }}
          />

          <div className="space-y-4">
            {nodes.map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.45, ease: 'easeOut' }}
                className="relative flex gap-4 pl-2"
              >
                {/* Node circle on timeline */}
                <div
                  className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--accent)',
                    color: 'var(--accent)',
                  }}
                >
                  {node.icon}
                </div>

                {/* Step card */}
                <div
                  className="flex-1 min-w-0 rounded-xl border p-4 pb-3.5"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-strong)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: 'var(--accent-glow)',
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {node.number}
                    </span>
                    <span
                      className="font-semibold text-sm tracking-tight"
                      style={{
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-geist)',
                      }}
                    >
                      {node.label}
                    </span>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {node.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}