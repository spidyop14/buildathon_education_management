import { useStore, useStoreActions } from './dataStore';
import { Course, Teacher } from '@/types';

export function useAdminService() {
  const store = useStore();
  const actions = useStoreActions();

  const getRoster = () => store.roster;
  const getTeachers = () => store.teachers;
  const getCourses = () => store.courses;
  const getClasses = () => store.classes;
  const getActivityLogs = () => store.activityLogs;
  const getExams = () => store.exams;

  const addStudent = actions.addStudent;
  const updateStudent = actions.updateStudent;
  const deleteStudent = actions.deleteStudent;

  const addTeacher = actions.addTeacher;
  const updateTeacher = actions.updateTeacher;
  const deleteTeacher = actions.deleteTeacher;

  const addCourse = actions.addCourse;
  const updateCourse = actions.updateCourse;
  const deleteCourse = actions.deleteCourse;

  const addClass = actions.addClass;
  const updateClass = actions.updateClass;
  const deleteClass = actions.deleteClass;

  const createExam = actions.createExam;
  const updateExam = actions.updateExam;
  const deleteExam = actions.deleteExam;

  return {
    getRoster,
    getTeachers,
    getCourses,
    getClasses,
    getActivityLogs,
    getExams,
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
  };
}
