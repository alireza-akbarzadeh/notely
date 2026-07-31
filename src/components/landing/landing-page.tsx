import { AssetsSection } from "./assets";
import { FaqSection } from "./faq";
import { FeaturesSection } from "./features";
import { FinalCtaSection } from "./final-cta";
import { LandingFooter } from "./footer";
import { HeroSection } from "./hero";
import { LearningSection } from "./learning";
import { MobileSection } from "./mobile-section";
import { LandingNav } from "./nav";
import { PricingSection } from "./pricing";
import { SecuritySection } from "./security";
import { TestimonialsSection } from "./testimonials";
import { TradeDemoSection } from "./trade-demo";
import { TrustBar } from "./trust-bar";

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <main>
        <HeroSection />
        <TrustBar />
        <AssetsSection />
        <TradeDemoSection />
        <FeaturesSection />
        <SecuritySection />
        <MobileSection />
        <TestimonialsSection />
        <LearningSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
