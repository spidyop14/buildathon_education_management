/**
 * EduIQ — Reactive Data Store
 *
 * In-memory reactive store wrapping mock data with mutation support.
 * Uses React context + external subscription pattern for reactivity.
 * All data operations go through this store so we can replace with Supabase later.
 */

import React, { createContext, useContext, useCallback, useSyncExternalStore, useRef, type ReactNode } from 'react';
import type { Assignment, Enrollment, Exam, Student, RosterStudent, Announcement, AttendanceEntry, Course, Teacher, ClassSection, ActivityLog } from '@/types';
import {
  ASSIGNMENTS as INITIAL_ASSIGNMENTS,
  EXAMS as INITIAL_EXAMS,
  STUDENT_ME as INITIAL_STUDENT,
  ROSTER as INITIAL_ROSTER,
  INITIAL_ENROLLMENTS,
  ANNOUNCEMENTS as INITIAL_ANNOUNCEMENTS,
  COURSES,
  TEACHERS,
  INITIAL_CLASSES,
  INITIAL_ACTIVITY_LOGS,
} from '@/data/mock';

/* ============================== Store Shape ============================== */

interface StoreState {
  assignments: Assignment[];
  exams: Exam[];
  student: Student;
  roster: RosterStudent[];
  enrollments: Enrollment[];
  announcements: Announcement[];
  courses: Course[];
  teachers: Teacher[];
  classes: ClassSection[];
  activityLogs: ActivityLog[];
}

type Listener = () => void;

