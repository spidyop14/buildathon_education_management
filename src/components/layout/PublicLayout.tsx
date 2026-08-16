import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '@/components/layout/PublicNavbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white font-body text-ink-900 selection:bg-cobalt-100 flex flex-col justify-between">
      {/* SINGLE REUSABLE PUBLIC NAVBAR */}
      <PublicNavbar />

      {/* PUBLIC PAGE CONTENT OUTLET */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
