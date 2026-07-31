"use client";

import { Lock, NotebookPen, Search, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { NotelyLogo } from "@/components/landing/shared/notely-logo";

const HIGHLIGHTS = [
  { label: "Spaces", value: "Organize work & life" },
  { label: "Notes", value: "Write without friction" },
  { label: "Tags", value: "Find anything fast" },
] as const;

type AuthShellProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  eyebrow?: string;
};

export function AuthShell({
  children,
  title,
  subtitle,
  eyebrow = "Secure access",
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_75%)]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="animate-pulse-glow pointer-events-none absolute top-24 left-[-4rem] h-72 w-72 rounded-full bg-[oklch(0.78_0.19_160/0.16)] blur-3xl" />
      <div
        className="animate-pulse-glow pointer-events-none absolute right-[-3rem] bottom-16 h-80 w-80 rounded-full bg-[oklch(0.72_0.19_250/0.12)] blur-3xl"
        style={{ animationDelay: "1.4s" }}
      />

      <aside className="relative hidden w-[46%] flex-col justify-between border-r border-white/5 p-10 lg:flex xl:p-14">
        <NotelyLogo />

        <div className="animate-rise max-w-md space-y-8">
          <div>
            <p className="mb-4 text-xs font-medium tracking-[0.18em] text-primary uppercase">
              {eyebrow}
            </p>
            <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight xl:text-5xl">
              <span className="gradient-text">Think. Note. Plan.</span>
              <br />
              <span className="text-foreground">Together.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Capture ideas, organize spaces, and keep everything searchable in
              one encrypted Notely workspace.
            </p>
          </div>

          <div className="glass-strong animate-float rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                Workspace
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-[oklch(0.78_0.19_160)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.78_0.19_160)]" />
                Ready
              </span>
            </div>
            <ul className="space-y-2">
              {HIGHLIGHTS.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5"
                >
                  <span className="font-mono text-sm text-foreground">
                    {row.label}
                  </span>
                  <span className="text-sm text-muted-foreground">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <NotebookPen className="h-4 w-4 text-primary" />
              Fast notes across spaces
            </li>
            <li className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-primary" />
              Tags and favorites for quick recall
            </li>
            <li className="flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-primary" />
              Session &amp; 2FA controls
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Built for mobile-native flow
            </li>
            <li className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Calm dark workspace
            </li>
          </ul>
        </div>

        <p className="font-mono text-[11px] text-muted-foreground/70">
          notely.app / auth
        </p>
      </aside>

      <main className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between px-6 pt-6 lg:hidden">
          <NotelyLogo />
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            Auth
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-8">
          <div className="animate-rise w-full max-w-md space-y-6">
            <div className="space-y-2 lg:hidden">
              <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                {eyebrow}
              </p>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <div className="hidden space-y-2 lg:block">
              <h1 className="font-display text-2xl font-bold tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
