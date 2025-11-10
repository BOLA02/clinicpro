import { Header } from "../../components/header";
import { Hero } from "../../components/hero";
import { Services } from "../../components/services";
import { Features } from "../../components/features";
import { CTA } from "../../components/cta";
import { Footer } from "../../components/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}