import { ArrowRight, ArrowUpRight, Gift } from "lucide-react";

import { LEARNING_ITEMS } from "@/lib/landing/constants";

export function LearningSection() {
  return (
    <section id="learn" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs tracking-widest text-[oklch(0.72_0.19_250)] uppercase">
              Learn
            </div>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Learn from the best in the industry.
            </h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Visit Learning Centre <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {LEARNING_ITEMS.map((it) => (
            <a
              key={it.title}
              href="#"
              className="group card-elevated rounded-2xl p-6 transition-all hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.72_0.19_250/0.2)] to-[oklch(0.68_0.22_300/0.15)]">
                  <it.icon className="h-5 w-5 text-[oklch(0.85_0.15_210)]" />
                </div>
                <span className="rounded-md bg-[oklch(0.78_0.19_160/0.1)] px-2 py-1 font-mono text-[10px] tracking-widest text-[oklch(0.78_0.19_160)] uppercase">
                  {it.tag}
                </span>
              </div>
              <h3 className="font-semibold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-[oklch(0.85_0.15_210)] opacity-0 transition group-hover:opacity-100">
                Explore <ArrowRight className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>

        <div className="card-elevated relative mt-8 overflow-hidden rounded-3xl p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.72_0.19_250/0.15)] via-transparent to-[oklch(0.68_0.22_300/0.15)]" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-[oklch(0.85_0.15_80)] uppercase">
                <Gift className="h-4 w-4" /> Referral rewards
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                Earn up to 40% of every trade your friends make. Forever.
              </h3>
              <p className="mt-2 text-muted-foreground">
                The most generous referral program in the industry. Paid daily, in the asset of your
                choice.
              </p>
            </div>
            <button
              type="button"
              className="gradient-primary glow-primary inline-flex items-center gap-2 justify-self-start rounded-xl px-6 py-3.5 font-medium text-primary-foreground md:justify-self-end"
            >
              Get your link <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
