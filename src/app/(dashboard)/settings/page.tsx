"use client";

import { AccountSettings } from "@/components/settings/account-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { SecuritySettings } from "@/components/settings/security-settings";

export default function SettingsPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-6 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8 md:pb-10">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account, theme, and security.
          </p>
        </header>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-medium text-foreground">Profile</h2>
            <p className="text-xs text-muted-foreground">
              Your name and email on Notely.
            </p>
          </div>
          <AccountSettings />
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-medium text-foreground">Appearance</h2>
            <p className="text-xs text-muted-foreground">
              Choose how Notely looks on this device.
            </p>
          </div>
          <AppearanceSettings />
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-medium text-foreground">Security</h2>
            <p className="text-xs text-muted-foreground">
              Password, two-factor authentication, and active sessions.
            </p>
          </div>
          <SecuritySettings />
        </section>
      </div>
    </main>
  );
}
