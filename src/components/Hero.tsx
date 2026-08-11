import Image from "next/image";
import { Video, Phone, User, CalendarDays, Search } from "lucide-react";
import Link from "next/link";
import SupportCard from "./SupportCard";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden pt-8 lg:pt-12">
      {/* Container wraps only the content, not the absolute image */}
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start max-w-2xl relative z-10 pb-12 lg:pb-24">

            {/* Trust Badge */}
            <div className="inline-flex bg-white items-center gap-4  rounded-full py-2 px-4 pr-6 mb-8 shadow-sm">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-secondary">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Trusted by 10,000+ individuals
              </div>
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary"></div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-primary leading-[1.1] tracking-tight mb-6">
              You don&apos;t have to<br />face it alone.
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-foreground/60 mb-10 max-w-lg leading-relaxed">
              Compassionate, expert care for your<br />mental well-being.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto">
              <Link
                href="/book"
                className="w-full sm:w-auto flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-white transition-all hover:bg-secondary hover:shadow-lg"
              >
                <CalendarDays className="h-5 w-5" />
                Book a Session
              </Link>
              <Link
                href="/therapists"
                className="w-full sm:w-auto flex h-14 items-center justify-center gap-2 rounded-full border-2 border-primary bg-transparent px-8 text-base font-semibold text-primary transition-all hover:bg-primary/5"
              >
                <Search className="h-5 w-5" />
                Find the Right Therapist
              </Link>
            </div>

            {/* Availability Icons */}
            <div className="flex items-center gap-6 text-sm font-medium text-foreground/70 flex-wrap">
              <span className="text-foreground font-semibold">Available on:</span>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Video Call</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Phone Call</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>In-Person</span>
              </div>
            </div>

          </div>

          {/* Right Column: Spacer for Desktop Layout */}
          <div className="hidden lg:block w-full h-[500px] lg:h-[600px]"></div>

        </div>
      </div>

      {/* The Image (Absolutely positioned to bleed to the right edge of the container) */}
      <div className="lg:absolute lg:top-0 lg:right-0 lg:w-1/2 lg:h-[600px] w-full h-[500px] relative z-0 mt-8 lg:mt-0">
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
        <SupportCard className="absolute left-4 lg:left-[100px] bottom-8 lg:bottom-5 z-10 " />
      </div>
    </section>
  );
}
