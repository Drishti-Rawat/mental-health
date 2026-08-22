'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Edit3,
  Save,
  X,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Heart,
  Video,
  Clock,
  Bell,
  Sparkles,
  Award,
  Activity,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPatientBookingsApi, Booking } from '@/services/bookingApi';
import { updatePatientProfileApi } from '@/services/authApi';
import apiClient from '@/services/apiClient';

const THERAPY_GOALS = [
  'Anxiety & Stress',
  'Relationship Counselling',
  'Child & Adolescent Therapy',
  'Trauma & PTSD',
  'Career & Personal Growth',
  'Self Care & Wellbeing',
];

export default function UserProfilePage() {
  const { user, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Profile Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Not specified');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [avatarImage, setAvatarImage] = useState<string>('');

  // Therapy Preferences States
  const [preferredFormat, setPreferredFormat] = useState<'Video Consultation' | 'Chat Session' | 'In-Person'>('Video Consultation');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState<string>('Not specified');

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    sessionReminders: true,
    emailAlerts: true,
    therapistUpdates: true,
    monthlyDigest: false,
  });

  // Bookings Stats
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');

      if (user.patientProfile) {
        const p = user.patientProfile;
        setPhone(p.phone || '');
        setDob(p.dob || '');
        setGender(p.gender || 'Not specified');
        setAvatarImage(p.avatarImage || '');
        if (p.emergencyContact) {
          setEmergencyContactName(p.emergencyContact.name || '');
          setEmergencyContactPhone(p.emergencyContact.phone || '');
        }
        if (p.therapyPreferences) {
          if (p.therapyPreferences.preferredFormat) setPreferredFormat(p.therapyPreferences.preferredFormat);
          if (p.therapyPreferences.selectedGoals) setSelectedGoals(p.therapyPreferences.selectedGoals);
          if (p.therapyPreferences.preferredTime) setPreferredTime(p.therapyPreferences.preferredTime);
        }
        if (p.notifications) {
          setNotifications({
            sessionReminders: p.notifications.sessionReminders ?? true,
            emailAlerts: p.notifications.emailAlerts ?? true,
            therapistUpdates: p.notifications.therapistUpdates ?? true,
            monthlyDigest: p.notifications.monthlyDigest ?? false,
          });
        }
      }

      // Fetch bookings list for stats summary
      const patientId = user.email || user.id;
      const list = getPatientBookingsApi(patientId);
      setUserBookings(list);

      setFetching(false);
    }
  }, [user]);

  // Handle Avatar Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ image: 'Image file size must be less than 5MB.' });
      return;
    }

    setSaving(true);
    setSavedSuccess(false);

    try {
      let finalAvatarUrl = '';

      // Try uploading to server upload endpoint first
      try {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await apiClient.post('/api/upload/image?folder=avatars', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (uploadRes.data?.url || uploadRes.data?.imageUrl) {
          finalAvatarUrl = uploadRes.data.url || uploadRes.data.imageUrl;
        }
      } catch (uploadErr) {
        console.warn('Upload endpoint fallback to data URL:', uploadErr);
      }

      // If upload endpoint was not used, convert to Data URL
      if (!finalAvatarUrl) {
        finalAvatarUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : '');
          reader.readAsDataURL(file);
        });
      }

      if (finalAvatarUrl) {
        setAvatarImage(finalAvatarUrl);
        setErrors((prev) => ({ ...prev, image: '' }));
        await updatePatientProfileApi({ avatarImage: finalAvatarUrl });
        if (refreshProfile) await refreshProfile();
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error('Failed to save avatar photo to backend:', err);
      setErrors({ image: 'Failed to upload photo. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Toggle Goal Chip
  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  // Profile Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!name || name.trim().length < 2) {
      setErrors({ name: 'Full name must be at least 2 characters.' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        dob,
        gender,
        avatarImage,
        emergencyContact: {
          name: emergencyContactName.trim(),
          phone: emergencyContactPhone.trim(),
        },
        therapyPreferences: {
          preferredFormat,
          selectedGoals,
          preferredTime,
        },
        notifications,
      };

      await updatePatientProfileApi(payload);

      if (refreshProfile) {
        await refreshProfile();
      }

      setSavedSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      console.error('Failed to update patient profile:', err);
      setErrors({ form: err.response?.data?.message || 'Failed to update profile details. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading user profile...</p>
      </div>
    );
  }

  const confirmedSessionsCount = userBookings.filter((b) => b.status === 'Confirmed').length;
  const pendingSessionsCount = userBookings.filter((b) => b.status === 'Pending').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Success Feedback */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your user profile and care preferences have been updated successfully!</span>
        </div>
      )}

      {errors.form && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Profile Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Cover Gradient Banner */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-primary via-secondary to-[#145C41] relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Profile Info Row below Banner */}
        <div className="px-6 sm:px-8 pb-6 relative space-y-4">
          <div className="flex items-end justify-between gap-4 -mt-14 sm:-mt-16">
            {/* Clickable Avatar Photo */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group shrink-0 cursor-pointer"
              title="Click to Upload Profile Photo"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-tertiary flex items-center justify-center relative">
                {avatarImage ? (
                  <img src={avatarImage} alt={name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary/15 text-secondary font-extrabold text-3xl sm:text-4xl flex items-center justify-center">
                    {name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}

                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2 text-center rounded-2xl">
                  <Camera className="w-6 h-6 mb-1 text-emerald-400" />
                  <span className="text-[11px] font-extrabold leading-tight">Upload Photo</span>
                </div>
              </div>

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

            {/* Toggle Edit Profile Button */}
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

          {/* User Headline Details */}
          {!isEditing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">{name || 'Client Account'}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Active Client
                </span>
              </div>

              <p className="text-xs text-secondary font-medium">{email}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Activity className="w-3.5 h-3.5 text-secondary" />
                  {userBookings.length} Total Bookings
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  {confirmedSessionsCount} Confirmed Sessions
                </span>
                {phone && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {phone}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODE: 2-COLUMN DASHBOARD */}
      {!isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Left Column (2 Cols): Personal Details & Therapy Goals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-secondary" />
                <span>Personal Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Full Name</span>
                  <span className="font-bold text-slate-900 text-sm">{name}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Email Address</span>
                  <span className="font-semibold text-slate-800">{email}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Phone Number</span>
                  <span className="font-bold text-slate-800">{phone || 'Not specified'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Date of Birth</span>
                  <span className="font-bold text-slate-800">{dob || 'Not specified'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Gender</span>
                  <span className="font-bold text-slate-800">{gender}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Emergency Contact</span>
                  <span className="font-bold text-slate-800">
                    {emergencyContactName ? `${emergencyContactName} (${emergencyContactPhone || 'No phone'})` : 'Not configured'}
                  </span>
                </div>
              </div>
            </div>

            {/* Health & Therapy Preferences */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" />
                <span>Therapy & Care Preferences</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block mb-2">Preferred Consultation Format:</span>
                  <span className="px-4 py-2 rounded-2xl bg-tertiary text-primary border border-secondary/20 font-bold inline-flex items-center gap-2">
                    <Video className="w-4 h-4 text-secondary" />
                    {preferredFormat}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block mb-2">Primary Care & Focus Areas:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedGoals.length > 0 ? (
                      selectedGoals.map((goal, i) => (
                        <span
                          key={i}
                          className="px-3.5 py-1.5 rounded-2xl bg-slate-100 text-slate-800 font-bold border border-slate-200"
                        >
                          {goal}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 font-medium italic">No specific focus area selected yet. Click "Edit Profile" to set your preferences.</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block mb-1.5">Preferred Consultation Time:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-secondary" />
                    {preferredTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Care Activity & Settings Sidebar */}
          <div className="space-y-6">
            {/* Account Summary Stats */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                <span>Care Activity Overview</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <span className="font-medium text-slate-600">Total Consultation Requests</span>
                  <span className="font-extrabold text-slate-900 text-sm">{userBookings.length}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <span className="font-semibold text-emerald-800">Confirmed Sessions</span>
                  <span className="font-extrabold text-emerald-700 text-sm">{confirmedSessionsCount}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <span className="font-semibold text-amber-800">Pending Confirmations</span>
                  <span className="font-extrabold text-amber-700 text-sm">{pendingSessionsCount}</span>
                </div>
              </div>
            </div>

            {/* Confidentiality Guarantee Banner */}
            <div className="bg-gradient-to-br from-primary/10 via-tertiary to-secondary/10 p-6 rounded-3xl border border-secondary/20 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <span>100% Confidential & Secure</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Your medical records, consultation topics, and profile details are encrypted end-to-end and strictly protected under professional medical ethics.
              </p>
            </div>

            {/* Notification Preferences Summary */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
                <Bell className="w-5 h-5 text-secondary" />
                <span>Notification Settings</span>
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Session SMS/Email Reminders</span>
                  <span className={`font-bold ${notifications.sessionReminders ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {notifications.sessionReminders ? 'Active' : 'Off'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Therapist Status Updates</span>
                  <span className={`font-bold ${notifications.therapistUpdates ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {notifications.therapistUpdates ? 'Active' : 'Off'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Monthly Wellness Digest</span>
                  <span className={`font-bold ${notifications.monthlyDigest ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {notifications.monthlyDigest ? 'Active' : 'Off'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EDIT MODE FORM */
        <form onSubmit={handleSaveProfile} className="space-y-6 animate-in zoom-in-98 duration-200">
          {/* Personal Information Edit Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-secondary" />
              <span>Edit Personal Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full px-4 py-2.5 rounded-2xl bg-slate-50 border text-xs font-semibold focus:outline-none ${
                    errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-secondary'
                  }`}
                />
                {errors.name && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.name}</p>}
              </div>

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

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    placeholder="Contact name"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Emergency Phone</label>
                  <input
                    type="text"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Edit Therapy Preferences Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-secondary" />
              <span>Edit Therapy & Care Preferences</span>
            </h2>

            {/* Session Format Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Preferred Consultation Format</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Video Consultation', 'Chat Session', 'In-Person'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setPreferredFormat(fmt)}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition cursor-pointer text-center ${
                      preferredFormat === fmt
                        ? 'bg-secondary text-white border-secondary shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Selectable Therapy Goals Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Mental Health & Consultation Focus Goals</label>
              <div className="flex flex-wrap gap-2">
                {THERAPY_GOALS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-secondary text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {goal}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Consultation Time */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Preferred Timing</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Morning', 'Afternoon', 'Evening'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPreferredTime(t)}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition cursor-pointer text-center ${
                      preferredTime === t
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t} Sessions
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Edit Notification Preferences */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-secondary" />
              <span>Notification Preferences</span>
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Session SMS & Email Reminders</span>
                  <span className="text-[11px] text-slate-500">Receive reminders prior to scheduled consultations</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sessionReminders}
                  onChange={(e) => setNotifications({ ...notifications, sessionReminders: e.target.checked })}
                  className="w-4 h-4 text-secondary rounded focus:ring-secondary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Therapist Status Updates</span>
                  <span className="text-[11px] text-slate-500">Get notified when therapist confirms or updates booking status</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.therapistUpdates}
                  onChange={(e) => setNotifications({ ...notifications, therapistUpdates: e.target.checked })}
                  className="w-4 h-4 text-secondary rounded focus:ring-secondary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Monthly Wellness Newsletter</span>
                  <span className="text-[11px] text-slate-500">Receive monthly mental health tips & blog updates</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.monthlyDigest}
                  onChange={(e) => setNotifications({ ...notifications, monthlyDigest: e.target.checked })}
                  className="w-4 h-4 text-secondary rounded focus:ring-secondary cursor-pointer"
                />
              </label>
            </div>

            {/* Action Buttons */}
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
                <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
