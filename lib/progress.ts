export type Placement = {
  /** Tier the learner starts at. Tiers below it are marked "skipped". */
  startTier: number;
  answeredAt: string;
  skipped: boolean;
};

export type StreakState = { count: number; lastDay: string | null };

/**
 * The only thing the UI knows about progress. Swap the implementation
 * (e.g. an account-backed store) without touching any component.
 */
export interface ProgressStore {
  getCompleted(): string[];
  markComplete(slug: string): void;
  getPoints(): number;
  addPoints(n: number): void;
  getStreak(now?: Date): StreakState;
  touchStreak(now?: Date): StreakState;
  getPlacement(): Placement | null;
  setPlacement(p: Placement): void;
  reset(): void;
}

type Data = {
  completed: string[];
  points: number;
  streak: StreakState;
  placement: Placement | null;
};

const KEY = "the-roadmap:progress:v1";

const empty = (): Data => ({
  completed: [],
  points: 0,
  streak: { count: 0, lastDay: null },
  placement: null,
});

/** Local calendar day, e.g. "2026-11-24" (the learner's own timezone). */
export function dayKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function addDays(d: Date, n: number): Date {
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  return c;
}

function defaultStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function parse(raw: string | null): Data | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw) as Partial<Data>;
    const d = empty();
    if (Array.isArray(j.completed))
      d.completed = j.completed.filter(
        (s): s is string => typeof s === "string"
      );
    if (typeof j.points === "number" && j.points >= 0) d.points = j.points;
    if (j.streak && typeof j.streak.count === "number")
      d.streak = {
        count: j.streak.count,
        lastDay: typeof j.streak.lastDay === "string" ? j.streak.lastDay : null,
      };
    if (j.placement && typeof j.placement.startTier === "number")
      d.placement = j.placement;
    return d;
  } catch {
    return null;
  }
}

/**
 * localStorage-backed store. If storage is blocked or throws, progress is
 * kept in memory for the session so the site still works.
 */
export class LocalProgressStore implements ProgressStore {
  private mem: Data = empty();

  constructor(private getStorage: () => Storage | null = defaultStorage) {}

  private read(): Data {
    try {
      const parsed = parse(this.getStorage()?.getItem(KEY) ?? null);
      if (parsed) this.mem = parsed;
    } catch {
      /* storage blocked: use the in-memory copy */
    }
    return this.mem;
  }

  private write(d: Data): void {
    this.mem = d;
    try {
      this.getStorage()?.setItem(KEY, JSON.stringify(d));
    } catch {
      /* storage blocked: keep going in memory */
    }
  }

  getCompleted() {
    return [...this.read().completed];
  }

  markComplete(slug: string) {
    const d = this.read();
    if (!d.completed.includes(slug))
      this.write({ ...d, completed: [...d.completed, slug] });
  }

  getPoints() {
    return this.read().points;
  }

  addPoints(n: number) {
    if (n <= 0) return;
    const d = this.read();
    this.write({ ...d, points: d.points + n });
  }

  getStreak(now: Date = new Date()): StreakState {
    const s = this.read().streak;
    if (!s.lastDay) return { count: 0, lastDay: null };
    const alive =
      s.lastDay === dayKey(now) || s.lastDay === dayKey(addDays(now, -1));
    return { count: alive ? s.count : 0, lastDay: s.lastDay };
  }

  touchStreak(now: Date = new Date()): StreakState {
    const d = this.read();
    const today = dayKey(now);
    if (d.streak.lastDay === today) return d.streak;
    const continues = d.streak.lastDay === dayKey(addDays(now, -1));
    const streak = {
      count: continues ? d.streak.count + 1 : 1,
      lastDay: today,
    };
    this.write({ ...d, streak });
    return streak;
  }

  getPlacement() {
    return this.read().placement;
  }

  setPlacement(p: Placement) {
    this.write({ ...this.read(), placement: p });
  }

  reset() {
    this.write(empty());
    try {
      this.getStorage()?.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
}
