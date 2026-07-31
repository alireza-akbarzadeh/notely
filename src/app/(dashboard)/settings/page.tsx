"use client";

import { Header } from "@/components/layout/header";
import { AccountSettings } from "@/components/settings/account-settings";
import { SecuritySettings } from "@/components/settings/security-settings";

export default function SettingsPage() {
  return (
    <>
      <Header
        title="Settings"
        subtitle="Account and security for your Notely workspace"
      />

      <main className="grid flex-1 gap-6 p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:p-6 md:pb-6 xl:grid-cols-2">
        <AccountSettings />
        <SecuritySettings />
      </main>
    </>
  );
}
