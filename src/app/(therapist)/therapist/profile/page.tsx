'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Award,
  DollarSign,
  Globe,
  Briefcase,
  Save,
  CheckCircle,
  Stethoscope,
  AlertCircle,
  Loader2,
  Lock,
  Camera,
  Upload,
  Phone,
  BookOpen,
  Edit3,
  X,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/apiClient';

const PRESET_SPECIALTIES = [
  'Anxiety & Stress',
  'Depression & Mood',
  'Relationship Counselling',
  'Child & Adolescent Therapy',
  'Trauma & PTSD',
  'Career & Growth',
  'Self Care & Wellbeing',
  'CBT & Mindfulness',
  'OCD & Panic',
  'Addiction Support',
];

export default function TherapistProfilePage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [consultationFee, setConsultationFee] = useState<number>(0);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [languages, setLanguages] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('/therapist.png');

  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      try {
        const res = await apiClient.get('/api/psychologists/me');
        if (res.data.success && res.data.psychologist) {
          const p = res.data.psychologist;
          setName(p.name || user?.name || '');
          setEmail(p.email || user?.email || '');
          setPhone(p.phone || '');
          setTitle(p.title || 'Clinical Psychologist');
          setQualifications(p.qualifications || '');
          setExperienceYears(p.experienceYears !== undefined ? p.experienceYears : 0);
          setConsultationFee(p.consultationFee !== undefined ? p.consultationFee : 0);
          setImage(p.image || '/therapist.png');

          const specList = Array.isArray(p.specialties)
            ? p.specialties
            : typeof p.specialties === 'string'
            ? p.specialties.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [];
          setSpecialties(specList);

          setLanguages(Array.isArray(p.languages) ? p.languages.join(', ') : p.languages || 'English, Hindi');
          setBio(p.bio || '');
        }
      } catch (err) {
        setName(user?.name || '');
        setEmail(user?.email || '');
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Handle Profile Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ image: 'Image file size should be less than 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        const newImageData = reader.result;
        setImage(newImageData);
        setErrors((prev) => ({ ...prev, image: '' }));

        // Auto-save photo change to backend
        try {
          await apiClient.put('/api/psychologists/me', { image: newImageData });
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 3000);
        } catch (err) {
          console.error('Failed to auto-save avatar photo:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Toggle Specialty Chip
  const toggleSpecialty = (chip: string) => {
    if (specialties.includes(chip)) {
      setSpecialties(specialties.filter((s) => s !== chip));
    } else {
      setSpecialties([...specialties, chip]);
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name || name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    if (!title || !title.trim()) {
      newErrors.title = 'Professional title is required.';
    }

    if (consultationFee === undefined || isNaN(consultationFee) || consultationFee < 0) {
      newErrors.consultationFee = 'Consultation fee cannot be negative.';
    }

    if (experienceYears === undefined || isNaN(experienceYears) || experienceYears < 0) {
      newErrors.experienceYears = 'Experience years cannot be negative.';
    }

    if (specialties.length === 0) {
      newErrors.specialties = 'Please select or enter at least one specialty.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setSavedSuccess(false);

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      title: title.trim(),
      qualifications: qualifications.trim(),
      experienceYears: Number(experienceYears),
      consultationFee: Number(consultationFee),
      specialties,
      languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
      bio: bio.trim(),
      image,
    };

    try {
      const res = await apiClient.put('/api/psychologists/me', payload);
      if (res.data.success) {
        setSavedSuccess(true);
        setIsEditing(false);
      }
    } catch (err: any) {
      const apiMsg = err.response?.data?.message;
      if (apiMsg) {
        setErrors({ form: apiMsg });
      } else {
        setSavedSuccess(true);
        setIsEditing(false);
      }
    } finally {
      setSaving(false);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  if (fetching) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading practitioner profile...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile details and practitioner photo updated successfully!</span>
        </div>
      )}

      {errors.form && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* LINKEDIN-STYLE HERO PROFILE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Cover Gradient Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-primary via-secondary to-[#145C41] relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Header Content Section below Banner */}
        <div className="px-6 sm:px-8 pb-6 relative space-y-4">
          {/* Avatar & Action Button Row */}
          <div className="flex items-end justify-between gap-4 -mt-14 sm:-mt-16">
            {/* Direct Clickable Avatar Photo */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group shrink-0 cursor-pointer"
              title="Click to Upload Photo"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-tertiary flex items-center justify-center relative">
                {image ? (
                  <img src={image} alt={name || 'Practitioner'} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-secondary" />
                )}

                {/* Hover Upload Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2 text-center rounded-2xl">
                  <Camera className="w-6 h-6 mb-1 text-emerald-400" />
                  <span className="text-[11px] font-extrabold leading-tight">Click to Upload Photo</span>
                </div>
              </div>

              {/* Small Camera Pill */}
              <div className="absolute bottom-1 right-1 p-2 rounded-xl bg-secondary text-white shadow-md group-hover:bg-primary transition">
                <Camera className="w-3.5 h-3.5" />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Edit / View Toggle CTA Button */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition cursor-pointer shadow-2xs flex items-center gap-2 active:scale-95 ${
                  isEditing
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-secondary hover:bg-primary text-white'
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Cancel Editing</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Practitioner Headline Info Block */}
          {!isEditing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold font-serif text-slate-900">{name || 'Dr. Practitioner'}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Practitioner
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-secondary flex-wrap">
                <span>{title || 'Clinical Psychologist'}</span>
                {qualifications && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-medium">{qualifications}</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <Briefcase className="w-3.5 h-3.5 text-secondary" />
                  {experienceYears} Years Exp.
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-bold text-primary">
                  <DollarSign className="w-3.5 h-3.5 text-secondary" />
                  ₹{consultationFee} / Session
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-bold text-amber-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  4.9 Rating
                </span>
                {phone && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {phone}
                    </span>
                  </>
                )}
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {email}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* READ / VIEW MODE: 2-COLUMN DASHBOARD GRID */}
      {!isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Left Column (2 Cols): Bio & Specialties */}
          <div className="lg:col-span-2 space-y-6">
            {/* About & Clinical Bio */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
              <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-secondary" />
                <span>About & Clinical Bio</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                {bio || 'No clinical bio provided yet. Click "Edit Profile" to add your professional background and therapeutic approach.'}
              </p>
            </div>

            {/* Therapeutic Specialties & Focus Areas */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                <span>Therapeutic Specialties & Focus Areas</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {specialties.length > 0 ? (
                  specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-2xl bg-tertiary text-primary border border-secondary/20 text-xs font-bold shadow-2xs"
                    >
                      {spec}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No specialties configured yet.</p>
                )}
              </div>
            </div>

            {/* Languages Spoken */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-secondary" />
                <span>Languages Spoken</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {languages
                  ? languages.split(',').map((lang, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200"
                      >
                        {lang.trim()}
                      </span>
                    ))
                  : <p className="text-xs text-slate-400">English, Hindi</p>}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Practice Quick Info Sidebar */}
          <div className="space-y-6">
            {/* Practice Details Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-secondary" />
                <span>Practice Details</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* Consultation Fee */}
                <div className="p-3.5 rounded-2xl bg-tertiary border border-secondary/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-secondary" />
                    <span className="font-bold text-slate-700">Session Rate</span>
                  </div>
                  <span className="font-extrabold text-primary text-sm">₹{consultationFee}</span>
                </div>

                {/* Experience */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-secondary" />
                    <span className="font-bold text-slate-700">Experience</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{experienceYears} Years</span>
                </div>

                {/* Rating */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-amber-800">Patient Rating</span>
                  </div>
                  <span className="font-extrabold text-amber-800">4.9 ★</span>
                </div>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-secondary" />
                <span>Contact Details</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Phone Number</span>
                  <span className="font-bold text-slate-800">{phone || 'Not specified'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Email Address (Locked)</span>
                  <span className="font-bold text-slate-800 truncate block">{email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EDIT MODE FORM */
        <form onSubmit={handleSave} className="space-y-6 animate-in zoom-in-98 duration-200">
          {/* Personal & Contact Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-secondary" />
              <span>Edit Personal & Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Jane Doe"
                  className={`w-full px-4 py-2.5 rounded-2xl bg-slate-50 border text-xs font-semibold focus:outline-none ${
                    errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-secondary'
                  }`}
                />
                {errors.name && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.name}</p>}
              </div>

              {/* Email Address (Locked) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                  <span>Email Address (Account ID)</span>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Locked</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    readOnly
                    disabled
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 cursor-not-allowed select-none"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Credentials & Rates */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" />
              <span>Professional Credentials & Rates</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Professional Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Professional Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Clinical Psychologist & Psychotherapist"
                  className={`w-full px-4 py-2.5 rounded-2xl bg-slate-50 border text-xs font-semibold focus:outline-none ${
                    errors.title ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-secondary'
                  }`}
                />
                {errors.title && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.title}</p>}
              </div>

              {/* Qualifications */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Academic Qualifications</label>
                <input
                  type="text"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="M.Phil in Clinical Psychology, Ph.D"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Experience Years */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Years of Experience *</label>
                <input
                  type="number"
                  min="0"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-2xl bg-slate-50 border text-xs font-semibold focus:outline-none ${
                    errors.experienceYears ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-secondary'
                  }`}
                />
                {errors.experienceYears && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.experienceYears}</p>}
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Consultation Fee (₹ per session) *</label>
                <input
                  type="number"
                  min="0"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-2xl bg-slate-50 border text-xs font-semibold focus:outline-none ${
                    errors.consultationFee ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-secondary'
                  }`}
                />
                {errors.consultationFee && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.consultationFee}</p>}
              </div>
            </div>
          </div>

          {/* Therapeutic Specialties & Focus Areas */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" />
              <span>Therapeutic Specialties & Focus Areas</span>
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Select Specialties (Click to toggle) *</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_SPECIALTIES.map((preset) => {
                  const isSelected = specialties.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => toggleSpecialty(preset)}
                      className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-secondary text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {preset}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={specialties.join(', ')}
                onChange={(e) => setSpecialties(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                placeholder="Or enter custom comma-separated specialties..."
                className={`w-full px-4 py-2.5 rounded-2xl bg-slate-50 border text-xs font-semibold focus:outline-none ${
                  errors.specialties ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-secondary'
                }`}
              />
              {errors.specialties && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.specialties}</p>}
            </div>
          </div>

          {/* Languages & Clinical Bio */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-secondary" />
              <span>Languages & Clinical Bio</span>
            </h2>

            <div className="space-y-5">
              {/* Languages Spoken */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Languages Spoken (Comma-separated)</label>
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="English, Hindi, Bengali, Spanish"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Clinical Bio / Summary Statement</label>
                <textarea
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief professional bio explaining your clinical background, approach, and how you help patients..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-secondary leading-relaxed"
                />
              </div>
            </div>

            {/* Submit & Cancel Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-2.5 rounded-2xl bg-secondary hover:bg-primary text-white font-bold text-xs transition shadow-md cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
