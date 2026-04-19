import { TrendingUp, Star } from 'lucide-react';

interface Props {
  open: boolean;
  reason?: string;
  onClose: () => void;
}

export function ProModal({ open, reason, onClose }: Props) {
  if (!open) return null;

  const features = [
    'Unlimited portfolios',
    'Unlimited holdings per portfolio',
    'Live price refresh',
    'Advanced P&L analytics',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-md w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Star className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Upgrade to Pro</h3>
        {reason && <p className="text-sm text-gray-500 text-center mb-4">{reason}</p>}
        <ul className="space-y-2 mb-6">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <TrendingUp className="w-4 h-4 text-brand-600 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-400 text-center mb-4">
          Pro subscriptions are managed through the mobile app. Download Investors Playground on iOS or Android to subscribe.
        </p>
        <button onClick={onClose} className="btn-secondary w-full">
          Got it
        </button>
      </div>
    </div>
  );
}
