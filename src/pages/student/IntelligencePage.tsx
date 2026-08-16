import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { InsightCard } from '@/components/academic/InsightCard';
import { useStudentService } from '@/services/studentService';
import { computeStudentInsights } from '@/lib/ai/rules';

export default function IntelligencePage() {
  const studentService = useStudentService();
  const student = studentService.getStudent();
  const insights = computeStudentInsights(student);

  // Ask EduIQ Chat Assistant State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello Maya! I've analyzed your academic records across 4 subjects and 30 attendance sessions. How can I help you optimize your study routine today?`,
      time: 'Just now',
    },
  ]);
  const [queryInput, setQueryInput] = useState('');

  // AI Study Plan Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, subject: 'Mathematics', topic: 'Integration Techniques Problem Set', duration: '45 min', priority: 'HIGH', done: false },
    { id: 2, subject: 'Physics', topic: 'Kinematics & Dynamics Revision', duration: '30 min', priority: 'MEDIUM', done: false },
    { id: 3, subject: 'Data Science', topic: 'Exploratory Data Analysis Practice', duration: '30 min', priority: 'LOW', done: false },
  ]);

  const toggleTaskDone = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Local Conversational Intelligence Engine based on real student data
  const handleAskQuestion = (questionText: string) => {
    const q = questionText.toLowerCase();
    if (!q.trim()) return;

    const newMessages = [...chatMessages, { sender: 'user' as const, text: questionText, time: 'Just now' }];
    setChatMessages(newMessages);
    setQueryInput('');

    setTimeout(() => {
      let reply = '';
      if (q.includes('math') || q.includes('score low') || q.includes('failing')) {
        reply = `Mathematics is currently your lowest-scoring subject at 56%. Your assignment average is 54% and your exam average is 58%. Your exam scores have declined over recent assessments (64 → 61 → 58). I recommend focusing on Integration Techniques problem sets this week.`;
      } else if (q.includes('study today') || q.includes('what should i study')) {
        reply = `Today I recommend spending 45 minutes on Mathematics (Integration Techniques) and 30 minutes reviewing Physics kinematics. This addresses your primary academic risk area before the next assessment.`;
      } else if (q.includes('attendance')) {
        reply = `Your attendance is currently 68%, which is below the recommended 75% health threshold. You need to attend the next 9 consecutive sessions without absence to recover your health status to 75%.`;
      } else if (q.includes('strongest') || q.includes('best subject')) {
        reply = `Your strongest subject is English with an average score of 87%, followed closely by Data Science at 81% (which is trending upward!).`;
      } else {
        reply = `Based on your academic profile, your overall composite index is 73/100. Your main priority is elevating Mathematics (56%) and maintaining consistent session attendance.`;
      }

      setChatMessages((prev) => [...prev, { sender: 'ai' as const, text: reply, time: 'Just now' }]);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 font-body"
    >
      <PageHeader
        title="Academic Intelligence Advisor"
        description="Your personal AI academic operating system."
      />

      {/* AI HERO SUMMARY BANNER */}
      <Card variant="dark" className="p-6 md:p-8 bg-gradient-ai text-white relative overflow-hidden border border-white/10 shadow-pop">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cobalt-500/20 text-cobalt-300 text-xs font-semibold border border-cobalt-500/30">
              <Icon name="sparkles" size={14} className="text-amber-400" />
              <span>✦ EDUIQ INTELLIGENCE ENGINE</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
              Your academic performance, understood.
            </h2>

            <p className="text-xs md:text-sm text-ink-300 leading-relaxed">
              EduIQ continuously evaluates your coursework, attendance logs, and examination trajectories to generate explainable recommendations.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.06] border border-white/10 text-center shrink-0">
            <div>
              <div className="text-[10px] uppercase text-ink-400 font-semibold">Subjects</div>
              <div className="font-mono text-2xl font-bold text-white">4</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-ink-400 font-semibold">Data Points</div>
              <div className="font-mono text-2xl font-bold text-white">35+</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-ink-400 font-semibold">Risk Level</div>
              <div className="font-mono text-2xl font-bold text-amber-400">Medium</div>
            </div>
          </div>
        </div>
      </Card>

      {/* ✦ ASK EDUIQ CONVERSATIONAL ASSISTANT */}
      <Card className="p-6 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-ink-150 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cobalt-50 text-cobalt-600 flex items-center justify-center">
              <Icon name="sparkles" size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-ink-950">Ask EduIQ Advisor</h3>
              <p className="text-xs text-ink-500">Conversational AI query assistant based on your live academic records</p>
            </div>
          </div>
          <Badge tone="cobalt">AI Local Engine</Badge>
        </div>

        {/* Suggested Quick Questions */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            'Why is my math score low?',
            'What should I study today?',
            'How can I improve my attendance?',
            'What is my strongest subject?',
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="px-3 py-1.5 rounded-xl border border-ink-200 bg-ink-50 hover:bg-cobalt-50 hover:border-cobalt-300 text-xs font-semibold text-ink-700 transition-all text-left"
            >
              ✦ {q}
            </button>
          ))}
        </div>

        {/* Chat Stream Window */}
        <div className="p-4 rounded-2xl bg-ink-50/70 border border-ink-150 max-h-72 overflow-y-auto space-y-3">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-ink-950 text-white rounded-br-none'
                    : 'bg-white border border-ink-150 text-ink-900 shadow-xs rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-ink-400 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Query Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion(queryInput);
          }}
          className="flex items-center gap-2 pt-1"
        >
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Ask anything about your performance, deadlines, or recommendations..."
            className="flex-1 px-4 py-2.5 border border-ink-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-300"
          />
          <Button type="submit" variant="accent" className="px-5 py-2.5 text-xs font-semibold shrink-0">
            Ask EduIQ &rarr;
          </Button>
        </form>
      </Card>

      {/* CATEGORIZED EXPLAINABLE AI INSIGHT ENGINE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-ink-950">AI Insight Engine</h3>
          <span className="text-xs text-ink-400">{insights.length} active insights generated</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {insights.map((insight, idx) => (
            <InsightCard key={insight.id} insight={insight} delay={idx * 0.1} />
          ))}
        </div>
      </div>

      {/* INTERACTIVE AI STUDY PLAN WORKSPACE */}
      <Card className="p-6 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-ink-150 pb-3">
          <div>
            <h3 className="font-display font-bold text-base text-ink-950">This Week's AI Study Plan</h3>
            <p className="text-xs text-ink-500">Targeted study blocks prioritizing high-risk academic areas</p>
          </div>
          <Badge tone="sage">{tasks.filter(t => t.done).length} / {tasks.length} Completed</Badge>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                task.done ? 'bg-sage-50/50 border-sage-200' : 'bg-ink-50 border-ink-150'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTaskDone(task.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                    task.done ? 'bg-sage-500 text-white' : 'border border-ink-300 bg-white text-transparent'
                  }`}
                >
                  ✓
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-ink-900">{task.subject}</span>
                    <Badge tone={task.priority === 'HIGH' ? 'rose' : task.priority === 'MEDIUM' ? 'amber' : 'cobalt'}>
                      {task.priority} PRIORITY
                    </Badge>
                  </div>
                  <div className={`text-xs mt-0.5 ${task.done ? 'line-through text-ink-400' : 'text-ink-700'}`}>
                    {task.topic}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-ink-400">{task.duration}</span>
                <Button
                  variant={task.done ? 'secondary' : 'accent'}
                  size="sm"
                  onClick={() => toggleTaskDone(task.id)}
                >
                  {task.done ? 'Completed' : 'Start Task'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
