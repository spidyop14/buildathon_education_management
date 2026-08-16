import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { useToast } from '@/hooks/useToast';
import { useStudentService } from '@/services/studentService';
import type { Assignment } from '@/types';

type FilterTab = 'all' | 'pending' | 'submitted' | 'graded';

export default function AssignmentsPage() {
  const studentService = useStudentService();
  const assignments = studentService.getAssignments();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [submitStep, setSubmitStep] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle');

  // Stats calculation
  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const submittedCount = assignments.filter(a => a.status === 'submitted').length;
  const gradedCount = assignments.filter(a => a.status === 'graded').length;
  const gradedItems = assignments.filter(a => a.status === 'graded' && a.score != null);
  const averageScore = gradedItems.length > 0 
    ? Math.round(gradedItems.reduce((acc, curr) => acc + (curr.score! / curr.maxScore) * 100, 0) / gradedItems.length)
    : 72;

  // Filtered List
  const filteredAssignments = assignments.filter(a => {
    const matchesTab = activeTab === 'all' || a.status === activeTab;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Top Priority Assignment (First pending or Math assignment)
  const priorityAssignment = assignments.find(a => a.status === 'pending') || assignments[0];

  // Submission Handler with realistic multi-step feedback
  const handleSubmitWork = () => {
    if (!selectedAssignment) return;
    setSubmitStep('uploading');

    setTimeout(() => {
      setSubmitStep('processing');
      setTimeout(() => {
        studentService.submitAssignment(selectedAssignment.id);
        setSubmitStep('done');
        addToast(`Submitted ${selectedAssignment.title}`, 'success');
        
        setTimeout(() => {
          setSelectedAssignment(null);
          setFileSelected(null);
          setSubmitStep('idle');
        }, 1200);
      }, 600);
    }, 600);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader 
        title="Academic Work Center" 
        description="Your academic workload, organized with AI priority tracking." 
      />

      {/* WORKLOAD OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-amber-500 bg-white">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Pending Tasks</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{pendingCount}</div>
          <div className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
            <Icon name="clock" size={12} /> Requires action
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-cobalt-500 bg-white">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Submitted</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{submittedCount}</div>
          <div className="text-xs text-cobalt-600 mt-0.5 flex items-center gap-1">
            <Icon name="check" size={12} /> Under review
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-sage-500 bg-white">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Graded</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{gradedCount}</div>
          <div className="text-xs text-sage-600 mt-0.5 flex items-center gap-1">
            <Icon name="award" size={12} /> Completed
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-cobalt-600 bg-gradient-ai text-white">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-300">Assignment Avg</div>
          <div className="font-mono text-2xl font-bold text-white mt-1">{averageScore}%</div>
          <div className="text-xs text-cobalt-300 mt-0.5">3 / 5 tasks completed this week</div>
        </Card>
      </div>

      {/* ✦ AI PRIORITY HIGHLIGHT CARD */}
      {priorityAssignment && (
        <Card variant="elevated" className="p-6 md:p-8 bg-gradient-to-r from-ink-950 via-cobalt-950 to-ink-900 text-white relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cobalt-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cobalt-500/20 text-cobalt-300 text-xs font-semibold border border-cobalt-500/30">
                <Icon name="sparkles" size={14} className="text-amber-400" />
                <span>✦ AI PRIORITY — Start here</span>
              </div>

              <div>
                <span className="text-xs font-mono text-cobalt-300 uppercase tracking-wider">{priorityAssignment.course}</span>
                <h2 className="text-2xl font-display font-bold text-white mt-0.5">{priorityAssignment.title}</h2>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-ink-300 space-y-1">
                <span className="font-semibold text-amber-300 block uppercase tracking-wider text-[10px]">Why This Matters</span>
                <p>Your recent assessment trajectory in {priorityAssignment.course} requires focus. Completing this before the deadline optimizes your score outcome.</p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <div className="text-right hidden md:block">
                <div className="text-xs text-ink-400">Due Date</div>
                <div className="font-mono text-sm font-semibold text-white">{priorityAssignment.due}</div>
                <div className="text-xs text-cobalt-300 mt-1">{priorityAssignment.maxScore} points</div>
              </div>

              <Button
                variant="accent"
                size="lg"
                onClick={() => setSelectedAssignment(priorityAssignment)}
                className="rounded-xl px-6 shadow-glow"
              >
                Open assignment &rarr;
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5 p-1 bg-ink-100/70 rounded-xl w-fit">
          {(['all', 'pending', 'submitted', 'graded'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-ink-950 shadow-xs'
                  : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Icon name="search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 border border-ink-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-300"
          />
        </div>
      </div>

      {/* ASSIGNMENT RICH WORK LIST */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredAssignments.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-5 hover:border-cobalt-300 transition-all cursor-pointer group" hover>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      a.status === 'graded' ? 'bg-sage-50 text-sage-600' : a.status === 'submitted' ? 'bg-cobalt-50 text-cobalt-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <Icon name={a.status === 'graded' ? 'award' : a.status === 'submitted' ? 'check' : 'clock'} size={18} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-ink-400 uppercase tracking-wider font-semibold">{a.course}</span>
                        <Badge tone={a.status === 'graded' ? 'sage' : a.status === 'submitted' ? 'cobalt' : 'amber'}>
                          {a.status.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="font-display font-semibold text-ink-900 text-base mt-0.5 group-hover:text-cobalt-600 transition-colors">
                        {a.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-ink-500">
                        <span className="flex items-center gap-1"><Icon name="calendar" size={13} /> Due {a.due}</span>
                        <span className="flex items-center gap-1"><Icon name="award" size={13} /> {a.maxScore} max points</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:self-center self-end pt-2 sm:pt-0">
                    {a.status === 'graded' && a.score != null ? (
                      <div className="text-right">
                        <div className="font-mono text-xl font-bold text-sage-700">{a.score} / {a.maxScore}</div>
                        <div className="text-[10px] text-ink-400 uppercase tracking-wider font-semibold">Graded</div>
                      </div>
                    ) : a.status === 'pending' ? (
                      <Button variant="accent" size="sm" onClick={() => setSelectedAssignment(a)}>
                        Submit work &rarr;
                      </Button>
                    ) : (
                      <div className="text-right">
                        <span className="text-xs font-semibold text-cobalt-600 flex items-center gap-1">
                          <Icon name="check" size={14} /> Submitted
                        </span>
                        <span className="text-[10px] text-ink-400">Awaiting grade</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* LARGE SUBMISSION WORKSPACE MODAL */}
      <Modal open={!!selectedAssignment} onClose={() => setSelectedAssignment(null)} title="Assignment Submission Workspace" wide>
        {selectedAssignment && (
          <div className="space-y-6 pt-2">
            <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150 space-y-2">
              <div className="flex items-center justify-between">
                <Badge tone="cobalt">{selectedAssignment.course}</Badge>
                <span className="text-xs font-mono text-ink-500">Due Date: {selectedAssignment.due}</span>
              </div>
              <h3 className="font-display font-bold text-lg text-ink-950">{selectedAssignment.title}</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Upload your solution file for evaluation. Accepted formats: PDF, DOCX, ZIP (Max 10MB).
              </p>
            </div>

            {submitStep === 'idle' ? (
              <div className="space-y-4">
                <label className="border-2 border-dashed border-ink-200 hover:border-cobalt-400 rounded-2xl p-8 text-center transition-all cursor-pointer bg-ink-50/50 hover:bg-cobalt-50/30 flex flex-col items-center justify-center">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFileSelected(e.target.files?.[0] || null)}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-white text-cobalt-600 shadow-xs flex items-center justify-center mb-3">
                    <Icon name="file" size={24} />
                  </div>
                  <span className="text-sm font-semibold text-ink-900">
                    {fileSelected ? fileSelected.name : 'Drag & drop file here, or click to browse'}
                  </span>
                  <span className="text-xs text-ink-400 mt-1">
                    {fileSelected ? `${(fileSelected.size / 1024).toFixed(1)} KB` : 'PDF, DOCX up to 10MB'}
                  </span>
                </label>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={() => setSelectedAssignment(null)}>Cancel</Button>
                  <Button variant="accent" onClick={handleSubmitWork}>
                    Submit Assignment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-ink-50 border border-ink-150 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-cobalt-100 text-cobalt-600 flex items-center justify-center mx-auto animate-pulse">
                  <Icon name={submitStep === 'done' ? 'check' : 'sparkles'} size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-ink-950 capitalize">
                    {submitStep === 'uploading' && 'Uploading work file...'}
                    {submitStep === 'processing' && 'Processing submission entry...'}
                    {submitStep === 'done' && 'Assignment Submitted ✓'}
                  </h4>
                  <p className="text-xs text-ink-500 mt-1">
                    {submitStep === 'done' ? 'Recorded in academic store timestamp log.' : 'Please keep this window open.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
