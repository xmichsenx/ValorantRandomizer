import { useEffect, useMemo, useState } from "react";
import { HistoryList } from "./components/HistoryList";
import { LoadoutCard } from "./components/LoadoutCard";
import { PoolStatus } from "./components/PoolStatus";
import { consume, createInitialPool } from "./lib/pools";
import { rollCandidate } from "./lib/randomizer";
import { clearState, loadState, saveState } from "./lib/storage";
import type { AcceptedLoadout, Candidate, PoolState } from "./types/loadout";

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
  const [candidate, setCandidate] = useState<Candidate>(() =>
    rollCandidate(initial?.pool ?? createInitialPool()),
  );

  useEffect(() => {
    saveState({ pool, history });
  }, [pool, history]);

  const handleReroll = () => {
    setCandidate(rollCandidate(pool));
    setLastReset(null);
  };

  const handleAccept = () => {
    const accepted: AcceptedLoadout = { ...candidate, acceptedAt: Date.now() };
    const { next, weaponsReset, armorReset } = consume(
      pool,
      candidate.weapon.id,
      candidate.armor.id,
    );
    setHistory((h) => [accepted, ...h]);
    setPool(next);
    setLastReset({ weapons: weaponsReset, armor: armorReset });
    setCandidate(rollCandidate(next));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleResetAll = () => {
    const fresh = createInitialPool();
    setPool(fresh);
    setHistory([]);
    setLastReset(null);
    setCandidate(rollCandidate(fresh));
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
        <LoadoutCard
          candidate={candidate}
          onReroll={handleReroll}
          onAccept={handleAccept}
        />
        <aside className="sidebar">
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
