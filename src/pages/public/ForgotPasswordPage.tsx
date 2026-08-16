import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/hooks/useToast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setSubmitted(true);
    addToast('Demo reset link generated successfully', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-ink-150 shadow-pop space-y-6"
      >
        <div className="w-12 h-12 rounded-xl bg-cobalt-50 text-cobalt-600 flex items-center justify-center mx-auto shadow-xs">
          <Icon name="mail" size={24} />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-display font-bold text-ink-950">Forgot your password?</h1>
          <p className="text-xs sm:text-sm text-ink-500">
            Enter your academic email address and we'll help you recover your account.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-sage-50 border border-sage-150 text-center space-y-3">
            <div className="w-8 h-8 rounded-full bg-sage-500 text-white flex items-center justify-center mx-auto">
              <Icon name="check" size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-sage-900">Demo Reset Link Generated</p>
              <p className="text-xs text-sage-700 mt-1">
                A password recovery link has been prepared for <strong className="font-mono">{email}</strong>. In production mode, an email is dispatched instantly.
              </p>
            </div>
            <Link to="/login" className="inline-block pt-2 text-xs font-semibold text-cobalt-600 hover:underline">
              &rarr; Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ink-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@eduiq.edu"
                className="w-full border border-ink-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300 transition-all"
                required
              />
            </div>

            <Button type="submit" variant="accent" className="w-full py-3">
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-ink-100">
          <Link to="/login" className="text-xs font-medium text-ink-600 hover:text-ink-900">
            &larr; Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
