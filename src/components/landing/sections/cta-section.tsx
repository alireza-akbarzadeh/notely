"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = Boolean(session?.user);

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center md:py-28">
        <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl">
          {isLoggedIn
            ? "Pick up where you left off"
            : "Your next thought deserves a better place to land"}
        </h2>
        <p className="mt-5 max-w-xl text-base text-pretty text-muted-foreground md:text-lg">
          {isLoggedIn
            ? "Your notes, spaces, and reminders are ready in your workspace."
            : "Create a workspace in under a minute. Bring one note or ten years of them."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {isPending ? (
            <div className="h-11 w-44 animate-pulse rounded-lg bg-muted" />
          ) : isLoggedIn ? (
            <Link
              href="/notes"
              className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-5 text-sm")}
            >
              Open workspace
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-5 text-sm")}
              >
                Get started free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 px-5 text-sm",
                )}
              >
                I already have an account
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
