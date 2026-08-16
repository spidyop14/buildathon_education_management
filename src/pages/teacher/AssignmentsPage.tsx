import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { ASSIGNMENTS, COURSES } from '@/data/mock';
import type { Assignment } from '@/types';

export default function TeacherAssignments() {
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'drafts' | 'due_soon' | 'completed'>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('c1');
  const [newDue, setNewDue] = useState('2026-08-25');
  const [newMaxScore, setNewMaxScore] = useState(100);

  const handleCreate = (e: React.FormEvent) => {
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
            COURSEWORK & ASSIGNMENTS
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-950 mt-1">
            Assignment Workspace
          </h2>
          <p className="text-xs sm:text-sm text-ink-500">
            Publish problem sets, track submission progress, and review student progress.
          </p>
        </div>

        <Button
          variant="accent"
          onClick={() => setCreateModalOpen(true)}
          className="rounded-2xl text-xs font-semibold shadow-glow shrink-0"
        >
          <Icon name="plus" size={16} />
          <span>+ New Assignment</span>
        </Button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-ink-150 pb-3 overflow-x-auto">
        {(['all', 'active', 'due_soon', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filterTab === tab ? 'bg-ink-950 text-white shadow-xs' : 'text-ink-600 hover:bg-ink-100'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* ASSIGNMENT LIST */}
      <div className="space-y-4">
        {ASSIGNMENTS.map((assignment, idx) => {
          const submittedCount = idx === 0 ? 34 : idx === 1 ? 38 : 42;
          const totalCount = 42;
          const pct = Math.round((submittedCount / totalCount) * 100);

          return (
            <Card
              key={assignment.id}
              onClick={() => setSelectedAssignment(assignment)}
              className="p-6 bg-white border border-ink-150 hover:border-cobalt-300 shadow-card hover:shadow-pop transition-all cursor-pointer rounded-3xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cobalt-600 bg-cobalt-50 px-2.5 py-0.5 rounded-lg border border-cobalt-200">
                      {assignment.course}
                    </span>
                    <Badge tone={assignment.status === 'graded' ? 'sage' : 'amber'}>
                      {assignment.status}
                    </Badge>
                  </div>
                  <h3 className="font-display font-bold text-lg text-ink-950">{assignment.title}</h3>
                  <p className="text-xs text-ink-500">
                    Due: {assignment.due} • Max Score: {assignment.maxScore} pts
                  </p>
                </div>

                <div className="sm:text-right space-y-1 shrink-0">
                  <span className="text-[10px] text-ink-400 font-mono uppercase block">Submission Progress</span>
                  <div className="font-mono text-sm font-bold text-cobalt-600">
                    {submittedCount} / {totalCount} ({pct}%)
                  </div>
                  <div className="w-36 h-2 bg-ink-100 rounded-full overflow-hidden sm:ml-auto">
                    <div className="h-full bg-cobalt-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CREATE NEW ASSIGNMENT MODAL */}
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
                <h3 className="font-display font-bold text-xl text-ink-950">Create New Assignment</h3>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1.5 text-ink-400 hover:text-ink-900 rounded-full hover:bg-ink-100"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-ink-700 font-semibold mb-1">Assignment Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Problem Set 6 — Integration"
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
                    <label className="block text-ink-700 font-semibold mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newDue}
                      onChange={(e) => setNewDue(e.target.value)}
                      className="w-full h-11 border border-ink-200 rounded-2xl px-3 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-ink-700 font-semibold mb-1">Max Score Points</label>
                  <input
                    type="number"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value))}
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
                    Publish Assignment &rarr;
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
