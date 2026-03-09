import { HeroSection } from '../components/HeroSection';
import { Suspense, lazy } from 'react';
import { LazyOnView } from '../components/LazyOnView';

const ResearchOutputSection = lazy(() =>
  import('../components/ResearchOutputSection').then(m => ({ default: m.ResearchOutputSection }))
);

function SectionSkeleton() {
  return <div style={{ minHeight: '1px' }} aria-hidden="true" />;
}

export default function AppPage() {
  return (
    <>
      <HeroSection />
      <LazyOnView fallbackHeight={200}>
        <Suspense fallback={<SectionSkeleton />}>
          <ResearchOutputSection />
        </Suspense>
      </LazyOnView>
    </>
  );
}
