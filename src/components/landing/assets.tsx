"use client";

import { useMemo } from "react";

import { ASSETS } from "@/lib/landing/constants";
import type { Asset } from "@/lib/landing/types";

import { Sparkline } from "./shared/sparkline";

function AssetCard({ asset }: { asset: Asset }) {
  const spark = useMemo(() => {
    let v = 50;
    return Array.from({ length: 24 }, () => {
      v += (Math.random() - (asset.ch > 0 ? 0.35 : 0.65)) * 6;
      return v;
    });
  }, [asset.ch]);

  return (
    <div className="card-elevated min-w-[240px] shrink-0 rounded-2xl p-4 transition-transform hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
          style={{ background: `${asset.color}22`, color: asset.color }}
        >
          {asset.sym.slice(0, 2)}
        </div>
        <div>
          <div className="text-sm font-semibold">{asset.sym}</div>
          <div className="text-xs text-muted-foreground">{asset.name}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="font-mono text-sm tabular-nums">
            ${asset.price < 10 ? asset.price.toFixed(3) : asset.price.toLocaleString()}
          </div>
          <div
            className={`text-xs ${asset.ch > 0 ? "text-[oklch(0.78_0.19_160)]" : "text-[oklch(0.7_0.22_25)]"}`}
          >
            {asset.ch > 0 ? "+" : ""}
            {asset.ch.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Sparkline points={spark} up={asset.ch > 0} />
      </div>
    </div>
  );
}

export function AssetsSection() {
  const loop = [...ASSETS, ...ASSETS];

  return (
    <section id="markets" className="relative overflow-hidden py-24">
      <div className="mx-auto mb-10 max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs tracking-widest text-[oklch(0.72_0.19_250)] uppercase">
              Markets
            </div>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
              1,000+ assets. One platform.
            </h2>
          </div>
          <a href="#demo" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            See all markets →
          </a>
        </div>
      </div>
      <div className="relative [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-ticker flex w-max gap-4 px-6">
          {loop.map((asset, i) => (
            <AssetCard key={`${asset.sym}-${i}`} asset={asset} />
          ))}
        </div>
      </div>
    </section>
  );
}
