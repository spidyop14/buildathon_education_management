import { Student, RosterStudent } from '@/types';

export function generateStudentReport(student: Student) {
    return {
        id: `rep_${Date.now()}`,
        studentId: student.id,
        name: student.name,
        date: new Date().toISOString().split('T')[0],
        attendance: student.attendance,
        subjects: student.subjects,
        // In a real app we would fetch the insights here from the AI service
    }
}
