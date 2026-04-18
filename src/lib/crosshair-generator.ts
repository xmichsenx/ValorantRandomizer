import type { CrosshairSettings } from "../types/loadout";
import { randomChance, randomFloat, randomInt } from "./rng";

/**
 * Valorant crosshair code generator aligned to the live VCRDB builder.
 *
 * Source of truth used here:
 * - VCRDB builder decoder map extracted from the live Next.js bundle
 * - VCRDB builder defaults extracted from the same bundle
 * - VCRDB randomizer samples captured from the live site
 *
 * That gives us the actual accepted field set and ranges used by a working
 * community generator instead of guessing from scattered sample codes.
 */

export const PRESET_COLORS = [
  "#FFFFFF",
  "#00FF00",
  "#7FFF00",
  "#DFFF00",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#FF0000",
] as const;

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function clampFloat(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, round3(value)));
}

function weightedZero(max: number, zeroChance = 0.18): number {
  return randomChance(zeroChance) ? 0 : randomInt(1, max);
}

function randomHexByte(min = 0, max = 255): string {
  return randomInt(min, max).toString(16).padStart(2, "0").toUpperCase();
}

function randomCustomColor(): string {
  // Keep alpha high enough that the preview is still visible, while allowing
  // goofy washed-out or semi-transparent colors like VCRDB does.
  return `${randomHexByte()}${randomHexByte()}${randomHexByte()}${randomHexByte(128, 255)}`;
}

export interface EncodedLine {
  enabled: boolean;
  width: number;
  length: number;
  verticalEnabled: boolean;
  verticalLength: number;
  offset: number;
  alpha: number;
  movementErrorEnabled: boolean;
  movementErrorMultiplier: number;
  firingErrorEnabled: boolean;
  firingErrorMultiplier: number;
}

export interface PrimaryState {
  color: number;
  customColorEnabled: boolean;
  customColorValue: string;
  outlinesEnabled: boolean;
  outlineWidth: number;
  outlineAlpha: number;
  dotEnabled: boolean;
  dotWidth: number;
  dotAlpha: number;
  overwriteFireMultiplier: boolean;
  inner: EncodedLine;
  outer: EncodedLine;
}

export const DEFAULT_PRIMARY: PrimaryState = {
  color: 0,
  customColorEnabled: false,
  customColorValue: "FFFFFFFF",
  outlinesEnabled: true,
  outlineWidth: 1,
  outlineAlpha: 0.5,
  dotEnabled: false,
  dotWidth: 2,
  dotAlpha: 1,
  overwriteFireMultiplier: false,
  inner: {
    enabled: true,
    width: 2,
    length: 6,
    verticalEnabled: false,
    verticalLength: 6,
    offset: 3,
    alpha: 0.8,
    movementErrorEnabled: false,
    movementErrorMultiplier: 1,
    firingErrorEnabled: true,
    firingErrorMultiplier: 1,
  },
  outer: {
    enabled: true,
    width: 2,
    length: 2,
    verticalEnabled: false,
    verticalLength: 2,
    offset: 10,
    alpha: 0.35,
    movementErrorEnabled: true,
    movementErrorMultiplier: 1,
    firingErrorEnabled: true,
    firingErrorMultiplier: 1,
  },
};

function randomLine(options: {
  showChance: number;
  horizontalMax: number;
  verticalMax: number;
  offsetMax: number;
  defaultMovementError: boolean;
  defaultFiringError: boolean;
}): EncodedLine {
  const enabled = randomChance(options.showChance);

  if (!enabled) {
    return {
      enabled: false,
      width: 0,
      length: 0,
      verticalEnabled: false,
      verticalLength: 0,
      offset: 0,
      alpha: 0,
      movementErrorEnabled: options.defaultMovementError,
      movementErrorMultiplier: 1,
      firingErrorEnabled: options.defaultFiringError,
      firingErrorMultiplier: 1,
    };
  }

  const verticalEnabled = randomChance(0.48);
  let length = verticalEnabled
    ? weightedZero(options.horizontalMax)
    : randomInt(1, options.horizontalMax);
  let verticalLength = verticalEnabled
    ? weightedZero(options.verticalMax)
    : length;

  if (verticalEnabled && length === 0 && verticalLength === 0) {
    if (randomChance(0.5)) {
      length = randomInt(1, options.horizontalMax);
    } else {
      verticalLength = randomInt(1, options.verticalMax);
    }
  }

  return {
    enabled: true,
    width: weightedZero(10, 0.12),
    length,
    verticalEnabled,
    verticalLength,
    offset: randomInt(0, options.offsetMax),
    alpha: clampFloat(randomFloat(), 0, 1),
    movementErrorEnabled: randomChance(0.45),
    movementErrorMultiplier: clampFloat(randomFloat() * 3, 0, 3),
    firingErrorEnabled: randomChance(0.55),
    firingErrorMultiplier: clampFloat(randomFloat() * 3, 0, 3),
  };
}

