import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  type AuthUser,
} from 'aws-amplify/auth';
import { client } from '../lib/api';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, currency?: string) => Promise<void>;
  confirmRegistration: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmForgotPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  deleteCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      setUser(current);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    await signIn({ username: email, password });
    await refreshUser();
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const register = async (email: string, password: string, currency = 'AUD') => {
    await signUp({ username: email, password, options: { userAttributes: { email } } });
    sessionStorage.setItem('pending_currency', currency);
    sessionStorage.setItem('pending_email', email);
  };

  const confirmRegistration = async (email: string, code: string) => {
    await confirmSignUp({ username: email, confirmationCode: code });
    const pendingPassword = sessionStorage.getItem('pending_password') ?? '';
    const currency = sessionStorage.getItem('pending_currency') ?? 'AUD';
    sessionStorage.removeItem('pending_currency');
    sessionStorage.removeItem('pending_email');
    sessionStorage.removeItem('pending_password');

    try {
      await client.mutations.initializeUserProfile({ email, currency });
    } catch (err) {
      console.error('[Auth] initializeUserProfile failed:', err);
    }

    if (pendingPassword) {
      await signIn({ username: email, password: pendingPassword });
      await refreshUser();
    }
  };

  const forgotPassword = async (email: string) => {
    await resetPassword({ username: email });
  };

  const confirmForgotPassword = async (email: string, code: string, newPassword: string) => {
    await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
  };

  const deleteCurrentUser = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, register, confirmRegistration,
      forgotPassword, confirmForgotPassword, refreshUser, deleteCurrentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
