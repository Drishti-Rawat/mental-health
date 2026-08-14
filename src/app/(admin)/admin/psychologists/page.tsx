'use client';

import React from 'react';
import { Stethoscope, Search, UserCheck, Plus, Award } from 'lucide-react';

export default function AdminPsychologistsPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Psychologists & Therapists</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              Verified Practitioners
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">Manage clinical staff, credentials, and therapy schedules</p>
        </div>

        <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-secondary text-white font-semibold text-xs shadow-md hover:bg-secondary/90 transition cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add New Therapist</span>
        </button>
      </div>

      {/* Directory Placeholder */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Clinical Roster</h2>
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-foreground text-base">Psychologist Registry Active</h3>
          <p className="text-sm text-secondary max-w-sm mx-auto">
            Verified licensed psychologists, CBT specialists, and counselors will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
