"use client";
import { useState, useEffect, useRef } from "react";
import { Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { getPsychologistsApi, PsychologistData } from "@/services/psychologistApi";

export default function Therapists() {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const autoScrollPlugin = useRef(
    AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true, startDelay: 0 })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [autoScrollPlugin.current]
  );

  useEffect(() => {
    const fetchTherapistsData = async () => {
      setLoading(true);
      try {
        const res = await getPsychologistsApi({ limit: 10 });
        if (res && res.psychologists && res.psychologists.length > 0) {
          const formatted = res.psychologists.map((p: PsychologistData) => ({
            id: p.id || p._id,
            name: p.name || 'Therapist',
            role: p.title || 'Clinical Psychologist',
            experience: `${p.experienceYears || 0}+ Years Exp.`,
            specialties: Array.isArray(p.specialties) ? p.specialties.join(', ') : (p.specialties || 'General Therapy'),
            image: p.image || '/therapist.png',
          }));
          setTherapists(formatted);
        } else {
          setTherapists([]);
        }
      } catch (err) {
        console.error('Failed to fetch therapists from backend:', err);
        setTherapists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistsData();
  }, []);

  // Re-initialize Embla Carousel when data is loaded
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, therapists]);

  // If loading, don't show broken layout; if no therapists found, show nothing
  if (!loading && therapists.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  // Duplicate items for continuous seamless loop if fewer than 6 items
  const displayTherapists = therapists.length > 0 && therapists.length < 6
    ? [...therapists, ...therapists, ...therapists]
    : therapists;

  return (
    <section>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12 mt-12 sm:mt-16">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
          <span className="inline-block bg-secondary/10 text-secondary font-semibold text-[10px] md:text-xs tracking-wider uppercase rounded-full px-3.5 py-1.5 mb-3">
            Meet Our Experts
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-2">
            Our Compassionate Therapists
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base lg:text-lg max-w-xl">
            Highly qualified professionals dedicated to your mental well-being.
          </p>
        </div>
        <Link href="/psychologists" className="hidden sm:inline-block shrink-0 px-6 py-2.5 rounded-full border-2 border-secondary text-secondary font-semibold hover:bg-tertiary transition-colors cursor-pointer text-sm">
          View All Therapists
        </Link>
      </div>

      {/* Responsive Carousel View */}
      <div className="w-full relative">
        <div
          className="overflow-hidden rounded-2xl"
          ref={emblaRef}
        >
          <div className="flex -ml-4 py-2">
            {displayTherapists.map((therapist, index) => (
              <div key={`${therapist.id}-${index}`} className="flex-[0_0_85%] sm:flex-[0_0_48%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%] min-w-0 pl-4">
                <div className="bg-white rounded-2xl shadow-xs border border-black/5 overflow-hidden flex flex-col h-full group transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="w-full h-[180px] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden shrink-0">
                    <Image
                      src={therapist.image || '/therapist.png'}
                      alt={therapist.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-base md:text-lg text-secondary mb-0.5">{therapist.name}</h3>
                    <p className="text-xs text-foreground/60 mb-3">{therapist.role}</p>

                    <div className="flex items-center gap-1.5 mb-2">
                      <Award className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-xs font-semibold text-foreground/70">{therapist.experience}</span>
                    </div>

                    <p className="text-xs text-foreground/50 mb-5 flex-grow leading-relaxed line-clamp-2">
                      {therapist.specialties}
                    </p>

                    <Link href={`/patient/book?therapistId=${therapist.id}`} className="w-full bg-secondary text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-secondary/90 transition-colors shadow-xs mt-auto cursor-pointer text-center block">
                      Book a Session
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View All Button */}
      <div className="sm:hidden mt-6 text-center">
        <Link href="/psychologists" className="inline-block w-full px-6 py-3 rounded-full border-2 border-secondary text-secondary font-semibold hover:bg-tertiary transition-colors text-sm">
          View All Therapists
        </Link>
      </div>
    </section>
  );
}



