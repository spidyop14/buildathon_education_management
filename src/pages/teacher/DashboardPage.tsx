import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { StatCard } from '@/components/ui/StatCard';
import { LineChart } from '@/components/academic/LineChart';
import { COURSES, ASSIGNMENTS, MOCK_STUDENTS } from '@/data/mock';
import { useAuth } from '@/hooks/useAuth';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 font-body">
      {/* 1. GREETING HERO BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-ink-150 shadow-card">
        <div className="space-y-1">
          <Badge tone="cobalt" className="px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-mono">
            EDUCATOR WORKSPACE
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-950">
            {greeting()}, {user?.name || 'Dr. Elena Marsh'}.
          </h2>
          <p className="text-xs sm:text-sm text-ink-500">
            Here is your classroom health, pending submissions, and academic signal breakdown.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="accent" onClick={() => navigate('/teacher/attendance')} className="rounded-2xl text-xs font-semibold shadow-glow">
            <Icon name="calendar" size={15} />
            <span>Take Attendance</span>
          </Button>
          <Button variant="secondary" onClick={() => navigate('/teacher/submissions')} className="rounded-2xl text-xs font-semibold">
            <Icon name="check" size={15} />
            <span>Grade Submissions</span>
          </Button>
        </div>
      </div>

      {/* 2. TOP METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Enrolled Students" value="138" sub="Across 4 active courses" trendDir="up" />
        <StatCard label="Classroom Attendance Avg" value="86%" sub="↑ +2.4% from last week" trendDir="up" />
        <StatCard label="Pending Submissions" value="24" sub="7 due for review today" trendDir="flat" />
        <StatCard label="Academic Risk Count" value="6" sub="Students requiring intervention" trendDir="down" />
      </div>

      {/* 3. PERFORMANCE CHART & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CLASS PERFORMANCE CHART */}
        <Card className="lg:col-span-8 p-6 bg-white border border-ink-150 shadow-card rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-ink-150 pb-4">
            <div>
              <h3 className="font-display font-bold text-base text-ink-950">Classroom Grade Trajectory</h3>
              <p className="text-xs text-ink-500">Average assessment scores across all 4 courses</p>
            </div>
            <Badge tone="sage">↑ 82% Overall Average</Badge>
          </div>

          <div className="pt-2">
            <LineChart data={[72, 75, 78, 74, 80, 82, 85]} height={180} color="#4361EE" />
          </div>
        </Card>

        {/* QUICK ACTIONS & TODAY'S SCHEDULE */}
        <Card className="lg:col-span-4 p-6 bg-white border border-ink-150 shadow-card rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-ink-150 pb-3">
            <h3 className="font-display font-bold text-base text-ink-950">Today's Timeline</h3>
            <span className="text-[10px] font-mono text-ink-400 uppercase">Fall 2026</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-cobalt-50/70 border border-cobalt-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-cobalt-950">
                <span>Data Science Fundamentals</span>
                <span className="font-mono text-[10px]">10:00 AM</span>
              </div>
              <p className="text-ink-600 text-[11px]">Room B204 • 42 Students Enrolled</p>
              <button
                onClick={() => navigate('/teacher/attendance')}
                className="text-[11px] font-bold text-cobalt-600 hover:text-cobalt-800 pt-1 block"
              >
                Start Attendance Session &rarr;
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-ink-50 border border-ink-150 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-ink-950">
                <span>Calculus & Linear Algebra</span>
                <span className="font-mono text-[10px]">02:00 PM</span>
              </div>
              <p className="text-ink-500 text-[11px]">Room A103 • 38 Students Enrolled</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. COURSE HEALTH & RECENT ACADEMIC INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COURSES SNAPSHOT */}
        <Card className="p-6 bg-white border border-ink-150 shadow-card rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-ink-950">Course Health Overview</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/courses')}>
              View Portfolio &rarr;
            </Button>
          </div>

          <div className="space-y-3">
            {COURSES.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate('/teacher/courses')}
                className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-ink-150 hover:border-cobalt-300 hover:bg-cobalt-50/40 transition-all cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] font-bold text-cobalt-600">{course.code}</span>
                  <div className="font-bold text-ink-950">{course.title}</div>
                </div>
                <div className="text-right space-y-0.5">
                  <Badge tone="cobalt">86% Health Index</Badge>
                  <span className="text-[10px] text-ink-400 block font-mono">42 Students</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ACADEMIC INSIGHTS PREVIEW */}
        <Card className="p-6 bg-ink-950 text-white border border-ink-800 shadow-pop rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-ink-800 pb-3">
            <div className="flex items-center gap-2">
              <Icon name="sparkles" size={18} className="text-cobalt-400" />
              <h3 className="font-display font-bold text-base text-white">AI Academic Signals</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:text-white" onClick={() => navigate('/teacher/insights')}>
              Full Pulse &rarr;
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">⚠ Performance Signal</span>
              <h4 className="font-bold text-white">Calculus performance dropped 8.4%</h4>
              <p className="text-ink-300 text-[11px] leading-relaxed">
                Scores dropped across recent assessments. 6 students require targeted revision support.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono font-bold text-sage-400 uppercase">✓ Positive Signal</span>
              <h4 className="font-bold text-white">Assignment completion up 14%</h4>
              <p className="text-ink-300 text-[11px] leading-relaxed">
                Data Science problem set submissions reached an all-time high of 92%.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
