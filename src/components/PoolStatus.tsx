import { ARMOR } from "../data/armor";
import { WEAPONS } from "../data/weapons";
import type { PoolState } from "../types/loadout";

interface Props {
  pool: PoolState;
  lastReset?: { weapons: boolean; armor: boolean } | null;
}

export function PoolStatus({ pool, lastReset }: Props) {
  return (
    <section className="card">
      <header className="card-header">
        <h2>Pools</h2>
      </header>
      <div className="pool-grid">
        <div>
          <h3>Weapons</h3>
          <p>
            {pool.weaponIds.length} / {WEAPONS.length} remaining
          </p>
          <p className="muted">Resets: {pool.weaponsResetCount}</p>
          {lastReset?.weapons && (
            <p className="notice">Weapon pool just reset.</p>
          )}
        </div>
        <div>
          <h3>Armor</h3>
          <p>
            {pool.armorIds.length} / {ARMOR.length} remaining
          </p>
          <p className="muted">Resets: {pool.armorResetCount}</p>
          {lastReset?.armor && <p className="notice">Armor pool just reset.</p>}
        </div>
      </div>
    </section>
  );
}
