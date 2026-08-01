import Link from "next/link";
import { Check, Minus } from "lucide-react";

import { COMPARISON_ROWS, PRICING_PLANS } from "@/components/landing/content";
import { Section, SectionHeading } from "@/components/landing/shared/section-shell";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function Availability({ included }: { included: boolean }) {
  return included ? (
    <>
      <Check className="mx-auto size-4 text-primary" aria-hidden />
      <span className="sr-only">Included</span>
    </>
  ) : (
    <>
      <Minus className="mx-auto size-4 text-muted-foreground/60" aria-hidden />
      <span className="sr-only">Not included</span>
    </>
  );
}

export function PricingSection() {
  return (
    <Section id="pricing" className="bg-card/30">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple plans, no surprises"
        description="Start free and stay free if that is all you need. Upgrade only when sharing, planning, or the assistant become part of your week."
        align="center"
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-2xl border p-7",
              plan.featured
                ? "border-primary/50 bg-card"
                : "border-border/80 bg-card/40",
            )}
            style={
              plan.featured ? { boxShadow: "var(--shadow-glow)" } : undefined
            }
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium tracking-widest uppercase">
                {plan.name}
              </h3>
              {plan.featured ? (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  Most popular
                </span>
              ) : null}
            </div>

            <p className="font-display mt-5 text-4xl font-bold tracking-tight">
              {plan.price}
              {plan.period ? (
                <span className="text-base font-normal text-muted-foreground">
                  {plan.period}
                </span>
              ) : null}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {plan.description}
            </p>

            <ul className="mt-7 flex-1 space-y-3 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={plan.cta.href}
              className={cn(
                buttonVariants({
                  size: "lg",
                  variant: plan.featured ? "default" : "outline",
                }),
                "mt-8 h-10 w-full",
              )}
            >
              {plan.cta.label}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-14 overflow-hidden rounded-2xl border border-border/80">
        <Table>
          <TableHeader>
            <TableRow className="bg-card/60">
              <TableHead className="px-6 py-4">Compare plans</TableHead>
              {PRICING_PLANS.map((plan) => (
                <TableHead
                  key={plan.name}
                  className={cn(
                    "px-6 py-4 text-center",
                    plan.featured && "text-primary",
                  )}
                >
                  {plan.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {COMPARISON_ROWS.map((row) => (
              <TableRow key={row.feature}>
                <TableCell className="px-6 py-4 text-foreground">
                  {row.feature}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Availability included={row.personal} />
                </TableCell>
                <TableCell className="bg-primary/5 px-6 py-4 text-center">
                  <Availability included={row.pro} />
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Availability included={row.team} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}
