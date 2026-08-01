import {
  Bell,
  CalendarDays,
  FolderTree,
  ListChecks,
  type LucideIcon,
  Paperclip,
  PenLine,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tags,
  Users,
} from "lucide-react";

import { FEATURES, type FeatureKey } from "@/components/landing/content";
import { Section, SectionHeading } from "@/components/landing/shared/section-shell";

const ICONS: Record<FeatureKey, LucideIcon> = {
  spaces: FolderTree,
  editor: PenLine,
  tags: Tags,
  tasks: ListChecks,
  attachments: Paperclip,
  sharing: Users,
  calendar: CalendarDays,
  reminders: Bell,
  search: Search,
  assistant: Sparkles,
  security: ShieldCheck,
  mobile: Smartphone,
};

export function FeaturesSection() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Features"
        title="Everything a notebook should do, nothing it shouldn't"
        description="Twelve pieces that fit together — each one there because a note eventually needs it, none of them in your way while you write."
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ key, title, body }) => {
          const Icon = ICONS[key];
          return (
            <article
              key={key}
              className="group bg-background p-7 transition-colors hover:bg-card"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-4.5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
