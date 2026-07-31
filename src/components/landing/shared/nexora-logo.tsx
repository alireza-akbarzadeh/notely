import Link from "next/link";

type NexoraLogoProps = {
  href?: string;
  className?: string;
};

export function NexoraLogo({ href = "/", className = "" }: NexoraLogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2.5 ${className}`}>
      <div className="gradient-primary glow-primary flex h-8 w-8 items-center justify-center rounded-lg">
        <div className="h-4 w-4 rounded-sm bg-background/90" />
      </div>
      <span className="font-display text-lg font-bold tracking-tight">Nexora</span>
    </Link>
  );
}
