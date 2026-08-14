'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Stethoscope,
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  Mail,
  Filter,
  Eye,
  Star,
  Globe,
  Briefcase,
  DollarSign,
  UserCheck,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Clock,
  XCircle,
  Link as LinkIcon,
  BellRing,
} from 'lucide-react';
import {
  PsychologistData,
  getPsychologistsApi,
  createPsychologistApi,
  updatePsychologistApi,
  deletePsychologistApi,
  approvePsychologistApi,
  rejectPsychologistApi,
  PsychologistPayload,
} from '@/services/psychologistApi';
import DataTable, { Column } from '@/components/common/DataTable';

export default function AdminPsychologistsPage() {
  const [psychologists, setPsychologists] = useState<PsychologistData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');

  // Stats State
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationData, setPaginationData] = useState({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [viewingPsychologist, setViewingPsychologist] = useState<PsychologistData | null>(null);
  const [editingPsychologist, setEditingPsychologist] = useState<PsychologistData | null>(null);
  const [deletingPsychologist, setDeletingPsychologist] = useState<PsychologistData | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    title: string;
    specialties: string;
    qualifications: string;
    experienceYears: number | '';
    consultationFee: number | '';
    bio: string;
    languages: string;
    status: 'pending_approval' | 'approved' | 'active' | 'inactive' | 'rejected' | string;
  }>({
    name: '',
    email: '',
    phone: '',
    title: '',
    specialties: '',
    qualifications: '',
    experienceYears: '',
    consultationFee: '',
    bio: '',
    languages: '',
    status: 'approved',
  });

  // Fetch psychologists data from backend
  const fetchPsychologists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPsychologistsApi({
        page: currentPage,
        limit: 10,
        search: searchTerm.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        specialty: specialtyFilter !== 'all' ? specialtyFilter : undefined,
      });

      if (res.success) {
        setPsychologists(res.psychologists || []);
        if (res.stats) {
          setStats({
            total: res.stats.total || 0,
            active: res.stats.active || 0,
            pending: res.stats.pending || 0,
            inactive: res.stats.inactive || 0,
          });
        }
        if (res.pagination) {
          setPaginationData({
            totalRecords: res.pagination.totalRecords,
            totalPages: res.pagination.totalPages,
            currentPage: res.pagination.currentPage,
            limit: res.pagination.limit,
          });
        }
      }
    } catch (err: any) {
      console.error('Error fetching psychologists:', err);
      setError(err.response?.data?.message || 'Failed to load psychologists list from server.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, specialtyFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPsychologists();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPsychologists]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Alert helpers
  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  // Reset Form to Clean Empty State
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      title: '',
      specialties: '',
      qualifications: '',
      experienceYears: '',
      consultationFee: '',
      bio: '',
      languages: '',
      status: 'approved',
    });
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (psychologist: PsychologistData) => {
    setEditingPsychologist(psychologist);
    setFormData({
      name: psychologist.name,
      email: psychologist.email,
      phone: psychologist.phone || '',
      title: psychologist.title || '',
      specialties: Array.isArray(psychologist.specialties)
        ? psychologist.specialties.join(', ')
        : psychologist.specialties || '',
      qualifications: psychologist.qualifications || '',
      experienceYears: psychologist.experienceYears || 0,
      consultationFee: psychologist.consultationFee || 0,
      bio: psychologist.bio || '',
      languages: Array.isArray(psychologist.languages)
        ? psychologist.languages.join(', ')
        : psychologist.languages || '',
      status: psychologist.status || 'approved',
    });
  };

  // Approve Therapist Application
  const handleApprove = async (psychologist: PsychologistData) => {
    const id = psychologist.id || psychologist._id!;
    setSubmitting(true);
    try {
      const res = await approvePsychologistApi(id);
      if (res.success) {
        showSuccess(`Approved ${psychologist.name}! Invitation email sent to ${psychologist.email}.`);
        fetchPsychologists();
      }
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to approve psychologist');
    } finally {
      setSubmitting(false);
    }
  };

  // Reject Therapist Application
  const handleReject = async (psychologist: PsychologistData) => {
    const id = psychologist.id || psychologist._id!;
    setSubmitting(true);
    try {
      const res = await rejectPsychologistApi(id);
      if (res.success) {
        showSuccess(`Rejected therapist application for ${psychologist.name}`);
        fetchPsychologists();
      }
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to reject psychologist');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Add Form
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.title || formData.consultationFee === '') {
      showError('Please fill in all required fields (Name, Email, Title, Consultation Fee)');
      return;
    }

    setSubmitting(true);
    try {
      const payload: PsychologistPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        specialties: formData.specialties ? formData.specialties.split(',').map((s) => s.trim()).filter(Boolean) : [],
        qualifications: formData.qualifications || '',
        experienceYears: Number(formData.experienceYears) || 0,
        consultationFee: Number(formData.consultationFee),
        bio: formData.bio || '',
        languages: formData.languages ? formData.languages.split(',').map((l) => l.trim()).filter(Boolean) : [],
      };

      const res = await createPsychologistApi(payload);
      if (res.success) {
        showSuccess(`Successfully added psychologist ${res.psychologist.name}!`);
        setIsAddModalOpen(false);
        resetForm();
        fetchPsychologists();
      }
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to add psychologist');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Edit Form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPsychologist) return;

    setSubmitting(true);
    try {
      const payload: Partial<PsychologistPayload> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        specialties: formData.specialties ? formData.specialties.split(',').map((s) => s.trim()).filter(Boolean) : [],
        qualifications: formData.qualifications || '',
        experienceYears: Number(formData.experienceYears) || 0,
        consultationFee: Number(formData.consultationFee) || 0,
        bio: formData.bio,
        languages: formData.languages ? formData.languages.split(',').map((l) => l.trim()).filter(Boolean) : [],
        status: formData.status,
      };

      const res = await updatePsychologistApi(editingPsychologist.id || editingPsychologist._id!, payload);
      if (res.success) {
        showSuccess(`Updated psychologist details for ${res.psychologist.name}`);
        setEditingPsychologist(null);
        fetchPsychologists();
      }
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to update psychologist details');
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deletingPsychologist) return;

    setSubmitting(true);
    try {
      const id = deletingPsychologist.id || deletingPsychologist._id!;
      const res = await deletePsychologistApi(id);
      if (res.success) {
        showSuccess(res.message || `Removed therapist ${deletingPsychologist.name}`);
        setDeletingPsychologist(null);
        fetchPsychologists();
      }
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to delete psychologist');
    } finally {
      setSubmitting(false);
    }
  };

  // Define Columns for DataTable
  const columns: Column<PsychologistData>[] = [
    {
      key: 'psychologist',
      header: 'Psychologist',
      render: (item) => (
        <div
          onClick={() => setViewingPsychologist(item)}
          className="flex items-center gap-3 cursor-pointer group py-0.5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-2xs border border-secondary/20 group-hover:scale-105 transition-transform duration-200">
            {item.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'P'}
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm tracking-tight group-hover:text-secondary transition-colors flex items-center gap-1.5">
              {item.name}
              {item.status === 'pending_approval' && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500 text-white uppercase tracking-wider animate-pulse">
                  New
                </span>
              )}
            </h4>
            <p className="text-xs text-secondary font-medium">{item.title}</p>
            {item.qualifications && (
              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100/80 rounded border border-slate-200/60">
                {item.qualifications}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact & Email',
      render: (item) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 hover:text-secondary transition-colors">
            <Mail className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="truncate max-w-[180px]">{item.email}</span>
          </div>
          {item.phone && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{item.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'specialties',
      header: 'Specialties',
      render: (item) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {(Array.isArray(item.specialties) ? item.specialties : []).map((spec, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-tertiary text-secondary border border-secondary/20"
            >
              {spec}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'experienceFee',
      header: 'Experience & Fee',
      render: (item) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <Briefcase className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>{item.experienceYears} Yrs Exp.</span>
          </div>
          <div className="text-secondary font-extrabold text-xs">
            ₹{(item.consultationFee || 0).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ session</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        if (item.status === 'pending_approval') {
          return (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
              Pending Admin Approval
            </span>
          );
        }
        if (item.status === 'approved') {
          return (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 inline-flex items-center gap-1.5" title="Admin approved; invitation email sent. Waiting for therapist password setup.">
              <Mail className="w-3 h-3 text-indigo-600" />
              Invite Sent
            </span>
          );
        }
        if (item.status === 'active') {
          return (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 inline-flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Active
            </span>
          );
        }
        if (item.status === 'rejected') {
          return (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1.5">
              <XCircle className="w-3 h-3 text-rose-500" />
              Rejected
            </span>
          );
        }
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Inactive
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.status === 'pending_approval' ? (
            <>
              <button
                onClick={() => handleApprove(item)}
                className="px-3 py-1 rounded-xl bg-secondary text-white font-bold text-xs hover:bg-secondary/90 transition shadow-2xs flex items-center gap-1 cursor-pointer active:scale-95"
                title="Approve Application"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleReject(item)}
                className="px-2.5 py-1 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition cursor-pointer active:scale-95"
                title="Reject Application"
              >
                Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setViewingPsychologist(item)}
                className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-200/80 text-slate-600 hover:border-secondary hover:bg-tertiary hover:text-secondary transition-all active:scale-95 cursor-pointer"
                title="View Full Profile"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleOpenEditModal(item)}
                className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-200/80 text-slate-600 hover:border-secondary hover:bg-tertiary hover:text-secondary transition-all active:scale-95 cursor-pointer"
                title="Edit Details"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeletingPsychologist(item)}
                className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-200/80 text-slate-400 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95 cursor-pointer"
                title="Remove Therapist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-5">
      {/* Compact Elegant Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-secondary to-[#0F3D2B] text-white p-4 sm:p-5 shadow-sm border border-secondary/30">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 backdrop-blur-xs">
              <Stethoscope className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold font-serif tracking-tight text-white">
                  Psychologists & Therapists
                </h1>
                <span className="text-[10px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-100 border border-white/15">
                  {paginationData.totalRecords} Records
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Review therapist applications and manage clinical staff.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-secondary font-bold text-xs shadow-sm hover:bg-tertiary hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-secondary stroke-[3]" />
            <span>Add Therapist</span>
          </button>
        </div>
      </div>

      {/* Toast Alerts */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-tertiary border border-secondary/20 text-secondary text-xs flex items-center justify-between shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-secondary hover:text-primary cursor-pointer p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-900 cursor-pointer p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Single Unified Card: Status Tabs + Search/Filter Header Toolbar + DataTable */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 space-y-4">
        {/* Interactive Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
          <button
            onClick={() => {
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              statusFilter === 'all'
                ? 'bg-secondary text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All Practitioners</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {stats.total || paginationData.totalRecords}
            </span>
          </button>

          <button
            onClick={() => {
              setStatusFilter('pending_approval');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              statusFilter === 'pending_approval'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approvals</span>
            {stats.pending > 0 && (
              <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-600 text-white animate-pulse">
                {stats.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setStatusFilter('approved');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              statusFilter === 'approved'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Invite Sent</span>
          </button>

          <button
            onClick={() => {
              setStatusFilter('active');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Roster</span>
          </button>

          <button
            onClick={() => {
              setStatusFilter('inactive');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              statusFilter === 'inactive'
                ? 'bg-slate-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Inactive</span>
          </button>

          <button
            onClick={() => {
              setStatusFilter('rejected');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              statusFilter === 'rejected'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected Applications</span>
          </button>
        </div>

        {/* Integrated Table Control Header */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-foreground">
              {statusFilter === 'pending_approval'
                ? 'Pending Approval Queue'
                : statusFilter === 'active'
                ? 'Active Therapists Roster'
                : statusFilter === 'rejected'
                ? 'Rejected Applications'
                : 'Practitioners Directory'}
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-tertiary text-secondary border border-secondary/20">
              {paginationData.totalRecords} Records Found
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 md:max-w-xl justify-end">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, specialty, or qualifications..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs font-medium focus:outline-none focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/15 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchPsychologists}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-tertiary hover:border-secondary/30 text-slate-600 hover:text-secondary transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={psychologists}
          keyExtractor={(item) => item.id || item._id!}
          isLoading={loading}
          emptyTitle={
            statusFilter === 'pending_approval'
              ? 'No Pending Applications'
              : 'No Psychologists Found'
          }
          emptyMessage={
            statusFilter === 'pending_approval'
              ? 'There are currently no therapist applications awaiting approval.'
              : 'No psychologists matched your filter criteria or none have been added yet.'
          }
          pagination={{
            currentPage: paginationData.currentPage,
            totalPages: paginationData.totalPages,
            totalRecords: paginationData.totalRecords,
            limit: paginationData.limit,
            onPageChange: (page) => setCurrentPage(page),
          }}
        />
      </div>

      {/* VIEW PSYCHOLOGIST DETAIL MODAL */}
      {viewingPsychologist && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-black/10 max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Pinned Modal Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md border border-secondary/20">
                  {viewingPsychologist.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">{viewingPsychologist.name}</h3>
                    {viewingPsychologist.status === 'active' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                        Active
                      </span>
                    ) : viewingPsychologist.status === 'approved' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                        Invite Sent
                      </span>
                    ) : viewingPsychologist.status === 'pending_approval' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Pending Approval
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-secondary mt-0.5">{viewingPsychologist.title}</p>
                  {viewingPsychologist.qualifications && (
                    <p className="text-xs text-slate-400 mt-0.5">{viewingPsychologist.qualifications}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setViewingPsychologist(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content Body */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1 space-y-6">
              {/* Key Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-tertiary/60 border border-secondary/15 space-y-1">
                  <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider block">Contact Email</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Mail className="w-4 h-4 text-secondary shrink-0" />
                    <span className="truncate">{viewingPsychologist.email}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tertiary/60 border border-secondary/15 space-y-1">
                  <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider block">Phone Number</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Phone className="w-4 h-4 text-secondary shrink-0" />
                    <span>{viewingPsychologist.phone || 'Not provided'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tertiary/60 border border-secondary/15 space-y-1">
                  <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider block">Clinical Experience</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Briefcase className="w-4 h-4 text-secondary shrink-0" />
                    <span>{viewingPsychologist.experienceYears} Years Clinical Practice</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tertiary/60 border border-secondary/15 space-y-1">
                  <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider block">Consultation Fee</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <DollarSign className="w-4 h-4 text-secondary shrink-0" />
                    <span>₹{(viewingPsychologist.consultationFee || 0).toLocaleString()} / session</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tertiary/60 border border-secondary/15 space-y-1">
                  <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider block">Languages Spoken</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Globe className="w-4 h-4 text-secondary shrink-0" />
                    <span>
                      {Array.isArray(viewingPsychologist.languages)
                        ? viewingPsychologist.languages.join(', ')
                        : viewingPsychologist.languages || 'English, Hindi'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tertiary/60 border border-secondary/15 space-y-1">
                  <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider block">Rating & Feedback</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                    <span>
                      {viewingPsychologist.rating || 4.8} / 5.0 ({viewingPsychologist.reviewCount || 30}+ reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialties Badges */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Therapeutic Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(viewingPsychologist.specialties) ? viewingPsychologist.specialties : []).map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-tertiary text-secondary border border-secondary/20 shadow-2xs"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Profile Bio */}
              {viewingPsychologist.bio && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">About & Therapy Approach</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    {viewingPsychologist.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Pinned Modal Footer Actions */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-white shrink-0 gap-3">
              <button
                type="button"
                onClick={() => {
                  const target = viewingPsychologist;
                  setViewingPsychologist(null);
                  setDeletingPsychologist(target);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-semibold text-xs hover:bg-rose-100 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Psychologist</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewingPsychologist(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingPsychologist;
                    setViewingPsychologist(null);
                    handleOpenEditModal(target);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary/90 transition shadow-md cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD PSYCHOLOGIST MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-xl border border-black/10 max-h-[85vh] flex flex-col overflow-hidden">
            {/* Pinned Modal Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h3 className="text-xl font-bold text-foreground">Add New Psychologist</h3>
                <p className="text-xs text-secondary mt-0.5">Enter details to add a new therapist to the system</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="add-therapist-form" onSubmit={handleAddSubmit} className="px-6 sm:px-8 py-6 overflow-y-auto flex-1 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Radhika Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="therapist@mentalhealth.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Title / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clinical Psychologist"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 8"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value ? Number(e.target.value) : '' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Consultation Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 1500"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value ? Number(e.target.value) : '' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Qualifications</label>
                <input
                  type="text"
                  placeholder="e.g. Ph.D. in Clinical Psychology, M.Phil"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Specialties (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Anxiety, Depression, Trauma, Relationship"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Languages (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. English, Hindi, Punjabi"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Bio / Profile Summary</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of experience, therapy approach, and specialization..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                />
              </div>
            </form>

            {/* Pinned Modal Footer Actions */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white shrink-0">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-therapist-form"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary/90 transition shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? 'Adding...' : 'Add Therapist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PSYCHOLOGIST MODAL */}
      {editingPsychologist && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-xl border border-black/10 max-h-[85vh] flex flex-col overflow-hidden">
            {/* Pinned Modal Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h3 className="text-xl font-bold text-foreground">Edit Psychologist Details</h3>
                <p className="text-xs text-secondary mt-0.5">Update credentials, fees, specialties, and status</p>
              </div>
              <button
                onClick={() => setEditingPsychologist(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="edit-therapist-form" onSubmit={handleEditSubmit} className="px-6 sm:px-8 py-6 overflow-y-auto flex-1 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Title / Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value ? Number(e.target.value) : '' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Consultation Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value ? Number(e.target.value) : '' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Qualifications</label>
                <input
                  type="text"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Specialties (comma separated)</label>
                <input
                  type="text"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Languages (comma separated)</label>
                  <input
                    type="text"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 bg-white cursor-pointer"
                  >
                    <option value="approved">Invite Sent</option>
                    <option value="active">Active</option>
                    <option value="pending_approval">Pending Admin Approval</option>
                    <option value="inactive">Inactive</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Bio / Profile Summary</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                />
              </div>
            </form>

            {/* Pinned Modal Footer Actions */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white shrink-0">
              <button
                type="button"
                onClick={() => setEditingPsychologist(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-therapist-form"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary/90 transition shadow-md cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingPsychologist && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 text-center relative">
            <button
              onClick={() => setDeletingPsychologist(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground">Remove Psychologist?</h3>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                Are you sure you want to remove <strong className="text-foreground">{deletingPsychologist.name}</strong>? This action will permanently remove their profile and linked practitioner account.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPsychologist(null)}
                disabled={submitting}
                className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Removing...' : 'Remove Therapist'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
