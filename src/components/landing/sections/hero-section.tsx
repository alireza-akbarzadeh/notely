"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { HERO_STATS } from "@/components/landing/content";
import { WorkspacePreview } from "@/components/landing/shared/workspace-preview";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

const PROOF_POINTS = [
  "Free to start",
  "No credit card",
  "Works offline-friendly on mobile",
];

export function HeroSection() {
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = Boolean(session?.user);

  return (
    <section id="top" className="relative overflow-hidden border-b border-border/60">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="animate-rise mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-primary" />
            Notes, tasks, and calendar in one workspace
          </span>

          <h1 className="font-display mt-6 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl md:text-7xl">
            <span className="gradient-text">Think. Note. Plan.</span>
            <br />
            Together.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
            Notely is a calm workspace for the things you need to remember —
            spaces to keep them apart, tags and search to find them again, and
            reminders that bring them back at the right moment.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {isPending ? (
              <div className="h-11 w-40 animate-pulse rounded-lg bg-muted" />
            ) : isLoggedIn ? (
              <Link
                href="/notes"
                className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-5 text-sm")}
              >
                Continue to notes
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-5 text-sm")}
              >
                Start writing free
                <ArrowRight className="size-4" />
              </Link>
            )}
            <a
              href="#demo"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 px-5 text-sm",
              )}
            >
              See it in action
            </a>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {PROOF_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-rise mt-16 [animation-delay:150ms]">
          <WorkspacePreview />
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border md:grid-cols-4">
          {HERO_STATS.map(({ value, label }) => (
            <div key={label} className="bg-background px-6 py-8 text-center">
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-3xl font-bold text-primary">
                {value}
              </dd>
              <p className="mt-2 text-xs tracking-wide text-muted-foreground uppercase">
                {label}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
