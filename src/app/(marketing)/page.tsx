import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";

export const metadata: Metadata = {
  title: "Nexora — Trade the Future of Finance",
  description:
    "Institutional-grade digital asset exchange. Lightning-fast execution, deep liquidity, and enterprise security trusted by 10M+ traders.",
  openGraph: {
    title: "Nexora — Trade the Future of Finance",
    description:
      "Institutional-grade digital asset exchange. Lightning-fast execution and enterprise security.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
