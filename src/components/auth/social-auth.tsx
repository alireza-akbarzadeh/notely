"use client";

import { useState } from "react";

import { AuthError } from "@/components/auth/auth-panel";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

type SocialAuthButtonsProps = {
  callbackURL?: string;
  className?: string;
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.365 1.43c0 1.14-.42 2.05-1.25 2.87-.92.9-1.96 1.42-3.13 1.33-.08-1.08.4-2.2 1.2-3.02.91-.95 2.1-1.5 3.18-1.58zm3.34 16.28c-.5 1.15-.74 1.66-1.39 2.68-.9 1.4-2.17 3.15-3.74 3.16-1.4.02-1.76-.91-3.66-.9-1.9.01-2.3.92-3.7.9-1.57-.02-2.77-1.6-3.67-3-1.84-2.86-3.22-8.08-1.35-11.6 1.02-1.93 2.64-3.16 4.44-3.16 1.66 0 2.7 1.08 4.07 1.08 1.32 0 2.12-1.09 4.08-1.09 1.46 0 3 .79 4.01 2.16-3.53 1.94-2.96 7 1.01 8.37z" />
    </svg>
  );
}

export function SocialAuthButtons({
  callbackURL = "/workspace",
  className,
}: SocialAuthButtonsProps) {
  const googleConfigured = process.env.NEXT_PUBLIC_AUTH_GOOGLE === "true";
  const appleConfigured = process.env.NEXT_PUBLIC_AUTH_APPLE === "true";
  const [pending, setPending] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signInWith(provider: "google" | "apple") {
    const configured =
      provider === "google" ? googleConfigured : appleConfigured;

    if (!configured) {
      setError(
        provider === "google"
          ? "Add GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET, then set NEXT_PUBLIC_AUTH_GOOGLE=true and restart."
          : "Add Apple credentials, then set NEXT_PUBLIC_AUTH_APPLE=true and restart.",
      );
      return;
    }

    setError(null);
    setPending(provider);

    const result = await authClient.signIn.social({
      provider,
      callbackURL,
    });

    if (result.error) {
      setPending(null);
      setError(result.error.message ?? `Unable to continue with ${provider}`);
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => void signInWith("google")}
          disabled={pending !== null}
          className="group glass-strong inline-flex h-11 touch-manipulation items-center justify-center gap-2.5 rounded-xl text-sm font-medium transition-opacity hover:bg-white/[0.06] disabled:pointer-events-none disabled:opacity-60"
        >
          <GoogleIcon className="size-5 shrink-0" />
          <span>{pending === "google" ? "Connecting…" : "Google"}</span>
        </button>

        <button
          type="button"
          onClick={() => void signInWith("apple")}
          disabled={pending !== null}
          className="group inline-flex h-11 touch-manipulation items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-foreground text-sm font-medium text-background transition-opacity hover:bg-foreground/90 disabled:pointer-events-none disabled:opacity-60"
        >
          <AppleIcon className="size-5 shrink-0" />
          <span>{pending === "apple" ? "Connecting…" : "Apple"}</span>
        </button>
      </div>

      <AuthError message={error} />

      <div className="relative flex items-center gap-3 pt-1">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          Or use email
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
