import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import type { AuthUser, UserRole } from '@/types';

export type RegistrationDetails = {
  name: string;
  email: string;
  password: string;
  role: UserRole; // 'student' | 'teacher' | 'admin'
  department: string;
  academicYear?: string;
  facultyId?: string;
};

const DEMO_USERS_KEY = 'eduiq_demo_users';
const DEMO_SESSION_KEY = 'eduiq_demo_session';

// Preset fallback demo accounts for instant testing
const DEFAULT_DEMO_USERS: AuthUser[] = [
  {
    id: 'demo-student-maya',
    name: 'Maya Whitfield',
    email: 'maya.whitfield@eduiq.edu',
    role: 'student',
    department: 'Computer Science',
    academicYear: 'Junior',
  },
  {
    id: 'demo-teacher-marsh',
    name: 'Dr. Elena Marsh',
    email: 'dr.marsh@eduiq.edu',
    role: 'teacher',
    department: 'Computer Science',
    facultyId: 'FAC-2026-08',
  },
  {
    id: 'demo-admin-system',
    name: 'System Administrator',
    email: 'admin@eduiq.edu',
    role: 'admin',
    department: 'Administration',
  },
];

function getLocalDemoUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(DEMO_USERS_KEY);
    if (!raw) return DEFAULT_DEMO_USERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? [...DEFAULT_DEMO_USERS, ...parsed] : DEFAULT_DEMO_USERS;
  } catch (e) {
    console.error('Failed to parse local demo users:', e);
    return DEFAULT_DEMO_USERS;
  }
}

function saveLocalDemoUser(user: AuthUser) {
  try {
    const users = getLocalDemoUsers();
    const filtered = users.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase());
    filtered.push(user);
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to save local demo user:', e);
  }
}

export function getStoredDemoSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch (e) {
    console.error('Failed to read local demo session:', e);
    return null;
  }
}

export function setStoredDemoSession(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(DEMO_SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to update local demo session:', e);
  }
}

export async function registerUser(details: RegistrationDetails): Promise<{ user: AuthUser; needsEmailVerification: boolean }> {
  // Mode A: Cloud Database via Supabase
  if (supabase && isSupabaseConfigured) {
    const metadata = {
      full_name: details.name,
      role: details.role,
      department: details.department,
      academic_year: details.academicYear || null,
      faculty_id: details.facultyId || null,
    };

    const { data, error } = await supabase.auth.signUp({
      email: details.email,
      password: details.password,
      options: { data: metadata, emailRedirectTo: `${window.location.origin}/login` },
    });

    if (error) {
      console.error('Supabase registration error:', error);
      if (/already registered|already exists/i.test(error.message)) {
        throw new Error('An account already exists for this email address.');
      }
      throw new Error('Could not create your account. Please check your details and try again.');
    }

    const createdUser: AuthUser = {
      id: data.user?.id || `user-${Date.now()}`,
      name: details.name,
      email: details.email,
      role: details.role,
      department: details.department,
      academicYear: details.academicYear,
      facultyId: details.facultyId,
    };

    if (data.session) {
      setStoredDemoSession(createdUser);
    }

    return { user: createdUser, needsEmailVerification: !data.session };
  }

  // Mode B: Local Demo Mode
  const existingUsers = getLocalDemoUsers();
  const duplicate = existingUsers.find((u) => u.email.toLowerCase() === details.email.trim().toLowerCase());
  if (duplicate) {
    throw new Error('An account already exists for this email address.');
  }

  const localUser: AuthUser = {
    id: `user-demo-${Date.now()}`,
    name: details.name.trim(),
    email: details.email.trim(),
    role: details.role,
    department: details.department,
    academicYear: details.academicYear,
    facultyId: details.facultyId,
  };

  saveLocalDemoUser(localUser);
  setStoredDemoSession(localUser);

  return { user: localUser, needsEmailVerification: false };
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const cleanEmail = email.trim().toLowerCase();

  // Mode A: Cloud Database via Supabase
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    if (error || !data.user) {
      console.error('Supabase signIn error:', error);
      throw new Error('Invalid email or password. Please try again.');
    }

    const metadata = data.user.user_metadata || {};
    const role: UserRole = metadata.role === 'teacher' || metadata.role === 'admin' ? metadata.role : 'student';

    const authUser: AuthUser = {
      id: data.user.id,
      name: metadata.full_name || metadata.name || data.user.email?.split('@')[0] || 'EduIQ User',
      email: data.user.email || cleanEmail,
      role,
      department: metadata.department,
      academicYear: metadata.academic_year,
      facultyId: metadata.faculty_id,
    };

    setStoredDemoSession(authUser);
    return authUser;
  }

  // Mode B: Local Demo Mode
  const users = getLocalDemoUsers();
  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (found) {
    setStoredDemoSession(found);
    return found;
  }

  // Infer role if user enters a new demo email
  const inferredRole: UserRole = cleanEmail.includes('teacher') ? 'teacher' : cleanEmail.includes('admin') ? 'admin' : 'student';
  const inferredName = cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'EduIQ User';

  const demoUser: AuthUser = {
    id: `user-demo-${Date.now()}`,
    name: inferredName,
    email: cleanEmail,
    role: inferredRole,
    department: 'Computer Science',
    academicYear: inferredRole === 'student' ? 'Junior' : undefined,
    facultyId: inferredRole === 'teacher' ? 'FAC-DEMO-01' : undefined,
  };

  saveLocalDemoUser(demoUser);
  setStoredDemoSession(demoUser);
  return demoUser;
}

export async function loginWithOAuth(provider: 'google' | 'azure', role: UserRole): Promise<AuthUser | void> {
  // Mode A: Cloud Database via Supabase OAuth
  if (supabase && isSupabaseConfigured) {
    localStorage.setItem('eduiq_pending_oauth_role', role);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/login` },
    });
    if (error) {
      console.error('Supabase OAuth error:', error);
      localStorage.removeItem('eduiq_pending_oauth_role');
      throw new Error(`Unable to complete ${provider} sign in.`);
    }
    return;
  }

  // Mode B: Local Demo OAuth Flow
  const providerTitle = provider === 'google' ? 'Google' : 'Microsoft';
  const roleTitle = role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Educator' : 'Student';
  const demoOAuthUser: AuthUser = {
    id: `user-oauth-${provider}-${Date.now()}`,
    name: `${providerTitle} ${roleTitle} User`,
    email: `${role}.${provider}@eduiq.edu`,
    role,
    department: role === 'admin' ? 'Administration' : 'Computer Science',
    academicYear: role === 'student' ? 'Junior' : undefined,
    facultyId: role === 'teacher' ? 'FAC-OAUTH-01' : undefined,
  };

  saveLocalDemoUser(demoOAuthUser);
  setStoredDemoSession(demoOAuthUser);
  return demoOAuthUser;
}

export async function logoutUser() {
  if (supabase && isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase signOut error:', e);
    }
  }
  setStoredDemoSession(null);
}
