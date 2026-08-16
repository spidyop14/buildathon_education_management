import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { useToast } from '@/hooks/useToast';

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  isAiRecommended?: boolean;
}

const DEFAULT_TASKS: StudyTask[] = [
  {
    id: 'st-1',
    title: 'Review Calculus & Integration Fundamentals',
    subject: 'Mathematics',
    dueDate: '2026-08-18',
    priority: 'high',
    completed: false,
    isAiRecommended: true,
  },
  {
    id: 'st-2',
    title: 'Complete Problem Set 6 (Partial Differentiation)',
    subject: 'Mathematics',
    dueDate: '2026-08-20',
    priority: 'high',
    completed: false,
    isAiRecommended: true,
  },
  {
    id: 'st-3',
    title: 'Data Science Lab 3 — Exploratory Data Analysis',
    subject: 'Data Science',
    dueDate: '2026-08-22',
    priority: 'medium',
    completed: true,
    isAiRecommended: false,
  },
  {
    id: 'st-4',
    title: 'Read Physics Chapter 8 — Electromagnetism',
    subject: 'Physics',
    dueDate: '2026-08-25',
    priority: 'low',
    completed: false,
    isAiRecommended: false,
  },
];

const STORAGE_KEY = 'eduiq_study_tasks';

export default function StudyPlannerPage() {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load study tasks', e);
    }
    return DEFAULT_TASKS;
  });

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'ai'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to persist study tasks', e);
    }
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast('Task title is required', 'error');
      return;
    }

    const newTask: StudyTask = {
      id: `st-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      dueDate: newDueDate || '2026-08-25',
      priority: newPriority,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setShowAddForm(false);
    addToast('✓ Task added to study planner', 'success');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    addToast('Task removed', 'info');
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'ai') return t.isAiRecommended;
    return true;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 font-body max-w-5xl"
    >
      <PageHeader
        title="AI-Powered Study Planner"
        description="Organize your weekly tasks, track subject deadlines, and review AI-suggested revision goals."
        action={
          <Button variant="accent" onClick={() => setShowAddForm(true)} className="shadow-glow">
            <Icon name="plus" size={14} className="mr-1.5" /> Add Task
          </Button>
        }
      />

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-l-4 border-l-cobalt-500">
          <span className="text-[10px] font-semibold uppercase text-ink-400">Total Tasks</span>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-0.5">{tasks.length}</div>
        </Card>
        <Card className="p-4 bg-white border-l-4 border-l-amber-500">
          <span className="text-[10px] font-semibold uppercase text-ink-400">Pending</span>
          <div className="font-mono text-2xl font-bold text-amber-600 mt-0.5">{pendingCount}</div>
        </Card>
        <Card className="p-4 bg-white border-l-4 border-l-sage-500">
          <span className="text-[10px] font-semibold uppercase text-ink-400">Completed</span>
          <div className="font-mono text-2xl font-bold text-sage-600 mt-0.5">{completedCount}</div>
        </Card>
        <Card className="p-4 bg-white border-l-4 border-l-cobalt-600">
          <span className="text-[10px] font-semibold uppercase text-ink-400">AI Recommendations</span>
          <div className="font-mono text-2xl font-bold text-cobalt-600 mt-0.5">
            {tasks.filter(t => t.isAiRecommended).length}
          </div>
        </Card>
      </div>

      {/* ADD TASK MODAL / FORM */}
      <AnimatePresence>
        {showAddForm && (
          <Card className="p-6 bg-white border border-cobalt-200 shadow-pop space-y-4">
            <div className="flex items-center justify-between border-b border-ink-150 pb-3">
              <h3 className="font-display font-bold text-base text-ink-950">Add Study Task</h3>
              <button onClick={() => setShowAddForm(false)} className="text-ink-400 hover:text-ink-700">
                <Icon name="x" size={16} />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-ink-700 block mb-1">Task Description</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Review Integration by Parts problems"
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-cobalt-300"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-ink-700 block mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option>Mathematics</option>
                    <option>Data Science</option>
                    <option>Physics</option>
                    <option>English</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-ink-700 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-ink-700 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button variant="accent" type="submit">
                  Save Task &rarr;
                </Button>
              </div>
            </form>
          </Card>
        )}
      </AnimatePresence>

      {/* FILTER TABS & TASK LIST */}
      <Card className="p-6 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-ink-150 pb-3">
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'completed', 'ai'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  filter === f ? 'bg-ink-950 text-white shadow-xs' : 'text-ink-500 hover:bg-ink-100'
                }`}
              >
                {f === 'ai' ? '✦ AI Suggested' : f}
              </button>
            ))}
          </div>
          <span className="text-xs text-ink-400 font-mono">{filteredTasks.length} tasks</span>
        </div>

        <div className="space-y-3 pt-1">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-400">No study tasks match this filter.</div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  t.completed ? 'bg-ink-50 border-ink-150 opacity-60' : 'bg-white border-ink-200 hover:border-ink-300'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t.id)}
                    className="w-4 h-4 accent-cobalt-600 rounded cursor-pointer"
                  />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold truncate ${t.completed ? 'line-through text-ink-500' : 'text-ink-950'}`}>
                        {t.title}
                      </span>
                      {t.isAiRecommended && (
                        <Badge tone="cobalt" className="text-[10px] py-0 px-2 shrink-0">
                          ✦ AI Recommended
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-ink-400 flex items-center gap-3">
                      <span>Subject: <strong>{t.subject}</strong></span>
                      <span>Target: <strong className="font-mono">{t.dueDate}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge tone={t.priority === 'high' ? 'rose' : t.priority === 'medium' ? 'amber' : 'neutral'}>
                    {t.priority}
                  </Badge>
                  <button onClick={() => deleteTask(t.id)} className="text-ink-400 hover:text-rose-600 transition-colors p-1">
                    <Icon name="x" size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </motion.div>
  );
}
