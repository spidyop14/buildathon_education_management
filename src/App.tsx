import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { PublicLayout } from '@/components/layout/PublicLayout';

/* ============================== Lazy-loaded Pages ============================== */

// Public
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const PlatformPage = lazy(() => import('@/pages/public/PlatformPage'));
const AIIntelligencePage = lazy(() => import('@/pages/public/AIIntelligencePage'));
const ForStudentsPage = lazy(() => import('@/pages/public/ForStudentsPage'));
const ForTeachersPage = lazy(() => import('@/pages/public/ForTeachersPage'));
const ForAdministratorsPage = lazy(() => import('@/pages/public/ForAdministratorsPage'));
const CoursesPage = lazy(() => import('@/pages/public/CoursesPage'));
const CourseDetailPage = lazy(() => import('@/pages/public/CourseDetailPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const LoginPage = lazy(() => import('@/pages/public/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/public/ForgotPasswordPage'));

// Student
const StudentDashboard = lazy(() => import('@/pages/student/DashboardPage'));
const StudentCourses = lazy(() => import('@/pages/student/CoursesPage'));
const StudentAssignments = lazy(() => import('@/pages/student/AssignmentsPage'));
const StudentAttendance = lazy(() => import('@/pages/student/AttendancePage'));
const StudentExaminations = lazy(() => import('@/pages/student/ExaminationsPage'));
const StudentProgress = lazy(() => import('@/pages/student/ProgressPage'));
const StudentIntelligence = lazy(() => import('@/pages/student/IntelligencePage'));
const StudyPlannerPage = lazy(() => import('@/pages/student/StudyPlannerPage'));
const StudentProfile = lazy(() => import('@/pages/student/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/student/SettingsPage'));
const ExamTakePage = lazy(() => import('@/pages/student/ExamTakePage'));
const ExamResultPage = lazy(() => import('@/pages/student/ExamResultPage'));

// Teacher
const TeacherDashboard = lazy(() => import('@/pages/teacher/DashboardPage'));
const TeacherCourses = lazy(() => import('@/pages/teacher/CoursesPage'));
const TeacherClasses = lazy(() => import('@/pages/teacher/ClassesPage'));
const TeacherAttendance = lazy(() => import('@/pages/teacher/AttendancePage'));
const TeacherAssignments = lazy(() => import('@/pages/teacher/AssignmentsPage'));
const TeacherSubmissions = lazy(() => import('@/pages/teacher/SubmissionsPage'));
const TeacherExaminations = lazy(() => import('@/pages/teacher/ExaminationsPage'));
const TeacherStudents = lazy(() => import('@/pages/teacher/StudentsPage'));
const TeacherInsights = lazy(() => import('@/pages/teacher/InsightsPage'));
const TeacherProfile = lazy(() => import('@/pages/teacher/ProfilePage'));

// Admin
const AdminDashboard = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminStudents = lazy(() => import('@/pages/admin/StudentsPage'));
const AdminTeachers = lazy(() => import('@/pages/admin/TeachersPage'));
const AdminCourses = lazy(() => import('@/pages/admin/CoursesPage'));
const AdminClasses = lazy(() => import('@/pages/admin/ClassesPage'));
const AdminExaminations = lazy(() => import('@/pages/admin/ExaminationsPage'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AnalyticsPage'));
const AdminReports = lazy(() => import('@/pages/admin/ReportsPage'));
const AdminAIInsights = lazy(() => import('@/pages/admin/AIInsightsPage'));

// Shared
const ComingSoonPage = lazy(() => import('@/pages/ComingSoonPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/* ============================== Loading Fallback ============================== */

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-ink-200 border-t-cobalt-500 rounded-full animate-spin" />
        <p className="text-sm text-ink-400">Loading…</p>
      </div>
    </div>
  );
}

/* ============================== App Router ============================== */

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ========== Public Routes ========== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/platform" element={<PlatformPage />} />
          <Route path="/ai-intelligence" element={<AIIntelligencePage />} />
          <Route path="/for-students" element={<ForStudentsPage />} />
          <Route path="/for-teachers" element={<ForTeachersPage />} />
          <Route path="/for-administrators" element={<ForAdministratorsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* ========== Student Routes ========== */}
        <Route element={<RoleGuard allowedRole="student" />}>
          <Route element={<AppShell />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
            <Route path="/student/attendance" element={<StudentAttendance />} />
            <Route path="/student/examinations" element={<StudentExaminations />} />
            <Route path="/student/progress" element={<StudentProgress />} />
            <Route path="/student/subjects" element={<StudentProgress />} />
            <Route path="/student/intelligence" element={<StudentIntelligence />} />
            <Route path="/student/schedule" element={<StudentAttendance />} />
            <Route path="/student/planner" element={<StudyPlannerPage />} />
            <Route path="/student/materials" element={<StudentCourses />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/settings" element={<SettingsPage />} />
          </Route>
          {/* Full-Screen Exam Experience */}
          <Route path="/student/examinations/:examId" element={<ExamTakePage />} />
          <Route path="/student/examinations/:examId/result" element={<ExamResultPage />} />
        </Route>

        {/* ========== Teacher Routes ========== */}
        <Route element={<RoleGuard allowedRole="teacher" />}>
          <Route element={<AppShell />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<TeacherCourses />} />
            <Route path="/teacher/classes" element={<TeacherClasses />} />
            <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            <Route path="/teacher/assignments" element={<TeacherAssignments />} />
            <Route path="/teacher/submissions" element={<TeacherSubmissions />} />
            <Route path="/teacher/examinations" element={<TeacherExaminations />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/insights" element={<TeacherInsights />} />
            <Route path="/teacher/profile" element={<TeacherProfile />} />
          </Route>
        </Route>

        {/* ========== Admin Routes ========== */}
        <Route element={<RoleGuard allowedRole="admin" />}>
          <Route element={<AppShell />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/teachers" element={<AdminTeachers />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/classes" element={<AdminClasses />} />
            <Route path="/admin/assignments" element={<AdminCourses />} />
            <Route path="/admin/examinations" element={<AdminExaminations />} />
            <Route path="/admin/grades" element={<AdminExaminations />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/ai-insights" element={<AdminAIInsights />} />
            <Route path="/admin/insights" element={<AdminAIInsights />} />
            <Route path="/admin/profile" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* ========== Catch-all ========== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
