import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { LandingHero } from '../components/LandingHero';
import { StatsBar } from '../components/StatsBar';
import { WhyVoyanceSection } from '../components/WhyVoyanceSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { LiveAgentSection } from '../components/LiveAgentSection';
import { PipelineSection } from '../components/PipelineSection';
import { ImpactSection } from '../components/ImpactSection';
import { ArchitectureSection } from '../components/ArchitectureSection';
import { CommunitySection } from '../components/CommunitySection';

export default function LandingPage() {
  return (
    <>
      <LandingHero />

      {/* Capability cards */}
      <StatsBar />

      {/* Why Voyance — differentiator */}
      <WhyVoyanceSection />

      {/* Features */}
      <FeaturesSection />

      {/* Live Demo */}
      <LiveAgentSection />

      {/* Pipeline — how it works */}
      <PipelineSection />

      {/* Impact */}
      <ImpactSection />

      {/* Architecture */}
      <ArchitectureSection />

      {/* Community */}
      <CommunitySection />

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
