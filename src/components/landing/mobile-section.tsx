"use client";

import { Check, Smartphone } from "lucide-react";
import { useMemo } from "react";

import { ASSETS, MOBILE_FEATURES } from "@/lib/landing/constants";

type PhoneMockProps = {
  variant: "portfolio" | "trade";
};

function PhoneMock({ variant }: PhoneMockProps) {
  const candles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        key: i,
        up: Math.random() > 0.5,
        h: 20 + Math.random() * 40,
        y: 30 + Math.random() * 20,
      })),
    [],
  );

  return (
    <div className="h-[520px] w-64 rounded-[3rem] border border-white/10 bg-gradient-to-b from-[oklch(0.22_0.015_265)] to-[oklch(0.14_0.01_265)] p-2 shadow-[0_40px_80px_-20px_oklch(0_0_0/0.8)]">
      <div className="relative h-full overflow-hidden rounded-[2.5rem] bg-background">
        <div className="absolute top-2 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div className="px-5 pt-12">
          {variant === "portfolio" ? (
            <>
              <div className="text-xs text-muted-foreground">Total balance</div>
              <div className="mt-1 font-display text-3xl font-bold">$28,412.90</div>
              <div className="text-xs text-[oklch(0.78_0.19_160)]">+$482.10 (1.72%)</div>
              <div className="relative mt-4 h-24 overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-[oklch(0.72_0.19_250/0.2)] to-transparent">
                <svg viewBox="0 0 200 80" className="h-full w-full">
                  <path
                    d="M0,60 L20,50 L40,55 L60,40 L80,45 L100,30 L120,35 L140,20 L160,25 L180,15 L200,10"
                    stroke="oklch(0.72 0.19 250)"
                    fill="none"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="mt-4 space-y-2">
                {ASSETS.slice(0, 4).map((a) => (
                  <div key={a.sym} className="flex items-center gap-2 rounded-lg p-2 hover:bg-white/5">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: `${a.color}22`, color: a.color }}
                    >
                      {a.sym.slice(0, 2)}
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold">{a.sym}</div>
                      <div className="text-[10px] text-muted-foreground">{a.name}</div>
                    </div>
                    <div className="ml-auto text-right text-xs">
                      <div className="font-mono">
                        ${a.price < 10 ? a.price.toFixed(2) : a.price.toLocaleString()}
                      </div>
                      <div
                        className={
                          a.ch > 0
                            ? "text-[10px] text-[oklch(0.78_0.19_160)]"
                            : "text-[10px] text-[oklch(0.7_0.22_25)]"
                        }
                      >
                        {a.ch > 0 ? "+" : ""}
                        {a.ch.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">BTC / USD</div>
                  <div className="font-display text-2xl font-bold">$68,412</div>
                </div>
                <div className="rounded-md bg-[oklch(0.78_0.19_160/0.1)] px-2 py-1 text-xs text-[oklch(0.78_0.19_160)]">
                  +2.84%
                </div>
              </div>
              <div className="mt-4 h-32 rounded-xl border border-white/5 bg-black/40 p-2">
                <svg viewBox="0 0 200 100" className="h-full w-full">
                  {candles.map((c) => (
                    <rect
                      key={c.key}
                      x={c.key * 10 + 2}
                      y={c.y}
                      width="6"
                      height={c.h}
                      fill={c.up ? "oklch(0.78 0.19 160)" : "oklch(0.7 0.22 25)"}
                      rx="1"
                    />
                  ))}
                </svg>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" className="rounded-xl bg-[oklch(0.78_0.19_160)] py-3 text-sm font-semibold text-black">
                  Buy
                </button>
                <button type="button" className="rounded-xl bg-[oklch(0.7_0.22_25)] py-3 text-sm font-semibold text-white">
                  Sell
                </button>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Recent</div>
              {[
                ["Buy BTC", "+0.024"],
                ["Sell ETH", "-1.20"],
                ["Buy SOL", "+12.5"],
              ].map(([a, b]) => (
                <div key={a} className="flex justify-between border-b border-white/5 py-1.5 text-xs">
                  <span>{a}</span>
                  <span className="font-mono text-muted-foreground">{b}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function MobileSection() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div className="relative order-2 h-[600px] lg:order-1">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-80 w-80 rounded-full bg-[oklch(0.72_0.19_250/0.2)] blur-3xl" />
          </div>
          <div className="animate-float absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6">
            <PhoneMock variant="portfolio" />
          </div>
          <div
            className="animate-float absolute top-[45%] left-[62%] -translate-y-1/2 rotate-6"
            style={{ animationDelay: "1s" }}
          >
            <PhoneMock variant="trade" />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="font-mono text-xs tracking-widest text-[oklch(0.72_0.19_250)] uppercase">
            Nexora Mobile
          </div>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            The exchange in your pocket.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Full trading power, biometric security, and real-time price alerts on iOS and Android.
            Rated 4.9 on both stores.
          </p>
          <div className="mt-8 space-y-3">
            {MOBILE_FEATURES.map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[oklch(0.78_0.19_160/0.2)]">
                  <Check className="h-3 w-3 text-[oklch(0.78_0.19_160)]" />
                </div>
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              className="glass-strong inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm transition hover:bg-white/5"
            >
              <Smartphone className="h-4 w-4" /> Download for iOS
            </button>
            <button
              type="button"
              className="glass-strong inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm transition hover:bg-white/5"
            >
              <Smartphone className="h-4 w-4" /> Get on Android
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
