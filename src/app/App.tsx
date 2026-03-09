import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { ResearchProvider } from './context/ResearchContext';
import { Navbar } from './components/Navbar';
import { TourGuide } from './components/TourGuide';
import { LazyOnView } from './components/LazyOnView';

// Defer loading to shrink main bundle (improves TBT / unused JS audit)
const ScrollToTop = lazy(() => import('./components/ScrollToTop').then(m => ({ default: m.ScrollToTop })));
const GlowCursor = lazy(() => import('./components/GlowCursor').then(m => ({ default: m.GlowCursor })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

// Route-level code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AppPage = lazy(() => import('./pages/AppPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function PageSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div
        className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
      />
    </div>
  );
}

function AppShell() {
  const [darkMode, setDarkMode] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Show guide automatically every time the user lands on "/"
  useEffect(() => {
    if (location.pathname === '/') {
      const timer = setTimeout(() => setGuideOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const closeGuide = () => {
    setGuideOpen(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: 'var(--font-geist)' }}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} onStartGuide={() => setGuideOpen(true)} />
      {/* Spacer for fixed navbar */}
      <div className="h-[56px] sm:h-[60px] md:h-[64px]" />
      <main>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/research" element={<AppPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Suspense>
      </main>
      <LazyOnView fallbackHeight={200}>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </LazyOnView>
      <Suspense fallback={null}>
        <ScrollToTop />
        <GlowCursor />
      </Suspense>
      <TourGuide isOpen={guideOpen} onClose={closeGuide} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ResearchProvider>
        <AppShell />
      </ResearchProvider>
    </BrowserRouter>
  );
}
