import { describe, expect, it } from "vitest";

import { findBanned } from "@/lib/banned";

describe("banned words", () => {
  it.each([
    "the Shia view", "Shi’a scholars", "a Sunni text", "Twelver", "every sect", "a madhhab",
    "Abu Bakr", "Umar said", "Mu’awiya", "Muawiya", "Imamate", "Saqifa", "Fadak", "Ghadir",
    "the Occultation", "Ziyarat", "succession",
  ])("catches %s", (t) => expect(findBanned(t)).not.toBeNull());

  it.each([
    "insect and intersect", "a dissection", "Umara", "Imam Ali ibn Abi Talib", "Husayn", "Karbala",
  ])("allows %s", (t) => expect(findBanned(t)).toBeNull());
});
