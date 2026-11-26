"use client";

const SOUND_KEY = "roadmap:sound";
const listeners = new Set<() => void>();

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
  } catch {
    // Ignore storage quota or privacy-mode errors.
  }
  listeners.forEach((fn) => fn());
}

export function subscribeSound(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined" || !isSoundEnabled()) return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") {
    void audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  startOffset: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.12
) {
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime + startOffset;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

/** Tactile click when selecting an answer card. */
export function playTap() {
  playTone(540, 0, 0.06, "triangle", 0.06);
}

/** Bright ascending chime when an answer is right. */
export function playCorrect() {
  playTone(523.25, 0, 0.14, "triangle", 0.12); // C5
  playTone(659.25, 0.09, 0.22, "triangle", 0.13); // E5
}

/** Soft low two-tone nudge when an answer is wrong. */
export function playWrong() {
  playTone(260, 0, 0.14, "sine", 0.11);
  playTone(196, 0.1, 0.2, "sine", 0.11);
}

/** Celebratory arpeggio on lesson complete. */
export function playComplete() {
  playTone(523.25, 0, 0.14, "triangle", 0.12); // C5
  playTone(659.25, 0.1, 0.14, "triangle", 0.12); // E5
  playTone(783.99, 0.2, 0.16, "triangle", 0.12); // G5
  playTone(1046.5, 0.32, 0.34, "triangle", 0.14); // C6
}
