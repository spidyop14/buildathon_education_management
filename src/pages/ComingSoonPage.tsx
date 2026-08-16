import React from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function ComingSoonPage() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center min-h-[60vh] p-8">
      <EmptyState 
        icon="settings" 
        title="Coming soon" 
        subtitle="This section is in development."
        action={<Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>}
      />
    </motion.div>
  );
}
