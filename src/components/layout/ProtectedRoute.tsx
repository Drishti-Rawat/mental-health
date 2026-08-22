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
      // Portal-aware redirection
      let targetLogin = '/login';
      if (allowedRoles?.includes('therapist') && !allowedRoles?.includes('user')) {
        targetLogin = '/therapist/login';
      } else if (allowedRoles?.includes('admin') || allowedRoles?.includes('supervisor')) {
        targetLogin = '/admin/login';
      }

      if (!user) {
        // Unauthenticated -> Redirect to appropriate portal login
        router.push(targetLogin);
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role mismatch -> Redirect to portal login
        router.push(targetLogin);
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
