import { useState, useEffect } from 'react';
import type { Portfolio } from '../lib/api';

const KEY = 'ip_selectedPortfolioId';

export function useSelectedPortfolioIndex(portfolios: Portfolio[]) {
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    try { return localStorage.getItem(KEY); } catch { return null; }
  });

  // Resolve to an index; fall back to 0 if stored ID isn't in the current list
  const activeIndex = (() => {
    const i = portfolios.findIndex(p => p.id === selectedId);
    return i >= 0 ? i : 0;
  })();

  // When portfolios load and the fallback kicks in, persist the resolved ID
  useEffect(() => {
    const resolved = portfolios[activeIndex];
    if (resolved && resolved.id !== selectedId) {
      setSelectedId(resolved.id);
      try { localStorage.setItem(KEY, resolved.id); } catch {}
    }
  }, [portfolios]);

  const setActiveIndex = (i: number) => {
    const p = portfolios[i];
    if (!p) return;
    setSelectedId(p.id);
    try { localStorage.setItem(KEY, p.id); } catch {}
  };

  return { activeIndex, setActiveIndex };
}
