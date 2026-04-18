import { ARMOR } from "../data/armor";
import { WEAPONS } from "../data/weapons";
import type {
  Armor,
  Candidate,
  PoolState,
  RollSettings,
  Weapon,
} from "../types/loadout";
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

function applyFilters(
  pool: PoolState,
  settings: RollSettings,
): {
  weaponIds: string[];
  armorIds: string[];
} {
  let weaponIds = pool.weaponIds;
  let armorIds = pool.armorIds;

  // Exclude weapon categories
  if (settings.excludedCategories.length > 0) {
    weaponIds = weaponIds.filter((id) => {
      const w = findWeapon(id);
      return !settings.excludedCategories.includes(w.category);
    });
  }

  if (settings.budget != null) {
    const budget = settings.budget;

    // Only keep weapons that can pair with at least one available armor
    const armorCosts = armorIds.map((id) => findArmor(id).cost);
    const minArmorCost = Math.min(...armorCosts);
    weaponIds = weaponIds.filter(
      (id) => findWeapon(id).cost + minArmorCost <= budget,
    );

    // Only keep armor that can pair with at least one remaining weapon
    if (weaponIds.length > 0) {
      const weaponCosts = weaponIds.map((id) => findWeapon(id).cost);
      const minWeaponCost = Math.min(...weaponCosts);
      armorIds = armorIds.filter(
        (id) => findArmor(id).cost + minWeaponCost <= budget,
      );
    }
  }

  return { weaponIds, armorIds };
}

/**
 * Build a fresh candidate from the current pool. Pool state is not mutated
 * here; consumption only happens on accept.
 *
 * Returns `null` when no valid loadout exists within the given settings.
 */
export function rollCandidate(
  pool: PoolState,
  settings: RollSettings = { budget: null, excludedCategories: [] },
): Candidate | null {
  const filtered = applyFilters(pool, settings);
  if (filtered.weaponIds.length === 0 || filtered.armorIds.length === 0) {
    return null;
  }

  const weapon = findWeapon(
    pickRandomWeaponId({ ...pool, weaponIds: filtered.weaponIds }),
  );
  let availableArmor = filtered.armorIds;
  if (settings.budget != null) {
    availableArmor = availableArmor.filter(
      (id) => findArmor(id).cost + weapon.cost <= settings.budget!,
    );
  }
  if (availableArmor.length === 0) return null;

  const armor = findArmor(
    pickRandomArmorId({ ...pool, armorIds: availableArmor }),
  );
  const { settings: crosshair, primary } = generateCrosshair();

  return {
    weapon,
    armor,
    crosshair,
    crosshairPrimary: primary,
    rolledAt: Date.now(),
  };
}
