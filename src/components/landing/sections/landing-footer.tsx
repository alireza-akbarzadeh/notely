import Link from "next/link";

import { FOOTER_LINKS } from "@/components/landing/content";
import { NotelyLogo } from "@/components/landing/shared/notely-logo";

export function LandingFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <NotelyLogo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A calm workspace for notes, spaces, and tags — fast on desktop,
            native-feeling on your phone.
          </p>
        </div>

        {FOOTER_LINKS.map(({ title, links }) => (
          <nav key={title} aria-label={title}>
            <h2 className="text-xs font-medium tracking-[0.18em] text-foreground uppercase">
              {title}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {links.map(({ label, href }) =>
                href.startsWith("/") ? (
                  <li key={label}>
                    <Link
                      href={href}
                      className="transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ) : (
                  <li key={label}>
                    <a
                      href={href}
                      className="transition-colors hover:text-foreground"
                    >
                      {label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Notely. Think. Note. Plan.</span>
        <span>Built for quiet minds.</span>
      </div>
    </footer>
  );
}
