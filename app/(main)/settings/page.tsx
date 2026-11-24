import type { Metadata } from "next";

import { SettingsPanel } from "@/components/settings-panel";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false },
};

export default function SettingsPage() {
  return (
    <div className="px-6 pb-10">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold leading-tight">Settings</h1>
        <div className="mt-8">
          <SettingsPanel />
        </div>
      </div>
    </div>
  );
}
