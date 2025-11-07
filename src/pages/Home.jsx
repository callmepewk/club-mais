import React from "react";
import HeroSection from "../components/home/HeroSection";
import BenefitsSection from "../components/home/BenefitsSection";
import AboutSection from "../components/home/AboutSection";
import CallToActionSection from "../components/home/CallToActionSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BenefitsSection />
      <AboutSection />
      <CallToActionSection />
    </div>
  );
}