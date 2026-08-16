import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { EduIQLogo } from '@/components/ui/EduIQLogo';

export default function AIIntelligencePage() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<'math' | 'ds' | 'physics'>('math');

  const subjectData = {
    math: {
      name: 'Mathematics & Calculus',
      score: '58%',
      trend: 'declining',
      attendance: '68%',
      assignments: '54%',
      insight: 'Mathematics score has dropped across 3 consecutive evaluations (64% → 61% → 58%). Attendance is below the 75% target threshold.',
      recommendation: 'Prioritize integration fundamentals. Complete Problem Set 6 and schedule 2 focused revision sessions before Friday.',
    },
    ds: {
      name: 'Data Science & Analytics',
      score: '79%',
      trend: 'improving',
      attendance: '88%',
      assignments: '82%',
      insight: 'Data Science performance is on a steady upward trajectory (+9% this month). Strong practical lab engagement.',
      recommendation: 'Maintain current study rhythm. Prepare for the upcoming Machine Learning midterm evaluation.',
    },
    physics: {
      name: 'Physics & Thermodynamics',
      score: '68%',
      trend: 'stable',
      attendance: '76%',
      assignments: '74%',
      insight: 'Physics performance is stable near class average. Attendance meets institutional target.',
      recommendation: 'Review electromagnetism problem sets to push grade trajectory into the Merit category.',
    },
  };

  const current = subjectData[selectedSubject];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#FAFBFD] font-body text-ink-900 pt-24 pb-20 px-4 sm:px-8 space-y-16"
    >
      {/* HERO SECTION */}
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <Badge tone="cobalt" className="px-3.5 py-1 rounded-full border border-cobalt-200 bg-white">
          <Icon name="sparkles" className="w-3.5 h-3.5 text-cobalt-600 mr-1.5" />
          <span>EduIQ Deterministic AI Engine</span>
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-display font-bold text-ink-950 tracking-tight leading-tight">
          An academic copilot that <br />
          <span className="text-gradient">understands performance signals.</span>
        </h1>

        <p className="text-base sm:text-lg text-ink-500 max-w-2xl mx-auto leading-relaxed">
          EduIQ continuously analyzes attendance, assignment scores, and examination marks to generate explainable, actionable guidance.
        </p>
      </div>

      {/* INTERACTIVE DEMONSTRATION WORKSPACE */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-3">
          {(['math', 'ds', 'physics'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedSubject === s ? 'bg-ink-950 text-white shadow-xs' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'
              }`}
            >
              {subjectData[s].name.split(' ')[0]}
            </button>
          ))}
        </div>

        <Card className="p-8 bg-white border border-ink-150 shadow-pop space-y-6 rounded-3xl">
          <div className="flex items-center justify-between border-b border-ink-150 pb-4">
            <div className="flex items-center gap-3">
              <EduIQLogo size={24} />
              <div>
                <h3 className="font-display font-bold text-base text-ink-950">{current.name}</h3>
                <span className="text-xs text-ink-400 font-mono">Academic Signal Analysis</span>
              </div>
            </div>
            <Badge tone={current.trend === 'improving' ? 'sage' : current.trend === 'declining' ? 'rose' : 'amber'}>
              {current.trend === 'improving' ? '↑ Improving' : current.trend === 'declining' ? '↓ Declining' : '→ Stable'}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
              <span className="text-[10px] uppercase font-semibold text-ink-400">Exam Score</span>
              <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{current.score}</div>
            </div>
            <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
              <span className="text-[10px] uppercase font-semibold text-ink-400">Attendance</span>
              <div className="font-mono text-2xl font-bold text-cobalt-600 mt-1">{current.attendance}</div>
            </div>
            <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
              <span className="text-[10px] uppercase font-semibold text-ink-400">Assignment Avg</span>
              <div className="font-mono text-2xl font-bold text-sage-600 mt-1">{current.assignments}</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-cobalt-50/70 border border-cobalt-200 text-xs space-y-2">
            <div className="inline-flex items-center gap-1.5 text-cobalt-900 font-bold">
              <Icon name="sparkles" size={14} className="text-cobalt-600" />
              <span>✦ AI INSIGHT GENERATED</span>
            </div>
            <p className="text-ink-900 font-medium leading-relaxed">{current.insight}</p>
            <div className="pt-2 border-t border-cobalt-200/60 font-semibold text-cobalt-950">
              Action Plan: {current.recommendation}
            </div>
          </div>
        </Card>
      </div>

      <div className="text-center">
        <Button variant="accent" size="lg" className="rounded-full px-8 shadow-glow" onClick={() => navigate('/register')}>
          Experience AI Intelligence Now &rarr;
        </Button>
      </div>
    </motion.div>
  );
}
