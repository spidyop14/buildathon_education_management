import type { Teacher, Course, Student, RosterStudent, Assignment, Exam, Announcement, FAQItem, StudyTip, Enrollment, ClassSection, ActivityLog } from '@/types';

/* ============================== TEACHERS ============================== */
export const TEACHERS: Teacher[] = [
  { id: 't1', name: 'Dr. Elena Marsh', dept: 'Mathematics', title: 'Associate Professor', email: 'elena.marsh@eduiq.edu', bio: 'Specializes in applied mathematics and linear algebra with 12 years of teaching experience.' },
  { id: 't2', name: 'Prof. Raj Patel', dept: 'Data Science', title: 'Assistant Professor', email: 'raj.patel@eduiq.edu', bio: 'Expert in machine learning and statistical modeling. Published 25+ research papers.' },
  { id: 't3', name: 'Dr. Amara Osei', dept: 'Physics', title: 'Professor', email: 'amara.osei@eduiq.edu', bio: 'Leading researcher in quantum mechanics and thermodynamics with multiple awards.' },
  { id: 't4', name: 'Dr. Lucia Bianchi', dept: 'English', title: 'Senior Lecturer', email: 'lucia.bianchi@eduiq.edu', bio: 'Specializes in academic writing, rhetoric, and contemporary literature analysis.' },
];

