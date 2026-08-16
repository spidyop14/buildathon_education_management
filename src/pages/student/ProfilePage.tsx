import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useStudentService } from '@/services/studentService';
import { useToast } from '@/hooks/useToast';
import { useStudentProfile, StudentProfileData } from '@/lib/profileStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const studentService = useStudentService();
  const student = studentService.getStudent();
  const { addToast } = useToast();
  const { profile, updateProfile } = useStudentProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'contact'>('personal');
  const [formData, setFormData] = useState<StudentProfileData>(profile);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Profile Completion Calculation
  const calculateCompletion = (data: StudentProfileData) => {
    const fieldsToTrack: (keyof StudentProfileData)[] = [
      'fullName',
      'email',
      'phone',
      'dateOfBirth',
      'gender',
      'department',
      'program',
      'academicYear',
      'semester',
      'section',
      'emergencyContact',
      'guardianName',
    ];

    let filled = fieldsToTrack.filter((f) => !!data[f] && data[f]?.toString().trim() !== '').length;
    if (data.avatar) filled += 1;

    const total = fieldsToTrack.length + 1;
    return Math.round((filled / total) * 100);
  };

  const completionPct = calculateCompletion(profile);

  // Initials generator
  const initials = profile.fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Photo Upload Handler (Base64)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      addToast('Image size must be less than 3MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateProfile({ avatar: base64 });
      addToast('✓ Profile photo updated successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Remove Photo Handler
  const handleRemovePhoto = () => {
    updateProfile({ avatar: null });
    addToast('✓ Profile photo removed', 'info');
  };

  // Open Edit Modal
  const handleOpenEdit = () => {
    setFormData(profile);
    setIsEditModalOpen(true);
  };

  // Save Form Edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      addToast('Full name is required', 'error');
      return;
    }

    if (!formData.email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      updateProfile(formData);
      setIsEditModalOpen(false);
      addToast('✓ Profile updated successfully!', 'success');
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
        title="Student Profile & Account"
        description="Manage your institutional academic identity and account information."
        action={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => navigate('/student/settings')}>
              <Icon name="settings" size={14} className="mr-1.5" /> Settings
            </Button>
            <Button variant="accent" onClick={handleOpenEdit} className="shadow-glow">
              <Icon name="user" size={14} className="mr-1.5" /> Edit Profile
            </Button>
          </div>
        }
      />

      {/* SECTION 1: PROFILE HEADER CARD */}
      <Card variant="elevated" className="p-6 md:p-8 bg-white border border-ink-150 shadow-pop space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* AVATAR DISPLAY */}
            <div className="relative group">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-cobalt-500 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cobalt-500 to-cobalt-700 text-white flex items-center justify-center font-mono font-bold text-2xl shadow-glow">
                  {initials}
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="font-display font-bold text-2xl text-ink-950">{profile.fullName}</h2>
                <Badge tone="sage">&bull; Active Student</Badge>
              </div>

              <p className="text-xs text-ink-500 font-medium">
                {profile.academicYear} &bull; {profile.department} &bull; <strong className="font-mono text-ink-700">{profile.studentId}</strong>
              </p>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-cobalt-600 hover:text-cobalt-800 transition-colors"
                >
                  Change photo
                </button>
                {profile.avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* DYNAMIC PROFILE COMPLETION BAR */}
          <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150 space-y-2 shrink-0 md:w-64">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink-700">Profile Completion</span>
              <span className="font-mono font-bold text-cobalt-600">{completionPct}%</span>
            </div>
            <ProgressBar value={completionPct} tone={completionPct >= 80 ? 'sage' : 'amber'} />
            <div className="text-[10px] text-ink-400">
              {completionPct >= 80 ? '✦ Profile strength: Excellent' : 'Complete optional contact fields'}
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 2: QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border-l-4 border-l-cobalt-500">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Academic Index</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">71 / 100</div>
          <div className="text-xs text-cobalt-600 mt-0.5">&uarr; +6.2% trajectory</div>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-amber-500">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Attendance</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{student.attendance}%</div>
          <div className="text-xs text-amber-600 mt-0.5">Recommended 75%</div>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-sage-500">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Enrolled Courses</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{student.subjects.length}</div>
          <div className="text-xs text-sage-600 mt-0.5">Current semester</div>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-rose-500">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Academic Standing</div>
          <div className="font-mono text-2xl font-bold text-ink-900 mt-1">{profile.academicYear}</div>
          <div className="text-xs text-rose-600 mt-0.5">Good Standing</div>
        </Card>
      </div>

      {/* SECTION 3: PERSONAL & ACADEMIC INFORMATION CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PERSONAL INFORMATION */}
        <Card className="p-6 bg-white shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-ink-150 pb-3">
            <h3 className="font-display font-bold text-base text-ink-950">Personal Information</h3>
            <button onClick={handleOpenEdit} className="text-xs font-semibold text-cobalt-600 hover:underline">
              Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Full Name</span>
              <div className="font-semibold text-ink-900 mt-0.5">{profile.fullName}</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Student ID</span>
              <div className="font-mono font-bold text-ink-900 mt-0.5">{profile.studentId}</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Email Address</span>
              <div className="font-medium text-ink-900 mt-0.5">{profile.email}</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Phone Number</span>
              <div className="font-medium text-ink-900 mt-0.5">{profile.phone}</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Date of Birth</span>
              <div className="font-medium text-ink-900 mt-0.5">{profile.dateOfBirth}</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Gender</span>
              <div className="font-medium text-ink-900 mt-0.5">{profile.gender}</div>
            </div>
          </div>
        </Card>

        {/* ACADEMIC INFORMATION */}
        <Card className="p-6 bg-white shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-ink-150 pb-3">
            <h3 className="font-display font-bold text-base text-ink-950">Academic Information</h3>
            <button onClick={handleOpenEdit} className="text-xs font-semibold text-cobalt-600 hover:underline">
              Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Department</span>
              <div className="font-semibold text-ink-900 mt-0.5">{profile.department}</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Program</span>
              <div className="font-medium text-ink-900 mt-0.5">{profile.program}</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Academic Year</span>
              <div className="font-medium text-ink-900 mt-0.5">{profile.academicYear}</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Semester & Section</span>
              <div className="font-medium text-ink-900 mt-0.5">{profile.semester} ({profile.section})</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Enrollment Year</span>
              <div className="font-mono text-ink-900 mt-0.5">{profile.enrollmentYear}</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-ink-400">Academic Advisor</span>
              <div className="font-medium text-cobalt-600 mt-0.5">{profile.advisor}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 4: CONTACT & GUARDIAN DETAILS */}
      <Card className="p-6 bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-ink-150 pb-3">
          <h3 className="font-display font-bold text-base text-ink-950">Contact & Guardian Information</h3>
          <button onClick={handleOpenEdit} className="text-xs font-semibold text-cobalt-600 hover:underline">
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-semibold uppercase text-ink-400">Emergency Contact</span>
            <div className="font-medium text-ink-900 mt-0.5">{profile.emergencyContact}</div>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase text-ink-400">Parent / Guardian Name</span>
            <div className="font-medium text-ink-900 mt-0.5">{profile.guardianName}</div>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase text-ink-400">Guardian Phone</span>
            <div className="font-medium text-ink-900 mt-0.5">{profile.guardianPhone}</div>
          </div>
        </div>
      </Card>

      {/* SECTION 5: ACCOUNT ACTIVITY & ACADEMIC SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white shadow-card space-y-3 lg:col-span-2">
          <h3 className="font-display font-bold text-base text-ink-950">Account Activity</h3>
          <div className="grid grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-ink-50">
              <span className="text-[10px] uppercase text-ink-400 font-semibold">Last Update</span>
              <div className="font-semibold text-ink-900 mt-0.5">Today</div>
            </div>
            <div className="p-3 rounded-xl bg-ink-50">
              <span className="text-[10px] uppercase text-ink-400 font-semibold">Account Created</span>
              <div className="font-semibold text-ink-900 mt-0.5">August 2026</div>
            </div>
            <div className="p-3 rounded-xl bg-ink-50">
              <span className="text-[10px] uppercase text-ink-400 font-semibold">Last Active</span>
              <div className="font-semibold text-sage-600 mt-0.5">&bull; Active Now</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-ai text-white shadow-card space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cobalt-300">
            <Icon name="sparkles" size={14} className="text-amber-400" />
            <span>Academic Snapshot</span>
          </div>
          <p className="text-xs text-ink-300">
            Your performance index is 71/100. Inspect continuous evaluation trends & AI recommendations.
          </p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/student/intelligence')} className="w-full bg-white text-ink-900 hover:bg-ink-100 mt-2">
            View AI Insights &rarr;
          </Button>
        </Card>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Student Profile" wide>
        <form onSubmit={handleSaveProfile} className="space-y-6 pt-2">
          {/* TAB HEADERS */}
          <div className="flex items-center gap-2 border-b border-ink-150 pb-2">
            {(['personal', 'academic', 'contact'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab ? 'bg-ink-950 text-white shadow-xs' : 'text-ink-500 hover:bg-ink-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: PERSONAL */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-medium text-ink-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-ink-700 block mb-1">Student ID (Read-only)</label>
                <input
                  type="text"
                  value={formData.studentId}
                  disabled
                  className="w-full border border-ink-150 rounded-xl px-3 py-2 text-xs font-mono bg-ink-50 text-ink-500"
                />
              </div>

              <div>
                <label className="font-medium text-ink-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-ink-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
                />
              </div>

              <div>
                <label className="font-medium text-ink-700 block mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
                />
              </div>

              <div>
                <label className="font-medium text-ink-700 block mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium bg-white focus:ring-2 focus:ring-cobalt-300"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC */}
          {activeTab === 'academic' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-medium text-ink-700 block mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
                />
              </div>

              <div>
                <label className="font-medium text-ink-700 block mb-1">Program</label>
                <input
                  type="text"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
                />
              </div>

              <div>
                <label className="font-medium text-ink-700 block mb-1">Academic Year</label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium bg-white focus:ring-2 focus:ring-cobalt-300"
                >
                  <option>Freshman</option>
                  <option>Sophomore</option>
                  <option>Junior</option>
                  <option>Senior</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-ink-700 block mb-1">Semester & Section</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-ink-700 block mb-1">Academic Advisor</label>
                <input
                  type="text"
                  value={formData.advisor}
                  onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
                />
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-medium text-ink-700 block mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
                />
              </div>

              <div>
                <label className="font-medium text-ink-700 block mb-1">Parent / Guardian Name</label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
                />
              </div>

              <div>
                <label className="font-medium text-ink-700 block mb-1">Guardian Phone</label>
                <input
                  type="text"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  className="w-full border border-ink-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-cobalt-300"
                />
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-150">
            <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving Changes...' : 'Save Changes \u2713'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
