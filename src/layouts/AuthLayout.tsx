import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import schmappsLogo from '../assets/schmappslogo.png';
import { client } from '../lib/api';
import { FoundingMembersWidget } from '../components/FoundingMembersWidget';

interface FoundingStatus { claimed: number; limit: number; available: number; }

export function AuthLayout() {
  const [foundingStatus, setFoundingStatus] = useState<FoundingStatus | null>(null);

  useEffect(() => {
    client.queries.stripeGetPrice()
      .then(r => {
        if (r.data?.foundingMembersEnabled) {
          setFoundingStatus({
            claimed: r.data.foundingMembersClaimed ?? 0,
            limit: r.data.foundingMembersLimit ?? 50,
            available: r.data.foundingMembersAvailable ?? 50,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header className="px-6 py-5">
        <Link to="/" className="inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src={schmappsLogo} alt="Schmapps" className="w-8 h-8 object-contain" />
          <span className="font-bold text-gray-900 text-sm">Investors Playground</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {foundingStatus && (
            <div className="mb-4">
              <FoundingMembersWidget {...foundingStatus} />
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
