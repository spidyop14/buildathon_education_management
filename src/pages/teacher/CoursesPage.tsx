import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { COURSES, MOCK_STUDENTS, ASSIGNMENTS } from '@/data/mock';
import type { Course } from '@/types';

export default function TeacherCourses() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<'overview' | 'students' | 'assignments' | 'insights'>('overview');

  return (
    <div className="space-y-8 font-body">
      {/* 1. PORTFOLIO SUMMARY HEADER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-150 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge tone="cobalt" className="px-3 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
              TEACHING PORTFOLIO
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-950 mt-1">
              Assigned Courses & Curriculum
            </h2>
            <p className="text-xs sm:text-sm text-ink-500">
              Manage syllabus outlines, active class cohorts, coursework, and performance health.
            </p>
          </div>
        </div>

        {/* 4 SUMMARY STAT STRIPS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
            <span className="text-[10px] uppercase font-mono font-bold text-ink-400">Active Courses</span>
            <div className="font-mono text-2xl font-bold text-ink-950 mt-1">4 Courses</div>
          </div>
          <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
            <span className="text-[10px] uppercase font-mono font-bold text-ink-400">Total Enrolled</span>
            <div className="font-mono text-2xl font-bold text-cobalt-600 mt-1">138 Students</div>
          </div>
          <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
            <span className="text-[10px] uppercase font-mono font-bold text-ink-400">Avg Attendance</span>
            <div className="font-mono text-2xl font-bold text-sage-600 mt-1">86%</div>
          </div>
          <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
            <span className="text-[10px] uppercase font-mono font-bold text-ink-400">Avg Grade Score</span>
            <div className="font-mono text-2xl font-bold text-cobalt-600 mt-1">82%</div>
          </div>
        </div>
      </div>

      {/* 2. INTELLIGENT COURSE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COURSES.map((course, idx) => {
          const health = idx === 0 ? 86 : idx === 1 ? 92 : idx === 2 ? 78 : 88;
          const trend = idx === 0 ? 'improving' : idx === 2 ? 'declining' : 'stable';

          return (
            <Card
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="p-6 bg-white border border-ink-150 hover:border-cobalt-300 shadow-card hover:shadow-pop transition-all cursor-pointer rounded-3xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-ink-150 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cobalt-600 bg-cobalt-50 px-2.5 py-1 rounded-xl border border-cobalt-200">
                    {course.code}
                  </span>
                  <span className="text-xs text-ink-500 font-medium">{course.dept}</span>
                </div>
                <Badge tone={trend === 'improving' ? 'sage' : trend === 'declining' ? 'rose' : 'cobalt'}>
                  {trend === 'improving' ? '↗ Improving' : trend === 'declining' ? '↘ Declining' : '→ Stable'}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-ink-950">{course.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed line-clamp-2">{course.desc}</p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-ink-500">Course Health Index</span>
                  <span className="font-mono text-ink-900">{health}%</span>
                </div>
                <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      health >= 85 ? 'bg-sage-500' : health >= 75 ? 'bg-cobalt-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${health}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-ink-150">
                <div>
                  <span className="text-[10px] text-ink-400 block font-mono">Enrolled</span>
                  <span className="font-bold text-ink-900">42 Students</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-400 block font-mono">Attendance</span>
                  <span className="font-bold text-cobalt-600">89%</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-400 block font-mono">Pending Tasks</span>
                  <span className="font-bold text-amber-600">7 Submissions</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-ink-500">Next class: Tomorrow • 10:00 AM</span>
                <Button variant="accent" size="sm" className="rounded-xl shadow-xs text-xs font-semibold">
                  Open Workspace &rarr;
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. DEDICATED COURSE WORKSPACE MODAL */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-ink-150 shadow-pop space-y-6 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-ink-150 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cobalt-600 bg-cobalt-50 px-2.5 py-0.5 rounded-lg">
                      {selectedCourse.code}
                    </span>
                    <span className="text-xs text-ink-400 font-mono">Fall 2026 Cohort</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-ink-950 mt-1">{selectedCourse.title}</h2>
                  <p className="text-xs text-ink-500">{selectedCourse.desc}</p>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 text-ink-400 hover:text-ink-900 rounded-full hover:bg-ink-100"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>

              {/* WORKSPACE TABS */}
              <div className="flex items-center gap-3 border-b border-ink-150 pb-2">
                {(['overview', 'students', 'assignments', 'insights'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setWorkspaceTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      workspaceTab === tab
                        ? 'bg-ink-950 text-white shadow-xs'
                        : 'text-ink-600 hover:bg-ink-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* WORKSPACE TAB CONTENT */}
              {workspaceTab === 'overview' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
                      <span className="text-[10px] text-ink-400 uppercase font-mono font-bold">Class Average</span>
                      <div className="font-mono text-2xl font-bold text-cobalt-600 mt-1">82%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
                      <span className="text-[10px] text-ink-400 uppercase font-mono font-bold">Attendance</span>
                      <div className="font-mono text-2xl font-bold text-sage-600 mt-1">89%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150">
                      <span className="text-[10px] text-ink-400 uppercase font-mono font-bold">Syllabus Completion</span>
                      <div className="font-mono text-2xl font-bold text-ink-900 mt-1">65%</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cobalt-50/70 border border-cobalt-200 text-ink-900 space-y-1">
                    <span className="font-bold text-cobalt-950 flex items-center gap-1.5">
                      <Icon name="sparkles" size={14} className="text-cobalt-600" />
                      Course AI Health Summary
                    </span>
                    <p className="text-ink-700 leading-relaxed text-[11px]">
                      Student engagement is strong across assignment submissions (+12% completion). 6 students are currently flagged for additional calculus review.
                    </p>
                  </div>
                </div>
              )}

              {workspaceTab === 'students' && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-ink-900 block">Enrolled Student Cohort (42)</span>
                  <div className="space-y-2">
                    {MOCK_STUDENTS.slice(0, 4).map((s) => (
                      <div key={s.id} className="p-3 rounded-2xl bg-ink-50 border border-ink-150 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-ink-950">{s.name}</div>
                          <div className="text-[10px] text-ink-400 font-mono">{s.code}</div>
                        </div>
                        <Badge tone={s.attendance >= 75 ? 'sage' : 'rose'}>
                          Attendance {s.attendance}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {workspaceTab === 'assignments' && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-ink-900 block">Coursework & Tasks</span>
                  <div className="space-y-2">
                    {ASSIGNMENTS.slice(0, 3).map((a) => (
                      <div key={a.id} className="p-3 rounded-2xl bg-ink-50 border border-ink-150 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-ink-950">{a.title}</div>
                          <div className="text-[10px] text-ink-400">Due {a.due}</div>
                        </div>
                        <Badge tone={a.status === 'graded' ? 'sage' : 'amber'}>{a.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {workspaceTab === 'insights' && (
                <div className="p-4 rounded-2xl bg-ink-950 text-white space-y-2 text-xs">
                  <span className="font-mono text-[10px] text-cobalt-400 font-bold uppercase">✦ Academic Signal Analysis</span>
                  <h4 className="font-bold text-white text-sm">Performance Trajectory</h4>
                  <p className="text-ink-300 text-[11px] leading-relaxed">
                    Data wrangling coursework scores are up +9%. Recommending advance machine learning assignment modules.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
