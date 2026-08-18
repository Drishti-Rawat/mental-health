"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  Heart,
  Award,
  Smile,
  Star,
  Briefcase,
  HeartHandshake,
  Mail
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import TherapistCard from "@/components/common/TherapistCard";
import { getPsychologistsApi, PsychologistData } from "@/services/psychologistApi";

const FEATURE_BADGES = [
  {
    icon: Users,
    title: "Experienced Psychologists",
  },
  {
    icon: ShieldCheck,
    title: "Evidence-Based Approach",
  },
  {
    icon: Lock,
    title: "Safe & Confidential Environment",
  },
  {
    icon: Sparkles,
    title: "Personalized Care",
  },
];

const STATS = [
  {
    icon: Users,
    value: "10,000+",
    label: "Sessions Conducted",
  },
  {
    icon: Users,
    value: "30+",
    label: "Expert Therapists",
  },
  {
    icon: Briefcase,
    value: "7+",
    label: "Years of Experience",
  },
  {
    icon: Star,
    value: "4.8/5",
    label: "Google Rating",
  },
  {
    icon: Smile,
    value: "98%",
    label: "Client Satisfaction",
  },
];

const VALUES = [
  {
    title: "Compassion",
    icon: Heart,
    description: "We listen, we care, and we walk with you every step of the way.",
  },
  {
    title: "Trust & Confidentiality",
    icon: ShieldCheck,
    description: "Your privacy is our priority. Every session is 100% confidential.",
  },
  {
    title: "Empathy",
    icon: Users,
    description: "We put ourselves in your shoes to truly understand you.",
  },
  {
    title: "Excellence",
    icon: Award,
    description: "We use proven methods and continuous learning to deliver the best care.",
  },
  {
    title: "Respect",
    icon: HeartHandshake,
    description: "We honor your feelings, choices, and journey without judgment.",
  },
];

