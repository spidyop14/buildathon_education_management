import { useStore, useStoreActions } from './dataStore';

export function useTeacherService() {
  const store = useStore();
  const actions = useStoreActions();

  const getClasses = () => {
    // In a real app this would filter by teacherId, but for demo we just show all or mock
    return store.courses;
  };

  const getRoster = () => store.roster;

  const saveAttendance = (records: Array<{ studentId: string; status: 'present' | 'late' | 'absent' }>) => {
    actions.saveAttendance(records);
  };

  const gradeAssignment = (assignmentId: string, score: number, feedback?: string) => {
    actions.gradeAssignment(assignmentId, score, feedback || '');
  };
  
  const getSubmissions = () => store.assignments.filter(a => a.status === 'submitted' || a.status === 'graded');

  const createAssignment = actions.createAssignment;

  return {
    getClasses,
    getRoster,
    saveAttendance,
    createAssignment,
    gradeAssignment,
    getSubmissions,
  };
}
