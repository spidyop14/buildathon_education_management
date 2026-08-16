import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { useAdminService } from '@/services/adminService';
import { useToast } from '@/hooks/useToast';

export default function TeachersPage() {
  const adminService = useAdminService();
  const teachers = adminService.getTeachers();
  const courses = adminService.getCourses();
  const { addToast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [dept, setDept] = useState('Computer Science');
  const [title, setTitle] = useState('Assistant Professor');

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    if (editingId) {
      adminService.updateTeacher(editingId, { name, dept, title });
      addToast(`Updated faculty member ${name}`, 'success');
    } else {
      adminService.addTeacher({ name, dept, title });
      addToast(`Added faculty member ${name}`, 'success');
    }
    setEditingId(null);
    setName('');
    setDept('Computer Science');
    setTitle('Assistant Professor');
    setOpenModal(false);
  };

  const startEdit = (t: { id: string; name: string; dept: string; title: string }) => {
    setEditingId(t.id);
    setName(t.name);
    setDept(t.dept);
    setTitle(t.title);
    setOpenModal(true);
  };

  const handleDelete = (id: string, tName: string) => {
    adminService.deleteTeacher(id);
    addToast(`Removed faculty member ${tName}`, 'success');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Faculty Directory"
        description="Manage teaching staff and their course assignments."
        action={<Button variant="accent" icon="plus" onClick={() => setOpenModal(true)}>Add Faculty</Button>}
      />
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50 text-ink-500 font-medium border-b border-ink-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Courses</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              <AnimatePresence>
                {teachers.map(t => {
                  const courseCount = courses.filter(c => c.teacherId === t.id).length;
                  return (
                    <tr key={t.id} className="hover:bg-ink-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-ink-900">{t.name}</td>
                      <td className="px-6 py-4 text-ink-600">{t.title}</td>
                      <td className="px-6 py-4">
                        <Badge tone="cobalt">{t.dept}</Badge>
                      </td>
                      <td className="px-6 py-4 text-ink-600">{courseCount} assigned</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => startEdit(t)}
                          className="text-ink-400 hover:text-ink-800 p-1 mr-1 transition-colors"
                          title="Edit faculty"
                        >
                          <Icon name="edit" size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          className="text-rose-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove faculty"
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title={editingId ? 'Edit Faculty Member' : 'Add Faculty Member'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-600 block mb-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Robert Vance"
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600 block mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Associate Professor"
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600 block mb-1">Department</label>
            <input
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              required
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="accent">Save Faculty</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
