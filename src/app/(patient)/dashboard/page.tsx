'use client';

import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { getPatientBookingsApi, Booking } from '@/services/bookingApi';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      const patientId = user.email || user.id;
      const list = getPatientBookingsApi(patientId);
      setBookings(list);
    }
  }, [user]);

  const upcomingBooking = bookings.find((b) => b.status === 'Confirmed' || b.status === 'Pending');

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Profile Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl border border-secondary/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Active Client
                </span>
              </div>
              <p className="text-secondary text-sm mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/book"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-secondary text-white text-sm font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Session</span>
            </Link>

            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">{bookings.length}</div>
                <div className="text-xs font-medium text-secondary mt-0.5">Total Bookings</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {bookings.filter((b) => b.status === 'Confirmed').length}
                </div>
                <div className="text-xs font-medium text-secondary mt-0.5">Confirmed Sessions</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm col-span-2 sm:col-span-1">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {bookings.filter((b) => b.status === 'Pending').length}
                </div>
                <div className="text-xs font-medium text-secondary mt-0.5">Pending Requests</div>
              </div>
            </div>

            {/* Next Scheduled Appointment */}
            {upcomingBooking && (
              <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground">Next Consultation</h2>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                      upcomingBooking.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {upcomingBooking.status === 'Confirmed' ? 'Confirmed' : 'Pending Practitioner Approval'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-tertiary/20 border border-tertiary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary text-white font-bold flex items-center justify-center shrink-0">
                      {upcomingBooking.therapistName.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{upcomingBooking.therapistName}</h3>
                      <p className="text-xs text-secondary font-medium">{upcomingBooking.topic}</p>
                      <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        {upcomingBooking.date} • {upcomingBooking.slot}
                      </div>
                    </div>
                  </div>

                  {upcomingBooking.status === 'Confirmed' && (
                    <button className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0">
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Video Call</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* My Bookings History Table */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-foreground">My Session Bookings</h2>
                <span className="text-xs font-bold text-secondary">{bookings.length} Records</span>
              </div>

              {bookings.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No sessions booked yet. Click "Book New Session" to get started!
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{b.therapistName}</h4>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-secondary">{b.type}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{b.topic}</p>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {b.date} at {b.slot}
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : b.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Overview */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3">Account Overview</h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Name</span>
                  <span className="font-bold text-slate-800">{user?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Email</span>
                  <span className="font-semibold text-slate-800">{user?.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Role</span>
                  <span className="font-semibold capitalize text-secondary">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
