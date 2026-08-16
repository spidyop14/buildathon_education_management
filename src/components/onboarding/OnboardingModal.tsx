import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface OnboardingModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const STORAGE_KEY = 'eduiq_onboarding_completed';

const ROLE_SLIDES: Record<UserRole, Array<{
  step: string;
  title: string;
  subtitle: string;
  detail: string;
  bullets: string[];
  icon: 'home' | 'sparkles' | 'chart' | 'check';
}>> = {
  student: [
    {
      step: '01 — WORKSPACE',
      title: 'Welcome to EduIQ Student Workspace',
      subtitle: 'Your learning, attendance, assignments & exams in one place.',
      detail: 'EduIQ connects your daily academic activity so you always know where you stand.',
      bullets: ['View enrolled courses & syllabus', 'Track assignment deadlines', 'Monitor attendance health'],
      icon: 'home',
    },
    {
      step: '02 — SIGNALS',
      title: 'EduIQ Connects the Academic Signals',
      subtitle: 'Raw scores are transformed into clear performance trends.',
      detail: 'Your attendance, coursework scores, and examination results are synthesized continuously.',
      bullets: ['Live performance index / 100', 'Subject-level trajectory lines', 'Attendance threshold monitoring'],
      icon: 'chart',
    },
    {
      step: '03 — INTELLIGENCE',
      title: 'Understand What the Data Means',
      subtitle: 'AI explains your strengths and detects declining trends early.',
      detail: 'Instead of generic numbers, EduIQ provides clear, explainable feedback on your learning.',
      bullets: ['Weak subject identification', 'Personalized study session tips', 'Exam score trend analysis'],
      icon: 'sparkles',
    },
    {
      step: '04 — ACTION',
      title: 'Turn Intelligence Into Academic Success',
      subtitle: 'Act on clear, personalized recommendations.',
      detail: 'Follow targeted study steps, submit pending coursework, and improve with confidence.',
      bullets: ['Take online examinations', 'Submit coursework with instant status update', 'Achieve academic targets'],
      icon: 'check',
    },
  ],
  teacher: [
    {
      step: '01 — WORKSPACE',
      title: 'Welcome to EduIQ Educator Workspace',
      subtitle: 'An intelligent academic operating system for teachers.',
      detail: 'Manage courses, class sections, assignments, attendance, and grading from one focused workspace.',
      bullets: ['Assigned teaching portfolio', 'Interactive class schedule timeline', 'Centralized grading review center'],
      icon: 'home',
    },
    {
      step: '02 — SIGNALS',
      title: 'Real-Time Classroom Health Monitoring',
      subtitle: 'Keep a constant pulse on classroom engagement and results.',
      detail: 'Monitor submission progress, section attendance rates, and assessment distributions.',
      bullets: ['Classroom average score tracking', 'Section-level attendance ring', 'Submission progress bars'],
      icon: 'chart',
    },
    {
      step: '03 — INTELLIGENCE',
      title: 'AI-Powered Academic Intelligence',
      subtitle: 'Detect at-risk students and performance drops before finals.',
      detail: 'EduIQ analyzes student coursework and attendance data to synthesize actionable academic signals.',
      bullets: ['At-risk student identification', 'AI Grading Assistant with rubric feedback', 'Classroom Academic Pulse'],
      icon: 'sparkles',
    },
    {
      step: '04 — ACTION',
      title: 'Guide Your Classroom to Excellence',
      subtitle: 'Execute timely academic interventions.',
      detail: 'Schedule 1-on-1 student check-ins, accept AI suggested scores, and issue threshold alerts.',
      bullets: ['Log section attendance in seconds', 'Grade submissions with AI rationale', 'Schedule student interventions'],
      icon: 'check',
    },
  ],
  admin: [
    {
      step: '01 — WORKSPACE',
      title: 'Welcome to EduIQ Institutional Governance',
      subtitle: 'System-wide oversight for institutional excellence.',
      detail: 'Manage faculty, student cohorts, course catalogs, class sections, and examinations.',
      bullets: ['Student & Teacher management', 'Curriculum & Course catalog builder', 'Institutional activity logs'],
      icon: 'home',
    },
    {
      step: '02 — SIGNALS',
      title: 'Institutional Analytics & Performance',
      subtitle: 'Track macro metrics across departments and terms.',
      detail: 'Monitor total active enrollments, average institution performance, and risk signal trends.',
      bullets: ['Departmental comparative reports', 'System-wide attendance metrics', 'Exam cycle monitoring'],
      icon: 'chart',
    },
    {
      step: '03 — INTELLIGENCE',
      title: 'System-Wide Academic Intelligence',
      subtitle: 'AI monitoring for early risk intervention.',
      detail: 'Identify department-level performance anomalies and attendance drop-offs across cohorts.',
      bullets: ['At-risk cohort summary', 'Automated institutional reports', 'AI anomaly detection'],
      icon: 'sparkles',
    },
    {
      step: '04 — ACTION',
      title: 'Printable Official Reports & Decisions',
      subtitle: 'Generate confidential institutional transcripts and summaries.',
      detail: 'Export official performance documents, assign faculty to courses, and govern academic policy.',
      bullets: ['Printable official transcripts', 'Course & Class management', 'Institutional decision support'],
      icon: 'check',
    },
  ],
};

