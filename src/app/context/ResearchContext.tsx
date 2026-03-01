/**
 * Shared research state — connects HeroSection research flow to ResearchOutputSection.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CompetitorData } from '../../lib/api';

export interface ResearchState {
  sessionId: string | null;
  results: CompetitorData[];
  veraSummary: string | null;
  query: string | null;
  totalSites: number;
}

interface ResearchContextValue {
  state: ResearchState;
  setResults: (sessionId: string, results?: CompetitorData[], veraSummary?: string, query?: string, totalSites?: number) => void;
  appendResult: (data: CompetitorData) => void;
  clearResults: () => void;
}

const initial: ResearchState = {
  sessionId: null,
  results: [],
  veraSummary: null,
  query: null,
  totalSites: 0,
};

const ResearchContext = createContext<ResearchContextValue | null>(null);

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ResearchState>(initial);

  const setResults = useCallback(
    (sessionId: string, results?: CompetitorData[], veraSummary?: string, query?: string, totalSites?: number) => {
      setState((prev) => ({
        sessionId,
        results: results ?? prev.results,
        veraSummary: veraSummary ?? prev.veraSummary ?? null,
        query: query ?? prev.query ?? null,
        totalSites: totalSites ?? results?.length ?? prev.totalSites,
      }));
    },
    []
  );

  const appendResult = useCallback((data: CompetitorData) => {
    setState((prev) => ({
      ...prev,
      results: prev.results.some((r) => r.company === data.company && r.website === data.website)
        ? prev.results
        : [...prev.results, data],
    }));
  }, []);

  const clearResults = useCallback(() => setState(initial), []);

  return (
    <ResearchContext.Provider value={{ state, setResults, appendResult, clearResults }}>
      {children}
    </ResearchContext.Provider>
  );
}

const defaultContextValue: ResearchContextValue = {
  state: initial,
  setResults: () => {},
  appendResult: () => {},
  clearResults: () => {},
};

export function useResearch() {
  return useContext(ResearchContext) ?? defaultContextValue;
}
