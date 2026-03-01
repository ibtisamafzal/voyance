import { motion } from 'motion/react';

export function Footer() {
  const links = {
    product: [
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Features', href: '#features' },
      { label: 'Live Demo', href: '#live-agent' },
      { label: 'Architecture', href: '#architecture' },
    ],
    builtWith: [
      { label: 'Gemini API', href: '#' },
      { label: 'Google ADK', href: '#' },
      { label: 'Cloud Run', href: '#' },
      { label: 'Firestore', href: '#' },
    ],
    externalAPIs: [
      { label: 'ElevenLabs', href: '#' },
      { label: 'Firecrawl', href: '#' },
      { label: 'Perplexity', href: '#' },
      { label: 'Playwright', href: '#' },
    ],
    project: [
      { label: 'GitHub', href: '#' },
      { label: 'Devpost', href: '#' },
      { label: 'PRD', href: '#' },
      { label: 'License', href: '#' },
    ],
  };

  return (
    <footer className="py-16 md:py-20" style={{ backgroundColor: '#060B14' }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        {/* Top Row */}
        <div className="mb-12 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#3B82F6' }}>
              <div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: '#3B82F6' }} />
            </div>
            <span
              className="text-lg font-semibold"
              style={{ color: '#F1F5F9', fontFamily: 'var(--font-geist)' }}
            >
              Voyance
            </span>
          </div>
          <p className="text-sm" style={{ color: '#64748B' }}>
            See the web the way an analyst does.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
            >
              Product
            </h4>
            <ul className="space-y-2">
              {links.product.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#3B82F6]"
                    style={{ color: '#64748B' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
            >
              Built With
            </h4>
            <ul className="space-y-2">
              {links.builtWith.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#3B82F6]"
                    style={{ color: '#64748B' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
            >
              External APIs
            </h4>
            <ul className="space-y-2">
              {links.externalAPIs.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#3B82F6]"
                    style={{ color: '#64748B' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
            >
              Project
            </h4>
            <ul className="space-y-2">
              {links.project.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#3B82F6]"
                    style={{ color: '#64748B' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t"
          style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
        >
          <p
            className="text-xs text-center md:text-left"
            style={{ color: '#64748B', fontFamily: 'var(--font-mono)' }}
          >
            © 2026 Voyance · Gemini Live Agent Challenge · UI Navigator Track
          </p>
          <p
            className="text-xs text-center md:text-right"
            style={{ color: '#64748B', fontFamily: 'var(--font-mono)' }}
          >
            Made for Google · Powered by Gemini
          </p>
        </div>
      </div>
    </footer>
  );
}
