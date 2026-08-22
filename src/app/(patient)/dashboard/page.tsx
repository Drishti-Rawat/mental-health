'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  LogOut,
  Calendar,
  ShieldCheck,
  Heart,
  Clock,
  Activity,
  Plus,
  Video,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BellRing,
  PhoneCall,
  User,
  Sparkles,
  CalendarDays,
  Target,
  MessageSquare,
  Compass,
  Smile,
  Zap,
} from 'lucide-react';
import { getPatientBookingsApi, fetchPatientBookingsAsync, Booking } from '@/services/bookingApi';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      const patientId = user.email || user.id;
      const list = getPatientBookingsApi(patientId);
      setBookings(list || []);

      fetchPatientBookingsAsync(patientId).then((serverList) => {
        if (serverList && serverList.length > 0) {
          setBookings(serverList);
        }
      });
    }
  }, [user]);

  // Find the next upcoming booking (Confirmed first, then Pending)
  const nextUpcomingBooking = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = bookings.filter((b) => b.date >= todayStr && b.status !== 'Rejected' && b.status !== 'Completed');
    const confirmed = upcoming.find((b) => b.status === 'Confirmed');
    if (confirmed) return confirmed;
    return upcoming.find((b) => b.status === 'Pending') || null;
  }, [bookings]);

  // Profile data
  const profile = user?.patientProfile;
  const emergencyContact = profile?.emergencyContact;
  const selectedGoals = profile?.therapyPreferences?.selectedGoals || [];
  const preferredFormat = profile?.therapyPreferences?.preferredFormat || 'Video Consultation';

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 1. CLEAN PAGE TITLE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-tertiary text-secondary font-extrabold text-lg flex items-center justify-center border border-secondary/20 shrink-0 overflow-hidden shadow-2xs">
            {profile?.avatarImage ? (
              <img src={profile.avatarImage} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight">
                Welcome back, {user?.name}!
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Active Client
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Here is your consultation overview, session reminders, and mental health resources.
            </p>
          </div>
        </div>

        <Link
          href="/book"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-secondary text-white text-xs font-bold transition shadow-2xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-tertiary" />
          <span>Book New Session</span>
        </Link>
      </div>

      {/* 2. UPCOMING CONSULTATION ALARM & REMINDER CARD */}
      {nextUpcomingBooking ? (
        <div className="relative bg-gradient-to-br from-[#052E23] via-[#0E4A35] to-[#125D43] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 overflow-hidden space-y-5">
          {/* Subtle Ambient Glow Effect */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl" />

          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30 backdrop-blur-xs shadow-inner">
                <BellRing className="w-5 h-5 animate-bounce text-amber-300" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-widest block">Upcoming Session Alert</span>
                <h2 className="text-lg font-serif font-bold text-white">Your Next Scheduled Consultation</h2>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold border shadow-2xs ${
                nextUpcomingBooking.status === 'Confirmed'
                  ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/40'
                  : 'bg-amber-400/20 text-amber-200 border-amber-400/40'
              }`}
            >
              {nextUpcomingBooking.status === 'Confirmed' ? 'Confirmed Appointment' : 'Pending Practitioner Approval'}
            </span>
          </div>

          {/* Body Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 pt-1">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 text-white font-extrabold text-2xl flex items-center justify-center border border-white/20 shrink-0 overflow-hidden shadow-md">
                {nextUpcomingBooking.therapistImage ? (
                  <img src={nextUpcomingBooking.therapistImage} alt={nextUpcomingBooking.therapistName} className="w-full h-full object-cover" />
                ) : (
                  nextUpcomingBooking.therapistName.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white font-serif tracking-tight">{nextUpcomingBooking.therapistName}</h3>
                <p className="text-xs text-tertiary/90 font-medium">{nextUpcomingBooking.topic || 'Mental Health Consultation'}</p>
                <div className="text-xs text-emerald-200 font-bold flex items-center gap-2 pt-1">
                  <span className="flex items-center gap-1 text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                    <Clock className="w-3.5 h-3.5" />
                    {nextUpcomingBooking.date} • {nextUpcomingBooking.slot}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-emerald-100 font-semibold border border-white/10">
                    {nextUpcomingBooking.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {nextUpcomingBooking.status === 'Confirmed' ? (
                <button className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2 cursor-pointer active:scale-95">
                  <Video className="w-4 h-4" />
                  <span>Join Video Call</span>
                </button>
              ) : (
                <Link
                  href="/my-bookings"
                  className="px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition border border-white/20 backdrop-blur-xs shadow-2xs"
                >
                  View Details
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upcoming Card Prompt */
        <div className="bg-gradient-to-r from-tertiary/60 via-emerald-50/40 to-tertiary/60 border border-secondary/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white text-secondary flex items-center justify-center shrink-0 border border-secondary/20 shadow-2xs">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-slate-900 font-serif">No Upcoming Consultation Scheduled</h2>
              <p className="text-xs text-slate-600">
                Ready to continue your therapy journey? Browse verified practitioners and schedule a session.
              </p>
            </div>
          </div>

          <Link
            href="/book"
            className="px-6 py-3 rounded-full bg-primary hover:bg-secondary text-white font-bold text-xs transition shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Browse Therapists</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 3. SLEEK STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{bookings.length}</div>
          <div className="text-xs font-bold text-slate-500">Total Bookings</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {bookings.filter((b) => b.status === 'Confirmed').length}
          </div>
          <div className="text-xs font-bold text-slate-500">Confirmed Sessions</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {bookings.filter((b) => b.status === 'Pending').length}
          </div>
          <div className="text-xs font-bold text-slate-500">Pending Approval</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {bookings.filter((b) => b.status === 'Completed').length}
          </div>
          <div className="text-xs font-bold text-slate-500">Completed Sessions</div>
        </div>
      </div>

      {/* 4. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols): Recent Booking Activity & Self-Care Quick Tools */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Booking Activity Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-secondary" />
                <span>Recent Booking Activity</span>
              </h2>

              <Link
                href="/my-bookings"
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium space-y-2">
                <p>No session history recorded yet.</p>
                <Link href="/book" className="text-secondary font-bold hover:underline inline-block">
                  Book your first session →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 3).map((b) => {
                  let statusStyle = 'bg-amber-100 text-amber-800';
                  if (b.status === 'Confirmed') statusStyle = 'bg-emerald-100 text-emerald-800';
                  if (b.status === 'Completed') statusStyle = 'bg-blue-100 text-blue-800';
                  if (b.status === 'Rejected') statusStyle = 'bg-rose-100 text-rose-800';

                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between gap-4 text-xs hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-tertiary text-secondary font-extrabold text-sm flex items-center justify-center border border-secondary/20 shrink-0 overflow-hidden shadow-2xs">
                          {b.therapistImage ? (
                            <img src={b.therapistImage} alt={b.therapistName} className="w-full h-full object-cover" />
                          ) : (
                            b.therapistName?.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'
                          )}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-slate-900 text-sm">{b.therapistName}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {b.date} • {b.slot}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusStyle}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Tools & Shortcuts Widget */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Quick Patient Shortcuts</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/book"
                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-50 transition group flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-900 block group-hover:text-secondary transition">Book a Practitioner</span>
                  <span className="text-emerald-700 text-[11px] block">Find verified psychologists</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                href="/profile"
                className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 hover:bg-blue-50 transition group flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-blue-900 block group-hover:text-blue-700 transition">Update Profile & Photo</span>
                  <span className="text-blue-700 text-[11px] block">Manage emergency contact</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Useful Info & Profile Summary Cards */}
        <div className="space-y-6">
          {/* Emergency Crisis Contact Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-rose-500" />
                <span>Emergency Contact</span>
              </h2>

              <Link href="/profile" className="text-xs font-bold text-secondary hover:underline">
                Edit
              </Link>
            </div>

            {emergencyContact && emergencyContact.name ? (
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/70 space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 block text-sm">{emergencyContact.name}</span>
                <span className="text-rose-700 font-extrabold text-sm block">{emergencyContact.phone}</span>
                <span className="text-[10px] text-rose-600 font-medium block">Designated Personal Contact</span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 space-y-2">
                <p>No emergency contact configured.</p>
                <Link href="/profile" className="text-secondary font-bold hover:underline block text-[11px]">
                  + Configure Emergency Contact
                </Link>
              </div>
            )}
          </div>

          {/* Therapy Focus Goals Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-secondary" />
                <span>Therapy Focus Goals</span>
              </h2>

              <Link href="/profile" className="text-xs font-bold text-secondary hover:underline">
                Update
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Preferred Format:</span>
                <span className="font-bold text-secondary">{preferredFormat}</span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-bold uppercase block">Selected Focus Areas:</span>
                {selectedGoals.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGoals.map((goal, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-tertiary/70 text-primary font-bold text-[11px] border border-secondary/20 shadow-2xs"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-[11px]">No focus goals selected yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
