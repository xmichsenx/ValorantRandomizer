# Valorant Randomizer

Random loadout generator for Valorant. Rolls a weapon, armor, and crosshair for you so you don't have to think about it.

## Features

- Random weapon + armor + crosshair combos from a depletion pool (no repeats until everything's been picked)
- Budget filter: set a max credit limit
- Category filter: exclude weapon types you don't want
- Crosshair editor: tweak the generated crosshair or just use it as-is
- Crosshair codes are importable directly into Valorant
- History of accepted loadouts, persisted in localStorage

## Running locally

```
npm install
npm run dev
```

## Building

```
npm run build
```

Output goes to `dist/`.

## Tech

React, TypeScript, Vite. No backend, everything runs client-side.

## Disclaimer

Not affiliated with or endorsed by Riot Games. Valorant is a trademark of Riot Games, Inc.
