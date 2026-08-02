import { WORKFLOW } from "@/components/landing/content";
import { Section, SectionHeading } from "@/components/landing/shared/section-shell";

export function WorkflowSection() {
  return (
    <Section id="how" className="bg-card/30">
      <SectionHeading
        eyebrow="How it works"
        title="Capture first. Organize when it matters."
        description="Notely does not ask you to pick a folder before you are allowed to have a thought."
      />

      <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {WORKFLOW.map(({ step, title, body }) => (
          <li key={step} className="relative">
            <span className="font-display text-5xl font-bold text-primary/30">
              {step}
            </span>
            <h3 className="font-display mt-4 text-xl font-semibold tracking-tight">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
