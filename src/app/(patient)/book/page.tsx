'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CalendarDays,
  Clock,
  Stethoscope,
  Video,
  MessageSquare,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPsychologistsApi, PsychologistData } from '@/services/psychologistApi';
import { createBookingApi, getTherapistSlotAvailabilityApi } from '@/services/bookingApi';
import Link from 'next/link';

const STANDARD_TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:30 AM - 11:30 AM',
  '02:00 PM - 03:00 PM',
  '04:30 PM - 05:30 PM',
  '06:00 PM - 07:00 PM',
];

export default function BookSessionPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();


  const therapistIdParam = searchParams.get('therapistId');

  // Therapists list & selection
  const [therapists, setTherapists] = useState<PsychologistData[]>([]);
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>(therapistIdParam || '');
  const [loadingTherapists, setLoadingTherapists] = useState<boolean>(true);

  // Form inputs
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [date, setDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [sessionType, setSessionType] = useState<'Video Consultation' | 'Chat Session' | 'In-Person'>('Video Consultation');
  const [topic, setTopic] = useState<string>('');

  // Validation & UI state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  // Fetch list of active therapists
  useEffect(() => {
    const fetchTherapists = async () => {
      setLoadingTherapists(true);
      try {
        const res = await getPsychologistsApi({ limit: 20 });
        const list = Array.isArray(res) ? res : res?.psychologists || (res as any)?.data || [];
        setTherapists(list);

        if (!selectedTherapistId && list.length > 0) {
          const firstId = list[0].id || list[0]._id;
          setSelectedTherapistId(firstId);
        }
      } catch (err) {
        console.error('Failed to load therapists:', err);
      } finally {
        setLoadingTherapists(false);
      }
    };

    fetchTherapists();
  }, [therapistIdParam]);

  // Find currently selected therapist details
  const selectedTherapist = useMemo(() => {
    return therapists.find((t) => (t.id || t._id) === selectedTherapistId) || null;
  }, [therapists, selectedTherapistId]);

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

  // Compute available & booked slots for selected therapist & date
  const slotAvailability = useMemo(() => {
    if (!selectedTherapistId || !date) return [];
    const activeSlots = (selectedTherapist?.availableSlots && selectedTherapist.availableSlots.length > 0)
      ? selectedTherapist.availableSlots
      : STANDARD_TIME_SLOTS;
    return getTherapistSlotAvailabilityApi(selectedTherapistId, date, activeSlots);
  }, [selectedTherapistId, selectedTherapist, date]);

  // Form Submit Handler with Validation
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    if (!selectedTherapistId) {
      newErrors.therapist = 'Please select a therapist for your session.';
    }

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
      const therapistName = selectedTherapist?.name || 'Practitioner';
      const patientName = user?.name || 'Client';
      const patientEmail = user?.email || 'patient@example.com';
      const patientId = user?.id || 'usr-patient';

      const booking = await createBookingApi({
        patientId,
        patientName,
        patientEmail,
        therapistId: selectedTherapistId,
        therapistName,
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

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-tertiary flex items-center justify-center shrink-0 shadow-xs backdrop-blur-xs">
              <CalendarDays className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Book a Therapy Session</h1>
              <p className="text-xs sm:text-sm text-tertiary/90 mt-0.5">
                Select your therapist, pick a convenient date & available time slot.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-emerald-200 border border-white/15">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>100% Confidential</span>
          </div>
        </div>
      </div>

      {/* Booking Success Modal View */}
      {bookingSuccess ? (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Session Booking Requested!</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your consultation request with <span className="font-bold text-secondary">{bookingSuccess.therapistName}</span> has been submitted successfully and is pending practitioner confirmation.
            </p>
          </div>

          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-left">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Booking Reference</span>
              <span className="font-mono font-bold text-slate-800">{bookingSuccess.id}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Status</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] inline-block mt-0.5">
                {bookingSuccess.status} (Awaiting Acceptance)
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Scheduled Date & Slot</span>
              <span className="font-bold text-slate-800">{bookingSuccess.date} • {bookingSuccess.slot}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Session Format</span>
              <span className="font-bold text-secondary">{bookingSuccess.type}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
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
        /* Main Interactive Form */
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Controls (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Form Alert Error */}
            {errors.form && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* 1. Therapist Selection Dropdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-secondary" />
                <span>1. Select Therapist</span>
              </label>

              {loadingTherapists ? (
                <div className="h-11 bg-slate-100 animate-pulse rounded-2xl" />
              ) : (
                <div className="relative">
                  <select
                    value={selectedTherapistId}
                    onChange={(e) => {
                      setSelectedTherapistId(e.target.value);
                      setSelectedSlot('');
                    }}
                    className="w-full h-11 px-4 pr-9 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 appearance-none focus:outline-none focus:border-secondary cursor-pointer"
                  >
                    {therapists.map((t) => {
                      const id = t.id || t._id;
                      return (
                        <option key={id} value={id}>
                          {t.name} ({t.title || 'Clinical Psychologist'}) — ₹{(t.consultationFee || 1500).toLocaleString()}/session
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
              {errors.therapist && <p className="text-[11px] font-bold text-rose-600">{errors.therapist}</p>}
            </div>

            {/* 2. Date Picker & Available Time Slots */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span>2. Pick Date & Available Time Slot</span>
                </label>

                {/* Calendar Input */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">Select Custom Date:</span>
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

              {/* Quick Date Selector Chips */}
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
                  {slotAvailability.map(({ slot, isAvailable }) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${!isAvailable
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : isSelected
                            ? 'bg-secondary text-white border-secondary shadow-md'
                            : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200 hover:border-secondary/40'
                          }`}
                      >
                        <span>{slot}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${!isAvailable
                            ? 'bg-slate-200 text-slate-500'
                            : isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-100 text-emerald-700'
                            }`}
                        >
                          {!isAvailable ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {errors.slot && <p className="text-[11px] font-bold text-rose-600">{errors.slot}</p>}
            </div>

            {/* 3. Session Format & Consultation Topic */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Video className="w-4 h-4 text-secondary" />
                <span>3. Session Format & Consultation Focus</span>
              </label>

              {/* Format selection */}
              <div className="grid grid-cols-3 gap-2">
                {(['Video Consultation', 'Chat Session', 'In-Person'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSessionType(fmt)}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition cursor-pointer text-center ${sessionType === fmt
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {/* Topic Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  What would you like to focus on in this session? *
                </label>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Managing workplace anxiety, relationship communication, CBT strategies..."
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
                className="w-full py-4 rounded-full bg-primary hover:bg-secondary text-white font-bold text-sm transition shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Submitting Booking...</span>
                ) : (
                  <>
                    <span>Confirm Session Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Selected Practitioner Summary Card (1 col) */}
          <div className="space-y-6">
            {selectedTherapist ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 sticky top-24">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary block border-b border-slate-100 pb-2">
                  Selected Practitioner
                </span>

                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-tertiary text-secondary font-extrabold text-xl flex items-center justify-center border border-secondary/20 shrink-0">
                    {selectedTherapist.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">{selectedTherapist.name}</h3>
                    <p className="text-xs text-secondary font-medium mt-0.5">{selectedTherapist.title}</p>
                    <p className="text-[11px] text-slate-400">{selectedTherapist.qualifications}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-medium">Session Fee</span>
                    <span className="font-extrabold text-slate-900">
                      ₹{(selectedTherapist.consultationFee || 1500).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-medium">Experience</span>
                    <span className="font-bold text-slate-800">{selectedTherapist.experienceYears || 5} Years</span>
                  </div>

                  <div className="flex justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-medium">Patient Rating</span>
                    <span className="font-bold text-amber-600">{selectedTherapist.rating || 4.9} ★</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-tertiary/40 border border-secondary/20 text-[11px] text-slate-700 leading-relaxed">
                  <span className="font-bold text-primary block mb-1">Specialties:</span>
                  {Array.isArray(selectedTherapist.specialties)
                    ? selectedTherapist.specialties.join(', ')
                    : selectedTherapist.specialties}
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 text-center text-slate-400 text-xs">
                Select a practitioner to preview fee & profile.
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
