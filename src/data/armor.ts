import type { Armor } from "../types/loadout";

// Current purchasable armor/shields (Valorant patch 12.06, April 2026).
// Costs sourced from the official Valorant API gear shopData.
export const ARMOR: Armor[] = [
  { id: "none", name: "No Shields", cost: 0 },
  { id: "light", name: "Light Shields", cost: 400 },
  { id: "regen", name: "Regen Shield", cost: 650 },
  { id: "heavy", name: "Heavy Shields", cost: 1000 }
];
