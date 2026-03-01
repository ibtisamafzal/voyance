import { useState, useEffect, Suspense, lazy } from 'react';
import { ResearchProvider } from './context/ResearchContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ScrollToTop } from './components/ScrollToTop';
import { GlowCursor } from './components/GlowCursor';
import { LazyOnView } from './components/LazyOnView';

// Eagerly loaded: above-fold critical components
// Lazy loaded: below-fold sections — chunks load only when section is near viewport (mobile perf)
const StatsBar = lazy(() => import('./components/StatsBar').then(m => ({ default: m.StatsBar })));
const PipelineSection = lazy(() => import('./components/PipelineSection').then(m => ({ default: m.PipelineSection })));
const LiveAgentSection = lazy(() => import('./components/LiveAgentSection').then(m => ({ default: m.LiveAgentSection })));
const FeaturesSection = lazy(() => import('./components/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
const ImpactSection = lazy(() => import('./components/ImpactSection').then(m => ({ default: m.ImpactSection })));
const ResearchOutputSection = lazy(() => import('./components/ResearchOutputSection').then(m => ({ default: m.ResearchOutputSection })));
const ArchitectureSection = lazy(() => import('./components/ArchitectureSection').then(m => ({ default: m.ArchitectureSection })));
const CommunitySection = lazy(() => import('./components/CommunitySection').then(m => ({ default: m.CommunitySection })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

function SectionSkeleton() {
  return <div style={{ minHeight: '1px' }} aria-hidden="true" />;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Always start in dark mode; apply class immediately
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    // Scroll to top on load/reload so page always starts at top
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Apply dark mode class to html element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ResearchProvider>
      <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: 'var(--font-geist)' }}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main>
          <HeroSection />
          <LazyOnView fallbackHeight={140}>
            <Suspense fallback={<SectionSkeleton />}>
              <StatsBar />
            </Suspense>
          </LazyOnView>
          <LazyOnView fallbackHeight={320}>
            <Suspense fallback={<SectionSkeleton />}>
              <PipelineSection />
            </Suspense>
          </LazyOnView>
          <LazyOnView fallbackHeight={400}>
            <Suspense fallback={<SectionSkeleton />}>
              <LiveAgentSection />
            </Suspense>
          </LazyOnView>
          <LazyOnView fallbackHeight={360}>
            <Suspense fallback={<SectionSkeleton />}>
              <FeaturesSection />
            </Suspense>
          </LazyOnView>
          <LazyOnView fallbackHeight={380}>
            <Suspense fallback={<SectionSkeleton />}>
              <ImpactSection />
            </Suspense>
          </LazyOnView>
          <LazyOnView fallbackHeight={200}>
            <Suspense fallback={<SectionSkeleton />}>
              <ResearchOutputSection />
            </Suspense>
          </LazyOnView>
          <LazyOnView fallbackHeight={420}>
            <Suspense fallback={<SectionSkeleton />}>
              <ArchitectureSection />
            </Suspense>
          </LazyOnView>
          <LazyOnView fallbackHeight={340}>
            <Suspense fallback={<SectionSkeleton />}>
              <CommunitySection />
            </Suspense>
          </LazyOnView>
        </main>
        <LazyOnView fallbackHeight={200}>
          <Suspense fallback={<SectionSkeleton />}>
            <Footer />
          </Suspense>
        </LazyOnView>
        <ScrollToTop />
        <GlowCursor />
      </div>
    </ResearchProvider>
  );
}
