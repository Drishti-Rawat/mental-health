'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { ShieldCheck, UserCheck, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { getPendingStaffApi, approveStaffApi, rejectStaffApi } from '../../../../services/adminApi';
import { UserData } from '../../../../services/authApi';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [pendingStaff, setPendingStaff] = useState<{ therapists: UserData[]; admins: UserData[] }>({
    therapists: [],
    admins: [],
  });
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchPendingStaff = async () => {
    setLoading(true);
    try {
      const data = await getPendingStaffApi();
      setPendingStaff({
        therapists: data.pendingTherapists || [],
        admins: data.pendingAdmins || [],
      });
    } catch (err) {
      console.error('Failed to fetch pending staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingStaff();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      await approveStaffApi(id);
      await fetchPendingStaff();
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    try {
      await rejectStaffApi(id);
      await fetchPendingStaff();
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalPending = pendingStaff.therapists.length + pendingStaff.admins.length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Profile Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 capitalize">
                <ShieldCheck className="w-3.5 h-3.5" />
                {user?.role}
              </span>
            </div>
            <p className="text-secondary text-sm mt-0.5">Welcome back, {user?.name} ({user?.email})</p>
          </div>
        </div>

        <button
          onClick={fetchPendingStaff}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Pending Approvals Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Pending Credential Approvals</h2>
            <p className="text-sm text-secondary">Review and approve therapist and administrator applications</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            {totalPending} Applications Pending
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center text-slate-400">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : totalPending === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground text-base">No Pending Applications</h3>
            <p className="text-sm text-secondary">All staff and admin credential applications have been reviewed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Therapists Pending */}
            {pendingStaff.therapists.map((staff) => (
              <div
                key={staff.id}
                className="p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground text-sm">{staff.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 uppercase tracking-wider">
                        Therapist Applicant
                      </span>
                    </div>
                    <p className="text-xs text-secondary">{staff.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(staff.id)}
                    disabled={actionLoadingId === staff.id}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(staff.id)}
                    disabled={actionLoadingId === staff.id}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Admins / Supervisors Pending */}
            {pendingStaff.admins.map((staff) => (
              <div
                key={staff.id}
                className="p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground text-sm">{staff.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider capitalize">
                        {staff.role} Applicant
                      </span>
                    </div>
                    <p className="text-xs text-secondary">{staff.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(staff.id)}
                    disabled={actionLoadingId === staff.id}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(staff.id)}
                    disabled={actionLoadingId === staff.id}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
