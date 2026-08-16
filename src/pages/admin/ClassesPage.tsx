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
import type { ClassSection } from '@/types';

export default function ClassesPage() {
  const adminService = useAdminService();
  const classes = adminService.getClasses();
  const courses = adminService.getCourses();
  const teachers = adminService.getTeachers();
  const { addToast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSection | null>(null);

  const [courseId, setCourseId] = useState(courses[0]?.id || 'c1');
  const [sectionName, setSectionName] = useState('');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || 't1');
  const [schedule, setSchedule] = useState('');
  const [room, setRoom] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName || !schedule) return;

    if (editingClass) {
      adminService.updateClass(editingClass.id, {
        courseId,
        sectionName,
        teacherId,
        schedule,
        room: room || 'Room 101',
      });
      addToast(`Updated class section ${sectionName}`, 'success');
    } else {
      adminService.addClass({
        courseId,
        sectionName,
        teacherId,
        schedule,
        room: room || 'Room 101',
        studentCount: 8,
      });
      addToast(`Created class section ${sectionName}`, 'success');
    }

    setEditingClass(null);
    setSectionName('');
    setSchedule('');
    setRoom('');
    setOpenModal(false);
  };

  const handleDelete = (id: string, sName: string) => {
    adminService.deleteClass(id);
    addToast(`Deleted class section ${sName}`, 'success');
  };

  const startEdit = (cls: ClassSection) => {
    setEditingClass(cls);
    setCourseId(cls.courseId);
    setSectionName(cls.sectionName);
    setTeacherId(cls.teacherId);
    setSchedule(cls.schedule);
    setRoom(cls.room);
    setOpenModal(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Class Sections Management"
        description="Manage active course class sections, schedules, and teacher assignments"
        action={
          <Button
            variant="accent"
            icon="plus"
            onClick={() => {
              setEditingClass(null);
              setSectionName('');
              setSchedule('');
              setRoom('');
              setOpenModal(true);
            }}
          >
            Create Class Section
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {classes.map((cls) => {
            const course = courses.find((c) => c.id === cls.courseId);
            const teacher = teachers.find((t) => t.id === cls.teacherId);

            return (
              <motion.div key={cls.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="p-5" hover>
                  <div className="flex items-start justify-between mb-3">
                    <Badge tone="cobalt">{course?.code || cls.courseId}</Badge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(cls)}
                        className="text-ink-400 hover:text-ink-800 p-1 transition-colors"
                        title="Edit section"
                      >
                        <Icon name="edit" size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(cls.id, cls.sectionName)}
                        className="text-rose-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete section"
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display font-semibold text-ink-900 text-base">{cls.sectionName}</h3>
                  <p className="text-xs text-ink-500 mt-1">{course?.title}</p>

                  <div className="mt-4 pt-3 border-t border-ink-100 grid grid-cols-2 gap-2 text-xs text-ink-600">
                    <div>
                      <span className="text-[10px] text-ink-400 uppercase tracking-wider block font-medium">Instructor</span>
                      <span className="font-medium text-ink-800">{teacher?.name || 'Staff'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-400 uppercase tracking-wider block font-medium">Schedule</span>
                      <span>{cls.schedule}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-400 uppercase tracking-wider block font-medium">Room</span>
                      <span>{cls.room}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-400 uppercase tracking-wider block font-medium">Roster</span>
                      <span className="font-mono">{cls.studentCount} enrolled</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title={editingClass ? 'Edit Class Section' : 'Create Class Section'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-600 block mb-1">Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-300"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-600 block mb-1">Section Name</label>
            <input
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="e.g. Section A - Morning"
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink-600 block mb-1">Assigned Teacher</label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.dept})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ink-600 block mb-1">Room</label>
              <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Room 204A"
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-600 block mb-1">Schedule</label>
            <input
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="e.g. Mon/Wed 9:00 AM – 10:30 AM"
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              {editingClass ? 'Update Class' : 'Create Class'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
