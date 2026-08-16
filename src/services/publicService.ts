import { useStore } from './dataStore';

export function usePublicService() {
  const store = useStore();

  const getAnnouncements = () => store.announcements;
  
  const getTopTeachers = () => {
    // For demo, just return the first 3
    return store.teachers.slice(0, 3);
  };

  const getTopRatedCourses = () => {
    return [...store.courses].sort((a, b) => b.rating - a.rating).slice(0, 3);
  };

  return {
    getAnnouncements,
    getTopTeachers,
    getTopRatedCourses,
  };
}
