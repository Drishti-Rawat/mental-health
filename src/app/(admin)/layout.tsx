'use client';

import ProtectedRoute from '../../components/layout/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'supervisor', 'superadmin']}>
      {children}
    </ProtectedRoute>
  );
}