export default function AboutPage() {
  const [therapists, setTherapists] = useState<PsychologistData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const res = await getPsychologistsApi({ limit: 4 });
        const items = Array.isArray(res)
          ? res
          : res?.psychologists || (res as any)?.data || [];

        if (items && items.length > 0) {
          setTherapists(items.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch real therapist data for About page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-800 font-sans">
      <main className="flex-1 pb-16 space-y-20 sm:space-y-28">

        {/* 1. HERO SECTION */}
        <section className="relative bg-background pt-8 sm:pt-12 pb-16 sm:pb-24 min-h-[480px] sm:min-h-[520px] flex items-center">
          {/* Background Hero Photo (/about-hero.jpg) on Right */}
          <div className="absolute inset-y-0 right-0 w-full lg:w-7/12 h-full pointer-events-none z-0 overflow-hidden">
            <img
              src="/about-hero.jpg"
              alt="MentalCare Consultation"
              className="w-full h-full object-cover object-right"
            />
            {/* Soft Left Gradient Fade Mask */}
            <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-background via-background/60 via-35% to-transparent" />
          </div>

          <div className="site-container relative z-10 w-full">
            <div className="max-w-3xl lg:max-w-4xl space-y-6">
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary tracking-tight leading-[1.12]">
                About <span className="text-secondary">MentalCare</span>
              </h1>

              {/* Subheading */}
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal">
                We are a team of compassionate psychologists committed to helping you overcome life's challenges and improve your mental well-being.
              </p>

              {/* 4 Feature Badges Pill Bar (Using Theme Colors) */}
              <div className="inline-flex flex-wrap lg:flex-nowrap items-center gap-4 sm:gap-6 px-6 py-4 sm:py-10 rounded-4xl bg-tertiary/60  shadow-2xs">
                {FEATURE_BADGES.map((badge, idx) => {
                  const IconComp = badge.icon;
                  return (
                    <React.Fragment key={idx}>
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-tertiary text-secondary flex items-center justify-center shrink-0 border border-secondary/15">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-[13px] font-bold text-primary leading-tight max-w-[135px]">
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

          {/* Floating Quote Box */}
          <div className="absolute -bottom-10 sm:-bottom-14 lg:-bottom-16 right-4 sm:right-10 lg:right-20 z-20 max-w-sm">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-2">
              <span className="text-3xl text-secondary font-serif leading-none block">“</span>
              <p className="text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed">
                Our mission is to create a safe space where healing begins, hope grows, and lives transform.
              </p>
            </div>
          </div>
        </section>

        {/* 2. OUR STORY SECTION */}
        <section className="site-container pt-8 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Image / Wall Art Artwork */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-slate-100 h-[360px] sm:h-[420px] relative">
                <img
                  src="/about-story.jpg"
                  alt="Warm therapeutic chair with MentalCare logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Copy */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary block">
                OUR STORY
              </span>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary leading-tight">
                A Friend in Need, Always by Your Side
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  MentalCare was founded with a simple yet powerful belief – no one should have to face their struggles alone.
                </p>
                <p>
                  Life can be overwhelming at times, and seeking help is a courageous first step. Our team of licensed psychologists and mental health professionals provide compassionate care, evidence-based therapies, and practical tools to help you lead a healthier, happier life.
                </p>
                <p>
                  Whether you're dealing with anxiety, stress, relationships, or any other challenge, we are here to walk with you on your journey toward healing and growth.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/psychologists"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-secondary text-white text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
                >
                  <span>Our Therapists</span>
                  <ArrowRight className="w-4 h-4 text-tertiary" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. KEY STATS BAR */}
        <section className="site-container">
          <div className="bg-tertiary  rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-secondary/20">
              {STATS.map((stat, i) => {
                const IconComp = stat.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3.5 ${i > 0 ? "pt-4 sm:pt-0 sm:pl-4" : ""}`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white text-secondary flex items-center justify-center shrink-0 border border-secondary/15 shadow-2xs">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold font-serif text-primary leading-none">
                        {stat.value}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. OUR VALUES SECTION */}
        <section className="site-container space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">
              OUR VALUES
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary">
              What Drives Us Every Day
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Our values shape the care we provide and the relationships we build.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {VALUES.map((v, i) => {
              const IconComp = v.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-2xs hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-tertiary text-secondary flex items-center justify-center shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif font-bold text-primary text-lg">{v.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {v.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>



        {/* 5. A TEAM YOU CAN TRUST */}
        <section className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Copy & CTA */}
            <div className="lg:col-span-4 space-y-5 pt-2">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary block">
                A TEAM YOU CAN TRUST
              </span>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary leading-tight">
                Meet Our Compassionate Team
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our team of experienced psychologists brings diverse expertise and a shared passion for helping people heal and thrive.
              </p>

              <div className="pt-2">
                <Link
                  href="/psychologists"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-secondary text-white text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
                >
                  <span>View All Therapists</span>
                  <ArrowRight className="w-4 h-4 text-tertiary" />
                </Link>
              </div>
            </div>

            {/* Right Dynamic Real Therapist Cards Preview Grid (without Book button) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {therapists?.map((t, i) => (
                <TherapistCard
                  key={t.id || t._id || i}
                  therapist={t}
                  showBookButton={false}
                  compact={true}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 6. BOTTOM BANNER CTA */}
        <section className="site-container">
          <div className="bg-primary text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            {/* Left Content */}
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-tertiary flex items-center justify-center shrink-0 border border-white/15">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Ready to Take the First Step?
                </h3>
                <p className="text-xs sm:text-sm text-[#F1F8F3]/90 max-w-xl">
                  We're here to support you on your journey toward better mental well-being.
                </p>
              </div>
            </div>

            {/* Right Button */}
            <div className="shrink-0">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary hover:bg-slate-100 font-semibold text-xs sm:text-sm transition shadow-sm cursor-pointer"
              >
                <span>Book Your Session</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
