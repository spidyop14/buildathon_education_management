import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

export interface TourStep {
  id: string;
  targetSelector: string; // e.g. '[data-tour="dashboard"]'
  targetPath: string;     // e.g. '/student/dashboard'
  title: string;
  what: string;           // WHAT IS THIS?
  do: string;             // WHAT CAN I DO HERE?
  why: string;            // WHY DOES IT MATTER?
  position?: 'right' | 'left' | 'top' | 'bottom';
}

const STUDENT_TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    targetSelector: '[data-tour="dashboard"]',
    targetPath: '/student/dashboard',
    title: 'Dashboard — Academic Command Center',
    what: 'A single unified dashboard displaying your composite academic standing and live metrics.',
    do: 'View your overall GPA index, attendance status, subject distribution, and recent AI recommendations at a glance.',
    why: 'Instead of checking separate portals, EduIQ brings your attendance, assignment, and exam signals into one connected view.',
    position: 'right',
  },
  {
    id: 'schedule',
    targetSelector: '[data-tour="schedule"]',
    targetPath: '/student/schedule',
    title: 'My Schedule — Timeline & Deadlines',
    what: 'A timeline calendar of upcoming lectures, assignment due dates, and exam sessions.',
    do: 'Check class times, room numbers, assignment deadlines, and scheduled examinations.',
    why: 'Prevents missed deadlines and attendance drop-offs by keeping your weekly academic schedule clear.',
    position: 'right',
  },
  {
    id: 'courses',
    targetSelector: '[data-tour="courses"]',
    targetPath: '/student/courses',
    title: 'Courses — Learning Portfolio',
    what: 'Your full catalog of enrolled academic courses and curriculum details.',
    do: 'Inspect course syllabi, instructor contact information, credits, and course-level performance averages.',
    why: 'Keeps you aligned with course objectives and faculty expectations throughout the semester.',
    position: 'right',
  },
  {
    id: 'assignments',
    targetSelector: '[data-tour="assignments"]',
    targetPath: '/student/assignments',
    title: 'Assignments — Coursework Workspace',
    what: 'A dedicated center for tracking, completing, and submitting academic coursework.',
    do: 'Review pending tasks, check maximum scores, submit work online, and read instructor feedback.',
    why: 'Coursework accounts for a major portion of your term grade; tracking submission status prevents point loss.',
    position: 'right',
  },
  {
    id: 'attendance',
    targetSelector: '[data-tour="attendance"]',
    targetPath: '/student/attendance',
    title: 'Attendance — Signal & Health Monitoring',
    what: 'A real-time log of your attendance presence, tardiness, and threshold status.',
    do: 'Monitor your cumulative attendance percentage against the institutional 75% recommendation.',
    why: 'Attendance is a key early indicator. EduIQ flags attendance drops before they impact your exam eligibility.',
    position: 'right',
  },
  {
    id: 'examinations',
    targetSelector: '[data-tour="examinations"]',
    targetPath: '/student/examinations',
    title: 'Examinations — Test & Assessment Hub',
    what: 'Your interactive online examination catalog and score history archive.',
    do: 'Launch timed online assessments, complete MCQ exams, and review post-exam score breakdowns.',
    why: 'Provides real test environments and stores historical score trajectories used for performance analysis.',
    position: 'right',
  },
  {
    id: 'planner',
    targetSelector: '[data-tour="planner"]',
    targetPath: '/student/planner',
    title: 'Study Planner — Actionable Study Sessions',
    what: 'An intelligent planner that converts academic risk signals into targeted study tasks.',
    do: 'Schedule focused revision sessions prioritized by your lowest performing subjects.',
    why: 'EduIQ moves beyond passive grade display to help you take direct, proactive academic action.',
    position: 'right',
  },
  {
    id: 'progress',
    targetSelector: '[data-tour="progress"]',
    targetPath: '/student/progress',
    title: 'Progress — Performance Trajectory',
    what: 'Visual analytics graphs showing score changes and attendance trends over time.',
    do: 'Compare subject averages, track grade improvements, and view weak subject warnings.',
    why: 'Helps you understand whether your current study strategy is resulting in measurable grade growth.',
    position: 'right',
  },
  {
    id: 'ai-insights',
    targetSelector: '[data-tour="ai-insights"]',
    targetPath: '/student/intelligence',
    title: 'Academic Intelligence — Explainable AI Engine',
    what: 'The signature EduIQ intelligence layer that connects all your academic data.',
    do: 'Read explainable AI insights detailing WHY certain subjects need focus and HOW to improve them.',
    why: 'This is where raw data is converted into actionable guidance, giving you clear next steps.',
    position: 'right',
  },
  {
    id: 'profile',
    targetSelector: '[data-tour="profile"]',
    targetPath: '/student/profile',
    title: 'Profile — Academic Identity',
    what: 'Your student identity, enrollment metadata, and account settings.',
    do: 'Update profile details, upload your avatar, and manage workspace preferences.',
    why: 'Ensures your institutional records and contact information remain accurate.',
    position: 'right',
  },
];

