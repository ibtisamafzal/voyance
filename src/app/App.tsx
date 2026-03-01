import { useState, useEffect } from 'react';
import { ResearchProvider } from './context/ResearchContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsBar } from './components/StatsBar';
import { PipelineSection } from './components/PipelineSection';
import { LiveAgentSection } from './components/LiveAgentSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ImpactSection } from './components/ImpactSection';
import { ResearchOutputSection } from './components/ResearchOutputSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { CommunitySection } from './components/CommunitySection';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

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
        <StatsBar />
        <PipelineSection />
        <LiveAgentSection />
        <FeaturesSection />
        <ImpactSection />
        <ResearchOutputSection />
        <ArchitectureSection />
        <CommunitySection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
    </ResearchProvider>
  );
}
