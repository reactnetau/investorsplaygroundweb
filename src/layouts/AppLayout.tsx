import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, TrendingUp, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { enqueueSnackbar } from 'notistack';
import schmappsLogo from '../assets/schmappslogo.png';

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/portfolios', icon: Briefcase,        label: 'Portfolios' },
  { to: '/holdings',   icon: TrendingUp,       label: 'Holdings' },
];

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/account',  icon: User,     label: 'Account' },
];

const navLink = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-50 text-brand-700 font-semibold'
      : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
  }`;

export function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      enqueueSnackbar('Failed to sign out', { variant: 'error' });
    }
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`flex min-h-0 flex-col h-full ${mobile ? 'pt-2' : ''}`}>
      <div className="px-4 py-5 flex items-center gap-2.5 border-b border-gray-100">
        <img src={schmappsLogo} alt="Schmapps" className="w-8 h-8 object-contain flex-shrink-0" />
        <span className="font-bold text-gray-900 text-sm">Investors Playground</span>
      </div>

      <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} className={navLink}>
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </div>

      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} className={navLink}>
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
            {label}
          </NavLink>
        ))}
        <button
          onClick={() => { setSidebarOpen(false); void handleLogout(); }}
          className="w-full flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100/70 hover:text-gray-700 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          Logout
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      <aside className="hidden lg:flex lg:flex-col w-60 bg-white border-r border-gray-200 flex-shrink-0">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 z-50 shadow-xl flex flex-col">
            <div className="flex flex-shrink-0 items-center justify-between px-4 pt-4 pb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-[8px] hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <Sidebar mobile />
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-[8px] hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <img src={schmappsLogo} alt="Schmapps" className="w-6 h-6 object-contain" />
            <span className="font-bold text-gray-900 text-sm">Investors Playground</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
