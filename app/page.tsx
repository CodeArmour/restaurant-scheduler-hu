import { HeroSection } from "@/components/sections/home/hero-section"
import { FeatureCards } from "@/components/sections/home/feature-cards"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeatureCards />
    </div>
  )
}
