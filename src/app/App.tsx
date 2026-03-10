import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { ResearchProvider } from './context/ResearchContext';
import { Navbar } from './components/Navbar';
import { TourGuide } from './components/TourGuide';
import { ScrollToTop } from './components/ScrollToTop';
import { Footer } from './components/Footer';

// Route-level code splitting — only split pages the user hasn't navigated to yet
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
    // Prevent browsers from restoring stale scroll positions between routes.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

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

  useEffect(() => {
    // Always start each route at the top so hero headings are visible on mobile.
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

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
      <Footer />
      <ScrollToTop />
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
