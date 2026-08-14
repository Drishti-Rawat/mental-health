'use client';

import React from 'react';
import { FileText, Plus, Search, Edit3, Eye } from 'lucide-react';

export default function AdminBlogPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Blog & Articles</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Content Publishing
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">Manage mental health articles, publication drafts, and clinical resources</p>
        </div>

        <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-secondary text-white font-semibold text-xs shadow-md hover:bg-secondary/90 transition cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Create New Post</span>
        </button>
      </div>

      {/* Blog List Placeholder */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Published Articles</h2>
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-foreground text-base">Content Management Active</h3>
          <p className="text-sm text-secondary max-w-sm mx-auto">
            Published psychoeducation guides, mental health tips, and clinical blogs will be managed here.
          </p>
        </div>
      </div>
    </div>
  );
}
