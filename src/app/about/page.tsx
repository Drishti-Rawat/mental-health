"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Award,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Lock,
  Globe,
  Star,
  Clock,
  MessageSquare,
  CalendarDays,
  Target,
  Smile,
  ChevronRight,
  HeartHandshake,
  Shield,
  Activity,
  Check,
  Compass,
  Lightbulb,
  Milestone
} from "lucide-react";
import Footer from "@/components/layout/Footer";

const CORE_VALUES = [
  {
    id: "compassion",
    title: "Compassionate Care",
    icon: Heart,
    color: "bg-rose-500",
    lightBg: "bg-rose-50/70",
    textColor: "text-rose-600",
    borderColor: "border-rose-200/80",
    badge: "Empathy First",
    description:
      "Empathy is at the core of everything we do. We build safe, non-judgmental environments for every client to heal, reflect, and grow.",
    highlights: [
      "Non-judgmental, empathetic listener network",
      "Tailored therapeutic approaches for every individual",
      "Culturally sensitive care for diverse backgrounds"
    ]
  },
  {
    id: "excellence",
    title: "Clinical Excellence",
    icon: Award,
    color: "bg-secondary",
    lightBg: "bg-emerald-50/70",
    textColor: "text-secondary",
    borderColor: "border-emerald-200/80",
    badge: "Accredited Specialists",
    description:
      "We partner strictly with licensed, accredited clinical psychologists to ensure evidence-based therapeutic treatment.",
    highlights: [
      "Rigorous credential verification for all specialists",
      "Evidence-based therapies (CBT, DB, Mindfulness)",
      "Continuous professional clinical development"
    ]
  },
  {
    id: "privacy",
    title: "Uncompromising Privacy",
    icon: ShieldCheck,
    color: "bg-amber-500",
    lightBg: "bg-amber-50/70",
    textColor: "text-amber-600",
    borderColor: "border-amber-200/80",
    badge: "100% Confidential",
    description:
      "Your trust is sacred. All client consultations and records are protected by bank-grade encryption and strict privacy standards.",
    highlights: [
      "End-to-end encrypted consultation environment",
      "HIPAA-compliant data protection protocols",
      "Complete client anonymity controls"
    ]
  },
  {
    id: "accessibility",
    title: "Universal Accessibility",
    icon: Globe,
    color: "bg-blue-500",
    lightBg: "bg-blue-50/70",
    textColor: "text-blue-600",
    borderColor: "border-blue-200/80",
    badge: "Care Anywhere",
    description:
      "Mental health support should be seamless and accessible to everyone, anywhere, without financial or geographical barriers.",
    highlights: [
      "Flexible online video & chat session options",
      "Transparent, accessible consultation rates",
      "Multi-lingual therapy support across regions"
    ]
  }
];

const JOURNEY_MILESTONES = [
  {
    number: "01",
    stage: "The Spark: Why We Started",
    title: "Bridging the Mental Healthcare Gap",
    description:
      "We observed how difficult it was for individuals seeking help to find verified, empathetic clinical psychologists without social stigma or friction.",
    icon: Lightbulb
  },
  {
    number: "02",
    stage: "Building Trust & Integrity",
    title: "RCI Credential Auditing First",
    description:
      "We established a rigorous verification framework for licensed psychologists, ensuring clients connect with authentic, evidence-based practitioners.",
    icon: ShieldCheck
  },
  {
    number: "03",
    stage: "Expanding Access & Empathy",
    title: "Care Without Boundaries",
    description:
      "We launched end-to-end encrypted online sessions, multi-lingual consultations, and flexible schedules to make therapy accessible to everyone.",
    icon: HeartHandshake
  },
  {
    number: "04",
    stage: "The Road Ahead",
    title: "Continuous Clinical Innovation",
    description:
      "We remain committed to destigmatizing mental health, empowering licensed therapists, and delivering compassionate care to every home.",
    icon: Compass
  }
];

