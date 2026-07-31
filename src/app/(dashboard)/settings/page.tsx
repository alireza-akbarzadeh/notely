"use client";

import { AccountSettings } from "@/components/settings/account-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { SecuritySettings } from "@/components/settings/security-settings";

export default function SettingsPage() {
  return (
    <main className="grid flex-1 gap-6 overflow-y-auto p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:p-6 md:pb-6 xl:grid-cols-2">
      <div className="xl:col-span-2">
        <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Account, appearance, and security for your Notely workspace
        </p>
      </div>
      <AccountSettings />
      <AppearanceSettings />
      <SecuritySettings />
    </main>
  );
}
