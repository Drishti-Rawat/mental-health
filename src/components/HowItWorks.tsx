import { Star } from "lucide-react";

const stepsData = [
  {
    title: "1. Book a Session",
    description: "Choose a date, time & therapist that works for you",
  },
  {
    title: "2. Connect",
    description: "Meet your therapist online or in-person in a safe space.",
  },
  {
    title: "3. Get Support",
    description: "Share, heal & grow with evidence based therapy.",
  },
  {
    title: "4. Feel Better",
    description: "Build coping skills & live a healthier, happier life.",
  },
];

export default function HowItWorks() {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-12 mt-16">
        <span className="inline-block bg-secondary/10 text-foreground font-semibold text-xs tracking-wider uppercase rounded-full px-4 py-1.5 mb-4">
          How It Works
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-secondary mb-4">
          Getting Help is Simple
        </h2>
        <p className="text-foreground/70 max-w-2xl text-base md:text-lg">
          Start your journey to better mental well-being in just a few steps.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Connecting Line (hidden on mobile, shown on lg) */}
        <div className="hidden lg:block absolute top-1/2 left-[10%] w-[80%] h-[2px] bg-[#8ba89f]/30 -translate-y-1/2 z-0"></div>

        {stepsData.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/[0.03] p-8 flex flex-col relative z-10 transition-transform hover:-translate-y-1"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-[#8ba89f]" fill="currentColor" />
            </div>

            {/* Content */}
            <h3 className="font-bold text-lg text-secondary mb-3">{step.title}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
