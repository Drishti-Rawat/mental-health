'use client';

import React from 'react';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import Sidebar, { SidebarItem } from '../../components/layout/Sidebar';
import { LayoutDashboard, Users, Stethoscope, FileText, Settings } from 'lucide-react';

const adminSidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Psychologists', href: '/admin/psychologists', icon: Stethoscope },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'supervisor', 'superadmin']}>
      <div className="relative min-h-screen bg-slate-50/60 lg:flex lg:flex-row">
        <Sidebar items={adminSidebarItems} />
        <main className="flex-1 min-w-0 pl-16 lg:pl-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
