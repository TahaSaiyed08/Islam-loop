"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useHydrated } from "@/lib/use-hydrated";
import { useProgress } from "@/store/use-progress";

export function SettingsPanel() {
  const { ready, completed, points, streak, placement, reset } = useProgress();
  const hydrated = useHydrated();
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className="space-y-8" data-hydrated={hydrated}>
      <section
        className="rounded-xl border bg-card p-6"
        aria-labelledby="saved"
      >
        <h2 id="saved" className="text-xl font-bold">
          Saved in this browser
        </h2>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-lg">
          <dt className="text-muted-foreground">Lessons finished</dt>
          <dd data-testid="stat-completed">{ready ? completed.length : 0}</dd>
          <dt className="text-muted-foreground">Points</dt>
          <dd data-testid="stat-points">{ready ? points : 0}</dd>
          <dt className="text-muted-foreground">Daily streak</dt>
          <dd data-testid="stat-streak">{ready ? streak : 0}</dd>
          <dt className="text-muted-foreground">Starting tier</dt>
          <dd data-testid="stat-placement">
            {ready && placement ? placement.startTier : 1}
          </dd>
        </dl>
      </section>

      <section
        className="rounded-xl border bg-card p-6"
        aria-labelledby="reset"
      >
        <h2 id="reset" className="text-xl font-bold">
          Reset progress
        </h2>
        <p className="mt-2 text-muted-foreground">
          This clears finished lessons, points, your streak and your placement
          from this browser. It cannot be undone.
        </p>
        {!confirming ? (
          <Button
            variant="default"
            className="mt-4"
            onClick={() => {
              setDone(false);
              setConfirming(true);
            }}
            data-testid="reset-open"
          >
            Reset progress
          </Button>
        ) : (
          <div
            className="mt-4 rounded-lg border-2 border-danger/40 bg-danger-soft p-4"
            role="alertdialog"
            aria-labelledby="reset-q"
          >
            <p id="reset-q" className="font-semibold">
              Erase all progress on this device?
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button
                variant="danger"
                onClick={() => {
                  reset();
                  setConfirming(false);
                  setDone(true);
                }}
                data-testid="reset-confirm"
              >
                Yes, erase it
              </Button>
              <Button variant="default" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        {done && (
          <p
            className="mt-4 font-semibold text-success"
            role="status"
            data-testid="reset-done"
          >
            Progress cleared.
          </p>
        )}
      </section>
    </div>
  );
}
