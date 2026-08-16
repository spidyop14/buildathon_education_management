import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Toast, ToastType } from '@/types';
import { Icon } from '@/components/ui/Icon';

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const TOAST_ICONS: Record<ToastType, { name: string; color: string }> = {
  success: { name: 'check', color: 'text-sage-400' },
  error: { name: 'x', color: 'text-rose-400' },
  warning: { name: 'alert', color: 'text-amber-400' },
  info: { name: 'sparkles', color: 'text-cobalt-400' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const icon = TOAST_ICONS[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 24, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto bg-ink-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-pop flex items-center gap-2 max-w-sm"
              >
                <Icon name={icon.name as any} size={15} className={icon.color} />
                {t.message}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
