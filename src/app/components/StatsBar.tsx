import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { TrendingUp, Zap, Shield, Sparkles } from 'lucide-react';

interface StatItemProps {
  number: string;
  label: string;
  delay: number;
  icon: React.ReactNode;
}

function StatItem({ number, label, delay, icon }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  // Extract number for animation
  const targetValue = number.includes('+') ? parseInt(number) : number.includes('<') ? parseFloat(number.replace('<', '').replace('s', '')) : number.includes('%') ? parseInt(number) : 0;
  const isPercentage = number.includes('%');
  const hasPlus = number.includes('+');
  const isTime = number.includes('s');
  const isLessThan = number.includes('<');

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    if (typeof targetValue === 'number' && targetValue > 0) {
      let start = 0;
      const increment = targetValue / 50;
      const timer = setInterval(() => {
        start += increment;
        if (start >= targetValue) {
          setCount(targetValue);
          setHasAnimated(true);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 30);

      return () => clearInterval(timer);
    } else {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated, targetValue]);

  const displayNumber = typeof targetValue === 'number' && targetValue > 0
    ? `${isLessThan ? '<' : ''}${count}${hasPlus ? '+' : ''}${isPercentage ? '%' : ''}${isTime ? 's' : ''}`
    : number;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay, duration: 0.5 }}
      className="relative flex flex-col items-center justify-center py-10 px-6 group"
    >
      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at center, var(--accent-glow), transparent 70%)',
        }}
      />

      {/* Particle Effect on Hover */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, scale: 0 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{
            y: [-5, -15, -5],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ color: 'var(--accent)' }}
        >
          {icon}
        </motion.div>
      </motion.div>

      {/* Icon */}
      <motion.div
        className="mb-4 relative z-10"
        animate={{
          scale: isInView ? [1, 1.1, 1] : 1,
        }}
        transition={{
          delay: delay + 0.3,
          duration: 0.5,
        }}
      >
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: 'var(--accent-glow)',
            color: 'var(--accent)',
          }}
        >
          {icon}
        </div>
      </motion.div>

      {/* Number */}
      <motion.div
        className="text-4xl md:text-5xl font-bold mb-2 relative z-10"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent)',
        }}
        animate={{
          textShadow: isInView
            ? [
                '0 0 0px rgba(10, 95, 232, 0)',
                '0 0 20px rgba(10, 95, 232, 0.6)',
                '0 0 0px rgba(10, 95, 232, 0)',
              ]
            : '0 0 0px rgba(10, 95, 232, 0)',
        }}
        transition={{
          delay: delay + 0.5,
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        {displayNumber}
      </motion.div>

      {/* Label */}
      <div
        className="text-sm font-medium text-center relative z-10"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </div>

      {/* Animated Underline */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px"
        style={{ backgroundColor: 'var(--accent)' }}
        initial={{ width: 0 }}
        animate={isInView ? { width: '60%' } : { width: 0 }}
        transition={{ delay: delay + 0.7, duration: 0.8 }}
      />

      {/* Pulsing Dot */}
      <motion.div
        className="absolute top-8 right-8 w-2 h-2 rounded-full"
        style={{ backgroundColor: 'var(--accent)' }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: delay,
        }}
      />
    </motion.div>
  );
}

export function StatsBar() {
  const stats = [
    { number: '3+', label: 'Sites Per Session', icon: <TrendingUp className="w-5 h-5" /> },
    { number: '<3s', label: 'Research Time', icon: <Zap className="w-5 h-5" /> },
    { number: '3', label: 'APIs Orchestrated', icon: <Shield className="w-5 h-5" /> },
    { number: '100%', label: 'Free', icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <section
      className="py-20 border-t border-b relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Gradient Overlays */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, var(--accent), transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [-20, 20, -20],
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, var(--vera-voice), transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [20, -20, 20],
          y: [20, -20, 20],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: 'var(--border)' }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{ backgroundColor: 'var(--bg-elevated)' }}
            >
              <StatItem
                number={stat.number}
                label={stat.label}
                delay={i * 0.15}
                icon={stat.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
