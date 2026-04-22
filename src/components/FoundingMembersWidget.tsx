import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../lib/api';

interface FoundingMemberStatus {
  enabled: boolean;
  claimed: number;
  limit: number;
  available: number;
}

export function FoundingMembersWidget() {
  const [status, setStatus] = useState<FoundingMemberStatus | null>(null);

  useEffect(() => {
    client.queries.getFoundingMemberStatus()
      .then(r => {
        if (r.data && r.data.enabled !== null) {
          setStatus({
            enabled: r.data.enabled ?? false,
            claimed: r.data.claimed ?? 0,
            limit: r.data.limit ?? 50,
            available: r.data.available ?? 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  if (!status || !status.enabled) return null;

  const pct = Math.min((status.claimed / status.limit) * 100, 100);

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-bold text-amber-800">Founding member offer</p>
        <p className="text-xs font-semibold text-amber-600">{status.available} of {status.limit} left</p>
      </div>
      <p className="text-xs text-amber-700 mb-3">
        The first {status.limit} members get Pro free forever. Sign up now to claim your spot.
      </p>
      <div className="w-full h-2 rounded-full bg-amber-200 mb-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <Link to="/signup" className="btn-primary w-full justify-center text-sm">
        Claim founding member spot
      </Link>
    </div>
  );
}
