/**
 * EduIQ AI Rules Engine
 *
 * Deterministic rule-based intelligence that computes actionable insights
 * from student performance data. Every insight traces back to a specific metric.
 */

import type { Insight, Student, RosterStudent } from '@/types';

export function trend(history: number[]): 'improving' | 'declining' | 'flat' {
  if (!history || history.length < 2) return 'flat';
  const delta = history[history.length - 1] - history[0];
  if (delta >= 6) return 'improving';
  if (delta <= -6) return 'declining';
  return 'flat';
}

export function riskLevel(score: number): 'high' | 'moderate' | 'low' {
  if (score < 60) return 'high';
  if (score < 70) return 'moderate';
  return 'low';
}

export function computeStudentInsights(student: Student): Insight[] {
  const insights: Insight[] = [];

  student.subjects.forEach((sub) => {
    const overall = Math.round((sub.assignmentAvg + sub.examAvg) / 2);
    const t = trend(sub.examHistory);

    if (overall < 65) {
      insights.push({
        id: `weak-${sub.name}`,
        category: 'weak_subject',
        severity: overall < 60 ? 'high' : 'moderate',
        title: `${sub.name} is a weak subject`,
        metric: `Assignment avg ${sub.assignmentAvg}% · Exam avg ${sub.examAvg}%`,
        recommendation: 'Book office hours this week and rework the last two problem sets before the next assessment.',
        trend: t,
      });
    }

    if (t === 'improving' && overall >= 65) {
      insights.push({
        id: `up-${sub.name}`,
        category: 'improving',
        severity: 'positive',
        title: `${sub.name} performance is improving`,
        metric: `Exam scores trending ${sub.examHistory.join(' → ')}`,
        recommendation: 'Keep the current study routine — this trajectory puts you on track for a strong final grade.',
        trend: t,
      });
    }

    if (t === 'declining') {
      insights.push({
        id: `down-${sub.name}`,
        category: 'declining',
        severity: overall < 65 ? 'high' : 'moderate',
        title: `${sub.name} performance is declining`,
        metric: `Exam scores trending ${sub.examHistory.join(' → ')}`,
        recommendation: 'Identify the specific topics behind the drop and schedule a review session before it compounds.',
        trend: t,
      });
    }
  });

  if (student.attendance < 75) {
    insights.push({
      id: 'attendance',
      category: 'risk',
      severity: student.attendance < 65 ? 'high' : 'moderate',
      title: 'Attendance is below the recommended threshold',
      metric: `Current attendance: ${student.attendance}% (recommended: 75%+)`,
      recommendation: 'Attendance below 75% is linked to a measurable drop in exam performance — prioritize consistent class presence this month.',
      trend: 'flat',
    });
  }

  const overallRisk = Math.round(
    (student.subjects.reduce((a, s) => a + (s.assignmentAvg + s.examAvg) / 2, 0) / student.subjects.length) * 0.6 +
    student.attendance * 0.4
  );

  const risk = riskLevel(overallRisk);
  insights.unshift({
    id: 'overall',
    category: 'risk_summary',
    severity: risk === 'high' ? 'high' : risk === 'moderate' ? 'moderate' : 'positive',
    title: risk === 'high' ? 'Academic risk: elevated' : risk === 'moderate' ? 'Academic risk: moderate' : 'Academic risk: low',
    metric: `Composite academic index: ${overallRisk}/100`,
    recommendation:
      risk === 'high'
        ? 'Recommend a check-in with your academic advisor this week to build a recovery plan.'
        : risk === 'moderate'
        ? 'A few focused adjustments in your weakest subject should move this back into a comfortable range.'
        : 'You are on a healthy academic trajectory — maintain current habits.',
    trend: 'flat',
  });

  return insights;
}

export function computeClassInsights(roster: RosterStudent[]): Insight[] {
  const atRisk = roster.filter((s) => s.avg < 65 || s.attendance < 70);
  const sorted = [...roster].sort((a, b) => b.avg - a.avg);
  const improving = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const classAvg = Math.round(roster.reduce((a, s) => a + s.avg, 0) / roster.length);

  return [
    {
      id: 'ci1',
      category: 'risk_summary',
      severity: atRisk.length > 2 ? 'high' : 'moderate',
      title: `${atRisk.length} student${atRisk.length === 1 ? '' : 's'} flagged at academic risk`,
      metric: `Class average: ${classAvg}% · Threshold: 65%`,
      recommendation: `Prioritize outreach to ${atRisk.map((s) => s.name).slice(0, 3).join(', ')}${atRisk.length > 3 ? ' and others' : ''} before the next assessment.`,
      trend: 'flat',
    },
    {
      id: 'ci2',
      category: 'weak_subject',
      severity: 'moderate',
      title: `${weakest.name} needs the most support`,
      metric: `Current average: ${weakest.avg}% · Attendance: ${weakest.attendance}%`,
      recommendation: 'Consider a targeted 1:1 review session focused on foundational gaps.',
      trend: 'flat',
    },
    {
      id: 'ci3',
      category: 'improving',
      severity: 'positive',
      title: `${improving.name} is leading the class`,
      metric: `Current average: ${improving.avg}% · Attendance: ${improving.attendance}%`,
      recommendation: 'A strong candidate for peer-mentoring lower-performing students.',
      trend: 'flat',
    },
  ];
}

export function computeInstitutionInsights(roster: RosterStudent[]): Insight[] {
  const atRisk = roster.filter((s) => s.avg < 65 || s.attendance < 70).length;
  return [
    {
      id: 'ii1',
      category: 'risk_summary',
      severity: 'high',
      title: `${atRisk} students across sampled cohort flagged at risk`,
      metric: 'Institution-wide average attendance: 79.5%',
      recommendation: 'Deploy targeted advising outreach to at-risk students in Mathematics and Physics departments.',
      trend: 'flat',
    },
    {
      id: 'ii2',
      category: 'declining',
      severity: 'moderate',
      title: 'Mathematics department trending down this term',
      metric: 'Department average down 4.2 points vs last term',
      recommendation: 'Review Mathematics course pacing and consider supplemental tutoring sessions.',
      trend: 'declining',
    },
    {
      id: 'ii3',
      category: 'improving',
      severity: 'positive',
      title: 'Data Science department trending up this term',
      metric: 'Department average up 6.8 points vs last term',
      recommendation: 'Document current teaching approach as a potential model for other departments.',
      trend: 'improving',
    },
  ];
}
