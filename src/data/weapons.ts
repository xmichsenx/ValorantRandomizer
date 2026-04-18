import type { Weapon } from "../types/loadout";

// Current purchasable weapons (Valorant patch 12.06, April 2026).
// Costs sourced from the official Valorant API weapon shopData and cross-checked
// against the community credits reference.
export const WEAPONS: Weapon[] = [
  // Sidearms
  { id: "classic", name: "Classic", category: "Sidearms", cost: 0 },
  { id: "shorty", name: "Shorty", category: "Sidearms", cost: 300 },
  { id: "frenzy", name: "Frenzy", category: "Sidearms", cost: 450 },
  { id: "ghost", name: "Ghost", category: "Sidearms", cost: 500 },
  { id: "bandit", name: "Bandit", category: "Sidearms", cost: 600 },
  { id: "sheriff", name: "Sheriff", category: "Sidearms", cost: 800 },

  // SMGs
  { id: "stinger", name: "Stinger", category: "SMGs", cost: 1100 },
  { id: "spectre", name: "Spectre", category: "SMGs", cost: 1600 },

  // Shotguns
  { id: "bucky", name: "Bucky", category: "Shotguns", cost: 850 },
  { id: "judge", name: "Judge", category: "Shotguns", cost: 1850 },

  // Rifles
  { id: "bulldog", name: "Bulldog", category: "Rifles", cost: 2050 },
  { id: "guardian", name: "Guardian", category: "Rifles", cost: 2250 },
  { id: "phantom", name: "Phantom", category: "Rifles", cost: 2900 },
  { id: "vandal", name: "Vandal", category: "Rifles", cost: 2900 },

  // Sniper Rifles
  { id: "marshal", name: "Marshal", category: "Snipers", cost: 950 },
  { id: "outlaw", name: "Outlaw", category: "Snipers", cost: 2400 },
  { id: "operator", name: "Operator", category: "Snipers", cost: 4700 },

  // Machine Guns
  { id: "ares", name: "Ares", category: "Machine Guns", cost: 1600 },
  { id: "odin", name: "Odin", category: "Machine Guns", cost: 3200 }
];
