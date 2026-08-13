'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, AlertCircle, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

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

      // Smart role routing
      if (loggedInUser.role === 'therapist') {
        router.push('/therapist/dashboard');
      } else if (['admin', 'supervisor', 'superadmin'].includes(loggedInUser.role)) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white">
      
      {/* Left Side: Full-Bleed Therapeutic Branding Panel (Visible on LG screens) */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary via-primary/95 to-secondary p-10 xl:p-14 flex-col justify-between text-white relative overflow-hidden min-h-screen">
        {/* Ambient Lighting Blurs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-tertiary/20 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/30 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none"></div>

        {/* Top-Left Brand Logo */}
        <div className="relative z-10 space-y-6">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-bold tracking-tight text-white">
              MentalCare
            </span>
          </Link>

          <div className="space-y-3">
            <h2 className="font-serif text-3xl xl:text-4xl font-bold leading-tight tracking-tight text-white pt-2">
              Your Mental Health Journey Begins Here
            </h2>

            <p className="text-white/80 text-sm leading-relaxed max-w-md">
              Safe, confidential, and professional therapy sessions designed for your daily wellbeing.
            </p>
          </div>
        </div>

        {/* Bottom Feature List */}
        <div className="relative z-10 space-y-4 pt-8 border-t border-white/15">
          <div className="flex items-center gap-3 text-xs text-white/90 font-medium">
            <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0" />
            <span>100% Encrypted & Confidential Consultations</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/90 font-medium">
            <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0" />
            <span>Licensed & Verified Clinical Therapists</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/90 font-medium">
            <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0" />
            <span>Seamless Scheduling & Care Management</span>
          </div>
        </div>
      </div>

      {/* Right Side: Form Container */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen bg-white">
        
        {/* Top Mobile Brand Logo (Visible ONLY on mobile/small screens < lg) */}
        <div className="w-full flex items-center justify-between lg:hidden">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              MentalCare
            </span>
          </Link>
        </div>

        {/* Vertically Centered Form Box */}
        <div className="max-w-md mx-auto w-full space-y-8 my-auto py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-secondary mt-1.5">
              Sign in to manage your appointments and sessions
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  placeholder="name@example.com"
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
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-sm text-secondary">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-secondary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-400 text-center">
          © MentalCare Platform. All rights reserved.
        </div>
      </div>

    </div>
  );
}
