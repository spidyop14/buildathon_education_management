import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EduIQLogo } from '@/components/ui/EduIQLogo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { useStudentService } from '@/services/studentService';
import { useToast } from '@/hooks/useToast';
import type { ExamQuestion } from '@/types';

// 10-Question Dataset
const SAMPLE_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    question: 'What is the derivative of f(x) = x³ - 4x + 7?',
    options: ['3x² - 4', '3x² + 7', 'x² - 4', '3x - 4'],
    answerIndex: 0,
  },
  {
    id: 'q2',
    question: 'Which integration technique is best suited for ∫ x · e^x dx?',
    options: ['Substitution', 'Integration by Parts', 'Partial Fractions', 'Trigonometric Substitution'],
    answerIndex: 1,
  },
  {
    id: 'q3',
    question: 'What is the determinant of the 2x2 matrix [[2, 3], [1, 4]]?',
    options: ['5', '8', '6', '11'],
    answerIndex: 0,
  },
  {
    id: 'q4',
    question: 'A square matrix A is invertible if and only if:',
    options: ['det(A) = 0', 'det(A) ≠ 0', 'A is symmetric', 'A has zero eigenvalues'],
    answerIndex: 1,
  },
  {
    id: 'q5',
    question: 'What is the limit of (sin x) / x as x approaches 0?',
    options: ['0', '1', 'Infinity', 'Undefined'],
    answerIndex: 1,
  },
  {
    id: 'q6',
    question: 'If f(x) = ln(x² + 1), what is f\'(x)?',
    options: ['1 / (x² + 1)', '2x / (x² + 1)', '2 / x', 'x / (x² + 1)'],
    answerIndex: 1,
  },
  {
    id: 'q7',
    question: 'What is the integral ∫ 1 / x dx for x > 0?',
    options: ['x² / 2 + C', 'ln(x) + C', '-1 / x² + C', 'e^x + C'],
    answerIndex: 1,
  },
  {
    id: 'q8',
    question: 'Which of the following vectors is orthogonal to v = [3, -2]?',
    options: ['[2, 3]', '[-3, 2]', '[3, 2]', '[1, -1]'],
    answerIndex: 0,
  },
  {
    id: 'q9',
    question: 'What is the eigenvalue of the identity matrix I_n?',
    options: ['0', '1', 'n', 'Undefined'],
    answerIndex: 1,
  },
  {
    id: 'q10',
    question: 'By the Fundamental Theorem of Calculus, if F(x) = ∫_0^x t² dt, what is F\'(3)?',
    options: ['3', '6', '9', '27'],
    answerIndex: 2,
  },
];

