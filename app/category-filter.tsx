"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ALL, CATEGORIES } from "@/lib/categories";

export default function CategoryFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const selected = params.get("category") ?? ALL;

  function update(value: string) {
    router.push(value === ALL ? "/" : `/?category=${encodeURIComponent(value)}`);
  }

  return (
    <label className="filter">
      Filter by category
      <select value={selected} onChange={(e) => update(e.target.value)}>
        <option value={ALL}>{ALL}</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}