import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function ForStudentsPage() {
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
          <Icon name="user" className="w-3.5 h-3.5 text-cobalt-600 mr-1.5" />
          <span>EduIQ Student Workspace</span>
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-display font-bold text-ink-950 tracking-tight leading-tight">
          Master your courses with <br />
          <span className="text-gradient">confidence and clarity.</span>
        </h1>

        <p className="text-base sm:text-lg text-ink-500 max-w-2xl mx-auto leading-relaxed">
          Track assignments, attendance thresholds, exam countdowns, continuous evaluation progress, and personalized study plans in one student portal.
        </p>

        <div className="flex justify-center pt-2">
          <Button variant="accent" size="lg" className="rounded-full px-8 shadow-glow" onClick={() => navigate('/register?role=student')}>
            Get started as a student &rarr;
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border border-ink-150 shadow-card space-y-3">
          <Badge tone="cobalt">Learning Portfolio</Badge>
          <h3 className="font-display font-bold text-lg text-ink-950">Course Performance</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            Monitor assignment averages, exam marks, and course priorities in real-time.
          </p>
        </Card>

        <Card className="p-6 bg-white border border-ink-150 shadow-card space-y-3">
          <Badge tone="amber">Attendance Radar</Badge>
          <h3 className="font-display font-bold text-lg text-ink-950">Attendance Heatmap</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            Receive proactive alerts whenever session attendance drops near the 75% target threshold.
          </p>
        </Card>

        <Card className="p-6 bg-white border border-ink-150 shadow-card space-y-3">
          <Badge tone="sage">Interactive Exam Platform</Badge>
          <h3 className="font-display font-bold text-lg text-ink-950">Full-Screen Examinations</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            Take online exams with dedicated working timers, flag for review, and question review breakdowns.
          </p>
        </Card>
      </div>
    </motion.div>
  );
}
