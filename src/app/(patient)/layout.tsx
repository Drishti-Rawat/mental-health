'use client';

import React from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Sidebar, { SidebarItem } from '@/components/layout/Sidebar';
import { LayoutDashboard, Calendar, Stethoscope, User } from 'lucide-react';

const patientSidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Book Session', href: '/book', icon: Calendar },
  { name: 'My Bookings', href: '/my-bookings', icon: Calendar },
  { name: 'My Profile', href: '/profile', icon: User },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="relative min-h-screen bg-slate-50/60 lg:flex lg:flex-row">
        <Sidebar items={patientSidebarItems} />
        <main className="flex-1 min-w-0 pl-16 lg:pl-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