/* ============================== COURSES ============================== */
export const COURSES: Course[] = [
  {
    id: 'c1', code: 'MATH201', title: 'Calculus & Linear Algebra', dept: 'Mathematics', credits: 4, teacherId: 't1',
    desc: 'Core mathematical foundations covering differential calculus, integral calculus, and linear algebra applications for STEM disciplines.',
    category: 'Mathematics', rating: 4.2, level: 'Intermediate',
    syllabus: [
      { week: 1, topic: 'Limits & Continuity', description: 'Foundations of calculus, epsilon-delta definitions' },
      { week: 2, topic: 'Differentiation', description: 'Rules of differentiation, chain rule, implicit differentiation' },
      { week: 3, topic: 'Applications of Derivatives', description: 'Optimization, related rates, curve sketching' },
      { week: 4, topic: 'Integration Techniques', description: 'Substitution, integration by parts, partial fractions' },
      { week: 5, topic: 'Series & Sequences', description: 'Convergence tests, Taylor series, power series' },
      { week: 6, topic: 'Vectors & Matrices', description: 'Vector operations, matrix algebra, determinants' },
      { week: 7, topic: 'Linear Transformations', description: 'Eigenvalues, eigenvectors, diagonalization' },
      { week: 8, topic: 'Review & Final Assessment', description: 'Comprehensive review and final examination' },
    ],
    schedule: [
      { day: 'Monday', time: '9:00 AM – 10:30 AM', room: 'Room 204A' },
      { day: 'Wednesday', time: '9:00 AM – 10:30 AM', room: 'Room 204A' },
    ],
  },
  {
    id: 'c2', code: 'DSCI210', title: 'Data Science Fundamentals', dept: 'Data Science', credits: 4, teacherId: 't2',
    desc: 'An applied introduction to statistics, data wrangling, and machine learning fundamentals using real-world datasets.',
    category: 'Technology', rating: 4.7, level: 'Intermediate',
    syllabus: [
      { week: 1, topic: 'Introduction to Data Science', description: 'Data lifecycle, tools, Python ecosystem' },
      { week: 2, topic: 'Data Wrangling', description: 'Pandas, data cleaning, handling missing values' },
      { week: 3, topic: 'Exploratory Data Analysis', description: 'Visualization, statistical summaries, distributions' },
      { week: 4, topic: 'Probability & Statistics', description: 'Hypothesis testing, confidence intervals, p-values' },
      { week: 5, topic: 'Regression Models', description: 'Linear regression, logistic regression, evaluation metrics' },
      { week: 6, topic: 'Classification', description: 'Decision trees, random forests, model selection' },
      { week: 7, topic: 'Unsupervised Learning', description: 'Clustering, PCA, dimensionality reduction' },
      { week: 8, topic: 'Capstone Project', description: 'End-to-end data science project presentation' },
    ],
    schedule: [
      { day: 'Tuesday', time: '11:00 AM – 12:30 PM', room: 'Lab 301B' },
      { day: 'Thursday', time: '11:00 AM – 12:30 PM', room: 'Lab 301B' },
    ],
  },
  {
    id: 'c3', code: 'PHYS150', title: 'Physics for Engineers', dept: 'Physics', credits: 3, teacherId: 't3',
    desc: 'Mechanics, thermodynamics, and electromagnetism with an emphasis on engineering problem-solving.',
    category: 'Science', rating: 4.0, level: 'Introductory',
    syllabus: [
      { week: 1, topic: 'Kinematics', description: 'Motion in 1D and 2D, projectile motion' },
      { week: 2, topic: 'Newton\'s Laws', description: 'Forces, friction, circular motion' },
      { week: 3, topic: 'Work & Energy', description: 'Conservation of energy, power, efficiency' },
      { week: 4, topic: 'Momentum', description: 'Impulse, collisions, center of mass' },
      { week: 5, topic: 'Thermodynamics', description: 'Heat, temperature, laws of thermodynamics' },
      { week: 6, topic: 'Electromagnetism', description: 'Electric fields, circuits, magnetic forces' },
      { week: 7, topic: 'Waves & Optics', description: 'Wave properties, reflection, refraction' },
      { week: 8, topic: 'Review & Final Assessment', description: 'Comprehensive review and final exam' },
    ],
    schedule: [
      { day: 'Monday', time: '2:00 PM – 3:00 PM', room: 'Room 105' },
      { day: 'Wednesday', time: '2:00 PM – 3:00 PM', room: 'Room 105' },
      { day: 'Friday', time: '2:00 PM – 3:00 PM', room: 'Lab 102' },
    ],
  },
  {
    id: 'c4', code: 'ENGL110', title: 'English Composition', dept: 'English', credits: 3, teacherId: 't4',
    desc: 'Academic writing, rhetoric, and critical analysis across genres.',
    category: 'Humanities', rating: 4.5, level: 'Introductory',
    syllabus: [
      { week: 1, topic: 'Academic Writing Foundations', description: 'Thesis development, paragraph structure' },
      { week: 2, topic: 'Rhetorical Strategies', description: 'Ethos, pathos, logos in academic contexts' },
      { week: 3, topic: 'Research Methods', description: 'Source evaluation, citation styles, avoiding plagiarism' },
      { week: 4, topic: 'Argumentative Writing', description: 'Building persuasive arguments with evidence' },
      { week: 5, topic: 'Narrative & Descriptive Writing', description: 'Creative nonfiction techniques' },
      { week: 6, topic: 'Critical Analysis', description: 'Analyzing literary and non-literary texts' },
      { week: 7, topic: 'Revision & Editing', description: 'Self-editing, peer review, style refinement' },
      { week: 8, topic: 'Portfolio Submission', description: 'Final portfolio of revised works' },
    ],
    schedule: [
      { day: 'Tuesday', time: '9:00 AM – 10:30 AM', room: 'Room 310' },
      { day: 'Thursday', time: '9:00 AM – 10:30 AM', room: 'Room 310' },
    ],
  },
];

/* ============================== CURRENT STUDENT ============================== */
function generateAttendanceLog() {
  const log: Array<{ day: number; status: 'present' | 'late' | 'absent' }> = [];
  const statuses: Array<'present' | 'late' | 'absent'> = [
    'present','present','present','absent','present','present','late','present',
    'present','present','absent','present','present','present','late','present',
    'present','absent','present','present','present','present','late','present',
    'present','absent','present','present','present','late',
  ];
  for (let i = 0; i < 30; i++) {
    log.push({ day: i + 1, status: statuses[i] || 'present' });
  }
  return log;
}

export const STUDENT_ME: Student = {
  id: 's1',
  name: 'Maya Whitfield',
  code: 'STU-1042',
  year: 'Junior · Computer Science',
  attendance: 68,
  subjects: [
    { course: 'c1', name: 'Mathematics', assignmentAvg: 54, examAvg: 58, examHistory: [64, 61, 58] },
    { course: 'c2', name: 'Data Science', assignmentAvg: 82, examAvg: 79, examHistory: [70, 75, 79] },
    { course: 'c3', name: 'Physics', assignmentAvg: 71, examAvg: 68, examHistory: [66, 68, 68] },
    { course: 'c4', name: 'English Composition', assignmentAvg: 88, examAvg: 85, examHistory: [84, 85, 85] },
  ],
  attendanceLog: generateAttendanceLog(),
};

