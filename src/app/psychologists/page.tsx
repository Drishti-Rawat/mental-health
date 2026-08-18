"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  CheckCircle2,
  Heart,
  ChevronDown,
  ShieldCheck,
  Briefcase,
  Users,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import TherapistCard from "@/components/common/TherapistCard";
import { useAuth } from "@/context/AuthContext";
import { getPsychologistsApi, PsychologistData } from "@/services/psychologistApi";

const POPULAR_SEARCHES = [
  "Anxiety",
  "Depression",
  "Relationship",
  "Child Therapy",
  "Trauma",
  "Stress Management",
];

const SPECIALIZATION_OPTIONS = [
  "All Specializations",
  "Anxiety",
  "Depression",
  "Relationship",
  "Child Therapy",
  "Trauma",
  "Stress Management",
  "Self-Esteem",
  "Anger Management",
  "Addiction",
  "CBT Therapy",
  "Clinical Psychologist",
  "Consultant Psychologist",
  "Counselling Psychologist",
];

const LANGUAGES_LIST = [
  "Language",
  "English",
  "Hindi",
  "Hinglish",
  "Punjabi",
  "Bengali",
  "Tamil",
];

const FEATURE_BADGES = [
  {
    icon: UserCheck,
    title: "Verified & Experienced Professionals",
  },
  {
    icon: ShieldCheck,
    title: "Evidence-Based Therapies",
  },
  {
    icon: Lock,
    title: "Safe & Confidential Sessions",
  },
  {
    icon: Sparkles,
    title: "Personalized Care",
  },
];

