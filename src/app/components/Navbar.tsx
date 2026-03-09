import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, HelpCircle, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onStartGuide?: () => void;
}

export function Navbar({ darkMode, toggleDarkMode, onStartGuide: onStartTour }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Research Lab', href: '/research' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'shadow-sm border-b'
        : ''
        }`}
      style={{
        backgroundColor: scrolled ? 'var(--surface-glass)' : 'var(--bg-primary)',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderColor: scrolled ? 'var(--border)' : 'transparent',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex items-center h-[56px] sm:h-[60px] md:h-[64px]">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2L14 6V10L8 14L2 10V6L8 2Z" fill="currentColor" fillOpacity="0.9"/>
                  <circle cx="8" cy="8" r="2.5" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-geist)' }}
              >
                Voyance
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium px-3.5 py-2 rounded-lg transition-colors"
                  style={{
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--accent-glow)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex-1 flex items-center justify-end gap-2">
            {/* Tour Guide Button */}
            {onStartTour && (
              <button
                onClick={onStartTour}
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
                aria-label="Open guide"
              >
                <HelpCircle className="w-4 h-4" />
                Guide
              </button>
            )}

            {/* Research Lab CTA — visible except on /research */}
            {location.pathname !== '/research' && (
              <Link
                to="/research"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <Rocket className="w-3.5 h-3.5" />
                Research Lab
              </Link>
            )}

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? 'moon' : 'sun'}
                  initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {darkMode ? (
                    <Moon className="w-[18px] h-[18px]" />
                  ) : (
                    <Sun className="w-[18px] h-[18px]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
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
            className="md:hidden overflow-hidden border-t"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      className="block text-sm font-medium px-3 py-2.5 rounded-lg transition-colors"
                      style={{
                        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                        backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile Tour Guide Button */}
              {onStartTour && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <button
                    onClick={() => { setMobileMenuOpen(false); onStartTour(); }}
                    className="flex items-center gap-2 w-full text-sm font-medium px-3 py-2.5 rounded-lg transition-colors text-left"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <HelpCircle className="w-4 h-4" />
                    Quick Guide
                  </button>
                </motion.div>
              )}

              {/* Mobile Research Lab CTA */}
              {location.pathname !== '/research' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.05 }}
                  className="pt-2 border-t mt-1"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Link
                    to="/research"
                    className="flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-lg text-white transition-all"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    <Rocket className="w-4 h-4" />
                    Research Lab
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}