/* ============================== CLASS ROSTER ============================== */
export const ROSTER: RosterStudent[] = [
  { id: 's1', name: 'Maya Whitfield', attendance: 68, avg: 71.5 },
  { id: 's2', name: 'Owen Bright', attendance: 92, avg: 88 },
  { id: 's3', name: 'Priya Nair', attendance: 81, avg: 76 },
  { id: 's4', name: 'Marcus Chen', attendance: 55, avg: 49 },
  { id: 's5', name: 'Sofia Torres', attendance: 97, avg: 91 },
  { id: 's6', name: 'Elena Petrova', attendance: 74, avg: 63 },
  { id: 's7', name: 'Noah Kim', attendance: 88, avg: 80 },
  { id: 's8', name: 'Isla Fraser', attendance: 63, avg: 57 },
];

export const MOCK_STUDENTS: Student[] = [
  STUDENT_ME,
  {
    id: 's2',
    name: 'Owen Bright',
    code: 'STU-2024-0102',
    year: 'Junior',
    attendance: 92,
    subjects: [
      { course: 'c1', name: 'Mathematics', assignmentAvg: 88, examAvg: 90, examHistory: [85, 88, 90] },
      { course: 'c2', name: 'Data Science', assignmentAvg: 94, examAvg: 92, examHistory: [90, 92, 94] },
    ],
    attendanceLog: [],
  },
  {
    id: 's3',
    name: 'Priya Nair',
    code: 'STU-2024-0105',
    year: 'Sophomore',
    attendance: 81,
    subjects: [
      { course: 'c1', name: 'Mathematics', assignmentAvg: 75, examAvg: 78, examHistory: [72, 75, 78] },
    ],
    attendanceLog: [],
  },
  {
    id: 's4',
    name: 'Marcus Chen',
    code: 'STU-2024-0109',
    year: 'Senior',
    attendance: 55,
    subjects: [
      { course: 'c1', name: 'Mathematics', assignmentAvg: 48, examAvg: 50, examHistory: [45, 48, 50] },
    ],
    attendanceLog: [],
  },
  {
    id: 's5',
    name: 'Sofia Torres',
    code: 'STU-2024-0112',
    year: 'Junior',
    attendance: 97,
    subjects: [
      { course: 'c2', name: 'Data Science', assignmentAvg: 92, examAvg: 95, examHistory: [90, 92, 95] },
    ],
    attendanceLog: [],
  },
];

/* ============================== ASSIGNMENTS ============================== */
export const ASSIGNMENTS: Assignment[] = [
  { id: 'a1', course: 'c1', title: 'Problem Set 6 — Integration Techniques', desc: 'Solve problems 1-20 from Chapter 6, showing all work. Focus on integration by parts and partial fractions.', due: '2026-08-18', status: 'pending', maxScore: 100 },
  { id: 'a2', course: 'c2', title: 'Lab 4 — Exploratory Data Analysis', desc: 'Perform EDA on the provided retail dataset. Include at least 5 visualizations and statistical summaries.', due: '2026-08-20', status: 'pending', maxScore: 100 },
  { id: 'a3', course: 'c3', title: 'Lab Report — Kinematics', desc: 'Write a lab report on the kinematics experiment. Include data tables, error analysis, and conclusions.', due: '2026-08-12', status: 'submitted', submittedAt: '2026-08-11', maxScore: 100 },
  { id: 'a4', course: 'c4', title: 'Essay 2 — Rhetorical Analysis', desc: 'Write a 1500-word rhetorical analysis of the assigned text. Focus on the author\'s use of ethos, pathos, and logos.', due: '2026-08-10', status: 'graded', score: 91, maxScore: 100, feedback: 'Excellent analysis of rhetorical strategies. Your thesis was clear and well-supported. Consider exploring counterarguments more deeply in future essays.', submittedAt: '2026-08-09' },
  { id: 'a5', course: 'c1', title: 'Problem Set 5 — Series & Sequences', desc: 'Complete convergence tests for the given series. Show all steps for each convergence test applied.', due: '2026-08-05', status: 'graded', score: 52, maxScore: 100, feedback: 'Several convergence tests were applied incorrectly. Review the ratio test and comparison test. Office hours are available Wednesday 3-5 PM.', submittedAt: '2026-08-04' },
];

