import { Star } from "lucide-react";

import { TESTIMONIALS } from "@/lib/landing/constants";

export function TestimonialsSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="font-mono text-xs tracking-widest text-[oklch(0.72_0.19_250)] uppercase">
            Trusted
          </div>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            By funds, firms, and pros.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card-elevated flex flex-col rounded-3xl p-8">
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-[oklch(0.85_0.15_80)] text-[oklch(0.85_0.15_80)]"
                  />
                ))}
              </div>
              <blockquote className="flex-1 leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/5 pt-6">
                <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-full font-semibold text-primary-foreground">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
