import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart } from '@/components/academic/BarChart';
import { InsightCard } from '@/components/academic/InsightCard';
import { useAdminService } from '@/services/adminService';
import { useAIService } from '@/services/aiService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const adminService = useAdminService();
  const aiService = useAIService();

  const roster = adminService.getRoster();
  const teachers = adminService.getTeachers();
  const courses = adminService.getCourses();
  const insights = aiService.getInstitutionInsights().slice(0, 2);

  const atRiskCount = roster.filter(s => s.avg < 65 || s.attendance < 70).length;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 tracking-tight">
            Institution Overview
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            Fall Semester 2026 &bull; {today}
          </p>
        </div>
        <Button onClick={() => navigate('/admin/reports')} variant="secondary" icon="file">
          Generate Report
        </Button>
      </div>

      {/* Hero Summary */}
      <Card variant="elevated" className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="flex flex-col gap-1 border-b md:border-b-0 lg:border-r border-ink-100 pb-4 md:pb-0 lg:pr-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-ink-50 text-ink-500">
                <Icon name="users" className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-400">Total Students</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-medium text-ink-900">{roster.length}</span>
              <span className="text-xs font-medium text-emerald-600">Active roster</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-b lg:border-b-0 lg:border-r border-ink-100 pb-4 md:pb-0 lg:pr-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-ink-50 text-ink-500">
                <Icon name="cap" className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-400">Faculty</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-medium text-ink-900">{teachers.length}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-b md:border-b-0 lg:border-r border-ink-100 pb-4 md:pb-0 lg:pr-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-ink-50 text-ink-500">
                <Icon name="book" className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-400">Active Courses</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-medium text-ink-900">{courses.length}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-rose-50 text-rose-600">
                <Icon name="alert" className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-400">At-Risk Students</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-medium text-rose-600">{atRiskCount}</span>
              <span className="text-xs font-medium text-rose-600">Requires attention</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-sm font-semibold text-ink-900">Department Averages</h2>
          <Card className="p-5">
            <div className="h-64">
              <BarChart
                data={[71, 84, 68, 88]}
                labels={['Mathematics', 'Data Science', 'Physics', 'English']}
                height={256}
                color="#4f46e5"
              />
            </div>
          </Card>
        </div>

        {/* Sidebar / Insights & Activity Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900 flex items-center gap-2">
              <Icon name="sparkles" className="w-4 h-4 text-cobalt-500" />
              Institutional Intelligence
            </h2>
            <button 
              onClick={() => navigate('/admin/ai-insights')}
              className="text-xs font-medium text-cobalt-600 hover:text-cobalt-700"
            >
              View all →
            </button>
          </div>
          
          <div className="space-y-3">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>

          {/* Activity Monitoring Log */}
          <div className="pt-4 border-t border-ink-150 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink-900 flex items-center gap-2">
                <Icon name="activity" className="w-4 h-4 text-cobalt-500" />
                Real-Time Activity Log
              </h2>
              <Badge tone="cobalt">Audit Stream</Badge>
            </div>

            <Card className="p-4 space-y-3 max-h-72 overflow-y-auto">
              {adminService.getActivityLogs().slice(0, 6).map((log) => (
                <div key={log.id} className="text-xs space-y-1 pb-2 border-b border-ink-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-ink-400">{log.timestamp}</span>
                    <Badge tone="neutral">{log.type}</Badge>
                  </div>
                  <p className="font-medium text-ink-800 leading-snug">{log.description}</p>
                  <p className="text-[10px] text-ink-400">Actor: {log.actor}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
