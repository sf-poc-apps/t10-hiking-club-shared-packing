export const CATEGORIES = ["Food", "Shelter", "Clothing", "Cooking", "First Aid", "Other"] as const;

export type Category = (typeof CATEGORIES)[number];

export const DEFAULT_CATEGORY: Category = "Other";
export const ALL = "All";

export function isCategory(value: unknown): value is Category {
  return CATEGORIES.includes(String(value) as Category);
}
