import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthPanelProps = {
  children: ReactNode;
  className?: string;
};

export function AuthPanel({ children, className }: AuthPanelProps) {
  return (
    <div
      className={cn(
        "card-elevated relative overflow-hidden rounded-2xl p-6 shadow-[var(--shadow-elevated)] sm:p-7",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      {children}
    </div>
  );
}

type AuthSubmitProps = {
  children: ReactNode;
  pending?: boolean;
  pendingLabel?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function AuthSubmit({
  children,
  pending,
  pendingLabel,
  className,
  disabled,
  ...props
}: AuthSubmitProps) {
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={cn(
        "gradient-primary glow-primary relative z-10 inline-flex h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-xl text-sm font-medium text-primary-foreground transition-opacity hover:opacity-95 disabled:pointer-events-none disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
          <span>{pendingLabel ?? "Working…"}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function AuthFooterLink({
  prompt,
  href,
  label,
}: {
  prompt: string;
  href: string;
  label: string;
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {prompt ? <>{prompt} </> : null}
      <Link href={href} className="font-medium text-primary hover:underline">
        {label}
      </Link>
    </p>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  );
}

export function AuthSuccess({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-lg border border-buy/30 bg-buy/10 px-3 py-2 text-sm text-buy">
      {message}
    </p>
  );
}
