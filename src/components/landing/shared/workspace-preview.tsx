import {
  Briefcase,
  CheckCircle2,
  Circle,
  Hash,
  Paperclip,
  Pin,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";

const SPACES = [
  { name: "Work", icon: Briefcase, active: true },
  { name: "Reading", icon: Star, active: false },
  { name: "Journal", icon: Pin, active: false },
];

const NOTES = [
  { title: "Q3 planning — open questions", tag: "planning", active: true },
  { title: "Interview notes: M. Vale", tag: "research", active: false },
  { title: "Reading list", tag: "personal", active: false },
  { title: "Weekly review", tag: "journal", active: false },
];

const TASKS = [
  { text: "Draft the roadmap summary", done: true },
  { text: "Collect feedback from design", done: true },
  { text: "Share note with Dana", done: false },
];

/**
 * Static, non-interactive mock of the Notely workspace used as hero artwork.
 * Rendered in markup rather than as a screenshot so it follows the theme.
 */
export function WorkspacePreview({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm",
        className,
      )}
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <div className="ml-3 flex flex-1 items-center gap-2 rounded-lg bg-muted/60 px-2.5 py-1.5 text-xs text-muted-foreground">
          <Search className="size-3.5" />
          Search notes, tags, and tasks
        </div>
      </div>

      <div className="grid min-h-[22rem] grid-cols-1 sm:grid-cols-[9rem_minmax(0,1fr)] lg:grid-cols-[9rem_13rem_minmax(0,1fr)]">
        <aside className="hidden flex-col gap-1 border-r border-border/60 p-3 sm:flex">
          <p className="px-2 pb-2 text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Spaces
          </p>
          {SPACES.map(({ name, icon: Icon, active }) => (
            <div
              key={name}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs",
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Icon className={cn("size-3.5", active && "text-primary")} />
              {name}
            </div>
          ))}
        </aside>

        <div className="hidden flex-col gap-1 border-r border-border/60 p-3 lg:flex">
          <p className="px-2 pb-2 text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Notes
          </p>
          {NOTES.map(({ title, tag, active }) => (
            <div
              key={title}
              className={cn(
                "rounded-lg px-2 py-2",
                active && "note-active-rail bg-muted/60 pl-3",
              )}
            >
              <p className="line-clamp-1 text-xs text-foreground">{title}</p>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Hash className="size-2.5" />
                {tag}
              </p>
            </div>
          ))}
        </div>

        <article className="flex flex-col gap-4 p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              <Hash className="size-2.5" />
              planning
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              <Paperclip className="size-2.5" />2 files
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground">
              Saved
            </span>
          </div>

          <h3 className="font-display text-xl font-semibold tracking-tight">
            Q3 planning — open questions
          </h3>

          <div className="space-y-2">
            <div className="h-2 w-[92%] rounded-full bg-muted" />
            <div className="h-2 w-[78%] rounded-full bg-muted" />
            <div className="h-2 w-[85%] rounded-full bg-muted" />
          </div>

          <div className="space-y-2 rounded-xl border border-border/70 bg-background/60 p-3">
            {TASKS.map(({ text, done }) => (
              <div key={text} className="flex items-center gap-2 text-xs">
                {done ? (
                  <CheckCircle2 className="size-3.5 text-primary" />
                ) : (
                  <Circle className="size-3.5 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    done && "text-muted-foreground line-through",
                    !done && "text-foreground",
                  )}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 shrink-0 text-primary" />
            Summarize this note into three bullets for the team update.
          </div>
        </article>
      </div>
    </div>
  );
}
