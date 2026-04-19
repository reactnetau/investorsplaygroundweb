import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { SEO } from '../components/SEO';

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      sessionStorage.setItem('reset_email', email);
      enqueueSnackbar('Reset code sent! Check your email.', { variant: 'success' });
      navigate('/reset-password');
    } catch (err: unknown) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed to send reset code', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <SEO title="Forgot Password" noIndex />
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot password</h1>
      <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send a reset code.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input pl-9" placeholder="you@example.com" required autoComplete="email" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Sending…' : 'Send reset code'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Back to sign in</Link>
      </p>
    </div>
  );
}
