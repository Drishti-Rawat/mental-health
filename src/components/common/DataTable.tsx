'use client';

import React from 'react';
import { Layers, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  className?: string;
  pagination?: PaginationConfig;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = 'No Records Found',
  emptyMessage = 'There are no records to display at this time.',
  className = '',
  pagination,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-semibold tracking-wide text-slate-400">Loading Directory Data...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-14 h-14 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner border border-slate-200/60">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-foreground text-base">{emptyTitle}</h3>
        <p className="text-sm text-secondary max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  const startRecord = pagination ? (pagination.currentPage - 1) * pagination.limit + 1 : 1;
  const endRecord = pagination ? Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords) : data.length;

  return (
    <div className="space-y-4">
      <div className={`overflow-x-auto rounded-2xl border border-slate-100 bg-white ${className}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-slate-50/80 transition-colors group">
                {columns.map((col) => (
                  <td
                    key={`${keyExtractor(item)}-${col.key}`}
                    className={`py-4 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modern Floating Numbered Pagination Footer */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs font-medium">
          {/* Left Record Indicator Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary border border-secondary/15 text-secondary">
            <span>Showing</span>
            <span className="font-extrabold text-foreground">{startRecord}–{endRecord}</span>
            <span>of</span>
            <span className="font-extrabold text-foreground">{pagination.totalRecords}</span>
            <span>entries</span>
          </div>

          {/* Right Floating Numbered Page Pill Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/70 border border-slate-200/60 rounded-2xl shadow-2xs">
            {/* Previous Page Button */}
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dynamic Page Number Pills */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (pagination.totalPages <= 5) return true;
                return (
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - pagination.currentPage) <= 1
                );
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-1 text-slate-400 font-bold select-none">...</span>
                    )}
                    <button
                      onClick={() => pagination.onPageChange(page)}
                      className={`w-8 h-8 rounded-xl font-extrabold text-xs transition active:scale-95 cursor-pointer flex items-center justify-center ${
                        pagination.currentPage === page
                          ? 'bg-secondary text-white shadow-xs'
                          : 'text-slate-600 hover:bg-white hover:text-foreground'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            {/* Next Page Button */}
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
