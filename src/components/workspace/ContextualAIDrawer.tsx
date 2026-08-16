import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

interface ContextualAIDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ContextualAIDrawer({ open, onClose }: ContextualAIDrawerProps) {
  const location = useLocation();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  // Contextual prompt suggestions based on current path
  const getContextualPrompts = () => {
    const path = location.pathname;
    if (path.includes('students')) {
      return [
        'Identify students at risk of falling behind',
        'Summarize class attendance & grade correlation',
        'Which students require immediate intervention?',
      ];
    }
    if (path.includes('assignments') || path.includes('submissions')) {
      return [
        'Analyze submission completion rates',
        'Which topics had the highest error rates?',
        'Generate feedback summary for Problem Set 6',
      ];
    }
    if (path.includes('attendance')) {
      return [
        'Highlight students below 75% attendance threshold',
        'Show attendance drop-off by day of week',
        'Draft attendance warning notification',
      ];
    }
    if (path.includes('examinations')) {
      return [
        'Explain midterm grade distribution',
        'Which questions were missed most often?',
        'Compare exam scores vs assignment averages',
      ];
    }
    return [
      'Summarize current classroom health',
      'Which subject needs academic attention?',
      'Draft weekly parent/student progress note',
    ];
  };

  const handlePromptClick = (promptText: string) => {
    setInput(promptText);
    handleSend(promptText);
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: 'user' as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setBusy(true);

    setTimeout(() => {
      let reply = 'Analysis complete. EduIQ synthesized 42 student records across attendance logs, coursework, and examination scores.';
      if (query.toLowerCase().includes('risk') || query.toLowerCase().includes('behind')) {
        reply = 'Academic Risk Analysis:\n• Maya Whitfield (Mathematics: 58%, Attendance: 68%)\n• 4 students in Calculus are below the 75% attendance threshold.\n\nRecommendation: Schedule a 1-on-1 revision check-in this week.';
      } else if (query.toLowerCase().includes('assignment') || query.toLowerCase().includes('submission')) {
        reply = 'Submission Analytics:\n• 34 / 42 students submitted Problem Set 6.\n• Average score: 78%.\n• Integration by Parts was the most frequent point loss topic.';
      } else if (query.toLowerCase().includes('attendance')) {
        reply = 'Attendance Insights:\n• Overall class attendance is 86%.\n• Friday morning sessions show a 9.4% drop in attendance relative to Tuesday sessions.';
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setBusy(false);
    }, 700);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-950/40 backdrop-blur-xs"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col font-body border-l border-ink-150"
          >
            {/* DRAWER HEADER */}
            <div className="p-5 border-b border-ink-150 flex items-center justify-between bg-ink-950 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cobalt-600 text-white flex items-center justify-center">
                  <Icon name="sparkles" size={16} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">EduIQ Copilot</h3>
                  <span className="text-[10px] font-mono text-cobalt-300">Contextual Educator Assistant</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-ink-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            {/* CHAT MESSAGES BODY */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 ? (
                <div className="space-y-4 pt-4">
                  <div className="p-4 rounded-2xl bg-cobalt-50/70 border border-cobalt-200 text-xs text-ink-900 space-y-2">
                    <span className="font-bold text-cobalt-950 flex items-center gap-1.5">
                      <Icon name="sparkles" size={14} className="text-cobalt-600" />
                      Context-Aware Intelligence
                    </span>
                    <p className="text-ink-700 leading-relaxed text-[11px]">
                      I am monitoring data on this page. Ask any question or click a prompt below for immediate insights.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-ink-400">Suggested Prompts</span>
                    <div className="space-y-2">
                      {getContextualPrompts().map((promptText) => (
                        <button
                          key={promptText}
                          onClick={() => handlePromptClick(promptText)}
                          className="w-full p-3 rounded-2xl border border-ink-200 bg-white hover:border-cobalt-300 hover:bg-cobalt-50/50 text-left text-xs font-semibold text-ink-800 transition-all flex items-center justify-between"
                        >
                          <span>{promptText}</span>
                          <Icon name="arrowRight" size={14} className="text-cobalt-600 shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-cobalt-600 text-white rounded-br-none'
                          : 'bg-ink-50 border border-ink-150 text-ink-900 rounded-bl-none whitespace-pre-line'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))
              )}

              {busy && (
                <div className="flex items-center gap-2 text-xs text-ink-500 pt-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-cobalt-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Synthesizing classroom data...</span>
                </div>
              )}
            </div>

            {/* INPUT FOOTER */}
            <div className="p-4 border-t border-ink-150 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask EduIQ AI..."
                  className="flex-1 h-11 border border-ink-200 rounded-2xl px-4 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
                />
                <Button type="submit" variant="accent" className="h-11 px-4 rounded-2xl shrink-0">
                  <Icon name="arrowRight" size={16} />
                </Button>
              </form>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