const TEACHER_TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    targetSelector: '[data-tour="dashboard"]',
    targetPath: '/teacher/dashboard',
    title: 'Educator Dashboard — Command Center',
    what: 'An intelligent teaching workspace for active classroom management.',
    do: 'View assigned course health, today schedule, submission queues, and classroom risk alerts.',
    why: 'Gives faculty instant visibility into student progress without navigating multiple portals.',
    position: 'right',
  },
  {
    id: 'courses',
    targetSelector: '[data-tour="courses"]',
    targetPath: '/teacher/courses',
    title: 'Assigned Courses — Teaching Portfolio',
    what: 'Your assigned teaching catalog, course health metrics, and curriculum outlines.',
    do: 'Manage syllabus topics, review section averages, and inspect course health indices.',
    why: 'Ensures course delivery remains aligned with institutional academic standards.',
    position: 'right',
  },
  {
    id: 'classes',
    targetSelector: '[data-tour="classes"]',
    targetPath: '/teacher/classes',
    title: 'Classes — Section Schedules & Roster',
    what: 'Interactive timeline schedule showing active class sections and room assignments.',
    do: 'Check lecture times, section enrollments, and access student roster drawers.',
    why: 'Keeps daily classroom logistics organized and accessible in one click.',
    position: 'right',
  },
  {
    id: 'assignments',
    targetSelector: '[data-tour="assignments"]',
    targetPath: '/teacher/assignments',
    title: 'Assignments — Coursework Creation',
    what: 'A management suite for creating, scheduling, and tracking student assignments.',
    do: 'Create new assignments, set due dates, specify max scores, and monitor submission rates.',
    why: 'Establishes clear academic milestones and structures student evaluation.',
    position: 'right',
  },
  {
    id: 'submissions',
    targetSelector: '[data-tour="submissions"]',
    targetPath: '/teacher/submissions',
    title: 'Submissions — AI-Assisted Grading Center',
    what: 'A split-view grading workspace equipped with document preview and an AI Grading Assistant.',
    do: 'Review student work, click [Accept AI Score] for instant rubric scoring, and save feedback.',
    why: 'Dramatically reduces grading turnaround time while maintaining consistent evaluation standards.',
    position: 'right',
  },
  {
    id: 'examinations',
    targetSelector: '[data-tour="examinations"]',
    targetPath: '/teacher/examinations',
    title: 'Examinations — MCQ Assessment Builder',
    what: 'An assessment control center for creating and publishing MCQ examinations.',
    do: 'Build question sets, configure options, set time limits, and publish tests to your class.',
    why: 'Automates test evaluation and instantly feeds results into student performance records.',
    position: 'right',
  },
  {
    id: 'attendance',
    targetSelector: '[data-tour="attendance"]',
    targetPath: '/teacher/attendance',
    title: 'Attendance — One-Touch Logger',
    what: 'A rapid attendance entry portal for recording section presence.',
    do: 'Toggle student presence with Present/Late/Absent buttons or click [Mark All Present].',
    why: 'Provides real-time attendance logging that feeds directly into student risk alerts.',
    position: 'right',
  },
  {
    id: 'students',
    targetSelector: '[data-tour="students"]',
    targetPath: '/teacher/students',
    title: 'Students — Roster Intelligence',
    what: 'A student roster panel featuring individual academic risk badges.',
    do: 'Filter students by standing (Good Standing / At-Risk) and open detailed student intelligence cards.',
    why: 'Helps educators identify struggling students early and schedule targeted interventions.',
    position: 'right',
  },
  {
    id: 'insights',
    targetSelector: '[data-tour="insights"]',
    targetPath: '/teacher/insights',
    title: 'Academic Insights — Academic Pulse',
    what: 'An interactive Academic Pulse node diagram visualizing classroom risk distribution.',
    do: 'Explore risk nodes, review AI-synthesized classroom signals, and open intervention drawers.',
    why: 'Surfaces class-wide learning trends so you can adjust instruction before final exams.',
    position: 'right',
  },
  {
    id: 'profile',
    targetSelector: '[data-tour="profile"]',
    targetPath: '/teacher/profile',
    title: 'Profile — Faculty Identity',
    what: 'Your educator identity profile and workspace preferences.',
    do: 'Manage office hours, department info, and profile details.',
    why: 'Maintains professional faculty information across student and admin directories.',
    position: 'right',
  },
];

