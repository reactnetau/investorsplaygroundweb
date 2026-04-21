import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Plus, RefreshCw, X, Search } from 'lucide-react';
import { usePortfolios } from '../hooks/usePortfolios';
import { useHoldings } from '../hooks/useHoldings';
import { useSelectedPortfolioIndex } from '../hooks/useSelectedPortfolioIndex';
import { client, type Portfolio, type HoldingWithPnL } from '../lib/api';
import { formatCurrency, formatPercent, formatDate, gainLossColor, gainLossBg } from '../lib/format';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ConfirmModal } from '../components/ConfirmModal';
import { ProModal } from '../components/ProModal';
import { SEO } from '../components/SEO';
import { enqueueSnackbar } from 'notistack';

export function HoldingsPage() {
  const { portfolios, loading: portfoliosLoading, fetchPortfolios } = usePortfolios();
  const { activeIndex, setActiveIndex } = useSelectedPortfolioIndex(portfolios);
  const [showBuy, setShowBuy] = useState(false);
  const [sellTarget, setSellTarget] = useState<HoldingWithPnL | null>(null);
  const [resetModal, setResetModal] = useState(false);
  const [proModal, setProModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [resetting, setResetting] = useState(false);

  const activePortfolio: Portfolio | null = portfolios[activeIndex] ?? null;
  const { holdingsWithPnL, loading: holdingsLoading, fetchHoldings } = useHoldings(activePortfolio?.id ?? null);

  const [buyCode, setBuyCode] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [buyQty, setBuyQty] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [buyDate, setBuyDate] = useState(new Date().toISOString().split('T')[0]);
  const [buying, setBuying] = useState(false);

  const parsedBuyPrice = parseFloat(buyPrice);
  const parsedBuyQty = parseFloat(buyQty);
  const parsedBuyAmount = parseFloat(buyAmount);
  const hasBuyPrice = !isNaN(parsedBuyPrice) && parsedBuyPrice > 0;
  const hasBuyQty = !isNaN(parsedBuyQty) && parsedBuyQty > 0;
  const hasBuyAmount = !isNaN(parsedBuyAmount) && parsedBuyAmount > 0;
  const calculatedBuyQty = hasBuyAmount && hasBuyPrice ? parsedBuyAmount / parsedBuyPrice : null;
  const submitBuyQty = hasBuyAmount ? (calculatedBuyQty ?? NaN) : parsedBuyQty;
  const totalCost = hasBuyAmount
    ? parsedBuyAmount
    : hasBuyQty && hasBuyPrice
      ? parsedBuyQty * parsedBuyPrice
      : null;

  const [sellQty, setSellQty] = useState('');
  const [selling, setSelling] = useState(false);

  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => { if (portfolios.length === 0) fetchPortfolios(); }, []);
  useEffect(() => { if (activePortfolio) fetchHoldings(); }, [activePortfolio?.id]);

  const handleRefreshPrices = async () => {
    if (!activePortfolio) return;
    setRefreshing(true);
    try {
      const result = await client.mutations.refreshPrices({ portfolioId: activePortfolio.id });
      const d = result.data;
      if (d?.error) { enqueueSnackbar(d.error, { variant: 'error' }); return; }
      enqueueSnackbar(`Updated ${d?.updatedCount ?? 0} price${(d?.updatedCount ?? 0) !== 1 ? 's' : ''}`, { variant: 'success' });
      await fetchHoldings();
    } catch { enqueueSnackbar('Price refresh failed', { variant: 'error' }); }
    finally { setRefreshing(false); }
  };

  const handleFetchPrice = async () => {
    if (!buyCode.trim()) return;
    setPriceLoading(true);
    try {
      const result = await client.queries.fetchPrice({ code: buyCode.toUpperCase() });
      const d = result.data;
      if (d?.price != null) {
        setBuyPrice(String(d.price));
        enqueueSnackbar(`${d.code}: ${formatCurrency(d.price, d.currency ?? 'AUD')}${d.cached ? ' (cached)' : ''}`, { variant: 'info' });
      } else if (d?.error) {
        enqueueSnackbar(d.error, { variant: 'error' });
      }
    } catch { enqueueSnackbar('Failed to fetch price', { variant: 'error' }); }
    finally { setPriceLoading(false); }
  };

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePortfolio) return;
    const price = parsedBuyPrice;
    const qty = submitBuyQty;
    if (!buyCode.trim() || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0) {
      enqueueSnackbar('Please enter a stock, price, and either quantity or amount', { variant: 'error' });
      return;
    }
    setBuying(true);
    try {
      const result = await client.mutations.buyHolding({
        portfolioId: activePortfolio.id,
        code: buyCode.trim().toUpperCase(),
        buyPrice: price,
        quantity: qty,
        purchasedOn: new Date(buyDate).toISOString(),
      });
      const d = result.data;
      if (d?.errorCode === 'limit_reached') { setShowBuy(false); setProModal(true); return; }
      if (d?.errorCode === 'insufficient_funds') { enqueueSnackbar('Insufficient cash in portfolio', { variant: 'error' }); return; }
      if (d?.error) throw new Error(d.error);
      enqueueSnackbar(`Bought ${qty.toFixed(4).replace(/\.?0+$/, '')} × ${buyCode.toUpperCase()}`, { variant: 'success' });
      setShowBuy(false);
      setBuyCode(''); setBuyPrice(''); setBuyQty(''); setBuyAmount('');
      setBuyDate(new Date().toISOString().split('T')[0]);
      await Promise.all([fetchHoldings(), fetchPortfolios()]);
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Buy failed', { variant: 'error' });
    } finally {
      setBuying(false);
    }
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellTarget) return;
    const qty = sellQty ? parseFloat(sellQty) : undefined;
    if (qty !== undefined && (isNaN(qty) || qty <= 0 || qty > sellTarget.quantity)) {
      enqueueSnackbar('Invalid quantity', { variant: 'error' }); return;
    }
    setSelling(true);
    try {
      const result = await client.mutations.sellHolding({ holdingId: sellTarget.id, quantity: qty });
      const d = result.data;
      if (d?.error) throw new Error(d.error);
      const pct = d?.gainLossPct != null ? formatPercent(d.gainLossPct) : '';
      enqueueSnackbar(`Sold ${qty ?? sellTarget.quantity} × ${sellTarget.code}${pct ? ` · ${pct}` : ''}`, { variant: 'success' });
      setSellTarget(null);
      setSellQty('');
      await Promise.all([fetchHoldings(), fetchPortfolios()]);
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Sell failed', { variant: 'error' });
    } finally {
      setSelling(false);
    }
  };

  const handleReset = async () => {
    if (!activePortfolio) return;
    setResetting(true);
    try {
      const result = await client.mutations.resetPortfolio({ portfolioId: activePortfolio.id });
      if (result.data?.error) throw new Error(result.data.error);
      enqueueSnackbar('Portfolio reset', { variant: 'success' });
      setResetModal(false);
      await Promise.all([fetchHoldings(), fetchPortfolios()]);
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Reset failed', { variant: 'error' });
    } finally {
      setResetting(false);
    }
  };

  if (portfoliosLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <SEO title="Holdings" noIndex />

      <div className="page-header">
        <div>
          <h1 className="page-title">Holdings</h1>
          {activePortfolio && (
            <p className="page-subtitle">
              Cash: {formatCurrency(activePortfolio.cash, activePortfolio.currency)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleRefreshPrices} disabled={refreshing || !activePortfolio} className="btn-secondary !py-2 !px-3" title="Refresh prices">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setResetModal(true)} disabled={!activePortfolio || holdingsWithPnL.length === 0}
            className="btn-secondary !py-2 !text-red-600 !border-red-200 hover:!bg-red-50">
            Reset
          </button>
          <button onClick={() => setShowBuy(true)} disabled={!activePortfolio} className="btn-primary">
            <Plus className="w-4 h-4" />
            Buy stock
          </button>
        </div>
      </div>

      {portfolios.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-gray-400 mb-3">Create a portfolio first to start buying stocks.</p>
          <a href="/portfolios" className="btn-primary inline-flex"><Plus className="w-4 h-4" /> New portfolio</a>
        </div>
      ) : (
        <>
          {/* Portfolio tabs */}
          {portfolios.length > 1 && (
            <div className="flex gap-2 mb-5 flex-wrap">
              {portfolios.map((p, i) => (
                <button key={p.id} onClick={() => setActiveIndex(i)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    i === activeIndex ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
                  }`}>
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {/* Buy panel */}
          {showBuy && (
            <div className="card p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Buy stock</h2>
                <button onClick={() => setShowBuy(false)} className="p-1.5 rounded-[8px] hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleBuy} className="space-y-4">
                <div>
                  <label className="label">Stock code</label>
                  <div className="flex gap-2">
                    <input className="input flex-1" value={buyCode} onChange={(e) => setBuyCode(e.target.value.toUpperCase())}
                      placeholder="e.g. BHP, AAPL" required />
                    <button type="button" onClick={handleFetchPrice} disabled={priceLoading || !buyCode.trim()}
                      className="btn-secondary !py-2 !px-3 flex-shrink-0" title="Fetch live price">
                      {priceLoading ? <LoadingSpinner size="sm" /> : <Search className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Buy price</label>
                    <input className="input" type="number" step="0.01" min="0.01" value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)} placeholder="0.00" required />
                  </div>
                  <div>
                    <label className="label">Purchase date</label>
                    <input className="input" type="date" value={buyDate} onChange={(e) => setBuyDate(e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Quantity</label>
                    <input
                      className={`input ${hasBuyAmount ? 'opacity-45 bg-gray-50' : ''}`}
                      type="number" step="0.001" min="0.001" value={buyQty}
                      onChange={(e) => { setBuyQty(e.target.value); if (e.target.value) setBuyAmount(''); }}
                      placeholder="0" required={!hasBuyAmount} disabled={hasBuyAmount} />
                  </div>
                  <div>
                    <label className="label">Amount to spend</label>
                    <input
                      className={`input ${hasBuyQty ? 'opacity-45 bg-gray-50' : ''}`}
                      type="number" step="0.01" min="0.01" value={buyAmount}
                      onChange={(e) => { setBuyAmount(e.target.value); if (e.target.value) setBuyQty(''); }}
                      placeholder="500.00" disabled={hasBuyQty} />
                    {calculatedBuyQty !== null && (
                      <p className="text-xs text-gray-400 mt-1">≈ {calculatedBuyQty.toFixed(4)} shares</p>
                    )}
                  </div>
                </div>
                {totalCost !== null && (
                  <p className="text-xs text-gray-500">
                    Total cost: <span className="font-semibold text-gray-800">
                      {formatCurrency(totalCost, activePortfolio?.currency ?? 'AUD')}
                    </span>
                  </p>
                )}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowBuy(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={buying} className="btn-primary flex-1">
                    {buying ? 'Buying…' : 'Buy'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Sell panel */}
          {sellTarget && (
            <div className="card p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Sell {sellTarget.code}</h2>
                <button onClick={() => setSellTarget(null)} className="p-1.5 rounded-[8px] hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                You hold <span className="font-semibold text-gray-800">{sellTarget.quantity}</span> shares ·
                Current P&L: <span className={`font-semibold ${gainLossColor(sellTarget.gainLoss)}`}>
                  {formatPercent(sellTarget.gainLossPct)}
                </span>
              </p>
              <form onSubmit={handleSell} className="space-y-4">
                <div>
                  <label className="label">Quantity to sell (leave blank to sell all)</label>
                  <input className="input" type="number" step="0.001" min="0.001" max={sellTarget.quantity}
                    value={sellQty} onChange={(e) => setSellQty(e.target.value)}
                    placeholder={`Max ${sellTarget.quantity}`} />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setSellTarget(null)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={selling} className="btn-primary flex-1">
                    {selling ? 'Selling…' : `Sell ${sellQty || 'all'}`}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Holdings list */}
          {holdingsLoading ? (
            <div className="card p-10 flex justify-center"><LoadingSpinner /></div>
          ) : holdingsWithPnL.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="empty-state-icon mx-auto">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-base font-semibold text-gray-700 mb-1">No holdings yet</h2>
              <p className="text-sm text-gray-400 mb-4">Use "Buy stock" above to add your first position.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {holdingsWithPnL.map((h) => <HoldingRow key={h.id} h={h} currency={activePortfolio?.currency ?? 'AUD'} onSell={() => setSellTarget(h)} />)}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        open={resetModal}
        title="Reset portfolio?"
        message="All holdings will be deleted and cash restored to the starting amount. This cannot be undone."
        confirmLabel="Reset"
        destructive
        loading={resetting}
        onConfirm={handleReset}
        onCancel={() => setResetModal(false)}
      />
      <ProModal
        open={proModal}
        reason="Free plan allows up to 5 holdings per portfolio. Upgrade to Pro for unlimited holdings."
        onClose={() => setProModal(false)}
      />
    </div>
  );
}

function HoldingRow({ h, currency, onSell }: { h: HoldingWithPnL; currency: string; onSell: () => void }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="icon-box-md flex-shrink-0">
        <span className="text-xs font-bold text-brand-700">{h.code.slice(0, 2)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-bold text-gray-900">{h.code}</p>
          <span className={`badge border ${gainLossBg(h.gainLoss)}`}>
            {h.gainLoss >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {formatPercent(h.gainLossPct)}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {h.quantity} shares · Bought {formatDate(h.purchasedOn)} · {h.daysHeld}d held
        </p>
      </div>
      <div className="text-right flex-shrink-0 hidden sm:block">
        <p className="text-sm font-semibold text-gray-900">{formatCurrency(h.currentValue, currency)}</p>
        <p className="text-xs text-gray-400">
          {h.currentPrice != null ? formatCurrency(h.currentPrice, h.priceCurrency) : '—'} / share
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-semibold ${gainLossColor(h.gainLoss)}`}>
          {h.gainLoss >= 0 ? '+' : ''}{formatCurrency(h.gainLoss, currency)}
        </p>
        <button onClick={onSell} className="text-xs text-brand-600 font-medium hover:underline mt-0.5">Sell</button>
      </div>
    </div>
  );
}
