import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False during server render and hydration, true once the client has taken over. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}
