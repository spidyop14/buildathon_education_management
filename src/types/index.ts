/* ============================================
   EduIQ — Type definitions
   ============================================ */

export interface Teacher {
  id: string;
  name: string;
  dept: string;
  title: string;
  email?: string;
  bio?: string;
}

export interface SyllabusItem {
  week: number;
  topic: string;
  description: string;
}

export interface CourseSchedule {
  day: string;
  time: string;
  room: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  dept: string;
  credits: number;
  teacherId: string;
  desc: string;
  category: string;
  rating: number;
  level: 'Introductory' | 'Intermediate' | 'Advanced';
  syllabus: SyllabusItem[];
  schedule: CourseSchedule[];
}

export interface SubjectPerformance {
  course: string;
  name: string;
  assignmentAvg: number;
  examAvg: number;
  examHistory: number[];
}

export interface AttendanceEntry {
  day: number;
  status: 'present' | 'late' | 'absent';
}

export interface Student {
  id: string;
  name: string;
  code: string;
  year: string;
  attendance: number;
  subjects: SubjectPerformance[];
  attendanceLog: AttendanceEntry[];
}

export interface RosterStudent {
  id: string;
  name: string;
  attendance: number;
  avg: number;
}

export interface Assignment {
  id: string;
  course: string;
  title: string;
  desc?: string;
  due: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  score?: number;
  maxScore: number;
  feedback?: string;
  submittedAt?: string;
}

export interface ClassSection {
  id: string;
  courseId: string;
  sectionName: string;
  teacherId: string;
  schedule: string;
  room: string;
  studentCount: number;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
}

export interface Exam {
  id: string;
  course: string;
  title: string;
  date: string;
  score: number | null;
  maxScore: number;
  duration?: number;
  questions?: ExamQuestion[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  actor: string;
}

export interface StudyPlanItem {
  day: string;
  subject: string;
  durationMinutes: number;
  focusTopic: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'important' | 'event';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface StudyTip {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  courseId: string;
  type: 'assignment' | 'exam';
  title: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface Insight {
  id: string;
  category: 'weak_subject' | 'improving' | 'declining' | 'risk' | 'risk_summary';
  severity: 'high' | 'moderate' | 'positive' | 'low';
  title: string;
  metric: string;
  recommendation: string;
  trend: 'improving' | 'declining' | 'flat';
}

export type UserRole = 'student' | 'teacher' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  academicYear?: string;
  facultyId?: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export type IconName =
  | 'home' | 'book' | 'calendar' | 'clipboard' | 'chart'
  | 'sparkles' | 'user' | 'logout' | 'menu' | 'x'
  | 'chevron' | 'trendUp' | 'trendDown' | 'alert' | 'check'
  | 'users' | 'cap' | 'settings' | 'file' | 'award'
  | 'activity' | 'plus' | 'search' | 'filter' | 'bell'
  | 'arrowRight' | 'clock' | 'download' | 'mail'
  | 'printer' | 'edit' | 'trash' | 'star' | 'help';
