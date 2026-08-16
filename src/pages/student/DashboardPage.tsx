import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { BarChart } from '@/components/academic/BarChart';
import { InsightCard } from '@/components/academic/InsightCard';
import { useStudentService } from '@/services/studentService';
import { useAIService } from '@/services/aiService';
import { calculatePerformance } from '@/services/dataStore';
import type { Insight } from '@/types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const studentService = useStudentService();
  const aiService = useAIService();
  
  const student = studentService.getStudent();

  // Computations
  const timeBasedGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const { overallAvg, assignmentAvg, examAvg } = useMemo(() => {
    const subjects = student.subjects;
    if (!subjects || subjects.length === 0) return { overallAvg: 0, assignmentAvg: 0, examAvg: 0 };
    
    let assignmentTotal = 0;
    let examTotal = 0;
    
    subjects.forEach(s => {
      assignmentTotal += s.assignmentAvg;
      examTotal += s.examAvg;
    });

    const avgAssig = Math.round(assignmentTotal / subjects.length);
    const avgExam = Math.round(examTotal / subjects.length);
    
    return {
      overallAvg: calculatePerformance(student),
      assignmentAvg: avgAssig,
      examAvg: avgExam
    };
  }, [student]);

  const subjectData = useMemo(() => student.subjects.map(s => Math.round((s.assignmentAvg + s.examAvg) / 2)), [student]);
  const subjectLabels = useMemo(() => student.subjects.map(s => s.name.split(' ')[0]), [student]);
  
  const insights = aiService.getStudentInsights();

  const attendance = student.attendance;
  const isAttendanceHealthy = attendance >= 75;
  const attendanceColor = isAttendanceHealthy ? 'text-sage-500' : 'text-amber-500';
  const attendanceStroke = isAttendanceHealthy ? 'stroke-sage-500' : 'stroke-amber-500';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto space-y-8 pb-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* SECTION 1: Personalized Greeting */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-ink-950 tracking-tight">
            {timeBasedGreeting}, {student.name.split(' ')[0]}.
          </h1>
          <p className="text-ink-500 mt-1">Here's how your academic journey is progressing.</p>
        </div>
        <div className="text-xs text-ink-400 font-medium tracking-wide uppercase">
          Fall 2026 · Week 8
        </div>
      </motion.div>

      {/* SECTION 2: Hero Performance Card */}
      <motion.div variants={item}>
        <Card variant="elevated" className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="flex-1 space-y-4">
              <h2 className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Overall Performance</h2>
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-5xl md:text-6xl font-bold text-ink-950">{overallAvg}%</span>
                <Badge tone="sage" className="text-xs">↑ 6.2% from last assessment</Badge>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-start md:justify-end gap-6 md:gap-12">
              <div className="space-y-1">
                <div className="text-xs text-ink-400 uppercase tracking-wider font-semibold">Attendance</div>
                <div className={`font-mono text-2xl font-bold ${attendanceColor}`}>{attendance}%</div>
                <div className="text-xs text-ink-500">Below threshold</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-ink-400 uppercase tracking-wider font-semibold">Assignments</div>
                <div className="font-mono text-2xl font-bold text-cobalt-600">{assignmentAvg}%</div>
                <div className="text-xs text-ink-500">Completed</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-ink-400 uppercase tracking-wider font-semibold">Exams</div>
                <div className="font-mono text-2xl font-bold text-cobalt-600">{examAvg}%</div>
                <div className="text-xs text-ink-500">Average</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SECTION 3: Subject Performance */}
        <motion.div variants={item} className="md:col-span-2 h-full">
          <Card variant="elevated" className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-semibold text-ink-950">Subject Performance</h2>
              <Button variant="ghost" size="sm" className="text-cobalt-600" onClick={() => navigate('/student/progress')}>
                View progress →
              </Button>
            </div>
            <div className="flex-1 min-h-[200px]">
              <BarChart data={subjectData} labels={subjectLabels} color="#4361EE" />
            </div>
          </Card>
        </motion.div>

        {/* SECTION 4: Attendance Ring */}
        <motion.div variants={item} className="h-full">
          <Card variant="elevated" className="p-6 flex flex-col h-full items-center justify-center text-center">
            <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wider w-full text-left mb-6">Attendance</h2>
            
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" className="stroke-ink-100" strokeWidth="8" />
                <motion.circle 
                  cx="50" cy="50" r="45" fill="none" 
                  className={attendanceStroke} 
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * attendance) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-3xl font-bold text-ink-950">{attendance}%</span>
              </div>
            </div>
            
            <p className="text-sm font-medium text-ink-600 mb-2">Recommended: 75%</p>
            <Badge tone={isAttendanceHealthy ? "sage" : "amber"} className="px-3 py-1">
              {isAttendanceHealthy ? "Healthy" : "Below threshold"}
            </Badge>
          </Card>
        </motion.div>
      </div>

      {/* SECTION 5: Academic Intelligence */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="sparkles" className="w-5 h-5 text-cobalt-500" />
            <h2 className="text-lg font-display font-semibold text-ink-950">Academic Intelligence</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-cobalt-600" onClick={() => navigate('/student/intelligence')}>
            Full report →
          </Button>
        </div>

        <Card variant="dark" className="p-6 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/student/intelligence')}>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10 transition-transform group-hover:scale-110 duration-700">
            <Icon name="sparkles" className="w-48 h-48 text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="sparkles" className="w-4 h-4 text-white/80" />
              <h3 className="text-xl font-display font-medium text-white/90 tracking-tight">Your performance, understood.</h3>
            </div>
            <p className="text-ink-400">EduIQ analyzed your data across {student.subjects.length} subjects.</p>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.slice(0, 2).map((insight: Insight, idx: number) => (
            <motion.div 
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <InsightCard insight={insight} />
            </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
