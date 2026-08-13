'use client';

import React from 'react';
import ProtectedRoute from '../../components/layout/ProtectedRoute';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {children}
      </div>
    </ProtectedRoute>
  );
}
