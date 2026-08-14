'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Users,
  Search,
  CheckCircle,
  Eye,
  Trash2,
  RefreshCw,
  Sparkles,
  X,
  Mail,
  Shield,
  Clock,
} from 'lucide-react';
import {
  getUsersApi,
  getUserDetailsApi,
  deleteUserApi,
} from '../../../../services/adminApi';
import { UserData } from '../../../../services/authApi';
import DataTable, { Column } from '../../../../components/common/DataTable';
import ConfirmModal from '../../../../components/common/ConfirmModal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
          total: data.stats.total || data.stats.patients || 0,
          active: data.stats.active || data.stats.total || 0,
        });
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

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

  // Table Columns Definition - Clean & Simple Patient Directory
  const columns: Column<UserData>[] = [
    {
      key: 'name',
      header: 'Patient Name & Profile',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-secondary text-white border border-secondary/20 flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
            {u.name?.charAt(0).toUpperCase() || 'P'}
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
      header: 'Role',
      render: () => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize bg-tertiary text-secondary border border-secondary/20">
          <Users className="w-3.5 h-3.5 text-secondary" />
          Patient
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      render: () => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Active
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* View Details */}
          <button
            onClick={() => handleOpenDetails(u)}
            className="p-2 rounded-xl text-slate-500 hover:text-secondary hover:bg-tertiary transition cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
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
      {/* Brand Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 md:p-7 bg-primary text-white shadow-xl flex items-center justify-between">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-secondary/30 blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10 max-w-xs sm:max-w-md md:max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">Patient Directory</h1>
          <p className="text-tertiary/80 text-xs sm:text-sm leading-relaxed">
            Real-time directory for monitoring client patient registrations, profile records, and account details.
          </p>
        </div>

        {/* Illustration Artwork */}
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

      {/* Controls Container: Search, Total Count & Refresh */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search patients by name or email..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Total Count Badge */}
            <div className="px-4 py-3 rounded-2xl bg-tertiary text-secondary font-extrabold text-xs border border-secondary/20 shrink-0 flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              <span>Total Patients: <strong className="text-foreground">{stats.total}</strong></span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchUsers}
              className="p-3 rounded-2xl border border-slate-200 hover:bg-tertiary hover:border-secondary text-slate-600 hover:text-secondary transition cursor-pointer shadow-2xs active:scale-95 shrink-0"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={users}
          keyExtractor={(u) => u.id || (u as any)._id}
          isLoading={loading}
          emptyTitle="No Patients Found"
          emptyMessage="No patient accounts match your search criteria."
          pagination={{
            currentPage: paginationData.currentPage,
            totalPages: paginationData.totalPages,
            totalRecords: paginationData.totalRecords,
            limit: paginationData.limit,
            onPageChange: (p) => setCurrentPage(p),
          }}
        />
      </div>

      {/* PATIENT DETAIL MODAL - Styled identically to Psychologists Detail Modal */}
      {selectedUser && isDetailsOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-black/10 max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Pinned Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md border border-secondary/20">
                  {selectedUser.name?.charAt(0).toUpperCase() || 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">{selectedUser.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                      Active Patient
                    </span>
                  </div>
                  <p className="text-xs text-secondary font-medium mt-0.5">{selectedUser.email}</p>
                </div>
              </div>

              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-tertiary/60 border border-secondary/15 space-y-1">
                  <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider block">Email Address</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Mail className="w-4 h-4 text-secondary shrink-0" />
                    <span className="truncate">{selectedUser.email}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tertiary/60 border border-secondary/15 space-y-1">
                  <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider block">System Role</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Users className="w-4 h-4 text-secondary shrink-0" />
                    <span>Client Patient</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tertiary/60 border border-secondary/15 space-y-1">
                  <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider block">Account ID</span>
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-foreground">
                    <Shield className="w-4 h-4 text-secondary shrink-0" />
                    <span className="truncate">{selectedUser.id || (selectedUser as any)._id}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tertiary/60 border border-secondary/15 space-y-1">
                  <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider block">Registration Date</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Clock className="w-4 h-4 text-secondary shrink-0" />
                    <span>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Footer Actions */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-white shrink-0 gap-3">
              <button
                type="button"
                onClick={() => {
                  const target = selectedUser;
                  setIsDetailsOpen(false);
                  setDeleteConfirmUser(target);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-semibold text-xs hover:bg-rose-100 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmUser}
        onClose={() => setDeleteConfirmUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete Patient Account"
        message={`Are you sure you want to permanently delete ${deleteConfirmUser?.name}'s account? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={actionLoadingId === (deleteConfirmUser?.id || (deleteConfirmUser as any)?._id)}
      />
    </div>
  );
}