const LEADERSHIP_TEAM = [
  {
    name: "Dr. Ananya Roy",
    role: "Chief Clinical Officer & Co-Founder",
    credentials: "Ph.D. in Clinical Psychology, 15+ Yrs Exp.",
    image: "/therapist.png",
    bio: "Pioneer in Cognitive Behavioral Therapy and adolescent mental wellness. Dedicated to making mental health care accessible to all."
  },
  {
    name: "Dr. Vikramaditya Sen",
    role: "Head of Psychiatric Care",
    credentials: "MD Psychiatry, M.Phil RCI Practitioner",
    image: "/hero.png",
    bio: "Specialist in trauma recovery, anxiety management, and mindfulness-based stress reduction techniques."
  },
  {
    name: "Kavita Rao",
    role: "Director of Client Experience",
    credentials: "M.Sc. Counseling Psychology",
    image: "/therapist.png",
    bio: "Focuses on client care matching algorithms, ensuring every individual finds the ideal therapist tailored to their personal needs."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-foreground font-sans">
      <main className="flex-1 pb-16">
        {/* Warm Luxury Journey Hero Section */}
        <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white overflow-hidden border-b border-slate-200/60">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-200/30 via-teal-200/20 to-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

          <div className="site-container relative z-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column Text Content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-secondary border border-secondary/20 text-xs font-bold uppercase tracking-wider shadow-2xs">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Our Story & Mission
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-slate-900 leading-[1.15]">
                  Making Healthcare <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-emerald-700 to-teal-800">
                    Empathetic & Human.
                  </span>
                </h1>

                <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Founded with a vision to break mental health stigmas, MentalCare connects individuals with verified clinical psychologists in a safe, judgment-free space.
                </p>

                {/* Feature Bullet Pills */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-bold text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
                    <Check className="w-4 h-4 text-secondary shrink-0" />
                    <span>Empathy-First Care</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
                    <Check className="w-4 h-4 text-secondary shrink-0" />
                    <span>RCI Audited Psychologists</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
                    <Check className="w-4 h-4 text-secondary shrink-0" />
                    <span>100% Confidential Environment</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
                  <a
                    href="#journey"
                    className="px-7 py-3.5 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Read Our Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <Link
                    href="/psychologists"
                    className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs transition cursor-pointer"
                  >
                    Explore Therapists
                  </Link>
                </div>
              </div>

              {/* Right Column Image Showcase */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Main Hero Image Frame */}
                  <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 h-[380px] sm:h-[430px] relative">
                    <img
                      src="/about-hero.jpg"
                      alt="Compassionate Mental Care Consultation"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 text-white p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20">
                      <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                        <Heart className="w-4 h-4 shrink-0" />
                        <span>Compassionate Healing</span>
                      </div>
                      <p className="text-[11px] text-slate-200 mt-0.5">Creating safe spaces for emotional well-being and growth.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story & Purpose Section */}
        <section id="journey" className="site-container py-16 sm:py-24 max-w-5xl mx-auto scroll-mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story Copy */}
            <div className="space-y-6">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider border border-secondary/20">
                Why We Started
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground leading-tight">
                Destigmatizing Therapy & Restoring Peace of Mind
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                MentalCare was born out of a profound realization: seeking psychological support should be as natural and accessible as visiting a healthcare professional.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Too often, individuals struggling with anxiety, grief, burnout, or emotional distress encounter barriers—ranging from difficulty finding licensed specialists to privacy concerns. We built MentalCare to eliminate those obstacles entirely.
              </p>

              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Matching Every Individual with the Right Care</h4>
                    <p className="text-[11px] text-slate-500">Filter clinical specialists by therapy domain, language, and personal comfort.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Unlocking Practitioner Empowerment</h4>
                    <p className="text-[11px] text-slate-500">Empowering clinical psychologists to manage private practices and connect with clients effortlessly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Image Showcase */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 h-80 sm:h-96 relative">
                <img
                  src="/about-story.jpg"
                  alt="Warm Clinical Consultation Atmosphere"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <p className="text-xs font-medium text-white/90 italic">
                      "Our focus has always been simple: put the client's emotional safety and clinical integrity above everything else."
                    </p>
                    <span className="text-[11px] font-bold text-emerald-200 block">— Our Founding Clinical Team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive 4-Chapter Journey Timeline */}
        <section className="bg-white py-16 sm:py-24 border-y border-slate-200/60 shadow-2xs">
          <div className="site-container max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider border border-secondary/20">
                Milestones & Evolution
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
                The Story of Our Growth
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                How we built a trusted network connecting individuals with clinical excellence.
              </p>
            </div>

            {/* Timeline Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {JOURNEY_MILESTONES.map((m) => {
                const IconComp = m.icon;
                return (
                  <div
                    key={m.number}
                    className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                          {m.number}
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-secondary flex items-center justify-center shadow-2xs">
                          <IconComp className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.stage}</span>
                        <h3 className="font-bold text-foreground text-base font-serif">{m.title}</h3>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4 Core Values Grid Section */}
        <section className="site-container py-16 sm:py-24 max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider border border-secondary/20">
              Pillars of Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
              Our Core Clinical Values
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The foundational principles behind our practitioner network and client care standards.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CORE_VALUES.map((val) => {
              const IconComp = val.icon;
              return (
                <div
                  key={val.id}
                  className={`rounded-3xl p-7 border transition-all duration-300 ${val.lightBg} ${val.borderColor} shadow-2xs space-y-4 hover:shadow-md hover:-translate-y-0.5`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${val.color} text-white flex items-center justify-center shadow-xs`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-white border ${val.borderColor} ${val.textColor}`}>
                      {val.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground font-serif">{val.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {val.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-slate-200/60">
                    {val.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CheckCircle2 className={`w-4 h-4 ${val.textColor} shrink-0`} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Clinical Leadership Showcase */}
        <section className="bg-white py-16 sm:py-24 border-t border-slate-200/60 shadow-2xs">
          <div className="site-container max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider border border-secondary/20">
                Expert Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
                Our Clinical Leadership
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Guided by experienced mental health practitioners and clinical psychologists committed to client well-being.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {LEADERSHIP_TEAM.map((member, i) => (
                <div
                  key={i}
                  className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4 hover:shadow-md transition text-center"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-slate-200 border-2 border-secondary/30 shadow-xs relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground text-base">{member.name}</h3>
                    <p className="text-xs font-bold text-secondary">{member.role}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{member.credentials}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-200/60">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dual Call-to-Action Banners */}
        <section className="site-container py-14 max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seeking Support CTA */}
            <div className="bg-gradient-to-br from-primary via-secondary to-[#0F3D2B] text-white rounded-3xl p-8 shadow-lg relative overflow-hidden space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-white/15">
                  Seeking Therapy?
                </span>
                <h3 className="text-2xl font-bold font-serif text-white">Start Your Wellness Journey</h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Browse our directory of verified clinical psychologists and book a confidential consultation today.
                </p>
              </div>

              <div>
                <Link
                  href="/psychologists"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-secondary font-bold text-xs sm:text-sm hover:bg-slate-100 transition shadow-sm cursor-pointer"
                >
                  <span>Explore Therapists</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Practitioner CTA */}
            <div className="bg-gradient-to-br from-slate-900 via-secondary to-slate-900 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-white/15">
                  For Therapists
                </span>
                <h3 className="text-2xl font-bold font-serif text-white">Join Our Practitioner Network</h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Licensed clinical psychologist or counselor? Expand your practice and connect with clients seeking care.
                </p>
              </div>

              <div>
                <Link
                  href="/join-as-therapist"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm hover:bg-emerald-600 transition shadow-sm cursor-pointer"
                >
                  <span>Apply as Therapist</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
