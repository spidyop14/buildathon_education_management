import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { BarChart } from '@/components/academic/BarChart';
import { LineChart } from '@/components/academic/LineChart';
import { useAdminService } from '@/services/adminService';

export default function AnalyticsPage() {
  const adminService = useAdminService();
  const courses = adminService.getCourses();

  const [compareMode, setCompareMode] = useState<'department' | 'course' | 'term'>('department');

  const deptData = {
    labels: ['Math', 'Data Sci', 'Physics', 'English'],
    avgScores: [71, 84, 68, 88],
    attendance: [76, 88, 71, 85],
  };

  const courseCompData = {
    labels: courses.slice(0, 4).map(c => c.code),
    scores: [78, 85, 72, 91],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <PageHeader title="Analytics & Comparative Reports" description="Institution-wide performance data and comparative analysis" />

      {/* Comparative Mode Selector */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-2">
          <Icon name="chart" className="text-cobalt-600" size={18} />
          <span className="font-display font-semibold text-sm text-ink-900">Comparative Analytics Mode</span>
        </div>
        <div className="flex gap-2">
          {[
            { id: 'department', label: 'Department vs Department' },
            { id: 'course', label: 'Course vs Course' },
            { id: 'term', label: 'Term vs Term' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setCompareMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                compareMode === mode.id
                  ? 'bg-ink-900 text-white'
                  : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Comparative Cards based on mode */}
      {compareMode === 'department' && (
        <div className="grid md:grid-cols-2 gap-5">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-ink-900">Department Performance Comparison</h3>
              <Badge tone="cobalt">Current Term</Badge>
            </div>
            <BarChart
              data={deptData.avgScores}
              labels={deptData.labels}
              color="#4361EE"
            />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-ink-900">Department Attendance Comparison</h3>
              <Badge tone="amber">Attendance %</Badge>
            </div>
            <BarChart
              data={deptData.attendance}
              labels={deptData.labels}
              color="#D4890F"
            />
          </Card>
        </div>
      )}

      {compareMode === 'course' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink-900">Course-by-Course Average Score Comparison</h3>
            <Badge tone="sage">Live Roster Averages</Badge>
          </div>
          <BarChart
            data={courseCompData.scores}
            labels={courseCompData.labels}
            color="#3DA86D"
          />
        </Card>
      )}

      {compareMode === 'term' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink-900">Term-over-Term Institutional GPA Trajectory</h3>
            <Badge tone="cobalt">5-Term History</Badge>
          </div>
          <LineChart data={[3.1, 3.15, 3.05, 3.22, 3.3]} color="#4361EE" />
          <div className="flex justify-between mt-3 text-xs font-mono text-ink-400">
            <span>Spring 2024</span><span>Fall 2024</span><span>Spring 2025</span><span>Fall 2025</span><span>Spring 2026</span>
          </div>
        </Card>
      )}

      {/* Summary Matrix */}
      <Card className="p-6">
        <h3 className="font-display font-semibold text-ink-900 mb-4">Comparative Department Summary Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-ink-50 border-b border-ink-150 text-xs font-semibold text-ink-500 uppercase">
                <th className="p-3">Department</th>
                <th className="p-3 text-right">Avg Score</th>
                <th className="p-3 text-right">Attendance %</th>
                <th className="p-3 text-right">At Risk Count</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {[
                { dept: 'Mathematics', avg: 71, att: 76, risk: 2, status: 'amber' as const },
                { dept: 'Data Science', avg: 84, att: 88, risk: 0, status: 'sage' as const },
                { dept: 'Physics', avg: 68, att: 71, risk: 3, status: 'rose' as const },
                { dept: 'English', avg: 88, att: 85, risk: 0, status: 'sage' as const },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-ink-50/50">
                  <td className="p-3 font-medium text-ink-900">{row.dept}</td>
                  <td className="p-3 text-right font-mono font-medium">{row.avg}%</td>
                  <td className="p-3 text-right font-mono font-medium">{row.att}%</td>
                  <td className="p-3 text-right font-mono text-ink-600">{row.risk}</td>
                  <td className="p-3 text-right">
                    <Badge tone={row.status}>{row.status === 'sage' ? 'Optimal' : row.status === 'amber' ? 'Monitor' : 'Attention'}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
