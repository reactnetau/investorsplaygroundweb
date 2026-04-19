import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { SEO } from '../components/SEO';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg.includes('User is not confirmed')) {
        sessionStorage.setItem('pending_email', email);
        navigate('/confirm');
      } else {
        enqueueSnackbar(msg, { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 shadow-md">
      <SEO title="Sign In" noIndex />
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
      <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

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
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="input pl-9" placeholder="••••••••" required autoComplete="current-password" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
