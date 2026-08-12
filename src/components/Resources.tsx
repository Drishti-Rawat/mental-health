"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

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
  {
    category: "Depression",
    date: "May 1, 2024",
    title: "Signs of Depression You Shouldn't Ignore",
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
  {
    category: "Depression",
    date: "May 1, 2024",
    title: "Signs of Depression You Shouldn't Ignore",
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
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: true })
  );

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", duration: 20 },
    [autoplayPlugin.current]
  );

  return (
    <section>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12 mt-10 sm:mt-16">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="inline-block bg-secondary/10 text-secondary font-semibold text-[11px] tracking-wider uppercase rounded-full px-4 py-1.5 mb-3">
            From Our Blog
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-2">
            Resources for your well-being
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base lg:text-lg">
            Insights, tips & guidance from our mental health experts.
          </p>
        </div>
        <button className="shrink-0 px-6 py-2.5 rounded-full border-2 border-secondary text-secondary font-semibold hover:bg-tertiary transition-colors cursor-pointer text-sm">
          View All Articles
        </button>
      </div>

      {/* Articles Carousel */}
      <div className="relative group">
        <div
          ref={emblaRef}
          className="overflow-hidden pb-4"
        >
          <div className="flex touch-pan-y flex-row -ml-4 sm:-ml-6">
            {articlesData.map((article, index) => (
              <div
                key={index}
                className="flex-[0_0_82%] sm:flex-[0_0_300px] lg:flex-[0_0_25%] pl-4 sm:pl-6 min-w-0"
              >
                <div className="h-full bg-white rounded-2xl shadow-xs border border-black/[0.04] overflow-hidden flex flex-col group/card transition-transform hover:-translate-y-1">
                  {/* Image Container */}
                  <div className="w-full h-[160px] sm:h-[180px] relative overflow-hidden bg-gray-100">
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

                    <h3 className="font-bold text-secondary text-[15px] leading-snug mb-6 flex-grow">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
