import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-white rounded-2xl p-8 border border-ink-150 shadow-pop text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-cobalt-50 text-cobalt-600 flex items-center justify-center mx-auto shadow-sm">
          <span className="font-display font-bold text-2xl">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-display font-bold text-ink-950">Page Not Found</h1>
          <p className="text-sm text-ink-500">
            This academic path doesn't exist or may have been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button variant="accent" icon="home" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
