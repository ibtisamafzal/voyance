


export function Footer() {
  const links = {
    product: [
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Features', href: '#features' },
      { label: 'Live Demo', href: '#live-agent' },
      { label: 'Architecture', href: '#architecture' },
    ],
    builtWith: [
      { label: 'Gemini API', href: '#', external: false },
      { label: 'Google ADK', href: '#', external: false },
      { label: 'Cloud Run', href: '#', external: false },
      { label: 'Firestore', href: '#', external: false },
    ],
    externalAPIs: [
      { label: 'ElevenLabs', href: '#', external: false },
      { label: 'Firecrawl', href: '#', external: false },
      { label: 'Perplexity', href: '#', external: false },
      { label: 'Playwright', href: '#', external: false },
    ],
    project: [
      { label: 'GitHub', href: 'https://github.com/ibtisamafzal/voyance', external: true },
      { label: 'Blog (DEV)', href: 'https://dev.to/ibtisamafzal/how-we-built-voyance-an-ai-agent-that-researches-the-web-by-seeing-it-214h', external: true },
      { label: 'Devpost', href: 'https://geminiliveagentchallenge.devpost.com/', external: true },
      { label: 'License', href: 'https://github.com/ibtisamafzal/voyance/blob/main/LICENSE', external: true },
    ],
  };

  return (
    <footer className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#060B14' }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 md:px-10">
        {/* Top Row */}
        <div className="mb-8 sm:mb-12 space-y-3">
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
          <p className="text-sm" style={{ color: '#94A3B8' }}>
            See the web the way an analyst does.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: '#CBD5E1', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
            >
              Product
            </h4>
            <ul className="space-y-2">
              {links.product.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#60A5FA]"
                    style={{ color: '#94A3B8' }}
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
              style={{ color: '#CBD5E1', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
            >
              Built With
            </h4>
            <ul className="space-y-2">
              {links.builtWith.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#60A5FA]"
                    style={{ color: '#94A3B8' }}
                    aria-label={`${link.label} — technology used to build Voyance`}
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
              style={{ color: '#CBD5E1', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
            >
              External APIs
            </h4>
            <ul className="space-y-2">
              {links.externalAPIs.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#60A5FA]"
                    style={{ color: '#94A3B8' }}
                    aria-label={`${link.label} — external API used by Voyance`}
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
              style={{ color: '#CBD5E1', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
            >
              Project
            </h4>
            <ul className="space-y-2">
              {links.project.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#60A5FA]"
                    style={{ color: '#94A3B8' }}
                    target="_blank"
                    rel="noopener noreferrer"
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
          className="pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 border-t"
          style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
        >
          <p
            className="text-xs text-center md:text-left"
            style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}
          >
            © 2026 Voyance · Gemini Live Agent Challenge · UI Navigator Track
          </p>
          <p
            className="text-xs text-center md:text-right"
            style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}
          >
            Made for Google · Powered by Gemini
          </p>
        </div>
      </div>
    </footer>
  );
}

