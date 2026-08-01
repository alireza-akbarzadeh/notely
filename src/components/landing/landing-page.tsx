import { CtaSection } from "@/components/landing/sections/cta-section";
import { DemoSection } from "@/components/landing/sections/demo-section";
import { FaqSection } from "@/components/landing/sections/faq-section";
import { FeaturesSection } from "@/components/landing/sections/features-section";
import { HeroSection } from "@/components/landing/sections/hero-section";
import { LandingFooter } from "@/components/landing/sections/landing-footer";
import { LandingNav } from "@/components/landing/sections/landing-nav";
import { PricingSection } from "@/components/landing/sections/pricing-section";
import { TestimonialsSection } from "@/components/landing/sections/testimonials-section";
import { WorkflowSection } from "@/components/landing/sections/workflow-section";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <WorkflowSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
