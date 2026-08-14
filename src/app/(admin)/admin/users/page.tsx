'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  RefreshCw,
  UserX,
  UserCheck,
  Mail,
  Shield,
  Clock,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import {
  getUsersApi,
  getUserDetailsApi,
  updateUserStatusApi,
  deleteUserApi,
} from '../../../../services/adminApi';
import { UserData } from '../../../../services/authApi';
import DataTable, { Column } from '../../../../components/common/DataTable';
import ConfirmModal from '../../../../components/common/ConfirmModal';
import DetailModal from '../../../../components/common/DetailModal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState({ total: 0, patients: 0, therapists: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });

  // Modal States
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserData | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsersApi({
        page: currentPage,
        limit: 10,
        search: search.trim() || undefined,
        role: selectedRole !== 'all' ? selectedRole : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      });
      setUsers(data.users || []);
      if (data.pagination) {
        setPaginationData({
          totalRecords: data.pagination.totalRecords,
          totalPages: data.pagination.totalPages,
          currentPage: data.pagination.currentPage,
          limit: data.pagination.limit,
        });
      }
      if (data.stats) {
        setStats({
          total: data.stats.total || 0,
          patients: data.stats.patients || 0,
          therapists: data.stats.therapists || 0,
          active: data.stats.active || 0,
          inactive: data.stats.inactive || 0,
        });
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, selectedRole, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleOpenDetails = async (user: UserData) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
    const targetId = user.id || (user as any)._id;
    if (targetId && targetId !== 'undefined') {
      try {
        const res = await getUserDetailsApi(targetId);
        if (res.user) {
          setSelectedUser(res.user);
        }
      } catch (err) {
        console.error('Failed to fetch user details:', err);
      }
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    const userId = user.id || (user as any)._id;
    if (!userId || userId === 'undefined') return;
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setActionLoadingId(userId);
    try {
      await updateUserStatusApi(userId, newStatus);
      await fetchUsers();
      if (selectedUser && (selectedUser.id === userId || (selectedUser as any)._id === userId)) {
        setSelectedUser({ ...selectedUser, status: newStatus as any });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    const userId = deleteConfirmUser.id || (deleteConfirmUser as any)._id;
    if (!userId || userId === 'undefined') return;
    setActionLoadingId(userId);
    try {
      await deleteUserApi(userId);
      setDeleteConfirmUser(null);
      if (selectedUser && (selectedUser.id === userId || (selectedUser as any)._id === userId)) {
        setIsDetailsOpen(false);
      }
      await fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Table Columns Definition - Strict Brand Color Palette (primary, secondary, tertiary)
  const columns: Column<UserData>[] = [
    {
      key: 'name',
      header: 'User & Profile',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs shrink-0 border shadow-2xs ${u.role === 'therapist'
                ? 'bg-primary text-white border-primary/20'
                : 'bg-secondary text-white border-secondary/20'
              }`}
          >
            {u.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="font-bold text-foreground leading-snug">{u.name}</h4>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email Address',
      render: (u) => <span className="text-secondary text-xs font-medium">{u.email}</span>,
    },
    {
      key: 'role',
      header: 'System Role',
      render: (u) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize border ${u.role === 'therapist'
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-tertiary text-secondary border-secondary/20'
            }`}
        >
          {u.role === 'therapist' ? (
            <Stethoscope className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Users className="w-3.5 h-3.5 text-secondary" />
          )}
          {u.role === 'therapist' ? 'Therapist' : 'Patient'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      render: (u) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize border ${u.status === 'active'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : u.status === 'inactive'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
        >
          {u.status === 'active' ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          ) : u.status === 'inactive' ? (
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
          ) : (
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
          )}
          {u.status || 'active'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          {/* View Details */}
          <button
            onClick={() => handleOpenDetails(u)}
            className="p-2 rounded-xl text-slate-400 hover:text-foreground hover:bg-slate-100 transition cursor-pointer"
            title="Inspect Profile"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Toggle Status */}
          <button
            onClick={() => handleToggleStatus(u)}
            disabled={actionLoadingId === (u.id || (u as any)._id)}
            className={`p-2 rounded-xl transition cursor-pointer ${u.status === 'active'
                ? 'text-amber-600 hover:bg-amber-50'
                : 'text-emerald-600 hover:bg-emerald-50'
              }`}
            title={u.status === 'active' ? 'Deactivate User' : 'Activate User'}
          >
            {u.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </button>

          {/* Delete User */}
          <button
            onClick={() => setDeleteConfirmUser(u)}
            disabled={actionLoadingId === (u.id || (u as any)._id)}
            className="p-2 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Delete Account"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Brand Hero Header using primary (#0E2F29) & secondary (#0A4D34) with Illustration Artwork */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 md:p-7 bg-primary text-white shadow-xl flex items-center justify-between">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-secondary/30 blur-3xl pointer-events-none"></div>

        <div className="space-y-1.5 relative z-10 max-w-xs sm:max-w-md md:max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-tertiary text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-tertiary" />
            <span>Administrative Directory Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">User Management</h1>
          <p className="text-tertiary/80 text-xs sm:text-sm leading-relaxed">
            Real-time central directory for monitoring patient registrations, clinical therapists, and account statuses.
          </p>
        </div>

        {/* Illustration Artwork on Right Side - Absolutely positioned to prevent inflating container height */}
        <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 shrink-0 drop-shadow-lg pointer-events-none opacity-30 sm:opacity-100">
          <Image
            src="/illustration-2.png"
            alt="Mental Health Illustration"
            fill
            className="object-contain object-right"
            priority
          />
        </div>
      </div>

      {/* 4 Summary Stat Cards with Brand Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Accounts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between hover:border-secondary/40 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Accounts</p>
            <h3 className="text-3xl font-black text-foreground">{stats.total}</h3>
            <p className="text-[11px] text-slate-400">Registered platform users</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Patients */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between hover:border-secondary/40 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-secondary uppercase tracking-wider">Patients</p>
            <h3 className="text-3xl font-black text-secondary">{stats.patients}</h3>
            <p className="text-[11px] text-slate-400">Client patient accounts</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-tertiary text-secondary flex items-center justify-center font-bold border border-secondary/10">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Therapists */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between hover:border-primary/40 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-primary uppercase tracking-wider">Therapists</p>
            <h3 className="text-3xl font-black text-primary">{stats.therapists}</h3>
            <p className="text-[11px] text-slate-400">Clinical practitioners</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/10">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between hover:border-emerald-300 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Active Users</p>
            <h3 className="text-3xl font-black text-emerald-700">{stats.active}</h3>
            <p className="text-[11px] text-emerald-600">Verified & authorized</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold relative border border-emerald-200/60">
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Controls Container: Search & Brand Segmented Filters */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search directory by name or email..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Role Filter Tabs using Brand Secondary Color */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl w-full sm:w-auto border border-slate-200/50">
              {[
                { id: 'all', label: 'All Roles' },
                { id: 'user', label: 'Patients' },
                { id: 'therapist', label: 'Therapists' },
              ].map((roleTab) => (
                <button
                  key={roleTab.id}
                  onClick={() => handleRoleChange(roleTab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${selectedRole === roleTab.id
                      ? 'bg-secondary text-white shadow-xs'
                      : 'text-slate-600 hover:text-foreground'
                    }`}
                >
                  {roleTab.label}
                </button>
              ))}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl w-full sm:w-auto border border-slate-200/50">
              {['all', 'active', 'inactive', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition cursor-pointer whitespace-nowrap ${selectedStatus === status
                      ? 'bg-secondary text-white shadow-xs'
                      : 'text-slate-600 hover:text-foreground'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reusable Data Table Component */}
        <DataTable
          columns={columns}
          data={users}
          keyExtractor={(u) => u.id || (u as any)._id}
          isLoading={loading}
          emptyTitle="No Accounts Found"
          emptyMessage="Try adjusting your search criteria, role filter, or status selection."
          pagination={{
            currentPage: paginationData.currentPage,
            totalPages: paginationData.totalPages,
            totalRecords: paginationData.totalRecords,
            limit: paginationData.limit,
            onPageChange: (newPage) => setCurrentPage(newPage),
          }}
        />
      </div>

      {/* Reusable Detail Modal */}
      {selectedUser && (
        <DetailModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title={selectedUser.name}
          avatarLetter={selectedUser.name?.charAt(0)}
          badge={{
            text: selectedUser.status || 'active',
            variant: selectedUser.status === 'active' ? 'emerald' : 'amber',
          }}
          fields={[
            { label: 'Email Address', value: selectedUser.email, icon: Mail },
            { label: 'System Role', value: selectedUser.role, icon: Shield },
            { label: 'Account ID', value: selectedUser.id || (selectedUser as any)._id, icon: Clock },
          ]}
          actions={
            <>
              <button
                onClick={() => handleToggleStatus(selectedUser)}
                disabled={actionLoadingId === (selectedUser.id || (selectedUser as any)._id)}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${selectedUser.status === 'active'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                    : 'bg-secondary text-white hover:bg-secondary/90'
                  }`}
              >
                {selectedUser.status === 'active' ? (
                  <>
                    <UserX className="w-4 h-4" />
                    <span>Deactivate Account</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Activate Account</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setDeleteConfirmUser(selectedUser)}
                className="py-3 px-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs hover:bg-rose-100 transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </>
          }
        />
      )}

      {/* Reusable Confirm Modal for Deletion */}
      <ConfirmModal
        isOpen={!!deleteConfirmUser}
        onClose={() => setDeleteConfirmUser(null)}
        onConfirm={handleDeleteUser}
        title="Confirm Account Deletion"
        description={
          deleteConfirmUser && (
            <span>
              Are you sure you want to delete the account for{' '}
              <strong className="text-foreground">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})? This action is permanent and revokes all active auth sessions.
            </span>
          )
        }
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="danger"
        isLoading={!!(deleteConfirmUser && actionLoadingId === (deleteConfirmUser.id || (deleteConfirmUser as any)._id))}
      />
    </div>
  );
}
