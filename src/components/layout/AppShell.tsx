import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useStudentProfile } from '@/lib/profileStore';
import { Icon } from '@/components/ui/Icon';
import { EduIQLogo } from '@/components/ui/EduIQLogo';
import { CommandPaletteModal } from '@/components/workspace/CommandPaletteModal';
import { ContextualAIDrawer } from '@/components/workspace/ContextualAIDrawer';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { HelpModal } from '@/components/onboarding/HelpModal';
import { InteractiveProductTour } from '@/components/onboarding/InteractiveProductTour';
import { FirstVisitPrompt } from '@/components/onboarding/FirstVisitPrompt';
import { cn } from '@/lib/utils';
import { IconName, UserRole } from '@/types';

interface NavGroup {
  label: string;
  items: { key: string; label: string; icon: IconName; path: string }[];
}

const NAV_GROUPS: Record<UserRole, NavGroup[]> = {
  student: [
    {
      label: 'Overview',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: 'home', path: '/student/dashboard' },
        { key: 'schedule', label: 'My Schedule', icon: 'calendar', path: '/student/schedule' },
      ],
    },
    {
      label: 'Learning',
      items: [
        { key: 'courses', label: 'Courses', icon: 'book', path: '/student/courses' },
        { key: 'assignments', label: 'Assignments', icon: 'file', path: '/student/assignments' },
        { key: 'attendance', label: 'Attendance', icon: 'clock', path: '/student/attendance' },
        { key: 'examinations', label: 'Examinations', icon: 'clipboard', path: '/student/examinations' },
        { key: 'planner', label: 'Study Planner', icon: 'sparkles', path: '/student/planner' },
      ],
    },
    {
      label: 'Insights',
      items: [
        { key: 'progress', label: 'Progress', icon: 'chart', path: '/student/progress' },
        { key: 'ai-insights', label: 'Academic Intelligence', icon: 'sparkles', path: '/student/intelligence' },
      ],
    },
    {
      label: 'Account',
      items: [{ key: 'profile', label: 'Profile', icon: 'user', path: '/student/profile' }],
    },
  ],
  teacher: [
    {
      label: 'Overview',
      items: [{ key: 'dashboard', label: 'Dashboard', icon: 'home', path: '/teacher/dashboard' }],
    },
    {
      label: 'Teaching',
      items: [
        { key: 'courses', label: 'Assigned Courses', icon: 'book', path: '/teacher/courses' },
        { key: 'classes', label: 'Classes', icon: 'users', path: '/teacher/classes' },
        { key: 'assignments', label: 'Assignments', icon: 'file', path: '/teacher/assignments' },
        { key: 'submissions', label: 'Submissions', icon: 'check', path: '/teacher/submissions' },
        { key: 'examinations', label: 'Examinations', icon: 'clipboard', path: '/teacher/examinations' },
      ],
    },
    {
      label: 'Classroom',
      items: [
        { key: 'attendance', label: 'Attendance', icon: 'calendar', path: '/teacher/attendance' },
        { key: 'students', label: 'Students', icon: 'cap', path: '/teacher/students' },
      ],
    },
    {
      label: 'Intelligence',
      items: [{ key: 'insights', label: 'Academic Insights', icon: 'sparkles', path: '/teacher/insights' }],
    },
    {
      label: 'Account',
      items: [{ key: 'profile', label: 'Profile', icon: 'user', path: '/teacher/profile' }],
    },
  ],
  admin: [
    {
      label: 'Overview',
      items: [{ key: 'dashboard', label: 'Dashboard', icon: 'home', path: '/admin/dashboard' }],
    },
    {
      label: 'Management',
      items: [
        { key: 'students', label: 'Students', icon: 'users', path: '/admin/students' },
        { key: 'teachers', label: 'Teachers', icon: 'users', path: '/admin/teachers' },
        { key: 'courses', label: 'Courses', icon: 'book', path: '/admin/courses' },
        { key: 'classes', label: 'Class Sections', icon: 'users', path: '/admin/classes' },
      ],
    },
    {
      label: 'Analytics',
      items: [
        { key: 'analytics', label: 'Analytics', icon: 'chart', path: '/admin/analytics' },
        { key: 'ai-insights', label: 'AI Insights', icon: 'sparkles', path: '/admin/ai-insights' },
      ],
    },
    {
      label: 'System',
      items: [
        { key: 'examinations', label: 'Examinations', icon: 'clipboard', path: '/admin/examinations' },
        { key: 'reports', label: 'Reports', icon: 'file', path: '/admin/reports' },
      ],
    },
  ],
};

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  '/teacher/dashboard': { title: 'Teacher Workspace Dashboard', description: 'Intelligent classroom health & task metrics' },
  '/teacher/courses': { title: 'Assigned Courses', description: 'Your teaching portfolio & curriculum outlines' },
  '/teacher/classes': { title: 'Class Timeline & Schedules', description: 'Real-time room schedules & attendance blocks' },
  '/teacher/assignments': { title: 'Assignments Workspace', description: 'Manage coursework, due dates, & progress' },
  '/teacher/submissions': { title: 'Submissions & Grading Review', description: 'Evaluate coursework with AI grading assistance' },
  '/teacher/examinations': { title: 'Examination Control Center', description: 'MCQ assessment builder & score distributions' },
  '/teacher/attendance': { title: 'Classroom Attendance Portal', description: 'Log student presence & track threshold trends' },
  '/teacher/students': { title: 'Student Intelligence Roster', description: 'Student performance trajectories & risk interventions' },
  '/teacher/insights': { title: 'Academic Intelligence Pulse', description: 'Synthesis of performance, attendance, & exams' },
  '/teacher/profile': { title: 'Educator Profile & Workspace', description: 'Manage account preferences & faculty details' },
};

