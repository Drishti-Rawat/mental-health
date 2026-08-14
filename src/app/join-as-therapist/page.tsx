'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Mail,
  Phone,
  DollarSign,
  Globe,
  Award,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { applyPsychologistApi, PsychologistPayload } from '@/services/psychologistApi';

export default function JoinAsTherapistPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: 'Clinical Psychologist',
    qualifications: '',
    experienceYears: 5,
    consultationFee: 1500,
    specialties: 'Anxiety, Depression, Stress Management',
    languages: 'English, Hindi',
    bio: '',
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.title || !formData.consultationFee) {
      setErrorMessage('Please fill in all required fields (Name, Email, Title, Fee).');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: PsychologistPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        qualifications: formData.qualifications,
        experienceYears: Number(formData.experienceYears) || 0,
        consultationFee: Number(formData.consultationFee),
        specialties: formData.specialties ? formData.specialties.split(',').map((s) => s.trim()).filter(Boolean) : [],
        languages: formData.languages ? formData.languages.split(',').map((l) => l.trim()).filter(Boolean) : [],
        bio: formData.bio,
      };

      const res = await applyPsychologistApi(payload);
      if (res.success) {
        setAppliedSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-foreground">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-primary via-secondary to-[#0F3D2B] text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Our Clinical Practitioner Network</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight">
              Apply as a Licensed Therapist
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              Connect with clients seeking professional care. Submit your clinical profile for review. Once approved, you will receive an invitation magic link to set up your account.
            </p>
          </div>
        </div>

        {/* Application Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5">
          {appliedSuccess ? (
            <div className="py-10 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for applying, <span className="font-bold text-secondary">{formData.name}</span>! Our administrative team is reviewing your clinical credentials.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-tertiary border border-secondary/20 text-xs text-secondary font-medium max-w-md mx-auto">
                Once approved, an invitation magic link will be issued to <span className="font-bold">{formData.email}</span> to activate your account and set your password.
              </div>

              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 transition cursor-pointer"
              >
                <span>Return to Home</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-foreground">Practitioner Application Form</h2>
                <p className="text-xs text-slate-500">Provide accurate clinical details for administrative verification.</p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Radhika Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Professional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="therapist@mentalhealth.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clinical Psychologist"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="5"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="1500"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Degrees & Qualifications</label>
                <input
                  type="text"
                  placeholder="e.g. Ph.D. in Clinical Psychology, M.Phil"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialties (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Anxiety, Depression, Trauma"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Languages Spoken</label>
                  <input
                    type="text"
                    placeholder="English, Hindi"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Therapeutic Approach</label>
                <textarea
                  rows={4}
                  placeholder="Describe your practice philosophy, clinical experience, and patient care approach..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application for Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
