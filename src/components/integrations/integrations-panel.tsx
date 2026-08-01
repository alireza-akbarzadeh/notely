"use client";

import { GoogleConnectionCard } from "@/components/integrations/google-connection-card";

export function IntegrationsPanel() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-6 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8 md:pb-10">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Integrations
          </h1>
          <p className="text-sm text-muted-foreground">
            Connect the apps you already use, then import their content into
            your notes.
          </p>
        </header>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Connected accounts
            </h2>
            <p className="text-xs text-muted-foreground">
              Notely only requests read access and never sends mail on your
              behalf.
            </p>
          </div>
          <GoogleConnectionCard />
        </section>
      </div>
    </main>
  );
}
