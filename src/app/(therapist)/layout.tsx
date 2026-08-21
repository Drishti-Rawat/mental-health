'use client';

import React from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Sidebar, { SidebarItem } from '@/components/layout/Sidebar';
import { LayoutDashboard, Calendar, Users, User } from 'lucide-react';

const therapistSidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/therapist/dashboard', icon: LayoutDashboard },
  { name: 'Schedule', href: '/therapist/schedule', icon: Calendar },
  { name: 'Clients', href: '/therapist/clients', icon: Users },
  { name: 'Profile & Practice', href: '/therapist/profile', icon: User },
];

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['therapist']}>
      <div className="relative min-h-screen bg-slate-50/60 lg:flex lg:flex-row">
        <Sidebar items={therapistSidebarItems} />
        <main className="flex-1 min-w-0 pl-16 lg:pl-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
