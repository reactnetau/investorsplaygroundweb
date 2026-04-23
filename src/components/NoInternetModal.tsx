import { WifiOff } from 'lucide-react';

interface Props {
  open: boolean;
}

export function NoInternetModal({ open }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-modal shadow-md w-full max-w-sm p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <WifiOff className="w-7 h-7 text-gray-500" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No internet connection</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          The app will continue automatically when you're back online.
        </p>
      </div>
    </div>
  );
}
