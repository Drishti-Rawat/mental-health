'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Stethoscope,
  Calendar,
  Users,
  Clock,
  Video,
  Star,
  Briefcase,
  LogOut,
  CheckCircle,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { PsychologistData } from '@/services/psychologistApi';
import apiClient from '@/services/apiClient';
import { getTherapistBookingsApi, updateBookingStatusApi, Booking } from '@/services/bookingApi';

export default function TherapistDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<PsychologistData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  // Live Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [actionAlert, setActionAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await apiClient.get('/api/bookings/my-bookings');
      if (res.data.success && Array.isArray(res.data.bookings)) {
        const backendBookings: Booking[] = res.data.bookings.map((b: any) => ({
          id: b._id || b.id,
          patientId: b.patient || b.patientId,
          patientName: b.patientName || 'Client',
          patientEmail: b.patientEmail || '',
          therapistId: b.therapist || b.therapistId,
          therapistName: b.therapistName || 'Practitioner',
          date: b.date,
          slot: b.slot,
          type: b.type || 'Video Consultation',
          topic: b.topic,
          status: b.status,
          createdAt: b.createdAt,
        }));

        const localBookings = getTherapistBookingsApi(user?.id || user?.email);
        const mergedMap = new Map<string, Booking>();
        localBookings.forEach((b) => mergedMap.set(b.id, b));
        backendBookings.forEach((b) => mergedMap.set(b.id, b));

        setBookings(Array.from(mergedMap.values()));
        return;
      }
    } catch (err) {
      console.warn('Backend bookings fetch note: using active therapist bookings state.');
    }

    const list = getTherapistBookingsApi(user?.id || user?.email);
    setBookings(list);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/api/psychologists/me');
        if (res.data.success && res.data.psychologist) {
          setProfile(res.data.psychologist);
        }
      } catch (err: any) {
        console.warn('Profile fetch note:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchBookings();
  }, [user]);

  // Handle Accept or Reject booking
  const handleBookingAction = (bookingId: string, action: 'Confirmed' | 'Rejected') => {
    try {
      const updated = updateBookingStatusApi(bookingId, action);
      fetchBookings();

      const msg = action === 'Confirmed'
        ? `Session request from ${updated.patientName || 'Client'} has been accepted.`
        : `Session request from ${updated.patientName || 'Client'} was declined.`;

      setActionAlert({ message: msg, type: action === 'Confirmed' ? 'success' : 'danger' });
      setTimeout(() => setActionAlert(null), 3500);
    } catch (err: any) {
      console.error('Error updating booking status:', err);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === 'Pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');
  const completedBookings = bookings.filter((b) => b.status === 'Completed');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Alert Notification */}
      {actionAlert && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 border ${
            actionAlert.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-500'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 shrink-0 text-white" />
            <span>{actionAlert.message}</span>
          </div>
          <button onClick={() => setActionAlert(null)} className="text-white/80 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground flex items-center gap-2">
            <span>Welcome back, {profile?.name || user?.name || 'Therapist'}!</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here is your clinical practice overview and patient consultation schedule.
          </p>
        </div>

        {/* Availability Toggle Switch */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`px-4 py-2 rounded-2xl border text-xs font-bold transition-all duration-200 flex items-center gap-2.5 cursor-pointer shadow-2xs ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>{isAvailable ? 'Available for Bookings' : 'Offline Mode'}</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pending Requests */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Pending Requests</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-amber-600">{pendingBookings.length} Requests</h2>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Requires your approval</p>
          </div>
        </div>

        {/* Metric 2: Confirmed Active Sessions */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Confirmed Sessions</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-emerald-600">{confirmedBookings.length} Active</h2>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Ready for consultation</p>
          </div>
        </div>

        {/* Metric 3: Total Bookings */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Total Bookings</span>
            <div className="w-10 h-10 rounded-2xl bg-tertiary text-secondary flex items-center justify-center border border-secondary/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">{bookings.length} Total</h2>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">All session consultations</p>
          </div>
        </div>

        {/* Metric 4: Completed Sessions */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Completed Sessions</span>
            <div className="w-10 h-10 rounded-2xl bg-tertiary text-secondary flex items-center justify-center border border-secondary/20">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">{completedBookings.length} Finished</h2>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Completed consultations</p>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Pending Requests (Left) vs Upcoming Appointments (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Pending Requests to Accept */}
        <div className="bg-white rounded-3xl p-6 shadow-2xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-foreground">Pending Requests</h3>
            </div>
            <button
              onClick={() => router.push('/therapist/schedule')}
              className="text-xs font-bold text-secondary hover:text-primary transition cursor-pointer flex items-center gap-1 hover:underline"
            >
              <span>See All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {pendingBookings.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-400" />
                <p>No pending booking requests at this time. All caught up!</p>
              </div>
            ) : (
              pendingBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 hover:bg-amber-50 transition-all duration-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200">
                      {(b.patientName || 'C').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-foreground truncate">{b.patientName || 'Client'}</h4>
                        <span className="text-[10px] text-slate-400 truncate max-w-[130px]">({b.patientEmail})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mt-0.5">
                        <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="font-bold text-slate-800">{b.date} • {b.slot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleBookingAction(b.id, 'Confirmed')}
                      className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                      title="Accept Request"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Accept</span>
                    </button>
                    <button
                      onClick={() => handleBookingAction(b.id, 'Rejected')}
                      className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer active:scale-95 flex items-center gap-1"
                      title="Decline Request"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Decline</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Confirmed Upcoming Appointments to Attend */}
        <div className="bg-white rounded-3xl p-6 shadow-2xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              <h3 className="text-base font-bold text-foreground">Upcoming Appointments</h3>
            </div>
            <button
              onClick={() => router.push('/therapist/schedule')}
              className="text-xs font-bold text-secondary hover:text-primary transition cursor-pointer flex items-center gap-1 hover:underline"
            >
              <span>See All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {confirmedBookings.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                <p>No upcoming confirmed appointments scheduled.</p>
              </div>
            ) : (
              confirmedBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-secondary/40 transition-all duration-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-tertiary text-secondary font-bold text-xs flex items-center justify-center shrink-0 border border-secondary/20">
                      {(b.patientName || 'C').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-foreground truncate">{b.patientName || 'Client'}</h4>
                        <span className="text-[10px] text-slate-400 truncate max-w-[130px]">({b.patientEmail})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mt-0.5">
                        <Clock className="w-3 h-3 text-secondary shrink-0" />
                        <span className="font-bold text-slate-800">{b.date} • {b.slot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Action Button: Start Consultation */}
                  <div className="flex items-center shrink-0">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold text-xs transition shadow-2xs cursor-pointer active:scale-95">
                      <Video className="w-3.5 h-3.5" />
                      <span>Start Session</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
