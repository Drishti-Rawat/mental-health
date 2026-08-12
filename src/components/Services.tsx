"use client";
import Link from "next/link";
import { ArrowRight, Brain, Heart, Users, Sparkles, Target } from "lucide-react";

const servicesData = [
  {
    id: "anxiety",
    title: "Anxiety & Stress",
    description: "Learn effective coping strategies to manage worry, overcome panic attacks, and reduce daily stress in a safe, supportive environment.",
    href: "#",
    icon: Brain,
    theme: "bg-white text-foreground border border-black/[0.05] shadow-sm",
    iconTheme: "text-secondary bg-secondary/10",
    linkTheme: "text-secondary hover:text-secondary/80 border-secondary/20 hover:border-secondary",
  },
  {
    id: "relationships",
    title: "Relationship Counselling",
    description: "Build healthier, stronger connections with your partner through improved communication and mutual understanding.",
    href: "#",
    icon: Heart,
    theme: "bg-white text-foreground border border-black/[0.05] shadow-sm",
    iconTheme: "text-secondary bg-secondary/10",
    linkTheme: "text-secondary hover:text-secondary/80 border-secondary/20 hover:border-secondary",
  },
  {
    id: "child-therapy",
    title: "Child & Adolescent Therapy",
    description: "Specialized support tailored for kids and teens to navigate emotional challenges and behavioral issues.",
    href: "#",
    icon: Users,
    theme: "bg-white text-foreground border border-black/[0.05] shadow-sm",
    iconTheme: "text-secondary bg-secondary/10",
    linkTheme: "text-secondary hover:text-secondary/80 border-secondary/20 hover:border-secondary",
  },
  {
    id: "trauma",
    title: "Trauma & PTSD",
    description: "Process and heal from painful past experiences using evidence-based trauma therapies designed to help you regain control.",
    href: "#",
    icon: Sparkles,
    theme: "bg-white text-foreground border border-black/[0.05] shadow-sm",
    iconTheme: "text-secondary bg-secondary/10",
    linkTheme: "text-secondary hover:text-secondary/80 border-secondary/20 hover:border-secondary",
  },
  {
    id: "career",
    title: "Career & Personal Growth",
    description: "Navigate professional challenges, overcome imposter syndrome, and set actionable goals to achieve your true potential.",
    href: "#",
    icon: Target,
    theme: "bg-white text-foreground border border-black/[0.05] shadow-sm",
    iconTheme: "text-secondary bg-secondary/10",
    linkTheme: "text-secondary hover:text-secondary/80 border-secondary/20 hover:border-secondary",
  },
  {
    id: "self-care",
    title: "Self Care & Wellbeing",
    description: "Develop sustainable self-care routines that prioritize your mental, emotional, and physical health.",
    href: "#",
    icon: Heart, // Reusing heart for now, or something else
    theme: "bg-white text-foreground border border-black/[0.05] shadow-sm",
    iconTheme: "text-secondary bg-secondary/10",
    linkTheme: "text-secondary hover:text-secondary/80 border-secondary/20 hover:border-secondary",
  },
];

export default function Services() {
  return (
    <section>
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-10 mt-10 sm:mt-16">
        <span className="inline-block bg-secondary/10 text-secondary font-semibold text-[11px] tracking-wider uppercase rounded-full px-4 py-1.5 mb-3">
          What We Help With
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-3 max-w-2xl">
          Conditions We Support
        </h2>
        <p className="text-foreground/70 max-w-xl text-sm sm:text-base">
          We provide specialized, compassionate therapy for a wide range of emotional and mental health challenges.
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {servicesData.map((service) => (
          <div
            key={service.id}
            className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${service.theme}`}
          >
            <div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${service.iconTheme}`}>
                <service.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-secondary">
                {service.title}
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-6 text-foreground/70`}>
                {service.description}
              </p>
            </div>

            <Link
              href={service.href}
              className={`inline-flex items-center gap-1.5 font-bold text-xs border-b-2 pb-0.5 w-fit transition-colors ${service.linkTheme}`}
            >
              Learn More <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
