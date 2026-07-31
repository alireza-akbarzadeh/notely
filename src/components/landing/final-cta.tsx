import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="pt-16 pb-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="card-elevated relative overflow-hidden rounded-[2rem] p-12 text-center md:p-20">
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="grid-bg absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative">
            <Flame className="mx-auto h-8 w-8 text-[oklch(0.85_0.15_80)]" />
            <h2 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-6xl">
              Ready to trade like a <span className="gradient-text">professional?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join over 10 million traders who choose Nexora for institutional-grade infrastructure
              and elegant design.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="gradient-primary glow-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-medium text-primary-foreground transition hover:scale-[1.03]"
              >
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                className="glass-strong inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-medium transition hover:bg-white/5"
              >
                Talk to institutional
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
