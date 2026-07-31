"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

import { UserMenu } from "@/components/layout/user-menu";
import { authClient } from "@/lib/auth/client";
import { NAV_LINKS } from "@/lib/landing/constants";

import { NexoraLogo } from "./shared/nexora-logo";

const NAV_ANCHORS: Record<(typeof NAV_LINKS)[number], string> = {
  Markets: "#markets",
  Trade: "#demo",
  Derivatives: "#trade",
  Institutional: "#institutional",
  Learn: "#learn",
};

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = Boolean(session?.user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all ${scrolled ? "glass-strong" : ""}`}
        >
          <NexoraLogo />

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                href={NAV_ANCHORS[label]}
                className="transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="h-9 w-24 animate-pulse rounded-xl bg-white/5" />
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <UserMenu variant="header" />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="gradient-primary glow-primary rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] hover:opacity-90"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
