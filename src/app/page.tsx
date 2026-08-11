import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col w-full min-h-screen">
        <Hero />
        <div className="container mx-auto px-6 lg:px-12">
          <Stats />
        </div>
      </main>
    </>
  );
}
