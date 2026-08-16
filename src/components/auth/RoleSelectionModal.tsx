import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { UserRole } from '@/types';

interface RoleSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirmRole: (role: UserRole) => void;
  initialRole?: UserRole;
  providerName?: string;
  existingUserRole?: UserRole;
}

const ROLES: Array<{
  id: UserRole;
  title: string;
  description: string;
  icon: 'user' | 'users' | 'cap';
}> = [
  {
    id: 'student',
    title: 'Student',
    description: 'Learn, track progress & improve',
    icon: 'user',
  },
  {
    id: 'teacher',
    title: 'Teacher',
    description: 'Manage learning, classes & students',
    icon: 'users',
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Manage the institution & academic operations',
    icon: 'cap',
  },
];

export function RoleSelectionModal({
  open,
  onClose,
  onConfirmRole,
  initialRole = 'student',
  providerName,
  existingUserRole,
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  useEffect(() => {
    if (existingUserRole) {
      setSelectedRole(existingUserRole);
    } else if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole, existingUserRole, open]);

  const handleConfirm = () => {
    onConfirmRole(selectedRole);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm"
          />

          {/* DIALOG PANEL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-ink-150 shadow-pop space-y-6 z-10"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 p-2 text-ink-400 hover:text-ink-900 rounded-full hover:bg-ink-100 transition-colors"
            >
              <Icon name="x" size={18} />
            </button>

            {/* HEADER */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cobalt-600">
                {providerName ? `${providerName} Authentication` : 'Workspace Selection'}
              </span>
              <h2 className="text-2xl font-display font-bold text-ink-950">How will you use EduIQ?</h2>
              <p className="text-xs text-ink-500">
                {existingUserRole
                  ? `Confirm or switch your academic workspace role.`
                  : `Choose your workspace to continue.`}
              </p>
            </div>

            {/* ROLE CARDS */}
            <div className="space-y-3">
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all hover:-translate-y-0.5 ${
                      isSelected
                        ? 'border-cobalt-500 bg-cobalt-50/70 ring-2 ring-cobalt-200 shadow-xs'
                        : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-cobalt-600 text-white' : 'bg-ink-100 text-ink-600'
                          }`}
                        >
                          <Icon name={r.icon} size={18} />
                        </div>
                        <div>
                          <b className="block text-sm font-bold text-ink-950">{r.title}</b>
                          <span className="text-xs text-ink-500 block">{r.description}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-cobalt-600 text-white flex items-center justify-center font-bold">
                          <Icon name="check" size={14} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3 pt-2">
              <Button variant="secondary" className="flex-1 rounded-2xl" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="accent"
                className="flex-1 rounded-2xl shadow-glow"
                onClick={handleConfirm}
                disabled={!selectedRole}
              >
                Continue &rarr;
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default RoleSelectionModal;
