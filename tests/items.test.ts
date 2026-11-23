import { beforeEach, describe, expect, it } from "vitest";
import { MemoryStore, type Store } from "../lib/store";

const g = globalThis as unknown as { __store?: Store };

async function freshStore() {
  const store = new MemoryStore();
  g.__store = store;
  return store;
}

describe("addItem", () => {
  beforeEach(freshStore);

  it("creates a document with packed=false and a createdAt", async () => {
    const { addItem } = await import("../lib/items");
    const result = await addItem({ name: "Tent", category: "Shelter", quantity: 2, broughtBy: "Asha" });
    expect("error" in result).toBe(false);
    const item = (result as { item: import("../lib/items").PackingItem }).item;
    expect(item.name).toBe("Tent");
    expect(item.packed).toBe(false);
    expect(item.createdAt).toBeTruthy();
    const stored = await g.__store!.get("packingItems", item.id);
    expect(stored).not.toBeNull();
    expect(stored!.packed).toBe(false);
  });

  it("rejects an empty name", async () => {
    const { addItem } = await import("../lib/items");
    const result = await addItem({ name: "   ", category: "Food", quantity: 1, broughtBy: "Ben" });
    expect("error" in result && result.error).toBeTruthy();
    expect((await g.__store!.list("packingItems")).length).toBe(0);
  });

  it("defaults quantity to 1 and category to Other", async () => {
    const { addItem } = await import("../lib/items");
    const result = await addItem({ name: "Rope", quantity: "abc", broughtBy: "" });
    const item = (result as { item: import("../lib/items").PackingItem }).item;
    expect(item.quantity).toBe(1);
    expect(item.category).toBe("Other");
  });
});

describe("toggleItemPacked", () => {
  beforeEach(freshStore);

  it("flips packed from false to true and back", async () => {
    const { addItem, toggleItemPacked } = await import("../lib/items");
    const { item } = (await addItem({ name: "Stove", category: "Cooking", quantity: 1, broughtBy: "Mira" })) as {
      item: import("../lib/items").PackingItem;
    };
    expect((await toggleItemPacked(item.id))!.packed).toBe(true);
    const stored = await g.__store!.get("packingItems", item.id);
    expect(stored!.packed).toBe(true);
    expect((await toggleItemPacked(item.id))!.packed).toBe(false);
    expect((await g.__store!.get("packingItems", item.id))!.packed).toBe(false);
  });
});

describe("deleteItem", () => {
  beforeEach(freshStore);

  it("removes the target document", async () => {
    const { addItem, deleteItem } = await import("../lib/items");
    const { item } = (await addItem({ name: "Matches", category: "Other", quantity: 1, broughtBy: "Ivy" })) as {
      item: import("../lib/items").PackingItem;
    };
    expect(await deleteItem(item.id)).toBe(true);
    expect(await g.__store!.get("packingItems", item.id)).toBeNull();
    expect((await g.__store!.list("packingItems")).length).toBe(0);
  });
});
