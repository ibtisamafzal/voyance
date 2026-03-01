import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, RefreshCw } from 'lucide-react';

const SCROLL_THRESHOLD = 400;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reloadToTop = () => {
    window.scrollTo(0, 0);
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-40 flex flex-col gap-2"
        >
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center justify-center w-11 h-11 rounded-full border shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-strong)',
              color: 'var(--accent)',
            }}
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={reloadToTop}
            className="flex items-center justify-center w-11 h-11 rounded-full border shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-strong)',
              color: 'var(--text-secondary)',
            }}
            title="Reload page (back to top)"
            aria-label="Reload page"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
