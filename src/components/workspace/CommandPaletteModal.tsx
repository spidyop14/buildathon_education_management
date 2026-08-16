import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { IconName } from '@/types';
import { COURSES, ASSIGNMENTS, EXAMS, MOCK_STUDENTS } from '@/data/mock';

interface CommandPaletteModalProps {
  open: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Students' | 'Courses' | 'Assignments' | 'Exams' | 'Insights' | 'Navigation';
  title: string;
  subtitle: string;
  icon: IconName;
  path: string;
}

export function CommandPaletteModal({ open, onClose }: CommandPaletteModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global Ctrl/Cmd + K Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Construct search items list
  const allItems: CommandItem[] = [
    // Navigation
    { id: 'nav-dash', category: 'Navigation', title: 'Teacher Dashboard', subtitle: 'Overview & metrics', icon: 'home', path: '/teacher/dashboard' },
    { id: 'nav-courses', category: 'Navigation', title: 'Assigned Courses', subtitle: 'Teaching portfolio', icon: 'book', path: '/teacher/courses' },
    { id: 'nav-classes', category: 'Navigation', title: 'Classes & Timeline', subtitle: 'Schedules & room logs', icon: 'users', path: '/teacher/classes' },
    { id: 'nav-assignments', category: 'Navigation', title: 'Assignments', subtitle: 'Task management', icon: 'file', path: '/teacher/assignments' },
    { id: 'nav-submissions', category: 'Navigation', title: 'Submissions & Grading', subtitle: 'Review student work', icon: 'check', path: '/teacher/submissions' },
    { id: 'nav-exams', category: 'Navigation', title: 'Examinations', subtitle: 'Assessment evaluations', icon: 'clipboard', path: '/teacher/examinations' },
    { id: 'nav-attendance', category: 'Navigation', title: 'Classroom Attendance', subtitle: 'Log student presence', icon: 'calendar', path: '/teacher/attendance' },
    { id: 'nav-students', category: 'Navigation', title: 'Student Intelligence', subtitle: 'Rosters & risk analysis', icon: 'cap', path: '/teacher/students' },
    { id: 'nav-insights', category: 'Navigation', title: 'Academic Insights', subtitle: 'AI signal analysis', icon: 'sparkles', path: '/teacher/insights' },
    { id: 'nav-profile', category: 'Navigation', title: 'Profile & Settings', subtitle: 'Account preferences', icon: 'user', path: '/teacher/profile' },

    // Courses
    ...COURSES.map((c) => ({
      id: `course-${c.id}`,
      category: 'Courses' as const,
      title: `${c.code} — ${c.title}`,
      subtitle: `${c.dept} • ${c.credits} Credits`,
      icon: 'book' as IconName,
      path: `/teacher/courses`,
    })),

    // Students
    ...MOCK_STUDENTS.map((s) => ({
      id: `student-${s.id}`,
      category: 'Students' as const,
      title: s.name,
      subtitle: `${s.code} • Attendance ${s.attendance}%`,
      icon: 'user' as IconName,
      path: `/teacher/students`,
    })),

    // Assignments
    ...ASSIGNMENTS.map((a) => ({
      id: `assign-${a.id}`,
      category: 'Assignments' as const,
      title: a.title,
      subtitle: `${a.course} • Due ${a.due}`,
      icon: 'file' as IconName,
      path: `/teacher/assignments`,
    })),

    // Exams
    ...EXAMS.map((ex) => ({
      id: `exam-${ex.id}`,
      category: 'Exams' as const,
      title: ex.title,
      subtitle: `${ex.course} • Date ${ex.date}`,
      icon: 'clipboard' as IconName,
      path: `/teacher/examinations`,
    })),
  ];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 10);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: CommandItem) => {
    onClose();
    navigate(item.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white rounded-3xl border border-ink-150 shadow-pop overflow-hidden z-10"
          >
            {/* SEARCH INPUT */}
            <div className="p-4 border-b border-ink-150 flex items-center gap-3">
              <Icon name="search" size={20} className="text-ink-400 shrink-0 ml-1" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search students, courses, assignments, exams or commands... (⌘K)"
                className="w-full text-sm font-medium text-ink-900 placeholder:text-ink-400 bg-transparent focus:outline-none"
              />
              <span className="px-2 py-0.5 rounded-lg bg-ink-100 text-[10px] font-mono font-bold text-ink-500 uppercase">
                ESC
              </span>
            </div>

            {/* RESULTS LIST */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-ink-400">
                  No matching academic records found.
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full p-3 rounded-2xl text-left flex items-center justify-between transition-all ${
                        isSelected ? 'bg-cobalt-50/70 border border-cobalt-200 text-cobalt-950' : 'hover:bg-ink-50 text-ink-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-cobalt-600 text-white' : 'bg-ink-100 text-ink-600'}`}>
                          <Icon name={item.icon} size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-ink-950">{item.title}</div>
                          <div className="text-[11px] text-ink-500">{item.subtitle}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white border border-ink-200 text-ink-500">
                        {item.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* FOOTER */}
            <div className="p-3 bg-ink-50/80 border-t border-ink-150 flex items-center justify-between text-[11px] text-ink-500 px-5">
              <span>Use <kbd className="font-mono font-bold text-ink-700">↑</kbd> <kbd className="font-mono font-bold text-ink-700">↓</kbd> to navigate, <kbd className="font-mono font-bold text-ink-700">↵</kbd> to select</span>
              <span className="font-mono text-cobalt-600 font-bold">EduIQ Command Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
