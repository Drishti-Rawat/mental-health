"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  ShieldCheck,
  CalendarDays,
  Users,
  TrendingUp,
  User,
  BookOpen,
  Plus,
  X
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { applyPsychologistApi, PsychologistPayload } from "@/services/psychologistApi";

const COUNTRY_CODES = [
  { code: "+91", label: "+91 (IN)" },
  { code: "+1", label: "+1 (US/CA)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+61", label: "+61 (AU)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+65", label: "+65 (SG)" },
  { code: "+49", label: "+49 (DE)" },
  { code: "+33", label: "+33 (FR)" },
  { code: "+966", label: "+966 (KSA)" },
];

const DEGREE_OPTIONS = [
  "-- Select Degree / Qualification --",
  "Ph.D. in Clinical Psychology",
  "M.Phil in Clinical Psychology",
  "M.Sc. in Applied / Clinical Psychology",
  "M.A. in Psychology",
  "Psy.D. (Doctor of Psychology)",
  "Post Graduate Diploma in Guidance & Counselling",
  "Licensed Clinical Social Worker (LCSW)",
  "Other",
];

const PRESET_SPECIALTIES = [
  "Anxiety & Stress",
  "Depression & Mood",
  "Relationship Counselling",
  "Child & Adolescent Therapy",
  "Trauma & PTSD",
  "Career & Growth",
  "Self Care & Wellbeing",
  "CBT & Mindfulness",
  "OCD & Panic",
  "Addiction Support",
  "Family Therapy",
];

const PRESET_LANGUAGES = [
  "English",
  "Hindi",
  "Bengali",
  "Marathi",
  "Telugu",
  "Tamil",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Spanish",
  "French",
];

