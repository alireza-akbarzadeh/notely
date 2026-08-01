import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";

export const metadata: Metadata = {
  title: "Think. Note. Plan.",
  description:
    "A calm workspace for notes, spaces, reminders, and tags — built to feel native on mobile.",
  openGraph: {
    title: "Notely — Think. Note. Plan.",
    description:
      "Capture ideas, organize spaces, and keep everything searchable in one workspace.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
