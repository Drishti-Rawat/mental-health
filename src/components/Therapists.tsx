"use client";
import { useRef } from "react";
import { Award } from "lucide-react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const therapistsData = [
  {
    name: "Dr. Radhika Sharma",
    role: "Clinical Psychologist",
    experience: "8+ Years Exp.",
    specialties: "Anxiety, Depression, Relationship",
    image: "/therapist.png",
    href: "#",
  },
  {
    name: "Dr. Devendra Singh",
    role: "Clinical Psychologist",
    experience: "10+ Years Exp.",
    specialties: "Anxiety, Depression, Relationship",
    image: "/therapist.png",
    href: "#",
  },
  {
    name: "Dr. Neha Verma",
    role: "Clinical Psychologist",
    experience: "7+ Years Exp.",
    specialties: "Anxiety, Depression, Relationship",
    image: "/therapist.png",
    href: "#",
  },
  {
    name: "Dr. Pooja Kapoor",
    role: "Clinical Psychologist",
    experience: "5+ Years Exp.",
    specialties: "Anxiety, Depression, Relationship",
    image: "/therapist.png",
    href: "#",
  },
  {
    name: "Dr. Pooja Kapoor",
    role: "Clinical Psychologist",
    experience: "5+ Years Exp.",
    specialties: "Anxiety, Depression, Relationship",
    image: "/therapist.png",
    href: "#",
  },
];

export default function Therapists() {
  const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true }));
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [plugin.current]);

  return (
    <section>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12 mt-12 sm:mt-16">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
          <span className="inline-block bg-secondary/10 text-secondary font-semibold text-[10px] md:text-xs tracking-wider uppercase rounded-full px-3.5 py-1.5 mb-3">
            Meet Our Experts
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
            Our Compassionate Therapists
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base lg:text-lg max-w-xl">
            Highly qualified professionals dedicated to your mental well-being.
          </p>
        </div>
        <button className="hidden sm:block shrink-0 px-6 py-2.5 rounded-full border-2 border-secondary text-secondary font-semibold hover:bg-tertiary transition-colors cursor-pointer text-sm">
          View All Therapists
        </button>
      </div>

      {/* Responsive Carousel View */}
      <div className="w-full relative">
        <div 
          className="overflow-hidden rounded-2xl" 
          ref={emblaRef}
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
        >
          <div className="flex -ml-4 py-2">
            {therapistsData.map((therapist, index) => (
              <div key={index} className="flex-[0_0_85%] sm:flex-[0_0_48%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%] min-w-0 pl-4">
                <div className="bg-white rounded-2xl shadow-xs border border-black/5 overflow-hidden flex flex-col h-full group transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="w-full h-[180px] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden shrink-0">
                    <Image src={therapist.image} alt={therapist.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-base md:text-lg text-primary mb-0.5">{therapist.name}</h3>
                    <p className="text-xs text-foreground/60 mb-3">{therapist.role}</p>

                    <div className="flex items-center gap-1.5 mb-2">
                      <Award className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-xs font-semibold text-foreground/70">{therapist.experience}</span>
                    </div>

                    <p className="text-xs text-foreground/50 mb-5 flex-grow leading-relaxed">
                      {therapist.specialties}
                    </p>

                    <button className="w-full bg-secondary text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-secondary/90 transition-colors shadow-xs mt-auto cursor-pointer">
                      Book a Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile View All Button */}
      <div className="sm:hidden mt-6 text-center">
        <button className="w-full px-6 py-3 rounded-full border-2 border-secondary text-secondary font-semibold hover:bg-tertiary transition-colors text-sm">
          View All Therapists
        </button>
      </div>
    </section>
  );
}
