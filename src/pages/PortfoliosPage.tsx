import { useState, useEffect, useCallback } from 'react';
import { Briefcase, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { usePortfolios } from '../hooks/usePortfolios';
import { client, isPro, type Portfolio } from '../lib/api';
import { formatCurrency } from '../lib/format';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ConfirmModal } from '../components/ConfirmModal';
import { ProModal } from '../components/ProModal';
import { SEO } from '../components/SEO';
import { enqueueSnackbar } from 'notistack';
import { CURRENCIES } from '../lib/format';

export function PortfoliosPage() {
  const { profile, fetchProfile } = useProfile();
  const { portfolios, loading, fetchPortfolios } = usePortfolios();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Portfolio | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [proModal, setProModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('AUD');
  const [startingCash, setStartingCash] = useState('10000');
  const [creating, setCreating] = useState(false);

  const loadAll = useCallback(async () => {
    await Promise.all([fetchProfile(), fetchPortfolios()]);
    setPageLoading(false);
  }, [fetchProfile, fetchPortfolios]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cash = parseFloat(startingCash);
    if (!name.trim() || isNaN(cash) || cash <= 0) {
      enqueueSnackbar('Please fill in all fields correctly', { variant: 'error' });
      return;
    }
    setCreating(true);
    try {
      const result = await client.mutations.createPortfolio({
        name: name.trim(),
        currency,
        startingCash: cash,
      });
      const data = result.data;
      if (data?.errorCode === 'limit_reached') {
        setShowCreate(false);
        setProModal(true);
        return;
      }
      if (data?.error) throw new Error(data.error);
      enqueueSnackbar('Portfolio created!', { variant: 'success' });
      setShowCreate(false);
      setName('');
      setCurrency(profile?.currency ?? 'AUD');
      setStartingCash('10000');
      await fetchPortfolios();
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed to create portfolio', { variant: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await client.models.Portfolio.delete({ id: deleteTarget.id });
      enqueueSnackbar('Portfolio deleted', { variant: 'success' });
      setDeleteTarget(null);
      await fetchPortfolios();
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  if (pageLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <SEO title="Portfolios" noIndex />

      <div className="page-header">
        <div>
          <h1 className="page-title">Portfolios</h1>
          <p className="page-subtitle">{portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => fetchPortfolios()} disabled={loading} className="btn-secondary !py-2 !px-3">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            New portfolio
          </button>
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="card p-5 mb-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Create portfolio</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label" htmlFor="name">Portfolio name</label>
              <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Growth Strategy" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="currency">Currency</label>
                <select id="currency" className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="startingCash">Starting cash</label>
                <input id="startingCash" className="input" type="number" min="1" step="any"
                  value={startingCash} onChange={(e) => setStartingCash(e.target.value)} required />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={creating} className="btn-primary flex-1">
                {creating ? 'Creating…' : 'Create portfolio'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Portfolio list */}
      {portfolios.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="empty-state-icon mx-auto">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No portfolios yet</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Create a paper trading portfolio to start practising.</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Create portfolio
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {portfolios.map((p) => (
            <div key={p.id} className="card p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="icon-box-md flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-brand-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Cash: {formatCurrency(p.cash, p.currency)} · Start: {formatCurrency(p.startingCash, p.currency)} · {p.currency}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeleteTarget(p)}
                className="p-2 rounded-[8px] text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete portfolio?"
        message={`"${deleteTarget?.name}" and all its holdings will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ProModal
        open={proModal}
        reason="The free plan allows 1 portfolio. Upgrade to Pro for unlimited portfolios."
        onClose={() => setProModal(false)}
      />
    </div>
  );
}
