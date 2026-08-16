import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function ForAdministratorsPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#FAFBFD] font-body text-ink-900 pt-24 pb-20 px-4 sm:px-8 space-y-16"
    >
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <Badge tone="cobalt" className="px-3.5 py-1 rounded-full border border-cobalt-200 bg-white">
          <Icon name="cap" className="w-3.5 h-3.5 text-cobalt-600 mr-1.5" />
          <span>EduIQ Administrator Control Center</span>
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-display font-bold text-ink-950 tracking-tight leading-tight">
          Complete institutional governance <br />
          <span className="text-gradient">and systemic insights.</span>
        </h1>

        <p className="text-base sm:text-lg text-ink-500 max-w-2xl mx-auto leading-relaxed">
          Manage students, teachers, courses, class sections, examination schedules, printable academic report cards, and system-wide AI analytics.
        </p>

        <div className="flex justify-center pt-2">
          <Button variant="accent" size="lg" className="rounded-full px-8 shadow-glow" onClick={() => navigate('/login')}>
            Open administrator workspace &rarr;
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border border-ink-150 shadow-card space-y-3">
          <Badge tone="cobalt">Institutional CRUD</Badge>
          <h3 className="font-display font-bold text-lg text-ink-950">Student & Teacher Management</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            Full management of student enrollments, faculty course assignments, department rosters, and account credentials.
          </p>
        </Card>

        <Card className="p-6 bg-white border border-ink-150 shadow-card space-y-3">
          <Badge tone="amber">Official Reports</Badge>
          <h3 className="font-display font-bold text-lg text-ink-950">Printable Report Cards</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            Generate printable academic performance transcripts, class grade breakdowns, and evaluation reports.
          </p>
        </Card>

        <Card className="p-6 bg-white border border-ink-150 shadow-card space-y-3">
          <Badge tone="sage">System Analytics</Badge>
          <h3 className="font-display font-bold text-lg text-ink-950">Institutional AI Insights</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            Monitor systemic risk trends, attendance patterns across class sections, and course performance analytics.
          </p>
        </Card>
      </div>
    </motion.div>
  );
}
