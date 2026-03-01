import { useEffect, useRef, useState } from 'react';

/**
 * GlowCursor — a two-layer custom cursor:
 *  • A small sharp "dot" that tracks the mouse precisely
 *  • A larger blurred "glow" halo that follows with a spring lag
 *
 * Only renders on non-touch devices. Hidden automatically on mobile.
 * Grows and brightens on hoverable elements (links, buttons).
 */
export function GlowCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: -200, y: -200 });
    const glowPos = useRef({ x: -200, y: -200 });
    const rafRef = useRef<number>(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isPointerDevice, setIsPointerDevice] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(hover: none)').matches) return;
        setIsPointerDevice(true);

        const onMove = (e: MouseEvent) => {
            pos.current = { x: e.clientX, y: e.clientY };
            if (!isVisible) setIsVisible(true);
        };

        const onEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.closest('a, button, [role="button"], input, textarea, select, label[for]')
            ) {
                setIsHovering(true);
            }
        };

        const onLeave = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.closest('a, button, [role="button"], input, textarea, select, label[for]')
            ) {
                setIsHovering(false);
            }
        };

        const onMouseLeave = () => setIsVisible(false);
        const onMouseEnter = () => setIsVisible(true);

        document.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseover', onEnter, { passive: true });
        document.addEventListener('mouseout', onLeave, { passive: true });
        document.documentElement.addEventListener('mouseleave', onMouseLeave);
        document.documentElement.addEventListener('mouseenter', onMouseEnter);

        // Animation loop — dot snaps instantly, glow follows with easing
        const EASE = 0.1; // glow lag factor (lower = more lag)
        const animate = () => {
            // Interpolate glow toward dot
            glowPos.current.x += (pos.current.x - glowPos.current.x) * EASE;
            glowPos.current.y += (pos.current.y - glowPos.current.y) * EASE;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
            }
            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${glowPos.current.x}px, ${glowPos.current.y}px)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onEnter);
            document.removeEventListener('mouseout', onLeave);
            document.documentElement.removeEventListener('mouseleave', onMouseLeave);
            document.documentElement.removeEventListener('mouseenter', onMouseEnter);
            cancelAnimationFrame(rafRef.current);
        };
    }, [isVisible]);

    if (!isPointerDevice) return null;

    return (
        <>
            {/* Glow halo — large soft blurred circle that lags behind */}
            <div
                ref={glowRef}
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: isHovering ? '56px' : '36px',
                    height: isHovering ? '56px' : '36px',
                    marginLeft: isHovering ? '-28px' : '-18px',
                    marginTop: isHovering ? '-28px' : '-18px',
                    borderRadius: '50%',
                    background: isHovering
                        ? 'radial-gradient(circle, rgba(59,130,246,0.45) 0%, rgba(99,102,241,0.15) 60%, transparent 80%)'
                        : 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(99,102,241,0.1) 60%, transparent 80%)',
                    filter: isHovering ? 'blur(10px)' : 'blur(8px)',
                    pointerEvents: 'none',
                    zIndex: 99998,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease, width 0.25s ease, height 0.25s ease, margin 0.25s ease, background 0.25s ease, filter 0.25s ease',
                    willChange: 'transform',
                    mixBlendMode: 'screen',
                }}
            />
            {/* Sharp dot — snaps exactly to cursor position */}
            <div
                ref={dotRef}
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: isHovering ? '6px' : '7px',
                    height: isHovering ? '6px' : '7px',
                    marginLeft: isHovering ? '-3px' : '-3.5px',
                    marginTop: isHovering ? '-3px' : '-3.5px',
                    borderRadius: '50%',
                    backgroundColor: isHovering ? '#93C5FD' : '#BFDBFE',
                    boxShadow: isHovering
                        ? '0 0 8px 3px rgba(147,197,253,0.8), 0 0 16px 4px rgba(59,130,246,0.5)'
                        : '0 0 6px 2px rgba(191,219,254,0.6), 0 0 12px 3px rgba(59,130,246,0.35)',
                    pointerEvents: 'none',
                    zIndex: 99999,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease, width 0.2s ease, height 0.2s ease, margin 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                    willChange: 'transform',
                }}
            />
        </>
    );
}
