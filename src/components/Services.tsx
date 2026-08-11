"use client";
import { Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const servicesData = [
  {
    title: "Anxiety & Stress",
    description: "Manage worry, panic attack & stress",
    href: "#",
  },
  {
    title: "Relationship Counselling",
    description: "Build healthy relationships",
    href: "#",
  },
  {
    title: "Child & Adolescent Therapy",
    description: "Support for kids, teens & young adults",
    href: "#",
  },
  {
    title: "Trauma & PTSD",
    description: "Heal from past experiences",
    href: "#",
  },
  {
    title: "Career & Personal Growth",
    description: "Navigate challenges & achieve your goals",
    href: "#",
  },
  {
    title: "Career & Personal Growth",
    description: "Navigate challenges & achieve your goals",
    href: "#",
  },
  {
    title: "Career & Personal Growth",
    description: "Navigate challenges & achieve your goals",
    href: "#",
  },
  {
    title: "Career & Personal Growth",
    description: "Navigate challenges & achieve your goals",
    href: "#",
  },
  {
    title: "Career & Personal Growth",
    description: "Navigate challenges & achieve your goals",
    href: "#",
  },
];

export default function Services() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <>

      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-12 mt-16">
        <span className="inline-block bg-secondary/10 text-foreground font-semibold text-xs tracking-wider uppercase rounded-full px-4 py-1.5 mb-4">
          What We Help With
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-secondary mb-4">
          Condition We Support
        </h2>
        <p className="text-foreground/70 max-w-2xl text-base md:text-lg">
          We provide specialized therapy for a wide range of emotional and mental health challenges.
        </p>
      </div>

      {/* Carousel controls */}
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={() => scroll("left")}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-black/5 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-black/5 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
        </button>
      </div>

      {/* Cards Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-4 lg:gap-5 no-scrollbar hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {servicesData.map((service, index) => (
          <div
            key={index}
            className="snap-start shrink-0 w-[240px] md:w-[220px] lg:w-[calc(20%-16px)] bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex flex-col items-center text-center transition-transform hover:-translate-y-1"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-5">
              <Star className="w-8 h-8 text-[#8ba89f]" fill="currentColor" />
            </div>

            {/* Content */}
            <h3 className="font-bold text-lg text-foreground mb-2 leading-tight">{service.title}</h3>
            <p className="text-xs text-foreground/60 mb-6 leading-relaxed flex-grow">{service.description}</p>

            {/* Link */}
            <Link
              href={service.href}
              className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary/80 transition-colors"
            >
              Learn more <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>

    </>
  );
}
