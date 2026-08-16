import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
  onReplayIntro: () => void;
}

export function HelpModal({ open, onClose, onReplayIntro }: HelpModalProps) {
  const { user } = useAuth();
  const role: UserRole = user?.role || 'student';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-ink-150 shadow-pop space-y-6 z-10"
          >
            <div className="flex items-center justify-between border-b border-ink-150 pb-3">
              <div className="flex items-center gap-2">
                <Icon name="help" size={18} className="text-cobalt-600" />
                <h3 className="font-display font-bold text-lg text-ink-950">EduIQ Product Guide & Help</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-ink-400 hover:text-ink-900 rounded-full hover:bg-ink-100"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-cobalt-50/70 border border-cobalt-200 text-ink-900 space-y-1">
                <span className="font-bold text-cobalt-950 flex items-center gap-1.5">
                  <Icon name="sparkles" size={14} className="text-cobalt-600" />
                  What is EduIQ?
                </span>
                <p className="text-ink-700 leading-relaxed text-[11px]">
                  EduIQ is an Academic Intelligence Platform that turns raw learning data (attendance, assignments, exams, grades) into actionable insights and personalized guidance.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-ink-900 block uppercase text-[10px] font-mono text-ink-400">
                  Quick Guide for {role.toUpperCase()}
                </span>
                <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150 space-y-2 leading-relaxed text-[11px] text-ink-700">
                  {role === 'student' ? (
                    <ul className="space-y-1.5 list-disc list-inside">
                      <li>Check your <b>Academic Index / 100</b> on the Student Dashboard.</li>
                      <li>Review pending <b>Assignments</b> and submit coursework online.</li>
                      <li>Take interactive examinations under <b>Examinations</b>.</li>
                      <li>Inspect AI risk warnings & study recommendations under <b>My Progress</b>.</li>
                    </ul>
                  ) : role === 'teacher' ? (
                    <ul className="space-y-1.5 list-disc list-inside">
                      <li>Log section attendance in real-time under <b>Attendance</b>.</li>
                      <li>Grade coursework submissions using the <b>AI Grading Assistant</b>.</li>
                      <li>Build & schedule MCQ examinations under <b>Examinations</b>.</li>
                      <li>Monitor class risk signals under <b>Academic Insights</b>.</li>
                    </ul>
                  ) : (
                    <ul className="space-y-1.5 list-disc list-inside">
                      <li>Govern institutional cohorts across <b>Students</b>, <b>Teachers</b>, and <b>Courses</b>.</li>
                      <li>View system-wide attendance & grade trajectories under <b>Analytics</b>.</li>
                      <li>Generate official printable transcripts under <b>Reports</b>.</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-ink-150">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onClose();
                  onReplayIntro();
                }}
                className="rounded-xl text-xs font-semibold"
              >
                <Icon name="sparkles" size={14} />
                <span>Replay Product Intro</span>
              </Button>

              <Button variant="accent" size="sm" onClick={onClose} className="rounded-xl">
                Close Guide
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default HelpModal;
