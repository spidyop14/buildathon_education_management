import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAdminService } from '@/services/adminService';
import { useToast } from '@/hooks/useToast';

export default function CoursesPage() {
  const adminService = useAdminService();
  const courses = adminService.getCourses();
  const teachers = adminService.getTeachers();
  const { addToast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('Computer Science');
  const [credits, setCredits] = useState(3);
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || 't1');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Core');
  const [level, setLevel] = useState<'Introductory' | 'Intermediate' | 'Advanced'>('Introductory');

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;
    if (editingId) {
      adminService.updateCourse(editingId, {
        code,
        title,
        dept,
        credits,
        teacherId,
        desc: desc || title,
        category,
        level,
      });
      addToast(`Updated course ${code}`, 'success');
    } else {
      adminService.addCourse({
        code,
        title,
        dept,
        credits,
        teacherId,
        desc: desc || title,
        category,
        rating: 4.8,
        level,
      });
      addToast(`Created course ${code}`, 'success');
    }
    setEditingId(null);
    setCode('');
    setTitle('');
    setDesc('');
    setOpenModal(false);
  };

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setCode(c.code);
    setTitle(c.title);
    setDept(c.dept);
    setCredits(c.credits);
    setTeacherId(c.teacherId);
    setDesc(c.desc || '');
    setCategory(c.category || 'Core');
    setLevel(c.level || 'Introductory');
    setOpenModal(true);
  };

  const handleDelete = (id: string, courseCode: string) => {
    adminService.deleteCourse(id);
    addToast(`Deleted course ${courseCode}`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <PageHeader
        title="Course Management"
        description="Manage the institutional course catalog"
        action={<Button variant="accent" icon="plus" onClick={() => setOpenModal(true)}>New Course</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {courses.map((course) => {
            const teacher = teachers.find(t => t.id === course.teacherId);
            return (
              <motion.div key={course.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="p-5" hover>
                  <div className="flex items-start justify-between mb-3">
                    <Badge tone="cobalt">{course.code}</Badge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(course)}
                        className="text-ink-400 hover:text-ink-800 transition-colors p-1"
                        title="Edit course"
                      >
                        <Icon name="edit" size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id, course.code)}
                        className="text-rose-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete course"
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-ink-900 mt-1">{course.title}</h3>
                  <p className="text-xs text-ink-500 mt-1">{teacher?.name || 'Staff'}</p>
                  <div className="flex items-center justify-between mt-4 text-xs text-ink-500 border-t border-ink-100 pt-3">
                    <span className="flex items-center gap-1"><Icon name="users" size={13} /> {course.dept}</span>
                    <span className="font-mono">{course.credits} cr</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title={editingId ? 'Edit Course Catalog Entry' : 'Create New Course'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink-600 block mb-1">Course Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS-301"
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-600 block mb-1">Credits</label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                min={1}
                max={6}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-600 block mb-1">Course Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Systems"
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink-600 block mb-1">Department</label>
              <input
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-600 block mb-1">Instructor</label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-600 block mb-1">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Course summary..."
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="accent">Create Course</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
