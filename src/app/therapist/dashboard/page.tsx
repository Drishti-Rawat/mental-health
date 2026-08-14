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
  CheckCircle2,
  AlertCircle,
  Star,
  DollarSign,
  Briefcase,
  Globe,
  Mail,
  Phone,
  User,
  Settings,
  LogOut,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  FileText,
  Loader2,
} from 'lucide-react';
import { PsychologistData } from '@/services/psychologistApi';
import apiClient from '@/services/apiClient';

export default function TherapistDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<PsychologistData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  // Mock sessions list for demonstration
  const [sessions] = useState([
    {
      id: 'sess-1',
      patientName: 'Ananya Roy',
      time: '10:30 AM - 11:30 AM',
      date: 'Today',
      type: 'Video Consultation',
      status: 'Confirmed',
      topic: 'Anxiety & Cognitive Behavioral Session',
    },
    {
      id: 'sess-2',
      patientName: 'Vikram Singh',
      time: '02:00 PM - 03:00 PM',
      date: 'Today',
      type: 'Chat Session',
      status: 'Confirmed',
      topic: 'Stress Management & Mindfulness',
    },
    {
      id: 'sess-3',
      patientName: 'Priya Malhotra',
      time: '04:30 PM - 05:30 PM',
      date: 'Today',
      type: 'Video Consultation',
      status: 'Scheduled',
      topic: 'Relationship Counseling',
    },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/api/psychologists/me');
        if (res.data.success) {
          setProfile(res.data.psychologist);
        }
      } catch (err: any) {
        console.error('Error fetching therapist profile:', err);
        // Fallback profile if backend link pending
        setProfile({
          id: user?.id || 'th-1',
          name: user?.name || 'Dr. Practitioner',
          email: user?.email || 'therapist@mentalhealth.com',
          title: 'Clinical Psychologist',
          specialties: ['Anxiety', 'Depression', 'CBT'],
          qualifications: 'M.A. Clinical Psychology, M.Phil',
          experienceYears: 6,
          consultationFee: 1500,
          languages: ['English', 'Hindi'],
          rating: 4.9,
          reviewCount: 38,
          status: 'active',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/therapist/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      {/* Top Navbar */}
      <header className="bg-primary text-white border-b border-secondary/30 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 backdrop-blur-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold font-serif text-base tracking-tight text-white flex items-center gap-2">
                Practitioner Portal
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Clinical Console
                </span>
              </h1>
              <p className="text-[11px] text-emerald-100/80">
                {profile?.name || user?.name || 'Practitioner'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isAvailable
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-700/50 text-slate-300 border-slate-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
              <span>{isAvailable ? 'Available for Bookings' : 'Offline'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Practitioner Welcome Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-primary via-secondary to-[#0F3D2B] text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md backdrop-blur-xs">
                {profile?.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif">{profile?.name}</h2>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-white/15 text-emerald-200 border border-white/10">
                    Verified Therapist
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 font-medium mt-0.5">{profile?.title}</p>
                <p className="text-[11px] text-emerald-100/70">{profile?.qualifications}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">Session Rate</span>
                <span className="text-lg font-extrabold text-white">₹{(profile?.consultationFee || 1500).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-2xs border border-black/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-secondary">Today's Sessions</span>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">3 Sessions</h3>
              <span className="text-[11px] text-emerald-600 font-semibold">2 Video Call, 1 Chat</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-tertiary text-secondary flex items-center justify-center border border-secondary/20">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-2xs border border-black/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-secondary">Total Clients</span>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">{profile?.reviewCount || 38}+ Patients</h3>
              <span className="text-[11px] text-slate-500 font-semibold">Active Caseload</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-tertiary text-secondary flex items-center justify-center border border-secondary/20">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-2xs border border-black/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-secondary">Experience</span>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">{profile?.experienceYears || 5} Years</h3>
              <span className="text-[11px] text-slate-500 font-semibold">Clinical Practice</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-tertiary text-secondary flex items-center justify-center border border-secondary/20">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-2xs border border-black/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-secondary">Patient Rating</span>
              <h3 className="text-2xl font-extrabold text-foreground mt-1 flex items-center gap-1">
                {profile?.rating || 4.9} <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </h3>
              <span className="text-[11px] text-slate-500 font-semibold">Based on 38+ reviews</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
          </div>
        </div>

        {/* Sessions & Appointments Schedule */}
        <div className="bg-white rounded-3xl p-6 shadow-2xs border border-black/5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Today's Appointment Schedule</h3>
              <p className="text-xs text-slate-500">Upcoming client consultations and session details</p>
            </div>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-tertiary text-secondary border border-secondary/20">
              {sessions.length} Appointments Today
            </span>
          </div>

          <div className="space-y-3">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white hover:border-secondary/30 transition shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-tertiary text-secondary font-extrabold text-sm flex items-center justify-center shrink-0 border border-secondary/20">
                    {sess.patientName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{sess.patientName}</h4>
                    <p className="text-xs text-secondary font-medium">{sess.topic}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{sess.time}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-600">{sess.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary text-white font-bold text-xs hover:bg-secondary/90 transition shadow-2xs cursor-pointer">
                    <Video className="w-3.5 h-3.5" />
                    <span>Start Session</span>
                  </button>
                  <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer" title="View Case Notes">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile & Specialties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-2xs border border-black/5 space-y-4">
            <h3 className="text-base font-bold text-foreground border-b border-slate-100 pb-3">Therapeutic Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {(profile?.specialties || ['Anxiety', 'Depression', 'Trauma Care', 'CBT', 'Relationship Counseling']).map((spec, i) => (
                <span key={i} className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-tertiary text-secondary border border-secondary/20">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xs border border-black/5 space-y-4">
            <h3 className="text-base font-bold text-foreground border-b border-slate-100 pb-3">Languages & Contact Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <span className="font-semibold text-slate-700">{profile?.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Languages</span>
                <span className="font-semibold text-slate-700">
                  {Array.isArray(profile?.languages) ? profile?.languages.join(', ') : 'English, Hindi'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
