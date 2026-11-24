"use client";

import { create } from "zustand";

import { LocalProgressStore, type Placement } from "@/lib/progress";

/** The UI talks to progress only through this store, which wraps a ProgressStore. */
const backend = new LocalProgressStore();

type Snapshot = {
  ready: boolean;
  completed: string[];
  points: number;
  streak: number;
  placement: Placement | null;
};

type State = Snapshot & {
  init: () => void;
  completeLesson: (slug: string, points: number) => void;
  savePlacement: (p: Placement) => void;
  reset: () => void;
};

const read = (): Snapshot => ({
  ready: true,
  completed: backend.getCompleted(),
  points: backend.getPoints(),
  streak: backend.getStreak().count,
  placement: backend.getPlacement(),
});

export const useProgress = create<State>((set) => ({
  ready: false,
  completed: [],
  points: 0,
  streak: 0,
  placement: null,
  init: () => set(read()),
  completeLesson: (slug, points) => {
    backend.markComplete(slug);
    backend.addPoints(points);
    backend.touchStreak();
    set(read());
  },
  savePlacement: (p) => {
    backend.setPlacement(p);
    set(read());
  },
  reset: () => {
    backend.reset();
    set(read());
  },
}));