const ADMIN_TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    targetSelector: '[data-tour="dashboard"]',
    targetPath: '/admin/dashboard',
    title: 'Executive Dashboard — Institutional Oversight',
    what: 'System-wide executive dashboard monitoring institutional metrics.',
    do: 'View total enrolled students, faculty count, average attendance rate, and active risk count.',
    why: 'Provides leadership with macro-level visibility into institutional health.',
    position: 'right',
  },
  {
    id: 'students',
    targetSelector: '[data-tour="students"]',
    targetPath: '/admin/students',
    title: 'Manage Students — Student Roster Governance',
    what: 'Full student roster directory with administrative CRUD controls.',
    do: 'Add new student profiles, edit student details, monitor averages, or remove records.',
    why: 'Maintains accurate institutional student registration and academic history.',
    position: 'right',
  },
  {
    id: 'teachers',
    targetSelector: '[data-tour="teachers"]',
    targetPath: '/admin/teachers',
    title: 'Manage Teachers — Faculty Governance',
    what: 'Faculty directory managing teaching assignments and departments.',
    do: 'Add faculty members, assign courses, update academic titles, and track assigned loads.',
    why: 'Ensures proper faculty allocation across academic departments.',
    position: 'right',
  },
  {
    id: 'courses',
    targetSelector: '[data-tour="courses"]',
    targetPath: '/admin/courses',
    title: 'Manage Courses — Curriculum Catalog',
    what: 'Institutional course catalog builder and credit management.',
    do: 'Create courses, assign instructors, set credit values, and define department offerings.',
    why: 'Establishes the core academic structure for the entire institution.',
    position: 'right',
  },
  {
    id: 'classes',
    targetSelector: '[data-tour="classes"]',
    targetPath: '/admin/classes',
    title: 'Manage Classes — Section & Room Scheduling',
    what: 'Class section manager linking courses, schedules, and capacity.',
    do: 'Build class sections, assign room numbers, set schedules, and manage section capacity.',
    why: 'Coordinates physical and temporal academic resources across departments.',
    position: 'right',
  },
  {
    id: 'analytics',
    targetSelector: '[data-tour="analytics"]',
    targetPath: '/admin/analytics',
    title: 'Analytics — System-Wide Metrics',
    what: 'Institutional analytics comparing performance and attendance across departments.',
    do: 'Analyze score distribution curves, attendance trends, and department comparative charts.',
    why: 'Enables data-driven administrative decisions and policy adjustments.',
    position: 'right',
  },
  {
    id: 'ai-insights',
    targetSelector: '[data-tour="ai-insights"]',
    targetPath: '/admin/ai-insights',
    title: 'AI Insights — Institutional Monitoring',
    what: 'System-wide anomaly detection and institutional risk summaries.',
    do: 'Review emerging risk cohorts, department performance drops, and AI governance alerts.',
    why: 'Prevents systemic academic drops by highlighting institutional anomalies early.',
    position: 'right',
  },
  {
    id: 'examinations',
    targetSelector: '[data-tour="examinations"]',
    targetPath: '/admin/examinations',
    title: 'Examinations — Assessment Governance',
    what: 'Institutional exam schedule and grading parameter oversight.',
    do: 'Review scheduled examinations, inspect max score rules, and track cycle completions.',
    why: 'Maintains exam security and standardized assessment policies.',
    position: 'right',
  },
  {
    id: 'reports',
    targetSelector: '[data-tour="reports"]',
    targetPath: '/admin/reports',
    title: 'Reports — Official Transcripts & Summaries',
    what: 'Printable official academic transcript and evaluation report generator.',
    do: 'Select any student, generate official evaluation summaries, and click Print Report.',
    why: 'Provides official, printable institutional transcripts for academic evaluation.',
    position: 'right',
  },
  {
    id: 'profile',
    targetSelector: '[data-tour="profile"]',
    targetPath: '/admin/profile',
    title: 'Profile — Executive Identity & Credentials',
    what: 'Your administrator identity, system credentials, and security oversight settings.',
    do: 'Manage system settings, view administrator credentials, and set workspace preferences.',
    why: 'Ensures institutional access security and system-level configuration parameters.',
    position: 'right',
  },
];

interface InteractiveProductTourProps {
  active: boolean;
  onFinish: () => void;
}

