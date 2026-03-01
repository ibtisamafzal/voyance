import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Live Agent', href: '#live-agent' },
    { label: 'Features', href: '#features' },
    { label: 'Output', href: '#output' },
    { label: 'Community', href: '#community' },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-[var(--surface-glass)] backdrop-blur-[24px] border-b border-[var(--border)]'
        : 'bg-transparent'
        }`}
      style={{
        backdropFilter: scrolled ? 'blur(24px) saturate(160%)' : 'none',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="flex items-center h-[52px] md:h-[60px]">
          {/* Logo - flex-1 left */}
          <div className="flex-1 flex justify-start">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-[var(--accent)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-sm bg-[var(--accent)]" />
              </div>
              <span
                className="text-lg font-semibold"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-geist)' }}
              >
                Voyance
              </span>
            </div>
          </div>

          {/* Desktop Nav Links - truly centered */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium relative group transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 w-full h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
              </a>
            ))}
          </div>

          {/* Right Controls - flex-1 right */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <button
              className="hidden md:block px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
              style={{
                backgroundColor: 'var(--accent)',
                boxShadow: '0 0 0 0 var(--accent-glow)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 4px var(--accent-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 0 var(--accent-glow)';
              }}
            >
              Request Access
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative w-[52px] h-[28px] rounded-full transition-colors"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              aria-label="Toggle dark mode"
            >
              <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm"
                animate={{ x: darkMode ? 26 : 4 }}
                transition={{ type: 'spring', damping: 18, stiffness: 250 }}
              >
                <motion.div
                  animate={{ rotate: darkMode ? 180 : 0, scale: darkMode ? 1 : 0.6 }}
                  transition={{ duration: 0.3 }}
                >
                  {darkMode ? (
                    <Moon className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                  ) : (
                    <Sun className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                  )}
                </motion.div>
              </motion.div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}
          >
            <div className="px-5 py-4 flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white w-full"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Request Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}