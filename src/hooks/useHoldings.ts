import { useState, useCallback } from 'react';
import { client, type Holding, computeHoldingPnL, type HoldingWithPnL } from '../lib/api';

export function useHoldings(portfolioId: string | null) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHoldings = useCallback(async (): Promise<Holding[]> => {
    if (!portfolioId) { setHoldings([]); return []; }
    setLoading(true);
    try {
      const result = await client.models.Holding.listByPortfolio(portfolioId);
      const sorted = ((result.data ?? []) as Holding[])
        .sort((a, b) => (b.createdAt ?? '') > (a.createdAt ?? '') ? 1 : -1);
      setHoldings(sorted);
      return sorted;
    } catch (err) {
      console.error('[useHoldings]', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);

  const holdingsWithPnL: HoldingWithPnL[] = holdings.map(computeHoldingPnL);

  return { holdings, holdingsWithPnL, loading, fetchHoldings };
}
