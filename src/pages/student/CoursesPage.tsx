import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useStudentService } from '@/services/studentService';
import { useCourseService } from '@/services/courseService';
import type { Course } from '@/types';

export default function CoursesPage() {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const studentService = useStudentService();
  const courseService = useCourseService();
  
  const student = studentService.getStudent();
  const enrolledCourses = studentService.getEnrolledCourses();

  // Academic Overview Stats
  const totalCourses = enrolledCourses.length;
  const totalCredits = enrolledCourses.reduce((acc, c) => acc + c.credits, 0);
  const subjectAverages = student.subjects.map(s => Math.round((s.assignmentAvg + s.examAvg) / 2));
  const overallAvg = subjectAverages.length > 0 
    ? Math.round(subjectAverages.reduce((a, b) => a + b, 0) / subjectAverages.length)
    : 73;

  // Courses at risk (< 65%)
  const atRiskCount = student.subjects.filter(s => ((s.assignmentAvg + s.examAvg) / 2) < 65).length;

  // AI Course Priority
  const weakSubject = student.subjects.reduce((prev, curr) => 
    ((prev.assignmentAvg + prev.examAvg) / 2) < ((curr.assignmentAvg + curr.examAvg) / 2) ? prev : curr
  , student.subjects[0]);

  const priorityCourse = enrolledCourses.find(c => c.id === weakSubject?.course) || enrolledCourses[0];
  const priorityAvg = weakSubject ? Math.round((weakSubject.assignmentAvg + weakSubject.examAvg) / 2) : 56;

  // Filtered Courses
  const filteredCourses = enrolledCourses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 font-body"
    >
      <PageHeader 
        title="My Learning Portfolio" 
        description="Enrolled coursework, academic standing, and course-level intelligence." 
      />

      {/* ACADEMIC OVERVIEW INTEGRATED METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border-l-4 border-l-cobalt-500">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Enrolled Courses</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{totalCourses}</div>
          <div className="text-xs text-cobalt-600 mt-0.5 font-medium">{totalCredits} total credits</div>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-sage-500">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Average Performance</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{overallAvg}%</div>
          <div className="text-xs text-sage-600 mt-0.5 font-medium">Composite Index</div>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-amber-500">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Attendance Health</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{student.attendance}%</div>
          <div className="text-xs text-amber-600 mt-0.5 font-medium">Recommended 75%</div>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-rose-500">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Courses At Risk</div>
          <div className="font-mono text-2xl font-bold text-rose-600 mt-1">{atRiskCount}</div>
          <div className="text-xs text-rose-600 mt-0.5 font-medium">Requires intervention</div>
        </Card>
      </div>

      {/* ✦ AI COURSE PRIORITY PANEL */}
      {priorityCourse && (
        <Card variant="dark" className="p-6 md:p-8 bg-gradient-ai text-white relative overflow-hidden border border-white/10 shadow-pop">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cobalt-500/20 text-cobalt-300 text-xs font-semibold border border-cobalt-500/30">
                <Icon name="sparkles" size={14} className="text-amber-400" />
                <span>✦ AI COURSE PRIORITY RECOMMENDATION</span>
              </div>

              <div>
                <span className="text-xs font-mono text-cobalt-300 uppercase tracking-wider">{priorityCourse.code} &bull; {priorityCourse.dept}</span>
                <h2 className="text-2xl font-display font-bold text-white mt-0.5">{priorityCourse.title}</h2>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-ink-300 space-y-1">
                <span className="font-semibold text-rose-300 block uppercase tracking-wider text-[10px]">WHY THIS NEEDS ATTENTION</span>
                <p>
                  Current Average: <strong className="text-white font-mono">{priorityAvg}%</strong> &bull; Assignment Average: <strong className="text-white font-mono">{weakSubject?.assignmentAvg}%</strong> &bull; Exam Average: <strong className="text-white font-mono">{weakSubject?.examAvg}%</strong>.
                  Prioritize problem sets and targeted revision to elevate your course standing.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <div className="text-right hidden md:block">
                <div className="text-xs text-ink-400">Course Average</div>
                <div className="font-mono text-3xl font-bold text-rose-400">{priorityAvg}%</div>
                <Badge tone="rose" className="mt-1">Declining Trend</Badge>
              </div>

              <Button variant="accent" size="lg" onClick={() => setActiveCourse(priorityCourse)} className="rounded-xl px-6 shadow-glow">
                View Improvement Plan &rarr;
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* COURSE PERFORMANCE COMPARISON MAP */}
      <Card className="p-6 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-ink-950">Course Performance Map</h3>
          <span className="text-xs text-ink-400">Comparative standing across 4 subjects</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.subjects.map((sub) => {
            const courseObj = enrolledCourses.find(c => c.id === sub.course);
            const avg = Math.round((sub.assignmentAvg + sub.examAvg) / 2);
            const tone = avg < 60 ? 'rose' as const : avg < 75 ? 'amber' as const : 'sage' as const;

            return (
              <div key={sub.name} className="p-4 rounded-xl bg-ink-50 border border-ink-150 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge tone="cobalt">{courseObj?.code || 'SUBJ'}</Badge>
                    <span className="font-semibold text-xs text-ink-900">{sub.name}</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-ink-950">{avg}%</span>
                </div>
                <ProgressBar value={avg} tone={tone} />
                <div className="flex items-center justify-between text-[11px] text-ink-500 pt-1">
                  <span>Assignments: <strong className="font-mono text-ink-700">{sub.assignmentAvg}%</strong></span>
                  <span>Exams: <strong className="font-mono text-ink-700">{sub.examAvg}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* SEARCH BAR & COURSE RICH CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-ink-950">Enrolled Course Catalog</h3>
          
          <div className="relative w-64">
            <Icon name="search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-ink-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-300"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {filteredCourses.map((course) => {
            const subjectPerf = student.subjects.find(s => s.course === course.id);
            const teacher = courseService.getCourseTeacher(course.teacherId);
            const avg = subjectPerf ? Math.round((subjectPerf.assignmentAvg + subjectPerf.examAvg) / 2) : 0;
            const tone = avg < 60 ? 'rose' as const : avg < 75 ? 'amber' as const : 'sage' as const;

            return (
              <Card
                key={course.id}
                className="p-6 cursor-pointer group hover:border-cobalt-300 transition-all shadow-card flex flex-col justify-between"
                hover
                onClick={() => setActiveCourse(course)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge tone="cobalt">{course.code}</Badge>
                    <span className="text-xs font-mono text-ink-400">{course.credits} Credits</span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-ink-900 group-hover:text-cobalt-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-ink-500 mt-1 flex items-center gap-1">
                      <Icon name="user" size={13} /> {teacher?.name || 'Staff Instructor'} &bull; {course.dept}
                    </p>
                  </div>

                  <p className="text-xs text-ink-600 line-clamp-2 leading-relaxed">{course.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-ink-100 space-y-3">
                  {subjectPerf ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-ink-500 font-medium">Overall Course Score</span>
                        <span className="font-mono font-bold text-ink-900">{avg}%</span>
                      </div>
                      <ProgressBar value={avg} tone={tone} />
                    </div>
                  ) : (
                    <div className="text-xs text-ink-400 italic">No score recorded</div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1">
                    <Badge tone={avg < 60 ? 'rose' : avg < 75 ? 'amber' : 'sage'}>
                      {avg < 60 ? 'Needs Attention' : avg < 75 ? 'Moderate Standing' : 'Strong Performance'}
                    </Badge>
                    <span className="text-cobalt-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Inspect Course Intelligence &rarr;
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* COURSE INTELLIGENCE DETAILED MODAL */}
      <Modal open={!!activeCourse} onClose={() => setActiveCourse(null)} title={activeCourse?.title || ''} wide>
        {activeCourse && (() => {
          const teacher = courseService.getCourseTeacher(activeCourse.teacherId);
          const subjectPerf = student.subjects.find(s => s.course === activeCourse.id);
          const avg = subjectPerf ? Math.round((subjectPerf.assignmentAvg + subjectPerf.examAvg) / 2) : 0;

          return (
            <div className="space-y-6 pt-2">
              <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge tone="cobalt">{activeCourse.code}</Badge>
                  <span className="text-xs font-mono text-ink-500">{activeCourse.credits} Academic Credits</span>
                </div>
                <p className="text-xs text-ink-700 leading-relaxed">{activeCourse.desc}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-ink-50 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-semibold text-ink-400">Instructor</div>
                  <div className="text-sm font-semibold text-ink-900 mt-0.5">{teacher?.name || 'Staff'}</div>
                </div>
                <div className="bg-ink-50 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-semibold text-ink-400">Department</div>
                  <div className="text-sm font-semibold text-ink-900 mt-0.5">{activeCourse.dept}</div>
                </div>
                <div className="bg-ink-50 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-semibold text-ink-400">Overall Average</div>
                  <div className="text-sm font-mono font-bold text-cobalt-600 mt-0.5">{avg}%</div>
                </div>
              </div>

              {subjectPerf && (
                <div className="p-5 rounded-2xl bg-gradient-ai text-white space-y-3 border border-white/10">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cobalt-500/20 text-cobalt-300 text-xs font-semibold">
                    <Icon name="sparkles" size={13} className="text-amber-400" />
                    <span>✦ COURSE INTELLIGENCE BREAKDOWN</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="text-[10px] uppercase text-ink-400">Assignment Score</div>
                      <div className="font-mono text-2xl font-bold text-white">{subjectPerf.assignmentAvg}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-ink-400">Exam Score</div>
                      <div className="font-mono text-2xl font-bold text-white">{subjectPerf.examAvg}%</div>
                    </div>
                  </div>

                  <p className="text-xs text-ink-300 leading-relaxed pt-2 border-t border-white/10">
                    {avg < 60
                      ? 'Performance is currently below course target. Focus on upcoming assignment submissions and scheduled office hours.'
                      : 'Solid academic trajectory in this course. Maintain your current study routine.'}
                  </p>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </motion.div>
  );
}
