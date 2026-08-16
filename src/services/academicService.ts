import { useStore } from './dataStore';

export function useAcademicService() {
  const store = useStore();

  const getStudentGrades = (studentId: string) => {
    // For demo purposes, we're returning the mock subject performance
    // In a real app this would query the GradeRecord table
    return store.student.subjects;
  };

  const getClassPerformance = () => {
    return store.roster;
  };

  return {
    getStudentGrades,
    getClassPerformance,
  };
}
