import { Suspense, lazy } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { LazyOnView } from '../components/LazyOnView';
import { LandingHero } from '../components/LandingHero';

const StatsBar = lazy(() => import('../components/StatsBar').then(m => ({ default: m.StatsBar })));
const PipelineSection = lazy(() => import('../components/PipelineSection').then(m => ({ default: m.PipelineSection })));
const LiveAgentSection = lazy(() => import('../components/LiveAgentSection').then(m => ({ default: m.LiveAgentSection })));
const FeaturesSection = lazy(() => import('../components/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
const WhyVoyanceSection = lazy(() => import('../components/WhyVoyanceSection').then(m => ({ default: m.WhyVoyanceSection })));
const ImpactSection = lazy(() => import('../components/ImpactSection').then(m => ({ default: m.ImpactSection })));
const ArchitectureSection = lazy(() => import('../components/ArchitectureSection').then(m => ({ default: m.ArchitectureSection })));
const CommunitySection = lazy(() => import('../components/CommunitySection').then(m => ({ default: m.CommunitySection })));

function SectionSkeleton() {
  return <div style={{ minHeight: '1px' }} aria-hidden="true" />;
}

export default function LandingPage() {
  return (
    <>
      <LandingHero />

      {/* Capability cards */}
      <LazyOnView fallbackHeight={140}>
        <Suspense fallback={<SectionSkeleton />}>
          <StatsBar />
        </Suspense>
      </LazyOnView>

      {/* Why Voyance — differentiator */}
      <LazyOnView fallbackHeight={400}>
        <Suspense fallback={<SectionSkeleton />}>
          <WhyVoyanceSection />
        </Suspense>
      </LazyOnView>

      {/* Features */}
      <LazyOnView fallbackHeight={360}>
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturesSection />
        </Suspense>
      </LazyOnView>

      {/* Live Demo */}
      <LazyOnView fallbackHeight={400}>
        <Suspense fallback={<SectionSkeleton />}>
          <LiveAgentSection />
        </Suspense>
      </LazyOnView>

      {/* Pipeline — how it works */}
      <LazyOnView fallbackHeight={320}>
        <Suspense fallback={<SectionSkeleton />}>
          <PipelineSection />
        </Suspense>
      </LazyOnView>

      {/* Impact */}
      <LazyOnView fallbackHeight={380}>
        <Suspense fallback={<SectionSkeleton />}>
          <ImpactSection />
        </Suspense>
      </LazyOnView>

      {/* Architecture */}
      <LazyOnView fallbackHeight={420}>
        <Suspense fallback={<SectionSkeleton />}>
          <ArchitectureSection />
        </Suspense>
      </LazyOnView>

      {/* Community */}
      <LazyOnView fallbackHeight={340}>
        <Suspense fallback={<SectionSkeleton />}>
          <CommunitySection />
        </Suspense>
      </LazyOnView>

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
