export type WeaponCategory =
  | "Sidearms"
  | "SMGs"
  | "Shotguns"
  | "Rifles"
  | "Snipers"
  | "Machine Guns";

export interface Weapon {
  id: string;
  name: string;
  category: WeaponCategory;
  cost: number;
}

export interface Armor {
  id: string;
  name: string;
  cost: number;
}

export interface CrosshairSettings {
  /** Importable Valorant crosshair code (e.g. "0;P;c;1;o;1;d;1;z;3;0l;4;0o;2"). */
  code: string;
  color: string;
  outlines: boolean;
  outlineOpacity: number;
  outlineThickness: number;
  centerDot: boolean;
  centerDotOpacity: number;
  centerDotThickness: number;
  innerLines: {
    show: boolean;
    opacity: number;
    length: number;
    /** Vertical length when different from horizontal `length` (asymmetric cross). */
    verticalLength: number;
    thickness: number;
    offset: number;
  };
  outerLines: {
    show: boolean;
    opacity: number;
    length: number;
    verticalLength: number;
    thickness: number;
    offset: number;
  };
}

export interface Candidate {
  weapon: Weapon;
  armor: Armor;
  crosshair: CrosshairSettings;
  crosshairPrimary: import("../lib/crosshair-generator").PrimaryState;
  rolledAt: number;
}

export interface AcceptedLoadout extends Candidate {
  acceptedAt: number;
}

export interface RollSettings {
  budget: number | null;
  excludedCategories: WeaponCategory[];
}

export interface PoolState {
  weaponIds: string[];
  armorIds: string[];
  weaponsResetCount: number;
  armorResetCount: number;
}

export interface PersistedState {
  pool: PoolState;
  history: AcceptedLoadout[];
}
