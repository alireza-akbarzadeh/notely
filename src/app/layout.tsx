import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Notely | Think. Note. Plan.",
    template: "%s · Notely",
  },
  description:
    "Capture ideas, organize spaces, set reminders, and plan in one calm workspace.",
  applicationName: "Notely",
  authors: [{ name: "Notely" }],
  keywords: [
    "notes",
    "workspace",
    "reminders",
    "calendar",
    "tasks",
    "productivity",
  ],
  creator: "Notely",
  publisher: "Notely",
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Notely",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Notely",
    title: "Notely | Think. Note. Plan.",
    description:
      "Capture ideas, organize spaces, set reminders, and plan in one calm workspace.",
  },
  twitter: {
    card: "summary",
    title: "Notely | Think. Note. Plan.",
    description:
      "Capture ideas, organize spaces, set reminders, and plan in one calm workspace.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e07838" },
    { media: "(prefers-color-scheme: dark)", color: "#e8914a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <Providers>
          {children}
          <PwaRegister />
        </Providers>
      </body>
    </html>
  );
}
