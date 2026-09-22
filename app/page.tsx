
import Navbar from "@/components/Navbar/navbar";
import Hero from "@/components/Hero/hero";
import HowItWorks from "@/components/HowItWorks/howItWorks";
import RideOptions from "@/components/RideOptions/rideOptions";
import WhyChooseUs from "@/components/WhyChooseUs/whyChooseUs";
import DriverCTA from "@/components/DriverCTA/driverCTA";
import Testimonials from "@/components/Testimonials/testimonials";
import CityCoverage from "@/components/CityCoverage/cityCoverage";
import FAQ from "@/components/FAQ/faq";
import FinalCTA from "@/components/FinalCTA/finalCTA";
import Footer from "@/components/Footer/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white selection:bg-blue-600 selection:text-white">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section (Embeds Fare Estimator & Trust Stats) */}
        <Hero />

        {/* 3. How It Works */}
        <HowItWorks />

        {/* 4. Ride Options / Vehicle Categories */}
        <RideOptions />

        {/* 5. Why Choose Us (Features Grid) */}
        <WhyChooseUs />

        {/* 6. Driver CTA Banner */}
        <DriverCTA />

        {/* 7. Testimonials */}
        <Testimonials />

        {/* 8. City Coverage */}
        <CityCoverage />

        {/* 9. FAQ Accordion */}
        <FAQ />

        {/* 10. Final CTA Section */}
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
