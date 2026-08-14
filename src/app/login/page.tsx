'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, AlertCircle, Mail, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, smart redirect based on role
  if (user) {
    if (user.role === 'therapist') {
      router.push('/therapist/dashboard');
    } else if (['admin', 'supervisor', 'superadmin'].includes(user.role)) {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const loggedInUser = await login({
        email: formData.email,
        password: formData.password,
      });

      if (loggedInUser.role === 'therapist') {
        router.push('/therapist/dashboard');
      } else if (['admin', 'supervisor', 'superadmin'].includes(loggedInUser.role)) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Patient Portal"
      badgeIcon={UserCheck}
      panelTitle="Your Journey to Peace of Mind Begins Here"
      panelDescription="Access expert mental health consultations, track your wellness progress, and book confidential therapy sessions with licensed professionals."
      features={[
        'Encrypted Patient Data Privacy',
        'Licensed CBT & Mindfulness Specialists',
        'Flexible Online Session Booking',
      ]}
      formTitle="Welcome Back"
      formSubtitle="Sign in to access your mental care dashboard"
    >
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary text-sm bg-slate-50/40 transition placeholder:text-slate-400 font-medium text-foreground"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
              Password
            </label>
            <a href="#" className="text-xs text-secondary font-semibold hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary text-sm bg-slate-50/40 transition placeholder:text-slate-400 font-medium text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-secondary text-white font-bold text-sm shadow-md hover:bg-secondary/90 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing In...</span>
            </div>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-3 border-t border-slate-100 space-y-2">
        <p className="text-sm text-secondary">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-secondary hover:underline">
            Create Account
          </Link>
        </p>
        <p className="text-xs text-slate-500">
          Are you a Clinical Practitioner?{' '}
          <Link href="/therapist/login" className="font-bold text-secondary hover:underline">
            Practitioner Login Portal →
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
