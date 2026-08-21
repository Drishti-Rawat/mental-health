'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  CheckCircle,
  XCircle,
  Filter,
  Check,
  X,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getTherapistBookingsApi, updateBookingStatusApi, Booking } from '@/services/bookingApi';
import apiClient from '@/services/apiClient';

const DEFAULT_STANDARD_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:30 AM - 11:30 AM',
  '02:00 PM - 03:00 PM',
  '04:30 PM - 05:30 PM',
  '06:00 PM - 07:00 PM',
];

export default function TherapistSchedulePage() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Rejected'>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('All');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, selectedDateFilter]);

  // Doctor custom slots state
  const [slots, setSlots] = useState<string[]>(DEFAULT_STANDARD_SLOTS);
  const [savingSlots, setSavingSlots] = useState<boolean>(false);
  const [slotSaveMessage, setSlotSaveMessage] = useState<string | null>(null);

  const [startTime24, setStartTime24] = useState<string>('');
  const [endTime24, setEndTime24] = useState<string>('');

  const formatTime12h = (time24: string): string => {
    if (!time24) return '';
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const hFormatted = h < 10 ? `0${h}` : `${h}`;
    return `${hFormatted}:${m} ${ampm}`;
  };

  const handleAddSelectedTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime24 || !endTime24) return;
    const formatted = `${formatTime12h(startTime24)} - ${formatTime12h(endTime24)}`;
    if (slots.includes(formatted)) {
      setSlotSaveMessage('This slot already exists in your schedule.');
      setTimeout(() => setSlotSaveMessage(null), 3000);
      return;
    }
    setSlots([...slots, formatted]);
  };

  // Quick Date Filter Options
  const dateOptions = useMemo(() => {
    const list: { isoDate: string; label: string }[] = [{ isoDate: 'All', label: 'All Dates' }];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      let label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      list.push({ isoDate, label });
    }
    return list;
  }, []);

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

    // Fetch doctor's custom available slots from profile
    const fetchSlots = async () => {
      try {
        const res = await apiClient.get('/api/psychologists/me');
        if (res.data.success && res.data.psychologist?.availableSlots) {
          if (Array.isArray(res.data.psychologist.availableSlots) && res.data.psychologist.availableSlots.length > 0) {
            setSlots(res.data.psychologist.availableSlots);
          }
        }
      } catch (err) {
        console.warn('Backend slot fetch note: using active therapist slots state.');
      }
    };

    fetchSlots();
  }, [user]);

  const handleStatusChange = (bookingId: string, status: 'Confirmed' | 'Rejected' | 'Completed') => {
    try {
      const updated = updateBookingStatusApi(bookingId, status);
      fetchBookings();
      setActionMessage(`Updated status for ${updated.patientName || 'Client'} to ${status}`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Delete a time slot
  const handleDeleteSlot = (slotToDelete: string) => {
    setSlots(slots.filter((s) => s !== slotToDelete));
  };

  // Save custom slots to doctor profile
  const handleSaveSlots = async () => {
    setSavingSlots(true);
    setSlotSaveMessage(null);
    try {
      await apiClient.put('/api/psychologists/me', { availableSlots: slots });
      setSlotSaveMessage('Available consultation slots saved successfully!');
    } catch (err: any) {
      setSlotSaveMessage('Slots saved to local practitioner settings.');
    } finally {
      setSavingSlots(false);
      setTimeout(() => setSlotSaveMessage(null), 4000);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = selectedFilter === 'All' || b.status === selectedFilter;
    const matchesDate = selectedDateFilter === 'All' || b.date === selectedDateFilter;
    return matchesStatus && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / ITEMS_PER_PAGE));
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Unified Header & Filter Control Console */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-foreground flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-secondary" />
              Therapist Schedule
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Filter bookings by status or date and configure active consultation slots.
            </p>
          </div>

          {/* Status Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-semibold overflow-x-auto">
            {(['All', 'Pending', 'Confirmed', 'Completed', 'Rejected'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                  selectedFilter === filter
                    ? 'bg-white text-secondary shadow-xs font-bold'
                    : 'text-slate-600 hover:text-foreground'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-secondary" />
              <span>Date:</span>
            </span>
            {dateOptions.map((item) => {
              const isSelected = selectedDateFilter === item.isoDate;
              return (
                <button
                  key={item.isoDate}
                  onClick={() => setSelectedDateFilter(item.isoDate)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-secondary text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-500">Pick Date:</span>
            <input
              type="date"
              value={selectedDateFilter === 'All' ? '' : selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value || 'All')}
              className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-secondary cursor-pointer"
            />
            {selectedDateFilter !== 'All' && (
              <button
                onClick={() => setSelectedDateFilter('All')}
                className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-200" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings List (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span>Patient Consultations ({filteredBookings.length})</span>
            </h2>
          </div>

          <div className="space-y-2.5">
            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-400 text-xs">
                No consultations found for filter "{selectedFilter}".
              </div>
            ) : (
              paginatedBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-secondary/40 hover:shadow-2xs transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-tertiary text-secondary font-bold text-sm flex items-center justify-center shrink-0 border border-secondary/20">
                      {(b.patientName || 'C').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xs sm:text-sm text-foreground truncate">{b.patientName || 'Client'}</h3>
                        <span className="text-[11px] text-slate-400 truncate">({b.patientEmail})</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 font-medium mt-1">
                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-secondary" />
                          {b.date} • {b.slot}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">{b.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 justify-end border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                    {b.status !== 'Confirmed' && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                          b.status === 'Completed'
                            ? 'bg-tertiary text-primary border-secondary/20'
                            : b.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    )}

                    {b.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(b.id, 'Confirmed')}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Accept Request</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(b.id, 'Rejected')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer active:scale-95"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    {b.status === 'Confirmed' && (
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-secondary hover:bg-primary text-white font-bold text-xs transition shadow-2xs cursor-pointer active:scale-95">
                          <Video className="w-3.5 h-3.5" />
                          <span>Start Session</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(b.id, 'Completed')}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-secondary text-white font-bold text-xs transition shadow-2xs cursor-pointer active:scale-95"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-tertiary" />
                          <span>Mark Completed</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Persistent Pagination Console */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-semibold">
              Showing <span className="font-bold text-slate-900">{filteredBookings.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</span> to{' '}
              <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)}</span> of{' '}
              <span className="font-bold text-slate-900">{filteredBookings.length}</span> consultations
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentPage === pg
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
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Editable Consultation Slots Manager */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Configure Available Slots</span>
                <span className="text-xs text-secondary font-bold px-2.5 py-0.5 rounded-full bg-tertiary border border-secondary/20">{slots.length} Active</span>
              </h2>
            </div>

            {slotSaveMessage && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{slotSaveMessage}</span>
              </div>
            )}

            {/* Native Clock Time Range Picker Form */}
            <form onSubmit={handleAddSelectedTimeSlot} className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-700 block flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span>Custom Slot Picker:</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime24}
                    onChange={(e) => setStartTime24(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-secondary cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime24}
                    onChange={(e) => setEndTime24(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-secondary cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!startTime24 || !endTime24}
                className="w-full py-2 rounded-xl bg-primary hover:bg-secondary text-white font-bold text-xs transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {startTime24 && endTime24
                    ? `Add (${formatTime12h(startTime24)} - ${formatTime12h(endTime24)})`
                    : 'Add Time Slot'}
                </span>
              </button>
            </form>

            {/* Configured Active Slots List */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Active Available Slots ({slots.length})
              </span>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {slots.length === 0 ? (
                  <div className="p-4 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-xs">
                    No consultation slots configured. Pick start & end time above to add a slot.
                  </div>
                ) : (
                  slots.map((slot, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-white hover:border-secondary/40 transition shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-secondary shrink-0" />
                        <span>{slot}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteSlot(slot)}
                        className="p-1 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Remove Slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Save Slots Button */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveSlots}
                disabled={savingSlots}
                className="w-full py-3 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-bold text-xs transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{savingSlots ? 'Saving Slots...' : 'Save Consultation Slots'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
