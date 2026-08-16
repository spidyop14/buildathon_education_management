import React, { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import type { AuthUser, UserRole } from '@/types';
import {
  registerUser,
  loginUser,
  loginWithOAuth,
  logoutUser,
  getStoredDemoSession,
  setStoredDemoSession,
  type RegistrationDetails,
} from '@/services/authService';

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  register: (details: RegistrationDetails) => Promise<{ user: AuthUser; needsEmailVerification: boolean }>;
  signInWithOAuth: (provider: 'google' | 'azure', role: UserRole) => Promise<AuthUser | void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredDemoSession());
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate user session from Supabase or Local Demo Session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // If Supabase configured, check active session
      if (supabase && isSupabaseConfigured) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const meta = data.session.user.user_metadata || {};
            const role: UserRole = meta.role === 'teacher' || meta.role === 'admin' ? meta.role : 'student';
            const cloudUser: AuthUser = {
              id: data.session.user.id,
              name: meta.full_name || meta.name || data.session.user.email?.split('@')[0] || 'EduIQ User',
              email: data.session.user.email || '',
              role,
              department: meta.department,
              academicYear: meta.academic_year,
              facultyId: meta.faculty_id,
            };
            if (mounted) {
              setUser(cloudUser);
              setStoredDemoSession(cloudUser);
            }
          }
        } catch (e) {
          console.error('Failed to restore Supabase session:', e);
        }
      }

      if (mounted) {
        setIsLoading(false);
      }
    }

    void initAuth();

    if (supabase && isSupabaseConfigured) {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session?.user) {
          setUser(null);
          setStoredDemoSession(null);
        } else {
          const meta = session.user.user_metadata || {};
          const role: UserRole = meta.role === 'teacher' || meta.role === 'admin' ? meta.role : 'student';
          const cloudUser: AuthUser = {
            id: session.user.id,
            name: meta.full_name || meta.name || session.user.email?.split('@')[0] || 'EduIQ User',
            email: session.user.email || '',
            role,
            department: meta.department,
            academicYear: meta.academic_year,
            facultyId: meta.faculty_id,
          };
          setUser(cloudUser);
          setStoredDemoSession(cloudUser);
        }
      });
      return () => listener.subscription.unsubscribe();
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const authUser = await loginUser(email, password);
    setUser(authUser);
    return authUser;
  }, []);

  const register = useCallback(async (details: RegistrationDetails) => {
    const result = await registerUser(details);
    setUser(result.user);
    return result;
  }, []);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'azure', role: UserRole) => {
    const res = await loginWithOAuth(provider, role);
    if (res) {
      setUser(res);
      return res;
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isConfigured: isSupabaseConfigured,
        signIn,
        register,
        signInWithOAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
