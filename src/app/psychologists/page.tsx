"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Award,
  Calendar,
  Sparkles,
  UserCheck,
  Globe,
  DollarSign,
  User,
  ArrowRight,
  X,
  Lock,
  HeartHandshake,
  CheckCircle2
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { getPsychologistsApi, PsychologistData } from "@/services/psychologistApi";

const SPECIALTIES = [
  "All",
  "Anxiety",
  "Depression",
  "Relationships",
  "CBT",
  "Trauma",
  "Mindfulness",
  "Stress Management",
  "Family Therapy",
];

export default function PsychologistsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [psychologists, setPsychologists] = useState<PsychologistData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Guest Login Prompt Modal State
  const [selectedTherapistForBooking, setSelectedTherapistForBooking] = useState<PsychologistData | null>(null);

  const fetchPsychologists = async () => {
    setLoading(true);
    try {
      // Guest limit: Fetch 10 therapists all at once for public guest view
      const requestedLimit = !user ? 10 : 9;

      const res = await getPsychologistsApi({
        page: currentPage,
        limit: requestedLimit,
        search: search.trim() || undefined,
        specialty: selectedSpecialty !== "All" ? selectedSpecialty : undefined,
      });

      const items = Array.isArray(res)
        ? res
        : res?.psychologists || (res as any)?.data || [];

      if (items && items.length > 0) {
        // Enforce max 10 total items cap for guest users
        const displayedItems = !user ? items.slice(0, 10) : items;
        setPsychologists(displayedItems);

        const apiTotalPages = res?.pagination?.totalPages || Math.ceil(items.length / requestedLimit) || 1;
        setTotalPages(!user ? 1 : apiTotalPages);
      } else {
        setPsychologists([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch psychologists from backend:", err);
      setPsychologists([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsychologists();
  }, [currentPage, selectedSpecialty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPsychologists();
  };

  const handleBookClick = (therapist: PsychologistData) => {
    if (!user) {
      // Show guest login prompt modal
      setSelectedTherapistForBooking(therapist);
    } else {
      // User is logged in, navigate to patient booking page
      const tId = therapist.id || therapist._id;
      router.push(`/patient/book?therapistId=${tId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-primary via-secondary to-[#0F3D2B] text-white py-14 sm:py-20 relative overflow-hidden">
          <div className="site-container relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <UserCheck className="w-3.5 h-3.5" /> Licensed Clinical Professionals
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-white">
              Our Compassionate Therapists
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Find verified clinical psychologists, counsellors, and mental health care specialists tailored to your personal wellness journey.
            </p>
          </div>
        </section>

        {/* Specialty Filter Chips */}
        <section className="site-container py-8 border-b border-slate-200/60 bg-white shadow-2xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
            {SPECIALTIES.map((spec) => (
              <button
                key={spec}
                onClick={() => {
                  setSelectedSpecialty(spec);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedSpecialty === spec
                    ? "bg-secondary text-white border-secondary shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </section>

        {/* Practitioner Onboarding CTA Banner */}
        <section className="site-container pt-8">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-tertiary rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shrink-0 shadow-xs">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-secondary text-base sm:text-lg">Are You a Licensed Mental Health Practitioner?</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Join our verified clinical care network to expand your practice, manage client appointments, and deliver impactful therapy.
                </p>
              </div>
            </div>

            <Link
              href="/join-as-therapist"
              className="shrink-0 px-6 py-3 rounded-2xl bg-secondary text-white font-bold text-xs sm:text-sm hover:bg-secondary/90 transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Join as Therapist</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Psychologists Directory Grid */}
        <section className="site-container py-10">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : psychologists.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-tertiary text-secondary flex items-center justify-center mx-auto border border-secondary/20">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-foreground text-lg">No Therapists Found</h3>
              <p className="text-xs text-slate-500">
                We couldn't find any approved therapists matching your search query or specialty filter.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedSpecialty("All");
                  setCurrentPage(1);
                }}
                className="px-5 py-2.5 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition shadow-2xs cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {psychologists.map((p) => {
                const pId = p.id || p._id;
                const specialtiesArr = Array.isArray(p.specialties)
                  ? p.specialties
                  : p.specialties
                  ? [p.specialties]
                  : ["General Therapy"];

                return (
                  <div
                    key={pId}
                    className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Avatar Header */}
                      <div className="relative h-48 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                        <img
                          src={p.image || "/therapist.png"}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-emerald-700 backdrop-blur-xs border border-emerald-200 shadow-2xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h2 className="font-bold text-foreground text-lg">{p.name}</h2>
                          <p className="text-xs font-semibold text-secondary">{p.title || "Clinical Psychologist"}</p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-600 border-y border-slate-100 py-3 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-secondary shrink-0" />
                            <span>{p.experienceYears || 0}+ Yrs Exp.</span>
                          </div>
                          {p.consultationFee && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>{p.currency || "$"}{p.consultationFee} / session</span>
                            </div>
                          )}
                        </div>

                        {/* Specialties Badges */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Specialties</span>
                          <div className="flex flex-wrap gap-1.5">
                            {specialtiesArr.map((spec, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-tertiary text-secondary border border-secondary/15"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Languages */}
                        {p.languages && p.languages.length > 0 && (
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <span>Languages: {Array.isArray(p.languages) ? p.languages.join(", ") : p.languages}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="p-6 pt-0 space-y-2">
                      <button
                        onClick={() => handleBookClick(p)}
                        className="w-full py-3 rounded-2xl bg-secondary text-white font-bold text-xs hover:bg-secondary/90 transition shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book a Session</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls (for authenticated multi-page browsing) */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 pt-10 pb-6">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(p - 1, 1));
                  window.scrollTo({ top: 350, behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => {
                    setCurrentPage(pg);
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    currentPage === pg
                      ? "bg-secondary text-white border-secondary shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(p + 1, totalPages));
                  window.scrollTo({ top: 350, behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

          {/* Simple Guest Sign In CTA Card Below Pagination */}
          {!user && (
            <div className="mt-4 bg-gradient-to-r from-slate-900 via-secondary to-slate-900 rounded-3xl p-8 sm:p-10 text-white text-center shadow-lg border border-secondary/30 relative overflow-hidden space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center mx-auto border border-white/20 backdrop-blur-xs">
                <Lock className="w-6 h-6" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                  Sign In to View More Therapists
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Please log in to your account to explore more therapists, check available schedules, and book a session.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-2xl bg-white text-secondary font-bold text-xs sm:text-sm hover:bg-slate-100 transition shadow-sm cursor-pointer"
                >
                  Sign In Now
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Guest Login Prompt Modal */}
      {selectedTherapistForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5 my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-tertiary text-secondary flex items-center justify-center mx-auto border border-secondary/20">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-xl">Sign In Required</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Please sign in to schedule a session with{" "}
                <span className="font-bold text-secondary">{selectedTherapistForBooking.name}</span>.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                href="/login"
                className="w-full py-3 rounded-2xl bg-secondary text-white font-bold text-xs hover:bg-secondary/90 transition shadow-2xs block text-center"
              >
                Sign In
              </Link>

              <button
                onClick={() => setSelectedTherapistForBooking(null)}
                className="w-full py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
