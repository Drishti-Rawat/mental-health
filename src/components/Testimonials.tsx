"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

const testimonialsData = [
  {
    text: "The therapists are very understanding and made me feel comfortable from the first session. It has truly changed my life.",
    name: "Priya S.",
    avatar: "/therapist.png",
  },
  {
    text: "Professional, kind and non-judgemental. The online sessions are convenient and very effective.",
    name: "Ankit R.",
    avatar: "/therapist.png",
  },
  {
    text: "My child has shown so much improvement after a few sessions. Highly recommended!",
    name: "Sneha K.",
    avatar: "/therapist.png",
  },
  {
    text: "I feel heard and validated. The coping strategies provided have been immensely helpful in my daily life.",
    name: "Rahul M.",
    avatar: "/therapist.png",
  },
  {
    text: "Highly recommend their couples therapy. We've learned to communicate so much better.",
    name: "Aisha T.",
    avatar: "/therapist.png",
  },
  {
    text: "Easy to book, incredibly helpful sessions, and a truly safe space to open up.",
    name: "Vikram P.",
    avatar: "/therapist.png",
  },
];

export default function Testimonials() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(3);
      }
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Group into slides based on screen size (1 item/slide on mobile, 3 on desktop)
  const slides = [];
  for (let i = 0; i < testimonialsData.length; i += itemsPerPage) {
    slides.push(testimonialsData.slice(i, i + itemsPerPage));
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="bg-tertiary rounded-[2rem] p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-0 shadow-sm relative overflow-hidden">
      {/* Left Block: Rating */}
      <div className="lg:w-[25%] shrink-0 flex flex-col justify-center items-start lg:pr-8 border-b lg:border-b-0 lg:border-r border-black/5 pb-6 lg:pb-0">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-extrabold text-[#2d5f4e] tracking-widest uppercase">What our clients say</span>
          <div className="w-3 h-3 rounded-full bg-yellow-400 rounded-tr-none rotate-45"></div>
        </div>
        <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a3d31] mb-3 tracking-tight">4.8/5</h3>
        <div className="flex gap-1.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-sm font-medium text-foreground/50">Google Rating</p>
      </div>

      {/* Right Block: Slider */}
      <div className="lg:w-[75%] overflow-hidden relative">
        <div
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div key={slideIndex} className="w-full shrink-0 flex flex-col md:flex-row gap-6 md:gap-0 h-full">
              {slide.map((t, idx) => (
                <div
                  key={idx}
                  className="w-full md:w-1/3 px-0 md:px-6 xl:px-8 border-l-0 md:border-l border-black/5 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                    <Quote className="w-5 h-5 text-secondary fill-current" />
                  </div>
                  <div className="flex flex-col justify-between h-full">
                    <p className="text-xs md:text-[13px] text-foreground/70 leading-relaxed mb-4 md:mb-2 font-medium">
                      {t.text}
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
                        <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                      </div>
                      <span className="font-bold text-sm text-[#1a3d31]">{t.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
