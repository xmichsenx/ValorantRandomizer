/**
 * Cryptographically strong random utilities backed by `crypto.getRandomValues()`.
 *
 * Drop-in replacements for the common `Math.random()` patterns used throughout
 * the app, but with significantly better entropy.
 */

/** Uniform float in [0, 1). */
export function randomFloat(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000;
}

/** Uniform integer in [min, max] (inclusive). */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomFloat() * (max - min + 1)) + min;
}

/** Returns `true` with the given probability (0–1). */
export function randomChance(probability: number): boolean {
  return randomFloat() < probability;
}

/** Pick a uniformly random element from a non-empty array. */
export function randomFrom<T>(items: T[]): T {
  return items[Math.floor(randomFloat() * items.length)];
}
