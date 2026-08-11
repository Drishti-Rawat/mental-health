import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Therapists from "@/components/Therapists";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Resources from "@/components/Resources";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col w-full min-h-screen">
        <Hero />
        <div className="container mx-auto px-6 lg:px-12 space-y-16 py-2 pb-24">
          <Stats />
          <Services />
          <Therapists />
          <HowItWorks />
          <Testimonials />
          <Resources />
          <Newsletter />
        </div>
        <Footer />
      </main>
    </>
  );
}
