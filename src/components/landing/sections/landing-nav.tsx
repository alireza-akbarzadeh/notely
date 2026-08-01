"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { NAV_LINKS } from "@/components/landing/content";
import { NotelyLogo } from "@/components/landing/shared/notely-logo";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeModeButton } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = Boolean(session?.user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent transition-colors",
        (scrolled || open) &&
          "border-border/60 bg-background/80 backdrop-blur-md",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4"
      >
        <NotelyLogo />

        <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeModeButton className="hidden sm:inline-flex" />
          {isPending ? (
            <div className="size-9 animate-pulse rounded-full bg-muted" />
          ) : isLoggedIn ? (
            <>
              <Link
                href="/workspace"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "hidden px-3.5 sm:inline-flex",
                )}
              >
                Open notes
              </Link>
              <UserMenu variant="appbar" />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "hidden sm:inline-flex",
                )}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "px-3.5")}
              >
                Get started
              </Link>
            </>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="landing-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </nav>

      {open ? (
        <div
          id="landing-mobile-menu"
          className="border-t border-border/60 md:hidden"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
              {isLoggedIn ? (
                <Link
                  href="/workspace"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "flex-1",
                  )}
                >
                  Open notes
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "flex-1",
                  )}
                >
                  Sign in
                </Link>
              )}
              <ThemeModeButton />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
