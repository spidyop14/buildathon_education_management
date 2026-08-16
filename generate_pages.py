import os

base_dir = r"c:\buildathon\src\pages"

def write_file(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# ================= COMING SOON =================
write_file(os.path.join(base_dir, "ComingSoonPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useLocation } from 'react-router-dom';

export default function ComingSoonPage() {
  const location = useLocation();
  const title = (location.state as any)?.title || 'This feature';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-4xl mx-auto space-y-8"
    >
      <PageHeader>Coming Soon</PageHeader>
      <EmptyState
        icon="settings"
        title={`${title} is in development`}
        sub="This section is scoped for a later build phase and intentionally left out of this pass rather than shipped half-built."
      />
    </motion.div>
  );
}
""")

# ================= STUDENT PAGES =================

write_file(os.path.join(base_dir, "student", "DashboardPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, StatCard, Badge, Button, Icon } from '@/components/ui';
import { InsightCard, BarChart } from '@/components/academic';
import { STUDENT_ME } from '@/data/mock';
import { computeStudentInsights } from '@/lib/ai/rules';
import { useReducedMotion } from 'framer-motion';

export default function DashboardPage() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const insights = computeStudentInsights(STUDENT_ME);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink-900 tracking-tight">
            Welcome back, {STUDENT_ME.firstName}
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            Here's what's happening with your studies today.
          </p>
        </div>
        <Button variant="primary" icon="sparkles" onClick={() => navigate('/student/intelligence')}>
          Ask EduIQ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Overall Average" value="86%" sub="+2% from last term" trendDir="up" delay={0.1} />
        <StatCard label="Attendance" value="94%" sub="On track" trendDir="flat" delay={0.2} />
        <StatCard label="Pending Assignments" value="3" sub="Due this week" trendDir="down" delay={0.3} />
        <StatCard label="Upcoming Exams" value="2" sub="Next 14 days" trendDir="flat" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-display font-medium mb-4">Subject Performance</h3>
            <BarChart 
              data={[88, 92, 78, 85, 90]} 
              labels={['Math', 'Science', 'History', 'English', 'Art']} 
              color="#3B82F6"
            />
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-display font-medium mb-4">Academic Intelligence</h3>
            <div className="space-y-4">
              {insights.slice(0, 2).map((insight, i) => (
                <InsightCard key={i} insight={insight} delay={i * 0.1} />
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" onClick={() => navigate('/student/intelligence')}>
              View all insights
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "student", "CoursesPage.tsx"), """import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, ProgressBar, Modal, Button } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { COURSES, teacherById } from '@/data/mock';

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto space-y-8">
      <PageHeader>My Courses</PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.map(course => {
          const teacher = teacherById(course.teacherId);
          return (
            <Card key={course.id} hover className="p-5 cursor-pointer" onClick={() => setSelectedCourse(course)}>
              <div className="flex justify-between items-start mb-4">
                <Badge tone="cobalt">{course.code}</Badge>
                <span className="text-xs text-ink-500 font-medium">{course.credits} Credits</span>
              </div>
              <h3 className="text-lg font-display font-medium text-ink-900 mb-1">{course.title}</h3>
              <p className="text-sm text-ink-500 mb-6">{teacher?.firstName} {teacher?.lastName}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-ink-600">Progress</span>
                  <span className="text-ink-900">75%</span>
                </div>
                <ProgressBar value={75} tone="cobalt" />
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={selectedCourse?.title}>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-ink-600">{selectedCourse?.description}</p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ink-100">
            <div>
              <p className="text-xs text-ink-500">Instructor</p>
              <p className="text-sm font-medium">{teacherById(selectedCourse?.teacherId)?.firstName} {teacherById(selectedCourse?.teacherId)?.lastName}</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Term</p>
              <p className="text-sm font-medium">{selectedCourse?.term}</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Schedule</p>
              <p className="text-sm font-medium">{selectedCourse?.schedule.join(', ')}</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Room</p>
              <p className="text-sm font-medium">{selectedCourse?.room}</p>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <Button variant="primary">Go to Course Page</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "student", "AssignmentsPage.tsx"), """import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, Modal, Icon } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { ASSIGNMENTS, courseById } from '@/data/mock';
import { useToast } from '@/hooks/useToast';

export default function AssignmentsPage() {
  const { addToast } = useToast();
  const [submitModal, setSubmitModal] = useState<any>(null);

  const handleSubmit = () => {
    addToast('Assignment submitted successfully', 'success');
    setSubmitModal(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto space-y-8">
      <PageHeader>Assignments</PageHeader>

      <div className="space-y-4">
        {ASSIGNMENTS.map(assignment => {
          const course = courseById(assignment.courseId);
          return (
            <Card key={assignment.id} className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Badge tone="cobalt">{course?.code}</Badge>
                  <h3 className="text-base font-medium text-ink-900">{assignment.title}</h3>
                </div>
                <p className="text-sm text-ink-500 line-clamp-1">{assignment.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs font-medium text-ink-500">
                  <span className="flex items-center gap-1">
                    <Icon name="calendar" size={14} />
                    Due {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                  <span>{assignment.maxScore} Points</span>
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-2 shrink-0">
                <Badge tone={assignment.id.endsWith('1') ? 'amber' : 'neutral'}>
                  {assignment.id.endsWith('1') ? 'Pending' : 'Completed'}
                </Badge>
                {assignment.id.endsWith('1') && (
                  <Button variant="primary" size="sm" onClick={() => setSubmitModal(assignment)}>
                    Submit
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={!!submitModal} onClose={() => setSubmitModal(null)} title="Submit Assignment">
        <div className="space-y-4 pt-2">
          <p className="text-sm font-medium text-ink-900">{submitModal?.title}</p>
          <div className="border-2 border-dashed border-ink-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-ink-50 hover:bg-ink-100 transition-colors cursor-pointer">
            <Icon name="upload" className="text-ink-400 mb-2" size={24} />
            <p className="text-sm font-medium text-ink-900">Click to upload or drag and drop</p>
            <p className="text-xs text-ink-500 mt-1">PDF, DOCX, ZIP up to 50MB</p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setSubmitModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Submit Work</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "student", "AttendancePage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { StatCard, Card } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';

export default function AttendancePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto space-y-8">
      <PageHeader>Attendance Log</PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Present" value="42" sub="Sessions" tone="sage" />
        <StatCard label="Late" value="2" sub="Sessions" tone="amber" />
        <StatCard label="Absent" value="1" sub="Sessions" tone="rose" />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-display font-medium mb-6">Recent Sessions</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => {
            const isAbsent = i === 12;
            const isLate = i === 8 || i === 22;
            const bgClass = isAbsent ? 'bg-rose-100 text-rose-700' : isLate ? 'bg-amber-100 text-amber-700' : 'bg-sage-100 text-sage-700';
            
            return (
              <div key={i} className={`h-16 rounded-lg ${bgClass} flex items-center justify-center font-mono text-sm`}>
                {35 - i}d
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-6 text-sm font-medium">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-sage-500"></div> Present</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"></div> Late</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-500"></div> Absent</div>
        </div>
      </Card>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "student", "ExaminationsPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Icon } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { EXAMS, courseById } from '@/data/mock';

export default function ExaminationsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto space-y-8">
      <PageHeader>Examinations</PageHeader>

      <div className="space-y-4">
        {EXAMS.map(exam => {
          const course = courseById(exam.courseId);
          const isUpcoming = exam.status === 'upcoming';
          
          return (
            <Card key={exam.id} className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Badge tone="cobalt">{course?.code}</Badge>
                  <h3 className="text-base font-medium text-ink-900">{exam.title}</h3>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs font-medium text-ink-500">
                  <span className="flex items-center gap-1">
                    <Icon name="calendar" size={14} />
                    {new Date(exam.date).toLocaleDateString()}
                  </span>
                  <span>{exam.duration} mins</span>
                  <span>{exam.maxScore} Points</span>
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-2 shrink-0">
                {isUpcoming ? (
                  <Badge tone="amber">Upcoming</Badge>
                ) : (
                  <div className="text-right">
                    <Badge tone="sage">Graded</Badge>
                    <div className="text-xl font-display font-semibold text-ink-900 mt-1">
                      85 / {exam.maxScore}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "student", "ProgressPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { LineChart } from '@/components/academic';
import { COURSES } from '@/data/mock';

export default function ProgressPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto space-y-8">
      <PageHeader>Academic Progress</PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COURSES.map((course, i) => {
          const data = [65 + i*2, 70 + i, 85 - i, 88 + i, 92 - i*2];
          return (
            <Card key={course.id} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-display font-medium text-ink-900">{course.title}</h3>
                  <p className="text-sm text-ink-500">{course.code}</p>
                </div>
                <Badge tone="sage">Improving</Badge>
              </div>
              <LineChart data={data} color="#10B981" />
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "student", "IntelligencePage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { InsightCard } from '@/components/academic';
import { STUDENT_ME } from '@/data/mock';
import { computeStudentInsights } from '@/lib/ai/rules';
import { Icon } from '@/components/ui';

export default function IntelligencePage() {
  const insights = computeStudentInsights(STUDENT_ME);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto space-y-8">
      <PageHeader>Academic Intelligence</PageHeader>

      <div className="bg-ink-900 text-white rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Icon name="sparkles" size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-white/80 mb-4">
            <Icon name="sparkles" size={14} /> AI Analysis Active
          </div>
          <h2 className="text-2xl font-display font-medium mb-2">Personalized Insights for Maya</h2>
          <p className="text-ink-300">
            Based on your recent performance, attendance, and assignment history, EduIQ has generated these insights to help you optimize your academic journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} delay={i * 0.1} />
        ))}
      </div>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "student", "ProfilePage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Badge } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { STUDENT_ME } from '@/data/mock';

export default function ProfilePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-2xl mx-auto space-y-8">
      <PageHeader>Profile</PageHeader>

      <Card className="p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-cobalt-100 text-cobalt-700 flex items-center justify-center text-3xl font-display font-medium mx-auto mb-4">
          {STUDENT_ME.firstName[0]}{STUDENT_ME.lastName[0]}
        </div>
        <h2 className="text-2xl font-display font-medium text-ink-900">
          {STUDENT_ME.firstName} {STUDENT_ME.lastName}
        </h2>
        <p className="text-ink-500 mb-6">Student ID: STU-{STUDENT_ME.id}</p>
        
        <div className="flex justify-center gap-2 mb-8">
          <Badge tone="cobalt">Year 2 Student</Badge>
          <Badge tone="sage">Active</Badge>
        </div>

        <div className="space-y-4 text-left border-t border-ink-100 pt-6">
          <div className="flex justify-between items-center py-2 border-b border-ink-50">
            <span className="text-sm font-medium text-ink-500">Email</span>
            <span className="text-sm font-medium text-ink-900">{STUDENT_ME.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-ink-50">
            <span className="text-sm font-medium text-ink-500">Major</span>
            <span className="text-sm font-medium text-ink-900">Computer Science</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-ink-50">
            <span className="text-sm font-medium text-ink-500">Enrollment Date</span>
            <span className="text-sm font-medium text-ink-900">Sep 2023</span>
          </div>
        </div>

        <div className="mt-8">
          <Button variant="secondary" className="w-full">Edit Profile</Button>
        </div>
      </Card>
    </motion.div>
  );
}
""")


# ================= TEACHER PAGES =================

write_file(os.path.join(base_dir, "teacher", "DashboardPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, StatCard, Button } from '@/components/ui';
import { InsightCard, BarChart } from '@/components/academic';
import { computeClassInsights } from '@/lib/ai/rules';
import { COURSES, ROSTER } from '@/data/mock';

export default function DashboardPage() {
  const navigate = useNavigate();
  const insights = computeClassInsights(COURSES[0], ROSTER);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink-900 tracking-tight">
            Teacher Dashboard
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            Overview of your classes and student performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Active Classes" value="4" sub="Current term" trendDir="flat" />
        <StatCard label="Total Students" value="128" sub="Across all classes" trendDir="up" />
        <StatCard label="Class Average" value="76%" sub="Slightly down" trendDir="down" />
        <StatCard label="At-Risk Students" value="5" sub="Requires attention" tone="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-display font-medium mb-4">Class Performance Distribution</h3>
            <BarChart 
              data={[5, 15, 45, 25, 10]} 
              labels={['<60', '60-70', '70-80', '80-90', '>90']} 
              color="#6366F1"
            />
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-display font-medium mb-4">Class Insights</h3>
            <div className="space-y-4">
              {insights.slice(0, 2).map((insight, i) => (
                <InsightCard key={i} insight={insight} delay={i * 0.1} />
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" onClick={() => navigate('/teacher/insights')}>
              View all insights
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "teacher", "ClassesPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Icon } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { COURSES } from '@/data/mock';

export default function ClassesPage() {
  const teacherCourses = COURSES.filter(c => c.teacherId === 't1');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto space-y-8">
      <PageHeader>My Classes</PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teacherCourses.map(course => (
          <Card key={course.id} hover className="p-5">
            <div className="flex justify-between items-start mb-4">
              <Badge tone="cobalt">{course.code}</Badge>
              <span className="text-xs text-ink-500 font-medium">{course.term}</span>
            </div>
            <h3 className="text-lg font-display font-medium text-ink-900 mb-2">{course.title}</h3>
            
            <div className="space-y-2 mt-4 text-sm text-ink-600">
              <div className="flex items-center gap-2">
                <Icon name="users" size={16} /> 32 Students Enrolled
              </div>
              <div className="flex items-center gap-2">
                <Icon name="clock" size={16} /> {course.credits} Credits
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "teacher", "AttendancePage.tsx"), """import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Badge } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { ROSTER } from '@/data/mock';
import { useToast } from '@/hooks/useToast';

export default function AttendancePage() {
  const { addToast } = useToast();
  const [attendance, setAttendance] = useState<Record<string, 'present'|'late'|'absent'>>(
    Object.fromEntries(ROSTER.map(s => [s.id, 'present']))
  );

  const cycleStatus = (id: string) => {
    setAttendance(prev => {
      const current = prev[id];
      const next = current === 'present' ? 'late' : current === 'late' ? 'absent' : 'present';
      return { ...prev, [id]: next };
    });
  };

  const handleSave = () => {
    addToast('Attendance saved successfully', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto space-y-8">
      <PageHeader action={<Button variant="primary" onClick={handleSave}>Save Attendance</Button>}>
        Mark Attendance
      </PageHeader>

      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink-50 border-b border-ink-200 text-xs font-medium text-ink-500 uppercase">
              <th className="p-4 w-12">#</th>
              <th className="p-4">Student Name</th>
              <th className="p-4 text-right">Status (Click to cycle)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {ROSTER.map((student, idx) => {
              const status = attendance[student.id];
              return (
                <tr key={student.id} className="hover:bg-ink-50/50">
                  <td className="p-4 text-sm text-ink-500">{idx + 1}</td>
                  <td className="p-4 text-sm font-medium text-ink-900">{student.name}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => cycleStatus(student.id)} className="focus:outline-none">
                      <Badge tone={status === 'present' ? 'sage' : status === 'late' ? 'amber' : 'rose'} className="w-24 justify-center">
                        {status.toUpperCase()}
                      </Badge>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "teacher", "AssignmentsPage.tsx"), """import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, Modal, Input } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { ASSIGNMENTS } from '@/data/mock';
import { useToast } from '@/hooks/useToast';

export default function AssignmentsPage() {
  const { addToast } = useToast();
  const [createModal, setCreateModal] = useState(false);
  const teacherAssignments = ASSIGNMENTS.filter(a => a.courseId === 'c1');

  const handleCreate = () => {
    addToast('Assignment created', 'success');
    setCreateModal(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto space-y-8">
      <PageHeader action={<Button variant="primary" onClick={() => setCreateModal(true)}>New Assignment</Button>}>
        Assignments
      </PageHeader>

      <div className="space-y-4">
        {teacherAssignments.map(assignment => (
          <Card key={assignment.id} className="p-5 flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium text-ink-900 mb-1">{assignment.title}</h3>
              <p className="text-sm text-ink-500 line-clamp-1">{assignment.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-medium text-ink-900 mb-1">{assignment.maxScore} pts</div>
              <Badge tone="neutral">Due: {new Date(assignment.dueDate).toLocaleDateString()}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Create Assignment">
        <div className="space-y-4 pt-4">
          <Input label="Title" placeholder="Assignment Title" />
          <Input label="Description" placeholder="Description" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Due Date" type="date" />
            <Input label="Max Score" type="number" defaultValue="100" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "teacher", "SubmissionsPage.tsx"), """import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Badge, Modal, Input } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { ROSTER } from '@/data/mock';
import { useToast } from '@/hooks/useToast';

export default function SubmissionsPage() {
  const { addToast } = useToast();
  const [gradeModal, setGradeModal] = useState<any>(null);

  const handleGrade = () => {
    addToast('Grade saved successfully', 'success');
    setGradeModal(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto space-y-8">
      <PageHeader>Student Submissions</PageHeader>

      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink-50 border-b border-ink-200 text-xs font-medium text-ink-500 uppercase">
              <th className="p-4">Student</th>
              <th className="p-4">Status</th>
              <th className="p-4">Submitted Date</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {ROSTER.map((student, i) => {
              const isGraded = i % 2 === 0;
              return (
                <tr key={student.id} className="hover:bg-ink-50/50">
                  <td className="p-4 text-sm font-medium text-ink-900">{student.name}</td>
                  <td className="p-4">
                    <Badge tone={isGraded ? 'sage' : 'amber'}>{isGraded ? 'Graded' : 'Needs Review'}</Badge>
                  </td>
                  <td className="p-4 text-sm text-ink-500">Oct {10 + i}, 2023</td>
                  <td className="p-4 text-right">
                    <Button variant="secondary" size="sm" onClick={() => setGradeModal(student)}>
                      {isGraded ? 'Edit Grade' : 'Review'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Modal open={!!gradeModal} onClose={() => setGradeModal(null)} title="Grade Submission">
        <div className="space-y-4 pt-4">
          <p className="text-sm font-medium">Student: {gradeModal?.name}</p>
          <div className="p-4 border rounded bg-ink-50 text-sm">
            Attached file: submission_final.pdf
          </div>
          <Input label="Score (out of 100)" type="number" />
          <Input label="Feedback" placeholder="Enter feedback here..." />
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setGradeModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleGrade}>Save Grade</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "teacher", "ExaminationsPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Input } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { ROSTER } from '@/data/mock';
import { useToast } from '@/hooks/useToast';

export default function ExaminationsPage() {
  const { addToast } = useToast();

  const handleSave = () => {
    addToast('Marks saved successfully', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto space-y-8">
      <PageHeader action={<Button variant="primary" onClick={handleSave}>Save Marks</Button>}>
        Marks Entry - Midterm Exam
      </PageHeader>

      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink-50 border-b border-ink-200 text-xs font-medium text-ink-500 uppercase">
              <th className="p-4 w-12">#</th>
              <th className="p-4">Student Name</th>
              <th className="p-4 w-48">Score (Max: 100)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {ROSTER.map((student, idx) => (
              <tr key={student.id} className="hover:bg-ink-50/50">
                <td className="p-4 text-sm text-ink-500">{idx + 1}</td>
                <td className="p-4 text-sm font-medium text-ink-900">{student.name}</td>
                <td className="p-4">
                  <Input type="number" defaultValue={Math.floor(Math.random() * 40 + 60)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "teacher", "StudentsPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { ROSTER } from '@/data/mock';

export default function StudentsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-5xl mx-auto space-y-8">
      <PageHeader>Student Roster</PageHeader>

      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink-50 border-b border-ink-200 text-xs font-medium text-ink-500 uppercase">
              <th className="p-4">Name</th>
              <th className="p-4">Attendance</th>
              <th className="p-4">Average</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {ROSTER.map((student, i) => {
              const attendance = 95 - (i * 2);
              const average = 88 - i;
              const atRisk = average < 70 || attendance < 80;
              return (
                <tr key={student.id} className="hover:bg-ink-50/50">
                  <td className="p-4 text-sm font-medium text-ink-900">{student.name}</td>
                  <td className="p-4 text-sm text-ink-600">{attendance}%</td>
                  <td className="p-4 text-sm font-medium">{average}%</td>
                  <td className="p-4">
                    <Badge tone={atRisk ? 'rose' : 'sage'}>{atRisk ? 'At Risk' : 'On Track'}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "teacher", "InsightsPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { InsightCard } from '@/components/academic';
import { computeClassInsights } from '@/lib/ai/rules';
import { COURSES, ROSTER } from '@/data/mock';
import { Icon } from '@/components/ui';

export default function InsightsPage() {
  const insights = computeClassInsights(COURSES[0], ROSTER);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto space-y-8">
      <PageHeader>Class AI Insights</PageHeader>

      <div className="bg-ink-900 text-white rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Icon name="sparkles" size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-white/80 mb-4">
            <Icon name="sparkles" size={14} /> Cohort Analysis
          </div>
          <h2 className="text-2xl font-display font-medium mb-2">Class Intelligence Report</h2>
          <p className="text-ink-300">
            EduIQ has analyzed your class performance, attendance trends, and engagement metrics to generate these actionable insights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} delay={i * 0.1} />
        ))}
      </div>
    </motion.div>
  );
}
""")


# ================= ADMIN PAGES =================

write_file(os.path.join(base_dir, "admin", "DashboardPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, StatCard, Button } from '@/components/ui';
import { InsightCard, BarChart } from '@/components/academic';
import { computeInstitutionInsights } from '@/lib/ai/rules';
import { COURSES, ROSTER, TEACHERS } from '@/data/mock';

export default function DashboardPage() {
  const navigate = useNavigate();
  const insights = computeInstitutionInsights(COURSES, ROSTER, TEACHERS);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink-900 tracking-tight">
            Institution Dashboard
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            Global overview of institution metrics and AI insights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="1,248" sub="+12 this term" trendDir="up" />
        <StatCard label="Total Teachers" value="86" sub="Active" trendDir="flat" />
        <StatCard label="Active Courses" value="34" sub="Current term" trendDir="flat" />
        <StatCard label="At-Risk Students" value="97" sub="-5% from last term" tone="sage" trendDir="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-display font-medium mb-4">Department Averages</h3>
            <BarChart 
              data={[78, 82, 75, 88, 81]} 
              labels={['Science', 'Math', 'Arts', 'Engineering', 'Humanities']} 
              color="#0F172A"
            />
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-display font-medium mb-4">Institution Insights</h3>
            <div className="space-y-4">
              {insights.slice(0, 2).map((insight, i) => (
                <InsightCard key={i} insight={insight} delay={i * 0.1} />
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" onClick={() => navigate('/admin/intelligence')}>
              View all insights
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "admin", "StudentsPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, Input, Icon } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { ROSTER } from '@/data/mock';

export default function StudentsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto space-y-8">
      <PageHeader action={<Button variant="primary" icon="plus">Add Student</Button>}>
        Student Directory
      </PageHeader>

      <div className="flex gap-4 mb-4">
        <div className="flex-1 max-w-md">
          <Input placeholder="Search students..." />
        </div>
        <Button variant="secondary" icon="filter">Filter</Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink-50 border-b border-ink-200 text-xs font-medium text-ink-500 uppercase">
              <th className="p-4">Name</th>
              <th className="p-4">ID</th>
              <th className="p-4">Attendance</th>
              <th className="p-4">Average</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {ROSTER.map((student, i) => {
              const atRisk = i % 4 === 0;
              return (
                <tr key={student.id} className="hover:bg-ink-50/50 cursor-pointer">
                  <td className="p-4 text-sm font-medium text-ink-900">{student.name}</td>
                  <td className="p-4 text-sm text-ink-500">STU-{1000 + i}</td>
                  <td className="p-4 text-sm text-ink-600">92%</td>
                  <td className="p-4 text-sm font-medium">85%</td>
                  <td className="p-4">
                    <Badge tone={atRisk ? 'rose' : 'sage'}>{atRisk ? 'At Risk' : 'Active'}</Badge>
                  </td>
                  <td className="p-4 text-right text-ink-400">
                    <Icon name="chevronRight" size={16} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "admin", "TeachersPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, Icon } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { TEACHERS } from '@/data/mock';

export default function TeachersPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto space-y-8">
      <PageHeader action={<Button variant="primary" icon="plus">Add Teacher</Button>}>
        Staff Directory
      </PageHeader>

      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink-50 border-b border-ink-200 text-xs font-medium text-ink-500 uppercase">
              <th className="p-4">Name</th>
              <th className="p-4">Department</th>
              <th className="p-4">Title</th>
              <th className="p-4">Courses</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {TEACHERS.map(teacher => (
              <tr key={teacher.id} className="hover:bg-ink-50/50 cursor-pointer">
                <td className="p-4 text-sm font-medium text-ink-900">{teacher.firstName} {teacher.lastName}</td>
                <td className="p-4 text-sm text-ink-600">{teacher.department}</td>
                <td className="p-4 text-sm text-ink-500">Senior Faculty</td>
                <td className="p-4">
                  <Badge tone="cobalt">3 Courses</Badge>
                </td>
                <td className="p-4 text-right text-ink-400">
                  <Icon name="chevronRight" size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "admin", "CoursesPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button, Icon } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { COURSES, teacherById } from '@/data/mock';

export default function CoursesPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto space-y-8">
      <PageHeader action={<Button variant="primary" icon="plus">New Course</Button>}>
        Course Management
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.map(course => {
          const teacher = teacherById(course.teacherId);
          return (
            <Card key={course.id} className="p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <Badge tone="cobalt">{course.code}</Badge>
                <Button variant="ghost" size="sm" icon="settings" className="!p-1 text-ink-400" />
              </div>
              <h3 className="text-lg font-display font-medium text-ink-900 mb-1">{course.title}</h3>
              <p className="text-sm text-ink-500 mb-4 flex-1">Instructor: {teacher?.firstName} {teacher?.lastName}</p>
              
              <div className="flex items-center justify-between text-xs font-medium text-ink-600 border-t border-ink-100 pt-4 mt-auto">
                <span className="flex items-center gap-1"><Icon name="users" size={14} /> 32 Enrolled</span>
                <span>{course.term}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "admin", "AnalyticsPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { BarChart, LineChart } from '@/components/academic';

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto space-y-8">
      <PageHeader>Institution Analytics</PageHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-display font-medium mb-6">Department Averages</h3>
          <BarChart 
            data={[78, 82, 75, 88, 81]} 
            labels={['Science', 'Math', 'Arts', 'Engineering', 'Humanities']} 
            color="#3B82F6"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-display font-medium mb-6">Term-over-Term GPA Trend</h3>
          <LineChart data={[3.1, 3.15, 3.2, 3.18, 3.25]} color="#10B981" />
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-display font-medium mb-6">Attendance Distribution by Term</h3>
          <BarChart 
            data={[92, 94, 89, 95]} 
            labels={['Fall 2022', 'Spring 2023', 'Fall 2023', 'Spring 2024']} 
            color="#6366F1"
          />
        </Card>
      </div>
    </motion.div>
  );
}
""")

write_file(os.path.join(base_dir, "admin", "AIInsightsPage.tsx"), """import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { InsightCard } from '@/components/academic';
import { computeInstitutionInsights } from '@/lib/ai/rules';
import { COURSES, ROSTER, TEACHERS } from '@/data/mock';
import { Icon } from '@/components/ui';

export default function AIInsightsPage() {
  const insights = computeInstitutionInsights(COURSES, ROSTER, TEACHERS);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto space-y-8">
      <PageHeader>Global AI Insights</PageHeader>

      <div className="bg-ink-900 text-white rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Icon name="sparkles" size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-white/80 mb-4">
            <Icon name="sparkles" size={14} /> Institution Level
          </div>
          <h2 className="text-2xl font-display font-medium mb-2">Strategic Intelligence Report</h2>
          <p className="text-ink-300">
            EduIQ has processed data across all departments, courses, and student cohorts to identify macro trends and actionable administrative insights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} delay={i * 0.1} />
        ))}
      </div>
    </motion.div>
  );
}
""")

print("Done")
