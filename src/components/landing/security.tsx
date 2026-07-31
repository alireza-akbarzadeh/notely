import { ArrowUpRight, Shield } from "lucide-react";

import { SECURITY_ITEMS, SECURITY_ORBIT_ICONS } from "@/lib/landing/constants";

export function SecuritySection() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.18_0.03_265/0.5)] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="font-mono text-xs tracking-widest text-[oklch(0.78_0.19_160)] uppercase">
              Security
            </div>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Vault-grade protection. On every trade.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Your assets sit behind the same defenses used by central banks and Fortune 500
              treasuries — audited quarterly, insured up to $1B.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                className="glass-strong inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition hover:bg-white/5"
              >
                Proof of reserves <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                Security whitepaper
              </button>
            </div>
          </div>

          <div className="relative mx-auto aspect-square max-w-md">
            <div className="animate-pulse-glow absolute inset-0 rounded-full bg-gradient-to-br from-[oklch(0.72_0.19_250/0.2)] via-transparent to-[oklch(0.78_0.19_160/0.2)] blur-2xl" />
            <div
              className="animate-pulse-glow absolute inset-8 rounded-full border border-white/10"
              style={{ animationDelay: "0.5s" }}
            />
            <div className="absolute inset-16 rounded-full border border-white/10" />
            <div className="absolute inset-24 rounded-full border border-white/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="gradient-primary glow-primary relative flex h-40 w-40 rotate-3 items-center justify-center rounded-3xl">
                <Shield className="h-20 w-20 text-primary-foreground" strokeWidth={1.5} />
              </div>
            </div>
            {SECURITY_ORBIT_ICONS.map((Icon, i) => {
              const angle = (i / 4) * Math.PI * 2;
              const r = 160;
              return (
                <div
                  key={i}
                  className="glass-strong animate-float absolute flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * r}px - 24px)`,
                    top: `calc(50% + ${Math.sin(angle) * r}px - 24px)`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                >
                  <Icon className="h-5 w-5 text-[oklch(0.85_0.15_210)]" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SECURITY_ITEMS.map((it) => (
            <div key={it.title} className="glass rounded-2xl p-5 transition hover:border-white/20">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[oklch(0.78_0.19_160/0.15)]">
                  <it.icon className="h-4.5 w-4.5 text-[oklch(0.78_0.19_160)]" />
                </div>
                <h3 className="font-semibold">{it.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
