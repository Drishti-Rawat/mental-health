import React from "react";
import AvatarGroup from "./AvatarGroup";

export interface TrustPillBadgeProps {
  text?: string;
  className?: string;
}

export default function TrustPillBadge({
  text = "Trusted by 10,000+ individuals",
  className = "",
}: TrustPillBadgeProps) {
  return (
    <div className={`inline-flex flex-wrap bg-white items-center justify-center lg:justify-start gap-2.5 sm:gap-4 rounded-full py-1.5 sm:py-2 px-3.5 sm:px-4 pr-4 sm:pr-6 shadow-sm border border-black/5 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-secondary whitespace-nowrap">
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>{text}</span>
      </div>
      <AvatarGroup size="sm" />
    </div>
  );
}
