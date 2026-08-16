import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';

interface TeacherProfileState {
  fullName: string;
  email: string;
  department: string;
  title: string;
  facultyId: string;
  phone: string;
  officeHours: string;
  bio: string;
  avatar: string;
}

const PROFILE_KEY = 'eduiq_teacher_profile';

const DEFAULT_PROFILE: TeacherProfileState = {
  fullName: 'Dr. Elena Marsh',
  email: 'dr.marsh@eduiq.edu',
  department: 'Computer Science & Mathematics',
  title: 'Associate Professor',
  facultyId: 'FAC-2026-08',
  phone: '+1 (555) 392-0194',
  officeHours: 'Mon/Wed 02:00 PM - 04:00 PM (Room B204)',
  bio: 'Specializing in data wrangling, machine learning, and differential calculus. Dedicated to actionable academic insights.',
  avatar: '',
};

export default function TeacherProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'teaching' | 'preferences' | 'security'>('personal');

  const [profileData, setProfileData] = useState<TeacherProfileState>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading teacher profile:', e);
    }
    return {
      ...DEFAULT_PROFILE,
      fullName: user?.name || DEFAULT_PROFILE.fullName,
      email: user?.email || DEFAULT_PROFILE.email,
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 font-body max-w-5xl mx-auto">
      {/* HEADER BAR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-150 shadow-card flex items-center justify-between gap-4">
        <div>
          <Badge tone="cobalt" className="px-3 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
            FACULTY PROFILE WORKSPACE
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-950 mt-1">
            Account & Faculty Preferences
          </h2>
          <p className="text-xs sm:text-sm text-ink-500">
            Manage your personal profile, office hours, teaching credentials, and workspace settings.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-xs font-bold text-sage-900 flex items-center gap-2">
          <Icon name="check" size={16} className="text-sage-600 font-bold" />
          <span>Faculty profile updated and saved to local storage!</span>
        </div>
      )}

      {/* FULL ACCOUNT WORKSPACE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* IDENTITY SIDEBAR (4 COLS) */}
        <Card className="md:col-span-4 p-6 bg-white border border-ink-150 shadow-card rounded-3xl space-y-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-24 h-24 rounded-full bg-cobalt-100 border-2 border-cobalt-300 flex items-center justify-center overflow-hidden shadow-xs">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display font-bold text-3xl text-cobalt-800">
                  {profileData.fullName.charAt(0)}
                </span>
              )}
            </div>

            <label className="text-xs font-bold text-cobalt-600 hover:text-cobalt-800 cursor-pointer pt-1">
              <span>Change Photo</span>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>

            <div>
              <h3 className="font-display font-bold text-lg text-ink-950">{profileData.fullName}</h3>
              <p className="text-xs text-ink-500 font-medium">{profileData.title}</p>
              <span className="text-[10px] font-mono text-cobalt-600 bg-cobalt-50 px-2.5 py-0.5 rounded-md inline-block mt-1">
                {profileData.facultyId}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-ink-50 border border-ink-150 text-left text-xs space-y-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-ink-400 uppercase">Department</span>
              <div className="font-bold text-ink-950">{profileData.department}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-ink-400 uppercase">Office Hours</span>
              <div className="font-medium text-ink-700 text-[11px]">{profileData.officeHours}</div>
            </div>
          </div>
        </Card>

        {/* PROFILE EDIT WORKSPACE (8 COLS) */}
        <Card className="md:col-span-8 p-6 sm:p-8 bg-white border border-ink-150 shadow-card rounded-3xl space-y-6">
          {/* TABS */}
          <div className="flex items-center gap-2 border-b border-ink-150 pb-3">
            {(['personal', 'teaching', 'preferences', 'security'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeTab === tab ? 'bg-ink-950 text-white shadow-xs' : 'text-ink-600 hover:bg-ink-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleSave} className="space-y-4 text-xs font-medium">
            {activeTab === 'personal' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ink-700 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full h-11 border border-ink-200 rounded-2xl px-4 text-xs focus:ring-2 focus:ring-cobalt-300"
                    />
                  </div>

                  <div>
                    <label className="block text-ink-700 font-semibold mb-1">Academic Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full h-11 border border-ink-200 rounded-2xl px-4 text-xs focus:ring-2 focus:ring-cobalt-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ink-700 font-semibold mb-1">Faculty Title</label>
                    <input
                      type="text"
                      value={profileData.title}
                      onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                      className="w-full h-11 border border-ink-200 rounded-2xl px-4 text-xs focus:ring-2 focus:ring-cobalt-300"
                    />
                  </div>

                  <div>
                    <label className="block text-ink-700 font-semibold mb-1">Phone Contact</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full h-11 border border-ink-200 rounded-2xl px-4 text-xs focus:ring-2 focus:ring-cobalt-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-ink-700 font-semibold mb-1">Biography</label>
                  <textarea
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full border border-ink-200 rounded-2xl p-3 text-xs focus:ring-2 focus:ring-cobalt-300"
                  />
                </div>
              </>
            )}

            {activeTab === 'teaching' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-ink-700 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    className="w-full h-11 border border-ink-200 rounded-2xl px-4 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-ink-700 font-semibold mb-1">Office Hours Schedule & Location</label>
                  <input
                    type="text"
                    value={profileData.officeHours}
                    onChange={(e) => setProfileData({ ...profileData, officeHours: e.target.value })}
                    className="w-full h-11 border border-ink-200 rounded-2xl px-4 text-xs"
                  />
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-ink-50 border border-ink-150 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-cobalt-600 rounded w-4 h-4" />
                  <span>Receive immediate email notifications for late assignment submissions</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-ink-50 border border-ink-150 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-cobalt-600 rounded w-4 h-4" />
                  <span>Enable EduIQ AI automated threshold alerts for attendance drops</span>
                </label>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-3 pt-1">
                <div className="p-4 rounded-2xl bg-cobalt-50/70 border border-cobalt-200 text-xs">
                  <span className="font-bold text-cobalt-950 block">Session Security</span>
                  <p className="text-ink-700 leading-relaxed text-[11px] mt-0.5">
                    Your session is encrypted and authenticated via EduIQ Dual-Mode Security.
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" variant="accent" className="w-full h-12 rounded-2xl shadow-glow text-sm font-semibold">
              Save Profile Changes &rarr;
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
