import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Icon } from '@/components/ui/Icon';
import { useStore } from '@/services/dataStore';
import { useAdminService } from '@/services/adminService';

export default function ExaminationsPage() {
  const store = useStore();
  const adminService = useAdminService();
  const courses = adminService.getCourses();

  const exams = store.exams;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <PageHeader title="Examinations Management" description="Institutional exam schedules and score archiving" />

      <div className="space-y-4">
        {exams.map((exam) => {
          const course = courses.find((c) => c.id === exam.course);
          const hasScore = exam.score !== null;

          return (
            <Card key={exam.id} className="p-5" hover>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="cobalt">{course?.code || exam.course}</Badge>
                    <Badge tone={hasScore ? 'sage' : 'amber'}>{hasScore ? 'Completed' : 'Scheduled'}</Badge>
                  </div>
                  <h3 className="font-display font-semibold text-ink-900 text-base">{exam.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><Icon name="calendar" size={12} /> {exam.date}</span>
                    <span className="flex items-center gap-1"><Icon name="award" size={12} /> Max Score: {exam.maxScore}</span>
                  </div>
                </div>

                <div className="text-right">
                  {hasScore ? (
                    <div>
                      <span className="font-mono text-2xl font-bold text-ink-900">{exam.score}</span>
                      <span className="text-xs text-ink-400 font-mono"> / {exam.maxScore}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-ink-400 italic">Upcoming Assessment</span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
