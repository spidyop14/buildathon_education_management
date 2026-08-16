import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { RoleSelectionModal } from '@/components/auth/RoleSelectionModal';
import type { UserRole } from '@/types';

function SocialIcon({ microsoft = false }: { microsoft?: boolean }) {
  return microsoft ? (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  ) : (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const defaultRole: UserRole =
    initialRoleParam === 'teacher'
      ? 'teacher'
      : initialRoleParam === 'admin'
      ? 'admin'
      : 'student';

  const { register, signInWithOAuth, isAuthenticated, user } = useAuth();

  const [role, setRole] = useState<UserRole>(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [academicYear, setAcademicYear] = useState('Junior');
  const [facultyId, setFacultyId] = useState('');
  const [terms, setTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [busy, setBusy] = useState<'email' | 'google' | 'azure' | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // OAuth Modal state
  const [pendingOAuthProvider, setPendingOAuthProvider] = useState<'Google' | 'Microsoft' | null>(null);

  // Live simulation metrics
  const [metrics, setMetrics] = useState({ index: 71, attendance: 68, assignments: 74, exams: 73 });
  const [aiInsightState, setAiInsightState] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMetrics({ index: 78, attendance: 86, assignments: 91, exams: 84 });
      setAiInsightState(1);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const passwordStrength = useMemo(() => {
    if (!password) return null;
    if (password.length < 6) return { label: 'Weak', tone: 'rose', percent: 33 };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { label: 'Strong', tone: 'sage', percent: 100 };
    }
    return { label: 'Fair', tone: 'amber', percent: 66 };
  }, [password]);

  const handleOAuthClick = (provider: 'Google' | 'Microsoft') => {
    setError('');
    setPendingOAuthProvider(provider);
  };

  const handleConfirmOAuthRole = async (confirmedRole: UserRole) => {
    const providerKey = pendingOAuthProvider === 'Google' ? 'google' : 'azure';
    const providerTitle = pendingOAuthProvider || 'Social';
    setPendingOAuthProvider(null);
    setBusy(providerKey);

    try {
      const res = await signInWithOAuth(providerKey, confirmedRole);
      setSuccessMessage(`Welcome! Creating your ${providerTitle} session...`);
      setTimeout(() => {
        const destRole = res?.role || confirmedRole;
        navigate(`/${destRole}/dashboard`);
      }, 500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not complete sign in.');
      setBusy(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid academic email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!terms) {
      setError('Please accept the Terms of Service.');
      return;
    }

    setBusy('email');

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        department,
        academicYear: role === 'student' ? academicYear : undefined,
        facultyId: role === 'teacher' ? facultyId : undefined,
      });

      setSuccessMessage('Welcome to EduIQ! Workspace created...');
      setTimeout(() => {
        if (result.user) {
          navigate(`/${result.user.role}/dashboard`);
        }
      }, 600);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create your account.');
      setBusy(null);
    }
  };

  return (
    <div className="bg-[#FAFBFD] font-body text-ink-900 selection:bg-cobalt-100 flex flex-col justify-between overflow-x-hidden min-h-[calc(100vh-72px)] py-8">
      {/* ROLE SELECTION MODAL FOR OAUTH */}
      <RoleSelectionModal
        open={!!pendingOAuthProvider}
        onClose={() => setPendingOAuthProvider(null)}
        onConfirmRole={handleConfirmOAuthRole}
        initialRole={role}
        providerName={pendingOAuthProvider || undefined}
      />

      {/* MAIN REGISTRATION HERO */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-6 space-y-8 pt-2"
        >
          <div className="space-y-4">
            <Badge tone="cobalt" className="px-3.5 py-1 rounded-full inline-flex items-center gap-2 border border-cobalt-200 bg-white shadow-xs">
              <Icon name="sparkles" className="w-3.5 h-3.5 text-cobalt-600" />
              <span className="text-xs font-semibold text-cobalt-900 tracking-wide uppercase">
                ACADEMIC INTELLIGENCE PLATFORM
              </span>
            </Badge>

            <h1 className="text-3xl sm:text-5xl font-display font-bold text-ink-950 tracking-tight leading-tight">
              Your academic workspace <br />
              <span className="text-gradient">starts here.</span>
            </h1>

            <p className="text-sm sm:text-base text-ink-500 max-w-lg leading-relaxed">
              Connect learning, attendance, assessments and academic intelligence in one focused workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-ink-700">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-ink-150 shadow-xs">
              <span className="text-cobalt-600 font-bold">✓</span>
              <span>Personalized academic insights</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-ink-150 shadow-xs">
              <span className="text-cobalt-600 font-bold">✓</span>
              <span>Courses, assignments & exams</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-ink-150 shadow-xs">
              <span className="text-cobalt-600 font-bold">✓</span>
              <span>AI performance recommendations</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-ink-150 shadow-xs">
              <span className="text-cobalt-600 font-bold">✓</span>
              <span>For students, teachers & admins</span>
            </div>
          </div>

          <Card className="p-6 bg-white border border-ink-150 shadow-pop space-y-5 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-ink-150 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sage-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-ink-900 uppercase">EduIQ Intelligence Preview</span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-ink-400">Live Simulation</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-ink-950 text-white">
                <span className="text-[10px] uppercase font-semibold text-ink-400">Academic Index</span>
                <div className="font-mono text-xl font-bold text-white mt-0.5">{metrics.index} / 100</div>
              </div>
              <div className="p-3 rounded-2xl bg-ink-50 border border-ink-150">
                <span className="text-[10px] uppercase font-semibold text-ink-400">Attendance</span>
                <div className="font-mono text-xl font-bold text-cobalt-600 mt-0.5">{metrics.attendance}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-ink-50 border border-ink-150">
                <span className="text-[10px] uppercase font-semibold text-ink-400">Assignments</span>
                <div className="font-mono text-xl font-bold text-sage-600 mt-0.5">{metrics.assignments}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-ink-50 border border-ink-150">
                <span className="text-[10px] uppercase font-semibold text-ink-400">Examinations</span>
                <div className="font-mono text-xl font-bold text-cobalt-600 mt-0.5">{metrics.exams}%</div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={aiInsightState}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="p-3.5 rounded-2xl bg-cobalt-50/70 border border-cobalt-200 text-xs text-ink-900 flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-xl bg-cobalt-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="sparkles" size={14} />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-cobalt-950 block">✦ AI Insight Recommendation</span>
                  <p className="text-ink-700 leading-relaxed text-[11px]">
                    {aiInsightState === 0
                      ? 'Analyzing attendance logs and calculus assessment trajectories...'
                      : 'Mathematics performance is improving (+6.2%). Keep your current study pattern.'}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* RIGHT COLUMN: REGISTRATION CARD */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-6 flex justify-center lg:justify-end w-full"
        >
          <Card className="w-full max-w-[540px] p-6 sm:p-9 bg-white border border-ink-150 shadow-pop rounded-3xl space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink-950">Create your EduIQ account</h2>
              <p className="text-xs text-ink-500 mt-1">Set up your academic workspace in less than a minute.</p>
            </div>

            {error && (
              <div role="alert" className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <Icon name="alert" size={16} className="text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-sage-50 border border-sage-200 text-xs font-semibold text-sage-800 flex items-center gap-2">
                <Icon name="check" size={16} className="text-sage-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* 3 ROLE SELECTOR CARDS */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-ink-700 block">Continue as</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === 'student'
                      ? 'border-cobalt-500 bg-cobalt-50/70 ring-2 ring-cobalt-200 shadow-xs'
                      : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon name="user" size={16} className={role === 'student' ? 'text-cobalt-600' : 'text-ink-400'} />
                    {role === 'student' && <Icon name="check" size={13} className="text-cobalt-600 font-bold" />}
                  </div>
                  <b className="block text-xs font-bold text-ink-950 mt-1.5">Student</b>
                  <span className="text-[9px] text-ink-500 block leading-tight">Track & improve</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === 'teacher'
                      ? 'border-cobalt-500 bg-cobalt-50/70 ring-2 ring-cobalt-200 shadow-xs'
                      : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon name="users" size={16} className={role === 'teacher' ? 'text-cobalt-600' : 'text-ink-400'} />
                    {role === 'teacher' && <Icon name="check" size={13} className="text-cobalt-600 font-bold" />}
                  </div>
                  <b className="block text-xs font-bold text-ink-950 mt-1.5">Teacher</b>
                  <span className="text-[9px] text-ink-500 block leading-tight">Guide & manage</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === 'admin'
                      ? 'border-cobalt-500 bg-cobalt-50/70 ring-2 ring-cobalt-200 shadow-xs'
                      : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon name="cap" size={16} className={role === 'admin' ? 'text-cobalt-600' : 'text-ink-400'} />
                    {role === 'admin' && <Icon name="check" size={13} className="text-cobalt-600 font-bold" />}
                  </div>
                  <b className="block text-xs font-bold text-ink-950 mt-1.5">Admin</b>
                  <span className="text-[9px] text-ink-500 block leading-tight">Governance</span>
                </button>
              </div>
            </div>

            {/* OAUTH BUTTONS */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!!busy}
                onClick={() => handleOAuthClick('Google')}
                className="h-12 px-4 rounded-2xl border border-ink-200 bg-white hover:bg-ink-50 font-semibold text-xs text-ink-800 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <SocialIcon />
                <span>{busy === 'google' ? 'Connecting...' : 'Google'}</span>
              </button>

              <button
                type="button"
                disabled={!!busy}
                onClick={() => handleOAuthClick('Microsoft')}
                className="h-12 px-4 rounded-2xl border border-ink-200 bg-white hover:bg-ink-50 font-semibold text-xs text-ink-800 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <SocialIcon microsoft />
                <span>{busy === 'azure' ? 'Connecting...' : 'Microsoft'}</span>
              </button>
            </div>

            {/* DIVIDER */}
            <div className="relative text-center border-t border-ink-150 my-1">
              <span className="relative -top-2.5 bg-white px-3 text-[10px] font-mono font-bold text-ink-400 uppercase tracking-wider">
                OR
              </span>
            </div>

            {/* EMAIL FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Full name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Whitfield"
                  className="w-full h-12 border border-ink-200 rounded-2xl px-4 text-xs font-medium focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Academic email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@eduiq.edu"
                  className="w-full h-12 border border-ink-200 rounded-2xl px-4 text-xs font-medium focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block text-xs font-semibold text-ink-700 mb-1">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 border border-ink-200 rounded-2xl pl-4 pr-10 text-xs font-medium focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-ink-400 hover:text-ink-700 transition-colors"
                  >
                    <Icon name={showPassword ? 'x' : 'user'} size={15} />
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-ink-700 mb-1">Confirm password</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 border border-ink-200 rounded-2xl pl-4 pr-10 text-xs font-medium focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-8 text-ink-400 hover:text-ink-700 transition-colors"
                  >
                    <Icon name={showConfirmPassword ? 'x' : 'user'} size={15} />
                  </button>
                </div>
              </div>

              {passwordStrength && (
                <div className="space-y-1 pt-0.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-ink-500">
                    <span>Password Strength</span>
                    <span className={passwordStrength.tone === 'sage' ? 'text-sage-600' : passwordStrength.tone === 'amber' ? 'text-amber-600' : 'text-rose-600'}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.tone === 'sage'
                          ? 'bg-sage-500'
                          : passwordStrength.tone === 'amber'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${passwordStrength.percent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-12 border border-ink-200 rounded-2xl px-4 text-xs font-medium bg-white focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-500 transition-all"
                  >
                    <option>Computer Science</option>
                    <option>Data Science</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Engineering</option>
                    <option>Administration</option>
                  </select>
                </div>

                {role === 'student' ? (
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Academic year</label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full h-12 border border-ink-200 rounded-2xl px-4 text-xs font-medium bg-white focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-500 transition-all"
                    >
                      <option>Freshman</option>
                      <option>Sophomore</option>
                      <option>Junior</option>
                      <option>Senior</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">
                      {role === 'admin' ? 'Admin Identifier' : 'Faculty ID'}
                    </label>
                    <input
                      type="text"
                      required
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value)}
                      placeholder={role === 'admin' ? 'e.g. ADM-2026-01' : 'e.g. FAC-2026-09'}
                      className="w-full h-12 border border-ink-200 rounded-2xl px-4 text-xs font-medium focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-500 transition-all"
                    />
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2.5 text-xs text-ink-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="mt-0.5 accent-cobalt-600 rounded w-4 h-4"
                />
                <span>
                  I agree to the{' '}
                  <a href="/#terms" className="font-semibold text-cobalt-600 underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="/#privacy" className="font-semibold text-cobalt-600 underline">Privacy Policy</a>.
                </span>
              </label>

              <Button
                disabled={!!busy}
                type="submit"
                variant="accent"
                className="w-full h-12 rounded-2xl shadow-glow text-sm font-semibold flex items-center justify-center gap-2"
              >
                {busy === 'email' ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Creating your workspace...</span>
                  </>
                ) : (
                  'Create my account \u2192'
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-ink-500 pt-2 border-t border-ink-150">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-cobalt-600 hover:text-cobalt-800 transition-colors">
                Sign in &rarr;
              </Link>
            </p>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
