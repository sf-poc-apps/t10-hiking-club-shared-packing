"use client";

import { deleteItemAction, toggleItemPackedAction } from "./actions";
import type { PackingItem } from "@/lib/items";

export default function PackingRow({ item }: { item: PackingItem }) {
  return (
    <li className={item.packed ? "packed" : ""}>
      <form action={toggleItemPackedAction} className="inline">
        <input type="hidden" name="id" value={item.id} />
        <button type="submit" className="toggle" aria-label={item.packed ? `Mark ${item.name} unpacked` : `Mark ${item.name} packed`}>
          {item.packed ? "✓" : "○"}
        </button>
      </form>
      <div>
        <strong>{item.name}</strong>{" "}
        <span className="muted">
          ×{item.quantity} · {item.category}
          {item.broughtBy ? ` · ${item.broughtBy}` : ""}
        </span>
      </div>
      <form action={deleteItemAction} className="inline">
        <input type="hidden" name="id" value={item.id} />
        <button type="submit" className="danger" aria-label={`Delete ${item.name}`}>
          Delete
        </button>
      </form>
    </li>
  );
}