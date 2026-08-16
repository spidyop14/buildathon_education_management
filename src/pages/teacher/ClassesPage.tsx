import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { COURSES, MOCK_STUDENTS } from '@/data/mock';

interface ClassScheduleBlock {
  id: string;
  time: string;
  courseCode: string;
  courseTitle: string;
  room: string;
  studentsCount: number;
  attendanceRate: number;
  status: 'upcoming' | 'in_progress' | 'completed';
}

const SCHEDULE_BLOCKS: ClassScheduleBlock[] = [
  {
    id: 'block-1',
    time: '09:00 AM - 10:30 AM',
    courseCode: 'DSCI210',
    courseTitle: 'Data Science Fundamentals',
    room: 'Room B204 (Lab)',
    studentsCount: 42,
    attendanceRate: 89,
    status: 'in_progress',
  },
  {
    id: 'block-2',
    time: '11:00 AM - 12:30 PM',
    courseCode: 'MATH201',
    courseTitle: 'Calculus & Linear Algebra',
    room: 'Room A103',
    studentsCount: 38,
    attendanceRate: 84,
    status: 'upcoming',
  },
  {
    id: 'block-3',
    time: '02:00 PM - 03:30 PM',
    courseCode: 'PHYS150',
    courseTitle: 'Physics for Engineers',
    room: 'Lab 2',
    studentsCount: 32,
    attendanceRate: 78,
    status: 'upcoming',
  },
  {
    id: 'block-4',
    time: '04:00 PM - 05:30 PM',
    courseCode: 'ENGL110',
    courseTitle: 'English Composition',
    room: 'Room C108',
    studentsCount: 26,
    attendanceRate: 92,
    status: 'completed',
  },
];

export default function TeacherClasses() {
  const navigate = useNavigate();
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [selectedBlock, setSelectedBlock] = useState<ClassScheduleBlock | null>(null);

  return (
    <div className="space-y-8 font-body">
      {/* HEADER BAR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-150 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge tone="cobalt" className="px-3 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
            CLASSROOM SCHEDULE & TIMELINE
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-950 mt-1">
            Active Class Sessions
          </h2>
          <p className="text-xs sm:text-sm text-ink-500">
            View time-block schedules, room assignments, session attendance, and class notes.
          </p>
        </div>

        {/* TIMELINE PERIOD TOGGLE */}
        <div className="flex items-center gap-1 bg-ink-50 p-1 rounded-2xl border border-ink-150 shrink-0">
          {(['today', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filterPeriod === period ? 'bg-ink-950 text-white shadow-xs' : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* VISUAL TIMELINE BLOCKS */}
      <div className="space-y-4">
        {SCHEDULE_BLOCKS.map((block) => (
          <Card
            key={block.id}
            onClick={() => setSelectedBlock(block)}
            className="p-6 bg-white border border-ink-150 hover:border-cobalt-300 shadow-card hover:shadow-pop transition-all cursor-pointer rounded-3xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-cobalt-50 text-cobalt-700 font-mono text-xs font-bold shrink-0 border border-cobalt-200">
                  {block.time.split(' - ')[0]}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cobalt-600">{block.courseCode}</span>
                    <Badge tone={block.status === 'in_progress' ? 'sage' : block.status === 'completed' ? 'cobalt' : 'amber'}>
                      {block.status === 'in_progress' ? '• In Session' : block.status === 'completed' ? 'Completed' : 'Upcoming'}
                    </Badge>
                  </div>
                  <h3 className="font-display font-bold text-base text-ink-950">{block.courseTitle}</h3>
                  <p className="text-xs text-ink-500">
                    {block.room} • {block.studentsCount} Students Enrolled
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-ink-150">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-ink-400 font-mono uppercase block">Session Attendance</span>
                  <span className="font-mono text-sm font-bold text-sage-600">{block.attendanceRate}%</span>
                </div>

                <Button
                  variant="accent"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/teacher/attendance');
                  }}
                  className="rounded-xl text-xs font-semibold shadow-xs"
                >
                  <Icon name="calendar" size={14} />
                  <span>Start Attendance</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CLASS DETAILS SIDE DRAWER */}
      <AnimatePresence>
        {selectedBlock && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlock(null)}
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
                  <span className="font-mono text-xs text-cobalt-300 font-bold">{selectedBlock.courseCode}</span>
                  <h3 className="font-display font-bold text-lg text-white mt-0.5">{selectedBlock.courseTitle}</h3>
                </div>
                <button
                  onClick={() => setSelectedBlock(null)}
                  className="p-2 text-ink-400 hover:text-white rounded-full hover:bg-white/10"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
                    <span className="text-[10px] uppercase font-mono font-bold text-ink-400">Schedule</span>
                    <div className="font-bold text-ink-950 mt-1">{selectedBlock.time}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
                    <span className="text-[10px] uppercase font-mono font-bold text-ink-400">Room</span>
                    <div className="font-bold text-ink-950 mt-1">{selectedBlock.room}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="font-bold text-xs text-ink-900 block">Class Roster ({selectedBlock.studentsCount})</span>
                  <div className="space-y-2 text-xs">
                    {MOCK_STUDENTS.slice(0, 5).map((s) => (
                      <div key={s.id} className="p-3 rounded-2xl bg-ink-50 border border-ink-150 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-ink-950">{s.name}</div>
                          <div className="text-[10px] text-ink-400 font-mono">{s.code}</div>
                        </div>
                        <Badge tone={s.attendance >= 75 ? 'sage' : 'rose'}>{s.attendance}% Present</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-ink-150 bg-white">
                <Button
                  variant="accent"
                  className="w-full rounded-2xl"
                  onClick={() => {
                    setSelectedBlock(null);
                    navigate('/teacher/attendance');
                  }}
                >
                  Launch Attendance Session &rarr;
                </Button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
