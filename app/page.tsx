import { Suspense } from "react";
import AddItemForm from "./add-item-form";
import CategoryFilter from "./category-filter";
import PackingRow from "./packing-row";
import { listItems } from "@/lib/items";
import { ALL } from "@/lib/categories";
import { filterByCategory, packedCount } from "@/lib/packing";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const items = await listItems();
  const shown = filterByCategory(items, category ?? ALL);
  const count = packedCount(items);

  return (
    <>
      <h1>Hiking Club Shared Packing List</h1>
      <p className="muted">
        One shared list for the trip&apos;s gear. Type your name, add what is needed and mark it packed. No login needed;
        anyone can add, toggle or delete items.
      </p>
      <AddItemForm />
      <div className="toolbar">
        <Suspense fallback={null}>
          <CategoryFilter />
        </Suspense>
        <span className="count" aria-live="polite">
          {count.label}
        </span>
      </div>
      <ul className="list">
        {shown.length === 0 && <li className="muted">No items{category && category !== ALL ? ` in ${category}` : " yet"}.</li>}
        {shown.map((item) => (
          <PackingRow key={item.id} item={item} />
        ))}
      </ul>
    </>
  );
}