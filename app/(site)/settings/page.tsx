import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { SettingsPanel } from "@/components/settings-panel";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false },
};

export default function SettingsPage() {
  return (
    <PageShell narrow>
      <h1 className="text-4xl font-bold leading-tight">Settings</h1>
      <div className="mt-8">
        <SettingsPanel />
      </div>
    </PageShell>
  );
}
