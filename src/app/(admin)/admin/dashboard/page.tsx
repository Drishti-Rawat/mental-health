'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../../context/AuthContext';
import { 
  ShieldCheck, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Users, 
  Stethoscope, 
  Activity, 
  ArrowRight,
  User,
  Clock,
  Check
} from 'lucide-react';
import { getUsersApi } from '../../../../services/adminApi';
import { 
  getPsychologistsApi, 
  approvePsychologistApi, 
  rejectPsychologistApi,
  PsychologistData 
} from '../../../../services/psychologistApi';
import { UserData } from '../../../../services/authApi';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [pendingTherapists, setPendingTherapists] = useState<PsychologistData[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    patients: 0,
    therapists: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [pendingRes, usersRes] = await Promise.all([
        getPsychologistsApi({ status: 'pending_approval', limit: 5 }).catch(() => null),
        getUsersApi({ limit: 5 }).catch(() => null),
      ]);

      if (pendingRes && pendingRes.psychologists) {
        setPendingTherapists(pendingRes.psychologists.slice(0, 5));
      }

      if (usersRes) {
        setRecentUsers((usersRes.users || []).slice(0, 5));
        if (usersRes.stats) {
          setStats(usersRes.stats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      await approvePsychologistApi(id);
      await fetchDashboardData();
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    try {
      await rejectPsychologistApi(id);
      await fetchDashboardData();
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalPending = pendingTherapists.length;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total,
      subtitle: 'All registered accounts',
      icon: Users,
      cardBorder: 'hover:border-secondary/30',
      iconBg: 'bg-tertiary text-secondary border-secondary/20',
    },
    {
      title: 'Clients / Patients',
      value: stats.patients,
      subtitle: 'Registered patient accounts',
      icon: UserCheck,
      cardBorder: 'hover:border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Therapists',
      value: stats.therapists,
      subtitle: 'Clinical practitioner roster',
      icon: Stethoscope,
      cardBorder: 'hover:border-purple-200',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'Active Users',
      value: stats.active,
      subtitle: 'Verified active accounts',
      icon: Activity,
      cardBorder: 'hover:border-teal-200',
      iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Banner Header (Matching Psychologists Banner Theme with User Avatar Tile) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-secondary to-[#0F3D2B] text-white p-5 sm:p-6 shadow-sm border border-secondary/30">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 text-white font-extrabold text-xl flex items-center justify-center border border-white/20 shadow-xs backdrop-blur-xs shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white">
                  Admin Portal
                </h1>
                <span className="text-[10px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-100 border border-white/15 uppercase tracking-wider">
                  {user?.role || 'Admin'}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Welcome back, {user?.name} ({user?.email})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Mapped Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 ${card.cardBorder} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between`}
            >
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                  {loading ? '...' : card.value}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{card.subtitle}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${card.iconBg}`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Recent Users / Clients */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-black/5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-foreground">Recent Users / Clients</h2>
                <p className="text-xs text-slate-500 mt-0.5">Latest user registrations</p>
              </div>
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tertiary text-secondary border border-secondary/20 text-xs font-bold hover:bg-secondary hover:text-white transition-all cursor-pointer shadow-2xs"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-10 flex justify-center items-center text-slate-400">
                <div className="w-7 h-7 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                No recent users registered yet.
              </div>
            ) : (
              <div className="space-y-2.5 mt-3">
                {recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-tertiary text-secondary font-bold text-xs flex items-center justify-center shrink-0 border border-secondary/20">
                        {u.name?.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-foreground text-xs truncate">{u.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        u.role === 'therapist'
                          ? 'bg-purple-100 text-purple-700'
                          : u.role === 'admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role === 'user' ? 'Client' : u.role}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {u.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Pending Therapist Approval Requests */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-black/5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div>
                  <h2 className="text-base font-bold text-foreground">Therapist Requests</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Pending therapist applications</p>
                </div>
                {totalPending > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                    {totalPending} Pending
                  </span>
                )}
              </div>
              <Link
                href="/admin/psychologists"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tertiary text-secondary border border-secondary/20 text-xs font-bold hover:bg-secondary hover:text-white transition-all cursor-pointer shadow-2xs"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-10 flex justify-center items-center text-slate-400">
                <div className="w-7 h-7 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : totalPending === 0 ? (
              <div className="py-10 text-center space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-foreground text-xs">All Applications Cleared</h3>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">There are currently no therapist applications awaiting approval.</p>
              </div>
            ) : (
              <div className="space-y-2.5 mt-3">
                {pendingTherapists.map((item) => {
                  const itemId = item.id || item._id!;
                  return (
                    <div
                      key={itemId}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-secondary/30 transition-all"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="font-bold text-foreground text-xs truncate">{item.name}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-amber-600" />
                              Pending
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{item.email}</p>
                          {item.title && (
                            <p className="text-[10px] font-semibold text-secondary">{item.title}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <button
                          onClick={() => handleApprove(itemId)}
                          disabled={actionLoadingId === itemId}
                          className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-secondary text-white font-bold text-xs hover:bg-secondary/90 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
                          title="Approve Application"
                        >
                          <span>{actionLoadingId === itemId ? 'Approving...' : 'Approve'}</span>
                        </button>
                        <button
                          onClick={() => handleReject(itemId)}
                          disabled={actionLoadingId === itemId}
                          className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                          title="Reject Application"
                        >
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
