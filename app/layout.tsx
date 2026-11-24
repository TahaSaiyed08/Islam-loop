import type { Metadata, Viewport } from "next";

import { ProgressInit } from "@/components/progress-init";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteUrl } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME}: learn Islam through short, sourced lessons`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
  twitter: { card: "summary", title: SITE_NAME, description: SITE_TAGLINE },
};

export const viewport: Viewport = {
  themeColor: "#0f4a4d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ProgressInit />
        {children}
      </body>
    </html>
  );
}
