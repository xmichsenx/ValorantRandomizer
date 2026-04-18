import { ARMOR } from "../data/armor";
import { WEAPONS } from "../data/weapons";
import type { Armor, Candidate, PoolState, Weapon } from "../types/loadout";
import { generateCrosshair } from "./crosshair-generator";
import { pickRandomArmorId, pickRandomWeaponId } from "./pools";

function findWeapon(id: string): Weapon {
  const weapon = WEAPONS.find((w) => w.id === id);
  if (!weapon) throw new Error(`Unknown weapon id: ${id}`);
  return weapon;
}

function findArmor(id: string): Armor {
  const armor = ARMOR.find((a) => a.id === id);
  if (!armor) throw new Error(`Unknown armor id: ${id}`);
  return armor;
}

/**
 * Build a fresh candidate from the current pool. Pool state is not mutated
 * here; consumption only happens on accept.
 */
export function rollCandidate(pool: PoolState): Candidate {
  return {
    weapon: findWeapon(pickRandomWeaponId(pool)),
    armor: findArmor(pickRandomArmorId(pool)),
    crosshair: generateCrosshair(),
    rolledAt: Date.now()
  };
}
