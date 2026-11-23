import { describe, expect, it } from "vitest";
import { ALL } from "../lib/categories";
import { filterByCategory, packedCount } from "../lib/packing";
import type { PackingItem } from "../lib/items";

const mk = (over: Partial<PackingItem>): PackingItem => ({
  id: Math.random().toString(36).slice(2, 10),
  name: "item",
  category: "Food",
  quantity: 1,
  broughtBy: "",
  packed: false,
  createdAt: new Date().toISOString(),
  ...over,
});

describe("filterByCategory", () => {
  const items = [
    mk({ id: "1", name: "Pasta", category: "Food" }),
    mk({ id: "2", name: "Tent", category: "Shelter" }),
    mk({ id: "3", name: "Boots", category: "Clothing" }),
  ];

  it("returns only matching items for a selected category", () => {
    expect(filterByCategory(items, "Food").map((i) => i.id)).toEqual(["1"]);
    expect(filterByCategory(items, "Shelter").map((i) => i.id)).toEqual(["2"]);
  });

  it("returns everything for All", () => {
    expect(filterByCategory(items, ALL).map((i) => i.id)).toEqual(["1", "2", "3"]);
  });

  it("returns everything for an unknown category", () => {
    expect(filterByCategory(items, "Nonsense").length).toBe(3);
  });
});

describe("packedCount", () => {
  it("returns correct X of Y for mixed packed states", () => {
    const items = [mk({ packed: true }), mk({ packed: false }), mk({ packed: true }), mk({ packed: false })];
    const c = packedCount(items);
    expect(c.packed).toBe(2);
    expect(c.total).toBe(4);
    expect(c.label).toBe("2 of 4 packed");
  });

  it("handles empty and fully packed lists", () => {
    expect(packedCount([]).label).toBe("0 of 0 packed");
    expect(packedCount([mk({ packed: true })]).label).toBe("1 of 1 packed");
  });
});
