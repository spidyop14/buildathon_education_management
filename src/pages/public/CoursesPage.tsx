import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { useCourseService } from '@/services/courseService';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

export default function CoursesPage() {
  const navigate = useNavigate();
  const courseService = useCourseService();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');

  const allCourses = courseService.getAllCourses();
  const categories = ['All', ...Array.from(new Set(allCourses.map(c => c.category)))];

  const filteredCourses = allCourses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || c.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6 pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-ink-950 tracking-tight">Course Catalog</h1>
          <p className="text-ink-500 mt-1">Explore our academic offerings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-ink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-500/20 focus:border-cobalt-500 transition-all w-full sm:w-64"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === c ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((c) => {
              const teacher = courseService.getCourseTeacher(c.teacherId);
              return (
                <motion.div key={c.id} variants={item} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                  <Card
                    className="p-5 h-full flex flex-col group cursor-pointer"
                    hover
                    onClick={() => navigate(`/courses/${c.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge tone="cobalt">{c.code}</Badge>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] font-mono text-ink-400">{c.credits} cr</span>
                        <span className="text-[10px] uppercase tracking-wider text-amber-600 font-medium flex items-center gap-0.5"><Icon name="star" size={10} className="fill-current" /> {c.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-display font-semibold text-ink-900 text-[15px] leading-snug">{c.title}</h3>
                    <p className="text-xs text-ink-500 mt-1.5 line-clamp-2 flex-1">{c.desc}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-100">
                      <span className="text-xs text-ink-500">{teacher?.name || 'Staff'}</span>
                      <span className="text-xs text-cobalt-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        View <Icon name="arrowRight" size={11} />
                      </span>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <motion.div className="col-span-full py-12 text-center text-ink-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              No courses found matching your criteria.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
