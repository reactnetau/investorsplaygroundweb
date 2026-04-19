import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { client } from '../lib/api';
import { CURRENCIES } from '../lib/format';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SEO } from '../components/SEO';
import { enqueueSnackbar } from 'notistack';

export function SettingsPage() {
  const { profile, loading, fetchProfile } = useProfile();
  const [currency, setCurrency] = useState('AUD');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) setCurrency(profile.currency ?? 'AUD');
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      await client.models.UserProfile.update({ id: profile.id, currency });
      await fetchProfile();
      enqueueSnackbar('Settings saved', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to save settings', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) return <LoadingSpinner fullScreen />;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <SEO title="Settings" noIndex />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Account</h2>
          <div>
            <label className="label">Email</label>
            <input className="input bg-gray-50" value={profile?.email ?? ''} disabled readOnly />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Preferences</h2>
          <div>
            <label className="label" htmlFor="currency">Default currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input max-w-xs"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1.5">Used as the default for new portfolios and display formatting.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : <><Save className="w-4 h-4" /> Save settings</>}
          </button>
        </div>
      </form>
    </div>
  );
}
