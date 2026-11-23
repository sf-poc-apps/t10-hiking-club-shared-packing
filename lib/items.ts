import { DEFAULT_CATEGORY, isCategory, type Category } from "./categories";
import { getStore, type Doc } from "./store";

export interface PackingItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  broughtBy: string;
  packed: boolean;
  createdAt: string;
}

const NAME_MAX = 100;
const PERSON_MAX = 60;

function clean(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

function parseQuantity(value: unknown): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, 999) : 1;
}

export function toPackingItem(doc: Doc): PackingItem {
  return {
    id: doc.id,
    name: String(doc.name ?? ""),
    category: (isCategory(doc.category) ? doc.category : DEFAULT_CATEGORY) as Category,
    quantity: parseQuantity(doc.quantity ?? 1),
    broughtBy: String(doc.broughtBy ?? ""),
    packed: Boolean(doc.packed),
    createdAt: String(doc.created_at ?? ""),
  };
}

export async function listItems(): Promise<PackingItem[]> {
  const docs = await getStore().list("packingItems", "-created_at");
  return docs.map(toPackingItem);
}

export async function addItem(data: { name?: unknown; category?: unknown; quantity?: unknown; broughtBy?: unknown }) {
  const name = clean(data.name, NAME_MAX);
  if (!name) return { error: "Item name is required." as const };
  const category: Category = isCategory(data.category) ? data.category : DEFAULT_CATEGORY;
  const quantity = parseQuantity(data.quantity);
  const broughtBy = clean(data.broughtBy, PERSON_MAX);
  const doc = await getStore().create("packingItems", { name, category, quantity, broughtBy, packed: false });
  return { item: toPackingItem(doc) };
}

export async function toggleItemPacked(id: string) {
  const store = getStore();
  const doc = await store.get("packingItems", clean(id, 64));
  if (!doc) return null;
  const updated = await store.update("packingItems", doc.id, { packed: !doc.packed });
  return updated ? toPackingItem(updated) : null;
}

export async function deleteItem(id: string) {
  return getStore().remove("packingItems", clean(id, 64));
}
