import { useState, useEffect } from 'react';

/**
 * True when we should reduce animations (mobile viewport or prefers-reduced-motion).
 * Use to skip heavy blur/scale animations on mobile for better performance.
 */
export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)');
    const update = () => setReduce(mq.matches);
    update();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    // Safari fallback
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  return reduce;
}
