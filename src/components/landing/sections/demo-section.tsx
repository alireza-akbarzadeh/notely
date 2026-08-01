"use client";

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Circle,
  Hash,
  Link2,
  PenLine,
  Search,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

import { Section, SectionHeading } from "@/components/landing/shared/section-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "write", label: "Write", icon: PenLine, hint: "A focused editor that saves your draft as you type." },
  { value: "find", label: "Find", icon: Search, hint: "One search across every space, title, and body." },
  { value: "plan", label: "Plan", icon: CalendarDays, hint: "Events and reminders tied to the notes behind them." },
  { value: "share", label: "Share", icon: Users, hint: "Invite one person to one note, as editor or viewer." },
  { value: "ask", label: "Ask", icon: Sparkles, hint: "An assistant that reads the note you have open." },
] as const;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm"
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="min-h-[20rem] p-6 md:p-8">{children}</div>
    </div>
  );
}

function WriteScreen() {
  return (
    <article className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {["planning", "team"].map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
          >
            <Hash className="size-2.5" />
            {tag}
          </span>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          Draft saved
        </span>
      </div>
      <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
        Q3 planning — open questions
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Headings, lists, quotes, code, and images live in the same surface. You
        write, Notely keeps the draft — no save button, no lost paragraph when
        the tab closes.
      </p>
      <blockquote className="border-l-2 border-primary pl-4 text-sm text-muted-foreground italic">
        The point of the workspace is that nothing has to be filed before it can
        be written.
      </blockquote>
      <div className="rounded-xl border border-border/70 bg-background/60 p-4">
        <p className="text-[11px] font-medium tracking-[0.18em] text-primary uppercase">
          Checklist
        </p>
        <div className="mt-3 space-y-2 text-sm">
          {[
            ["Draft the roadmap summary", true],
            ["Collect feedback from design", false],
          ].map(([text, done]) => (
            <div key={text as string} className="flex items-center gap-2">
              {done ? (
                <CheckCircle2 className="size-4 text-primary" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  done ? "text-muted-foreground line-through" : "text-foreground",
                )}
              >
                {text as string}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function FindScreen() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
        <Search className="size-4 text-primary" />
        <span className="text-sm">roadmap</span>
        <span className="ml-auto text-xs text-muted-foreground">3 results</span>
      </div>
      {[
        ["Q3 planning — open questions", "…the roadmap summary still needs the design input…", "Work"],
        ["Weekly review", "…moved roadmap review to Thursday…", "Journal"],
        ["Interview notes: M. Vale", "…asked how the roadmap gets decided…", "Work"],
      ].map(([title, snippet, space]) => (
        <div
          key={title}
          className="rounded-xl border border-border/70 bg-background/40 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-foreground">{title}</p>
            <span className="text-[11px] text-muted-foreground">{space}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{snippet}</p>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">
        Filter the same list by tag, favorite, or space without leaving the
        search field.
      </p>
    </div>
  );
}

function PlanScreen() {
  return (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold tracking-tight">
        Thursday, 14 March
      </h3>
      <div className="space-y-3">
        {[
          ["09:30", "Roadmap review", "Q3 planning — open questions"],
          ["13:00", "1:1 with Dana", "Interview notes: M. Vale"],
          ["17:00", "Weekly review", "Weekly review"],
        ].map(([time, title, note]) => (
          <div
            key={title}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-background/40 p-4"
          >
            <span className="font-tabular text-sm text-primary">{time}</span>
            <span className="text-sm text-foreground">{title}</span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link2 className="size-3.5" />
              {note}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
        <Bell className="mt-0.5 size-4 shrink-0 text-primary" />
        Reminders arrive as push notifications — on your phone, at the time you
        chose, even when Notely is closed.
      </div>
    </div>
  );
}

function ShareScreen() {
  return (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold tracking-tight">
        Q3 planning — open questions
      </h3>
      <p className="text-sm text-muted-foreground">
        Sharing is per note, not per space. Everything else you wrote stays
        private.
      </p>
      <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70 bg-background/40">
        {[
          ["dana@studio.co", "Editor", "Accepted"],
          ["ilya@lab.dev", "Viewer", "Pending"],
        ].map(([email, role, status]) => (
          <div key={email} className="flex flex-wrap items-center gap-3 p-4">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {email.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm text-foreground">{email}</span>
            <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
              {role}
            </span>
            <span className="text-[11px] text-muted-foreground">{status}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-muted-foreground">
        <span className="flex-1">name@company.com</span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
          <Send className="size-3" />
          Invite
        </span>
      </div>
    </div>
  );
}

function AskScreen() {
  return (
    <div className="space-y-4">
      <div className="ml-auto max-w-md rounded-2xl rounded-br-md bg-primary/10 p-4 text-sm text-foreground">
        What did we decide about the roadmap, and what is still open?
      </div>
      <div className="max-w-lg space-y-3 rounded-2xl rounded-bl-md border border-border/70 bg-background/50 p-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-primary uppercase">
          <Sparkles className="size-3.5" />
          Assistant
        </p>
        <p>
          Decided: ship the editor rewrite first, then reminders. Still open: who
          owns the design review, and whether the calendar work lands this
          quarter.
        </p>
        <p>The note also has two unfinished tasks tied to those questions.</p>
      </div>
      <p className="text-xs text-muted-foreground">
        The assistant only reads the note you have open — nothing else in your
        workspace.
      </p>
    </div>
  );
}

export function DemoSection() {
  return (
    <Section id="demo">
      <SectionHeading
        eyebrow="Product tour"
        title="Take it for a walk"
        description="Five screens that cover most of a week: writing, finding, planning, sharing, and asking."
      />

      <Tabs defaultValue="write" className="mt-10 gap-6">
        <TabsList
          variant="line"
          className="h-auto flex-wrap justify-start gap-2 p-0"
        >
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-9 flex-none rounded-lg border-border px-3.5 data-active:border-primary/50 data-active:bg-primary/10 data-active:text-foreground"
            >
              <Icon className="size-4" strokeWidth={1.75} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map(({ value, hint }) => (
          <TabsContent key={value} value={value} className="space-y-5">
            <p className="max-w-xl text-sm text-muted-foreground">{hint}</p>
            <Frame>
              {value === "write" ? <WriteScreen /> : null}
              {value === "find" ? <FindScreen /> : null}
              {value === "plan" ? <PlanScreen /> : null}
              {value === "share" ? <ShareScreen /> : null}
              {value === "ask" ? <AskScreen /> : null}
            </Frame>
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
}
