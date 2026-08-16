import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EduIQLogo } from '@/components/ui/EduIQLogo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import type { ExamQuestion } from '@/types';

interface ExamResultData {
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  answeredCount: number;
  timeUsedSeconds: number;
  answers: Record<string, number>;
  questions: ExamQuestion[];
}

export default function ExamResultPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ExamResultData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`eduiq_exam_result_${examId}`);
    if (raw) {
      try {
        setResult(JSON.parse(raw));
      } catch (err) {
        console.error('Failed to parse result data', err);
      }
    }
  }, [examId]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center p-6">
        <Card className="p-8 bg-white border border-ink-150 max-w-md w-full text-center space-y-4 shadow-pop">
          <EduIQLogo size={28} className="mx-auto" />
          <h2 className="text-xl font-display font-bold text-ink-950">Examination Record Found</h2>
          <p className="text-xs text-ink-500">Your examination attempt has been processed into the institutional store.</p>
          <Button variant="accent" onClick={() => navigate('/student/examinations')} className="w-full">
            Return to Assessment Center &rarr;
          </Button>
        </Card>
      </div>
    );
  }

  const isPassed = result.score >= 40;

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-ink-900 font-body p-4 sm:p-8 flex flex-col items-center justify-start">
      <div className="max-w-4xl w-full space-y-6">
        {/* HEADER BRANDING */}
        <div className="flex items-center justify-between border-b border-ink-200 pb-4">
          <EduIQLogo size={28} />
          <Button variant="secondary" size="sm" onClick={() => navigate('/student/examinations')}>
            &larr; Back to Assessment Center
          </Button>
        </div>

        {/* HERO RESULT CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-8 bg-white border border-ink-150 shadow-pop space-y-6 text-center">
            <Badge tone={isPassed ? 'sage' : 'rose'} className="px-3.5 py-1 text-xs">
              {isPassed ? '✓ EXAMINATION PASSED' : 'REQUIRES RETAKE'}
            </Badge>

            <div>
              <span className="text-xs text-ink-400 font-mono uppercase font-bold">{result.examTitle}</span>
              <h1 className="text-5xl sm:text-6xl font-display font-bold text-ink-950 mt-1 font-mono">
                {result.score} <span className="text-2xl text-ink-400 font-normal">/ 100</span>
              </h1>
              <p className="text-sm font-semibold text-ink-600 mt-2">
                {isPassed ? 'Excellent evaluation trajectory!' : 'Review question analysis below.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left pt-2 border-t border-ink-150">
              <div className="p-3.5 rounded-2xl bg-sage-50 border border-sage-200">
                <span className="text-[10px] uppercase font-semibold text-sage-700">Correct</span>
                <div className="font-mono text-xl font-bold text-sage-800 mt-0.5">{result.correctCount}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] uppercase font-semibold text-rose-700">Incorrect</span>
                <div className="font-mono text-xl font-bold text-rose-800 mt-0.5">{result.incorrectCount}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-ink-50 border border-ink-150">
                <span className="text-[10px] uppercase font-semibold text-ink-400">Answered</span>
                <div className="font-mono text-xl font-bold text-ink-900 mt-0.5">{result.answeredCount} / {result.totalQuestions}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-ink-50 border border-ink-150">
                <span className="text-[10px] uppercase font-semibold text-ink-400">Time Used</span>
                <div className="font-mono text-xl font-bold text-cobalt-600 mt-0.5">{formatTime(result.timeUsedSeconds)}</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* DETAILED QUESTION REVIEW */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-lg text-ink-950">Detailed Question Breakdown</h3>

          <div className="space-y-4">
            {result.questions.map((q, idx) => {
              const userChoice = result.answers[q.id];
              const isCorrect = userChoice === q.answerIndex;
              const isUnanswered = userChoice === undefined;

              return (
                <Card key={q.id} className="p-6 bg-white border border-ink-150 space-y-3 shadow-card">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ink-400">Question {idx + 1}</span>
                    <Badge tone={isCorrect ? 'sage' : isUnanswered ? 'neutral' : 'rose'}>
                      {isCorrect ? '✓ Correct' : isUnanswered ? 'Unanswered' : '✕ Incorrect'}
                    </Badge>
                  </div>

                  <h4 className="font-display font-semibold text-sm text-ink-900">{q.question}</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isUserSelected = userChoice === optIdx;
                      const isRightAnswer = q.answerIndex === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            isRightAnswer
                              ? 'bg-sage-50 border-sage-300 font-semibold text-sage-900'
                              : isUserSelected
                              ? 'bg-rose-50 border-rose-300 font-semibold text-rose-900'
                              : 'bg-ink-50 border-ink-150 text-ink-600'
                          }`}
                        >
                          <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                          {isRightAnswer && <span className="text-sage-700 font-bold">✓ Correct Choice</span>}
                          {isUserSelected && !isRightAnswer && <span className="text-rose-600 font-bold">Your Choice</span>}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="accent" size="lg" onClick={() => navigate('/student/examinations')} className="px-8 shadow-glow">
            Return to Assessment Center &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
}
