'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  Clock,
  Stethoscope,
  Video,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Star,
  Briefcase,
  Globe,
  Award,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPsychologistByIdApi, PsychologistData } from '@/services/psychologistApi';
import { createBookingApi, getTherapistSlotAvailabilityApi, isSlotInPast } from '@/services/bookingApi';

const STANDARD_TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:30 AM - 11:30 AM',
  '02:00 PM - 03:00 PM',
  '04:30 PM - 05:30 PM',
  '06:00 PM - 07:00 PM',
];

export default function TherapistBookingPage({ params }: { params: Promise<{ therapistId: string }> | { therapistId: string } }) {
  const { user } = useAuth();
  const router = useRouter();

  // Resolve dynamic route param therapistId
  const resolvedParams = typeof (params as any)?.then === 'function' ? React.use(params as Promise<{ therapistId: string }>) : (params as { therapistId: string });
  const therapistId = resolvedParams.therapistId;

  // Practitioner State
  const [therapist, setTherapist] = useState<PsychologistData | null>(null);
  const [loadingTherapist, setLoadingTherapist] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');

  // Booking Form Inputs
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [date, setDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [sessionType, setSessionType] = useState<'Video Consultation' | 'Chat Session' | 'In-Person'>('Video Consultation');
  const [topic, setTopic] = useState<string>('');

  // UI & Submission State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  // Fetch Therapist details on mount
  useEffect(() => {
    const fetchTherapistDetails = async () => {
      setLoadingTherapist(true);
      setFetchError('');
      try {
        const res = await getPsychologistByIdApi(therapistId);
        if (res.success && res.psychologist) {
          setTherapist(res.psychologist);
        } else {
          setFetchError('Practitioner details could not be found.');
        }
      } catch (err: any) {
        console.error('Failed to load therapist details:', err);
        setFetchError('Failed to load practitioner profile. Please check the link or select another therapist.');
      } finally {
        setLoadingTherapist(false);
      }
    };

    if (therapistId) {
      fetchTherapistDetails();
    }
  }, [therapistId]);

  // Quick Date Chips List (Today, Tomorrow, next 4 days)
  const upcomingDates = useMemo(() => {
    const list: { isoDate: string; label: string; subLabel: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      let label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      let subLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      list.push({ isoDate, label, subLabel });
    }
    return list;
  }, []);

  // Compute available & booked slots for this therapist & selected date
  const slotAvailability = useMemo(() => {
    if (!therapistId || !date) return [];
    const activeSlots = therapist?.availableSlots && therapist.availableSlots.length > 0
      ? therapist.availableSlots
      : STANDARD_TIME_SLOTS;
    return getTherapistSlotAvailabilityApi(therapistId, date, activeSlots);
  }, [therapistId, therapist, date]);

  // Form Submit Handler
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    if (!date) {
      newErrors.date = 'Please select a consultation date.';
    } else {
      const chosen = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosen < today) {
        newErrors.date = 'Consultation date cannot be in the past.';
      }
    }

    if (!selectedSlot) {
      newErrors.slot = 'Please select an available time slot.';
    } else if (isSlotInPast(date, selectedSlot)) {
      newErrors.slot = 'The selected time slot has already passed. Please select an upcoming slot.';
    }

    if (!topic || topic.trim().length < 5) {
      newErrors.topic = 'Please describe your reason or goal for consultation (at least 5 characters).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const therapistName = therapist?.name || 'Practitioner';
      const patientName = user?.name || 'Client';
      const patientEmail = user?.email || 'patient@example.com';
      const patientId = user?.id || 'usr-patient';

      const booking = await createBookingApi({
        patientId,
        patientName,
        patientEmail,
        therapistId,
        therapistName,
        therapistImage: therapist?.image || '',
        date,
        slot: selectedSlot,
        type: sessionType,
        topic,
      });

      setBookingSuccess(booking);
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to complete session booking. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingTherapist) {
    return (
      <div className="py-16 px-4 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading practitioner schedule & details...</p>
      </div>
    );
  }

  if (fetchError || !therapist) {
    return (
      <div className="py-12 px-4 max-w-lg mx-auto text-center space-y-4">
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h2 className="text-lg font-bold">Practitioner Not Found</h2>
          <p className="text-xs text-rose-700">{fetchError || 'Unable to locate therapist profile.'}</p>
        </div>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-xs hover:bg-secondary transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Therapists List</span>
        </Link>
      </div>
    );
  }

  const specs = Array.isArray(therapist.specialties)
    ? therapist.specialties
    : typeof therapist.specialties === 'string'
    ? (therapist.specialties as string).split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const languages = Array.isArray(therapist.languages)
    ? therapist.languages.join(', ')
    : therapist.languages || 'English, Hindi';

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Back Navigation Bar */}
      <div>
        <Link
          href="/book"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-secondary transition group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to All Therapists</span>
        </Link>
      </div>

      {/* Practitioner Banner Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-tertiary text-secondary font-extrabold text-3xl flex items-center justify-center border border-secondary/20 shrink-0 overflow-hidden shadow-2xs">
              {therapist.image ? (
                <img src={therapist.image} alt={therapist.name} className="w-full h-full object-cover" />
              ) : (
                therapist.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">{therapist.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Practitioner
                </span>
              </div>
              <p className="text-xs text-secondary font-bold">{therapist.title || 'Clinical Psychologist'}</p>
              {therapist.qualifications && (
                <p className="text-xs text-slate-500 font-medium">{therapist.qualifications}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-tertiary border border-secondary/20 text-center">
              <span className="text-[10px] text-secondary font-extrabold uppercase block">Session Fee</span>
              <span className="text-lg font-extrabold text-primary">₹{(therapist.consultationFee || 1500).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Attributes Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1 font-bold text-slate-800">
            <Briefcase className="w-3.5 h-3.5 text-secondary" />
            {therapist.experienceYears || 5} Years Exp.
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 font-bold text-amber-700">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {therapist.rating || 4.9} Rating
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-slate-600">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            {languages}
          </span>
        </div>
      </div>

      {/* Booking Success View */}
      {bookingSuccess ? (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200/80 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Session Booking Requested!</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your consultation request with <span className="font-bold text-secondary">{bookingSuccess.therapistName}</span> has been submitted successfully and is awaiting practitioner confirmation.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-around text-xs text-slate-700 font-semibold">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Scheduled Time</span>
              <span className="text-slate-900 font-bold">{bookingSuccess.date} • {bookingSuccess.slot}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Session Format</span>
              <span className="text-secondary font-bold">{bookingSuccess.type}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/my-bookings"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-primary hover:bg-secondary text-white font-bold text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>View My Bookings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setBookingSuccess(null);
                setSelectedSlot('');
                setTopic('');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Book Another Session
            </button>
          </div>
        </div>
      ) : (
        /* Main Interactive Booking Form & Practitioner Bio Grid */
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Date & Time Scheduler Form */}
          <div className="lg:col-span-2 space-y-6">
            {errors.form && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* 1. Pick Date & Available Time Slot */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span>1. Pick Date & Available Time Slot</span>
                </label>

                {/* Custom Date Input */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">Custom Date:</span>
                  <input
                    type="date"
                    min={todayStr}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setSelectedSlot('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-secondary cursor-pointer"
                  />
                </div>
              </div>

              {/* Quick Pick Date Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 block">Quick Pick Date:</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {upcomingDates.map((item) => {
                    const isSelected = date === item.isoDate;
                    return (
                      <button
                        key={item.isoDate}
                        type="button"
                        onClick={() => {
                          setDate(item.isoDate);
                          setSelectedSlot('');
                        }}
                        className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-secondary text-white border-secondary shadow-xs font-bold'
                            : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200 hover:border-secondary/40'
                        }`}
                      >
                        <span className="text-xs font-bold">{item.label}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                          {item.subLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {errors.date && <p className="text-[11px] font-bold text-rose-600">{errors.date}</p>}

              {/* Time Slots Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 block">Available Slots for {date}:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {slotAvailability.map(({ slot, isAvailable, isBooked }) => {
                    const isSelected = selectedSlot === slot;
                    let badgeText = 'Available';
                    if (!isAvailable) badgeText = isBooked ? 'Booked' : 'Unavailable';
                    else if (isSelected) badgeText = 'Selected';

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3.5 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                          !isAvailable
                            ? 'bg-slate-100/80 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-secondary text-white border-secondary shadow-md cursor-pointer'
                            : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200 hover:border-secondary/40 cursor-pointer'
                        }`}
                      >
                        <span className={!isAvailable ? 'line-through decoration-slate-300' : ''}>{slot}</span>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold ${
                            !isAvailable
                              ? 'bg-slate-200 text-slate-500 font-medium'
                              : isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {badgeText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {errors.slot && <p className="text-[11px] font-bold text-rose-600">{errors.slot}</p>}
            </div>

            {/* 2. Session Format & Focus Area */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Video className="w-4 h-4 text-secondary" />
                <span>2. Session Format & Consultation Focus</span>
              </label>

              {/* Session Type */}
              <div className="grid grid-cols-3 gap-2.5">
                {(['Video Consultation', 'Chat Session', 'In-Person'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSessionType(fmt)}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition cursor-pointer text-center ${
                      sessionType === fmt
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {/* Consultation Topic */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  What would you like to focus on in this session? *
                </label>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Managing workplace stress, relationship communication, CBT strategies..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-secondary"
                />
                {errors.topic && <p className="text-[11px] font-bold text-rose-600">{errors.topic}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-primary hover:bg-secondary text-white font-bold text-sm transition shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
              >
                {submitting ? (
                  <span>Submitting Booking...</span>
                ) : (
                  <>
                    <span>Confirm Consultation Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column (1 Col): Therapist Details & Fee Breakdown Sticky Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 sticky top-24">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary block border-b border-slate-100 pb-2">
                Consultation Summary
              </span>

              {/* Practitioner Card Header */}
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-tertiary text-secondary font-extrabold text-xl flex items-center justify-center border border-secondary/20 shrink-0 overflow-hidden shadow-2xs">
                  {therapist.image ? (
                    <img src={therapist.image} alt={therapist.name} className="w-full h-full object-cover" />
                  ) : (
                    therapist.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{therapist.name}</h3>
                  <p className="text-xs text-secondary font-medium">{therapist.title}</p>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-2 text-xs pt-2">
                <div className="flex justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Session Fee</span>
                  <span className="font-extrabold text-slate-900">
                    ₹{(therapist.consultationFee || 1500).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Selected Date</span>
                  <span className="font-bold text-slate-800">{date}</span>
                </div>

                <div className="flex justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Time Slot</span>
                  <span className="font-bold text-secondary">{selectedSlot || 'Not selected yet'}</span>
                </div>
              </div>

              {/* Clinical Specialties */}
              {specs.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-tertiary/40 border border-secondary/20 text-[11px] text-slate-700 leading-relaxed">
                  <span className="font-bold text-primary block mb-1">Clinical Focus:</span>
                  {specs.join(', ')}
                </div>
              )}

              {/* Bio summary */}
              {therapist.bio && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">About Practitioner:</span>
                  <p className="line-clamp-4 font-normal">{therapist.bio}</p>
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