function randomPrimary(): PrimaryState {
  const customColorEnabled = randomChance(0.82);
  const presetColor = randomInt(0, PRESET_COLORS.length - 1);

  return {
    color: customColorEnabled ? 8 : presetColor,
    customColorEnabled,
    customColorValue: customColorEnabled ? randomCustomColor() : "FFFFFFFF",
    outlinesEnabled: randomChance(0.78),
    outlineWidth: randomInt(1, 6),
    outlineAlpha: clampFloat(randomFloat(), 0, 1),
    dotEnabled: randomChance(0.65),
    dotWidth: randomInt(1, 6),
    dotAlpha: clampFloat(randomFloat(), 0, 1),
    overwriteFireMultiplier: randomChance(0.35),
    inner: randomLine({
      showChance: 0.86,
      horizontalMax: 20,
      verticalMax: 20,
      offsetMax: 20,
      defaultMovementError: false,
      defaultFiringError: true,
    }),
    outer: randomLine({
      showChance: 0.84,
      horizontalMax: 10,
      verticalMax: 20,
      offsetMax: 40,
      defaultMovementError: true,
      defaultFiringError: true,
    }),
  };
}

export function previewColor(primary: PrimaryState): string {
  return primary.customColorEnabled
    ? `#${primary.customColorValue}`
    : PRESET_COLORS[clampInt(primary.color, 0, PRESET_COLORS.length - 1)];
}

function append(parts: string[], key: string, value: string | number): void {
  parts.push(key, String(value));
}

function encodeLine(
  parts: string[],
  prefix: "0" | "1",
  value: EncodedLine,
  defaults: EncodedLine,
  maxHorizontalLength: number,
  maxVerticalLength: number,
  maxOffset: number,
): void {
  const line: EncodedLine = {
    enabled: value.enabled,
    width: clampInt(value.width, 0, 10),
    length: clampInt(value.length, 0, maxHorizontalLength),
    verticalEnabled: value.verticalEnabled,
    verticalLength: clampInt(value.verticalLength, 0, maxVerticalLength),
    offset: clampInt(value.offset, 0, maxOffset),
    alpha: clampFloat(value.alpha, 0, 1),
    movementErrorEnabled: value.movementErrorEnabled,
    movementErrorMultiplier: clampFloat(value.movementErrorMultiplier, 0, 3),
    firingErrorEnabled: value.firingErrorEnabled,
    firingErrorMultiplier: clampFloat(value.firingErrorMultiplier, 0, 3),
  };

  if (line.enabled !== defaults.enabled) {
    append(parts, `${prefix}b`, Number(line.enabled));
    return;
  }

  if (line.width !== defaults.width) {
    append(parts, `${prefix}t`, line.width);
  }
  if (line.length !== defaults.length) {
    append(parts, `${prefix}l`, line.length);
  }
  if (line.verticalEnabled) {
    append(parts, `${prefix}v`, line.verticalLength);
    append(parts, `${prefix}g`, 1);
  }
  if (line.offset !== defaults.offset) {
    append(parts, `${prefix}o`, line.offset);
  }
  if (line.alpha !== defaults.alpha) {
    append(parts, `${prefix}a`, line.alpha);
  }
  if (line.movementErrorEnabled !== defaults.movementErrorEnabled) {
    append(parts, `${prefix}m`, Number(line.movementErrorEnabled));
  }
  if (line.firingErrorEnabled !== defaults.firingErrorEnabled) {
    append(parts, `${prefix}f`, Number(line.firingErrorEnabled));
  }
  if (
    line.movementErrorEnabled &&
    line.movementErrorMultiplier !== defaults.movementErrorMultiplier
  ) {
    append(parts, `${prefix}s`, line.movementErrorMultiplier);
  }
  if (
    line.firingErrorEnabled &&
    line.firingErrorMultiplier !== defaults.firingErrorMultiplier
  ) {
    append(parts, `${prefix}e`, line.firingErrorMultiplier);
  }
}

