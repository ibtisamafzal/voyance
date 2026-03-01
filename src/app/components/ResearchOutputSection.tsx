import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, ArrowUpDown, CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronUp, FileText, Table, Volume2, Image, ChevronLeft, ChevronRight } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { getVeraSpeechAudio, getSessionScreenshots, type ScreenshotItem } from '../../lib/api';
import type { CompetitorData } from '../../lib/api';

interface CompetitorRow {
    company: string;
    website: string;
    pricing: string;
    keyFeature: string;
    targetSegment: string;
    confidence: 'verified' | 'unconfirmed' | 'low';
    screenshot: boolean;
}

type SortField = 'company' | 'pricing' | 'confidence';
type SortDir = 'asc' | 'desc';

function toRow(c: CompetitorData): CompetitorRow {
    const pricingStr = c.pricing_tiers?.length
        ? c.pricing_tiers.map((t) => `${t.price}${t.period ? `/${t.period}` : ''}`).join(', ')
        : 'N/A';
    return {
        company: c.company,
        website: c.website || c.source_url || '',
        pricing: pricingStr,
        keyFeature: (c.key_features?.[0] ?? c.key_features?.join(', ')) || '—',
        targetSegment: c.target_segment || '—',
        confidence: c.confidence ?? 'unconfirmed',
        screenshot: !!(c.screenshot_ref ?? c.perplexity_verified),
    };
}

const sampleData: CompetitorRow[] = [
    {
        company: 'HubSpot',
        website: 'hubspot.com/pricing',
        pricing: '$800/mo (3 users)',
        keyFeature: 'Marketing + CRM suite, email tracking',
        targetSegment: 'Mid-market',
        confidence: 'verified',
        screenshot: true,
    },
    {
        company: 'Salesforce',
        website: 'salesforce.com/editions',
        pricing: '$25/user/mo',
        keyFeature: 'Contact & opportunity management, mobile app',
        targetSegment: 'Enterprise',
        confidence: 'verified',
        screenshot: true,
    },
    {
        company: 'Pipedrive',
        website: 'pipedrive.com/pricing',
        pricing: '$14/seat/mo',
        keyFeature: 'Pipeline management, 3,000 open deals',
        targetSegment: 'SMB / Startup',
        confidence: 'verified',
        screenshot: true,
    },
    {
        company: 'Monday.com',
        website: 'monday.com/pricing',
        pricing: '$10/seat/mo',
        keyFeature: 'Automation, timeline views, 250 items/board',
        targetSegment: 'SMB',
        confidence: 'unconfirmed',
        screenshot: true,
    },
    {
        company: 'Notion',
        website: 'notion.so/pricing',
        pricing: '$16/user/mo',
        keyFeature: 'Docs + databases + project tracking',
        targetSegment: 'All sizes',
        confidence: 'low',
        screenshot: false,
    },
];

