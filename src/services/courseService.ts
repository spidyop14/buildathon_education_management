import { Course, Teacher } from '@/types';
import { useStore } from './dataStore';

export function useCourseService() {
  const store = useStore();

  const getAllCourses = (): Course[] => {
    return store.courses || [];
  };

  const searchCourses = (query: string): Course[] => {
    const q = query.toLowerCase();
    return (store.courses || []).filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q)
    );
  };

  const filterCourses = (category?: string, level?: string): Course[] => {
    return (store.courses || []).filter((c) => {
      const matchCat = category ? c.category === category : true;
      const matchLevel = level ? c.level === level : true;
      return matchCat && matchLevel;
    });
  };

  const getCourseById = (id: string): Course | undefined => {
    return (store.courses || []).find((c) => c.id === id);
  };

  const getCourseTeacher = (teacherId: string): Teacher | undefined => {
     return (store.teachers || []).find(t => t.id === teacherId);
  }

  return {
    getAllCourses,
    searchCourses,
    filterCourses,
    getCourseById,
    getCourseTeacher,
  };
}
