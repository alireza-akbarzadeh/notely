"use client";

import { FAQS } from "@/components/landing/content";
import { Section, SectionHeading } from "@/components/landing/shared/section-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <Section id="faq">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything worth knowing before Notely becomes your notebook."
          align="center"
        />

        <Accordion multiple={false} className="mt-12">
          {FAQS.map(({ question, answer }) => (
            <AccordionItem key={question} value={question}>
              <AccordionTrigger className="py-4 text-base">
                {question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
