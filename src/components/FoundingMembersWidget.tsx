import { Link } from 'react-router-dom';

interface Props {
  claimed: number;
  limit: number;
  available: number;
}

export function FoundingMembersWidget({ claimed, limit, available }: Props) {
  if (available <= 0) return null;

  const pct = Math.min((claimed / limit) * 100, 100);

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-bold text-amber-800">Founding member offer</p>
        <p className="text-xs font-semibold text-amber-600">{available} of {limit} left</p>
      </div>
      <p className="text-xs text-amber-700 mb-3">
        The first {limit} members get Pro free forever. Sign up now to claim your spot.
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
