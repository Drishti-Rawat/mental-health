const statsData = [
  { value: "10,000+", label: "Session Conducted" },
  { value: "30+", label: "Expert Therapists" },
  { value: "7+", label: "Years of Experience" },
  { value: "4.8/5", label: "Google Rating" },
  { value: "98%", label: "Client Satisfaction", className: "col-span-2 md:col-span-1" },
];

export default function Stats() {
  return (
    <div className="w-full bg-tertiary rounded-3xl py-8 px-6 md:px-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center  shadow-sm  mb-4 relative z-10">
      {statsData.map((stat, index) => (
        <div key={index} className={`flex flex-col gap-2 ${stat.className || ""}`}>
          <h4 className=" font-bold text-3xl text-primary">{stat.value}</h4>
          <p className="text-sm font-medium text-foreground/80">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
