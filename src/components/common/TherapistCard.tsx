"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";
import { PsychologistData } from "@/services/psychologistApi";

export interface TherapistCardProps {
  therapist: PsychologistData;
  onBookClick?: (therapist: PsychologistData) => void;
  className?: string;
  buttonText?: string;
  showBookButton?: boolean;
  compact?: boolean;
}

export default function TherapistCard({
  therapist,
  onBookClick,
  className = "",
  buttonText = "Book a Session",
  showBookButton = true,
  compact = false,
}: TherapistCardProps) {
  const tId = therapist.id || therapist._id || therapist.name;
  const name = therapist.name || "Therapist";
  const title = therapist.title || "Clinical Psychologist";
  const experienceStr = `${therapist.experienceYears || 5}+ Years Exp.`;
  
  const specialtiesStr = Array.isArray(therapist.specialties)
    ? therapist.specialties.join(", ")
    : therapist.specialties || "General Therapy";

  const imageSrc = therapist.image || "/therapist.png";
  const bookUrl = `/book?therapistId=${tId}`;

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between group ${className}`}
    >
      <div>
        {/* Top Photo Frame */}
        <div className={`relative ${compact ? "h-44" : "h-52"} w-full bg-slate-100 overflow-hidden`}>
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-2.5">
          <div>
            <h3 className="font-bold text-primary text-base sm:text-lg font-serif group-hover:text-secondary transition-colors">
              {name}
            </h3>
            <p className="text-xs font-semibold text-secondary">{title}</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>{experienceStr}</span>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {specialtiesStr}
          </p>

          {therapist.consultationFee && (
            <p className="text-xs font-bold text-primary pt-1 border-t border-slate-100">
              Fee: {therapist.currency || "₹"}{therapist.consultationFee} / session
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      {showBookButton && (
        <div className="p-5 pt-0">
          {onBookClick ? (
            <button
              type="button"
              onClick={() => onBookClick(therapist)}
              className="w-full py-2.5 rounded-full bg-secondary text-white font-semibold text-xs hover:bg-secondary/90 transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href={bookUrl}
              className="w-full py-2.5 rounded-full bg-secondary text-white font-semibold text-xs hover:bg-secondary/90 transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer text-center block"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
