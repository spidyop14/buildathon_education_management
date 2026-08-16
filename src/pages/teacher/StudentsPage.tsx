import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { StatCard } from '@/components/ui/StatCard';
import { MOCK_STUDENTS } from '@/data/mock';
import type { Student } from '@/types';

export default function TeacherStudents() {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = MOCK_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 font-body">
      {/* HEADER BAR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-150 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge tone="cobalt" className="px-3 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
            STUDENT INTELLIGENCE ROSTER
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-950 mt-1">
            Student Profiles & Trajectories
          </h2>
          <p className="text-xs sm:text-sm text-ink-500">
            Inspect individual student performance trajectories, attendance logs, and AI academic risk signals.
          </p>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Cohort Students" value="138" sub="Across 4 active sections" trendDir="flat" />
        <StatCard label="Cohort Avg Attendance" value="86%" sub="Target: 75% minimum" trendDir="up" />
        <StatCard label="Cohort Avg Score" value="81%" sub="↑ +4.1% this month" trendDir="up" />
        <StatCard label="Students At Risk" value="6" sub="Requiring intervention" trendDir="down" />
      </div>

      {/* SEARCH BAR & HYBRID TABLE CARDS */}
      <Card className="p-6 bg-white border border-ink-150 shadow-card rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink-150 pb-4">
          <div className="relative flex-1 max-w-md">
            <Icon name="search" size={16} className="absolute left-3.5 top-3.5 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student by name or ID..."
              className="w-full h-11 pl-10 pr-4 rounded-2xl border border-ink-200 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
            />
          </div>

          <span className="text-xs font-mono font-bold text-ink-400">
            Showing {filteredStudents.length} Students
          </span>
        </div>

        {/* STUDENT ROSTER CARDS */}
        <div className="space-y-3">
          {filteredStudents.map((student) => {
            const avgPerf = Math.round(
              student.subjects.reduce((acc, sub) => acc + (sub.assignmentAvg + sub.examAvg) / 2, 0) /
                student.subjects.length
            );
            const isAtRisk = student.attendance < 75 || avgPerf < 65;

            return (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="p-4 rounded-2xl bg-[#FAFBFD] border border-ink-150 hover:border-cobalt-300 hover:bg-cobalt-50/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cobalt-100 text-cobalt-800 font-bold flex items-center justify-center border border-cobalt-300 text-sm">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink-950 text-sm">{student.name}</h4>
                    <span className="text-[10px] font-mono text-ink-400">{student.code} • Year: {student.year}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] text-ink-400 font-mono block uppercase">Attendance</span>
                    <span className={`font-mono font-bold text-sm ${student.attendance >= 75 ? 'text-sage-600' : 'text-rose-600'}`}>
                      {student.attendance}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-ink-400 font-mono block uppercase">Performance</span>
                    <span className="font-mono font-bold text-sm text-cobalt-600">{avgPerf}%</span>
                  </div>

                  <Badge tone={isAtRisk ? 'rose' : 'sage'}>
                    {isAtRisk ? '⚠ At Risk' : '✓ Good Standing'}
                  </Badge>

                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                    Profile &rarr;
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* STUDENT INTELLIGENCE SIDE PANEL */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 bg-ink-950/40 backdrop-blur-xs"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col font-body border-l border-ink-150"
            >
              <div className="p-6 border-b border-ink-150 flex items-center justify-between bg-ink-950 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cobalt-600 text-white font-bold flex items-center justify-center">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white">{selectedStudent.name}</h3>
                    <span className="text-[10px] font-mono text-cobalt-300">{selectedStudent.code} • {selectedStudent.year}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 text-ink-400 hover:text-white rounded-full hover:bg-white/10"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
                    <span className="text-[10px] uppercase font-mono font-bold text-ink-400">Attendance</span>
                    <div className="font-mono text-2xl font-bold text-sage-600 mt-1">{selectedStudent.attendance}%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
                    <span className="text-[10px] uppercase font-mono font-bold text-ink-400">Subjects Enrolled</span>
                    <div className="font-mono text-2xl font-bold text-cobalt-600 mt-1">
                      {selectedStudent.subjects.length}
                    </div>
                  </div>
                </div>

                {/* AI ACADEMIC INTERPRETATION CARD */}
                <div className="p-4 rounded-2xl bg-cobalt-50/70 border border-cobalt-200 text-ink-900 space-y-1">
                  <span className="font-bold text-cobalt-950 flex items-center gap-1.5">
                    <Icon name="sparkles" size={14} className="text-cobalt-600" />
                    AI Academic Synthesis
                  </span>
                  <p className="text-ink-700 leading-relaxed text-[11px]">
                    {selectedStudent.attendance < 75
                      ? 'Attendance is currently below the 75% recommended institutional threshold. Performance has dropped 9% over recent assessments.'
                      : 'Consistent learning pattern. Strong performance across data science and computer science coursework.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-ink-900 block">Subject Scores</span>
                  <div className="space-y-2">
                    {selectedStudent.subjects.map((s, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-ink-50 border border-ink-150 flex items-center justify-between">
                        <span className="font-bold text-ink-950">{s.name}</span>
                        <span className="font-mono font-bold text-cobalt-600">{Math.round((s.assignmentAvg + s.examAvg) / 2)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-ink-150 bg-white">
                <Button variant="accent" className="w-full rounded-2xl shadow-glow">
                  Schedule 1-on-1 Intervention &rarr;
                </Button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
