"use client";

import { useEffect } from "react";

import { useProgress } from "@/store/use-progress";

/** Reads saved progress once after hydration (so server and client HTML match). */
export function ProgressInit() {
  const init = useProgress((s) => s.init);
  useEffect(() => init(), [init]);
  return null;
}
