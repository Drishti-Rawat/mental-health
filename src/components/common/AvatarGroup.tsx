import React from "react";

export interface AvatarGroupProps {
  avatars?: string[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

const DEFAULT_AVATARS = [
  "/therapist.png",
  "/hero.png",
  "/about-story.jpg",
  "/about-hero.jpg",
];

const SIZE_CLASSES = {
  sm: "w-6 h-6 sm:w-7 sm:h-7 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-10 h-10 border-2",
};

export default function AvatarGroup({
  avatars = DEFAULT_AVATARS,
  size = "md",
  className = "",
}: AvatarGroupProps) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div className={`flex -space-x-2.5 shrink-0 ${className}`}>
      {avatars.map((src, i) => (
        <img
          key={i}
          className={`${sizeClass} rounded-full border-white object-cover shadow-2xs`}
          src={src}
          alt={`Community member ${i + 1}`}
        />
      ))}
    </div>
  );
}