/* ============================== CLASSES ============================== */
export const INITIAL_CLASSES: ClassSection[] = [
  { id: 'cls1', courseId: 'c1', sectionName: 'Section A - Morning', teacherId: 't1', schedule: 'Mon/Wed 9:00 AM', room: 'Room 204A', studentCount: 8 },
  { id: 'cls2', courseId: 'c2', sectionName: 'Section B - Afternoon', teacherId: 't2', schedule: 'Tue/Thu 11:00 AM', room: 'Lab 301B', studentCount: 8 },
  { id: 'cls3', courseId: 'c3', sectionName: 'Section A - Engineering', teacherId: 't3', schedule: 'Mon/Wed/Fri 2:00 PM', room: 'Room 105', studentCount: 8 },
  { id: 'cls4', courseId: 'c4', sectionName: 'Section C - Rhetoric', teacherId: 't4', schedule: 'Tue/Thu 9:00 AM', room: 'Room 310', studentCount: 8 },
];

/* ============================== DEMO EXAM QUESTIONS ============================== */
export const DEMO_EXAM_QUESTIONS = [
  { id: 'q1', question: 'What is the derivative of f(x) = x^3 - 4x + 7?', options: ['3x^2 - 4', '3x^2 + 7', 'x^2 - 4', '3x - 4'], answerIndex: 0 },
  { id: 'q2', question: 'Which integration technique is best suited for ∫ x * e^x dx?', options: ['Substitution', 'Integration by Parts', 'Partial Fractions', 'Trigonometric Substitution'], answerIndex: 1 },
  { id: 'q3', question: 'What is the determinant of a 2x2 matrix [[2, 3], [1, 4]]?', options: ['5', '8', '6', '11'], answerIndex: 0 },
  { id: 'q4', question: 'A square matrix A is invertible if and only if:', options: ['det(A) = 0', 'det(A) ≠ 0', 'A is symmetric', 'A has zero eigenvalues'], answerIndex: 1 },
];

/* ============================== EXAMS ============================== */
export const EXAMS: Exam[] = [
  { id: 'e1', course: 'c1', title: 'Midterm Exam', date: '2026-07-28', score: 58, maxScore: 100, duration: 60 },
  { id: 'e2', course: 'c2', title: 'Midterm Exam', date: '2026-07-30', score: 79, maxScore: 100, duration: 60 },
  { id: 'e3', course: 'c3', title: 'Midterm Exam', date: '2026-08-01', score: 68, maxScore: 100, duration: 60 },
  { id: 'e4', course: 'c4', title: 'Midterm Exam', date: '2026-08-02', score: 85, maxScore: 100, duration: 60 },
  { id: 'e5', course: 'c1', title: 'Final Exam — Calculus & Algebra', date: '2026-09-15', score: null, maxScore: 100, duration: 30, questions: DEMO_EXAM_QUESTIONS },
];

/* ============================== INITIAL ACTIVITY LOGS ============================== */
export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'act1', timestamp: '2026-08-16 10:15', type: 'ENROLLMENT', description: 'Maya Whitfield enrolled in MATH201 Calculus & Linear Algebra', actor: 'Student (Maya Whitfield)' },
  { id: 'act2', timestamp: '2026-08-15 14:20', type: 'GRADE_ENTRY', description: 'Dr. Elena Marsh graded Problem Set 5 for MATH201', actor: 'Teacher (Dr. Elena Marsh)' },
  { id: 'act3', timestamp: '2026-08-14 09:30', type: 'ATTENDANCE', description: 'Attendance saved for Section A - Mathematics (8 students)', actor: 'Teacher (Dr. Elena Marsh)' },
  { id: 'act4', timestamp: '2026-08-12 16:45', type: 'ASSIGNMENT_CREATE', description: 'New assignment created: Problem Set 6 — Integration Techniques', actor: 'Teacher (Dr. Elena Marsh)' },
  { id: 'act5', timestamp: '2026-08-10 11:00', type: 'ANNOUNCEMENT', description: 'System Announcement posted: Fall 2026 Registration Open', actor: 'Administrator' },
];

