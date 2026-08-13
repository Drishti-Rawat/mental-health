'use client';

import React from 'react';
import { CalendarDays, Clock, Stethoscope } from 'lucide-react';

export default function BookSessionPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Book a Therapy Session</h1>
              <p className="text-sm text-secondary">Choose a verified therapist and schedule your consultation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-5 rounded-2xl border border-slate-200 hover:border-secondary hover:shadow-md transition cursor-pointer bg-white space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  SJ
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Dr. Sarah Jenkins</h3>
                  <p className="text-xs text-secondary">Cognitive Behavioral Therapy (CBT)</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 50 mins</span>
                <span className="font-semibold text-emerald-600">Available Tomorrow</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 hover:border-secondary hover:shadow-md transition cursor-pointer bg-white space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  AM
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Dr. Alex Morgan</h3>
                  <p className="text-xs text-secondary">Mindfulness & Anxiety Specialist</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 50 mins</span>
                <span className="font-semibold text-emerald-600">Available Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
