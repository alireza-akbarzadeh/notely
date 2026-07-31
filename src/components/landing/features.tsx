import { FEATURES } from "@/lib/landing/constants";

export function FeaturesSection() {
  return (
    <section id="trade" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="font-mono text-xs tracking-widest text-[oklch(0.72_0.19_250)] uppercase">
            Platform
          </div>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Everything a serious trader needs.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Institutional infrastructure with a consumer-grade interface. Built by traders, for
            traders.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group card-elevated rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/5 bg-gradient-to-br from-[oklch(0.72_0.19_250/0.2)] to-[oklch(0.68_0.22_300/0.15)] transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5 text-[oklch(0.85_0.15_210)]" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
