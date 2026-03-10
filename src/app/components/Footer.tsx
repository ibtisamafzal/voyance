import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import { BrandLogo } from './BrandLogo';

interface FooterLink {
  label: string;
  href: string;
  ariaLabel?: string;
  external?: boolean;
  route?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export function Footer() {
  const linkSections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { label: 'How It Works', href: '/#how-it-works' },
        { label: 'Why Voyance', href: '/#why-voyance' },
        { label: 'Features', href: '/#features' },
        { label: 'Architecture', href: '/#architecture' },
      ],
    },
    {
      title: 'Pages',
      links: [
        { label: 'Home', href: '/', route: true },
        { label: 'Research Lab', href: '/research', route: true },
        { label: 'About', href: '/about', route: true },
        { label: 'FAQ', href: '/faq', route: true },
        { label: 'Contact', href: '/contact', route: true },
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

  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (title: string) =>
    setOpenSection(prev => (prev === title ? null : title));

  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">

        {/* Desktop: Brand + 3 link columns */}
        <div
          className="hidden md:grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-14 py-12 lg:py-16 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Brand column */}
          <div className="space-y-4">
            <BrandLogo iconSize={32} textClassName="text-lg" />
            <p
              className="text-sm leading-relaxed max-w-[260px]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              AI-powered competitive intelligence. Browse, extract, verify, and hear your research — all in seconds.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
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
                  className="text-[11px] px-3 py-1.5 rounded-full border transition-colors"
                  style={{
                    color: 'var(--text-secondary)',
                    borderColor: 'var(--border-strong)',
                    fontFamily: 'var(--font-mono)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-strong)';
                  }}
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {linkSections.map(section => (
            <div key={section.title}>
              <h3
                className="font-semibold mb-5 uppercase tracking-widest"
                style={{
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                }}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.route ? (
                      <Link
                        to={link.href}
                        className="text-sm transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label={link.ariaLabel}
                        {...(link.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                      >
                        {link.label}
                        {link.external && (
                          <span className="ml-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>↗</span>
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile: Brand + accordion */}
        <div className="md:hidden">
          {/* Brand */}
          <div
            className="py-8 border-b space-y-3"
            style={{ borderColor: 'var(--border)' }}
          >
            <BrandLogo iconSize={32} textClassName="text-lg" />
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              AI-powered competitive intelligence agent.
            </p>
            <div className="flex flex-wrap gap-2">
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
                  className="text-[11px] px-3 py-1.5 rounded-full border"
                  style={{
                    color: 'var(--text-secondary)',
                    borderColor: 'var(--border-strong)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Accordion */}
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
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
                        color: isOpen ? 'var(--accent)' : 'var(--text-tertiary)',
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
                        color: isOpen ? 'var(--accent)' : 'var(--text-tertiary)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? '260px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <ul className="pb-4 space-y-3 pl-1">
                      {section.links.map((link, i) => (
                        <li key={i}>
                          {link.route ? (
                            <Link
                              to={link.href}
                              className="text-sm block"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {link.label}
                            </Link>
                          ) : (
                            <a
                              href={link.href}
                              className="text-sm block"
                              style={{ color: 'var(--text-secondary)' }}
                              aria-label={link.ariaLabel}
                              {...(link.external
                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                : {})}
                            >
                              {link.label}
                              {link.external && (
                                <span className="ml-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>↗</span>
                              )}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <p
            className="text-[11px] text-center sm:text-left order-2 sm:order-1"
            style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
          >
            © 2026 Voyance · Gemini Live Agent Challenge · UI Navigator Track
          </p>
          <p
            className="text-[11px] text-center sm:text-right order-1 sm:order-2"
            style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
          >
            Made for Google · Powered by Gemini
          </p>
        </div>

      </div>
    </footer>
  );
}
