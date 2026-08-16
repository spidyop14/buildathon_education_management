import { useState, useEffect } from 'react';

export interface StudentProfileData {
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  department: string;
  program: string;
  academicYear: string;
  semester: string;
  section: string;
  enrollmentYear: string;
  advisor: string;
  emergencyContact: string;
  guardianName: string;
  guardianPhone: string;
  avatar: string | null;
}

export const DEFAULT_STUDENT_PROFILE: StudentProfileData = {
  fullName: 'Maya Whitfield',
  studentId: 'STU-1042',
  email: 'maya.whitfield@eduiq.edu',
  phone: '+91 98765 43210',
  dateOfBirth: '14/05/2004',
  gender: 'Female',
  department: 'Computer Science',
  program: 'B.Tech Computer Science & Engineering',
  academicYear: 'Junior',
  semester: 'Semester 5',
  section: 'CSE-A',
  enrollmentYear: '2024',
  advisor: 'Dr. Elena Marsh',
  emergencyContact: '+91 98765 00000 (Primary Emergency)',
  guardianName: 'Robert Whitfield',
  guardianPhone: '+91 98765 11111',
  avatar: null,
};

const STORAGE_KEY = 'eduiq_student_profile';
const LISTENERS = new Set<() => void>();

export function getStoredProfile(): StudentProfileData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_STUDENT_PROFILE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to parse eduiq_student_profile', e);
  }
  return DEFAULT_STUDENT_PROFILE;
}

export function saveStoredProfile(updated: Partial<StudentProfileData>): StudentProfileData {
  const current = getStoredProfile();
  const next = { ...current, ...updated };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.error('Failed to save eduiq_student_profile', e);
  }
  LISTENERS.forEach(cb => cb());
  return next;
}

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfileData>(getStoredProfile());

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(getStoredProfile());
    };
    LISTENERS.add(handleUpdate);
    return () => {
      LISTENERS.delete(handleUpdate);
    };
  }, []);

  const updateProfile = (data: Partial<StudentProfileData>) => {
    return saveStoredProfile(data);
  };

  return { profile, updateProfile };
}
