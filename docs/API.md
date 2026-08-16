# Client Service API Specification

## Service Layer Architecture Disclosure
> **Implementation Disclosure**: The EduIQ demo uses client-side TypeScript services (`studentService`, `teacherService`, `adminService`, `courseService`, `aiService`) backed by the reactive `dataStore.ts`. It does not require a remote REST/GraphQL server for local demo execution.

---

## 1. Student Service (`studentService.ts`)

### `getStudent()`
- **Returns**: Current student object (`Student`).
- **Data Source**: `dataStore.student`.

### `getEnrolledCourses()`
- **Returns**: Array of enrolled `Course` objects.
- **Data Source**: Derived by matching `dataStore.enrollments` against `dataStore.courses`.

### `submitAssignment(assignmentId: string)`
- **Parameters**: `assignmentId` (string).
- **Behavior**: Updates assignment status to `'submitted'`, logs activity.

### `submitExamTake(examId: string, achievedScore: number)`
- **Parameters**: `examId` (string), `achievedScore` (number).
- **Behavior**: Updates exam score, recalculates subject `examHistory` & `examAvg`.

---

## 2. Teacher Service (`teacherService.ts`)

### `getTeacherCourses(teacherId: string)`
- **Returns**: Array of courses taught by `teacherId`.

### `saveAttendance(records: AttendanceRecord[])`
- **Parameters**: Array of `{ studentId: string; status: 'present' | 'late' | 'absent' }`.
- **Behavior**: Adjusts student attendance percentages and roster stats reactively.

### `gradeAssignment(assignmentId: string, score: number, feedback: string)`
- **Parameters**: `assignmentId`, `score`, `feedback`.
- **Behavior**: Sets assignment status to `'graded'`, updates score and instructor feedback.

---

## 3. Admin Service (`adminService.ts`)

### `getRoster()`
- **Returns**: Full roster array (`RosterStudent[]`).

### `addStudent(student)`, `updateStudent(id, updates)`, `deleteStudent(id)`
- **Behavior**: Performs CRUD operations on the student roster and records administrative log entries.

### `addTeacher(teacher)`, `updateTeacher(id, updates)`, `deleteTeacher(id)`
- **Behavior**: Performs CRUD operations on faculty profiles.

---

## 4. AI Service (`aiService.ts`)

### `getStudentInsights()`
- **Returns**: Array of `Insight` objects calculated from the student's attendance and grade arrays.
