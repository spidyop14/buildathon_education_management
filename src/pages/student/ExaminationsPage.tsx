import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { useStudentService } from '@/services/studentService';
import { useCourseService } from '@/services/courseService';
import { useToast } from '@/hooks/useToast';
import type { Exam, ExamQuestion } from '@/types';

export default function ExaminationsPage() {
  const navigate = useNavigate();
  const studentService = useStudentService();
  const courseService = useCourseService();
  const { addToast } = useToast();

  const upcomingExams = studentService.getUpcomingExams();
  const gradeHistory = studentService.getGradeHistory();
  const allExams = [...upcomingExams, ...gradeHistory];

  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [completedResult, setCompletedResult] = useState<{ score: number; total: number; pct: number } | null>(null);

  // Subject Performance Breakdown
  const subjectScores = [
    { subject: 'Mathematics', score: 58, trend: 'down', color: 'text-rose-500' },
    { subject: 'Data Science', score: 79, trend: 'up', color: 'text-sage-600' },
    { subject: 'Physics', score: 68, trend: 'flat', color: 'text-amber-600' },
    { subject: 'English', score: 85, trend: 'up', color: 'text-sage-600' },
  ];

  const handleStartExam = (exam: Exam) => {
    navigate(`/student/examinations/${exam.id}`);
  };

  const handleAnswerSelect = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;

    const questions: ExamQuestion[] = activeExam.questions || [
      { id: 'q1', question: 'What is the derivative of f(x) = x^3 - 4x + 7?', options: ['3x^2 - 4', '3x^2 + 7', 'x^2 - 4', '3x - 4'], answerIndex: 0 },
      { id: 'q2', question: 'Which integration technique is best suited for ∫ x * e^x dx?', options: ['Substitution', 'Integration by Parts', 'Partial Fractions', 'Trigonometric Substitution'], answerIndex: 1 },
      { id: 'q3', question: 'What is the determinant of a 2x2 matrix [[2, 3], [1, 4]]?', options: ['5', '8', '6', '11'], answerIndex: 0 },
      { id: 'q4', question: 'A square matrix A is invertible if and only if:', options: ['det(A) = 0', 'det(A) ≠ 0', 'A is symmetric', 'A has zero eigenvalues'], answerIndex: 1 },
    ];

    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answerIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);

    studentService.submitExamTake(activeExam.id, calculatedScore);
    addToast(`Exam submitted! Score: ${calculatedScore}/100`, calculatedScore >= 70 ? 'success' : 'warning');
    
    setCompletedResult({ score: calculatedScore, total: 100, pct: calculatedScore });
  };

  const nextFeaturedExam = upcomingExams[0] || allExams[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader
        title="Assessment Center"
        description="Prepare smarter. Understand your examination trajectory."
      />

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border-l-4 border-l-cobalt-500">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Upcoming Exams</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{upcomingExams.length}</div>
          <div className="text-xs text-cobalt-600 mt-0.5">Next in 29 days</div>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-sage-500">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Completed</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{gradeHistory.length}</div>
          <div className="text-xs text-sage-600 mt-0.5">Recorded in store</div>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-cobalt-600">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Exam Average</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">72%</div>
          <div className="text-xs text-cobalt-600 mt-0.5">Passing standing</div>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-amber-500">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Best Assessment</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">88%</div>
          <div className="text-xs text-amber-600 mt-0.5">English Composition</div>
        </Card>
      </div>

      {/* FEATURED NEXT ASSESSMENT HERO CARD */}
      {nextFeaturedExam && (
        <Card variant="elevated" className="p-6 md:p-8 bg-gradient-hero border border-ink-150 relative overflow-hidden shadow-pop">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <Badge tone="cobalt">{nextFeaturedExam.course}</Badge>
                <Badge tone="neutral">FEATURED ASSESSMENT</Badge>
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-bold text-ink-950">
                {nextFeaturedExam.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-ink-600">
                <span className="flex items-center gap-1"><Icon name="calendar" size={14} /> {nextFeaturedExam.date}</span>
                <span className="flex items-center gap-1"><Icon name="clock" size={14} /> {nextFeaturedExam.duration || 30} mins</span>
                <span className="flex items-center gap-1"><Icon name="clipboard" size={14} /> 4 questions</span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <div className="text-right hidden md:block">
                <div className="font-mono text-3xl font-bold text-cobalt-600">29</div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-ink-400">Days Remaining</div>
              </div>

              <Button
                variant="accent"
                size="lg"
                onClick={() => handleStartExam(nextFeaturedExam)}
                className="rounded-xl px-8 shadow-glow"
              >
                Take Exam Now &rarr;
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* SUBJECT PERFORMANCE BREAKDOWN & AI INSIGHT GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* SUBJECT PERFORMANCE SPARK CARDS */}
        <Card className="p-6 bg-white shadow-card space-y-4">
          <h3 className="font-display font-bold text-base text-ink-950">Subject Assessment Performance</h3>
          
          <div className="space-y-3">
            {subjectScores.map((item) => (
              <div key={item.subject} className="p-3 rounded-xl bg-ink-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-ink-900">{item.subject}</div>
                  <div className="text-[10px] text-ink-400">Assessment Average</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-mono text-base font-bold text-ink-900">{item.score}%</div>
                  <Badge tone={item.trend === 'up' ? 'sage' : item.trend === 'down' ? 'rose' : 'amber'}>
                    {item.trend === 'up' ? '↑ Improving' : item.trend === 'down' ? '↓ Declining' : '→ Stable'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ✦ AI PERFORMANCE INSIGHT CARD */}
        <Card variant="dark" className="p-6 md:p-8 bg-gradient-ai text-white relative overflow-hidden flex flex-col justify-between border border-white/10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cobalt-500/20 text-cobalt-300 text-xs font-semibold border border-cobalt-500/30">
              <Icon name="sparkles" size={14} className="text-amber-400" />
              <span>✦ ACADEMIC INTELLIGENCE INSIGHT</span>
            </div>

            <h3 className="text-xl font-display font-bold text-white">Mathematics requires attention</h3>

            <div className="p-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-ink-300 space-y-1">
              <span className="font-semibold text-rose-300 block uppercase tracking-wider text-[10px]">WHY THIS WAS DETECTED</span>
              <p>Trajectory: 64% &rarr; 61% &rarr; 58%. Your mathematics exam scores show a downward trend over recent assessments.</p>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="secondary" className="w-full justify-center bg-white text-ink-900 hover:bg-ink-100" onClick={() => navigate('/student/intelligence')}>
              View AI Study Plan &rarr;
            </Button>
          </div>
        </Card>
      </div>

      {/* ASSESSMENT HISTORY LIST */}
      <Card className="p-6 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-ink-950">Assessment Grade History</h3>
          <span className="text-xs text-ink-400">{allExams.length} exams recorded</span>
        </div>

        <div className="space-y-3">
          {allExams.map((e) => {
            const course = courseService.getCourseById(e.course);
            const hasScore = e.score !== null;
            return (
              <div key={e.id} className="p-4 rounded-xl border border-ink-150 hover:border-cobalt-300 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cobalt-50 text-cobalt-600 flex items-center justify-center shrink-0">
                    <Icon name="clipboard" size={18} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      {course && <Badge tone="cobalt">{course.code}</Badge>}
                      <span className="text-xs text-ink-500 font-mono">{e.date}</span>
                    </div>
                    <div className="font-semibold text-sm text-ink-900 mt-0.5">{e.title}</div>
                  </div>
                </div>

                <div>
                  {hasScore ? (
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold text-ink-950">{e.score} / {e.maxScore}</div>
                      <Badge tone={e.score! >= 75 ? 'sage' : 'amber'}>
                        {e.score! >= 90 ? 'Grade A' : e.score! >= 80 ? 'Grade B' : e.score! >= 70 ? 'Grade C' : 'Grade D'}
                      </Badge>
                    </div>
                  ) : (
                    <Button variant="accent" size="sm" onClick={() => handleStartExam(e)}>
                      Take Exam
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* INTERACTIVE TAKE EXAM QUIZ WORKSPACE MODAL */}
      <Modal open={!!activeExam} onClose={() => setActiveExam(null)} title="EduIQ Assessment Test Workspace" wide>
        {activeExam && (
          <div className="space-y-6 pt-2">
            {!completedResult ? (
              <>
                {/* Header info */}
                <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150 flex items-center justify-between">
                  <div>
                    <Badge tone="cobalt">{activeExam.course}</Badge>
                    <h3 className="font-display font-bold text-base text-ink-950 mt-1">{activeExam.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-ink-500">Timer</div>
                    <div className="font-mono text-xl font-bold text-cobalt-600">24:18</div>
                  </div>
                </div>

                {/* Question Box */}
                {(() => {
                  const questions: ExamQuestion[] = activeExam.questions || [
                    { id: 'q1', question: 'What is the derivative of f(x) = x^3 - 4x + 7?', options: ['3x^2 - 4', '3x^2 + 7', 'x^2 - 4', '3x - 4'], answerIndex: 0 },
                    { id: 'q2', question: 'Which integration technique is best suited for ∫ x * e^x dx?', options: ['Substitution', 'Integration by Parts', 'Partial Fractions', 'Trigonometric Substitution'], answerIndex: 1 },
                    { id: 'q3', question: 'What is the determinant of a 2x2 matrix [[2, 3], [1, 4]]?', options: ['5', '8', '6', '11'], answerIndex: 0 },
                    { id: 'q4', question: 'A square matrix A is invertible if and only if:', options: ['det(A) = 0', 'det(A) ≠ 0', 'A is symmetric', 'A has zero eigenvalues'], answerIndex: 1 },
                  ];

                  const q = questions[currentQIndex];

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-ink-500">
                        <span>Question {currentQIndex + 1} of {questions.length}</span>
                        <span>{Math.round(((currentQIndex + 1) / questions.length) * 100)}% Completed</span>
                      </div>

                      <div className="p-5 rounded-2xl bg-white border border-ink-200 shadow-xs space-y-4">
                        <p className="font-display font-semibold text-base text-ink-950">{q.question}</p>

                        <div className="space-y-2">
                          {q.options.map((opt, idx) => {
                            const isSelected = selectedAnswers[q.id] === idx;
                            return (
                              <div
                                key={idx}
                                onClick={() => handleAnswerSelect(q.id, idx)}
                                className={`p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center gap-3 ${
                                  isSelected
                                    ? 'border-cobalt-500 bg-cobalt-50 text-cobalt-950 ring-1 ring-cobalt-300'
                                    : 'border-ink-200 bg-white hover:bg-ink-50 text-ink-800'
                                }`}
                              >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                                  isSelected ? 'bg-cobalt-600 text-white' : 'bg-ink-100 text-ink-500'
                                }`}>
                                  {String.fromCharCode(65 + idx)}
                                </div>
                                <span>{opt}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Navigation Controls */}
                      <div className="flex items-center justify-between pt-2">
                        <Button
                          variant="secondary"
                          disabled={currentQIndex === 0}
                          onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                        >
                          &larr; Previous
                        </Button>

                        {currentQIndex < questions.length - 1 ? (
                          <Button variant="accent" onClick={() => setCurrentQIndex((prev) => prev + 1)}>
                            Next Question &rarr;
                          </Button>
                        ) : (
                          <Button variant="accent" onClick={handleSubmitExam}>
                            Submit Examination
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              /* RESULT SUMMARY SCREEN */
              <div className="p-8 rounded-2xl bg-white border border-ink-150 text-center space-y-6 shadow-pop">
                <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center mx-auto">
                  <Icon name="check" size={32} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-display font-bold text-ink-950">Assessment Complete</h3>
                  <p className="text-xs text-ink-500">Your score has been saved to your academic transcript.</p>
                </div>

                <div className="p-6 rounded-2xl bg-ink-50 border border-ink-150 max-w-sm mx-auto">
                  <div className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Final Score</div>
                  <div className="font-mono text-4xl font-bold text-ink-950 mt-1">{completedResult.pct} / 100</div>
                  <Badge tone={completedResult.pct >= 70 ? 'sage' : 'amber'} className="mt-2">
                    {completedResult.pct >= 90 ? 'Grade A' : completedResult.pct >= 80 ? 'Grade B' : completedResult.pct >= 70 ? 'Grade C' : 'Grade D'}
                  </Badge>
                </div>

                <Button variant="accent" onClick={() => setActiveExam(null)} className="px-8 py-2.5">
                  Done & Close Workspace
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
