'use client';

import React from 'react';
import { Users, Search, UserCheck, ShieldAlert, Filter } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Patients & Clients
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">View, search, and manage registered patient accounts</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>
          <button className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Users List Placeholder */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Registered Patients Directory</h2>
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-foreground text-base">User Directory Active</h3>
          <p className="text-sm text-secondary max-w-sm mx-auto">
            Patient account records and therapy histories will be displayed here in real time.
          </p>
        </div>
      </div>
    </div>
  );
}
