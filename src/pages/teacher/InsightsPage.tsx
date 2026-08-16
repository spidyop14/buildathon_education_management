import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { MOCK_STUDENTS } from '@/data/mock';

interface AcademicSignal {
  id: string;
  type: 'performance' | 'positive' | 'attendance';
  title: string;
  subtitle: string;
  evidence: string;
  affectedCount: number;
  trend: 'declining' | 'improving' | 'warning';
  recommendedAction: string;
}

const SIGNALS: AcademicSignal[] = [
  {
    id: 'signal-1',
    type: 'performance',
    title: 'Calculus Performance Drop Signal',
    subtitle: 'Calculus & Linear Algebra performance has dropped 8.4% over the last 3 assessments.',
    evidence: 'Calculus test averages dropped from 74% to 65.6%. 12 students scored below 60%.',
    affectedCount: 12,
    trend: 'declining',
    recommendedAction: 'Schedule a focused revision workshop on Integration by Parts & Series Convergence.',
  },
  {
    id: 'signal-2',
    type: 'positive',
    title: 'Data Science Assignment Velocity',
    subtitle: 'Assignment completion rate increased 14% this month across Data Science cohorts.',
    evidence: 'Problem set submission velocity reached 92% completion prior to due date.',
    affectedCount: 42,
    trend: 'improving',
    recommendedAction: 'Introduce advance machine learning coursework & exploratory data projects.',
  },
  {
    id: 'signal-3',
    type: 'attendance',
    title: 'Friday Attendance Drop-off Threshold',
    subtitle: '6 students are below the 75% recommended institutional attendance threshold.',
    evidence: 'Friday morning lab attendance displays a 9.4% drop relative to Tuesday sessions.',
    affectedCount: 6,
    trend: 'warning',
    recommendedAction: 'Issue automated attendance threshold warning alerts to affected students.',
  },
];

export default function TeacherInsights() {
  const [selectedSignal, setSelectedSignal] = useState<AcademicSignal | null>(null);

  return (
    <div className="space-y-8 font-body">
      {/* HEADER BAR */}
      <div className="bg-ink-950 text-white p-6 sm:p-10 rounded-3xl border border-ink-800 shadow-pop space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <Icon name="sparkles" size={20} className="text-cobalt-400" />
          <Badge tone="cobalt" className="px-3 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
            EDUIQ ACADEMIC PULSE
          </Badge>
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
          Your classroom, understood.
        </h2>
        <p className="text-xs sm:text-sm text-ink-300 max-w-2xl leading-relaxed">
          EduIQ synthesizes student coursework, attendance logs, and examination trajectories into actionable academic signals.
        </p>

        {/* ANIMATED ACADEMIC PULSE NODES */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-cobalt-300 uppercase">Performance Node</span>
            <div className="font-mono text-xl font-bold text-white">82% Avg</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-sage-300 uppercase">Attendance Node</span>
            <div className="font-mono text-xl font-bold text-sage-400">86% Logged</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-cobalt-300 uppercase">Coursework Node</span>
            <div className="font-mono text-xl font-bold text-white">92% Done</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-rose-300 uppercase">Risk Signals</span>
            <div className="font-mono text-xl font-bold text-rose-400">3 Signals</div>
          </div>
        </div>
      </div>

      {/* ACADEMIC SIGNAL CARDS */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-ink-950">Active Classroom Signals</h3>

        {SIGNALS.map((signal) => (
          <Card
            key={signal.id}
            onClick={() => setSelectedSignal(signal)}
            className={`p-6 border shadow-card hover:shadow-pop transition-all cursor-pointer rounded-3xl space-y-3 ${
              signal.type === 'performance'
                ? 'bg-rose-50/30 border-rose-200'
                : signal.type === 'positive'
                ? 'bg-sage-50/30 border-sage-200'
                : 'bg-amber-50/30 border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                signal.type === 'performance' ? 'text-rose-600' : signal.type === 'positive' ? 'text-sage-600' : 'text-amber-600'
              }`}>
                {signal.type === 'performance' ? '⚠ Performance Signal' : signal.type === 'positive' ? '✓ Positive Signal' : '⚠ Attendance Threshold Signal'}
              </span>

              <Badge tone={signal.trend === 'improving' ? 'sage' : 'rose'}>
                {signal.affectedCount} Students Affected
              </Badge>
            </div>

            <h4 className="font-display font-bold text-lg text-ink-950">{signal.title}</h4>
            <p className="text-xs text-ink-600 leading-relaxed">{signal.subtitle}</p>

            <div className="pt-2 flex items-center justify-between text-xs font-semibold text-cobalt-600">
              <span>Understand why & view evidence &rarr;</span>
              <Icon name="arrowRight" size={14} />
            </div>
          </Card>
        ))}
      </div>

      {/* INTELLIGENCE DRAWER */}
      <AnimatePresence>
        {selectedSignal && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSignal(null)}
              className="fixed inset-0 bg-ink-950/40 backdrop-blur-xs"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col font-body border-l border-ink-150"
            >
              <div className="p-6 border-b border-ink-150 flex items-center justify-between bg-ink-950 text-white">
                <div>
                  <span className="font-mono text-xs text-cobalt-300 font-bold uppercase">Signal Analysis</span>
                  <h3 className="font-display font-bold text-lg text-white mt-0.5">{selectedSignal.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedSignal(null)}
                  className="p-2 text-ink-400 hover:text-white rounded-full hover:bg-white/10"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-ink-400">Signal Overview</span>
                  <p className="text-ink-800 leading-relaxed font-medium text-xs">{selectedSignal.subtitle}</p>
                </div>

                <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-ink-400">Empirical Evidence</span>
                  <p className="text-ink-700 leading-relaxed text-xs">{selectedSignal.evidence}</p>
                </div>

                <div className="p-4 rounded-2xl bg-cobalt-50/70 border border-cobalt-200 space-y-1">
                  <span className="font-bold text-cobalt-950 flex items-center gap-1.5">
                    <Icon name="sparkles" size={14} className="text-cobalt-600" />
                    Recommended Intervention
                  </span>
                  <p className="text-ink-700 leading-relaxed text-[11px]">{selectedSignal.recommendedAction}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-ink-900 block">Affected Cohort Sample</span>
                  <div className="space-y-2">
                    {MOCK_STUDENTS.slice(0, 3).map((s) => (
                      <div key={s.id} className="p-3 rounded-2xl bg-ink-50 border border-ink-150 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-ink-950">{s.name}</div>
                          <div className="text-[10px] text-ink-400 font-mono">{s.code}</div>
                        </div>
                        <Badge tone="rose">Requires Action</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-ink-150 bg-white">
                <Button variant="accent" className="w-full rounded-2xl shadow-glow">
                  Execute Intervention Action &rarr;
                </Button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
