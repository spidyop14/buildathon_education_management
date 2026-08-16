import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { InsightCard } from '@/components/academic/InsightCard';
import { useAIService } from '@/services/aiService';

export default function AIInsightsPage() {
  const aiService = useAIService();
  const insights = aiService.getInstitutionInsights();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <PageHeader title="AI Insights" description="Institution-wide academic intelligence" />

      <Card className="p-6 bg-gradient-to-br from-ink-950 to-ink-800 border-none anim-fadeUp">
        <div className="flex items-center gap-2 text-cobalt-300 text-xs font-medium uppercase tracking-wide mb-2">
          <Icon name="sparkles" size={14} />
          Institution-wide analysis
        </div>
        <p className="text-white text-sm leading-relaxed max-w-2xl">
          Aggregated across all departments from live attendance, assignment, and examination records.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {insights.map((ins, i) => (
          <InsightCard key={ins.id} insight={ins} delay={i * 60} />
        ))}
      </div>
    </motion.div>
  );
}
