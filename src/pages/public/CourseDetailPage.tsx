import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useCourseService } from '@/services/courseService';
import { useAuth } from '@/hooks/useAuth';
import { useStoreActions, useStore } from '@/services/dataStore';
import { useToast } from '@/hooks/useToast';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const courseService = useCourseService();
  const { enrollInCourse } = useStoreActions();
  const store = useStore();
  const { addToast } = useToast();

  const course = courseService.getCourseById(courseId || '');
  const teacher = course ? courseService.getCourseTeacher(course.teacherId) : undefined;
  
  const isStudent = isAuthenticated && user?.role === 'student';
  const isEnrolled = isStudent && store.enrollments.some(e => e.courseId === courseId && e.studentId === user.id);

  if (!course || !teacher) {
    return <div className="p-12 text-center text-ink-500">Course not found</div>;
  }

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isStudent && user) {
      enrollInCourse(user.id, course.id);
      addToast(`Successfully enrolled in ${course.code}`, 'success');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mx-auto space-y-8 pt-24 px-4 sm:px-6 pb-24"
    >
      {/* Back */}
      <button onClick={() => navigate('/courses')} className="text-sm text-ink-500 hover:text-ink-900 transition-colors flex items-center gap-1">
        <Icon name="arrowRight" size={13} className="rotate-180" /> All courses
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge tone="cobalt">{course.code}</Badge>
          <Badge tone="amber" className="flex items-center gap-1"><Icon name="star" size={10} className="fill-current" /> {course.rating}</Badge>
          <Badge tone="neutral">{course.category}</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink-950 tracking-tight">{course.title}</h1>
        <p className="text-ink-600 mt-3 text-lg leading-relaxed">{course.desc}</p>
      </div>

      {/* Metadata */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Instructor', value: teacher.name, sub: teacher.title },
          { label: 'Department', value: course.dept, sub: course.level },
          { label: 'Credits', value: course.credits, sub: 'Semester hours' },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <div className="text-[10px] uppercase tracking-wider text-ink-400 font-medium">{m.label}</div>
            <div className="font-display font-semibold text-ink-900 mt-1 truncate">{m.value}</div>
            {m.sub && <div className="text-xs text-ink-500 mt-0.5 truncate">{m.sub}</div>}
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Schedule */}
        <Card className="p-6 h-full border-t-[3px] border-t-sage-500">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="calendar" className="text-sage-500" size={18} />
            <h2 className="font-display font-semibold text-ink-900 text-lg">Class Schedule</h2>
          </div>
          <div className="space-y-3">
            {course.schedule && course.schedule.map((s, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-ink-100 last:border-0 text-sm">
                <span className="font-medium text-ink-800">{s.day}</span>
                <div className="text-right">
                  <span className="block text-ink-600">{s.time}</span>
                  <span className="block text-xs text-ink-400">{s.room}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* About Instructor */}
        <Card className="p-6 h-full border-t-[3px] border-t-cobalt-500">
           <div className="flex items-center gap-2 mb-4">
            <Icon name="user" className="text-cobalt-500" size={18} />
            <h2 className="font-display font-semibold text-ink-900 text-lg">About Instructor</h2>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-ink-900">{teacher.name}</p>
            <p className="text-sm text-ink-600 line-clamp-3">{teacher.bio}</p>
            <a href={`mailto:${teacher.email}`} className="text-sm text-cobalt-600 hover:text-cobalt-700 flex items-center gap-1 mt-2">
              <Icon name="mail" size={14} /> Contact instructor
            </a>
          </div>
        </Card>
      </div>

      {/* Syllabus */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="book" className="text-ink-600" size={18} />
          <h2 className="font-display font-semibold text-ink-900 text-lg">Course Syllabus</h2>
        </div>
        <div className="space-y-4">
          {course.syllabus && course.syllabus.map((s, i) => (
            <div key={i} className="flex items-start gap-4 py-3 border-b border-ink-100 last:border-0 last:pb-0">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-ink-50 flex flex-col items-center justify-center border border-ink-100">
                <span className="text-[9px] uppercase font-bold text-ink-400">Wk</span>
                <span className="text-sm font-display font-semibold text-ink-700 leading-none">{s.week}</span>
              </div>
              <div>
                <h3 className="font-medium text-ink-900">{s.topic}</h3>
                <p className="text-sm text-ink-500 mt-1">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA */}
      <div className="pt-4">
        {isEnrolled ? (
          <Button variant="secondary" className="w-full py-3 opacity-70" disabled>
            <Icon name="check" size={16} /> Already Enrolled
          </Button>
        ) : (
          <Button variant="accent" className="w-full py-3 text-base shadow-glow-lg" onClick={handleEnroll}>
            {!isAuthenticated ? 'Sign in to enroll' : 'Enroll in course'}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
