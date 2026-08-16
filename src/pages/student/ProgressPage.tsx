import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { LineChart } from '@/components/academic/LineChart';
import { useStudentService } from '@/services/studentService';
import { trend } from '@/lib/ai/rules';

export default function ProgressPage() {
  const navigate = useNavigate();
  const studentService = useStudentService();
  const student = studentService.getStudent();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<'all' | string>('all');

  const subjects = student.subjects;
  
  // Calculations from real data
  const overallAvg = Math.round(
    subjects.reduce((acc, curr) => acc + (curr.assignmentAvg + curr.examAvg) / 2, 0) / subjects.length
  );
  
  const assignmentAvg = Math.round(subjects.reduce((acc, curr) => acc + curr.assignmentAvg, 0) / subjects.length);
  const examAvg = Math.round(subjects.reduce((acc, curr) => acc + curr.examAvg, 0) / subjects.length);

  const displayedSubjects = selectedSubjectFilter === 'all' 
    ? subjects 
    : subjects.filter(s => s.name === selectedSubjectFilter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 font-body"
    >
      <PageHeader
        title="Performance Analytics Center"
        description="Understand how your academic performance is changing over time."
      />

      {/* HERO OVERALL ACADEMIC INDEX CARD */}
      <Card variant="elevated" className="p-6 md:p-8 bg-white shadow-pop border border-ink-150">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Overall Academic Index</span>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-4xl sm:text-5xl font-bold text-ink-950">{overallAvg} / 100</span>
              <Badge tone="sage" className="px-2.5 py-1 text-xs">
                &uarr; 6.2% from previous term
              </Badge>
            </div>
            <p className="text-xs text-ink-500">Calculated from 4 subjects, 30 attendance sessions, and 5 assignments</p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-ink-50 border border-ink-150 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-semibold text-ink-400">Attendance</div>
              <div className="font-mono text-xl font-bold text-amber-600">{student.attendance}%</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-ink-400">Assignments</div>
              <div className="font-mono text-xl font-bold text-cobalt-600">{assignmentAvg}%</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-ink-400">Examinations</div>
              <div className="font-mono text-xl font-bold text-cobalt-600">{examAvg}%</div>
            </div>
          </div>
        </div>
      </Card>

      {/* ✦ AI PERFORMANCE ANALYSIS BANNER */}
      <Card variant="dark" className="p-6 md:p-8 bg-gradient-ai text-white relative overflow-hidden border border-white/10 shadow-pop">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cobalt-500/20 text-cobalt-300 text-xs font-semibold border border-cobalt-500/30">
              <Icon name="sparkles" size={14} className="text-amber-400" />
              <span>✦ AI PERFORMANCE ANALYSIS</span>
            </div>

            <h3 className="text-xl font-display font-bold text-white">
              You're improving overall, but Mathematics is pulling your score down.
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 text-xs">
                <span className="text-[10px] text-sage-300 font-semibold block uppercase">STRENGTH</span>
                <span className="font-bold text-white">English 87%</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 text-xs">
                <span className="text-[10px] text-cobalt-300 font-semibold block uppercase">TRENDING</span>
                <span className="font-bold text-white">Data Sci 81% &uarr;</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 text-xs">
                <span className="text-[10px] text-amber-300 font-semibold block uppercase">OPPORTUNITY</span>
                <span className="font-bold text-white">Physics 70%</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 text-xs">
                <span className="text-[10px] text-rose-300 font-semibold block uppercase">HIGH RISK</span>
                <span className="font-bold text-white">Math 56% &darr;</span>
              </div>
            </div>
          </div>

          <Button variant="secondary" className="bg-white text-ink-900 hover:bg-ink-100 shrink-0" onClick={() => navigate('/student/intelligence')}>
            Open AI Advisor &rarr;
          </Button>
        </div>
      </Card>

      {/* INTERACTIVE TRAJECTORY CHARTS & SUBJECT FILTERS */}
      <Card className="p-6 bg-white shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-150 pb-4">
          <div>
            <h3 className="font-display font-bold text-base text-ink-950">Assessment Score Trajectories</h3>
            <p className="text-xs text-ink-500">Historical performance trends across recent exams</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-ink-100/70 rounded-xl">
            <button
              onClick={() => setSelectedSubjectFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${selectedSubjectFilter === 'all' ? 'bg-white text-ink-950 shadow-xs' : 'text-ink-500'}`}
            >
              All Subjects
            </button>
            {subjects.map(s => (
              <button
                key={s.name}
                onClick={() => setSelectedSubjectFilter(s.name)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${selectedSubjectFilter === s.name ? 'bg-white text-ink-950 shadow-xs' : 'text-ink-500'}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayedSubjects.map((s) => {
            const t = trend(s.examHistory);
            const avg = Math.round((s.assignmentAvg + s.examAvg) / 2);
            const color = t === 'improving' ? '#3DA86D' : t === 'declining' ? '#DC4A5B' : '#4361EE';

            return (
              <div key={s.name} className="p-5 rounded-2xl border border-ink-150 bg-ink-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-ink-900">{s.name}</h4>
                    <span className="text-xs text-ink-500 font-mono">Current Average: <strong>{avg}%</strong></span>
                  </div>

                  <Badge tone={t === 'improving' ? 'sage' : t === 'declining' ? 'rose' : 'cobalt'}>
                    {t === 'improving' ? '↑ Improving' : t === 'declining' ? '↓ Declining' : '→ Stable'}
                  </Badge>
                </div>

                <div className="pt-2">
                  <LineChart data={s.examHistory} color={color} />
                </div>

                <div className="flex justify-between text-[11px] font-mono text-ink-400 pt-1">
                  {s.examHistory.map((v, idx) => (
                    <span key={idx}>Test {idx + 1}: <strong>{v}%</strong></span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ✦ YOUR NEXT 7 DAYS AI-GENERATED ACTION PLAN */}
      <Card className="p-6 md:p-8 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-ink-150 pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-ink-950 flex items-center gap-2">
              <Icon name="sparkles" size={18} className="text-cobalt-600" />
              Your Next 7 Days — AI Action Plan
            </h3>
            <p className="text-xs text-ink-500">Personalized weekly study sessions generated from your weak subjects</p>
          </div>
          <Badge tone="cobalt">AI Generated</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {[
            { day: 'MONDAY', subject: 'Mathematics', topic: 'Integration Techniques', duration: '45 min', priority: 'High' },
            { day: 'TUESDAY', subject: 'Physics', topic: 'Kinematics Revision', duration: '30 min', priority: 'Medium' },
            { day: 'WEDNESDAY', subject: 'Mathematics', topic: 'Problem Set Practice', duration: '45 min', priority: 'High' },
            { day: 'THURSDAY', subject: 'Data Science', topic: 'EDA Concepts Review', duration: '30 min', priority: 'Low' },
            { day: 'FRIDAY', subject: 'Mathematics', topic: 'Mock Test Questions', duration: '45 min', priority: 'High' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-ink-150 bg-ink-50 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-semibold text-ink-400">
                <span>{item.day}</span>
                <span className={item.priority === 'High' ? 'text-rose-600' : 'text-cobalt-600'}>{item.priority}</span>
              </div>
              <div className="font-semibold text-xs text-ink-900">{item.subject}</div>
              <div className="text-[11px] text-ink-600 leading-tight">{item.topic}</div>
              <div className="text-[10px] font-mono text-ink-400 pt-1">{item.duration}</div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
