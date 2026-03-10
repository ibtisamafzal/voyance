import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import { useReduceMotion } from '../hooks/useReduceMotion';

interface DotPoint {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phaseX: number;
  phaseY: number;
  amp: number;
  speed: number;
}

export function LandingHero() {
  const reduceMotion = useReduceMotion();
  const [compactHeroHeight, setCompactHeroHeight] = useState(false);

  const words1 = ['Research', 'the', 'web', 'the', 'way'];
  const words2 = ['an', 'analyst', 'does'];

  useEffect(() => {
    const updateHeroHeightMode = () => {
      const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const touchDevice = coarsePointer || navigator.maxTouchPoints > 0;
      const desktopLikeViewport = window.innerWidth >= 760;
      const scale = window.visualViewport?.scale ?? 1;
      const desktopModeScale = scale < 0.9;
      setCompactHeroHeight(touchDevice && desktopLikeViewport && (desktopModeScale || window.innerWidth >= 900));
    };

    updateHeroHeightMode();
    window.addEventListener('resize', updateHeroHeightMode, { passive: true });
    window.addEventListener('orientationchange', updateHeroHeightMode);
    window.visualViewport?.addEventListener('resize', updateHeroHeightMode);

    return () => {
      window.removeEventListener('resize', updateHeroHeightMode);
      window.removeEventListener('orientationchange', updateHeroHeightMode);
      window.visualViewport?.removeEventListener('resize', updateHeroHeightMode);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-primary)',
        minHeight: compactHeroHeight ? 'auto' : '100dvh',
      }}
    >
      {/* Atmospheric + cursor-reactive dots background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Base atmospheric wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% -10%, var(--accent-glow) 0%, transparent 55%), radial-gradient(90% 70% at 85% 10%, var(--vera-glow) 0%, transparent 60%), linear-gradient(165deg, rgba(13,148,136,0.06) 0%, transparent 42%)',
          }}
        />

        <CursorReactiveDotField reduceMotion={reduceMotion} />

        {/* Foreground glows */}
        <div
          className="absolute -top-24 right-[8%] w-[540px] h-[540px] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 68%)',
            filter: 'blur(100px)',
            opacity: 0.12,
          }}
        />
        <div
          className="absolute top-[44%] -left-20 w-[430px] h-[430px] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--vera-voice) 0%, transparent 68%)',
            filter: 'blur(100px)',
            opacity: 0.09,
          }}
        />

        {/* Fade-out mask at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[42%]"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}
        />
      </div>

      {/* Hero top */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 pt-[calc(84px+env(safe-area-inset-top))] sm:pt-[92px] lg:pt-[96px] pb-12 sm:pb-16 text-center">
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

        {/* Headline */}
        <h1 className="mb-6">
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
            {words1.map((word, i) => (
              reduceMotion ? (
                <span key={i} style={{ color: 'var(--text-primary)', display: 'inline-block' }}>
                  {word}
                </span>
              ) : (
                <motion.span
                  key={i}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
                  style={{ color: 'var(--text-primary)', display: 'inline-block' }}
                >
                  {word}
                </motion.span>
              )
            ))}
          </div>
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
            {words2.map((word, i) => (
              reduceMotion ? (
                <span key={i} style={{ color: 'var(--accent)', display: 'inline-block' }}>
                  {word}
                </span>
              ) : (
                <motion.span
                  key={i}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 + i * 0.05, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
                  style={{ color: 'var(--accent)', display: 'inline-block' }}
                >
                  {word}
                </motion.span>
              )
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
          with vision, verify every fact, and deliver spoken briefings - in seconds.
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

function CursorReactiveDotField({ reduceMotion }: { reduceMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const dotsRef = useRef<DotPoint[]>([]);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  const pointerStartedRef = useRef(false);
  const lastPointerMoveAtRef = useRef(0);
  const intensityRef = useRef(1);
  const colorRef = useRef('#94a3b8');
  const accentRef = useRef('#0d9488');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const readColor = () => {
      const c = getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim();
      const a = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      colorRef.current = c || '#94a3b8';
      accentRef.current = a || '#0d9488';
    };

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const spacing = width < 640 ? 28 : 24;
      const jitter = spacing * 0.08;
      const nextDots: DotPoint[] = [];
      for (let y = 0; y <= height + spacing; y += spacing) {
        for (let x = 0; x <= width + spacing; x += spacing) {
          const jx = x + (Math.random() - 0.5) * jitter;
          const jy = y + (Math.random() - 0.5) * jitter;
          nextDots.push({
            baseX: jx,
            baseY: jy,
            x: jx,
            y: jy,
            vx: 0,
            vy: 0,
            r: 1.15,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            amp: 0.8 + Math.random() * 1.2,
            speed: 0.00024 + Math.random() * 0.00024,
          });
        }
      }
      dotsRef.current = nextDots;
      readColor();
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const { x: mx, y: my, active } = pointerRef.current;
      const now = performance.now();
      const isMobile = width < 640;
      const idleDelayMs = 2200;
      const idleDimStrength = 0.33;
      const isIdle = !isMobile && pointerStartedRef.current && now - lastPointerMoveAtRef.current > idleDelayMs;
      const intensityTarget = isMobile ? 0.62 : (isIdle ? idleDimStrength : 1);
      intensityRef.current += (intensityTarget - intensityRef.current) * (isMobile ? 0.045 : 0.08);
      const intensity = intensityRef.current;
      const interactionActive = !isMobile && active && !isIdle;

      const radius = 210;
      const radiusSq = radius * radius;
      const repel = 2.85;
      const spring = isMobile ? 0.028 : 0.05;
      const friction = isMobile ? 0.88 : 0.8;

      ctx.fillStyle = colorRef.current;

      for (const dot of dotsRef.current) {
        let influenced = false;
        const ambientTargetX = isMobile
          ? dot.baseX + Math.sin(now * dot.speed + dot.phaseX) * dot.amp
          : dot.baseX;
        const ambientTargetY = isMobile
          ? dot.baseY + Math.cos(now * dot.speed * 0.9 + dot.phaseY) * dot.amp
          : dot.baseY;

        if (!reduceMotion && interactionActive) {
          const dx = dot.x - mx;
          const dy = dot.y - my;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0.001 && distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / radius) * repel;
            dot.vx += (dx / dist) * force;
            dot.vy += (dy / dist) * force;
            influenced = true;
          }
        }

        dot.vx += (ambientTargetX - dot.x) * spring;
        dot.vy += (ambientTargetY - dot.y) * spring;
        dot.vx *= friction;
        dot.vy *= friction;
        dot.x += dot.vx;
        dot.y += dot.vy;

        const d = Math.hypot(dot.x - ambientTargetX, dot.y - ambientTargetY);
        const accentMix = Math.min(1, d / 16);
        const drawR = dot.r + Math.min(isMobile ? 0.7 : 1.9, d * (isMobile ? 0.03 : 0.05));
        const highlight = influenced || (interactionActive && d > 0.7);

        ctx.fillStyle = highlight ? accentRef.current : colorRef.current;
        const alpha = highlight
          ? (isMobile ? 0.18 + accentMix * 0.25 : 0.2 + accentMix * 0.62)
          : (isMobile ? 0.11 + Math.min(0.03, d * 0.03) : 0.06 + Math.min(0.08, d * 0.01));
        ctx.globalAlpha = alpha * intensity;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, drawR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      frameRef.current = requestAnimationFrame(drawFrame);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointerStartedRef.current = true;
      lastPointerMoveAtRef.current = performance.now();
      pointerRef.current = { x, y, active };
    };

    const onDeactivate = () => {
      pointerRef.current.active = false;
    };

    setup();
    frameRef.current = requestAnimationFrame(drawFrame);

    const colorObserver = new MutationObserver(readColor);
    colorObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });

    window.addEventListener('resize', setup);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('blur', onDeactivate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      colorObserver.disconnect();
      window.removeEventListener('resize', setup);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', onDeactivate);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.9, filter: 'contrast(1.06)' }}
    />
  );
}
