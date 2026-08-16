import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { useStudentService } from '@/services/studentService';

export default function AttendancePage() {
  const studentService = useStudentService();
  const student = studentService.getStudent();
  const log = studentService.getAttendanceLog();

  const [hoveredSession, setHoveredSession] = useState<{ day: number; status: string } | null>(null);

  const presentCount = log.filter((d) => d.status === 'present').length;
  const lateCount = log.filter((d) => d.status === 'late').length;
  const absentCount = log.filter((d) => d.status === 'absent').length;
  const totalSessions = log.length;

  const currentPct = student.attendance;
  const healthy = currentPct >= 75;
  const gapPct = 75 - currentPct;

  // Exact math: How many consecutive future present sessions to hit 75%?
  // Current present equivalent: presentCount + lateCount * 0.5
  // (presentEquiv + X) / (totalSessions + X) >= 0.75
  // => presentEquiv + X >= 0.75 * totalSessions + 0.75 * X
  // => 0.25 * X >= 0.75 * totalSessions - presentEquiv
  // => X >= (0.75 * totalSessions - presentEquiv) / 0.25
  const presentEquiv = presentCount + lateCount * 0.5;
  const neededPresentSessions = Math.max(0, Math.ceil((0.75 * totalSessions - presentEquiv) / 0.25));

  const circumference = 2 * Math.PI * 46;
  const offset = circumference * (1 - currentPct / 100);

  const statusColors: Record<string, string> = {
    present: 'bg-sage-500 text-white',
    late: 'bg-amber-400 text-ink-950',
    absent: 'bg-rose-500 text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader
        title="Attendance Health Center"
        description="Your presence shapes your academic trajectory."
        action={
          <Badge tone={healthy ? 'sage' : 'amber'}>
            {healthy ? 'Healthy Attendance' : 'Attention Required'}
          </Badge>
        }
      />

      {/* HERO SECTION: RADIAL VISUALIZATION & INTEGRATED SUMMARY */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* RADIAL RING CARD */}
        <Card className="p-8 flex flex-col items-center justify-center text-center bg-white shadow-card">
          <div className="relative w-36 h-36 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Background Ring */}
              <circle cx="50" cy="50" r="46" fill="none" stroke="#F1F1F4" strokeWidth="8" />
              
              {/* 75% Recommended Target Dash Marker */}
              <circle
                cx="50" cy="50" r="46" fill="none"
                stroke="#CBD5E1" strokeWidth="8" strokeDasharray="3 6"
              />

              {/* Progress Ring */}
              <motion.circle
                cx="50" cy="50" r="46" fill="none"
                stroke={healthy ? '#3DA86D' : '#D4890F'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-3xl font-bold text-ink-950">{currentPct}%</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-ink-400">Attendance</span>
            </div>
          </div>

          <p className="text-xs font-medium text-ink-500">
            Recommended: <strong className="text-ink-900 font-mono">75%</strong>
          </p>
          {!healthy && (
            <p className="text-xs font-semibold text-amber-600 mt-1">
              {gapPct}% percentage points below target
            </p>
          )}
        </Card>

        {/* INTEGRATED SUMMARY BREAKDOWN */}
        <Card className="p-6 md:col-span-2 flex flex-col justify-between bg-white shadow-card">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-ink-950">Session Summary</h3>
              <span className="text-xs font-mono text-ink-400">{totalSessions} total sessions recorded</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-ink-700 mb-1">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sage-500" /> Present</span>
                  <span>{presentCount} sessions ({Math.round((presentCount / totalSessions) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full bg-sage-500 rounded-full" style={{ width: `${(presentCount / totalSessions) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-ink-700 mb-1">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Late</span>
                  <span>{lateCount} sessions ({Math.round((lateCount / totalSessions) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(lateCount / totalSessions) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-ink-700 mb-1">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent</span>
                  <span>{absentCount} sessions ({Math.round((absentCount / totalSessions) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(absentCount / totalSessions) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* RECOVERY PATHWAY STAT */}
          <div className="mt-6 pt-4 border-t border-ink-150 flex items-center justify-between text-xs">
            <span className="text-ink-500">Recovery Target:</span>
            <span className="font-semibold text-ink-900 font-mono">
              {neededPresentSessions > 0 ? `${neededPresentSessions} consecutive present sessions required` : 'On track for academic standing'}
            </span>
          </div>
        </Card>
      </div>

      {/* ✦ AI ATTENDANCE INSIGHT PANEL */}
      <Card variant="dark" className="p-6 md:p-8 relative overflow-hidden bg-gradient-ai text-white border border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cobalt-500/20 text-cobalt-300 text-xs font-semibold border border-cobalt-500/30">
              <Icon name="sparkles" size={14} className="text-amber-400" />
              <span>✦ ACADEMIC INTELLIGENCE INSIGHT</span>
            </div>

            <h3 className="text-xl font-display font-bold text-white">
              {healthy ? 'Attendance is on solid footing.' : 'Your attendance needs attention.'}
            </h3>

            <p className="text-xs md:text-sm text-ink-300 leading-relaxed">
              {healthy
                ? 'Maintaining your current attendance habits protects your academic standing across all 4 enrolled subjects.'
                : `You are currently at ${currentPct}%, which is ${gapPct}% below the recommended 75% threshold. Attending the next ${neededPresentSessions} consecutive sessions will elevate your health status.`}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 text-center shrink-0 min-w-[160px]">
            <div className="text-[10px] uppercase font-semibold tracking-wider text-ink-400">Needed Sessions</div>
            <div className="font-mono text-3xl font-bold text-amber-400 mt-0.5">{neededPresentSessions}</div>
            <div className="text-[11px] text-ink-300 mt-1">To reach 75% threshold</div>
          </div>
        </div>
      </Card>

      {/* SESSION HEATMAP LOG */}
      <Card className="p-6 bg-white shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-ink-950">30-Day Session Heatmap</h3>
            <p className="text-xs text-ink-500">Hover over any session box to view recorded details</p>
          </div>

          <div className="flex items-center gap-3 text-xs text-ink-600">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-sage-500" /> Present</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Late</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Absent</span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 pt-2">
          {log.map((session) => {
            const isHovered = hoveredSession?.day === session.day;
            return (
              <div
                key={session.day}
                onMouseEnter={() => setHoveredSession(session)}
                onMouseLeave={() => setHoveredSession(null)}
                className={cn(
                  'h-10 rounded-xl flex items-center justify-center font-mono text-xs font-semibold cursor-pointer transition-all relative',
                  statusColors[session.status],
                  isHovered && 'scale-110 shadow-md z-10 ring-2 ring-cobalt-400'
                )}
              >
                Day {session.day}
              </div>
            );
          })}
        </div>

        {/* Hover Session Detail Bar */}
        {hoveredSession && (
          <div className="mt-4 p-3 rounded-xl bg-ink-50 border border-ink-150 text-xs flex items-center justify-between">
            <span className="font-medium text-ink-800">Session {hoveredSession.day} Recorded</span>
            <Badge tone={hoveredSession.status === 'present' ? 'sage' : hoveredSession.status === 'late' ? 'amber' : 'rose'}>
              {hoveredSession.status.toUpperCase()}
            </Badge>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
