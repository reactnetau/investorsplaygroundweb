import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export function StripeCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="card p-10 max-w-md w-full text-center shadow-md">
        <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment cancelled</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          No charge was made. You can upgrade to Pro any time from your account page.
        </p>
        <Link to="/account" className="btn-primary !text-base !py-3 !px-8">
          Back to account
        </Link>
      </div>
    </div>
  );
}
