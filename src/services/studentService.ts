import { useStore, useStoreActions } from './dataStore';

export function useStudentService() {
  const store = useStore();
  const actions = useStoreActions();

  const getStudent = () => store.student;

  const getAttendanceLog = () => store.student.attendanceLog;

  const getEnrolledCourses = () => {
    const enrollments = store.enrollments.filter(e => e.studentId === store.student.id);
    return enrollments.map(e => store.courses.find(c => c.id === e.courseId)).filter(Boolean) as any[];
  };

  const getUpcomingExams = () => {
    return store.exams.filter(e => e.score === null);
  };

  const getGradeHistory = () => {
    return store.exams.filter(e => e.score !== null);
  };

  const getAssignments = () => store.assignments;

  const submitAssignment = actions.submitAssignment;

  const submitExamTake = actions.submitExamTake;

  return {
    getStudent,
    getAttendanceLog,
    getEnrolledCourses,
    getUpcomingExams,
    getGradeHistory,
    getAssignments,
    submitAssignment,
    submitExamTake,
  };
}
