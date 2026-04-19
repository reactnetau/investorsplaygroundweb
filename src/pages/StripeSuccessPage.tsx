import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { client, isPro } from '../lib/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

const MAX_ATTEMPTS = 8;
const RETRY_DELAY_MS = 1500;

export function StripeSuccessPage() {
  const [confirmed, setConfirmed] = useState(false);
  const [ready, setReady] = useState(false);
  const attempts = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function pollProfile() {
      while (!cancelled && attempts.current < MAX_ATTEMPTS) {
        attempts.current += 1;
        try {
          const result = await client.models.UserProfile.list();
          const p = result.data?.[0];
          if (p && isPro({ subscriptionStatus: p.subscriptionStatus ?? 'inactive' })) {
            if (!cancelled) { setConfirmed(true); setReady(true); }
            return;
          }
        } catch {
          // ignore fetch errors, keep retrying
        }
        // Stripe webhook may not have fired yet — wait before retrying
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      }
      if (!cancelled) setReady(true);
    }

    void pollProfile();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="card p-10 max-w-md w-full text-center shadow-md">
        {!ready ? (
          <>
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-400 mt-4">Confirming your subscription…</p>
          </>
        ) : confirmed ? (
          <>
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You're on Pro!</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Your subscription is active. Enjoy unlimited portfolios and holdings across global markets.
            </p>
            <Link to="/dashboard" className="btn-primary !text-base !py-3 !px-8">
              Go to dashboard
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment received</h1>
            <p className="text-gray-500 mb-2 leading-relaxed">
              Your payment was successful. Pro access will activate within a few moments.
            </p>
            <p className="text-sm text-gray-400 mb-8">If it doesn't appear immediately, refresh your account page.</p>
            <Link to="/account" className="btn-primary !text-base !py-3 !px-8">
              Go to account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
