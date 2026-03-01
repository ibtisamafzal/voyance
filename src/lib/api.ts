/**
 * Voyance API Client — Frontend ↔ Backend communication
 */

const API_BASE = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? 'http://localhost:8000';
const WS_BASE = API_BASE.replace(/^http/, 'ws');

export interface ResearchRequest {
    query: string;
    max_sites?: number;
    voice_enabled?: boolean;
}

export interface AgentUpdate {
    session_id: string;
    step: 'planning' | 'navigating' | 'extracting' | 'verifying' | 'synthesizing' | 'complete';
    message: string;
    site?: string;
    progress: number;
    data?: CompetitorData;
    vera_speech?: string;
}

export interface CompetitorData {
    company: string;
    website: string;
    pricing_tiers: { name: string; price: string; period?: string; seats?: number }[];
    key_features: string[];
    target_segment: string;
    source_url: string;
    screenshot_ref?: string;
    perplexity_verified: boolean;
    confidence_score: number;
    confidence: 'verified' | 'unconfirmed' | 'low';
}

export interface ResearchResponse {
    session_id: string;
    status: string;
    message: string;
    results: CompetitorData[];
    vera_summary?: string;
    total_sites: number;
    duration_seconds?: number;
}

export interface HealthStatus {
    status: string;
    version: string;
    services: {
        gemini: boolean;
        elevenlabs: boolean;
        firecrawl: boolean;
        perplexity: boolean;
        firestore: boolean;
        playwright: boolean;
    };
}

// ─── REST endpoints ───────────────────────────────────────────────────────────

export async function checkHealth(): Promise<HealthStatus> {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return res.json();
}

export async function startResearch(req: ResearchRequest): Promise<ResearchResponse> {
    const res = await fetch(`${API_BASE}/api/research/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(err.detail ?? `Request failed: ${res.status}`);
    }
    return res.json();
}

export async function getResearchResults(sessionId: string): Promise<ResearchResponse> {
    const res = await fetch(`${API_BASE}/api/research/${sessionId}`);
    if (!res.ok) throw new Error(`Failed to fetch results: ${res.status}`);
    return res.json();
}

export interface ScreenshotItem {
    step_number: number;
    url: string;
    screenshot_b64: string;
}

export async function getSessionScreenshots(sessionId: string): Promise<{ session_id: string; screenshots: ScreenshotItem[] }> {
    const res = await fetch(`${API_BASE}/api/research/${sessionId}/screenshots`);
    if (!res.ok) throw new Error(`Failed to fetch screenshots: ${res.status}`);
    return res.json();
}

export async function interruptResearch(sessionId: string, instruction: string) {
    const res = await fetch(`${API_BASE}/api/research/interrupt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, instruction }),
    });
    if (!res.ok) throw new Error(`Interrupt failed: ${res.status}`);
    return res.json();
}

export async function getVeraSpeechUrl(text: string): Promise<string> {
    return `${API_BASE}/api/voice/speak/audio?text=${encodeURIComponent(text)}`;
}

/** Transcribe audio via Gemini (AC-01). */
export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string }> {
    const form = new FormData();
    form.append('audio', audioBlob, 'recording.webm');
    const res = await fetch(`${API_BASE}/api/voice/transcribe`, {
        method: 'POST',
        body: form,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Transcription failed' }));
        throw new Error(err.detail ?? `Transcription failed: ${res.status}`);
    }
    return res.json();
}

/** Fetch Vera TTS audio as blob (use for long text — avoids URL length limits) */
export async function getVeraSpeechAudio(text: string): Promise<Blob> {
    const res = await fetch(`${API_BASE}/api/voice/speak/audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`Voice API failed: ${res.status}`);
    return res.blob();
}

// ─── WebSocket connection ─────────────────────────────────────────────────────

export type WSMessageHandler = (update: AgentUpdate | { type: string;[k: string]: unknown }) => void;

export function connectToResearchStream(
    sessionId: string,
    onMessage: WSMessageHandler,
    onClose?: () => void,
): WebSocket {
    const ws = new WebSocket(`${WS_BASE}/api/research/ws/${sessionId}`);

    ws.onopen = () => {
        console.log('[Voyance WS] Connected to session:', sessionId);
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type !== 'ping') {
                onMessage(data);
            }
        } catch (e) {
            console.error('[Voyance WS] Parse error:', e);
        }
    };

    ws.onerror = (err) => {
        console.error('[Voyance WS] Error:', err);
    };

    ws.onclose = () => {
        console.log('[Voyance WS] Disconnected');
        onClose?.();
    };

    return ws;
}

export function sendInterruptViaWS(ws: WebSocket, instruction: string) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'interrupt', instruction }));
    }
}
