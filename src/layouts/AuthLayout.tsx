import { Outlet, Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header className="px-6 py-5">
        <Link to="/" className="inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-[10px] bg-brand-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">Investors Playground</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
