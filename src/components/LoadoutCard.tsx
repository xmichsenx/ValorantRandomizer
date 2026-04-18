import { useState } from "react";
import type { Candidate } from "../types/loadout";
import { CrosshairPreview } from "./CrosshairPreview";

interface Props {
  candidate: Candidate;
  onReroll: () => void;
  onAccept: () => void;
}

function CrosshairCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable (insecure context); fall back to select.
      setCopied(false);
    }
  };

  return (
    <div className="crosshair-code">
      <label className="crosshair-code-label">Crosshair code</label>
      <div className="crosshair-code-row">
        <input
          className="crosshair-code-input"
          readOnly
          value={code}
          onFocus={(e) => e.currentTarget.select()}
          spellCheck={false}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCopy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="muted">
        Paste into Valorant → Settings → Crosshair → Import Profile Code.
      </p>
    </div>
  );
}

export function LoadoutCard({ candidate, onReroll, onAccept }: Props) {
  const total = candidate.weapon.cost + candidate.armor.cost;
  return (
    <section className="card">
      <header className="card-header">
        <h2>Current Roll</h2>
      </header>

      <div className="card-body">
        <div className="crosshair-slot">
          <CrosshairPreview crosshair={candidate.crosshair} />
          <CrosshairCode code={candidate.crosshair.code} />
          <CrosshairDetails candidate={candidate} />
        </div>

        <div className="loadout-rows">
          <Row
            label="Weapon"
            value={`${candidate.weapon.name} (${candidate.weapon.category})`}
            cost={candidate.weapon.cost}
          />
          <Row
            label="Armor"
            value={candidate.armor.name}
            cost={candidate.armor.cost}
          />
          <Row label="Total" value="" cost={total} highlight />
        </div>
      </div>

      <footer className="card-actions">
        <button type="button" className="btn btn-secondary" onClick={onReroll}>
          Reroll
        </button>
        <button type="button" className="btn btn-primary" onClick={onAccept}>
          Accept
        </button>
      </footer>
    </section>
  );
}

function Row({
  label,
  value,
  cost,
  highlight,
}: {
  label: string;
  value: string;
  cost: number;
  highlight?: boolean;
}) {
  return (
    <div className={`row${highlight ? " row-total" : ""}`}>
      <span className="row-label">{label}</span>
      <span className="row-value">{value}</span>
      <span className="row-cost">{cost} cr</span>
    </div>
  );
}

function CrosshairDetails({ candidate }: { candidate: Candidate }) {
  const c = candidate.crosshair;
  return (
    <ul className="crosshair-details">
      <li>
        <strong>Color:</strong>{" "}
        <span style={{ color: c.color }}>{c.color}</span>
      </li>
      <li>
        <strong>Outlines:</strong>{" "}
        {c.outlines
          ? `on (${c.outlineThickness}px, ${c.outlineOpacity})`
          : "off"}
      </li>
      <li>
        <strong>Center dot:</strong>{" "}
        {c.centerDot
          ? `on (${c.centerDotThickness}px, ${c.centerDotOpacity})`
          : "off"}
      </li>
      <li>
        <strong>Inner lines:</strong>{" "}
        {c.innerLines.show
          ? `len ${c.innerLines.length}, thick ${c.innerLines.thickness}, offset ${c.innerLines.offset}`
          : "off"}
      </li>
      <li>
        <strong>Outer lines:</strong>{" "}
        {c.outerLines.show
          ? `len ${c.outerLines.length}, thick ${c.outerLines.thickness}, offset ${c.outerLines.offset}`
          : "off"}
      </li>
    </ul>
  );
}
