import { useState, useCallback } from 'react';
import { client, type Portfolio } from '../lib/api';

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPortfolios = useCallback(async (): Promise<Portfolio[]> => {
    setLoading(true);
    try {
      const result = await client.models.Portfolio.list();
      const sorted = ((result.data ?? []) as Portfolio[])
        .sort((a, b) => (a.createdAt ?? '') < (b.createdAt ?? '') ? -1 : 1);
      setPortfolios(sorted);
      return sorted;
    } catch (err) {
      console.error('[usePortfolios]', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { portfolios, loading, fetchPortfolios, setPortfolios };
}
