"use client";

import {
  Activity,
  DollarSign,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  INITIAL_MARKETS,
  STARTING_CASH,
} from "@/lib/landing/constants";
import { fmtUSD } from "@/lib/landing/format";
import type { FlashMessage, Holding, Market } from "@/lib/landing/types";

import { Sparkline } from "./shared/sparkline";
import { StatCard } from "./shared/stat-card";
import { useReveal } from "./shared/use-reveal";

type Position = Market & {
  qty: number;
  value: number;
  pnl: number;
  pnlPct: number;
};

export function TradeDemoSection() {
  const { ref, seen } = useReveal<HTMLDivElement>();
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [selected, setSelected] = useState("BTC");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amountUsd, setAmountUsd] = useState(500);
  const [cash, setCash] = useState(STARTING_CASH);
  const [holdings, setHoldings] = useState<Record<string, Holding>>({});
  const [priceHistory, setPriceHistory] = useState<Record<string, number[]>>(() =>
    Object.fromEntries(INITIAL_MARKETS.map((m) => [m.sym, Array(40).fill(m.price)])),
  );
  const [flash, setFlash] = useState<FlashMessage | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setMarkets((prev) =>
        prev.map((m) => {
          const drift = (Math.random() - 0.5) * 0.006;
          const next = Math.max(0.01, m.price * (1 + drift));
          return { ...m, price: next };
        }),
      );
    }, 1200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setPriceHistory((prev) => {
      const next: Record<string, number[]> = { ...prev };
      for (const m of markets) {
        const arr = (prev[m.sym] ?? []).concat(m.price);
        next[m.sym] = arr.length > 60 ? arr.slice(arr.length - 60) : arr;
      }
      return next;
    });
  }, [markets]);

  const market = markets.find((m) => m.sym === selected)!;
  const history = priceHistory[selected] ?? [market.price];
  const prevPrice = history[history.length - 2] ?? market.price;
  const tickUp = market.price >= prevPrice;

  const portfolioValue = useMemo(() => {
    let v = cash;
    for (const m of markets) {
      const h = holdings[m.sym];
      if (h) v += h.qty * m.price;
    }
    return v;
  }, [cash, holdings, markets]);

  const totalPnL = portfolioValue - STARTING_CASH;
  const totalPnLPct = (totalPnL / STARTING_CASH) * 100;

  const positions = markets
    .map((m) => {
      const h = holdings[m.sym];
      if (!h || h.qty <= 0) return null;
      const value = h.qty * m.price;
      const pnl = value - h.costBasis;
      const pnlPct = (pnl / h.costBasis) * 100;
      return { ...m, qty: h.qty, value, pnl, pnlPct };
    })
    .filter(Boolean) as Position[];

  const investedValue = positions.reduce((s, p) => s + p.value, 0);

  function execute() {
    setFlash(null);
    if (!amountUsd || amountUsd <= 0) {
      setFlash({ kind: "err", msg: "Enter an amount greater than 0" });
      return;
    }

    const qty = amountUsd / market.price;

    if (side === "buy") {
      if (amountUsd > cash) {
        setFlash({ kind: "err", msg: "Insufficient cash balance" });
        return;
      }
      setCash((c) => c - amountUsd);
      setHoldings((h) => {
        const cur = h[market.sym] ?? { qty: 0, costBasis: 0 };
        return {
          ...h,
          [market.sym]: { qty: cur.qty + qty, costBasis: cur.costBasis + amountUsd },
        };
      });
      setFlash({
        kind: "ok",
        msg: `Bought ${qty.toFixed(6)} ${market.sym} @ ${fmtUSD(market.price)}`,
      });
      return;
    }

    const cur = holdings[market.sym];
    if (!cur || cur.qty * market.price < amountUsd - 0.01) {
      setFlash({ kind: "err", msg: `Not enough ${market.sym} to sell` });
      return;
    }

    const sellQty = amountUsd / market.price;
    const ratio = sellQty / cur.qty;
    setCash((c) => c + amountUsd);
    setHoldings((h) => {
      const nq = cur.qty - sellQty;
      const nb = cur.costBasis * (1 - ratio);
      const next = { ...h };
      if (nq <= 0.000001) delete next[market.sym];
      else next[market.sym] = { qty: nq, costBasis: nb };
      return next;
    });
    setFlash({
      kind: "ok",
      msg: `Sold ${sellQty.toFixed(6)} ${market.sym} @ ${fmtUSD(market.price)}`,
    });
  }

  function reset() {
    setCash(STARTING_CASH);
    setHoldings({});
    setFlash({ kind: "ok", msg: "Demo portfolio reset" });
  }

  return (
    <section id="demo" className="relative overflow-hidden py-32">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div
          ref={ref}
          className={`mx-auto mb-14 max-w-2xl text-center transition-all duration-700 ${seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <div className="glass mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs">
            <Activity className="h-3.5 w-3.5" style={{ color: "var(--emerald-glow)" }} />
            <span className="text-muted-foreground">Live simulator · no signup required</span>
          </div>
          <h2 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Try a trade. <span className="gradient-text">Watch your portfolio move.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A risk-free sandbox mirroring the real Nexora engine. Prices update live, orders fill
            instantly, and analytics recompute in real time.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="card-elevated rounded-3xl p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-xs tracking-widest text-muted-foreground uppercase">
                Order ticket
              </div>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            <div className="mb-5 grid grid-cols-5 gap-1.5">
              {markets.map((m) => (
                <button
                  key={m.sym}
                  type="button"
                  onClick={() => setSelected(m.sym)}
                  className={`rounded-lg py-2 text-xs font-medium transition ${selected === m.sym ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  style={
                    selected === m.sym
                      ? {
                          background:
                            "linear-gradient(180deg, oklch(1 0 0 / 0.08), oklch(1 0 0 / 0.02))",
                          boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.1)",
                        }
                      : { background: "oklch(1 0 0 / 0.02)" }
                  }
                >
                  {m.sym}
                </button>
              ))}
            </div>

            <div
              className="mb-5 rounded-2xl p-4"
              style={{
                background: "oklch(1 0 0 / 0.02)",
                boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.06)",
              }}
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">
                    {market.name} · {market.sym}/USD
                  </div>
                  <div
                    className="mt-1 font-display text-3xl font-semibold tabular-nums transition-colors"
                    style={{ color: tickUp ? "var(--emerald-glow)" : "oklch(0.65 0.24 25)" }}
                  >
                    {fmtUSD(market.price)}
                  </div>
                </div>
                <div className="w-28">
                  <Sparkline points={history.slice(-24)} up={tickUp} />
                </div>
              </div>
            </div>

            <div
              className="mb-4 grid grid-cols-2 gap-2 rounded-xl p-1"
              style={{ background: "oklch(1 0 0 / 0.03)" }}
            >
              <button
                type="button"
                onClick={() => setSide("buy")}
                className={`rounded-lg py-2.5 text-sm font-medium transition ${side === "buy" ? "text-foreground" : "text-muted-foreground"}`}
                style={
                  side === "buy"
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.78 0.19 160 / 0.9), oklch(0.85 0.15 210 / 0.9))",
                        color: "oklch(0.14 0.01 265)",
                      }
                    : undefined
                }
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setSide("sell")}
                className={`rounded-lg py-2.5 text-sm font-medium transition ${side === "sell" ? "text-foreground" : "text-muted-foreground"}`}
                style={
                  side === "sell"
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.65 0.24 25 / 0.9), oklch(0.68 0.22 300 / 0.9))",
                        color: "oklch(0.98 0.005 260)",
                      }
                    : undefined
                }
              >
                Sell
              </button>
            </div>

            <label className="text-xs text-muted-foreground">Amount (USD)</label>
            <div className="relative mt-1.5 mb-2">
              <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="number"
                min={0}
                step={10}
                value={amountUsd}
                onChange={(e) => setAmountUsd(Number(e.target.value))}
                className="w-full rounded-xl bg-transparent py-2.5 pr-3 pl-9 text-lg tabular-nums outline-none focus:ring-2 focus:ring-primary/40"
                style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.08)" }}
              />
            </div>
            <div className="mb-4 flex gap-1.5">
              {[100, 500, 1000, 5000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmountUsd(v)}
                  className="flex-1 rounded-lg py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                  style={{ background: "oklch(1 0 0 / 0.03)" }}
                >
                  ${v.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="mb-4 flex justify-between text-xs text-muted-foreground">
              <span>Est. quantity</span>
              <span className="tabular-nums text-foreground">
                {(amountUsd / market.price).toFixed(6)} {market.sym}
              </span>
            </div>

            <button
              type="button"
              onClick={execute}
              className="glow-primary w-full rounded-xl py-3.5 text-sm font-medium transition hover:opacity-90"
              style={{ background: "var(--gradient-primary)", color: "oklch(0.14 0.01 265)" }}
            >
              {side === "buy" ? `Buy ${market.sym}` : `Sell ${market.sym}`} · {fmtUSD(amountUsd)}
            </button>

            {flash ? (
              <div
                className="animate-rise mt-3 rounded-lg px-3 py-2 text-xs"
                style={{
                  background:
                    flash.kind === "ok"
                      ? "oklch(0.78 0.19 160 / 0.12)"
                      : "oklch(0.65 0.24 25 / 0.12)",
                  color:
                    flash.kind === "ok" ? "var(--emerald-glow)" : "oklch(0.75 0.22 25)",
                }}
              >
                {flash.msg}
              </div>
            ) : null}
          </div>

          <div className="space-y-6 lg:col-span-3">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Portfolio value" value={fmtUSD(portfolioValue)} accent="var(--electric)" />
              <StatCard
                label="Total P&L"
                value={`${totalPnL >= 0 ? "+" : ""}${fmtUSD(totalPnL)}`}
                sub={`${totalPnL >= 0 ? "+" : ""}${totalPnLPct.toFixed(2)}%`}
                accent={totalPnL >= 0 ? "var(--emerald-glow)" : "oklch(0.7 0.24 25)"}
              />
              <StatCard label="Cash available" value={fmtUSD(cash)} accent="var(--cyan-glow)" />
            </div>

            <div className="card-elevated rounded-3xl p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="text-xs tracking-widest text-muted-foreground uppercase">
                  Positions
                </div>
                <div className="text-xs text-muted-foreground">
                  Invested{" "}
                  <span className="tabular-nums text-foreground">{fmtUSD(investedValue)}</span>
                </div>
              </div>

              {positions.length === 0 ? (
                <div className="py-14 text-center">
                  <div
                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: "oklch(1 0 0 / 0.04)" }}
                  >
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No open positions yet. Place your first simulated order to see analytics come
                    alive.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="mb-5 flex h-2.5 overflow-hidden rounded-full"
                    style={{ background: "oklch(1 0 0 / 0.04)" }}
                  >
                    {positions.map((p) => (
                      <div
                        key={p.sym}
                        style={{
                          width: `${(p.value / investedValue) * 100}%`,
                          background: p.color,
                        }}
                        title={`${p.sym} ${((p.value / investedValue) * 100).toFixed(1)}%`}
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    {positions.map((p) => {
                      const alloc = (p.value / investedValue) * 100;
                      const up = p.pnl >= 0;
                      return (
                        <div
                          key={p.sym}
                          className="grid grid-cols-12 items-center gap-3 rounded-xl px-3 py-3"
                          style={{ background: "oklch(1 0 0 / 0.02)" }}
                        >
                          <div className="col-span-3 flex items-center gap-2.5">
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-semibold"
                              style={{
                                background: `${p.color.replace(")", " / 0.15)")}`,
                                color: p.color,
                              }}
                            >
                              {p.sym}
                            </div>
                            <div>
                              <div className="text-sm">{p.name}</div>
                              <div className="text-[10px] text-muted-foreground tabular-nums">
                                {p.qty.toFixed(6)}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="h-1 flex-1 overflow-hidden rounded-full"
                                style={{ background: "oklch(1 0 0 / 0.05)" }}
                              >
                                <div className="h-full" style={{ width: `${alloc}%`, background: p.color }} />
                              </div>
                              <span className="w-10 text-right tabular-nums">{alloc.toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="col-span-3 text-right text-sm tabular-nums">
                            {fmtUSD(p.value)}
                          </div>
                          <div
                            className="col-span-3 inline-flex items-center justify-end gap-1 text-right text-sm tabular-nums"
                            style={{ color: up ? "var(--emerald-glow)" : "oklch(0.7 0.24 25)" }}
                          >
                            {up ? (
                              <TrendingUp className="h-3.5 w-3.5" />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5" />
                            )}
                            {up ? "+" : ""}
                            {fmtUSD(p.pnl)}
                            <span className="text-[10px] opacity-70">
                              ({up ? "+" : ""}
                              {p.pnlPct.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
