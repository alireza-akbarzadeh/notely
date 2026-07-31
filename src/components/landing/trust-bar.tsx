import { TRUST_STATS } from "@/lib/landing/constants";

export function TrustBar() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="card-elevated grid grid-cols-2 gap-px overflow-hidden rounded-3xl md:grid-cols-3 lg:grid-cols-6">
          {TRUST_STATS.map((s) => (
            <div
              key={s.l}
              className="bg-card p-6 text-center transition-colors hover:bg-[oklch(0.20_0.014_265)]"
            >
              <div className="font-display gradient-text text-2xl font-bold tabular-nums md:text-3xl">
                {s.v}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
