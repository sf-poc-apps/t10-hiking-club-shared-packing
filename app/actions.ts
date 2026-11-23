"use server";

import { revalidatePath } from "next/cache";
import { addItem as createItem, deleteItem as removeItem, toggleItemPacked as flipItem } from "@/lib/items";

const clean = (v: FormDataEntryValue | null, max = 500) => String(v ?? "").trim().slice(0, max);

export async function addItemAction(_prev: { error?: string } | null, form: FormData): Promise<{ error?: string }> {
  const rawQuantity = clean(form.get("quantity"), 3);
  const result = await createItem({
    name: form.get("name"),
    category: form.get("category"),
    quantity: rawQuantity === "" ? 1 : Number(rawQuantity),
    broughtBy: form.get("broughtBy"),
  });
  if ("error" in result && result.error) {
    return { error: result.error };
  }
  revalidatePath("/");
  return {};
}

export async function toggleItemPackedAction(form: FormData) {
  await flipItem(clean(form.get("id"), 64));
  revalidatePath("/");
}

export async function deleteItemAction(form: FormData) {
  await removeItem(clean(form.get("id"), 64));
  revalidatePath("/");
}