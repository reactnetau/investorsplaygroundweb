import { Link } from 'react-router-dom';
import { TrendingUp, BarChart2, DollarSign, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { SEO } from '../components/SEO';

const APP_URL = import.meta.env.VITE_APP_URL ?? '';

const features = [
  {
    icon: TrendingUp,
    title: 'Practice with paper trading',
    desc: 'Buy and sell stocks using virtual cash. No real money, no real risk.',
  },
  {
    icon: BarChart2,
    title: 'Track your P&L',
    desc: 'See your portfolio value, unrealised gains, cash position, and holding performance at a glance.',
  },
  {
    icon: DollarSign,
    title: 'Multiple portfolios',
    desc: 'Create separate portfolios to test different strategies side by side.',
  },
  {
    icon: ShieldCheck,
    title: 'Learn before investing',
    desc: 'Build confidence and intuition for investing before putting real money at stake.',
  },
];

const ACTIVITY = [
  { title: 'BHP bought', meta: '50 shares @ $42.30', dot: 'bg-brand-500' },
  { title: 'CBA price refreshed', meta: 'Now $132.10 (+2.3%)', dot: 'bg-amber-500' },
  { title: 'Portfolio created', meta: 'Growth Strategy', dot: 'bg-blue-500' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <SEO
        title="Practice Investing — Paper Trading Portfolios"
        description="Investors Playground lets you practice stock investing with paper trading portfolios. No real money, just learning."
        canonical="/"
      />

      {/* Nav */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-brand-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Investors Playground</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-secondary !py-1.5 !px-3 !text-xs">Sign in</Link>
            <Link to="/signup" className="btn-primary !py-1.5 !px-3 !text-xs">Get started free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-700 mb-6">
          <TrendingUp className="w-3.5 h-3.5" />
          Paper trading — free to start
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
          Practice investing<br />without risking real money
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          Build paper trading portfolios, track holdings, see your P&amp;L, and learn
          how to invest — before you put real money on the line.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/signup" className="btn-primary text-base !px-6 !py-3">
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="btn-secondary text-base !px-6 !py-3">
            Sign in
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">Free plan: 1 portfolio, 5 holdings. No credit card.</p>
      </section>

      {/* App preview card */}
      <section className="max-w-4xl mx-auto px-5 pb-16">
        <div className="card p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Portfolio · Growth Strategy</p>
              <p className="text-3xl font-extrabold text-gray-900">$24,830.50</p>
              <p className="text-sm text-green-600 font-semibold mt-0.5">+$4,830 (+24.2%) total return</p>
            </div>
            <div className="hidden sm:grid grid-cols-2 gap-3">
              {[
                { label: 'Cash', value: '$8,200' },
                { label: 'Holdings', value: '$16,630' },
              ].map(({ label, value }) => (
                <div key={label} className="stat-card !p-3">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-base font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {[
              { code: 'BHP', name: 'BHP Group', qty: 50, price: '$42.30', change: '+3.2%', gain: true },
              { code: 'CBA', name: 'Commonwealth Bank', qty: 20, price: '$132.10', change: '+1.8%', gain: true },
              { code: 'NVS', name: 'Novartis AG', qty: 15, price: '$91.40', change: '-0.5%', gain: false },
            ].map((h) => (
              <div key={h.code} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] border border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <div className="icon-box-sm text-brand-700 font-bold text-xs">{h.code.slice(0, 2)}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{h.code}</p>
                    <p className="text-xs text-gray-400">{h.name} · {h.qty} shares</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{h.price}</p>
                  <p className={`text-xs font-medium ${h.gain ? 'text-green-600' : 'text-red-500'}`}>{h.change}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Activity feed */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            {ACTIVITY.map((a) => (
              <div key={a.title} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.dot}`} />
                <p className="text-sm text-gray-700 font-medium">{a.title}</p>
                <p className="text-xs text-gray-400 ml-auto">{a.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-5 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Everything you need to learn</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5">
              <div className="icon-box-md mb-4">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white border-y border-gray-200 py-16">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Simple pricing</h2>
          <p className="text-sm text-gray-500 text-center mb-10">Start free. Upgrade through the mobile app.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: ['1 portfolio', 'Up to 5 holdings', 'Buy & sell stocks', 'Portfolio P&L tracking'],
                cta: 'Get started free',
                to: '/signup',
                primary: false,
              },
              {
                name: 'Pro',
                price: 'From app',
                period: 'via iOS/Android',
                features: ['Unlimited portfolios', 'Unlimited holdings', 'Live price refresh', 'Advanced analytics'],
                cta: 'Sign up first',
                to: '/signup',
                primary: true,
              },
            ].map((plan) => (
              <div key={plan.name} className={`card p-6 ${plan.primary ? 'border-brand-300 ring-1 ring-brand-200' : ''}`}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{plan.name}</p>
                <p className="text-3xl font-extrabold text-gray-900 mb-0.5">{plan.price}</p>
                <p className="text-xs text-gray-400 mb-5">{plan.period}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={plan.to} className={plan.primary ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-5 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Start practising today</h2>
        <p className="text-gray-500 mb-8">Free to get started. No credit card required.</p>
        <Link to="/signup" className="btn-primary text-base !px-8 !py-3">
          Create free account
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[6px] bg-brand-600 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Investors Playground</span>
          </div>
          <p className="text-xs text-gray-400">Paper trading only. Not financial advice.</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link to="/login" className="hover:text-gray-600">Sign in</Link>
            <Link to="/signup" className="hover:text-gray-600">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
