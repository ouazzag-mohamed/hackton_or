import Image from "next/image"
import Link from "next/link"
import FeaturesSection from "@/components/features-section"
import CommunitySection from "@/components/community-section"
import OpportunitiesSection from "@/components/opportunities-section"
import TestimonialsSection from "@/components/testimonials-section"
import ClosingSection from "@/components/closing-section"
import DownloadAppSection from "@/components/download-app-section"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import Hero from "@/components/Hero"
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      {/* Features Section */}
      <FeaturesSection />

      {/* Community Section */}
      <CommunitySection />

      {/* Closing Section */}
      <ClosingSection />

      {/* Download App Section */}
      <DownloadAppSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
