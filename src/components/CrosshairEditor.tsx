import { useState } from "react";
import type { CrosshairSettings } from "../types/loadout";
import {
  type EncodedLine,
  PRESET_COLORS,
  type PrimaryState,
  primaryToSettings,
} from "../lib/crosshair-generator";

interface Props {
  primary: PrimaryState;
  onChange: (crosshair: CrosshairSettings, primary: PrimaryState) => void;
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="editor-slider">
      <span className="editor-slider-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="editor-slider-value">
        {step < 1 ? value.toFixed(2) : value}
      </span>
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="editor-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function LineEditor({
  title,
  line,
  maxLength,
  maxOffset,
  onChange,
}: {
  title: string;
  line: EncodedLine;
  maxLength: number;
  maxOffset: number;
  onChange: (line: EncodedLine) => void;
}) {
  const update = (patch: Partial<EncodedLine>) =>
    onChange({ ...line, ...patch });

  return (
    <fieldset className="editor-fieldset">
      <legend>{title}</legend>
      <ToggleRow
        label="Show"
        checked={line.enabled}
        onChange={(v) => update({ enabled: v })}
      />
      {line.enabled && (
        <>
          <SliderRow
            label="Length"
            value={line.length}
            min={0}
            max={maxLength}
            onChange={(v) => update({ length: v })}
          />
          <SliderRow
            label="Thickness"
            value={line.width}
            min={0}
            max={10}
            onChange={(v) => update({ width: v })}
          />
          <SliderRow
            label="Offset"
            value={line.offset}
            min={0}
            max={maxOffset}
            onChange={(v) => update({ offset: v })}
          />
          <SliderRow
            label="Opacity"
            value={line.alpha}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => update({ alpha: v })}
          />
        </>
      )}
    </fieldset>
  );
}

export function CrosshairEditor({ primary, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const update = (patch: Partial<PrimaryState>) => {
    const next = { ...primary, ...patch };
    onChange(primaryToSettings(next), next);
  };

  const handleColorPreset = (index: number) => {
    update({
      color: index,
      customColorEnabled: false,
      customColorValue: "FFFFFFFF",
    });
  };

  const handleCustomColor = (hex: string) => {
    // Convert #RRGGBB to RRGGBBFF
    const raw = hex.replace("#", "").toUpperCase();
    const withAlpha = raw.length === 6 ? raw + "FF" : raw;
    update({ color: 8, customColorEnabled: true, customColorValue: withAlpha });
  };

  if (!open) {
    return (
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => setOpen(true)}
      >
        Edit Crosshair
      </button>
    );
  }

  return (
    <div className="crosshair-editor">
      <div className="editor-header">
        <h4>Crosshair Editor</h4>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>

      <fieldset className="editor-fieldset">
        <legend>Color</legend>
        <div className="editor-color-presets">
          {PRESET_COLORS.map((color, i) => (
            <button
              key={color}
              type="button"
              className={`editor-color-swatch${!primary.customColorEnabled && primary.color === i ? " active" : ""}`}
              style={{ background: color }}
              aria-label={color}
              onClick={() => handleColorPreset(i)}
            />
          ))}
          <label className="editor-color-custom">
            <input
              type="color"
              value={
                primary.customColorEnabled
                  ? `#${primary.customColorValue.slice(0, 6)}`
                  : "#FFFFFF"
              }
              onChange={(e) => handleCustomColor(e.target.value)}
            />
            <span className={primary.customColorEnabled ? "active" : ""}>
              Custom
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset className="editor-fieldset">
        <legend>Outlines</legend>
        <ToggleRow
          label="Enabled"
          checked={primary.outlinesEnabled}
          onChange={(v) => update({ outlinesEnabled: v })}
        />
        {primary.outlinesEnabled && (
          <>
            <SliderRow
              label="Width"
              value={primary.outlineWidth}
              min={1}
              max={6}
              onChange={(v) => update({ outlineWidth: v })}
            />
            <SliderRow
              label="Opacity"
              value={primary.outlineAlpha}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => update({ outlineAlpha: v })}
            />
          </>
        )}
      </fieldset>

      <fieldset className="editor-fieldset">
        <legend>Center Dot</legend>
        <ToggleRow
          label="Enabled"
          checked={primary.dotEnabled}
          onChange={(v) => update({ dotEnabled: v })}
        />
        {primary.dotEnabled && (
          <>
            <SliderRow
              label="Width"
              value={primary.dotWidth}
              min={1}
              max={6}
              onChange={(v) => update({ dotWidth: v })}
            />
            <SliderRow
              label="Opacity"
              value={primary.dotAlpha}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => update({ dotAlpha: v })}
            />
          </>
        )}
      </fieldset>

      <LineEditor
        title="Inner Lines"
        line={primary.inner}
        maxLength={20}
        maxOffset={20}
        onChange={(inner) => update({ inner })}
      />

      <LineEditor
        title="Outer Lines"
        line={primary.outer}
        maxLength={10}
        maxOffset={40}
        onChange={(outer) => update({ outer })}
      />
    </div>
  );
}