function createStore() {
  let state: StoreState = {
    assignments: [...INITIAL_ASSIGNMENTS],
    exams: [...INITIAL_EXAMS],
    student: { ...INITIAL_STUDENT, attendanceLog: [...INITIAL_STUDENT.attendanceLog], subjects: INITIAL_STUDENT.subjects.map(s => ({ ...s, examHistory: [...s.examHistory] })) },
    roster: INITIAL_ROSTER.map(r => ({ ...r })),
    enrollments: [...INITIAL_ENROLLMENTS],
    announcements: [...INITIAL_ANNOUNCEMENTS],
    courses: [...COURSES],
    teachers: [...TEACHERS],
    classes: [...INITIAL_CLASSES],
    activityLogs: [...INITIAL_ACTIVITY_LOGS],
  };

  const listeners = new Set<Listener>();

  function getState() {
    return state;
  }

  function setState(updater: (prev: StoreState) => StoreState) {
    state = updater(state);
    listeners.forEach((l) => l());
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}

/* ============================== Singleton ============================== */

const store = createStore();

/* ============================== React Integration ============================== */

export function useStore() {
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  return state;
}

export function useStoreActions() {
  /* ---------- Assignments ---------- */
  const submitAssignment = useCallback((assignmentId: string, content?: string) => {
    store.setState((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, status: 'submitted' as const, submittedAt: new Date().toISOString().split('T')[0] }
          : a
      ),
    }));
  }, []);

  const createAssignment = useCallback((assignment: Omit<Assignment, 'id' | 'status'>) => {
    const id = `a${Date.now()}`;
    store.setState((prev) => ({
      ...prev,
      assignments: [...prev.assignments, { ...assignment, id, status: 'pending' as const }],
    }));
    return id;
  }, []);

  const gradeAssignment = useCallback((assignmentId: string, score: number, feedback: string) => {
    store.setState((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, status: 'graded' as const, score, feedback }
          : a
      ),
    }));
  }, []);

  /* ---------- Exams ---------- */
  const updateExamScore = useCallback((examId: string, score: number) => {
    store.setState((prev) => ({
      ...prev,
      exams: prev.exams.map((e) =>
        e.id === examId ? { ...e, score } : e
      ),
    }));
  }, []);

  /* ---------- Attendance ---------- */
  const saveAttendance = useCallback((records: Array<{ studentId: string; status: 'present' | 'late' | 'absent' }>) => {
    store.setState((prev) => {
      // Update the current student's attendance log if they're in the records
      const myRecord = records.find(r => r.studentId === prev.student.id);
      let updatedStudent = prev.student;
      if (myRecord) {
        const newLog = [...prev.student.attendanceLog, { day: prev.student.attendanceLog.length + 1, status: myRecord.status }];
        const presentCount = newLog.filter(e => e.status === 'present').length;
        const lateCount = newLog.filter(e => e.status === 'late').length;
        const attendance = Math.round(((presentCount + lateCount * 0.5) / newLog.length) * 100);
        updatedStudent = { ...prev.student, attendanceLog: newLog, attendance };
      }

      // Update roster attendance
      const updatedRoster = prev.roster.map(r => {
        const rec = records.find(rec => rec.studentId === r.id);
        if (!rec) return r;
        // Simulate attendance adjustment
        const delta = rec.status === 'present' ? 1 : rec.status === 'late' ? 0.5 : -1;
        return { ...r, attendance: Math.max(0, Math.min(100, Math.round(r.attendance + delta))) };
      });

      return { ...prev, student: updatedStudent, roster: updatedRoster };
    });
  }, []);

  /* ---------- Enrollments ---------- */
  const enrollInCourse = useCallback((studentId: string, courseId: string) => {
    store.setState((prev) => {
      // Check if already enrolled
      if (prev.enrollments.some(e => e.studentId === studentId && e.courseId === courseId)) {
        return prev;
      }
      return {
        ...prev,
        enrollments: [...prev.enrollments, {
          id: `enr${Date.now()}`,
          studentId,
          courseId,
          enrolledAt: new Date().toISOString().split('T')[0],
        }],
      };
    });
  }, []);

  const unenrollFromCourse = useCallback((studentId: string, courseId: string) => {
    store.setState((prev) => ({
      ...prev,
      enrollments: prev.enrollments.filter(e => !(e.studentId === studentId && e.courseId === courseId)),
    }));
  }, []);

  /* ---------- Activity Logging ---------- */
  const logActivity = useCallback((type: string, description: string, actor: string) => {
    const newLog: ActivityLog = {
      id: `act${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type,
      description,
      actor,
    };
    store.setState((prev) => ({
      ...prev,
      activityLogs: [newLog, ...prev.activityLogs],
    }));
  }, []);

  /* ---------- Student Mutations ---------- */
  const addStudent = useCallback((student: { name: string; attendance: number; avg: number }) => {
    const id = `s${Date.now()}`;
    store.setState((prev) => ({
      ...prev,
      roster: [...prev.roster, { ...student, id }],
    }));
    logActivity('STUDENT_CREATE', `Created student profile for ${student.name}`, 'Administrator');
  }, [logActivity]);

  const updateStudent = useCallback((id: string, updates: Partial<RosterStudent>) => {
    store.setState((prev) => {
      const updatedRoster = prev.roster.map((s) => (s.id === id ? { ...s, ...updates } : s));
      let updatedStudent = prev.student;
      if (prev.student.id === id) {
        updatedStudent = { ...prev.student, name: updates.name || prev.student.name };
      }
      return { ...prev, roster: updatedRoster, student: updatedStudent };
    });
    logActivity('STUDENT_UPDATE', `Updated student profile ${id}`, 'Administrator');
  }, [logActivity]);

  const deleteStudent = useCallback((id: string) => {
    store.setState((prev) => ({
      ...prev,
      roster: prev.roster.filter((s) => s.id !== id),
    }));
    logActivity('STUDENT_DELETE', `Deleted student ${id}`, 'Administrator');
  }, [logActivity]);

  /* ---------- Teacher Mutations ---------- */
  const addTeacher = useCallback((teacher: Omit<Teacher, 'id'>) => {
    const id = `t${Date.now()}`;
    store.setState((prev) => ({
      ...prev,
      teachers: [...prev.teachers, { ...teacher, id }],
    }));
    logActivity('TEACHER_CREATE', `Added faculty member ${teacher.name}`, 'Administrator');
  }, [logActivity]);

  const updateTeacher = useCallback((id: string, updates: Partial<Teacher>) => {
    store.setState((prev) => ({
      ...prev,
      teachers: prev.teachers.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    logActivity('TEACHER_UPDATE', `Updated faculty profile ${id}`, 'Administrator');
  }, [logActivity]);

  const deleteTeacher = useCallback((id: string) => {
    store.setState((prev) => ({
      ...prev,
      teachers: prev.teachers.filter((t) => t.id !== id),
    }));
    logActivity('TEACHER_DELETE', `Removed faculty member ${id}`, 'Administrator');
  }, [logActivity]);

  /* ---------- Course Mutations ---------- */
  const addCourse = useCallback((course: Omit<Course, 'id' | 'syllabus' | 'schedule'>) => {
    const id = `c${Date.now()}`;
    store.setState((prev) => ({
      ...prev,
      courses: [
        ...prev.courses,
        {
          ...course,
          id,
          syllabus: [],
          schedule: [],
        },
      ],
    }));
    logActivity('COURSE_CREATE', `Created new course ${course.code} - ${course.title}`, 'Administrator');
  }, [logActivity]);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    store.setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    logActivity('COURSE_UPDATE', `Updated course catalog entry ${id}`, 'Administrator');
  }, [logActivity]);

  const deleteCourse = useCallback((id: string) => {
    store.setState((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
    }));
    logActivity('COURSE_DELETE', `Deleted course ${id}`, 'Administrator');
  }, [logActivity]);

  /* ---------- Class Section Mutations ---------- */
  const addClass = useCallback((classSection: Omit<ClassSection, 'id'>) => {
    const id = `cls${Date.now()}`;
    store.setState((prev) => ({
      ...prev,
      classes: [...prev.classes, { ...classSection, id }],
    }));
    logActivity('CLASS_CREATE', `Created class section ${classSection.sectionName}`, 'Administrator');
  }, [logActivity]);

  const updateClass = useCallback((id: string, updates: Partial<ClassSection>) => {
    store.setState((prev) => ({
      ...prev,
      classes: prev.classes.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    logActivity('CLASS_UPDATE', `Updated class section ${id}`, 'Administrator');
  }, [logActivity]);

  const deleteClass = useCallback((id: string) => {
    store.setState((prev) => ({
      ...prev,
      classes: prev.classes.filter((c) => c.id !== id),
    }));
    logActivity('CLASS_DELETE', `Deleted class section ${id}`, 'Administrator');
  }, [logActivity]);

  /* ---------- Exam Mutations & Interactive Exam Flow ---------- */
  const createExam = useCallback((exam: Omit<Exam, 'id'>) => {
    const id = `e${Date.now()}`;
    store.setState((prev) => ({
      ...prev,
      exams: [...prev.exams, { ...exam, id }],
    }));
    logActivity('EXAM_CREATE', `Created examination ${exam.title}`, 'Administrator');
  }, [logActivity]);

  const updateExam = useCallback((id: string, updates: Partial<Exam>) => {
    store.setState((prev) => ({
      ...prev,
      exams: prev.exams.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
    logActivity('EXAM_UPDATE', `Updated exam parameters ${id}`, 'Administrator');
  }, [logActivity]);

  const deleteExam = useCallback((id: string) => {
    store.setState((prev) => ({
      ...prev,
      exams: prev.exams.filter((e) => e.id !== id),
    }));
    logActivity('EXAM_DELETE', `Deleted exam ${id}`, 'Administrator');
  }, [logActivity]);

  const submitExamTake = useCallback((examId: string, achievedScore: number) => {
    store.setState((prev) => {
      const exam = prev.exams.find(e => e.id === examId);
      if (!exam) return prev;

      // Update exam score
      const updatedExams = prev.exams.map((e) =>
        e.id === examId ? { ...e, score: achievedScore } : e
      );

      // Update student subject exam history and subject exam average
      const updatedSubjects = prev.student.subjects.map((sub) => {
        if (sub.course === exam.course) {
          const newExamHistory = [...sub.examHistory, achievedScore];
          const newExamAvg = Math.round(newExamHistory.reduce((a, b) => a + b, 0) / newExamHistory.length);
          return { ...sub, examHistory: newExamHistory, examAvg: newExamAvg };
        }
        return sub;
      });

      const updatedStudent = { ...prev.student, subjects: updatedSubjects };

      return {
        ...prev,
        exams: updatedExams,
        student: updatedStudent,
      };
    });
    logActivity('EXAM_TAKEN', `Student completed exam ${examId} with score ${achievedScore}`, 'Student (Maya Whitfield)');
  }, [logActivity]);

  /* ---------- Assignment Edit/Delete ---------- */
  const updateAssignment = useCallback((id: string, updates: Partial<Assignment>) => {
    store.setState((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
    logActivity('ASSIGNMENT_UPDATE', `Updated assignment ${id}`, 'Teacher');
  }, [logActivity]);

  const deleteAssignment = useCallback((id: string) => {
    store.setState((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id),
    }));
    logActivity('ASSIGNMENT_DELETE', `Deleted assignment ${id}`, 'Teacher');
  }, [logActivity]);

  return {
    submitAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    gradeAssignment,
    updateExamScore,
    saveAttendance,
    enrollInCourse,
    unenrollFromCourse,
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addCourse,
    updateCourse,
    deleteCourse,
    addClass,
    updateClass,
    deleteClass,
    createExam,
    updateExam,
    deleteExam,
    submitExamTake,
    logActivity,
  };
}

/* ============================== Computed Helpers ============================== */

export function calculateAttendance(log: AttendanceEntry[]): number {
  if (log.length === 0) return 0;
  const present = log.filter(e => e.status === 'present').length;
  const late = log.filter(e => e.status === 'late').length;
  return Math.round(((present + late * 0.5) / log.length) * 100);
}

export function calculatePerformance(student: Student): number {
  if (student.subjects.length === 0) return 0;
  const academicAvg = student.subjects.reduce((a, s) => a + (s.assignmentAvg + s.examAvg) / 2, 0) / student.subjects.length;
  return Math.round(academicAvg * 0.6 + student.attendance * 0.4);
}

export function getGradeFromScore(score: number, maxScore: number): string {
  const pct = Math.round((score / maxScore) * 100);
  if (pct >= 90) return 'A';
  if (pct >= 80) return 'B';
  if (pct >= 70) return 'C';
  if (pct >= 60) return 'D';
  return 'F';
}
