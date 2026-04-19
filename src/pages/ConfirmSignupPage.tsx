import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { SEO } from '../components/SEO';

export function ConfirmSignupPage() {
  const { confirmRegistration } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(sessionStorage.getItem('pending_email') ?? '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { enqueueSnackbar('Email is required', { variant: 'error' }); return; }
    setLoading(true);
    try {
      await confirmRegistration(email, code);
      enqueueSnackbar('Account confirmed! Welcome to Investors Playground.', { variant: 'success' });
      navigate('/dashboard');
    } catch (err: unknown) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Confirmation failed', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <SEO title="Confirm Account" noIndex />
      <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
        <KeyRound className="w-6 h-6 text-brand-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Check your email</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">
        We sent a 6-digit code to{' '}
        <span className="font-medium text-gray-700">{email || 'your email'}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!email && (
          <div>
            <label className="label" htmlFor="email">Email address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input" required />
          </div>
        )}
        <div>
          <label className="label" htmlFor="code">Verification code</label>
          <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)}
            className="input text-center tracking-widest text-xl font-mono"
            placeholder="000000" maxLength={6} required autoFocus />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Verifying…' : 'Confirm account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
