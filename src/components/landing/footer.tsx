import { Code2, Globe2, MessageCircle } from "lucide-react";

import { FOOTER_GROUPS } from "@/lib/landing/constants";

import { NexoraLogo } from "./shared/nexora-logo";

const SOCIAL_ICONS = [MessageCircle, Code2, Globe2] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_repeat(6,1fr)]">
          <div>
            <NexoraLogo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The digital asset exchange for serious traders and institutions.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIAL_ICONS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="glass flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-white/5"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(FOOTER_GROUPS).map(([g, links]) => (
            <div key={g}>
              <div className="text-xs font-semibold tracking-widest text-foreground uppercase">
                {g}
              </div>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground transition hover:text-foreground">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-8">
          <div className="text-xs text-muted-foreground">
            © 2026 Nexora Technologies. All rights reserved.
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Cookies
            </a>
            <a href="#" className="hover:text-foreground">
              Disclosures
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
