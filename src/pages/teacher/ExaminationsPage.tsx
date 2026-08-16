import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { StatCard } from '@/components/ui/StatCard';
import { EXAMS, COURSES } from '@/data/mock';

export default function TeacherExaminations() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('c1');
  const [newDate, setNewDate] = useState('2026-08-30');
  const [newDuration, setNewDuration] = useState(90);

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreateModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-8 font-body">
      {/* HEADER BAR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-150 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge tone="cobalt" className="px-3 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
            EXAMINATION CONTROL CENTER
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-950 mt-1">
            Assessments & Examinations
          </h2>
          <p className="text-xs sm:text-sm text-ink-500">
            Build MCQ assessments, schedule exam windows, and analyze score distribution analytics.
          </p>
        </div>

        <Button
          variant="accent"
          onClick={() => setCreateModalOpen(true)}
          className="rounded-2xl text-xs font-semibold shadow-glow shrink-0"
        >
          <Icon name="plus" size={16} />
          <span>+ Create New Exam</span>
        </Button>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Upcoming Exams" value="2" sub="Scheduled this term" trendDir="flat" />
        <StatCard label="Completed Exams" value="4" sub="Evaluated & published" trendDir="up" />
        <StatCard label="Class Avg Score" value="78%" sub="Highest: 96%" trendDir="up" />
        <StatCard label="Pass Rate" value="94%" sub="40 / 42 passed" trendDir="up" />
      </div>

      {/* EXAM CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EXAMS.map((exam, idx) => (
          <Card key={exam.id} className="p-6 bg-white border border-ink-150 shadow-card rounded-3xl space-y-5">
            <div className="flex items-center justify-between border-b border-ink-150 pb-3">
              <span className="font-mono text-xs font-bold text-cobalt-600 bg-cobalt-50 px-2.5 py-0.5 rounded-lg border border-cobalt-200">
                {exam.course}
              </span>
              <Badge tone={exam.score ? 'sage' : 'amber'}>
                {exam.score ? 'Evaluated' : 'Scheduled'}
              </Badge>
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-ink-950">{exam.title}</h3>
              <p className="text-xs text-ink-500">
                Date: {exam.date} • Duration: {exam.duration || 90} Mins • {exam.questions?.length || 4} Questions
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-ink-400 font-mono block uppercase">Class Avg</span>
                <span className="font-bold font-mono text-cobalt-600">{exam.score || 78} / {exam.maxScore}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-400 font-mono block uppercase">Enrolled</span>
                <span className="font-bold text-ink-900">42 Students</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-400 font-mono block uppercase">Pass Rate</span>
                <span className="font-bold text-sage-600">95%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CREATE NEW EXAM MODAL */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateModalOpen(false)}
              className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-ink-150 shadow-pop space-y-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-ink-150 pb-3">
                <h3 className="font-display font-bold text-xl text-ink-950">Build MCQ Examination</h3>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1.5 text-ink-400 hover:text-ink-900 rounded-full hover:bg-ink-100"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateExam} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-ink-700 font-semibold mb-1">Exam Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Midterm Examination — Data Science"
                    className="w-full h-11 border border-ink-200 rounded-2xl px-4 text-xs focus:ring-2 focus:ring-cobalt-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-ink-700 font-semibold mb-1">Course</label>
                    <select
                      value={newCourse}
                      onChange={(e) => setNewCourse(e.target.value)}
                      className="w-full h-11 border border-ink-200 rounded-2xl px-3 bg-white text-xs"
                    >
                      {COURSES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-ink-700 font-semibold mb-1">Exam Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full h-11 border border-ink-200 rounded-2xl px-3 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-ink-700 font-semibold mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full h-11 border border-ink-200 rounded-2xl px-4 text-xs"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="secondary"
                    type="button"
                    className="flex-1 rounded-2xl"
                    onClick={() => setCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="accent" type="submit" className="flex-1 rounded-2xl shadow-glow">
                    Publish Exam &rarr;
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