export default function PsychologistsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [psychologists, setPsychologists] = useState<PsychologistData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All Specializations");
  const [selectedLang, setSelectedLang] = useState("Language");
  const [sortOption, setSortOption] = useState("Experience: High to Low");

  // Guest Login Prompt Modal State
  const [selectedTherapistForBooking, setSelectedTherapistForBooking] = useState<PsychologistData | null>(null);

  const fetchPsychologists = async () => {
    setLoading(true);
    try {
      const activeSpecialty = selectedSpec !== "All Specializations" ? selectedSpec : undefined;

      const res = await getPsychologistsApi({
        limit: 50,
        search: searchQuery.trim() || undefined,
        specialty: activeSpecialty,
      });

      const items = Array.isArray(res)
        ? res
        : res?.psychologists || (res as any)?.data || [];

      setPsychologists(items || []);
    } catch (err) {
      console.error("Failed to fetch psychologists from backend:", err);
      setPsychologists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsychologists();
  }, [searchQuery, selectedSpec]);

  const handleBookClick = (therapist: PsychologistData) => {
    if (!user) {
      setSelectedTherapistForBooking(therapist);
    } else {
      const tId = therapist.id || therapist._id;
      router.push(`/book?therapistId=${tId}`);
    }
  };

  // Filter & Sort Logic
  const filteredTherapists = useMemo(() => {
    return psychologists.filter((p) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesSpec = Array.isArray(p.specialties)
          ? p.specialties.some(s => s.toLowerCase().includes(q))
          : false;
        if (!matchesName && !matchesTitle && !matchesSpec) return false;
      }

      // Specialization filter (Matches against specialties array or title)
      if (selectedSpec !== "All Specializations") {
        const specQ = selectedSpec.toLowerCase();
        const specsArr = Array.isArray(p.specialties) ? p.specialties : [];
        const matchesSpec = specsArr.some(s => s.toLowerCase().includes(specQ));
        const matchesTitle = p.title?.toLowerCase().includes(specQ);
        if (!matchesSpec && !matchesTitle) return false;
      }

      // Language filter
      if (selectedLang !== "Language") {
        const langs = Array.isArray(p.languages) ? p.languages : [];
        if (!langs.some(l => l.toLowerCase().includes(selectedLang.toLowerCase()))) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === "Experience: High to Low") {
        return (b.experienceYears || 0) - (a.experienceYears || 0);
      } else if (sortOption === "Experience: Low to High") {
        return (a.experienceYears || 0) - (b.experienceYears || 0);
      } else if (sortOption === "Rating: High to Low") {
        return (b.rating || 4.5) - (a.rating || 4.5);
      }
      return 0;
    });
  }, [psychologists, searchQuery, selectedSpec, selectedLang, sortOption]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-800 font-sans">
      <main className="flex-1 pb-16 space-y-12 sm:space-y-16">

        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-background pt-8 sm:pt-12 pb-16 sm:pb-24 min-h-[500px] sm:min-h-[560px] flex items-center">
          {/* Background Hero Photo (/about-hero.jpg) on Right */}
          <div className="absolute inset-y-0 right-0 w-full lg:w-7/12 h-full pointer-events-none z-0 overflow-hidden">
            <img
              src="/about-hero.jpg"
              alt="Clinical Psychologist Consultation"
              className="w-full h-full object-cover object-right"
            />
            {/* Soft Left Gradient Fade Mask */}
            <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-background via-background/50 via-35% to-transparent" />
          </div>

          <div className="site-container relative z-10 w-full">
            <div className="max-w-3xl lg:max-w-4xl space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary tracking-tight leading-[1.12]">
                Our Compassionate <br className="hidden sm:inline" />
                <span className="text-secondary">Therapists</span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal">
                Meet our team of experienced psychologists committed to helping you heal, grow, and live a happier life.
              </p>

              {/* 4 Feature Badges Pill Bar */}
              <div className="inline-flex flex-wrap lg:flex-nowrap items-center gap-4 sm:gap-6 px-6 py-4.5 sm:py-10 rounded-4xl bg-tertiary/50 shadow-2xs">
                {FEATURE_BADGES.map((badge, idx) => {
                  const IconComp = badge.icon;
                  return (
                    <React.Fragment key={idx}>
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-tertiary text-secondary flex items-center justify-center shrink-0 border border-secondary/15">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-[13px] font-bold text-primary leading-tight max-w-[165px]">
                          {badge.title}
                        </span>
                      </div>
                      {idx < FEATURE_BADGES.length - 1 && (
                        <div className="hidden lg:block h-7 w-px bg-secondary/20" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 2. SEARCH & MULTI-FILTER CARD BAR */}
        <section className="site-container">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            {/* Filter Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
              {/* Search Text Input */}
              <div className="lg:col-span-5 relative">
                <input
                  type="text"
                  placeholder="Search therapist name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchPsychologists();
                  }}
                  className="w-full h-11 pl-10 pr-8 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-secondary transition placeholder:text-slate-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Specialization Select */}
              <div className="lg:col-span-3 relative">
                <select
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="w-full h-11 px-4 pr-9 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-secondary cursor-pointer"
                >
                  {SPECIALIZATION_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Language Select */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full h-11 px-4 pr-9 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-secondary cursor-pointer"
                >
                  {LANGUAGES_LIST.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Search Button */}
              <div className="lg:col-span-2">
                <button
                  onClick={() => fetchPsychologists()}
                  className="w-full h-11 rounded-2xl bg-primary hover:bg-secondary text-white font-semibold text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-tertiary" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Popular Searches Quick Filter Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 mr-2">Popular Searches:</span>
              {POPULAR_SEARCHES.map((tag) => {
                const isActive = selectedSpec === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedSpec(isActive ? "All Specializations" : tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${isActive
                      ? "bg-secondary text-white border-secondary"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. MAIN THERAPISTS DIRECTORY GRID */}
        <section className="site-container space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
              Meet Our Therapists
            </h2>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span>Sort by:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="h-9 px-3 pr-8 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-secondary cursor-pointer shadow-2xs"
                >
                  <option value="Experience: High to Low">Experience: High to Low</option>
                  <option value="Experience: Low to High">Experience: Low to High</option>
                  <option value="Rating: High to Low">Rating: High to Low</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTherapists.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
              <UserCheck className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-lg">No Therapists Found</h3>
              <p className="text-xs text-slate-500">
                No specialists matched your current filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSpec("All Specializations");
                  setSelectedLang("Language");
                }}
                className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-secondary transition shadow-xs cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTherapists.map((t) => {
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
        </section>

        {/* 4. DEDICATED JOIN AS THERAPIST CTA BANNER */}
        <section className="site-container">
          <div className="bg-gradient-to-r from-primary via-secondary to-primary text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-secondary/30">
            {/* Background Decorative Accent */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-tertiary text-xs font-bold uppercase tracking-wider border border-white/15 backdrop-blur-xs">
                <HeartHandshake className="w-3.5 h-3.5" /> Practitioners Network
              </span>

              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                Are You a Licensed Mental Health Professional?
              </h2>

              <p className="text-xs sm:text-sm text-tertiary/90 leading-relaxed">
                Join our accredited network of clinical psychologists and counsellors. Expand your digital practice, streamline appointment scheduling, and deliver life-changing therapy to clients nationwide.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-tertiary font-semibold pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-tertiary" />
                  <span>Flexible Working Hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-tertiary" />
                  <span>Verified Client Referrals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-tertiary" />
                  <span>Seamless Tele-health Platform</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href="/join-as-therapist"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-tertiary hover:bg-tertiary/80 text-primary font-bold text-xs sm:text-sm transition shadow-lg cursor-pointer"
              >
                <span>Join as Therapist</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. WHY CHOOSE OUR THERAPISTS SECTION */}
        <section className="site-container">
          <div className="bg-tertiary border border-secondary/20 rounded-3xl p-8 sm:p-12 space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                WHY CHOOSE OUR THERAPISTS?
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary">
                Expert Care You Can Trust
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-secondary flex items-center justify-center shrink-0 border border-secondary/15 shadow-2xs">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-primary text-base">Highly Qualified</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Our therapists are licensed professionals with advanced training.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-secondary flex items-center justify-center shrink-0 border border-secondary/15 shadow-2xs">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-primary text-base">Compassionate Approach</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    We listen, understand, and support you at every step.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-secondary flex items-center justify-center shrink-0 border border-secondary/15 shadow-2xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-primary text-base">Proven Methods</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    We use evidence-based therapies tailored to you.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-secondary flex items-center justify-center shrink-0 border border-secondary/15 shadow-2xs">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-primary text-base">Ongoing Support</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    We are here beyond sessions, for your long-term well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. BOTTOM BANNER CTA */}
        <section className="site-container">
          <div className="bg-primary text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            {/* Left Content */}
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-tertiary flex items-center justify-center shrink-0 border border-white/15">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Not sure who to choose?
                </h3>
                <p className="text-xs sm:text-sm text-[#F1F8F3]/90 max-w-xl">
                  We'll help match you with the right therapist for your needs.
                </p>
              </div>
            </div>

            {/* Right Button */}
            <div className="shrink-0">
              <Link
                href="/psychologists"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary hover:bg-slate-100 font-semibold text-xs sm:text-sm transition shadow-sm cursor-pointer"
              >
                <span>Find the Right Therapist</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
            </div>
          </div>
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
              <h3 className="font-bold text-slate-900 text-xl font-serif">Sign In Required</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Please sign in to schedule a session with{" "}
                <span className="font-bold text-secondary">{selectedTherapistForBooking.name}</span>.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                href="/login"
                className="w-full py-3 rounded-full bg-primary hover:bg-secondary text-white font-bold text-xs transition shadow-2xs block text-center"
              >
                Sign In
              </Link>

              <button
                onClick={() => setSelectedTherapistForBooking(null)}
                className="w-full py-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
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
