import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, RefreshCw, Plus } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { usePortfolios } from '../hooks/usePortfolios';
import { useHoldings } from '../hooks/useHoldings';
import { useSelectedPortfolioIndex } from '../hooks/useSelectedPortfolioIndex';
import { computePortfolioStats, isPro } from '../lib/api';
import { formatCurrency, formatPercent, gainLossColor } from '../lib/format';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SEO } from '../components/SEO';
import { enqueueSnackbar } from 'notistack';

export function DashboardPage() {
  const navigate = useNavigate();
  const { profile, loading: profileLoading, fetchProfile } = useProfile();
  const { portfolios, loading: portfoliosLoading, fetchPortfolios } = usePortfolios();
  const { activeIndex: activePortfolioIndex, setActiveIndex: setActivePortfolioIndex } = useSelectedPortfolioIndex(portfolios);
  const [dataLoading, setDataLoading] = useState(true);

  const activePortfolio = portfolios[activePortfolioIndex] ?? null;
  const { holdingsWithPnL, loading: holdingsLoading, fetchHoldings } = useHoldings(activePortfolio?.id ?? null);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      await Promise.all([fetchProfile(), fetchPortfolios()]);
    } catch {
      enqueueSnackbar('Failed to load data', { variant: 'error' });
    } finally {
      setDataLoading(false);
    }
  }, [fetchProfile, fetchPortfolios]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (activePortfolio) fetchHoldings(); }, [activePortfolio?.id]);

  const stats = activePortfolio ? computePortfolioStats(activePortfolio, holdingsWithPnL) : null;
  const currency = activePortfolio?.currency ?? profile?.currency ?? 'AUD';
  const pro = profile ? isPro(profile) : false;

  if (profileLoading && !profile) return <LoadingSpinner fullScreen />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SEO title="Dashboard" noIndex />

      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          {portfolios.length > 0 && (
            <p className="page-subtitle">{portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} disabled={dataLoading} className="btn-secondary !py-2 !px-3">
            <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => navigate('/portfolios')} className="btn-primary">
            <Plus className="w-4 h-4" />
            New portfolio
          </button>
        </div>
      </div>

      {/* Plan badge */}
      {profile && (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-5 border ${
          profile.isFoundingMember ? 'bg-amber-50 border-amber-200 text-amber-800' : pro ? 'badge-pro' : 'badge-free'
        }`}>
          <TrendingUp className="w-3 h-3" />
          {profile.isFoundingMember ? 'Founding member · Pro forever' : pro ? 'Pro plan' : 'Free plan · 1 portfolio, up to 5 holdings'}
        </div>
      )}

      {dataLoading ? (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : portfolios.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="empty-state-icon mx-auto">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No portfolios yet</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Create your first paper trading portfolio to start tracking virtual investments.</p>
          <button onClick={() => navigate('/portfolios')} className="btn-primary">
            <Plus className="w-4 h-4" />
            Create portfolio
          </button>
        </div>
      ) : (
        <>
          {/* Portfolio tabs */}
          {portfolios.length > 1 && (
            <div className="flex gap-2 mb-5 flex-wrap">
              {portfolios.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActivePortfolioIndex(i)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    i === activePortfolioIndex
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Total value"
                value={formatCurrency(stats.totalValue, currency)}
                icon={<DollarSign className="w-5 h-5 text-brand-600" />}
                color="green"
              />
              <StatCard
                label="Cash"
                value={formatCurrency(stats.cash, currency)}
                icon={<DollarSign className="w-5 h-5 text-gray-500" />}
                color="gray"
              />
              <StatCard
                label="Return"
                value={formatPercent(stats.gainLossPct)}
                subtitle={formatCurrency(stats.gainLoss, currency)}
                icon={stats.gainLoss >= 0
                  ? <TrendingUp className="w-5 h-5 text-green-600" />
                  : <TrendingDown className="w-5 h-5 text-red-500" />}
                color={stats.gainLoss >= 0 ? 'green' : 'red'}
                valueColor={gainLossColor(stats.gainLoss)}
              />
              <StatCard
                label="Holdings"
                value={String(stats.holdingCount)}
                icon={<Briefcase className="w-5 h-5 text-blue-600" />}
                color="blue"
              />
            </div>
          )}

          {/* Holdings table */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">Holdings</h2>
              <button onClick={() => navigate('/holdings')} className="text-sm text-brand-600 font-medium hover:underline">
                Manage →
              </button>
            </div>
            {holdingsLoading ? (
              <div className="card p-8 flex justify-center"><LoadingSpinner /></div>
            ) : holdingsWithPnL.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-sm text-gray-400 mb-3">No holdings in this portfolio yet.</p>
                <button onClick={() => navigate('/holdings')} className="btn-primary !py-2">
                  <Plus className="w-4 h-4" />
                  Buy a stock
                </button>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Code</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Qty</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-500">Price</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-500">Value</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdingsWithPnL.map((h) => (
                      <tr key={h.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-4 py-3 font-semibold text-gray-900">{h.code}</td>
                        <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">{h.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {h.currentPrice != null ? formatCurrency(h.currentPrice, h.priceCurrency) : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(h.currentValue, currency)}</td>
                        <td className={`px-4 py-3 text-right font-medium hidden md:table-cell ${gainLossColor(h.gainLoss)}`}>
                          {formatPercent(h.gainLossPct)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label, value, subtitle, icon, color, valueColor,
}: {
  label: string; value: string; subtitle?: string;
  icon: React.ReactNode; color: 'green' | 'red' | 'blue' | 'gray';
  valueColor?: string;
}) {
  const bg = { green: 'bg-green-50 border-green-100', red: 'bg-red-50 border-red-100', blue: 'bg-blue-50 border-blue-100', gray: 'bg-gray-50 border-gray-100' }[color];
  return (
    <div className="stat-card">
      <div className={`w-10 h-10 rounded-[10px] border flex items-center justify-center mb-3 ${bg}`}>{icon}</div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-xl font-bold leading-none ${valueColor ?? 'text-gray-900'}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>}
    </div>
  );
}
