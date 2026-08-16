import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { EduIQLogo } from '@/components/ui/EduIQLogo';
import { Icon } from '@/components/ui/Icon';
import { RoleSelectionModal } from '@/components/auth/RoleSelectionModal';
import type { UserRole } from '@/types';

function SocialIcon({ type }: { type: 'google' | 'microsoft' }) {
  return type === 'google' ? (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  ) : (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H1z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  );
}

function BrandPanel() {
  return (
    <aside className="lg:w-1/2 bg-ink-950 p-8 md:p-14 text-white flex-col justify-between relative overflow-hidden hidden lg:flex">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cobalt-600/20 rounded-full blur-3xl" />
      <EduIQLogo size={32} textColor="text-white" />
      <div className="relative space-y-6 max-w-lg">
        <p className="text-xs uppercase tracking-widest text-cobalt-300 font-mono">Academic Intelligence Platform</p>
        <h1 className="text-5xl font-display font-bold leading-tight">
          Understand your performance.<br />
          <span className="text-gradient">Improve with confidence.</span>
        </h1>
        <p className="text-ink-300 leading-relaxed text-sm">
          A connected workspace for learning, attendance, assessments, and academic intelligence.
        </p>
      </div>
      <p className="text-xs text-ink-400">&copy; 2026 EduIQ. All rights reserved.</p>
    </aside>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signInWithOAuth, isAuthenticated, isLoading: restoring, user } = useAuth();

  const [email, setEmail] = useState('maya.whitfield@eduiq.edu');
  const [password, setPassword] = useState('password123');
  const [busy, setBusy] = useState<'email' | 'google' | 'azure' | null>(null);
  const [error, setError] = useState('');

  // Role Modal state for OAuth
  const [pendingOAuthProvider, setPendingOAuthProvider] = useState<'Google' | 'Microsoft' | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleOAuthClick = (provider: 'Google' | 'Microsoft') => {
    setError('');
    setPendingOAuthProvider(provider);
  };

  const handleConfirmOAuthRole = async (confirmedRole: UserRole) => {
    const providerKey = pendingOAuthProvider === 'Google' ? 'google' : 'azure';
    setPendingOAuthProvider(null);
    setBusy(providerKey);

    try {
      const res = await signInWithOAuth(providerKey, confirmedRole);
      const destRole = res?.role || confirmedRole;
      navigate(`/${destRole}/dashboard`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to complete OAuth sign in.');
      setBusy(null);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy('email');
    try {
      const next = await signIn(email, password);
      navigate(`/${next.role}/dashboard`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to sign in.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-white flex font-body">
      {/* ROLE SELECTION MODAL */}
      <RoleSelectionModal
        open={!!pendingOAuthProvider}
        onClose={() => setPendingOAuthProvider(null)}
        onConfirmRole={handleConfirmOAuthRole}
        initialRole="student"
        providerName={pendingOAuthProvider || undefined}
      />

      <BrandPanel />

      <main className="flex-1 p-6 sm:p-10 flex flex-col justify-between items-center bg-[#FAFBFD]">
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-ink-150 shadow-pop space-y-6 my-auto"
        >
          <div>
            <h2 className="text-2xl font-display font-bold text-ink-950">Welcome back</h2>
            <p className="text-xs text-ink-500 mt-1">Sign in to access your EduIQ academic workspace.</p>
          </div>

          {error && (
            <div role="alert" className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <Icon name="alert" size={16} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SOCIAL BUTTONS */}
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={!!busy}
              onClick={() => handleOAuthClick('Google')}
              className="h-12 px-3 rounded-2xl border border-ink-200 bg-white hover:bg-ink-50 text-xs font-semibold text-ink-800 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <SocialIcon type="google" />
              <span>{busy === 'google' ? 'Connecting...' : 'Google'}</span>
            </button>
            <button
              disabled={!!busy}
              onClick={() => handleOAuthClick('Microsoft')}
              className="h-12 px-3 rounded-2xl border border-ink-200 bg-white hover:bg-ink-50 text-xs font-semibold text-ink-800 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <SocialIcon type="microsoft" />
              <span>{busy === 'azure' ? 'Connecting...' : 'Microsoft'}</span>
            </button>
          </div>

          <div className="relative text-center border-t border-ink-150 my-1">
            <span className="relative -top-2.5 bg-white px-3 text-[10px] font-mono font-bold text-ink-400 uppercase tracking-wider">
              OR
            </span>
          </div>

          {/* EMAIL & PASSWORD FORM */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1">Academic Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@eduiq.edu"
                className="w-full h-12 border border-ink-200 rounded-2xl px-4 text-xs font-medium focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 border border-ink-200 rounded-2xl px-4 text-xs font-medium focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-500 transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={!!busy || restoring}
              variant="accent"
              className="w-full h-12 rounded-2xl shadow-glow text-sm font-semibold flex items-center justify-center gap-2"
            >
              {busy === 'email' ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign in \u2192'
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-ink-500 pt-2 border-t border-ink-150">
            Don't have an account?{' '}
            <Link to="/register" className="text-cobalt-600 font-bold hover:text-cobalt-800 transition-colors">
              Create account &rarr;
            </Link>
          </p>
        </motion.div>

        <div className="text-[11px] text-ink-400 py-2 text-center">
          &copy; 2026 EduIQ Academic Intelligence Platform
        </div>
      </main>
    </div>
  );
}
