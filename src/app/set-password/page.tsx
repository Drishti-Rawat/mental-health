'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { verifyInviteTokenApi, setPasswordWithTokenApi } from '@/services/psychologistApi';

function SetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState<boolean>(true);
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const [practitioner, setPractitioner] = useState<{ name: string; email: string; title: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successActivated, setSuccessActivated] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setErrorMessage('No invitation token provided in the URL link.');
      return;
    }

    const checkToken = async () => {
      try {
        const res = await verifyInviteTokenApi(token);
        if (res.success && res.valid) {
          setTokenValid(true);
          if (res.practitioner) {
            setPractitioner(res.practitioner);
          }
        } else {
          setErrorMessage(res.message || 'Invitation token is invalid or has expired.');
        }
      } catch (err: any) {
        setErrorMessage(err.response?.data?.message || 'Invitation token is invalid or has expired.');
      } finally {
        setVerifying(false);
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your entries.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await setPasswordWithTokenApi(token, password);
      if (res.success) {
        setSuccessActivated(true);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to set password. Link may be expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-[#07241F] flex items-center justify-center p-4 sm:p-6 text-foreground relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 shadow-xl mb-2">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
            Mindful Care Portal
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 font-medium">
            Clinical Practitioner Account Setup
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/10 backdrop-blur-sm space-y-6">
          {verifying ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-secondary animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600">Verifying your magic invitation link...</p>
            </div>
          ) : successActivated ? (
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">Account Activated!</h2>
                <p className="text-xs text-slate-600">
                  Welcome aboard, <span className="font-bold text-secondary">{practitioner?.name || 'Doctor'}</span>! Your password has been successfully set.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-tertiary border border-secondary/20 text-xs text-secondary font-medium">
                You can now log into your practitioner account to manage clients, schedules, and clinical appointments.
              </div>

              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 px-4 rounded-xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : !tokenValid ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Invalid or Expired Link</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {errorMessage || 'This magic invitation link is invalid or has expired. Magic links expire after 7 days for security reasons.'}
                </p>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Return to Login Page
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Verified Practitioner Badge */}
              {practitioner && (
                <div className="p-4 rounded-2xl bg-tertiary/70 border border-secondary/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {practitioner.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Welcome Practitioner
                    </span>
                    <h4 className="font-bold text-sm text-foreground truncate">{practitioner.name}</h4>
                    <p className="text-xs text-slate-500 truncate">{practitioner.email}</p>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Set Your Password</h3>
                <p className="text-xs text-slate-500">Create a secure private password to access your practitioner portal.</p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Activate Account & Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  );
}
