import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { LandingHero } from '../components/LandingHero';
import { StatsBar } from '../components/StatsBar';
import { LazyOnView } from '../components/LazyOnView';

const loadWhyVoyanceSection = () => import('../components/WhyVoyanceSection');
const loadFeaturesSection = () => import('../components/FeaturesSection');
const loadLiveAgentSection = () => import('../components/LiveAgentSection');
const loadPipelineSection = () => import('../components/PipelineSection');
const loadImpactSection = () => import('../components/ImpactSection');
const loadArchitectureSection = () => import('../components/ArchitectureSection');
const loadCommunitySection = () => import('../components/CommunitySection');

const WhyVoyanceSection = lazy(() => loadWhyVoyanceSection().then((m) => ({ default: m.WhyVoyanceSection })));
const FeaturesSection = lazy(() => loadFeaturesSection().then((m) => ({ default: m.FeaturesSection })));
const LiveAgentSection = lazy(() => loadLiveAgentSection().then((m) => ({ default: m.LiveAgentSection })));
const PipelineSection = lazy(() => loadPipelineSection().then((m) => ({ default: m.PipelineSection })));
const ImpactSection = lazy(() => loadImpactSection().then((m) => ({ default: m.ImpactSection })));
const ArchitectureSection = lazy(() => loadArchitectureSection().then((m) => ({ default: m.ArchitectureSection })));
const CommunitySection = lazy(() => loadCommunitySection().then((m) => ({ default: m.CommunitySection })));

function DeferredSection({ children, fallbackHeight = 360 }: { children: ReactNode; fallbackHeight?: number }) {
  return (
    <LazyOnView fallbackHeight={fallbackHeight} rootMargin="1200px">
      <Suspense fallback={<div aria-hidden="true" style={{ minHeight: fallbackHeight }} />}>
        {children}
      </Suspense>
    </LazyOnView>
  );
}

interface LandingPageProps {
  onStartGuide: () => void;
}

export default function LandingPage({ onStartGuide }: LandingPageProps) {
  useEffect(() => {
    // Warm below-fold chunks shortly after first paint so sections appear instantly when reached.
    const timer = window.setTimeout(() => {
      void Promise.all([
        loadWhyVoyanceSection(),
        loadFeaturesSection(),
        loadLiveAgentSection(),
        loadPipelineSection(),
        loadImpactSection(),
        loadArchitectureSection(),
        loadCommunitySection(),
      ]);
    }, 450);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <LandingHero onStartGuide={onStartGuide} />

      {/* Capability cards */}
      <StatsBar />

      {/* Why Voyance — differentiator */}
      <DeferredSection fallbackHeight={760}>
        <WhyVoyanceSection />
      </DeferredSection>

      {/* Features */}
      <DeferredSection fallbackHeight={560}>
        <FeaturesSection />
      </DeferredSection>

      {/* Live Demo */}
      <DeferredSection fallbackHeight={760}>
        <LiveAgentSection />
      </DeferredSection>

      {/* Pipeline — how it works */}
      <DeferredSection fallbackHeight={560}>
        <PipelineSection />
      </DeferredSection>

      {/* Impact */}
      <DeferredSection fallbackHeight={520}>
        <ImpactSection />
      </DeferredSection>

      {/* Architecture */}
      <DeferredSection fallbackHeight={660}>
        <ArchitectureSection />
      </DeferredSection>

      {/* Community */}
      <DeferredSection fallbackHeight={420}>
        <CommunitySection />
      </DeferredSection>

      {/* ── CTA banner ── */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 md:px-10 text-center space-y-5">
          <h2
            style={{ color: 'var(--text-primary)' }}
          >
            Ready to research smarter?
          </h2>
          <p className="text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
            Let Voyance browse, extract, verify, and narrate competitive intelligence for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/research"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-[15px] font-semibold text-white transition-all hover:scale-[1.04] shadow-lg"
              style={{ backgroundColor: 'var(--accent)', boxShadow: '0 4px 24px var(--accent-glow)' }}
            >
              Start Researching
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-[15px] font-semibold border transition-all hover:scale-[1.04]"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }}
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
