import Image from "next/image";
import { Video, Phone, User, CalendarDays, Search, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";
import Link from "next/link";
import SupportCard from "./SupportCard";
import TrustPillBadge from "./common/TrustPillBadge";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden pt-6 sm:pt-10 lg:pt-12 pb-8 lg:pb-0 bg-gradient-to-b from-tertiary/70 via-background/40 to-background lg:bg-none">
      {/* Container wraps content */}
      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center">

          {/* Left Column: Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0 relative z-10 pb-6 sm:pb-10 lg:pb-24">

            {/* Reusable Trust Pill Badge */}
            <TrustPillBadge className="mb-6 sm:mb-8" />

            {/* Main Heading */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary leading-[1.15] tracking-tight mb-4 sm:mb-6">
              You don&apos;t have to<br className="hidden sm:block" /> face it alone.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-foreground/70 mb-6 sm:mb-8 max-w-lg leading-relaxed">
              Compassionate, expert care tailored for your mental well-being in a safe & judgment-free space.
            </p>

            {/* Mobile Benefit Chips (Shown on small screens to enrich mobile hero) */}
            <div className="flex lg:hidden flex-wrap justify-center gap-2 mb-8 text-xs font-medium text-secondary">
              <span className="bg-white/80 border border-secondary/15 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Confidential
              </span>
              <span className="bg-white/80 border border-secondary/15 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-2xs">
                <HeartHandshake className="w-3.5 h-3.5" /> Licensed Experts
              </span>
              <span className="bg-white/80 border border-secondary/15 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" /> Online & In-Person
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
              <Link
                href="/book"
                className="w-full sm:w-auto flex h-12 sm:h-14 items-center justify-center gap-2 rounded-full bg-primary px-7 sm:px-8 text-base font-semibold text-white transition-all hover:bg-secondary hover:shadow-lg active:scale-95"
              >
                <CalendarDays className="h-5 w-5" />
                Book a Session
              </Link>
              <Link
                href="/therapists"
                className="w-full sm:w-auto flex h-12 sm:h-14 items-center justify-center gap-2 rounded-full border-2 border-primary bg-white/50 lg:bg-transparent px-7 sm:px-8 text-base font-semibold text-primary transition-all hover:bg-primary/5 active:scale-95"
              >
                <Search className="h-5 w-5" />
                Find Therapist
              </Link>
            </div>

            {/* Availability Icons */}
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-foreground/70 flex-wrap">
              <span className="text-foreground font-semibold">Available via:</span>
              <div className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-secondary" />
                <span>Video</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-secondary" />
                <span>Phone</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-secondary" />
                <span>In-Person</span>
              </div>
            </div>

            {/* Mobile Embedded Support Card */}
            <div className="block lg:hidden w-full mt-8 sm:mt-10">
              <SupportCard className="mx-auto max-w-full sm:max-w-md shadow-md bg-white border border-black/5" />
            </div>

          </div>

          {/* Right Column: Spacer for Desktop Layout */}
          <div className="hidden lg:block w-full h-[500px] lg:h-[600px]"></div>

        </div>
      </div>

      {/* Desktop Image & Floating Card */}
      <div className="hidden lg:block lg:absolute lg:top-0 lg:right-0 lg:w-1/2 lg:h-[600px] z-0">
        <Image
          src="/hero.png"
          alt="Hero Image"
          fill
          className="object-cover object-left"
          quality={100}
          unoptimized={true}
          priority
        />

        {/* Floating Support Card */}
        <SupportCard className="absolute left-[80px] xl:left-[100px] bottom-5 z-10 max-w-[320px]" />
      </div>
    </section>
  );
}
