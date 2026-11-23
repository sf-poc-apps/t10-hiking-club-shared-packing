"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, DEFAULT_CATEGORY } from "@/lib/categories";
import { addItemAction } from "./actions";

export default function AddItemForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const [quantity, setQuantity] = useState("1");
  const [broughtBy, setBroughtBy] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("memberName");
    if (saved) setBroughtBy(saved.slice(0, 60));
  }, []);

  function saveName(value: string) {
    setBroughtBy(value);
    if (value.trim()) window.localStorage.setItem("memberName", value.trim().slice(0, 60));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Item name is required.");
      return;
    }
    setPending(true);
    const form = new FormData();
    form.set("name", name);
    form.set("category", category);
    form.set("quantity", quantity);
    form.set("broughtBy", broughtBy);
    const result = await addItemAction(null, form);
    setPending(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setName("");
    setQuantity("1");
  }

  return (
    <form onSubmit={submit} className="card">
      <label>
        Item name
        <input name="name" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tent poles" />
      </label>
      <label>
        Category
        <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label>
        Quantity
        <input name="quantity" type="number" min={1} max={999} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </label>
      <label>
        Brought by
        <input name="broughtBy" value={broughtBy} maxLength={60} onChange={(e) => saveName(e.target.value)} placeholder="Your name" />
      </label>
      <button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add item"}
      </button>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}