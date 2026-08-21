'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, AlertCircle, Mail, Lock, Eye, EyeOff, UserCheck, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';

export default function RegisterPage() {
  const { register, user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, smart redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'therapist') {
        router.push('/therapist/dashboard');
      } else if (['admin', 'supervisor', 'superadmin'].includes(user.role)) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user',
      });

      if (res.user && res.user.status === 'active') {
        router.push('/dashboard');
      } else {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your inputs and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Patient Registration"
      badgeIcon={UserCheck}
      panelTitle="Begin Your Wellness Journey Today"
      panelDescription="Join thousands of individuals taking proactive steps towards better mental health with personalized care plans and top specialists."
      features={[
        'Personalized Mental Health Matching',
        'Confidential & Secure Consultations',
        '24/7 Access to Care Resources',
      ]}
      formTitle="Create Account"
      formSubtitle="Sign up to start your therapy and consultation journey"
    >
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {successMessage ? (
        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-4 animate-in fade-in duration-200 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950">Registration Successful!</h3>
          <p className="text-sm text-emerald-800">{successMessage}</p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary text-sm bg-slate-50/40 transition placeholder:text-slate-400 font-medium text-foreground"
              />
            </div>
          </div>

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
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              Password
            </label>
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
            <p className="mt-1 text-[11px] text-slate-400">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-secondary text-white font-bold text-sm shadow-md hover:bg-secondary/90 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-sm text-secondary">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-secondary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
