'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../services/authApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Unauthenticated -> Redirect to login page
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Authenticated but unauthorized role -> Redirect to appropriate dashboard
        if (user.role === 'therapist') {
          router.push('/therapist/dashboard');
        } else if (['admin', 'supervisor', 'superadmin'].includes(user.role)) {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-secondary font-medium text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Prevents flash before redirect
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null; // Prevents flash before redirect
  }

  return <>{children}</>;
}
