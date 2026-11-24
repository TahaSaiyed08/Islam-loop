import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex h-full max-w-xl flex-col items-center justify-center px-6 text-center"
    >
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-3xl font-bold text-neutral-700">
        This page is not on the map
      </h1>
      <p className="mt-3 text-lg text-neutral-600">
        The page may have moved, or the lesson may not be open yet.
      </p>
      <Button asChild size="lg" variant="secondary" className="mt-8">
        <Link href="/learn">Back to the path</Link>
      </Button>
    </main>
  );
}
