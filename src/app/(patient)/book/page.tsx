'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Stethoscope,
  X,
  UserCheck,
} from 'lucide-react';
import TherapistCard from '@/components/common/TherapistCard';
import { getPsychologistsApi, getSpecialtiesApi, PsychologistData } from '@/services/psychologistApi';

const SPECIALIZATION_OPTIONS = [
  'All Specializations',
  'Anxiety & Stress',
  'Depression & Mood',
  'Relationship Counselling',
  'Child & Adolescent Therapy',
  'Trauma & PTSD',
  'Career & Growth',
  'Self Care & Wellbeing',
];

const LANGUAGES_LIST = [
  'All Languages',
  'English',
  'Hindi',
  'Hinglish',
  'Punjabi',
  'Bengali',
  'Tamil',
];

const ITEMS_PER_PAGE = 9;

export default function PatientBookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSpecialty = searchParams ? searchParams.get('specialty') : null;

  const [psychologists, setPsychologists] = useState<PsychologistData[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendSpecialties, setBackendSpecialties] = useState<string[]>(SPECIALIZATION_OPTIONS);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [selectedSpec, setSelectedSpec] = useState(urlSpecialty || 'All Specializations');
  const [maxFee, setMaxFee] = useState<number>(50000);
  const [debouncedMaxFee, setDebouncedMaxFee] = useState<number>(50000);

  const [minExp, setMinExp] = useState<number>(0);
  const [debouncedMinExp, setDebouncedMinExp] = useState<number>(0);

  const [selectedLang, setSelectedLang] = useState('All Languages');
  const [sortOption, setSortOption] = useState('Experience: High to Low');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Mobile Filter Drawer State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch specialties from backend API on mount
  useEffect(() => {
    getSpecialtiesApi().then((list) => {
      if (list && list.length > 0) {
        setBackendSpecialties(list);
      }
    });
  }, []);

  // Dynamically include any custom specialties filled by therapists into dropdown options
  const dynamicSpecializationOptions = useMemo(() => {
    const set = new Set<string>(backendSpecialties);
    psychologists.forEach((p) => {
      if (Array.isArray(p.specialties)) {
        p.specialties.forEach((spec) => {
          if (spec && spec.trim()) set.add(spec.trim());
        });
      }
    });
    return Array.from(set);
  }, [backendSpecialties, psychologists]);

  // Debounce search query input (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce fee and experience sliders (400ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMaxFee(maxFee);
      setDebouncedMinExp(minExp);
    }, 400);
    return () => clearTimeout(timer);
  }, [maxFee, minExp]);

  // Reset page to 1 whenever debounced filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedSpec, debouncedMaxFee, debouncedMinExp, selectedLang, sortOption]);

  const fetchPsychologists = async () => {
    setLoading(true);
    try {
      const res = await getPsychologistsApi({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch.trim() || undefined,
        specialty: selectedSpec !== 'All Specializations' ? selectedSpec : undefined,
        minExperience: debouncedMinExp > 0 ? debouncedMinExp : undefined,
        maxFee: debouncedMaxFee < 50000 ? debouncedMaxFee : undefined,
        language: selectedLang !== 'All Languages' ? selectedLang : undefined,
        sort: sortOption,
      });

      const items = res?.psychologists || (Array.isArray(res) ? res : []);
      setPsychologists(items || []);

      if (res?.pagination) {
        setTotalRecords(res.pagination.totalRecords);
        setTotalPages(res.pagination.totalPages || 1);
      } else {
        setTotalRecords(items.length);
        setTotalPages(Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE)));
      }
    } catch (err) {
      console.error('Failed to fetch psychologists from backend API:', err);
      setPsychologists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsychologists();
  }, [debouncedSearch, selectedSpec, debouncedMaxFee, debouncedMinExp, selectedLang, sortOption, currentPage]);

  const handleBookClick = (therapist: PsychologistData) => {
    const tId = therapist.id || therapist._id;
    router.push(`/book/${tId}`);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const hasActiveFilters =
    searchQuery ||
    selectedSpec !== 'All Specializations' ||
    maxFee < 50000 ||
    minExp > 0 ||
    selectedLang !== 'All Languages';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSpec('All Specializations');
    setMaxFee(50000);
    setMinExp(0);
    setSelectedLang('All Languages');
    setSortOption('Experience: High to Low');
    setCurrentPage(1);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-secondary" />
            <span>Book a Session</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Find verified psychologists and schedule your consultation.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden px-3.5 py-1.5 rounded-xl bg-secondary text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Therapists</span>
        </button>
      </div>

      {/* Main Layout Grid: Compact Left Filter Box + Right Therapist Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* LEFT COLUMN: Compact Sidebar Filter Box */}
        <div className="hidden lg:block lg:col-span-1 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-4 sticky top-20 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-secondary" />
              <span>Filters</span>
            </h2>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[10px] font-extrabold text-rose-600 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">Search</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => setDebouncedSearch(searchQuery)}
                onKeyDown={(e) => e.key === 'Enter' && setDebouncedSearch(searchQuery)}
                placeholder="Name or specialty..."
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Specialization Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">Specialization</label>
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-secondary cursor-pointer"
            >
              {dynamicSpecializationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Max Session Fee Slider */}
          <div className="space-y-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px]">
            <div className="flex justify-between font-bold">
              <span className="text-slate-500">Max Fee:</span>
              <span className="text-primary font-extrabold">
                {maxFee >= 50000 ? '>₹50,000' : `₹${maxFee.toLocaleString()}`}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer h-1"
            />
          </div>

          {/* Min Experience Slider */}
          <div className="space-y-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px]">
            <div className="flex justify-between font-bold">
              <span className="text-slate-500">Min Experience:</span>
              <span className="text-secondary font-extrabold">{minExp} Yrs+</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={minExp}
              onChange={(e) => setMinExp(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer h-1"
            />
          </div>

          {/* Language Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">Language</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-secondary cursor-pointer"
            >
              {LANGUAGES_LIST.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Option */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">Sort Order</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-secondary cursor-pointer"
            >
              <option value="Experience: High to Low">Exp: High to Low</option>
              <option value="Experience: Low to High">Exp: Low to High</option>
              <option value="Rating: High to Low">Rating: High to Low</option>
            </select>
          </div>
        </div>

        {/* RIGHT COLUMN: Therapist Cards Grid (3 Columns x 3 Rows = 9 Cards) & Pagination */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              Showing <strong className="text-slate-900">{totalRecords === 0 ? 0 : startIndex + 1}</strong>–
              <strong className="text-slate-900">{Math.min(startIndex + ITEMS_PER_PAGE, totalRecords)}</strong> of{' '}
              <strong className="text-slate-900">{totalRecords}</strong> Therapists
            </span>

            <span className="font-bold text-secondary bg-tertiary/60 px-3 py-1 rounded-full border border-secondary/20">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4 animate-pulse">
                  <div className="h-44 bg-slate-200 rounded-2xl" />
                  <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                </div>
              ))}
            </div>
          ) : psychologists.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4 shadow-2xs">
              <UserCheck className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-lg">No Therapists Found</h3>
              <p className="text-xs text-slate-500">
                No specialists matched your filter criteria. Try clearing search or filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-secondary transition shadow-xs cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Cards Grid (3 Columns x 3 Rows = 9 Cards) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {psychologists.map((t) => {
                const tId = t.id || t._id || t.name;
                return (
                  <TherapistCard
                    key={tId}
                    therapist={t}
                    onBookClick={handleBookClick}
                    buttonText="Book a Session"
                  />
                );
              })}
            </div>
          )}

          {/* ALWAYS RENDER PAGINATION CONTROLS BAR (Even on Page 1 or with single page) */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-600">
              Page <strong className="text-slate-900">{currentPage}</strong> of{' '}
              <strong className="text-slate-900">{totalPages}</strong>
            </span>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
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
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end lg:hidden">
          <div className="flex-1" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="bg-white rounded-t-3xl p-5 space-y-3.5 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-secondary" />
                <h3 className="font-serif font-bold text-slate-900 text-sm">Filter Therapists</h3>
              </div>

              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-extrabold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Row 1: Full-Width Search Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Search Practitioner</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => setDebouncedSearch(searchQuery)}
                    onKeyDown={(e) => e.key === 'Enter' && setDebouncedSearch(searchQuery)}
                    placeholder="Search by name, title, or specialty..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Specialization & Language (2 cols) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Specialization</label>
                  <select
                    value={selectedSpec}
                    onChange={(e) => setSelectedSpec(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    {dynamicSpecializationOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Language</label>
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    {LANGUAGES_LIST.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Max Fee & Min Exp Sliders (2 cols) */}
              <div className="grid grid-cols-2 gap-2.5 text-[10px]">
                <div className="space-y-1 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-500">Max Fee:</span>
                    <span className="text-primary font-extrabold">
                      {maxFee >= 50000 ? '>₹50,000' : `₹${maxFee.toLocaleString()}`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={maxFee}
                    onChange={(e) => setMaxFee(Number(e.target.value))}
                    className="w-full accent-secondary cursor-pointer h-1"
                  />
                </div>

                <div className="space-y-1 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-500">Min Exp:</span>
                    <span className="text-secondary font-extrabold">{minExp} Yrs+</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={minExp}
                    onChange={(e) => setMinExp(Number(e.target.value))}
                    className="w-full accent-secondary cursor-pointer h-1"
                  />
                </div>
              </div>

              {/* Row 4: Sort Order Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Sort Order</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="Experience: High to Low">Exp: High to Low</option>
                  <option value="Experience: Low to High">Exp: Low to High</option>
                  <option value="Rating: High to Low">Rating: High to Low</option>
                </select>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-full bg-primary hover:bg-secondary text-white font-bold text-xs transition shadow-md cursor-pointer"
              >
                Apply Filters ({totalRecords} Practitioners)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
