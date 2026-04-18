import type { RollSettings, WeaponCategory } from "../types/loadout";

const ALL_CATEGORIES: WeaponCategory[] = [
  "Sidearms",
  "SMGs",
  "Shotguns",
  "Rifles",
  "Snipers",
  "Machine Guns",
];

interface Props {
  settings: RollSettings;
  onChange: (settings: RollSettings) => void;
}

export function RollSettingsPanel({ settings, onChange }: Props) {
  const toggleCategory = (cat: WeaponCategory) => {
    const excluded = settings.excludedCategories.includes(cat)
      ? settings.excludedCategories.filter((c) => c !== cat)
      : [...settings.excludedCategories, cat];
    onChange({ ...settings, excludedCategories: excluded });
  };

  const handleBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange({
      ...settings,
      budget: raw === "" ? null : Math.max(0, Number(raw)),
    });
  };

  return (
    <section className="settings-panel">
      <h3 className="settings-title">Roll Settings</h3>

      <div className="settings-group">
        <label className="settings-label" htmlFor="budget-input">
          Max budget (credits)
        </label>
        <input
          id="budget-input"
          className="settings-input"
          type="number"
          min={0}
          step={50}
          placeholder="No limit"
          value={settings.budget ?? ""}
          onChange={handleBudget}
        />
      </div>

      <fieldset className="settings-group">
        <legend className="settings-label">Weapon categories</legend>
        <div className="settings-categories">
          {ALL_CATEGORIES.map((cat) => (
            <label key={cat} className="settings-checkbox">
              <input
                type="checkbox"
                checked={!settings.excludedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
