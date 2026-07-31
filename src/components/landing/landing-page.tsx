"use client";

import Link from "next/link";
import { ArrowRight, NotebookPen, Smartphone, Tags } from "lucide-react";

import { NotelyLogo } from "@/components/landing/shared/notely-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <NotelyLogo />
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Sign in
          </Link>
          <Link href="/register" className={cn(buttonVariants())}>
            Get started
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-10 md:pt-20">
        <section className="max-w-3xl animate-rise">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-primary uppercase">
            Notely
          </p>
          <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight md:text-7xl">
            <span className="gradient-text">Think. Note. Plan.</span>
            <br />
            Together.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            A calm workspace for notes, spaces, and tags — built to feel native on
            your phone and fast on your desktop.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}
            >
              Start writing
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              Sign in
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: NotebookPen,
              title: "Spaces & notes",
              body: "Keep work and personal writing in separate spaces without losing momentum.",
            },
            {
              icon: Tags,
              title: "Tags that stick",
              body: "Color-coded tags help you scan and reopen the right note in seconds.",
            },
            {
              icon: Smartphone,
              title: "Mobile-native",
              body: "List to editor flow, bottom navigation, and safe-area padding for real devices.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/80 bg-card/50 p-6 backdrop-blur-sm"
            >
              <Icon className="mb-4 size-5 text-primary" />
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/60 px-6 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Notely. Think. Note. Plan.
      </footer>
    </div>
  );
}
