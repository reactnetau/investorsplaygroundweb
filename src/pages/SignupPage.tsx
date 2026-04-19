import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CURRENCIES } from '../lib/format';
import { SEO } from '../components/SEO';
import { enqueueSnackbar } from 'notistack';

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currency, setCurrency] = useState('AUD');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      enqueueSnackbar('Password must be at least 8 characters', { variant: 'error' });
      return;
    }
    setLoading(true);
    try {
      sessionStorage.setItem('pending_password', password);
      await register(email, password, currency);
      navigate('/confirm');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      if (msg.includes('already exists') || msg.includes('UsernameExistsException')) {
        enqueueSnackbar('An account with this email already exists. Try signing in.', { variant: 'error' });
      } else {
        enqueueSnackbar(msg, { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <SEO title="Create Account" description="Create a free account to start paper trading." canonical="/signup" />
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
      <p className="text-sm text-gray-500 mb-6">Start paper trading for free</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input pl-9" placeholder="you@example.com" required autoComplete="email" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="input pl-9" placeholder="Min. 8 characters" required autoComplete="new-password" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="currency">Default currency</label>
          <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="input">
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? 'Creating account…' : 'Create free account'}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-400">
        Free plan: 1 portfolio, 5 holdings. No credit card required.
      </p>
      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
      </p>
    </div>
  );
}
