# Routing Architecture & Route Table

EduIQ uses React Router v6 with declarative route structures and lazy-loaded code splitting for optimal page performance.

---

## Complete Route Specification Table

| Role Scope | Path | Component | Purpose | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **Public** | `/` | `HomePage.tsx` | Platform overview, hero, feature previews | Unrestricted |
| **Public** | `/courses` | `CoursesPage.tsx` | Searchable course catalog | Unrestricted |
| **Public** | `/courses/:courseId` | `CourseDetailPage.tsx` | Course syllabus & enrollment CTA | Unrestricted |
| **Public** | `/contact` | `ContactPage.tsx` | Help accordion & contact form | Unrestricted |
| **Public** | `/login` | `LoginPage.tsx` | Sign in & role selection | Unrestricted |
| **Public** | `/register` | `RegisterPage.tsx` | Account registration | Unrestricted |
| **Student** | `/student/dashboard` | `DashboardPage.tsx` | Composite score, attendance ring | Student Guard |
| **Student** | `/student/courses` | `CoursesPage.tsx` | Learning portfolio & course details | Student Guard |
| **Student** | `/student/assignments` | `AssignmentsPage.tsx` | Coursework submission center | Student Guard |
| **Student** | `/student/attendance` | `AttendancePage.tsx` | Session log & attendance health | Student Guard |
| **Student** | `/student/examinations` | `ExaminationsPage.tsx` | Assessment catalog & history | Student Guard |
| **Student** | `/student/examinations/:id` | `ExamTakePage.tsx` | Timed full-screen exam mode | Student Guard |
| **Student** | `/student/progress` | `ProgressPage.tsx` | Weak subject tips & trends | Student Guard |
| **Teacher** | `/teacher/dashboard` | `DashboardPage.tsx` | Educator control center & stats | Teacher Guard |
| **Teacher** | `/teacher/attendance` | `AttendancePage.tsx` | Fast section attendance logger | Teacher Guard |
| **Teacher** | `/teacher/submissions` | `SubmissionsPage.tsx` | Split-view grading with AI | Teacher Guard |
| **Teacher** | `/teacher/examinations` | `ExaminationsPage.tsx` | MCQ Exam Builder modal | Teacher Guard |
| **Teacher** | `/teacher/insights` | `InsightsPage.tsx` | Academic Pulse node diagram | Teacher Guard |
| **Admin** | `/admin/dashboard` | `DashboardPage.tsx` | Institutional executive health | Admin Guard |
| **Admin** | `/admin/students` | `StudentsPage.tsx` | Student roster CRUD governance | Admin Guard |
| **Admin** | `/admin/teachers` | `TeachersPage.tsx` | Faculty catalog & assignments | Admin Guard |
| **Admin** | `/admin/reports` | `ReportsPage.tsx` | Printable official transcripts | Admin Guard |
