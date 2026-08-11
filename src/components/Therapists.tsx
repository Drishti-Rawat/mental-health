import { CheckCircle2, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
];

export default function Therapists() {
  return (
    <>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col items-start text-left">
          <span className="inline-block bg-secondary/10 text-foreground font-semibold text-xs tracking-wider uppercase rounded-full px-4 py-1.5 mb-4">
            Meet Our Expert
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-secondary mb-4">
            Our Compassionate Therapists
          </h2>
          <p className="text-foreground/70 text-base md:text-lg">
            Highly qualified professionals dedicated to your well-being.
          </p>
        </div>
        <button className="shrink-0 px-6 py-2.5 rounded-full border-2 border-secondary text-secondary font-semibold hover:bg-tertiary transition-colors cursor-pointer">
          View All Therapists
        </button>
      </div>

      {/* Therapists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {therapistsData.map((therapist, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/[0.03] overflow-hidden flex flex-col group transition-transform hover:-translate-y-1"
          >
            {/* Image Placeholder */}
            <div className="w-full h-[240px] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
              <Image
                src="/therapist.png"
                alt={therapist.name}
                fill
                className="object-cover"
              />

            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-bold text-lg text-foreground mb-1">{therapist.name}</h3>
              <p className="text-sm text-foreground/60 mb-4">{therapist.role}</p>

              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-foreground/50" />
                <span className="text-xs font-semibold text-foreground/70">{therapist.experience}</span>
              </div>

              <p className="text-xs text-foreground/50 mb-6 flex-grow leading-relaxed">
                {therapist.specialties}
              </p>

              {/* Button */}
              <button className="w-full bg-secondary text-white font-semibold py-3 rounded-xl hover:bg-secondary/90 transition-colors shadow-sm">
                Book a Session
              </button>
            </div>
          </div>
        ))}
      </div>

    </>
  );
}
