import { ARMOR } from "../data/armor";
import { WEAPONS } from "../data/weapons";
import { randomFrom } from "./rng";
import type { PoolState } from "../types/loadout";

export function createInitialPool(): PoolState {
  return {
    weaponIds: WEAPONS.map((w) => w.id),
    armorIds: ARMOR.map((a) => a.id),
    weaponsResetCount: 0,
    armorResetCount: 0,
  };
}

export function pickRandomWeaponId(pool: PoolState): string {
  return randomFrom(pool.weaponIds);
}

export function pickRandomArmorId(pool: PoolState): string {
  return randomFrom(pool.armorIds);
}

/**
 * Consume a weapon and an armor id from the pool. If either category is
 * exhausted after removal, that category alone is repopulated from the full
 * source list and its reset counter is incremented so the UI can surface it.
 */
export function consume(
  pool: PoolState,
  weaponId: string,
  armorId: string,
): { next: PoolState; weaponsReset: boolean; armorReset: boolean } {
  let weaponIds = pool.weaponIds.filter((id) => id !== weaponId);
  let armorIds = pool.armorIds.filter((id) => id !== armorId);

  let weaponsReset = false;
  let armorReset = false;

  if (weaponIds.length === 0) {
    weaponIds = WEAPONS.map((w) => w.id);
    weaponsReset = true;
  }
  if (armorIds.length === 0) {
    armorIds = ARMOR.map((a) => a.id);
    armorReset = true;
  }

  return {
    next: {
      weaponIds,
      armorIds,
      weaponsResetCount: pool.weaponsResetCount + (weaponsReset ? 1 : 0),
      armorResetCount: pool.armorResetCount + (armorReset ? 1 : 0),
    },
    weaponsReset,
    armorReset,
  };
}