export function InteractiveProductTour({ active, onFinish }: InteractiveProductTourProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role: UserRole = user?.role || 'student';
  const steps: TourStep[] =
    role === 'teacher' ? TEACHER_TOUR_STEPS : role === 'admin' ? ADMIN_TOUR_STEPS : STUDENT_TOUR_STEPS;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = steps[currentStepIndex];

  // Update target element rect
  const updateTargetRect = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.targetSelector);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [step]);

  // Navigate & measure target rect
  useEffect(() => {
    if (!active || !step) return;

    if (location.pathname !== step.targetPath) {
      navigate(step.targetPath);
    }

    const timer = setTimeout(() => {
      updateTargetRect();
    }, 250);

    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [active, currentStepIndex, step, location.pathname, navigate, updateTargetRect]);

  if (!active || !step) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Compute Tooltip Positioning
  let tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 60,
  };

  if (targetRect) {
    const margin = 16;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      tooltipStyle = {
        position: 'fixed',
        bottom: '24px',
        left: '16px',
        right: '16px',
        margin: '0 auto',
        zIndex: 60,
      };
    } else {
      // Desktop positioning relative to sidebar or highlighted DOM rect
      const topPos = Math.max(20, Math.min(window.innerHeight - 380, targetRect.top - 10));
      const leftPos = targetRect.right + margin;

      tooltipStyle = {
        position: 'fixed',
        top: `${topPos}px`,
        left: `${leftPos}px`,
        zIndex: 60,
      };
    }
  }

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-50 pointer-events-auto font-body">
          {/* SPOTLIGHT BACKDROP WITH TARGET CUTOUT */}
          <div className="fixed inset-0 bg-ink-950/60 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto" />

          {/* HIGHLIGHTED ELEMENT RING */}
          {targetRect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="fixed pointer-events-none z-50 rounded-2xl border-2 border-cobalt-500 shadow-glow ring-4 ring-cobalt-400/30"
              style={{
                top: `${targetRect.top - 4}px`,
                left: `${targetRect.left - 4}px`,
                width: `${targetRect.width + 8}px`,
                height: `${targetRect.height + 8}px`,
              }}
            />
          )}

          {/* STEP TOOLTIP CARD */}
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={tooltipStyle}
            className="w-full max-w-md bg-white rounded-3xl p-6 border border-ink-150 shadow-pop space-y-4 z-60 text-ink-900 overflow-hidden"
          >
            {/* STEP HEADER & PROGRESS */}
            <div className="flex items-center justify-between border-b border-ink-150 pb-3">
              <div className="flex items-center gap-2">
                <Badge tone="cobalt" className="px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold">
                  {String(currentStepIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
                </Badge>
                <span className="text-xs font-mono font-semibold text-ink-500 capitalize">{role} Tour</span>
              </div>
              <button
                onClick={onFinish}
                className="text-xs font-bold text-ink-400 hover:text-ink-950 transition-colors"
              >
                Skip Tour &rarr;
              </button>
            </div>

            {/* STEP TITLE */}
            <h3 className="text-lg font-display font-bold text-ink-950 leading-tight">
              {step.title}
            </h3>

            {/* WHAT / DO / WHY STRUCTURED CONTENT */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-ink-50 border border-ink-150 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-cobalt-600 block">1. WHAT IS THIS?</span>
                <p className="text-ink-800 leading-relaxed font-medium">{step.what}</p>
              </div>

              <div className="p-3 rounded-2xl bg-cobalt-50/60 border border-cobalt-200/80 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-cobalt-700 block">2. WHAT CAN I DO HERE?</span>
                <p className="text-ink-800 leading-relaxed font-medium">{step.do}</p>
              </div>

              <div className="p-3 rounded-2xl bg-sage-50/60 border border-sage-200/80 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-sage-700 block">3. WHY DOES IT MATTER?</span>
                <p className="text-ink-800 leading-relaxed font-medium">{step.why}</p>
              </div>
            </div>

            {/* FOOTER CONTROLS & PROGRESS BAR */}
            <div className="flex items-center justify-between pt-2 border-t border-ink-150">
              <div className="flex items-center gap-1.5">
                {steps.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStepIndex ? 'w-5 bg-cobalt-600' : 'w-1.5 bg-ink-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {currentStepIndex > 0 && (
                  <Button variant="secondary" size="sm" onClick={handleBack} className="rounded-xl text-xs">
                    &larr; Back
                  </Button>
                )}
                <Button variant="accent" size="sm" onClick={handleNext} className="rounded-xl text-xs shadow-glow">
                  {currentStepIndex === steps.length - 1 ? "You're Ready \u2192" : "Next \u2192"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default InteractiveProductTour;
