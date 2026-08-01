import { Quote } from "lucide-react";

import { TESTIMONIALS } from "@/components/landing/content";
import { Section, SectionHeading } from "@/components/landing/shared/section-shell";

export function TestimonialsSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="In use"
        title="Notes that stay useful after the day they were written"
        align="center"
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map(({ quote, name, role }) => (
          <figure
            key={name}
            className="flex h-full flex-col rounded-2xl border border-border/80 bg-card/50 p-6 backdrop-blur-sm"
          >
            <Quote className="size-5 text-primary/60" strokeWidth={1.75} />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
              {quote}
            </blockquote>
            <figcaption className="mt-6 text-xs text-muted-foreground">
              <span className="text-foreground">{name}</span> — {role}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
