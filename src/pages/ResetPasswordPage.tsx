import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { SEO } from '../components/SEO';

export function ResetPasswordPage() {
  const { confirmForgotPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(sessionStorage.getItem('reset_email') ?? '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      enqueueSnackbar('Password must be at least 8 characters', { variant: 'error' });
      return;
    }
    setLoading(true);
    try {
      await confirmForgotPassword(email, code, newPassword);
      sessionStorage.removeItem('reset_email');
      enqueueSnackbar('Password reset! Sign in with your new password.', { variant: 'success' });
      navigate('/login');
    } catch (err: unknown) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Reset failed', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <SEO title="Reset Password" noIndex />
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset password</h1>
      <p className="text-sm text-gray-500 mb-6">Enter the code from your email and your new password.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!email && (
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input" required />
          </div>
        )}
        <div>
          <label className="label" htmlFor="code">Reset code</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)}
              className="input pl-9 tracking-widest font-mono" placeholder="000000" maxLength={6} required />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="newPassword">New password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="input pl-9" placeholder="Min. 8 characters" required autoComplete="new-password" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Resetting…' : 'Reset password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Back to sign in</Link>
      </p>
    </div>
  );
}
