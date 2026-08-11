"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";

const articlesData = [
  {
    category: "Anxiety",
    date: "May 12, 2024",
    title: "How to Manage Anxiety in Daily Life",
    image: "/hero.png", // Using placeholder image for now
    href: "#",
  },
  {
    category: "Self Care",
    date: "May 8, 2024",
    title: "Self-Care Tips for a Healthier Mind",
    image: "/hero.png",
    href: "#",
  },
  {
    category: "Relationships",
    date: "May 5, 2024",
    title: "Effective Communication in Relationships",
    image: "/hero.png",
    href: "#",
  },
  {
    category: "Depression",
    date: "May 1, 2024",
    title: "Signs of Depression You Shouldn't Ignore",
    image: "/hero.png",
    href: "#",
  },
];

export default function Resources() {
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-16">
        <div className="flex flex-col items-start text-left">
          <span className="inline-block bg-secondary/10 text-foreground font-semibold text-[11px] tracking-wider uppercase rounded-full px-4 py-1.5 mb-4">
            From Our Blog
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-secondary mb-4">
            Resources for your well being
          </h2>
          <p className="text-foreground/70 text-base md:text-lg">
            Insights, tips & guidance from our mental health experts.
          </p>
        </div>
        <button className="shrink-0 px-6 py-2.5 rounded-full border-2 border-secondary text-secondary font-semibold hover:bg-tertiary transition-colors cursor-pointer">
          View All Articles
        </button>
      </div>

      {/* Articles Carousel */}
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-6 no-scrollbar hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {articlesData.map((article, index) => (
            <div
              key={index}
              className="snap-start shrink-0 w-[280px] md:w-[320px] lg:w-[calc(25%-18px)] bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-black/[0.03] overflow-hidden flex flex-col group/card transition-transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="w-full h-[180px] relative overflow-hidden bg-gray-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-[11px] font-medium text-foreground/40">
                    {article.date}
                  </span>
                </div>
                
                <h3 className="font-bold text-foreground text-[15px] leading-snug mb-6 flex-grow">
                  {article.title}
                </h3>
                
                <Link
                  href={article.href}
                  className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary/80 transition-colors"
                >
                  Read More <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-black/5 flex items-center justify-center text-foreground hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0 z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-black/5 flex items-center justify-center text-foreground hover:bg-gray-50 transition-colors opacity-100 z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
