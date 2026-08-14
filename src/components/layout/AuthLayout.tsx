'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Shield } from 'lucide-react';

export interface AuthLayoutProps {
  badge?: string;
  badgeIcon?: React.ComponentType<{ className?: string }>;
  panelTitle: string;
  panelDescription: string;
  features?: string[];
  formTitle: string;
  formSubtitle?: string;
  formIcon?: React.ComponentType<{ className?: string }>;
  bgImage?: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  badge = 'MentalCare Portal',
  badgeIcon: BadgeIcon = Shield,
  panelTitle,
  panelDescription,
  features = [],
  formTitle,
  formSubtitle,
  formIcon: FormIcon,
  bgImage = '/image.png',
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Side: Full-Bleed Branding Panel with Image & Gradient Overlay */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary via-primary/95 to-secondary p-10 xl:p-14 flex-col justify-between text-white relative overflow-hidden min-h-screen">
        {/* Background Botanical Image Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="MentalCare Botanical Artwork"
            fill
            className="object-cover object-center opacity-50 mix-blend-overlay pointer-events-none"
            priority
          />
        </div>

        {/* Ambient Lighting Blurs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-tertiary/20 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/30 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none z-0"></div>

        {/* Top-Left Brand Logo & Panel Intro */}
        <div className="relative z-10 space-y-6">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-bold tracking-tight text-white">
              MentalCare
            </span>
          </Link>

          <div className="space-y-3">
            {/* <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-tertiary text-xs font-semibold border border-white/15">
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div> */}

            <h2 className="font-serif text-3xl xl:text-4xl font-bold leading-tight tracking-tight text-white pt-2">
              {panelTitle}
            </h2>

            <p className="text-white/80 text-sm leading-relaxed max-w-md">
              {panelDescription}
            </p>
          </div>
        </div>

        {/* Bottom Feature List */}
        {features.length > 0 && (
          <div className="relative z-10 space-y-4 pt-8 border-t border-white/15">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs text-white/90 font-medium">
                <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Side: Form Container */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen bg-white">
        {/* Top Mobile Brand Logo (Visible ONLY on mobile/small screens < lg) */}
        <div className="w-full flex items-center justify-between lg:hidden">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              MentalCare
            </span>
          </Link>
        </div>

        {/* Vertically Centered Form Box */}
        <div className="max-w-md mx-auto w-full space-y-6 my-auto py-8">
          <div>
            {FormIcon && (
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary/10 text-secondary mb-4 border border-secondary/20">
                <FormIcon className="w-6 h-6" />
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {formTitle}
            </h1>
            {formSubtitle && (
              <p className="text-sm text-secondary mt-1">
                {formSubtitle}
              </p>
            )}
          </div>

          {children}
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-400 text-center">
          © MentalCare Platform. All rights reserved.
        </div>
      </div>
    </div>
  );
}
