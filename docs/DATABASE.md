# Data Models & Data Layer Documentation

## Data Layer Disclosure
> **Implementation Details**: EduIQ currently utilizes a centralized, reactive in-memory data store (`dataStore.ts`) backed by `localStorage` persistence and initialized with realistic institutional mock data (`src/data/mock.ts`). This allows EduIQ to run as a full client-side demo application without external cloud database dependencies.

---

## Entity Relationship Overview

```
User (Student / Teacher / Admin)
  │
  ├── Student ───< Enrollment >─── Course ───< ClassSection
  │     │                                       │
  │     ├── AssignmentSubmission ── Assignment ──┘
  │     │
  │     ├── ExamTake ── Examination ────────────┘
  │     │
  │     └── AttendanceEntry
  │
  └── Teacher ─── Assigned Course & ClassSection
```

---

## Core Entities & Schemas

### 1. Student (`Student`)
```ts
interface Student {
  id: string;             // e.g. 's1'
  name: string;           // e.g. 'Maya Whitfield'
  code: string;           // e.g. 'STU-2024-0391'
  year: string;           // e.g. 'Sophomore'
  attendance: number;     // Percentage (0 - 100)
  subjects: Array<{
    name: string;
    course: string;
    assignmentAvg: number;
    examAvg: number;
    examHistory: number[];
  }>;
  attendanceLog: Array<{
    day: number;
    status: 'present' | 'late' | 'absent';
  }>;
}
```

### 2. Teacher (`Teacher`)
```ts
interface Teacher {
  id: string;             // e.g. 't1'
  name: string;           // e.g. 'Dr. Elena Marsh'
  dept: string;           // e.g. 'Mathematics'
  title: string;          // e.g. 'Associate Professor'
}
```

### 3. Course (`Course`)
```ts
interface Course {
  id: string;             // e.g. 'c1'
  code: string;           // e.g. 'MATH-201'
  title: string;          // e.g. 'Calculus & Linear Algebra'
  dept: string;           // e.g. 'Mathematics'
  level: string;          // e.g. 'Undergraduate'
  credits: number;        // e.g. 4
  teacherId: string;      // e.g. 't1'
  desc: string;
  rating: number;         // e.g. 4.8
  category: string;
  syllabus: Array<{ week: number; topic: string }>;
  schedule: Array<{ day: string; time: string; room: string }>;
}
```

### 4. Assignment (`Assignment`)
```ts
interface Assignment {
  id: string;
  course: string;
  title: string;
  due: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore: number;
  feedback?: string;
}
```

### 5. Examination (`Exam`)
```ts
interface Exam {
  id: string;
  course: string;
  title: string;
  date: string;
  score: number | null;
  maxScore: number;
  questions?: Array<{
    id: string;
    prompt: string;
    options: string[];
    correctIndex: number;
  }>;
}
```

---

## Reactive Store Mutations
Mutations in `dataStore.ts` publish updates reactively via `useSyncExternalStore`:
- `enrollInCourse(studentId, courseId)`
- `submitAssignment(assignmentId)`
- `gradeAssignment(assignmentId, score, feedback)`
- `saveAttendance(records)`
- `submitExamTake(examId, score)`
- `addStudent()`, `updateStudent()`, `deleteStudent()`
- `addTeacher()`, `updateTeacher()`, `deleteTeacher()`
- `addCourse()`, `updateCourse()`, `deleteCourse()`