const confLabel: Record<CompetitorRow['confidence'], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    verified: {
        label: 'Verified',
        color: 'var(--success)',
        bg: 'rgba(16, 217, 122, 0.12)',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
    unconfirmed: {
        label: 'Unconfirmed',
        color: 'var(--warning)',
        bg: 'rgba(251, 191, 36, 0.12)',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    low: {
        label: 'Low',
        color: 'var(--danger)',
        bg: 'rgba(248, 113, 113, 0.12)',
        icon: <XCircle className="w-3.5 h-3.5" />,
    },
};

const confOrder: Record<CompetitorRow['confidence'], number> = { verified: 0, unconfirmed: 1, low: 2 };

export function ResearchOutputSection() {
    const { state } = useResearch();
    const [inView, setInView] = useState(false);
    const [sortField, setSortField] = useState<SortField>('company');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [exportMsg, setExportMsg] = useState('');
    const [isVeraPlaying, setIsVeraPlaying] = useState(false);
    const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);
    const [screenshotIndex, setScreenshotIndex] = useState(0);
    const [screenshotsOpen, setScreenshotsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const rows = useMemo(() => {
        if (state.results.length > 0) return state.results.map(toRow);
        // Only show demo data when user hasn't run research yet
        if (!state.sessionId) return sampleData;
        return [];
    }, [state.results, state.sessionId]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const openScreenshots = async () => {
        if (!state.sessionId) return;
        try {
            const { screenshots: data } = await getSessionScreenshots(state.sessionId);
            setScreenshots(data);
            setScreenshotIndex(0);
            setScreenshotsOpen(true);
        } catch (e) {
            console.error('Failed to load screenshots:', e);
        }
    };

    const sorted = [...rows].sort((a, b) => {
        let cmp = 0;
        if (sortField === 'company') cmp = a.company.localeCompare(b.company);
        else if (sortField === 'pricing') cmp = a.pricing.localeCompare(b.pricing);
        else if (sortField === 'confidence') cmp = confOrder[a.confidence] - confOrder[b.confidence];
        return sortDir === 'asc' ? cmp : -cmp;
    });

    const toggleSort = (field: SortField) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const handleExport = (format: 'csv' | 'html') => {
        if (format === 'csv') {
            const rows = [
                ['Company', 'Website', 'Pricing', 'Key Feature', 'Target Segment', 'Confidence'],
                ...sorted.map(r => [r.company, r.website, r.pricing, r.keyFeature, r.targetSegment, r.confidence]),
            ];
            const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'voyance_research.csv'; a.click();
            URL.revokeObjectURL(url);
        } else {
            const html = `<!DOCTYPE html><html><head><title>Voyance Research Report</title>
      <style>body{font-family:system-ui;padding:2rem;background:#0a0f1e;color:#f1f5f9}
      table{width:100%;border-collapse:collapse}
      th{background:#1a2540;padding:12px 16px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8}
      td{padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.06);font-size:14px}
      .verified{color:#10d97a}.unconfirmed{color:#fbbf24}.low{color:#f87171}
      h1{color:#3b82f6;margin-bottom:.5rem}p{color:#64748b;margin-bottom:2rem}</style></head>
      <body><h1>⬤ Voyance Research Report</h1><p>Generated by Voyance AI · Verified by Perplexity</p>
      <table><thead><tr><th>Company</th><th>Website</th><th>Pricing</th><th>Key Feature</th><th>Segment</th><th>Confidence</th></tr></thead>
      <tbody>${sorted.map(r => `<tr><td>${r.company}</td><td>${r.website}</td><td>${r.pricing}</td>
      <td>${r.keyFeature}</td><td>${r.targetSegment}</td>
      <td class="${r.confidence}">${r.confidence.toUpperCase()}</td></tr>`).join('')}</tbody></table></body></html>`;
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'voyance_research.html'; a.click();
            URL.revokeObjectURL(url);
        }
        setExportMsg(`✓ ${format.toUpperCase()} downloaded`);
        setTimeout(() => setExportMsg(''), 2500);
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 opacity-30" />;
        return sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />;
    };

    return (
        <section
            id="output"
            ref={ref}
            className="py-24 md:py-32 relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
            {/* Background decoration */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--accent), transparent 60%)' }}
            />

            <div className="max-w-[1200px] mx-auto px-5 md:px-10 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 space-y-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-4 py-2 rounded-full"
                        style={{
                            backgroundColor: 'var(--accent-glow)',
                            border: '1px solid rgba(10, 95, 232, 0.3)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: 'var(--accent)',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                        }}
                    >
                        RESEARCH OUTPUT
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        Structured. Verified. Downloadable.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="text-lg max-w-[600px] mx-auto"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Every research session produces a sortable comparison table with Perplexity-verified confidence scores — ready to export as CSV or HTML.
                    </motion.p>
                </div>

                {/* Table Card */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-strong)',
                        boxShadow: '0 20px 80px rgba(0,0,0,0.15)',
                    }}
                >
                    {/* Table Header Bar */}
                    <div
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b"
                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: 'var(--success)' }}
                            />
                            <span
                                className="text-sm font-semibold"
                                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                            >
                                {state.query
                                    ? `${state.query} · ${rows.length} ${rows.length === 1 ? 'company' : 'companies'}`
                                    : 'CRM Competitive Analysis · 5 Companies (Demo)'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Legend */}
                            <div className="hidden md:flex items-center gap-3 mr-2">
                                {(['verified', 'unconfirmed', 'low'] as const).map(c => (
                                    <div key={c} className="flex items-center gap-1.5">
                                        <span style={{ color: confLabel[c].color }}>{confLabel[c].icon}</span>
                                        <span className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                                            {confLabel[c].label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* Vera voice playback with waveform animation */}
                            {state.veraSummary && (
                                <button
                                    type="button"
                                    disabled={isVeraPlaying}
                                    onClick={async () => {
                                        try {
                                            setIsVeraPlaying(true);
                                            const blob = await getVeraSpeechAudio(state.veraSummary!);
                                            const url = URL.createObjectURL(blob);
                                            const audio = new Audio(url);
                                            audio.onended = () => {
                                                URL.revokeObjectURL(url);
                                                setIsVeraPlaying(false);
                                            };
                                            audio.onerror = () => setIsVeraPlaying(false);
                                            await audio.play();
                                        } catch (e) {
                                            console.error('Vera speech failed:', e);
                                            setIsVeraPlaying(false);
                                        }
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all hover:scale-105 disabled:opacity-80"
                                    style={{
                                        borderColor: isVeraPlaying ? 'var(--vera-voice)' : 'var(--accent)',
                                        color: isVeraPlaying ? 'var(--vera-voice)' : 'var(--accent)',
                                        backgroundColor: isVeraPlaying ? 'rgba(14, 165, 233, 0.2)' : 'rgba(10, 95, 232, 0.1)',
                                        boxShadow: isVeraPlaying ? '0 0 16px rgba(14, 165, 233, 0.3)' : undefined,
                                    }}
                                >
                                    {isVeraPlaying ? (
                                        <span className="flex items-center gap-1.5">
                                            {[0, 1, 2, 3, 4].map(i => (
                                                <motion.span
                                                    key={i}
                                                    className="w-1 rounded-full"
                                                    style={{ backgroundColor: 'var(--vera-voice)' }}
                                                    animate={{ height: [6, 16, 6] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.08 }}
                                                />
                                            ))}
                                            <span className="ml-1">Playing...</span>
                                        </span>
                                    ) : (
                                        <><Volume2 className="w-3.5 h-3.5" /> Listen to Vera</>
                                    )}
                                </button>
                            )}
                            {/* View sources (screenshots) - US-04 */}
                            {state.sessionId && (
                                <button
                                    onClick={openScreenshots}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all hover:scale-105"
                                    style={{
                                        borderColor: 'var(--border-strong)',
                                        color: 'var(--text-secondary)',
                                        backgroundColor: 'transparent',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-primary)')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                    <Image className="w-3.5 h-3.5" /> View sources
                                </button>
                            )}
                            {/* Export Buttons */}
                            <button
                                onClick={() => handleExport('csv')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all hover:scale-105"
                                style={{
                                    borderColor: 'var(--border-strong)',
                                    color: 'var(--text-secondary)',
                                    backgroundColor: 'transparent',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-primary)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                <Table className="w-3.5 h-3.5" /> CSV
                            </button>
                            <button
                                onClick={() => handleExport('html')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all hover:scale-105"
                                style={{
                                    borderColor: 'var(--border-strong)',
                                    color: 'var(--text-secondary)',
                                    backgroundColor: 'transparent',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-primary)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                <FileText className="w-3.5 h-3.5" /> HTML
                            </button>
                            <AnimatePresence>
                                {exportMsg && (
                                    <motion.span
                                        initial={{ opacity: 0, x: 8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 8 }}
                                        className="text-xs"
                                        style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}
                                    >
                                        {exportMsg}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Scrollable Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {[
                                        { label: 'Company', field: 'company' as SortField },
                                        { label: 'Pricing', field: 'pricing' as SortField },
                                        { label: 'Key Feature', field: null },
                                        { label: 'Segment', field: null },
                                        { label: 'Confidence', field: 'confidence' as SortField },
                                        { label: 'Source', field: null },
                                    ].map(({ label, field }) => (
                                        <th
                                            key={label}
                                            className={`px-6 py-3 text-left text-xs uppercase tracking-wider ${field ? 'cursor-pointer select-none' : ''}`}
                                            style={{
                                                fontFamily: 'var(--font-mono)',
                                                color: 'var(--text-tertiary)',
                                                letterSpacing: '0.06em',
                                                backgroundColor: 'var(--bg-elevated)',
                                            }}
                                            onClick={() => field && toggleSort(field)}
                                        >
                                            <div className="flex items-center gap-2">
                                                {label}
                                                {field && <SortIcon field={field} />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.length === 0 && state.sessionId ? (
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
                                                No results — 0 sites visited
                                            </p>
                                            <p className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                                                Research completed but no data was extracted. Gemini or Perplexity may have returned no URLs, or Playwright couldn't capture the pages. Try again.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                sorted.map((row, i) => {
                                    const conf = confLabel[row.confidence];
                                    return (
                                        <motion.tr
                                            key={`${row.company}-${row.website}-${i}`}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                                            transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
                                            className="transition-colors group"
                                            style={{ borderBottom: '1px solid var(--border)' }}
                                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                        >
                                            {/* Company */}
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                                    {row.company}
                                                </div>
                                                <div
                                                    className="text-xs mt-0.5"
                                                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                                                >
                                                    {row.website}
                                                </div>
                                            </td>
                                            {/* Pricing */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className="font-semibold text-sm"
                                                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
                                                >
                                                    {row.pricing}
                                                </span>
                                            </td>
                                            {/* Key Feature */}
                                            <td className="px-6 py-4 max-w-[240px]">
                                                <span className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                                                    {row.keyFeature}
                                                </span>
                                            </td>
                                            {/* Segment */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor: 'var(--bg-secondary)',
                                                        color: 'var(--text-secondary)',
                                                        fontFamily: 'var(--font-mono)',
                                                    }}
                                                >
                                                    {row.targetSegment}
                                                </span>
                                            </td>
                                            {/* Confidence Badge */}
                                            <td className="px-6 py-4">
                                                <div
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                                    style={{ backgroundColor: conf.bg, color: conf.color, fontFamily: 'var(--font-mono)' }}
                                                >
                                                    {conf.icon}
                                                    {conf.label}
                                                </div>
                                            </td>
                                            {/* Screenshot ref */}
                                            <td className="px-6 py-4">
                                                {row.screenshot ? (
                                                    <div
                                                        className="flex items-center gap-1.5 text-xs"
                                                        style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Screenshotted
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="flex items-center gap-1.5 text-xs"
                                                        style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        Pending
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div
                        className="px-6 py-3 flex items-center justify-between border-t"
                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
                    >
                        <span
                            className="text-xs"
                            style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
                        >
                            {sorted.length} rows · Perplexity verified
                            {state.sessionId ? ` · Session ${state.sessionId.slice(0, 8)}` : ''}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                            <span
                                className="text-xs"
                                style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                            >
                                JSON schema: company / pricing_tiers[] / key_features[] / confidence_score
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* JSON Schema Preview — dynamic from first result or sample */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8 rounded-xl p-6 overflow-x-auto"
                    style={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        fontFamily: 'var(--font-mono)',
                    }}
                >
                    <div className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                        // AC-06 · Structured JSON output per site
                    </div>
                    <pre className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        {state.results.length > 0
                            ? JSON.stringify(state.results[0], null, 2)
                            : `{
  "company": "string",
  "website": "url",
  "pricing_tiers": [{ "name": "string", "price": "string", "seats": 0 }],
  "key_features": ["string"],
  "target_segment": "string",
  "source_url": "url",
  "screenshot_ref": "session_xxx/ref.png",
  "perplexity_verified": true,
  "confidence_score": 0.0-1.0
}`}
                    </pre>
                </motion.div>

                {/* Screenshot carousel modal (US-04) */}
                <AnimatePresence>
                    {screenshotsOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
                            onClick={() => setScreenshotsOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.95 }}
                                className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--bg-elevated)',
                                    border: '1px solid var(--border-strong)',
                                }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                                        Sources visited · {screenshots.length} screenshot{screenshots.length !== 1 ? 's' : ''}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setScreenshotsOpen(false)}
                                        className="px-3 py-1 rounded text-xs font-medium"
                                        style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                                    >
                                        Close
                                    </button>
                                </div>
                                {screenshots.length === 0 ? (
                                    <div className="p-12 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                        No screenshots captured for this session.
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative flex items-center justify-center min-h-[400px] p-4">
                                            <img
                                                src={`data:image/png;base64,${screenshots[screenshotIndex]?.screenshot_b64}`}
                                                alt={`Step ${screenshots[screenshotIndex]?.step_number}`}
                                                className="max-h-[70vh] w-auto rounded-lg object-contain"
                                                style={{ border: '1px solid var(--border)' }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between px-4 py-3 border-t gap-4" style={{ borderColor: 'var(--border)' }}>
                                            <a
                                                href={screenshots[screenshotIndex]?.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs truncate flex-1"
                                                style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                                            >
                                                {screenshots[screenshotIndex]?.url}
                                            </a>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => setScreenshotIndex(i => Math.max(0, i - 1))}
                                                    disabled={screenshotIndex === 0}
                                                    className="p-2 rounded-lg border disabled:opacity-40"
                                                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                                    title="Previous screenshot"
                                                    aria-label="Previous screenshot"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <span className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                                                    {screenshotIndex + 1} / {screenshots.length}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setScreenshotIndex(i => Math.min(screenshots.length - 1, i + 1))}
                                                    disabled={screenshotIndex === screenshots.length - 1}
                                                    className="p-2 rounded-lg border disabled:opacity-40"
                                                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                                    title="Next screenshot"
                                                    aria-label="Next screenshot"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
