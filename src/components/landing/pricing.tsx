import Link from "next/link";
import { Check } from "lucide-react";

import { PRICING_TIERS } from "@/lib/landing/constants";

export function PricingSection() {
  return (
    <section id="institutional" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="font-mono text-xs tracking-widest text-[oklch(0.72_0.19_250)] uppercase">
            Pricing
          </div>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Fair pricing. At any scale.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {PRICING_TIERS.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl p-8 ${t.featured ? "card-elevated shadow-[var(--shadow-glow)]" : "glass"}`}
            >
              {t.featured ? (
                <div className="gradient-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-mono text-[10px] tracking-widest text-primary-foreground uppercase">
                  Most popular
                </div>
              ) : null}
              <div className="text-sm text-muted-foreground">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                {t.price === "Custom" ? (
                  <span className="font-display text-4xl font-bold">Custom</span>
                ) : (
                  <>
                    <span className="font-display text-5xl font-bold">${t.price}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <Link
                href={t.name === "Institutional" ? "#" : "/register"}
                className={`mt-6 block w-full rounded-xl py-3 text-center font-medium transition-all ${t.featured ? "gradient-primary glow-primary text-primary-foreground hover:scale-[1.02]" : "glass-strong hover:bg-white/5"}`}
              >
                {t.name === "Institutional" ? "Talk to sales" : "Get started"}
              </Link>
              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.78_0.19_160)]" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
