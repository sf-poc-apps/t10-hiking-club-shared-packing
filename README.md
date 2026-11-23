# Hiking Club Shared Packing List

A single shared packing list for a hiking club trip, built with the Next.js App Router (Software Factory POC template).

## What it does

- Any member can add an item with a name, category, quantity and who brings it — no login needed.
- Members mark items packed or unpacked, and the "X of Y packed" count shows trip progress.
- The list can be filtered by category (Food, Shelter, Clothing, Cooking, First Aid, Other).
- Items that are no longer needed can be deleted.

Your name is only stored locally in the browser (localStorage) to prefill the "Brought by" field.

## Usage

1. Run `npm ci`, then `npm run dev` (or `npm run build && npm start`).
2. Open `/`. Type your name, add items, toggle them packed and delete what is not needed.
3. `GET /healthz` is the platform health check.

## Tests

`npm test` runs the vitest suite (data layer, category filter, packed count, banner presence). `npm run build` must pass.
