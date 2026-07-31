"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { FAQS } from "@/lib/landing/constants";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-16 text-center">
          <div className="font-mono text-xs tracking-widest text-[oklch(0.72_0.19_250)] uppercase">
            FAQ
          </div>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Answers, not asterisks.
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="card-elevated overflow-hidden rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-6 text-left transition hover:bg-white/[0.02]"
                >
                  <span className="pr-4 font-medium">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