export default function ExamTakePage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const studentService = useStudentService();
  const { addToast } = useToast();

  const student = studentService.getStudent();
  const upcomingExams = studentService.getUpcomingExams();
  const targetExam = upcomingExams.find(e => e.id === examId) || {
    id: examId || 'math-final',
    course: 'c1',
    title: 'Calculus & Linear Algebra Final Exam',
    date: '2026-09-15',
    score: 0,
    maxScore: 100,
  };

  // Exam States
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-Time Timer State (10 Minutes = 600 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const endTimeRef = useRef<number | null>(null);

  // Initialize or resume timer timestamp
  useEffect(() => {
    if (!hasStarted) return;

    const storageKey = `eduiq_exam_endtime_${targetExam.id}`;
    const savedEndTime = sessionStorage.getItem(storageKey);

    if (savedEndTime) {
      endTimeRef.current = parseInt(savedEndTime, 10);
    } else {
      const newEndTime = Date.now() + 600 * 1000;
      endTimeRef.current = newEndTime;
      sessionStorage.setItem(storageKey, newEndTime.toString());
    }

    const interval = setInterval(() => {
      if (!endTimeRef.current) return;
      const now = Date.now();
      const diff = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
      setSecondsRemaining(diff);

      if (diff <= 0) {
        clearInterval(interval);
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, targetExam.id]);

  // Window beforeunload prompt while exam is active
  useEffect(() => {
    if (!hasStarted || isSubmitting) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You have an active examination. Leaving will submit or invalidate your attempt.';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasStarted, isSubmitting]);

  // Auto-submission when time expires
  const handleAutoSubmit = () => {
    addToast("Time's up! Automatically submitting your examination...", 'warning');
    processFinalSubmission();
  };

  // Process Final Submission and score calculation
  const processFinalSubmission = () => {
    setIsSubmitting(true);

    let correctCount = 0;
    SAMPLE_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.answerIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / SAMPLE_QUESTIONS.length) * 100);

    // Persist result in data store
    studentService.submitExamTake(targetExam.id, calculatedScore);

    // Save session exam details for Result Page
    sessionStorage.setItem(`eduiq_exam_result_${targetExam.id}`, JSON.stringify({
      examTitle: targetExam.title,
      score: calculatedScore,
      totalQuestions: SAMPLE_QUESTIONS.length,
      correctCount,
      incorrectCount: SAMPLE_QUESTIONS.length - correctCount - Object.keys(selectedAnswers).length,
      answeredCount: Object.keys(selectedAnswers).length,
      timeUsedSeconds: 600 - secondsRemaining,
      answers: selectedAnswers,
      questions: SAMPLE_QUESTIONS,
    }));

    setTimeout(() => {
      sessionStorage.removeItem(`eduiq_exam_endtime_${targetExam.id}`);
      navigate(`/student/examinations/${targetExam.id}/result`);
    }, 600);
  };

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = SAMPLE_QUESTIONS[currentQIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-ink-900 font-body selection:bg-cobalt-100 flex flex-col justify-between">
      {/* STICKY TOP EXAMINATION HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-ink-150 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <EduIQLogo size={26} />
          <div className="hidden sm:block border-l border-ink-200 pl-4">
            <span className="text-[10px] font-mono uppercase font-bold text-ink-400 block">FINAL EXAMINATION</span>
            <h1 className="font-display font-bold text-sm text-ink-950">{targetExam.title}</h1>
          </div>
        </div>

        {hasStarted && (
          <div className="flex items-center gap-4">
            <div className="text-xs font-medium text-ink-500 hidden md:block">
              Question <strong>{currentQIndex + 1}</strong> of <strong>{SAMPLE_QUESTIONS.length}</strong>
            </div>

            {/* REAL-TIME TIMER WITH WARNING COLORS */}
            <div
              className={`px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold flex items-center gap-2 transition-all ${
                secondsRemaining <= 30
                  ? 'bg-rose-500 text-white animate-pulse shadow-glow'
                  : secondsRemaining <= 120
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-ink-100 text-ink-900'
              }`}
            >
              <Icon name="clock" size={15} />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            <Button
              variant="accent"
              size="sm"
              onClick={() => setShowSubmitConfirm(true)}
              disabled={isSubmitting}
            >
              Submit Exam &rarr;
            </Button>
          </div>
        )}
      </header>

      {/* START EXAM INSTRUCTIONS CONFIRMATION */}
      {!hasStarted ? (
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <Card className="max-w-xl w-full p-8 bg-white border border-ink-150 shadow-pop space-y-6 text-left">
            <div className="space-y-2 border-b border-ink-150 pb-4">
              <Badge tone="cobalt">Online Assessment Environment</Badge>
              <h2 className="text-2xl font-display font-bold text-ink-950">Ready to begin your examination?</h2>
              <p className="text-xs text-ink-500">{targetExam.title}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-ink-50 border border-ink-150">
                <span className="text-[10px] uppercase font-semibold text-ink-400">Questions</span>
                <div className="font-mono text-lg font-bold text-ink-900 mt-0.5">10</div>
              </div>
              <div className="p-3 rounded-xl bg-ink-50 border border-ink-150">
                <span className="text-[10px] uppercase font-semibold text-ink-400">Duration</span>
                <div className="font-mono text-lg font-bold text-ink-900 mt-0.5">10 Mins</div>
              </div>
              <div className="p-3 rounded-xl bg-ink-50 border border-ink-150">
                <span className="text-[10px] uppercase font-semibold text-ink-400">Total Score</span>
                <div className="font-mono text-lg font-bold text-ink-900 mt-0.5">100 Marks</div>
              </div>
              <div className="p-3 rounded-xl bg-ink-50 border border-ink-150">
                <span className="text-[10px] uppercase font-semibold text-ink-400">Passing Score</span>
                <div className="font-mono text-lg font-bold text-sage-600 mt-0.5">40%</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Icon name="alert" size={14} className="text-amber-600" />
                <span>Important Examination Notice:</span>
              </div>
              <p className="leading-relaxed text-amber-800">
                Once you click <strong>Start Exam &rarr;</strong>, the 10-minute countdown timer will begin immediately and cannot be paused. Ensure you have a stable network environment.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => navigate('/student/examinations')}>
                Cancel
              </Button>
              <Button variant="accent" size="lg" onClick={() => setHasStarted(true)} className="px-8 shadow-glow">
                Start Exam &rarr;
              </Button>
            </div>
          </Card>
        </main>
      ) : (
        /* ACTIVE FULL-SCREEN EXAM WORKSPACE */
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* MAIN QUESTION AREA (3 COLUMNS) */}
          <div className="lg:col-span-3 space-y-6">
            {/* PROGRESS BAR */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-ink-500">
                <span>Progress: <strong>{Math.round(((currentQIndex + 1) / SAMPLE_QUESTIONS.length) * 100)}%</strong></span>
                <span>{answeredCount} of {SAMPLE_QUESTIONS.length} Answered</span>
              </div>
              <div className="w-full h-2 bg-ink-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cobalt-600 transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* QUESTION CARD */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 sm:p-8 bg-white border border-ink-150 shadow-card space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge tone="cobalt">Question {currentQIndex + 1}</Badge>
                    <button
                      type="button"
                      onClick={() => setFlaggedQuestions(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                        flaggedQuestions[currentQ.id]
                          ? 'bg-amber-50 border-amber-300 text-amber-700'
                          : 'bg-ink-50 border-ink-200 text-ink-500 hover:text-ink-900'
                      }`}
                    >
                      <span>🚩</span>
                      <span>{flaggedQuestions[currentQ.id] ? 'Flagged for Review' : 'Flag for Review'}</span>
                    </button>
                  </div>

                  <h2 className="font-display font-bold text-lg sm:text-xl text-ink-950 leading-snug">
                    {currentQ.question}
                  </h2>

                  {/* CHOICE OPTIONS */}
                  <div className="space-y-3 pt-2">
                    {currentQ.options.map((optText, optIdx) => {
                      const isSelected = selectedAnswers[currentQ.id] === optIdx;
                      const optionLabel = String.fromCharCode(65 + optIdx);

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }))}
                          className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                            isSelected
                              ? 'border-cobalt-500 bg-cobalt-50/70 ring-2 ring-cobalt-200 shadow-sm'
                              : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
                          }`}
                        >
                          <span className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-cobalt-600 text-white' : 'bg-ink-100 text-ink-600'
                          }`}>
                            {optionLabel}
                          </span>
                          <span className={`text-sm font-medium flex-1 ${isSelected ? 'text-ink-950 font-semibold' : 'text-ink-800'}`}>
                            {optText}
                          </span>
                          {isSelected && <Icon name="check" size={16} className="text-cobalt-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* NAVIGATION CONTROLS */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="secondary"
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
              >
                &larr; Previous
              </Button>

              {currentQIndex < SAMPLE_QUESTIONS.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={() => setCurrentQIndex(prev => Math.min(SAMPLE_QUESTIONS.length - 1, prev + 1))}
                >
                  Next Question &rarr;
                </Button>
              ) : (
                <Button
                  variant="accent"
                  onClick={() => setShowSubmitConfirm(true)}
                  className="px-6 shadow-glow"
                >
                  Submit Examination &rarr;
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN — QUESTION NAVIGATOR PANEL */}
          <div className="space-y-6">
            <Card className="p-5 bg-white border border-ink-150 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-ink-150 pb-3">
                <h3 className="font-display font-bold text-sm text-ink-950">Question Navigator</h3>
                <span className="text-xs font-mono text-ink-400">{answeredCount}/{SAMPLE_QUESTIONS.length}</span>
              </div>

              {/* GRID OF 10 QUESTIONS */}
              <div className="grid grid-cols-5 gap-2">
                {SAMPLE_QUESTIONS.map((q, idx) => {
                  const isCurrent = currentQIndex === idx;
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-10 rounded-xl font-mono text-xs font-bold transition-all relative flex items-center justify-center ${
                        isCurrent
                          ? 'bg-ink-950 text-white ring-2 ring-cobalt-400'
                          : isAnswered
                          ? 'bg-sage-100 text-sage-800 border border-sage-300'
                          : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                      }`}
                    >
                      {(idx + 1).toString().padStart(2, '0')}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 text-[10px]">🚩</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* LEGEND */}
              <div className="pt-3 border-t border-ink-100 space-y-2 text-[11px] text-ink-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-ink-950 inline-block" /> Current Question
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-sage-100 border border-sage-300 inline-block" /> Answered
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-ink-100 inline-block" /> Unanswered
                </div>
                <div className="flex items-center gap-2">
                  <span>🚩</span> Flagged for Review
                </div>
              </div>
            </Card>
          </div>
        </main>
      )}

      {/* SUBMIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-ink-150 shadow-pop space-y-5 text-left"
            >
              <div className="space-y-2">
                <Badge tone="amber">Confirmation</Badge>
                <h3 className="text-xl font-display font-bold text-ink-950">Submit your examination?</h3>
                <p className="text-xs text-ink-600">
                  You have answered <strong>{answeredCount}</strong> of <strong>{SAMPLE_QUESTIONS.length}</strong> questions.
                  {SAMPLE_QUESTIONS.length - answeredCount > 0 && (
                    <span className="text-rose-600 block mt-1">
                      ⚠️ {SAMPLE_QUESTIONS.length - answeredCount} questions remain unanswered.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setShowSubmitConfirm(false)} disabled={isSubmitting}>
                  Continue Exam
                </Button>
                <Button variant="accent" onClick={processFinalSubmission} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
