import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAdminService } from '@/services/adminService';
import { useAIService } from '@/services/aiService';
import { generateStudentReport } from '@/services/reportService';
import { useStore } from '@/services/dataStore';

export default function ReportsPage() {
  const adminService = useAdminService();
  const aiService = useAIService();
  const store = useStore();
  const roster = adminService.getRoster();

  const [selectedStudentId, setSelectedStudentId] = useState(roster[0]?.id || 's1');
  const selectedStudent = roster.find(s => s.id === selectedStudentId) || roster[0];
  const fullStudentData = store.student; // Default student detail

  const insights = aiService.getStudentInsights();

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <div className="print:hidden">
        <PageHeader
          title="Academic Reports & Transcripts"
          description="Generate and print comprehensive student performance summaries"
          action={
            <Button variant="accent" icon="printer" onClick={handlePrint}>
              Print Report
            </Button>
          }
        />

        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm font-medium text-ink-700">Select Student:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="border border-ink-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-300"
          >
            {roster.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Printable Report Document */}
      <Card className="p-8 md:p-12 space-y-8 bg-white border border-ink-200 shadow-lg print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-ink-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded bg-cobalt-600 text-white flex items-center justify-center font-bold text-xs">IQ</div>
              <span className="font-display font-bold text-xl text-ink-950">EduIQ Academic Intelligence</span>
            </div>
            <p className="text-xs text-ink-500">Official Institutional Intelligence Summary & Evaluation Report</p>
          </div>
          <div className="text-right text-xs text-ink-500 space-y-0.5">
            <p className="font-mono font-medium text-ink-900">DATE: {new Date().toLocaleDateString()}</p>
            <p>REF: EIQ-REP-{selectedStudent?.id.toUpperCase()}-2026</p>
            <Badge tone="cobalt" className="mt-1">Confidential</Badge>
          </div>
        </div>

        {/* Student Profile Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-ink-50 border border-ink-100">
          <div>
            <span className="text-[10px] uppercase font-semibold text-ink-400 block">Student Name</span>
            <span className="text-sm font-bold text-ink-900">{selectedStudent?.name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-ink-400 block">Student ID</span>
            <span className="text-sm font-mono font-medium text-ink-800">{selectedStudent?.id.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-ink-400 block">Current Attendance</span>
            <span className="text-sm font-mono font-medium text-ink-800">{selectedStudent?.attendance}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-ink-400 block">Cumulative Avg</span>
            <span className="text-sm font-mono font-bold text-cobalt-600">{selectedStudent?.avg}%</span>
          </div>
        </div>

        {/* Course Grades Table */}
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-ink-900 text-base">Academic Coursework Performance</h3>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-ink-200 text-xs font-semibold text-ink-500 uppercase">
                <th className="py-2">Subject / Course</th>
                <th className="py-2 text-right">Assignment Avg</th>
                <th className="py-2 text-right">Exam Avg</th>
                <th className="py-2 text-right">Overall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {fullStudentData.subjects.map((sub, i) => {
                const overall = Math.round((sub.assignmentAvg + sub.examAvg) / 2);
                return (
                  <tr key={i}>
                    <td className="py-3 font-medium text-ink-900">{sub.name}</td>
                    <td className="py-3 text-right font-mono text-ink-600">{sub.assignmentAvg}%</td>
                    <td className="py-3 text-right font-mono text-ink-600">{sub.examAvg}%</td>
                    <td className="py-3 text-right font-mono font-semibold text-ink-900">{overall}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-3 border-t border-ink-200 pt-6">
          <div className="flex items-center gap-2">
            <Icon name="sparkles" size={16} className="text-cobalt-600" />
            <h3 className="font-display font-semibold text-ink-900 text-base">Automated AI Insights & Recommendations</h3>
          </div>
          <div className="space-y-3">
            {insights.map((ins) => (
              <div key={ins.id} className="p-3.5 rounded-xl border border-ink-150 bg-ink-50/50 text-xs leading-relaxed">
                <div className="font-semibold text-ink-900 mb-1 flex items-center justify-between">
                  <span>{ins.title}</span>
                  <span className="uppercase text-[9px] font-mono text-ink-400">{ins.severity}</span>
                </div>
                <p className="text-ink-600 mb-1">{ins.metric}</p>
                <p className="text-ink-500 italic">{ins.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures Footer */}
        <div className="pt-12 flex justify-between items-end text-xs text-ink-500 border-t border-ink-150">
          <div>
            <div className="w-32 border-b border-ink-400 mb-1" />
            <span>Academic Advisor Signature</span>
          </div>
          <div>
            <div className="w-32 border-b border-ink-400 mb-1" />
            <span>Office of the Registrar</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
