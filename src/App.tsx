import { useEffect, useMemo, useState } from "react";
import { HistoryList } from "./components/HistoryList";
import { LoadoutCard } from "./components/LoadoutCard";
import { PoolStatus } from "./components/PoolStatus";
import { RollSettingsPanel } from "./components/RollSettingsPanel";
import { consume, createInitialPool } from "./lib/pools";
import { rollCandidate } from "./lib/randomizer";
import { clearState, loadState, saveState } from "./lib/storage";
import type {
  AcceptedLoadout,
  Candidate,
  PoolState,
  RollSettings,
} from "./types/loadout";
import type { PrimaryState } from "./lib/crosshair-generator";
import type { CrosshairSettings } from "./types/loadout";

export default function App() {
  const initial = useMemo(() => loadState(), []);
  const [pool, setPool] = useState<PoolState>(
    initial?.pool ?? createInitialPool(),
  );
  const [history, setHistory] = useState<AcceptedLoadout[]>(
    initial?.history ?? [],
  );
  const [lastReset, setLastReset] = useState<{
    weapons: boolean;
    armor: boolean;
  } | null>(null);
  const [settings, setSettings] = useState<RollSettings>({
    budget: null,
    excludedCategories: [],
  });
  const [candidate, setCandidate] = useState<Candidate | null>(() =>
    rollCandidate(initial?.pool ?? createInitialPool()),
  );

  useEffect(() => {
    saveState({ pool, history });
  }, [pool, history]);

  const handleReroll = () => {
    setCandidate(rollCandidate(pool, settings));
    setLastReset(null);
  };

  const handleAccept = () => {
    if (!candidate) return;
    const accepted: AcceptedLoadout = { ...candidate, acceptedAt: Date.now() };
    const { next, weaponsReset, armorReset } = consume(
      pool,
      candidate.weapon.id,
      candidate.armor.id,
    );
    setHistory((h) => [accepted, ...h]);
    setPool(next);
    setLastReset({ weapons: weaponsReset, armor: armorReset });
    setCandidate(rollCandidate(next, settings));
  };

  const handleCrosshairChange = (
    crosshair: CrosshairSettings,
    primary: PrimaryState,
  ) => {
    if (!candidate) return;
    setCandidate({ ...candidate, crosshair, crosshairPrimary: primary });
  };

  const handleSettingsChange = (next: RollSettings) => {
    setSettings(next);
    // Re-roll with new settings so the current candidate always matches filters
    setCandidate(rollCandidate(pool, next));
    setLastReset(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleResetAll = () => {
    const fresh = createInitialPool();
    setPool(fresh);
    setHistory([]);
    setLastReset(null);
    setCandidate(rollCandidate(fresh, settings));
    clearState();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Valorant Randomizer</h1>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleResetAll}
        >
          Reset everything
        </button>
      </header>

      <main className="app-main">
        {candidate ? (
          <LoadoutCard
            candidate={candidate}
            onReroll={handleReroll}
            onAccept={handleAccept}
            onCrosshairChange={handleCrosshairChange}
          />
        ) : (
          <section className="card">
            <header className="card-header">
              <h2>No valid loadout</h2>
            </header>
            <div className="card-body">
              <p>
                No weapon + armor combo fits the current budget and category
                filters. Adjust your settings or reset the pool.
              </p>
            </div>
            <footer className="card-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReroll}
              >
                Retry
              </button>
            </footer>
          </section>
        )}
        <aside className="sidebar">
          <RollSettingsPanel
            settings={settings}
            onChange={handleSettingsChange}
          />
          <PoolStatus pool={pool} lastReset={lastReset} />
          <HistoryList history={history} onClear={handleClearHistory} />
        </aside>
      </main>

      <footer className="app-footer">
        <p className="muted">
          Data based on Valorant patch 12.06. Reroll does not consume pool
          entries; Accept does.
        </p>
      </footer>
    </div>
  );
}
