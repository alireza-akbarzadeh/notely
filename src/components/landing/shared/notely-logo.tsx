import Link from "next/link";

import { cn } from "@/lib/utils";

type NotelyLogoProps = {
  href?: string;
  className?: string;
};

export function NotelyLogo({ href = "/", className = "" }: NotelyLogoProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
        N
      </span>
      <span className="font-display text-lg font-bold tracking-tight">Notely</span>
    </Link>
  );
}
