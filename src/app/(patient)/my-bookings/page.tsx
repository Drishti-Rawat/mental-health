'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPatientBookingsApi, fetchPatientBookingsAsync, Booking } from '@/services/bookingApi';

const ITEMS_PER_PAGE = 5;

type StatusTab = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Rejected';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<StatusTab>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const patientId = user.email || user.id;
      const list = getPatientBookingsApi(patientId);
      setBookings(list || []);
      setLoading(false);

      fetchPatientBookingsAsync(patientId).then((serverList) => {
        if (serverList && serverList.length > 0) {
          setBookings(serverList);
        }
      });
    }
  }, [user]);

  // Reset page when tab filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Filtered Bookings by Status
  const filteredBookings = useMemo(() => {
    if (activeTab === 'All') return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  // Paginated List
  const totalRecords = filteredBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-secondary" />
            <span>My Session Bookings</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            View your consultation records, session status, and upcoming appointments.
          </p>
        </div>

        <Link
          href="/book"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-secondary text-white font-bold text-xs transition shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4 text-tertiary" />
          <span>Book New Session</span>
        </Link>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Pending', 'Confirmed', 'Completed', 'Rejected'] as StatusTab[]).map((tab) => {
          const isSelected = activeTab === tab;
          const count = tab === 'All' ? bookings.length : bookings.filter((b) => b.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-secondary text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Tabular View & Pagination Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-0">
        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Practitioner</th>
                <th className="py-4 px-6">Scheduled Time</th>
                <th className="py-4 px-6">Format</th>
                <th className="py-4 px-6">Consultation Focus</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                [1, 2, 3, 4, 5].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-28" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-32" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-36" /></td>
                    <td className="py-4 px-6 text-center"><div className="h-4 bg-slate-200 rounded w-16 mx-auto" /></td>
                    <td className="py-4 px-6 text-right"><div className="h-4 bg-slate-200 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center text-slate-400 font-medium">
                    <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-700 font-bold text-sm">No Bookings Found</p>
                    <p className="text-xs text-slate-400">
                      {activeTab === 'All'
                        ? "You haven't scheduled any sessions yet."
                        : `No bookings found with status "${activeTab}".`}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((b) => {
                  let statusStyle = 'bg-amber-50 text-amber-800 border-amber-200';
                  if (b.status === 'Confirmed') statusStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  if (b.status === 'Completed') statusStyle = 'bg-blue-50 text-blue-800 border-blue-200';
                  if (b.status === 'Rejected') statusStyle = 'bg-rose-50 text-rose-800 border-rose-200';

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      {/* Practitioner Info with Photo */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-tertiary text-secondary font-extrabold text-sm flex items-center justify-center border border-secondary/20 shrink-0 overflow-hidden shadow-2xs">
                            {b.therapistImage ? (
                              <img src={b.therapistImage} alt={b.therapistName} className="w-full h-full object-cover" />
                            ) : (
                              b.therapistName?.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'
                            )}
                          </div>
                          <div>
                            <span className="font-serif font-bold text-slate-900 block text-sm">
                              {b.therapistName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              Ref: {b.id.substring(0, 12)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Scheduled Time */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-secondary" />
                            {b.date}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium block">
                            {b.slot}
                          </span>
                        </div>
                      </td>

                      {/* Session Format */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-[11px] inline-block border border-slate-200/60">
                          {b.type}
                        </span>
                      </td>

                      {/* Consultation Focus */}
                      <td className="py-4 px-6 max-w-xs">
                        <span className="text-slate-600 text-xs line-clamp-2">
                          {b.topic || 'General Consultation'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle}`}>
                          {b.status === 'Pending' ? 'Pending Acceptance' : b.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {b.status === 'Confirmed' && (
                            <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-2xs flex items-center gap-1 cursor-pointer">
                              <Video className="w-3 h-3" />
                              <span>Join</span>
                            </button>
                          )}
                          <Link
                            href={`/book/${b.therapistId}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition cursor-pointer"
                          >
                            Rebook
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ALWAYS RENDER PAGINATION CONTROLS BAR */}
        <div className="bg-slate-50/80 p-4 sm:p-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-600">
            Showing <strong className="text-slate-900">{totalRecords === 0 ? 0 : startIndex + 1}</strong>–
            <strong className="text-slate-900">{Math.min(startIndex + ITEMS_PER_PAGE, totalRecords)}</strong> of{' '}
            <strong className="text-slate-900">{totalRecords}</strong> Sessions (Page {currentPage} of {totalPages})
          </span>

          {/* Page Number Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition bg-white"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
              const isSelected = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-secondary text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition bg-white"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
