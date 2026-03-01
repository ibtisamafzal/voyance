import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Volume2, Shield, Zap, RotateCw, Mic } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
  accentColor: string;
  bgTint: string;
}

export function FeaturesSection() {
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

  const features: Feature[] = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Visual Navigation',
      description: 'Gemini 2.0 Flash reads full webpages from screenshots. No DOM. No APIs. Works on any site, forever.',
      tag: 'POWERED BY GEMINI VISION',
      accentColor: 'var(--accent)',
      bgTint: 'rgba(10, 95, 232, 0.06)',
    },
    {
      icon: <Volume2 className="w-5 h-5" />,
      title: 'Vera Voice Briefings',
      description: 'ElevenLabs Vera persona delivers spoken research briefings with a warm, analyst-grade voice.',
      tag: 'POWERED BY ELEVENLABS',
      accentColor: 'var(--vera-voice)',
      bgTint: 'rgba(99, 102, 241, 0.06)',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Verified Intelligence',
      description: 'Perplexity cross-references every extracted fact against the live web before reporting.',
      tag: 'POWERED BY PERPLEXITY',
      accentColor: 'var(--success)',
      bgTint: 'rgba(12, 191, 106, 0.06)',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Fast Extraction',
      description: 'Firecrawl provides sub-2s structured extraction when available. Gemini vision handles the rest.',
      tag: 'POWERED BY FIRECRAWL',
      accentColor: 'var(--warning)',
      bgTint: 'rgba(245, 158, 11, 0.06)',
    },
    {
      icon: <RotateCw className="w-5 h-5" />,
      title: 'ADK Agent Loop',
      description: 'Google Agent Development Kit orchestrates Plan → Navigate → Extract → Verify → Report.',
      tag: 'POWERED BY GOOGLE ADK',
      accentColor: 'var(--accent)',
      bgTint: 'rgba(10, 95, 232, 0.04)',
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: 'Voice Redirection',
      description: 'Interrupt Vera mid-session by voice. Agent replans in under 5 seconds.',
      tag: 'GEMINI LIVE BARGE-IN',
      accentColor: 'var(--vera-voice)',
      bgTint: 'rgba(99, 102, 241, 0.04)',
    },
  ];

  return (
    <section
      id="features"
      ref={ref}
      className="py-16 sm:py-20 md:py-28 lg:py-36"
      style={{ backgroundColor: 'var(--bg-primary)' }}
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
            CAPABILITIES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Built for precision. Designed for trust.
          </motion.h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              feature={feature}
              delay={i * 0.08}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: Feature;
  delay: number;
  inView: boolean;
}

function FeatureCard({ feature, delay, inView }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-2xl p-5 sm:p-6 md:p-7 transition-all duration-200 group cursor-pointer overflow-hidden"
      style={{
        backgroundColor: 'var(--surface-glass)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${isHovered ? feature.accentColor : 'var(--border)'}`,
        borderColor: isHovered ? `${feature.accentColor}66` : 'var(--border)',
        boxShadow: isHovered
          ? '0 24px 80px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.3) inset'
          : '0 4px 24px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.5) inset',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
      }}
    >
      {/* Scan Line on Hover */}
      {isHovered && (
        <motion.div
          className="absolute left-0 w-full h-0.5 z-20 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${feature.accentColor}40, transparent)`,
          }}
          initial={{ y: 0, opacity: 0.6 }}
          animate={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.8, ease: 'linear' }}
        />
      )}

      {/* Icon Container */}
      <div
        className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-4"
        style={{
          backgroundColor: feature.bgTint,
          color: feature.accentColor,
        }}
      >
        {feature.icon}
      </div>

      {/* Title */}
      <h3 className="mb-2" style={{ fontFamily: 'var(--font-geist)' }}>
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
        {feature.description}
      </p>

      {/* Tag */}
      <div
        className="text-xs uppercase font-medium"
        style={{
          fontFamily: 'var(--font-mono)',
          color: feature.accentColor,
          letterSpacing: '0.05em',
        }}
      >
        {feature.tag}
      </div>
    </motion.div>
  );
}