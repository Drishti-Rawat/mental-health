'use client';

import React from 'react';
import { X } from 'lucide-react';

export interface DetailField {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DetailModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'emerald' | 'amber' | 'purple' | 'blue' | 'rose';
  };
  avatarLetter?: string;
  fields: DetailField[];
  actions?: React.ReactNode;
  onClose: () => void;
}

export default function DetailModal({
  isOpen,
  title,
  subtitle,
  badge,
  avatarLetter,
  fields,
  actions,
  onClose,
}: DetailModalProps) {
  if (!isOpen) return null;

  const badgeStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          {avatarLetter && (
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary font-bold text-xl flex items-center justify-center border border-secondary/20 shrink-0">
              {avatarLetter.toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            {subtitle && <p className="text-xs text-secondary mt-0.5">{subtitle}</p>}
            {badge && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border mt-1.5 ${
                  badgeStyles[badge.variant || 'blue']
                }`}
              >
                {badge.text}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100 text-xs sm:text-sm">
          {fields.map((field, idx) => {
            const Icon = field.icon;
            return (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60">
                <span className="text-slate-400 flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
                  {field.label}
                </span>
                <span className="font-semibold text-foreground text-right">{field.value}</span>
              </div>
            );
          })}
        </div>

        {actions && (
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