export function buildCode(primary: PrimaryState): string {
  const state: PrimaryState = {
    ...primary,
    color: clampInt(primary.color, 0, 8),
    customColorValue: primary.customColorValue.toUpperCase(),
    outlineWidth: clampInt(primary.outlineWidth, 1, 6),
    outlineAlpha: clampFloat(primary.outlineAlpha, 0, 1),
    dotWidth: clampInt(primary.dotWidth, 1, 6),
    dotAlpha: clampFloat(primary.dotAlpha, 0, 1),
    overwriteFireMultiplier: primary.overwriteFireMultiplier,
    inner: primary.inner,
    outer: primary.outer,
  };

  const parts: string[] = ["0", "P"];

  if (state.customColorEnabled) {
    append(parts, "c", 8);
    append(parts, "u", state.customColorValue);
  } else if (state.color !== DEFAULT_PRIMARY.color) {
    append(parts, "c", state.color);
  }

  if (!state.outlinesEnabled) {
    append(parts, "h", 0);
  } else {
    if (state.outlineWidth !== DEFAULT_PRIMARY.outlineWidth) {
      append(parts, "t", state.outlineWidth);
    }
    if (state.outlineAlpha !== DEFAULT_PRIMARY.outlineAlpha) {
      append(parts, "o", state.outlineAlpha);
    }
  }

  if (state.dotEnabled) {
    append(parts, "d", 1);
  }
  if (state.customColorEnabled) {
    append(parts, "b", 1);
  }
  if (state.dotEnabled && state.dotWidth !== DEFAULT_PRIMARY.dotWidth) {
    append(parts, "z", state.dotWidth);
  }
  if (state.dotEnabled && state.dotAlpha !== DEFAULT_PRIMARY.dotAlpha) {
    append(parts, "a", state.dotAlpha);
  }
  if (state.overwriteFireMultiplier) {
    append(parts, "m", 1);
  }

  encodeLine(parts, "0", state.inner, DEFAULT_PRIMARY.inner, 20, 20, 20);
  encodeLine(parts, "1", state.outer, DEFAULT_PRIMARY.outer, 10, 20, 40);

  return parts.join(";");
}

export function primaryToSettings(primary: PrimaryState): CrosshairSettings {
  return {
    code: buildCode(primary),
    color: previewColor(primary),
    outlines: primary.outlinesEnabled,
    outlineOpacity: primary.outlineAlpha,
    outlineThickness: primary.outlineWidth,
    centerDot: primary.dotEnabled,
    centerDotOpacity: primary.dotAlpha,
    centerDotThickness: primary.dotWidth,
    innerLines: {
      show: primary.inner.enabled,
      opacity: primary.inner.alpha,
      length: primary.inner.length,
      verticalLength: primary.inner.verticalEnabled
        ? primary.inner.verticalLength
        : primary.inner.length,
      thickness: primary.inner.width,
      offset: primary.inner.offset,
    },
    outerLines: {
      show: primary.outer.enabled,
      opacity: primary.outer.alpha,
      length: primary.outer.length,
      verticalLength: primary.outer.verticalEnabled
        ? primary.outer.verticalLength
        : primary.outer.length,
      thickness: primary.outer.width,
      offset: primary.outer.offset,
    },
  };
}

export function generateCrosshair(): {
  settings: CrosshairSettings;
  primary: PrimaryState;
} {
  const primary = randomPrimary();
  return { settings: primaryToSettings(primary), primary };
}
