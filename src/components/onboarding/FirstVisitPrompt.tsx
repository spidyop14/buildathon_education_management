import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

interface FirstVisitPromptProps {
  onStartTour: () => void;
}

const DISMISS_KEY = 'eduiq_tour_prompt_dismissed';

export function FirstVisitPrompt({ onStartTour }: FirstVisitPromptProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (!dismissed) {
        setVisible(true);
      }
    } catch (e) {
      console.error('Error checking tour prompt status:', e);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, 'true');
    } catch (e) {
      console.error('Error saving prompt dismiss status:', e);
    }
    setVisible(false);
  };

  const handleStart = () => {
    handleDismiss();
    onStartTour();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm w-full bg-white rounded-2xl p-4 sm:p-5 border border-cobalt-200 shadow-pop space-y-3 font-body text-ink-900 overflow-hidden"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cobalt-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Icon name="sparkles" size={16} />
              </div>
              <div>
                <h4 className="text-sm font-display font-bold text-ink-950">New to EduIQ?</h4>
                <p className="text-xs text-ink-500">Take a 2-minute tour of your workspace.</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 text-ink-400 hover:text-ink-950 rounded-lg hover:bg-ink-100 transition-colors"
            >
              <Icon name="x" size={14} />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-xs">
              Maybe later
            </Button>
            <Button variant="accent" size="sm" onClick={handleStart} className="text-xs shadow-glow">
              Explore workspace &rarr;
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FirstVisitPrompt;
