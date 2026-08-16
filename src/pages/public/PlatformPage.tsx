import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { EduIQLogo } from '@/components/ui/EduIQLogo';

export default function PlatformPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#FAFBFD] font-body text-ink-900 pt-24 pb-20 px-4 sm:px-8 space-y-16"
    >
      {/* HERO SECTION */}
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <Badge tone="cobalt" className="px-3.5 py-1 rounded-full border border-cobalt-200 bg-white">
          <Icon name="sparkles" className="w-3.5 h-3.5 text-cobalt-600 mr-1.5" />
          <span>The EduIQ Platform Architecture</span>
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-display font-bold text-ink-950 tracking-tight leading-tight">
          A unified workspace for <br />
          <span className="text-gradient">modern education management.</span>
        </h1>

        <p className="text-base sm:text-lg text-ink-500 max-w-2xl mx-auto leading-relaxed">
          EduIQ brings together courses, assignments, attendance logs, examinations, and AI-driven performance recommendations into one seamless academic environment.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Button variant="accent" size="lg" className="rounded-full px-8 shadow-glow" onClick={() => navigate('/register')}>
            Get Started Now &rarr;
          </Button>
          <Button variant="secondary" size="lg" className="rounded-full px-8 bg-white border border-ink-200" onClick={() => navigate('/courses')}>
            Explore Courses
          </Button>
        </div>
      </div>

      {/* CORE PLATFORM PILLARS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 bg-white border border-ink-150 shadow-card space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-cobalt-50 text-cobalt-600 flex items-center justify-center font-bold">
            <Icon name="book" size={20} />
          </div>
          <h3 className="font-display font-bold text-lg text-ink-950">Academic Management</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            Centralized course catalogs, syllabus configuration, assignment submissions, attendance heatmaps, and exam scheduling.
          </p>
        </Card>

        <Card className="p-8 bg-white border border-ink-150 shadow-card space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center font-bold">
            <Icon name="sparkles" size={20} />
          </div>
          <h3 className="font-display font-bold text-lg text-ink-950">AI Intelligence Engine</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            Continuous synthesis of attendance trends, assignment marks, and exam trajectories into explainable recommendations.
          </p>
        </Card>

        <Card className="p-8 bg-white border border-ink-150 shadow-card space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Icon name="users" size={20} />
          </div>
          <h3 className="font-display font-bold text-lg text-ink-950">Role-Based Workspaces</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            Tailored interfaces for Students (learning & progress), Teachers (grading & class management), and Administrators (institutional oversight).
          </p>
        </Card>
      </div>

      {/* PLATFORM OVERVIEW CTA CARD */}
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 sm:p-12 bg-ink-950 text-white rounded-3xl space-y-6 text-center shadow-pop">
          <EduIQLogo size={32} textColor="text-white" className="mx-auto" />
          <h2 className="text-2xl sm:text-4xl font-display font-bold">Ready to experience EduIQ?</h2>
          <p className="text-xs sm:text-sm text-ink-300 max-w-xl mx-auto">
            Join thousands of students and educators transforming their academic journey through intelligence.
          </p>
          <Button variant="accent" size="lg" className="rounded-full px-8 shadow-glow" onClick={() => navigate('/register')}>
            Create Your Account &rarr;
          </Button>
        </Card>
      </div>
    </motion.div>
  );
}