export function OnboardingModal({ forceOpen = false, onClose }: OnboardingModalProps) {
  const { user } = useAuth();
  const role: UserRole = user?.role || 'student';
  const slides = ROLE_SLIDES[role];

  const [open, setOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      setCurrentSlide(0);
      return;
    }

    try {
      const completed = localStorage.getItem(STORAGE_KEY);
      if (!completed) {
        setOpen(true);
      }
    } catch (e) {
      console.error('Error checking onboarding status:', e);
    }
  }, [forceOpen]);

  const handleFinish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      console.error('Error saving onboarding state:', e);
    }
    setOpen(false);
    if (onClose) onClose();
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleFinish}
            className="fixed inset-0 bg-ink-950/50 backdrop-blur-sm"
          />

          {/* ONBOARDING PANEL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-9 border border-ink-150 shadow-pop space-y-6 z-10 overflow-hidden"
          >
            {/* TOP HEADER */}
            <div className="flex items-center justify-between border-b border-ink-150 pb-4">
              <div className="flex items-center gap-2">
                <Badge tone="cobalt" className="px-3 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
                  {slide.step}
                </Badge>
                <span className="text-xs font-mono text-ink-400 capitalize">{role} Introduction</span>
              </div>
              <button
                onClick={handleFinish}
                className="text-xs font-bold text-ink-400 hover:text-ink-900 transition-colors"
              >
                Skip &rarr;
              </button>
            </div>

            {/* SLIDE CONTENT */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cobalt-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Icon name={slide.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-ink-950">{slide.title}</h3>
                    <p className="text-xs text-cobalt-600 font-semibold">{slide.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs text-ink-600 leading-relaxed pt-1">{slide.detail}</p>

                <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-ink-400">Key Capabilities</span>
                  <div className="space-y-1.5">
                    {slide.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-ink-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-cobalt-600 shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* FOOTER ACTIONS & PROGRESS DOTS */}
            <div className="flex items-center justify-between pt-2 border-t border-ink-150">
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'w-6 bg-cobalt-600' : 'w-2 bg-ink-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                {currentSlide > 0 && (
                  <Button variant="secondary" size="sm" onClick={handleBack} className="rounded-xl">
                    Back
                  </Button>
                )}
                <Button variant="accent" size="sm" onClick={handleNext} className="rounded-xl shadow-glow">
                  {currentSlide === slides.length - 1 ? 'Enter My Workspace \u2192' : 'Next \u2192'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default OnboardingModal;
