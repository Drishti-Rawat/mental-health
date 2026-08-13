'use client';

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LogOut, Calendar, ShieldCheck, Heart, Clock, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

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
            <button
              onClick={logout}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
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
                <div className="text-2xl font-bold text-foreground">1</div>
                <div className="text-xs font-medium text-secondary mt-0.5">Upcoming Session</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">4</div>
                <div className="text-xs font-medium text-secondary mt-0.5">Completed Sessions</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm col-span-2 sm:col-span-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">Good</div>
                <div className="text-xs font-medium text-secondary mt-0.5">Wellness Status</div>
              </div>
            </div>

            {/* Upcoming Appointment Card */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Next Scheduled Appointment</h2>
                <span className="text-xs text-secondary font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Tomorrow, 4:00 PM
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-tertiary/20 border border-tertiary/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                    DR
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Dr. Sarah Jenkins</h3>
                    <p className="text-xs text-secondary">Cognitive Behavioral Therapy (CBT)</p>
                  </div>
                </div>

                <button className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-secondary/90 transition cursor-pointer">
                  Join Video Call
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Account Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-foreground">Account Overview</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-secondary">Role</span>
                  <span className="font-semibold capitalize text-foreground">{user?.role}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-secondary">Account Status</span>
                  <span className="font-semibold text-emerald-600 capitalize">{user?.status}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-secondary">User ID</span>
                  <span className="font-mono text-xs text-slate-500">{user?.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
