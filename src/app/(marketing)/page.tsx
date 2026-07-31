import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";

export const metadata: Metadata = {
  title: "Notely — Think. Note. Plan.",
  description:
    "A calm workspace for notes, spaces, and tags — built to feel native on mobile.",
  openGraph: {
    title: "Notely — Think. Note. Plan.",
    description:
      "Capture ideas, organize spaces, and keep everything searchable in one workspace.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
