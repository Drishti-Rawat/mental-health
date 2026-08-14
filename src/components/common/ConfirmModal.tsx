'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string | React.ReactNode;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  type?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant,
  type,
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: 'bg-rose-50 text-rose-600',
      btnBg: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    warning: {
      iconBg: 'bg-amber-50 text-amber-600',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    primary: {
      iconBg: 'bg-secondary/10 text-secondary',
      btnBg: 'bg-secondary hover:bg-secondary/90 text-white',
    },
  };

  const activeVariant = variant || type || 'danger';
  const style = variantStyles[activeVariant] || variantStyles.danger;
  const contentText = description || message;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center mx-auto`}>
          <AlertCircle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <div className="text-xs text-secondary mt-1 leading-relaxed">
            {contentText}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 ${style.btnBg}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
