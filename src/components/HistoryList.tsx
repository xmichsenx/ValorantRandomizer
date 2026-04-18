import type { AcceptedLoadout } from "../types/loadout";

interface Props {
  history: AcceptedLoadout[];
  onClear: () => void;
}

export function HistoryList({ history, onClear }: Props) {
  return (
    <section className="card">
      <header className="card-header">
        <h2>Accepted ({history.length})</h2>
        {history.length > 0 && (
          <button type="button" className="btn btn-ghost" onClick={onClear}>
            Clear
          </button>
        )}
      </header>
      {history.length === 0 ? (
        <p className="muted">No accepted loadouts yet.</p>
      ) : (
        <ol className="history">
          {history.map((item) => (
            <li key={item.acceptedAt}>
              <span className="history-weapon">{item.weapon.name}</span>
              <span className="muted"> + </span>
              <span className="history-armor">{item.armor.name}</span>
              <span className="history-cost">
                {item.weapon.cost + item.armor.cost} cr
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
