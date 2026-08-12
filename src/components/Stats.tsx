const statsData = [
  { value: "10,000+", label: "Sessions Conducted" },
  { value: "30+", label: "Expert Therapists" },
  { value: "7+", label: "Years of Experience" },
  { value: "4.8/5", label: "Google Rating" },
  { value: "98%", label: "Client Satisfaction", className: "col-span-2 sm:col-span-1" },
];

export default function Stats() {
  return (
    <div className="w-full bg-tertiary rounded-3xl py-6 sm:py-8 px-4 sm:px-8 md:px-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 text-center shadow-xs relative z-10">
      {statsData.map((stat, index) => (
        <div key={index} className={`flex flex-col gap-1 sm:gap-2 justify-center ${stat.className || ""}`}>
          <h4 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-primary tracking-tight">{stat.value}</h4>
          <p className="text-xs sm:text-sm font-medium text-foreground/80">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
