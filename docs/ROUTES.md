# Complete Route Specification & Access Control Map

## 1. Public Routes (Unrestricted)

| Route Path | Component | Purpose | Access Level |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage.tsx` | Platform overview, hero, feature previews | Public |
| `/courses` | `CoursesPage.tsx` | Searchable course catalog | Public |
| `/courses/:courseId` | `CourseDetailPage.tsx` | Course syllabus & enrollment CTA | Public |
| `/contact` | `ContactPage.tsx` | Help accordion & contact form | Public |
| `/login` | `LoginPage.tsx` | Sign in & role selection modal | Public |
| `/register` | `RegisterPage.tsx` | Account registration | Public |

---

## 2. Student Routes (`RoleGuard: student`)

| Route Path | Component | Purpose | Access Level |
| :--- | :--- | :--- | :--- |
| `/student/dashboard` | `DashboardPage.tsx` | Composite score, attendance ring | Student |
| `/student/courses` | `CoursesPage.tsx` | Learning portfolio & course details | Student |
| `/student/assignments` | `AssignmentsPage.tsx` | Coursework submission center | Student |
| `/student/attendance` | `AttendancePage.tsx` | Session log & attendance health | Student |
| `/student/examinations` | `ExaminationsPage.tsx` | Assessment catalog & history | Student |
| `/student/examinations/:id` | `ExamTakePage.tsx` | Timed full-screen exam mode | Student |
| `/student/progress` | `ProgressPage.tsx` | Weak subject tips & trends | Student |
| `/student/intelligence` | `IntelligencePage.tsx` | AI academic tips & insights | Student |
| `/student/planner` | `StudyPlannerPage.tsx` | Actionable revision task planner | Student |
| `/student/profile` | `ProfilePage.tsx` | Student profile & local storage | Student |

---

## 3. Teacher Routes (`RoleGuard: teacher`)

| Route Path | Component | Purpose | Access Level |
| :--- | :--- | :--- | :--- |
| `/teacher/dashboard` | `DashboardPage.tsx` | Educator control center & stats | Teacher |
| `/teacher/courses` | `CoursesPage.tsx` | Teaching portfolio & curriculum | Teacher |
| `/teacher/classes` | `ClassesPage.tsx` | Class section schedule & drawer | Teacher |
| `/teacher/assignments` | `AssignmentsPage.tsx` | Coursework creation & deadlines | Teacher |
| `/teacher/submissions` | `SubmissionsPage.tsx` | Split-view grading with AI Assistant | Teacher |
| `/teacher/examinations` | `ExaminationsPage.tsx` | MCQ Exam Builder modal | Teacher |
| `/teacher/attendance` | `AttendancePage.tsx` | One-touch section attendance logger | Teacher |
| `/teacher/students` | `StudentsPage.tsx` | Roster & student intelligence side panel | Teacher |
| `/teacher/insights` | `InsightsPage.tsx` | Academic Pulse node diagram | Teacher |
| `/teacher/profile` | `ProfilePage.tsx` | Educator profile & local storage | Teacher |

---

## 4. Administrator Routes (`RoleGuard: admin`)

| Route Path | Component | Purpose | Access Level |
| :--- | :--- | :--- | :--- |
| `/admin/dashboard` | `DashboardPage.tsx` | Executive institutional health | Admin |
| `/admin/students` | `StudentsPage.tsx` | Student roster CRUD governance | Admin |
| `/admin/teachers` | `TeachersPage.tsx` | Faculty catalog & assignments | Admin |
| `/admin/courses` | `CoursesPage.tsx` | Course catalog management | Admin |
| `/admin/classes` | `ClassesPage.tsx` | Class section & room scheduling | Admin |
| `/admin/analytics` | `AnalyticsPage.tsx` | System-wide comparative analytics | Admin |
| `/admin/ai-insights` | `AIInsightsPage.tsx` | Institutional anomaly monitoring | Admin |
| `/admin/examinations` | `ExaminationsPage.tsx` | Assessment cycle governance | Admin |
| `/admin/reports` | `ReportsPage.tsx` | Printable official transcripts | Admin |