export const AppShell: React.FC = () => {
  const { user, logout } = useAuth();
  const { profile } = useStudentProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [forceOnboarding, setForceOnboarding] = useState(false);
  const role = user?.role || 'student';
  const tourKey = `eduiq_interactive_tour_completed_${role}`;

  const [tourActive, setTourActive] = useState(() => {
    try {
      return !localStorage.getItem(`eduiq_interactive_tour_completed_${role}`);
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      const completed = localStorage.getItem(tourKey);
      if (!completed) {
        setTourActive(true);
      }
    } catch (e) {}
  }, [role, tourKey]);

  const handleFinishTour = () => {
    try {
      localStorage.setItem(tourKey, 'true');
    } catch (e) {}
    setTourActive(false);
  };
  const navGroups = NAV_GROUPS[role];
  const currentPageInfo = PAGE_TITLES[location.pathname] || { title: 'Workspace', description: 'EduIQ Academic OS' };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-ink-150">
      {/* BRAND & COLLAPSE TOGGLE */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-ink-150 shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <EduIQLogo size={26} />
          {!collapsed && (
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cobalt-600 bg-cobalt-50 px-2 py-0.5 rounded-md border border-cobalt-100">
              {role}
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 text-ink-400 hover:text-ink-900 rounded-lg hover:bg-ink-100 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name="chevron" size={16} className={collapsed ? 'rotate-180' : ''} />
        </button>
      </div>

      {/* NAVIGATION GROUPS */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 px-2">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-400">
                {group.label}
              </div>
            )}
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <button
                    key={item.key}
                    data-tour={item.key}
                    onClick={() => navigate(item.path)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative group text-left",
                      isActive
                        ? "bg-cobalt-50/80 text-cobalt-950 border border-cobalt-200/80 shadow-xs"
                        : "text-ink-600 hover:text-ink-950 hover:bg-ink-50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-border"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cobalt-600 rounded-r-full"
                      />
                    )}
                    <Icon
                      name={item.icon}
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-cobalt-600" : "text-ink-400 group-hover:text-ink-700"
                      )}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* USER FOOTER */}
      <div className="p-3 border-t border-ink-150 shrink-0 bg-ink-50/50" data-tour="profile">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-ink-150 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-cobalt-100 text-cobalt-800 font-bold text-xs flex items-center justify-center shrink-0 border border-cobalt-300">
            {(role === 'student' ? profile.fullName : user?.name || 'User').charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-ink-950 truncate">
                {role === 'student' ? profile.fullName : user?.name || 'User'}
              </div>
              <div className="text-[10px] text-ink-500 capitalize truncate font-mono">
                {user?.department || `${role} workspace`}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-1.5 text-ink-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Sign out"
          >
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FAFBFD] font-body text-ink-900 overflow-hidden">
      {/* COMMAND PALETTE, AI DRAWERS & MANDATORY INTERACTIVE PRODUCT TOUR */}
      <CommandPaletteModal open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <ContextualAIDrawer open={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
      <HelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        onReplayIntro={() => setTourActive(true)}
      />
      <InteractiveProductTour active={tourActive} onFinish={handleFinishTour} />

      {/* Desktop Sidebar */}
      <aside className={cn("hidden md:flex flex-col h-full shrink-0 transition-all duration-300", collapsed ? "w-16" : "w-64")}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* CONTEXTUAL TOP BAR */}
        <header className="h-16 bg-white border-b border-ink-150 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-ink-600 hover:text-ink-950 rounded-xl hover:bg-ink-100"
            >
              <Icon name="menu" size={20} />
            </button>
            <div>
              <h1 className="font-display font-bold text-base text-ink-950 leading-tight">
                {currentPageInfo.title}
              </h1>
              <p className="text-xs text-ink-500 leading-tight hidden sm:block">
                {currentPageInfo.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* COMMAND PALETTE BUTTON */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="h-10 px-3.5 rounded-2xl bg-ink-50 border border-ink-200 hover:bg-ink-100 text-ink-600 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <Icon name="search" size={15} />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-white border border-ink-200 font-mono text-[10px] text-ink-500">
                ⌘K
              </kbd>
            </button>

            {/* AI COPILOT BUTTON */}
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="h-10 px-3.5 rounded-2xl bg-cobalt-50 border border-cobalt-200 hover:bg-cobalt-100 text-cobalt-950 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <Icon name="sparkles" size={15} className="text-cobalt-600" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* HELP & ONBOARDING REPLAY BUTTON */}
            <button
              onClick={() => setHelpOpen(true)}
              className="p-2.5 text-ink-500 hover:text-ink-950 rounded-2xl hover:bg-ink-100 transition-colors"
              title="EduIQ Product Guide & Intro"
            >
              <Icon name="help" size={18} />
            </button>

            {/* NOTIFICATIONS */}
            <button className="relative p-2.5 text-ink-500 hover:text-ink-950 rounded-2xl hover:bg-ink-100 transition-colors">
              <Icon name="bell" size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
