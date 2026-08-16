import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRole: UserRole;
}

/**
 * Route guard that ensures the user is authenticated
 * and has the correct role to access the route.
 */
export function RoleGuard({ allowedRole }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-ink-500">Restoring your secure session…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== allowedRole) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return <Outlet />;
}
