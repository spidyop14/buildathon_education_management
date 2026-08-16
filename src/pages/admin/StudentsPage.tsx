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

export default function StudentsPage() {
  const adminService = useAdminService();
  const roster = adminService.getRoster();
  const { addToast } = useToast();

  const [query, setQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState(90);
  const [avg, setAvg] = useState(85);

  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = roster.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    if (editingId) {
      adminService.updateStudent(editingId, { name, attendance, avg });
      addToast(`Updated student profile for ${name}`, 'success');
    } else {
      adminService.addStudent({ name, attendance, avg });
      addToast(`Added student ${name}`, 'success');
    }
    setEditingId(null);
    setName('');
    setAttendance(90);
    setAvg(85);
    setOpenModal(false);
  };

  const startEdit = (s: { id: string; name: string; attendance: number; avg: number }) => {
    setEditingId(s.id);
    setName(s.name);
    setAttendance(s.attendance);
    setAvg(s.avg);
    setOpenModal(true);
  };

  const handleDelete = (id: string, sName: string) => {
    adminService.deleteStudent(id);
    addToast(`Deleted student ${sName}`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <PageHeader
        title="Students"
        description="Manage student records and roster"
        action={<Button variant="accent" icon="plus" onClick={() => setOpenModal(true)}>Add student</Button>}
      />

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Icon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students..."
              className="w-full border border-ink-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-500 border-b border-ink-150">
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Attendance</th>
              <th className="pb-2 font-medium">Average</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((s) => {
                const risk = s.avg < 65 || s.attendance < 70;
                return (
                  <tr key={s.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/50">
                    <td className="py-3 text-ink-800 font-medium">{s.name}</td>
                    <td className="py-3 font-mono text-ink-600">{s.attendance}%</td>
                    <td className="py-3 font-mono text-ink-600">{s.avg}%</td>
                    <td className="py-3">
                      <Badge tone={risk ? 'rose' : 'sage'}>{risk ? 'At risk' : 'On track'}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => startEdit(s)}
                        className="text-ink-400 hover:text-ink-800 p-1 mr-1 transition-colors"
                        title="Edit student"
                      >
                        <Icon name="edit" size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="text-rose-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete student"
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
      </Card>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title={editingId ? 'Edit Student Profile' : 'Add New Student'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-600 block mb-1">Student Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alexander Hayes"
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600 block mb-1">Initial Attendance (%)</label>
            <input
              type="number"
              value={attendance}
              onChange={(e) => setAttendance(Number(e.target.value))}
              max={100}
              min={0}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600 block mb-1">Initial Average Score (%)</label>
            <input
              type="number"
              value={avg}
              onChange={(e) => setAvg(Number(e.target.value))}
              max={100}
              min={0}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-300"
              required
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="accent">Save Student</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
