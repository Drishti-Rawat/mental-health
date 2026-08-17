"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Stethoscope, ArrowRight, AlertCircle, Mail, Lock, Eye, EyeOff, ShieldCheck, HeartHandshake } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";

export default function TherapistLoginPage() {
  const { loginTherapist, user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in as therapist, redirect to therapist dashboard
  if (user && user.role === "therapist") {
    router.push("/therapist/dashboard");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please enter your therapist email address and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const loggedInUser = await loginTherapist({
        email: formData.email,
        password: formData.password,
      });

      if (loggedInUser.role === "therapist") {
        router.push("/therapist/dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Practitioner Portal"
      badgeIcon={Stethoscope}
      panelTitle="Manage Your Practice & Deliver Impactful Care"
      panelDescription="Access your therapist dashboard, view upcoming client consultations, set flexible session schedules, and manage clinical care records securely."
      features={[
        "HIPAA & Confidentiality Encrypted Care",
        "Direct Client Appointments & Calendar Sync",
        "Seamless Session Notes & Client Tracking",
      ]}
      formTitle="Therapist Sign In"
      formSubtitle="Enter your credentials to access your clinical portal"
    >
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <span className="leading-relaxed font-medium">{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Practitioner Email Address
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
              placeholder="therapist@mentalhealth.com"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-xs font-medium bg-slate-50/50 transition placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <span className="text-xs text-slate-400">
              Forgot password? Contact Admin
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-xs font-medium bg-slate-50/50 transition placeholder:text-slate-400"
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
          className="w-full py-3.5 px-6 rounded-2xl bg-secondary text-white font-bold text-xs sm:text-sm shadow-md hover:bg-secondary/90 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Authenticating Practitioner...</span>
            </div>
          ) : (
            <>
              <span>Access Clinical Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center space-y-2">
        <p className="text-xs text-slate-600">
          Not registered as a therapist yet?{" "}
          <Link href="/join-as-therapist" className="font-bold text-secondary hover:underline">
            Apply to Join Network
          </Link>
        </p>
        <p className="text-xs text-slate-400">
          Are you a patient?{" "}
          <Link href="/login" className="font-semibold text-slate-600 hover:underline">
            Go to Patient Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
