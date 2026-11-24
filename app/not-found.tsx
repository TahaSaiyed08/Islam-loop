import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        <div className="container max-w-xl py-20 text-center">
          <p className="text-6xl font-bold text-primary">404</p>
          <h1 className="mt-4 text-3xl font-bold">
            This page is not on the map
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            The page may have moved, or the lesson may not be open yet.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/learn">Back to the path</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