/* ============================== ENROLLMENTS ============================== */
export const INITIAL_ENROLLMENTS: Enrollment[] = [
  { id: 'enr1', studentId: 's1', courseId: 'c1', enrolledAt: '2026-06-15' },
  { id: 'enr2', studentId: 's1', courseId: 'c2', enrolledAt: '2026-06-15' },
  { id: 'enr3', studentId: 's1', courseId: 'c3', enrolledAt: '2026-06-15' },
  { id: 'enr4', studentId: 's1', courseId: 'c4', enrolledAt: '2026-06-15' },
];

/* ============================== ANNOUNCEMENTS ============================== */
export const ANNOUNCEMENTS: Announcement[] = [
  { id: 'ann1', title: 'Fall 2026 Registration Open', content: 'Course registration for Fall 2026 is now open. Visit the courses page to explore and enroll in your preferred subjects.', date: '2026-08-10', type: 'important' },
  { id: 'ann2', title: 'Academic Advising Week', content: 'Meet with your academic advisor Aug 19–23. Schedule appointments through the student portal.', date: '2026-08-12', type: 'event' },
  { id: 'ann3', title: 'Library Extended Hours', content: 'The university library will have extended hours (7 AM – midnight) during finals preparation period starting Aug 25.', date: '2026-08-14', type: 'info' },
];

/* ============================== FAQ ============================== */
export const FAQ_ITEMS: FAQItem[] = [
  { id: 'faq1', question: 'How do I enroll in a course?', answer: 'Navigate to the Courses page, select a course, and click "Enroll Now". You must be signed in as a student.', category: 'Enrollment' },
  { id: 'faq2', question: 'How is my academic performance calculated?', answer: 'Your overall performance is calculated using a weighted formula: 60% academic scores (assignment + exam averages) and 40% attendance.', category: 'Academics' },
  { id: 'faq3', question: 'What does "at-risk" status mean?', answer: 'Students with a composite academic index below 60 are flagged as high-risk. Between 60-70 is moderate risk. The AI system monitors your performance and provides recommendations.', category: 'Academics' },
  { id: 'faq4', question: 'How do I submit an assignment?', answer: 'Go to Assignments, find the pending assignment, click "Submit", fill in the submission form, and confirm. Your status will update to "Submitted".', category: 'Assignments' },
  { id: 'faq5', question: 'Can I view my attendance history?', answer: 'Yes, navigate to the Attendance page in your student dashboard to see your full session log, percentage breakdowns, and threshold status.', category: 'Attendance' },
  { id: 'faq6', question: 'How does the AI Intelligence system work?', answer: 'EduIQ uses a deterministic rules engine that analyzes your attendance, assignment scores, exam scores, and historical trends to generate actionable insights and recommendations.', category: 'AI' },
  { id: 'faq7', question: 'How do I contact support?', answer: 'Use the Contact page to send a message. You can also email support@eduiq.edu or call during business hours.', category: 'Support' },
  { id: 'faq8', question: 'Can teachers see my AI insights?', answer: 'Teachers see class-level insights that may reference individual students who need support. They cannot see your personal AI recommendations.', category: 'AI' },
];

/* ============================== AI STUDY TIPS ============================== */
export const STUDY_TIPS: StudyTip[] = [
  { id: 'tip1', title: 'Space your study sessions', content: 'Research shows that distributing study time across multiple shorter sessions is more effective than cramming. Aim for 25-minute focused blocks with 5-minute breaks.', category: 'Study Habits' },
  { id: 'tip2', title: 'Active recall beats re-reading', content: 'Testing yourself on material is far more effective than passively re-reading notes. Use flashcards, practice problems, or teach concepts to a peer.', category: 'Study Habits' },
  { id: 'tip3', title: 'Prioritize weak subjects early', content: 'Address your weakest subjects at the start of your study session when your focus is strongest. Save review of stronger subjects for later.', category: 'Performance' },
  { id: 'tip4', title: 'Attendance directly impacts grades', content: 'Students with 90%+ attendance score an average of 15% higher on exams compared to students below 75% attendance.', category: 'Attendance' },
  { id: 'tip5', title: 'Review feedback carefully', content: 'When you receive graded assignments back, spend time understanding the feedback. The areas highlighted often appear in future assessments.', category: 'Assignments' },
];

/* ============================== LOOKUP HELPERS ============================== */
export const courseById = (id: string) => COURSES.find((c) => c.id === id)!;
export const teacherById = (id: string) => TEACHERS.find((t) => t.id === id)!;
