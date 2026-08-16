import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { StatCard } from '@/components/ui/StatCard';
import { MOCK_STUDENTS } from '@/data/mock';

interface StudentSubmission {
  id: string;
  studentName: string;
  studentCode: string;
  assignmentTitle: string;
  courseCode: string;
  submittedAt: string;
  status: 'graded' | 'needs_review' | 'late';
  score: number | null;
  content: string;
}

const MOCK_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-1',
    studentName: 'Maya Whitfield',
    studentCode: 'STU-2024-0391',
    assignmentTitle: 'Lab Report — Kinematics',
    courseCode: 'PHYS150',
    submittedAt: 'Today at 09:14 AM',
    status: 'needs_review',
    score: null,
    content:
      'In this experiment, we analyzed the acceleration vector of a falling mass under atmospheric drag. Velocity regression fits indicate v(t) = v_term * (1 - exp(-kt)). Error margin was bounded within 2.1%.',
  },
  {
    id: 'sub-2',
    studentName: 'Liam Chen',
    studentCode: 'STU-2024-0412',
    assignmentTitle: 'Problem Set 5 — Series & Sequences',
    courseCode: 'MATH201',
    submittedAt: 'Yesterday at 04:30 PM',
    status: 'graded',
    score: 92,
    content:
      'Solution for Problem 4: Applied the ratio test lim |a_{n+1}/a_n| = L. Since L = 0.42 < 1, the series converges absolutely by the Ratio Test.',
  },
  {
    id: 'sub-3',
    studentName: 'Sophia Patel',
    studentCode: 'STU-2024-0205',
    assignmentTitle: 'Essay 2 — Rhetorical Analysis',
    courseCode: 'ENGL110',
    submittedAt: '2 days ago',
    status: 'graded',
    score: 85,
    content:
      'The author constructs an ethos of scientific rigor through empirical dataset citations while maintaining accessibility for non-expert readers.',
  },
];

export default function TeacherSubmissions() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeSub = MOCK_SUBMISSIONS[selectedIndex];

  // Grading form state
  const [scoreInput, setScoreInput] = useState<number>(activeSub?.score || 85);
  const [feedback, setFeedback] = useState('Strong empirical analysis and clean method derivation.');

  const handleApplyAIScore = () => {
    setScoreInput(88);
    setFeedback('AI Suggestion Accepted: Excellent derivation of velocity regression. Consider adding error propagation bounds.');
  };

  return (
    <div className="space-y-8 font-body">
      {/* HEADER BAR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-150 shadow-card">
        <Badge tone="cobalt" className="px-3 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
          SUBMISSION REVIEW CENTER
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-950 mt-1">
          Grading & Evaluation Workspace
        </h2>
        <p className="text-xs sm:text-sm text-ink-500">
          Review student coursework submissions, evaluate rubric criteria, and utilize AI grading assistance.
        </p>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Needs Review" value="24" sub="Pending evaluation" trendDir="flat" />
        <StatCard label="Average Class Score" value="81%" sub="Across 34 submissions" trendDir="up" />
        <StatCard label="Late Submissions" value="7" sub="Submitted past deadline" trendDir="down" />
        <StatCard label="Missing Submissions" value="3" sub="Unsubmitted coursework" trendDir="down" />
      </div>

      {/* SPLIT-VIEW GRADING WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: SUBMISSION LIST (4 COLS) */}
        <Card className="lg:col-span-4 p-4 bg-white border border-ink-150 shadow-card rounded-3xl space-y-3">
          <h3 className="font-display font-bold text-sm text-ink-950 px-2 pt-1 border-b border-ink-150 pb-2">
            Student Submissions
          </h3>

          <div className="space-y-2">
            {MOCK_SUBMISSIONS.map((sub, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setScoreInput(sub.score || 85);
                  }}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cobalt-500 bg-cobalt-50/70 ring-2 ring-cobalt-200 shadow-xs'
                      : 'border-ink-150 bg-white hover:bg-ink-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink-950">{sub.studentName}</span>
                    <Badge tone={sub.status === 'graded' ? 'sage' : 'amber'}>{sub.status}</Badge>
                  </div>
                  <div className="text-[11px] font-semibold text-cobalt-600 mt-1">{sub.assignmentTitle}</div>
                  <div className="text-[10px] text-ink-400 font-mono mt-0.5">{sub.submittedAt}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* CENTER: SUBMISSION CONTENT (5 COLS) */}
        <Card className="lg:col-span-5 p-6 bg-white border border-ink-150 shadow-card rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-ink-150 pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-cobalt-600">{activeSub.courseCode}</span>
              <h3 className="font-display font-bold text-base text-ink-950">{activeSub.assignmentTitle}</h3>
            </div>
            <Badge tone="cobalt">{activeSub.studentCode}</Badge>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-ink-400">Submission Document Content</span>
            <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150 text-xs font-mono text-ink-800 leading-relaxed min-h-[160px]">
              {activeSub.content}
            </div>
          </div>
        </Card>

        {/* RIGHT: EVALUATION & AI ASSISTANT PANEL (3 COLS) */}
        <Card className="lg:col-span-3 p-5 bg-white border border-ink-150 shadow-card rounded-3xl space-y-5">
          <h3 className="font-display font-bold text-sm text-ink-950 border-b border-ink-150 pb-2">
            Evaluation Panel
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-ink-700 font-semibold mb-1">Score (/100)</label>
              <input
                type="number"
                value={scoreInput}
                onChange={(e) => setScoreInput(Number(e.target.value))}
                className="w-full h-11 border border-ink-200 rounded-2xl px-4 font-mono text-base font-bold text-cobalt-600 focus:ring-2 focus:ring-cobalt-300"
              />
            </div>

            <div>
              <label className="block text-ink-700 font-semibold mb-1">Feedback Notes</label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border border-ink-200 rounded-2xl p-3 text-xs focus:ring-2 focus:ring-cobalt-300"
              />
            </div>
          </div>

          {/* AI GRADING ASSISTANT CARD */}
          <div className="p-4 rounded-2xl bg-ink-950 text-white space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Icon name="sparkles" size={16} className="text-cobalt-400" />
              <span className="font-mono text-[10px] text-cobalt-300 font-bold uppercase">AI Grading Assistant</span>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-lg font-bold text-sage-400">Suggested: 88 / 100</div>
              <p className="text-ink-300 text-[11px] leading-relaxed">
                Empirical physics derivations are mathematically sound. Minor clarity improvement recommended for error bounds.
              </p>
            </div>

            <Button
              variant="accent"
              size="sm"
              onClick={handleApplyAIScore}
              className="w-full rounded-xl text-xs font-semibold shadow-glow"
            >
              Accept AI Score &rarr;
            </Button>
          </div>

          <Button variant="primary" className="w-full rounded-2xl">
            Save & Publish Grade
          </Button>
        </Card>
      </div>
    </div>
  );
}