export default function JoinAsTherapistPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
    title: "",
    selectedDegree: "",
    customDegree: "",
    experienceYears: "" as number | string,
    consultationFee: "" as number | string,
    bio: "",
  });

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [customSpecialtyInput, setCustomSpecialtyInput] = useState("");

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [customLanguageInput, setCustomLanguageInput] = useState("");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  // Specialty Toggle / Add Inline
  const toggleSpecialty = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  const handleAddCustomSpecialty = () => {
    const trimmed = customSpecialtyInput.trim();
    if (trimmed && !selectedSpecialties.includes(trimmed)) {
      setSelectedSpecialties([...selectedSpecialties, trimmed]);
      setCustomSpecialtyInput("");
    }
  };

  // Language Toggle / Add Inline
  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleAddCustomLanguage = () => {
    const trimmed = customLanguageInput.trim();
    if (trimmed && !selectedLanguages.includes(trimmed)) {
      setSelectedLanguages([...selectedLanguages, trimmed]);
      setCustomLanguageInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-commit any pending typed text in the tag inputs before submitting
    let finalSpecialties = [...selectedSpecialties];
    if (customSpecialtyInput.trim() && !finalSpecialties.includes(customSpecialtyInput.trim())) {
      finalSpecialties.push(customSpecialtyInput.trim());
      setSelectedSpecialties(finalSpecialties);
      setCustomSpecialtyInput("");
    }

    let finalLanguages = [...selectedLanguages];
    if (customLanguageInput.trim() && !finalLanguages.includes(customLanguageInput.trim())) {
      finalLanguages.push(customLanguageInput.trim());
      setSelectedLanguages(finalLanguages);
      setCustomLanguageInput("");
    }

    const finalQualifications =
      formData.selectedDegree === "Other"
        ? formData.customDegree.trim()
        : formData.selectedDegree === "-- Select Degree / Qualification --"
        ? ""
        : formData.selectedDegree;

    // Validate ALL fields are required
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.title.trim() ||
      !finalQualifications.trim() ||
      formData.experienceYears === undefined ||
      formData.experienceYears === null ||
      !formData.consultationFee ||
      finalSpecialties.length === 0 ||
      finalLanguages.length === 0 ||
      !formData.bio.trim()
    ) {
      setErrorMessage("All fields are required! Please fill out every section including phone number, degrees, specialties, languages, and bio.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const fullPhone = `${formData.countryCode} ${formData.phoneNumber.trim()}`;

      const payload: PsychologistPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: fullPhone,
        title: formData.title.trim(),
        qualifications: finalQualifications,
        experienceYears: Number(formData.experienceYears) || 0,
        consultationFee: Number(formData.consultationFee),
        specialties: finalSpecialties,
        languages: finalLanguages,
        bio: formData.bio.trim(),
      };

      const res = await applyPsychologistApi(payload);
      if (res.success) {
        setAppliedSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to submit application. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-foreground">
      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary via-secondary to-[#0F3D2B] text-white py-14 sm:py-20 relative overflow-hidden">
          <div className="site-container relative z-10 max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" /> Practitioner Partnership Network
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-white leading-tight">
              Expand Your Practice. Empower More Lives.
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Join our network of verified mental health professionals. Connect with clients, manage private bookings, and deliver evidence-based therapy.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
                <Users className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
                <div className="font-bold text-sm text-white">Active Clients</div>
                <div className="text-[11px] text-emerald-200">Seeking Therapy Daily</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
                <CalendarDays className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
                <div className="font-bold text-sm text-white">Flexible Schedule</div>
                <div className="text-[11px] text-emerald-200">Set Your Availability</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
                <DollarSign className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
                <div className="font-bold text-sm text-white">Custom Rates</div>
                <div className="text-[11px] text-emerald-200">You Set Your Fee</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
                <ShieldCheck className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
                <div className="font-bold text-sm text-white">Verified Care</div>
                <div className="text-[11px] text-emerald-200">Admin Review</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Process Indicator */}
        <section className="site-container py-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary font-bold text-xs flex items-center justify-center shrink-0 border border-secondary/20">
                1
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground">Submit Clinical Details</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Fill out your professional qualifications, specialties, and fee structure.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary font-bold text-xs flex items-center justify-center shrink-0 border border-secondary/20">
                2
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground">Admin Verification</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Our clinical panel reviews your application credentials.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary font-bold text-xs flex items-center justify-center shrink-0 border border-secondary/20">
                3
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground">Review & Onboarding</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Our administrative team reviews your credentials and contacts you upon approval.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Application Container */}
        <section className="site-container max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
            {appliedSuccess ? (
              <div className="py-12 text-center space-y-5 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Application Submitted Successfully!</h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you for applying, <span className="font-bold text-secondary">{formData.name}</span>! Our administrative team is reviewing your credentials.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-tertiary border border-secondary/20 text-xs text-secondary font-medium max-w-md mx-auto">
                  Our team will complete credential verification and contact you at <span className="font-bold">{formData.email}</span> with your onboarding next steps.
                </div>

                <div className="pt-4">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 transition cursor-pointer"
                  >
                    <span>Return to Home</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground font-serif">Practitioner Application Form</h2>
                    <p className="text-xs text-slate-500 mt-0.5">All fields are mandatory for administrative verification.</p>
                  </div>
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                    * All Fields Required
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="font-medium">{errorMessage}</span>
                  </div>
                )}

                {/* Section 1: Basic Contact Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-secondary" /> Personal & Contact Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Radhika Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Professional Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="therapist@mentalhealth.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium bg-slate-50/50"
                      />
                    </div>

                    {/* Phone Number & Professional Title ON SAME ROW */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number *</label>
                      <div className="flex items-center gap-2">
                        <select
                          value={formData.countryCode}
                          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                          className="px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-bold bg-slate-100 text-slate-800 shrink-0 cursor-pointer"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.label}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          required
                          placeholder="98765 43210"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Professional Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Clinical Psychologist"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium bg-slate-50/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Qualifications & Fees */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-secondary" /> Clinical Background & Rates
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Clinical Experience (Years) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="5"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Consultation Fee (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="1500"
                        value={formData.consultationFee}
                        onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Degrees & Qualifications Dropdown + "Other" Write-in */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Degrees & Certifications *</label>
                    <select
                      value={formData.selectedDegree}
                      onChange={(e) => setFormData({ ...formData, selectedDegree: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-bold bg-slate-50 text-slate-800 cursor-pointer"
                    >
                      {DEGREE_OPTIONS.map((deg) => (
                        <option key={deg} value={deg}>
                          {deg}
                        </option>
                      ))}
                    </select>

                    {formData.selectedDegree === "Other" && (
                      <input
                        type="text"
                        required
                        placeholder="Specify your degree / qualification (e.g. M.Sc. Counseling & Psychotherapy)"
                        value={formData.customDegree}
                        onChange={(e) => setFormData({ ...formData, customDegree: e.target.value })}
                        className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium bg-white animate-in fade-in-50 duration-150"
                      />
                    )}
                  </div>

                  {/* Specialties Tag Input Container */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Specialties * <span className="text-slate-400 font-normal">(Type directly or click preset options below)</span>
                    </label>

                    {/* Integrated Tag Container with Direct Inline Input */}
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/15 min-h-[52px] transition">
                      {selectedSpecialties.map((spec) => (
                        <span
                          key={spec}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-secondary text-white shadow-2xs"
                        >
                          <span>{spec}</span>
                          <button
                            type="button"
                            onClick={() => toggleSpecialty(spec)}
                            className="hover:text-rose-200 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}

                      <input
                        type="text"
                        placeholder={selectedSpecialties.length === 0 ? "Type specialty & press Enter..." : "+ add specialty..."}
                        value={customSpecialtyInput}
                        onChange={(e) => setCustomSpecialtyInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
                            e.preventDefault();
                            handleAddCustomSpecialty();
                          }
                        }}
                        onBlur={handleAddCustomSpecialty}
                        className="flex-1 min-w-[150px] bg-transparent text-xs font-medium focus:outline-none placeholder:text-slate-400 py-1"
                      />
                    </div>

                    {/* Preset Option Buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {PRESET_SPECIALTIES.map((spec) => {
                        const isSelected = selectedSpecialties.includes(spec);
                        return (
                          <button
                            key={spec}
                            type="button"
                            onClick={() => toggleSpecialty(spec)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                              isSelected
                                ? "bg-secondary text-white border-secondary shadow-2xs"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {isSelected ? `✓ ${spec}` : `+ ${spec}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Languages Tag Input Container */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Languages Spoken * <span className="text-slate-400 font-normal">(Type directly or click preset options below)</span>
                    </label>

                    {/* Integrated Tag Container with Direct Inline Input */}
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/15 min-h-[52px] transition">
                      {selectedLanguages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-700 text-white shadow-2xs"
                        >
                          <span>{lang}</span>
                          <button
                            type="button"
                            onClick={() => toggleLanguage(lang)}
                            className="hover:text-rose-200 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}

                      <input
                        type="text"
                        placeholder={selectedLanguages.length === 0 ? "Type language & press Enter..." : "+ add language..."}
                        value={customLanguageInput}
                        onChange={(e) => setCustomLanguageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
                            e.preventDefault();
                            handleAddCustomLanguage();
                          }
                        }}
                        onBlur={handleAddCustomLanguage}
                        className="flex-1 min-w-[150px] bg-transparent text-xs font-medium focus:outline-none placeholder:text-slate-400 py-1"
                      />
                    </div>

                    {/* Preset Option Buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {PRESET_LANGUAGES.map((lang) => {
                        const isSelected = selectedLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleLanguage(lang)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                              isSelected
                                ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {isSelected ? `✓ ${lang}` : `+ ${lang}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section 3: Bio & Philosophy */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-secondary" /> Practice Philosophy & Bio *
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Therapeutic Approach & Clinical Experience *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your practice philosophy, therapeutic methods, and patient care approach..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-xs font-medium bg-slate-50/50 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3.5 rounded-2xl bg-secondary text-white font-bold text-xs sm:text-sm shadow-md hover:bg-secondary/90 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
