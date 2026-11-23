import { ALL, isCategory, type Category } from "./categories";
import type { PackingItem } from "./items";

export function filterByCategory(items: PackingItem[], selected: string): PackingItem[] {
  if (selected === ALL || !isCategory(selected)) return items;
  return items.filter((item) => item.category === (selected as Category));
}

export function packedCount(items: PackingItem[]): { packed: number; total: number; label: string } {
  const packed = items.filter((item) => item.packed).length;
  return { packed, total: items.length, label: `${packed} of ${items.length} packed` };
}
