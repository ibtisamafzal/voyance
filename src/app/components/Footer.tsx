import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function Footer() {
  const linkSections = [
    {
      title: 'Product',
      links: [
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Features', href: '#features' },
        { label: 'Live Demo', href: '#live-agent' },
        { label: 'Architecture', href: '#architecture' },
      ],
    },
    {
      title: 'Built With',
      links: [
        { label: 'Gemini API', href: '#', ariaLabel: 'Gemini API — technology used to build Voyance' },
        { label: 'Google ADK', href: '#', ariaLabel: 'Google ADK — technology used to build Voyance' },
        { label: 'Cloud Run', href: '#', ariaLabel: 'Cloud Run — technology used to build Voyance' },
        { label: 'Firestore', href: '#', ariaLabel: 'Firestore — technology used to build Voyance' },
      ],
    },
    {
      title: 'External APIs',
      links: [
        { label: 'ElevenLabs', href: '#', ariaLabel: 'ElevenLabs — external API used by Voyance' },
        { label: 'Firecrawl', href: '#', ariaLabel: 'Firecrawl — external API used by Voyance' },
        { label: 'Perplexity', href: '#', ariaLabel: 'Perplexity — external API used by Voyance' },
        { label: 'Playwright', href: '#', ariaLabel: 'Playwright — external API used by Voyance' },
      ],
    },
    {
      title: 'Project',
      links: [
        { label: 'GitHub', href: 'https://github.com/ibtisamafzal/voyance', external: true },
        { label: 'Blog (DEV)', href: 'https://dev.to/ibtisamafzal/how-we-built-voyance-an-ai-agent-that-researches-the-web-by-seeing-it-214h', external: true },
        { label: 'Devpost', href: 'https://geminiliveagentchallenge.devpost.com/', external: true },
        { label: 'License', href: 'https://github.com/ibtisamafzal/voyance/blob/main/LICENSE', external: true },
      ],
    },
  ];

  // Mobile accordion state — null means all collapsed
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (title: string) =>
    setOpenSection(prev => (prev === title ? null : title));

  return (
    <footer style={{ backgroundColor: '#060B14' }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 md:px-10">

        {/* ── Brand row ── */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-8 sm:py-10 md:py-12 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          {/* Logo + tagline */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div
                className="w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: '#3B82F6' }}
              >
                <div className="w-[7px] h-[7px] rounded-sm" style={{ backgroundColor: '#3B82F6' }} />
              </div>
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ color: '#F1F5F9', fontFamily: 'var(--font-geist)' }}
              >
                Voyance
              </span>
            </div>
            <p
              className="text-sm"
              style={{ color: '#64748B', fontFamily: 'var(--font-geist)' }}
            >
              See the web the way an analyst does.
            </p>
          </div>

          {/* Social / CTA pills on mobile — a compact row of quick links */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              { label: 'GitHub', href: 'https://github.com/ibtisamafzal/voyance' },
              { label: 'Blog', href: 'https://dev.to/ibtisamafzal/how-we-built-voyance-an-ai-agent-that-researches-the-web-by-seeing-it-214h' },
              { label: 'Devpost', href: 'https://geminiliveagentchallenge.devpost.com/' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                style={{
                  color: '#94A3B8',
                  borderColor: 'rgba(255,255,255,0.1)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#60A5FA';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(59,130,246,0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#94A3B8';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* ── Desktop: 4-col grid │ Mobile: accordion ── */}
        {/* DESKTOP */}
        <div className="hidden md:grid md:grid-cols-4 gap-12 py-10">
          {linkSections.map(section => (
            <div key={section.title}>
              <h3
                className="font-semibold mb-4 uppercase tracking-widest"
                style={{
                  color: '#CBD5E1',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                }}
              >
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: '#94A3B8' }}
                      aria-label={'ariaLabel' in link ? link.ariaLabel : undefined}
                      {...('external' in link && link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#60A5FA')}
                      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#94A3B8')}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* MOBILE accordion */}
        <div className="md:hidden divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {linkSections.map(section => {
            const isOpen = openSection === section.title;
            return (
              <div key={section.title}>
                <button
                  onClick={() => toggle(section.title)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between py-4 text-left"
                  style={{ background: 'none', border: 'none' }}
                >
                  <h3
                    className="font-semibold uppercase tracking-widest"
                    style={{
                      color: isOpen ? '#93C5FD' : '#CBD5E1',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {section.title}
                  </h3>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform duration-300"
                    style={{
                      color: isOpen ? '#60A5FA' : '#475569',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {/* Animated expand panel */}
                <div
                  style={{
                    maxHeight: isOpen ? '200px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <ul className="pb-4 space-y-3 pl-1">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.href}
                          className="text-sm"
                          style={{ color: '#94A3B8', display: 'block' }}
                          aria-label={'ariaLabel' in link ? link.ariaLabel : undefined}
                          {...('external' in link && link.external
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {link.label}
                          {'external' in link && link.external && (
                            <span style={{ color: '#475569', marginLeft: '4px', fontSize: '10px' }}>↗</span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <p
            className="text-xs text-center sm:text-left order-2 sm:order-1"
            style={{ color: '#475569', fontFamily: 'var(--font-mono)' }}
          >
            © 2026 Voyance · Gemini Live Agent Challenge · UI Navigator Track
          </p>
          <p
            className="text-xs text-center sm:text-right order-1 sm:order-2"
            style={{ color: '#475569', fontFamily: 'var(--font-mono)' }}
          >
            Made for Google · Powered by Gemini
          </p>
        </div>

      </div>
    </footer>
  );
}
