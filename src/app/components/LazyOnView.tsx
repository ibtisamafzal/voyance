import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Renders children only when the wrapper is near the viewport (Intersection Observer).
 * Defers loading of lazy section chunks until the user scrolls, improving mobile LCP/TBT.
 */
export function LazyOnView({
  children,
  fallbackHeight = 120,
  rootMargin = '200px',
}: {
  children: ReactNode;
  fallbackHeight?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { rootMargin, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className="section-content-visibility"
      style={{ minHeight: inView ? undefined : fallbackHeight }}
    >
      {inView ? children : null}
    </div>
  );
}
