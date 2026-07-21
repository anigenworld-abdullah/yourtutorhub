import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { WhyUs } from "@/components/site/WhyUs";
import { Teachers } from "@/components/site/Teachers";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { BgMusic } from "@/components/site/BgMusic";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Teachers />
        <Contact />
      </main>
      <Footer />
      <BgMusic />
    </div>
  );
}
