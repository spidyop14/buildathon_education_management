import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { StatCard } from '@/components/ui/StatCard';
import { MOCK_STUDENTS, COURSES } from '@/data/mock';

export default function TeacherAttendance() {
  const [selectedCourseId, setSelectedCourseId] = useState('c2');
  const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'late' | 'absent'>>(() => {
    const initial: Record<string, 'present' | 'late' | 'absent'> = {};
    MOCK_STUDENTS.forEach((s) => {
      initial[s.id] = s.attendance >= 85 ? 'present' : s.attendance >= 70 ? 'late' : 'absent';
    });
    return initial;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const setStudentStatus = (id: string, status: 'present' | 'late' | 'absent') => {
    setAttendanceState((prev) => ({ ...prev, [id]: status }));
  };

  const markAllPresent = () => {
    const updated: Record<string, 'present' | 'late' | 'absent'> = {};
    MOCK_STUDENTS.forEach((s) => {
      updated[s.id] = 'present';
    });
    setAttendanceState(updated);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const presentCount = Object.values(attendanceState).filter((s) => s === 'present').length;
  const lateCount = Object.values(attendanceState).filter((s) => s === 'late').length;
  const absentCount = Object.values(attendanceState).filter((s) => s === 'absent').length;
  const total = MOCK_STUDENTS.length;
  const pct = Math.round(((presentCount + lateCount * 0.5) / total) * 100);

  return (
    <div className="space-y-8 font-body">
      {/* HEADER BAR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-150 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge tone="cobalt" className="px-3 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
            CLASSROOM ATTENDANCE PORTAL
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-950 mt-1">
            Attendance Logging & Thresholds
          </h2>
          <p className="text-xs sm:text-sm text-ink-500">
            Log real-time student presence, trigger threshold alerts, and track historical attendance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="secondary" onClick={markAllPresent} className="rounded-2xl text-xs font-semibold">
            Mark All Present
          </Button>
          <Button variant="accent" onClick={handleSave} className="rounded-2xl text-xs font-semibold shadow-glow">
            Save Session &rarr;
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-xs font-bold text-sage-900 flex items-center gap-2">
          <Icon name="check" size={16} className="text-sage-600 font-bold" />
          <span>Session attendance successfully logged & synced with student intelligence records!</span>
        </div>
      )}

      {/* METRICS & COURSE SELECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card className="lg:col-span-8 p-6 bg-white border border-ink-150 shadow-card rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink-150 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-ink-400">Selected Class Section</span>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="block text-sm font-bold text-ink-950 bg-ink-50 border border-ink-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-cobalt-300"
              >
                {COURSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <Badge tone="sage">{presentCount} Present</Badge>
              <Badge tone="amber">{lateCount} Late</Badge>
              <Badge tone="rose">{absentCount} Absent</Badge>
            </div>
          </div>

          {/* STUDENT ATTENDANCE LOGGING LIST */}
          <div className="space-y-3">
            {MOCK_STUDENTS.map((student) => {
              const currentStatus = attendanceState[student.id] || 'present';
              return (
                <div
                  key={student.id}
                  className="p-4 rounded-2xl bg-[#FAFBFD] border border-ink-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-ink-950 text-sm">{student.name}</div>
                    <div className="text-[10px] text-ink-400 font-mono">{student.code} • Year: {student.year}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStudentStatus(student.id, 'present')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        currentStatus === 'present'
                          ? 'bg-sage-600 text-white shadow-xs'
                          : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentStatus(student.id, 'late')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        currentStatus === 'late'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50'
                      }`}
                    >
                      Late
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentStatus(student.id, 'absent')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        currentStatus === 'absent'
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ATTENDANCE ANALYTICS RING */}
        <Card className="lg:col-span-4 p-6 bg-white border border-ink-150 shadow-card rounded-3xl space-y-6">
          <div className="border-b border-ink-150 pb-3">
            <h3 className="font-display font-bold text-base text-ink-950">Session Rate</h3>
            <span className="text-xs text-ink-500">Live attendance percentage</span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-ink-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={pct >= 85 ? 'text-sage-500' : pct >= 75 ? 'text-cobalt-500' : 'text-rose-500'}
                  strokeDasharray={`${pct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-3xl font-bold text-ink-950">{pct}%</span>
                <span className="text-[10px] text-ink-400 font-mono">Present</span>
              </div>
            </div>

            <span className="text-xs text-ink-500 font-medium">Recommended threshold: 75%</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
