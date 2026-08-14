'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  UserCheck,
  ArrowRight,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Check,
  Building2,
  ShieldAlert,
} from 'lucide-react';
import { registerAdminApi } from '../../../services/adminApi';

export default function AdminSignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'supervisor' as 'supervisor' | 'admin',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const res = await registerAdminApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const roleLabels: Record<string, string> = {
        supervisor: 'Supervisor',
        admin: 'Admin',
      };

      setSuccessMessage(
        res.message ||
          `Your ${roleLabels[formData.role]} application has been submitted successfully! An administrator will review your credentials before account activation.`
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Application submission failed. Please check your inputs and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white">
      
      {/* Left Side: Full-Bleed Administrative Panel (Visible on LG screens) */}
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-tertiary text-xs font-semibold border border-white/15">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Administrative Operations Portal</span>
            </div>

            <h2 className="font-serif text-3xl xl:text-4xl font-bold leading-tight tracking-tight text-white pt-2">
              Management & Operations Portal
            </h2>

            <p className="text-white/80 text-sm leading-relaxed max-w-md">
              Apply for Supervisor or Admin role credentials. All administrative accounts undergo credential verification before activation.
            </p>
          </div>
        </div>

        {/* Bottom Feature List */}
        <div className="relative z-10 space-y-4 pt-8 border-t border-white/15">
          <div className="flex items-center gap-3 text-xs text-white/90 font-medium">
            <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0" />
            <span>Strict Administrative Credential Verification</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/90 font-medium">
            <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0" />
            <span>Role-Based Operational Access Control</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/90 font-medium">
            <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0" />
            <span>System Auditing & Platform Management</span>
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
        <div className="max-w-md mx-auto w-full space-y-6 my-auto py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Administrative Signup
            </h1>
            <p className="text-sm text-secondary mt-1">
              Select your role and request administrative access
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {successMessage ? (
            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">Application Submitted!</h3>
              <p className="text-sm text-emerald-800 leading-relaxed">{successMessage}</p>
              <div className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition"
                >
                  <span>Go to Admin Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Role Requested Selection Cards: Supervisor, Admin */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2.5">
                  Requested Administrative Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Supervisor Card */}
                  <div
                    onClick={() => setFormData({ ...formData, role: 'supervisor' })}
                    className={`relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                      formData.role === 'supervisor'
                        ? 'border-secondary bg-secondary/5 ring-2 ring-secondary/20 shadow-xs'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      formData.role === 'supervisor' ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">Supervisor</span>
                        {formData.role === 'supervisor' && (
                          <div className="w-4 h-4 rounded-full bg-secondary text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-secondary truncate mt-0.5">Clinical Operations</p>
                    </div>
                  </div>

                  {/* Admin Card */}
                  <div
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                      formData.role === 'admin'
                        ? 'border-secondary bg-secondary/5 ring-2 ring-secondary/20 shadow-xs'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      formData.role === 'admin' ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">Admin</span>
                        {formData.role === 'admin' && (
                          <div className="w-4 h-4 rounded-full bg-secondary text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-secondary truncate mt-0.5">System Administration</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
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
                    placeholder="Alex Morgan"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary text-sm bg-slate-50/40 transition placeholder:text-slate-400 font-medium text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Work Email Address
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
                    placeholder="alex@mentalcare.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary text-sm bg-slate-50/40 transition placeholder:text-slate-400 font-medium text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
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
                    <span>Submitting Application...</span>
                  </div>
                ) : (
                  <>
                    <span>Request {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-sm text-secondary">
              Already an approved administrator?{' '}
              <Link href="/admin/login" className="font-bold text-secondary hover:underline">
                Sign in to Admin Portal
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-400 text-center">
          © MentalCare Administrative Portal. All rights reserved.
        </div>
      </div>

    </div>
  );
}
