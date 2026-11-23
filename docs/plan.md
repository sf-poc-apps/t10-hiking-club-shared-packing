# Hiking Club Shared Packing List

## Summary
Hiking club members currently coordinate trip packing through scattered messages, making it hard to see what to bring and who is responsible for each item. This app provides one shared packing list where any member can add items, mark them packed, filter by category and delete items. The outcome is a single source of truth for a trip's gear, with no login required.

## Similar initiatives
- **P-t04: Another POC project (tracker) (nextjs-crud)** — Same stack and tracker pattern; reuse its Firestore CRUD + server action structure as the model for this list.
- **P-t06: Another POC project (workflow) (form-workflow)** — Different stack (form-workflow) and workflow focus; not reused here beyond general CRUD inspiration.
- **P-t01: Another POC project (tracker) (fastapi-crud)** — Same tracker category but Python/FastAPI stack; concepts transfer but no code is reused since we stay on Next.js + Firestore.

## Scope
1. **Add a packing item**
   - *User story:* As a member, I want to add an item with name, category, quantity and who brings it so the group knows what is needed and who is responsible.
   - Given the add form is filled with a name, category, quantity and brought-by name, When I submit, Then the item appears in the shared list.
   - Given a required field (name) is empty, When I submit, Then the item is not created and I see a validation message.

2. **Toggle packed / unpacked**
   - *User story:* As a member, I want to mark an item packed or unpacked so the group sees progress.
   - Given an item in the list, When I toggle its packed state, Then the new state is saved.
   - Given I toggled an item, When I reload the page, Then the state persists.

3. **Filter by category**
   - *User story:* As a member, I want to filter the list by category so I can focus on one group of items.
   - Given items of several categories exist, When I select a category filter, Then only items in that category are shown.
   - Given a category filter is active, When I select "All", Then every item is shown again.

4. **Delete an item**
   - *User story:* As a member, I want to delete an item that is no longer needed.
   - Given an item in the list, When I delete it, Then it disappears and does not reappear after reload.

5. **Shared list with packed count**
   - *User story:* As a member, I want to see one shared list for the trip with a packed count so I know how much is done.
   - Given items exist, When I view the list, Then it shows "X of Y packed".
   - Given the page loads, When there is no login, Then I can use the app by typing my name and a visible POC banner is shown.

## Out of scope
- User accounts or login.
- Multiple trips (single shared list only).
- Email or SMS notifications.
- Payments.
- Editing items after creation.
- Storing personal or confidential data.

## Data model
**Collection: `packingItems`**

| Field | Type | Notes |
|---|---|---|
| `id` | string | Firestore document id |
| `name` | string | Required, item name |
| `category` | string | One of a fixed set (e.g. Food, Shelter, Clothing, Cooking, First Aid, Other) |
| `quantity` | number | Positive integer, defaults to 1 |
| `broughtBy` | string | Free-text member name |
| `packed` | boolean | Defaults to `false` |
| `createdAt` | timestamp | Set on creation, used for ordering |

## Pages and endpoints
This stack uses the App Router with server actions (no custom REST endpoints).

| Path | Purpose | Who uses it |
|---|---|---|
| `/` | Main page: shows POC banner, name field, add-item form, category filter, shared list with packed count, toggle and delete controls | Hiking club members |
| `/api/health` | Template health check (unchanged) | Platform / CI |
| Server action `addItem` | Creates a `packingItem` document | Members (via form) |
| Server action `toggleItemPacked` | Flips `packed` for a document | Members (via list) |
| Server action `deleteItem` | Removes a document | Members (via list) |

## Test plan
**Automated tests (builder must add):**
- Unit test for the add-item server action: valid input creates a document with `packed=false` and a `createdAt`; empty `name` is rejected.
- Unit test for toggle action: flips `packed` from `false` to `true` and back.
- Unit test for delete action: removes the target document.
- Unit test for the category filter helper: given a list and a selected category, returns only matching items; "All" returns everything.
- Unit test for packed-count helper: returns correct "X of Y" for mixed packed states (use the Firestore emulator or a mocked data layer; no live Firestore in CI).

**Manual UAT checklist (requester, on staging):**
1. Open `/` and confirm the POC banner is visible and no login is required.
2. Type a name, add an item with category and quantity; confirm it appears in the list.
3. Toggle the item to packed; reload; confirm it stays packed.
4. Add items in two categories; select one category filter; confirm only those show; select "All" to restore.
5. Confirm the "X of Y packed" count updates as items are toggled.
6. Delete an item; reload; confirm it is gone.

## Risks and guardrails
- **No authentication (template rule):** members are identified only by a typed `broughtBy` name; any member can edit or delete any item. Acceptable for a POC; note this to users.
- **No outbound HTTP / email / payments from the server (template rule):** no notifications are sent; progress is visible on-page only.
- **Shared mutable list:** concurrent edits may overwrite; keep actions idempotent and re-fetch after each mutation (`revalidatePath`).
- **Single shared list:** no trip separation; do not add a trips concept (out of scope).
- **Data sensitivity:** instruct users not to store personal/confidential data; only item and first-name data expected.
- **Keep it small:** fixed category list, no editing feature, single page — fits one sub-40-minute session.

## Builder instructions
1. Start from the `nextjs-crud` template. **Do not change** the POC banner component, `/api/health`, the `Dockerfile`, or the CI files.
2. Define the fixed category list (Food, Shelter, Clothing, Cooking, First Aid, Other) in a shared constant file (e.g. `lib/categories.ts`).
3. Add a Firestore data layer module (e.g. `lib/items.ts`) with functions: `listItems()`, `addItem(data)`, `toggleItemPacked(id)`, `deleteItem(id)`, using the template's existing Firestore client setup. Ensure `addItem` sets `packed=false` and `createdAt`, and validates `name` is non-empty and `quantity` is a positive integer (default 1).
4. Implement server actions in `app/actions.ts` (or the template's actions file) wrapping the data-layer functions; call `revalidatePath('/')` after each mutation.
5. Build the main page `app/page.tsx` (server component) that fetches items, reads the selected category from `searchParams`, filters server-side, and renders: the existing POC banner, a client name field (stored in local component state / `localStorage`, prefilled into the add form), the add-item form, the category filter control, the packed count ("X of Y packed"), and the list.
6. Create client components for the add form (with name, category select, quantity, brought-by), the category filter (updates the `?category=` query param), and each list row (packed toggle + delete button wired to server actions).
7. Add the automated tests listed in the Test plan under the template's test directory, using the Firestore emulator or a mocked data layer so CI needs no live Firestore.
8. Verify locally: add, toggle (with reload), filter, delete, and the packed count all work; confirm the banner shows and no login is required.
9. Run the template's lint/test commands and ensure CI config remains unchanged.
