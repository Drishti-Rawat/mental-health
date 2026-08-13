import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Therapists from "@/components/Therapists";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Resources from "@/components/Resources";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col w-full min-h-screen overflow-x-hidden">
      <Hero />
      <div className="site-container space-y-12 sm:space-y-16 py-2 pb-16 sm:pb-24">
        <Stats />
        <Services />
        <Therapists />
        <HowItWorks />
        <Testimonials />
        <Resources />
        <Newsletter />
      </div>
      <Footer />
    </div>
  );
}
