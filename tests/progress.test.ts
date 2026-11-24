import { describe, expect, it } from "vitest";

import { LocalProgressStore, dayKey } from "@/lib/progress";

function fakeStorage(): Storage {
  const m = new Map<string, string>();
  return {
    get length() {
      return m.size;
    },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, v),
  };
}

const throwing: Storage = {
  get length(): number {
    throw new Error("blocked");
  },
  clear() {
    throw new Error("blocked");
  },
  getItem() {
    throw new Error("blocked");
  },
  key() {
    throw new Error("blocked");
  },
  removeItem() {
    throw new Error("blocked");
  },
  setItem() {
    throw new Error("blocked");
  },
};

describe("LocalProgressStore", () => {
  it("survives a reload (a new instance over the same storage)", () => {
    const s = fakeStorage();
    const a = new LocalProgressStore(() => s);
    a.markComplete("1.1.1");
    a.addPoints(20);
    a.setPlacement({ startTier: 3, answeredAt: "now", skipped: false });
    const b = new LocalProgressStore(() => s);
    expect(b.getCompleted()).toEqual(["1.1.1"]);
    expect(b.getPoints()).toBe(20);
    expect(b.getPlacement()?.startTier).toBe(3);
  });

  it("does not double-count a completed lesson", () => {
    const a = new LocalProgressStore(() => fakeStorage());
    a.markComplete("1.1.1");
    a.markComplete("1.1.1");
    expect(a.getCompleted()).toEqual(["1.1.1"]);
  });

  it("still works when localStorage throws (in memory)", () => {
    const a = new LocalProgressStore(() => throwing);
    expect(() => a.markComplete("1.1.1")).not.toThrow();
    a.addPoints(10);
    expect(a.getCompleted()).toEqual(["1.1.1"]);
    expect(a.getPoints()).toBe(10);
    expect(() => a.reset()).not.toThrow();
    expect(a.getCompleted()).toEqual([]);
  });

  it("works when there is no storage at all", () => {
    const a = new LocalProgressStore(() => null);
    a.markComplete("1.1.1");
    expect(a.getCompleted()).toEqual(["1.1.1"]);
  });

  it("ignores corrupt stored data", () => {
    const s = fakeStorage();
    s.setItem("the-roadmap:progress:v1", "{not json");
    expect(new LocalProgressStore(() => s).getCompleted()).toEqual([]);
  });

  it("reset clears everything", () => {
    const s = fakeStorage();
    const a = new LocalProgressStore(() => s);
    a.markComplete("1.1.1");
    a.touchStreak();
    a.reset();
    const b = new LocalProgressStore(() => s);
    expect(b.getCompleted()).toEqual([]);
    expect(b.getStreak().count).toBe(0);
  });

  it("counts a daily streak in local time", () => {
    const a = new LocalProgressStore(() => fakeStorage());
    const d = (day: number) => new Date(2026, 10, day, 23, 30);
    expect(a.touchStreak(d(1)).count).toBe(1);
    expect(a.touchStreak(d(1)).count).toBe(1);
    expect(a.touchStreak(d(2)).count).toBe(2);
    expect(a.touchStreak(d(3)).count).toBe(3);
    expect(a.getStreak(d(5)).count).toBe(0); // missed the 4th
    expect(a.touchStreak(d(5)).count).toBe(1);
  });

  it("formats day keys from local date parts", () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });
});
