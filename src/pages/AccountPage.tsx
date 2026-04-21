import { useState, useEffect } from 'react';
import { Star, CreditCard, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { client, isPro } from '../lib/api';
import { formatDate } from '../lib/format';
import { ConfirmModal } from '../components/ConfirmModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SEO } from '../components/SEO';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export function AccountPage() {
  const { deleteCurrentUser } = useAuth();
  const { profile, loading, fetchProfile } = useProfile();
  const navigate = useNavigate();
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const pro = profile ? isPro(profile) : false;
  const isMobileSubscription = profile?.subscriptionProvider === 'revenuecat';

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const result = await client.queries.stripeCreateCheckout({
        returnUrl: window.location.origin,
      });
      if (result.data?.url) {
        window.location.href = result.data.url;
      } else {
        enqueueSnackbar(result.data?.error ?? 'Checkout failed', { variant: 'error' });
      }
    } catch {
      enqueueSnackbar('Upgrade failed', { variant: 'error' });
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const result = await client.queries.stripeCreatePortal({
        returnUrl: window.location.origin,
      });
      if (result.data?.url) {
        window.location.href = result.data.url;
      } else {
        enqueueSnackbar(result.data?.error ?? 'Portal unavailable', { variant: 'error' });
      }
    } catch {
      enqueueSnackbar('Portal unavailable', { variant: 'error' });
    } finally {
      setPortalLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const result = await client.mutations.stripeCancelSubscription();
      if (result.data?.ok) {
        enqueueSnackbar('Subscription will cancel at period end', { variant: 'success' });
        setCancelModal(false);
        fetchProfile();
      } else {
        enqueueSnackbar(result.data?.error ?? 'Cancel failed', { variant: 'error' });
      }
    } catch {
      enqueueSnackbar('Cancel failed', { variant: 'error' });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const result = await client.mutations.deleteAccount();
      if (!result.data?.ok) {
        throw new Error(result.data?.error ?? 'Account deletion failed');
      }
      await deleteCurrentUser();
      navigate('/');
      enqueueSnackbar('Account deleted', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(
        err instanceof Error ? `Account deletion failed: ${err.message}` : 'Account deletion failed. Please try again.',
        { variant: 'error' }
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && !profile) return <LoadingSpinner fullScreen />;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <SEO title="Account" noIndex />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account</h1>

      {/* Account details */}
      <div className="card p-6 mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Account details</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900">{profile?.email ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Member since</span>
            <span className="font-medium text-gray-900">{formatDate(profile?.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Membership</span>
            <span className={`inline-flex items-center gap-1 font-semibold ${pro ? 'text-brand-600' : 'text-gray-600'}`}>
              <Star className="w-3.5 h-3.5" />
              {pro ? 'Pro' : 'Free'}
            </span>
          </div>
          {profile?.subscriptionStatus && profile.subscriptionStatus !== 'inactive' && (
            <div className="flex justify-between">
              <span className="text-gray-500">Subscription</span>
              <span className="text-gray-700 capitalize">{profile.subscriptionStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Subscription */}
      <div className="card p-6 mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Subscription</h2>

        {pro ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              You're on the <strong>Pro plan</strong> — unlimited portfolios and holdings.
              {profile?.subscriptionEndDate && ` Renews ${formatDate(profile.subscriptionEndDate)}.`}
            </p>
            {isMobileSubscription ? (
              <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl text-sm text-brand-800">
                Your subscription was started on iOS or Android. To cancel, open the app on your mobile device and manage your subscription there.
              </div>
            ) : (
              <div className="flex gap-3 flex-wrap">
                <button onClick={handlePortal} disabled={portalLoading} className="btn-secondary">
                  <CreditCard className="w-4 h-4" />
                  {portalLoading ? 'Loading…' : 'Manage billing'}
                </button>
                <button
                  onClick={() => setCancelModal(true)}
                  disabled={cancelLoading}
                  className="btn-secondary !text-red-600 !border-red-200 hover:!bg-red-50"
                >
                  {cancelLoading ? 'Cancelling…' : 'Cancel subscription'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              You're on the <strong>Free plan</strong> — 1 portfolio, 5 holdings limit. Upgrade to Pro for unlimited portfolios and holdings.
            </p>
            <button onClick={handleUpgrade} disabled={upgradeLoading} className="btn-primary">
              {upgradeLoading ? 'Redirecting…' : <><Star className="w-4 h-4" /> Upgrade to Pro</>}
            </button>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="card p-6 border-red-200">
        <h2 className="text-base font-semibold text-red-700 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger zone
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Deleting your account is permanent and cannot be undone. All portfolios and holdings will be lost.
          {pro && !isMobileSubscription && ' Cancel your subscription first before deleting.'}
        </p>
        <button
          onClick={() => setDeleteModal(true)}
          disabled={pro && !isMobileSubscription}
          className="btn-danger"
          title={pro && !isMobileSubscription ? 'Cancel your subscription before deleting your account' : ''}
        >
          <Trash2 className="w-4 h-4" /> Delete account
        </button>
        {pro && !isMobileSubscription && (
          <p className="text-xs text-gray-400 mt-2">Cancel your subscription first to enable account deletion.</p>
        )}
      </div>

      <ConfirmModal
        open={cancelModal}
        title="Cancel subscription"
        message="Your Pro access will continue until the end of the current billing period, then you'll revert to the free plan."
        confirmLabel="Cancel subscription"
        loading={cancelLoading}
        onConfirm={handleCancel}
        onCancel={() => setCancelModal(false)}
      />

      <ConfirmModal
        open={deleteModal}
        title="Delete account"
        message="This will permanently delete your account and all associated data. This action cannot be undone."
        confirmLabel="Delete account"
        loading={deleteLoading}
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
}
