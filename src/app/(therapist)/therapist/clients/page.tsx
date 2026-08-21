'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  FileText,
  Clock,
  Calendar,
  CheckCircle,
  History,
  Video,
  ChevronLeft,
  ChevronRight,
  User,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getTherapistBookingsApi, Booking } from '@/services/bookingApi';
import apiClient from '@/services/apiClient';

interface ClientRecord {
  email: string;
  name: string;
  patientId: string;
  totalBookings: number;
  confirmedCount: number;
  completedCount: number;
  pendingCount: number;
  lastSessionDate: string;
  latestTopic: string;
  latestType: string;
  status: string;
  bookings: Booking[];
}

export default function TherapistClientsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedClientForModal, setSelectedClientForModal] = useState<ClientRecord | null>(null);

  // Main Directory table pagination state
  const [clientDirectoryPage, setClientDirectoryPage] = useState<number>(1);
  const CLIENTS_PER_PAGE = 6;

  // Modal history pagination state
  const [modalPage, setModalPage] = useState<number>(1);
  const MODAL_ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setClientDirectoryPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setModalPage(1);
  }, [selectedClientForModal]);

  // Fetch live bookings from backend API and merge with local persistence
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
    fetchBookings();
  }, [user]);

  // Aggregate bookings into unique client records with full booking history
  const clientMap = useMemo(() => {
    const map = new Map<string, ClientRecord>();

    bookings.forEach((b) => {
      const key = (b.patientEmail || b.patientName || b.id).toLowerCase();
      const existing = map.get(key);

      if (!existing) {
        map.set(key, {
          email: b.patientEmail || 'No Email Provided',
          name: b.patientName || 'Client',
          patientId: b.patientId || key,
          totalBookings: 1,
          confirmedCount: b.status === 'Confirmed' ? 1 : 0,
          completedCount: b.status === 'Completed' ? 1 : 0,
          pendingCount: b.status === 'Pending' ? 1 : 0,
          lastSessionDate: b.date,
          latestTopic: b.topic || 'Consultation Session',
          latestType: b.type || 'Video Consultation',
          status: 'Active',
          bookings: [b],
        });
      } else {
        existing.totalBookings += 1;
        if (b.status === 'Confirmed') existing.confirmedCount += 1;
        if (b.status === 'Completed') existing.completedCount += 1;
        if (b.status === 'Pending') existing.pendingCount += 1;
        existing.bookings.push(b);

        if (b.date >= existing.lastSessionDate) {
          existing.lastSessionDate = b.date;
          existing.latestTopic = b.topic || existing.latestTopic;
          existing.latestType = b.type || existing.latestType;
        }
      }
    });

    // Sort each client's booking history by date descending and calculate dynamic status
    map.forEach((client) => {
      client.bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (client.confirmedCount > 0) {
        client.status = 'Confirmed';
      } else if (client.pendingCount > 0) {
        client.status = 'Pending';
      } else if (client.completedCount > 0) {
        client.status = 'Completed';
      } else {
        client.status = 'Inactive';
      }
    });

    return map;
  }, [bookings]);

  const clientsList = useMemo(() => Array.from(clientMap.values()), [clientMap]);

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clientsList;
    const q = searchTerm.toLowerCase();
    return clientsList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.latestTopic.toLowerCase().includes(q)
    );
  }, [clientsList, searchTerm]);

  // Main directory table pagination calculations
  const totalClientPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredClients.length / CLIENTS_PER_PAGE));
  }, [filteredClients]);

  const paginatedClients = useMemo(() => {
    return filteredClients.slice(
      (clientDirectoryPage - 1) * CLIENTS_PER_PAGE,
      clientDirectoryPage * CLIENTS_PER_PAGE
    );
  }, [filteredClients, clientDirectoryPage]);

  // Sliced modal bookings for pagination
  const totalModalPages = useMemo(() => {
    if (!selectedClientForModal) return 1;
    return Math.max(1, Math.ceil(selectedClientForModal.bookings.length / MODAL_ITEMS_PER_PAGE));
  }, [selectedClientForModal]);

  const paginatedModalBookings = useMemo(() => {
    if (!selectedClientForModal) return [];
    return selectedClientForModal.bookings.slice(
      (modalPage - 1) * MODAL_ITEMS_PER_PAGE,
      modalPage * MODAL_ITEMS_PER_PAGE
    );
  }, [selectedClientForModal, modalPage]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Console */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-secondary" />
            Client Directory & History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Full-width patient caseload directory with real-time consultation history modal pop-ups.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search client name, email, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-secondary transition shadow-2xs"
          />
        </div>
      </div>

      {/* Full-Width Tabular Client Directory Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span>All Patients Directory ({filteredClients.length})</span>
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden w-full">
          {filteredClients.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-300" />
              <p>No client records match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-4 px-5 sm:px-6">Client Name & Email</th>
                    <th className="py-4 px-4 text-center">Total Bookings</th>
                    <th className="py-4 px-4">Last Consultation Date</th>
                    <th className="py-4 px-4">Latest Focus Topic</th>
                    <th className="py-4 px-5 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedClients.map((client) => (
                    <tr
                      key={client.email}
                      onClick={() => setSelectedClientForModal(client)}
                      className="hover:bg-slate-50/80 transition cursor-pointer group"
                    >
                      {/* Client Avatar + Name + Email */}
                      <td className="py-4 px-5 sm:px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-tertiary text-secondary font-bold text-sm flex items-center justify-center shrink-0 border border-secondary/20 group-hover:scale-105 transition-transform">
                            {client.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-xs sm:text-sm text-foreground truncate">{client.name}</h3>
                            <p className="text-[11px] text-slate-400 truncate">{client.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Total Bookings Count */}
                      <td className="py-4 px-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs">
                          {client.totalBookings} Session{client.totalBookings > 1 ? 's' : ''}
                        </span>
                      </td>

                      {/* Last Session Date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                          <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                          <span>{client.lastSessionDate}</span>
                        </div>
                      </td>

                      {/* Latest Focus Topic */}
                      <td className="py-4 px-4">
                        <span className="text-slate-600 font-medium truncate block max-w-xs" title={client.latestTopic}>
                          {client.latestTopic}
                        </span>
                      </td>

                      {/* View History CTA Button */}
                      <td className="py-4 px-5 sm:px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClientForModal(client);
                          }}
                          className="px-4 py-2 rounded-xl bg-secondary hover:bg-primary text-white font-bold text-xs transition cursor-pointer shadow-2xs inline-flex items-center gap-1.5 active:scale-95"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>View History</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Persistent Client Directory Pagination Console */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-semibold">
            Showing <span className="font-bold text-slate-900">{filteredClients.length > 0 ? (clientDirectoryPage - 1) * CLIENTS_PER_PAGE + 1 : 0}</span> to{' '}
            <span className="font-bold text-slate-900">{Math.min(clientDirectoryPage * CLIENTS_PER_PAGE, filteredClients.length)}</span> of{' '}
            <span className="font-bold text-slate-900">{filteredClients.length}</span> clients
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={clientDirectoryPage <= 1}
              onClick={() => setClientDirectoryPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalClientPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setClientDirectoryPage(pg)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                    clientDirectoryPage === pg
                      ? 'bg-secondary text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={clientDirectoryPage >= totalClientPages}
              onClick={() => setClientDirectoryPage((prev) => Math.min(totalClientPages, prev + 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up Modal View for Client Consultation History */}
      {selectedClientForModal && (
        <div
          onClick={() => setSelectedClientForModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* FIXED MODAL HEADER */}
            <div className="p-6 sm:p-7 border-b border-slate-100 bg-white shrink-0 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary text-secondary font-bold text-xl flex items-center justify-center border border-secondary/20 shrink-0">
                    {selectedClientForModal.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{selectedClientForModal.name}</h3>
                    <p className="text-xs text-slate-400">{selectedClientForModal.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClientForModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Client Summary Chips */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Total</span>
                  <span className="font-extrabold text-foreground text-sm">{selectedClientForModal.totalBookings}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-600 block">Active</span>
                  <span className="font-extrabold text-emerald-700 text-sm">{selectedClientForModal.confirmedCount}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-tertiary border border-secondary/20">
                  <span className="text-[10px] font-extrabold uppercase text-primary block">Completed</span>
                  <span className="font-extrabold text-primary text-sm">{selectedClientForModal.completedCount}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-[10px] font-extrabold uppercase text-amber-600 block">Pending</span>
                  <span className="font-extrabold text-amber-700 text-sm">{selectedClientForModal.pendingCount}</span>
                </div>
              </div>
            </div>

            {/* SCROLLABLE TABLE BODY AREA */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <History className="w-4 h-4 text-secondary" />
                  <span>Session Consultation Booking History</span>
                </h4>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {selectedClientForModal.bookings.length} Record{selectedClientForModal.bookings.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Consultation History Table */}
              <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-100 z-10 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3.5">Date & Slot</th>
                        <th className="py-2.5 px-3">Format</th>
                        <th className="py-2.5 px-3">Focus Topic</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 font-medium bg-white">
                      {paginatedModalBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                              <span>{booking.date}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium block">{booking.slot}</span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700 text-[10px]">
                              {booking.type}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-slate-600 text-[11px] leading-snug line-clamp-2" title={booking.topic}>
                              {booking.topic}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                                booking.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : booking.status === 'Completed'
                                  ? 'bg-tertiary text-primary border-secondary/20'
                                  : booking.status === 'Pending'
                                  ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* History Table Pagination Bar (positioned directly below the table) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-semibold border-t border-slate-100">
                <div>
                  Showing <span className="font-bold text-slate-900">{selectedClientForModal.bookings.length > 0 ? (modalPage - 1) * MODAL_ITEMS_PER_PAGE + 1 : 0}</span> to{' '}
                  <span className="font-bold text-slate-900">{Math.min(modalPage * MODAL_ITEMS_PER_PAGE, selectedClientForModal.bookings.length)}</span> of{' '}
                  <span className="font-bold text-slate-900">{selectedClientForModal.bookings.length}</span> records
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={modalPage <= 1}
                    onClick={() => setModalPage((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalModalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setModalPage(pg)}
                        className={`w-7 h-7 rounded-xl text-xs font-bold transition cursor-pointer ${
                          modalPage === pg
                            ? 'bg-secondary text-white shadow-2xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={modalPage >= totalModalPages}
                    onClick={() => setModalPage((prev) => Math.min(totalModalPages, prev + 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* FIXED MODAL FOOTER */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0 flex justify-end">
              <button
                onClick={() => setSelectedClientForModal(null)}
                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
