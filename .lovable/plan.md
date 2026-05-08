## Goal

Add a "Wine client mode (BETA)" toggle in the user profile. When enabled, every wine recommendation card shows an additional **Cellar price** field — the real retail/cellar price of the bottle, fetched from a live web search (never invented). When disabled (default), the app behaves exactly as today.

## UX

- **Profile panel** (`ProfilePanel.tsx`): new row under the language selector with a `Switch` labeled "Wine client mode (BETA)" + a one-line helper text ("Adds the bottle's cellar price for comparison"). Off by default.
- **Wine card** (`WineCard.tsx`): when client mode is on AND a `cellarPrice` is present, render a new line in the price column directly under the menu price, e.g.:
  - `€45` (menu, existing)
  - `Cellar: €18` (new, smaller, muted)
  - If lookup found nothing, show nothing extra (no "N/A", no placeholder).
- **No retroactive lookup** for wines already shown before the toggle was flipped — applies to new recommendations only. (Keeps scope simple; we can revisit if you'd rather refetch.)

## Data flow

1. Toggle state lives in `UserContext` (`clientMode: boolean`, `setClientMode`). Persisted to `localStorage` so it survives reloads.
2. `ChatInterface` reads `clientMode` and passes `clientMode: true` in the `streamWineChat` request body when on.
3. Edge function `wine-chat` receives `clientMode`. After the AI finishes (non-streaming branch), or — to keep streaming UX — by post-processing on the client after the JSON block is parsed: for each wine in the recommendation, call a **new edge function** `wine-cellar-price` that performs a real web search and returns `{ cellarPrice: string | null, source: string | null }`.
4. Client merges results into the wine objects and re-renders cards as prices arrive (cards show without cellar price first, then update when each lookup resolves).

## Web search provider — needs your input

To get a *real* price (never invented), we must call a search API. Two viable options, both server-side only:

- **Perplexity** (`sonar` model with grounded web search + citations). Clean fit: ask "What is the typical retail/cellar price of {wine name} {year}?" and parse the answer + citation. Requires connecting the Perplexity connector (one-click, no manual key).
- **Firecrawl search** + scrape top results. More plumbing, similar cost.

Recommendation: **Perplexity** — it's literally built for grounded factual lookups with sources, and the answer format is easy to validate ("if no clear price found, return null").

I'll pause for your choice before coding the lookup function.

## Technical details

**`src/contexts/UserContext.tsx`**
- Add `clientMode: boolean` and `setClientMode(v: boolean)`. Initialize from `localStorage.getItem("enoai.clientMode") === "true"`. Persist in `setClientMode`.

**`src/components/ProfilePanel.tsx`**
- Import `Switch`. New section between Language and Wine Preferences with label + helper + `<Switch checked={clientMode} onCheckedChange={setClientMode} />`. Add i18n keys `clientMode`, `clientModeHint` to `LanguageContext`.

**`src/components/WineCard.tsx`**
- Add `cellarPrice?: string` to `WineRecommendation`.
- Read `clientMode` from `useUser()`. In the price column, conditionally render `wine.cellarPrice` under the existing price, styled `text-[10px] sm:text-xs text-muted-foreground`.

**`src/components/ChatInterface.tsx`**
- After `parseWineRecommendation` succeeds on a finished assistant message AND `clientMode` is true, fire one `supabase.functions.invoke("wine-cellar-price", { body: { name, year, region } })` per wine in parallel. As each resolves, update that message's parsed wines and re-render. Store the parsed/enriched data on the message itself so we don't re-fetch.

**`supabase/functions/wine-cellar-price/index.ts`** (new)
- POST `{ name, year?, region? }` → returns `{ cellarPrice: string | null, source: string | null }`.
- Calls Perplexity `sonar` with a tight prompt: "Find the typical retail or cellar price (in EUR if available) of the wine '{name} {year} {region}'. Reply ONLY as JSON: `{\"price\": \"€18\" | null, \"source\": \"<url>\" | null}`. If you cannot find a clear price from a real source, set both to null. Never guess."
- Validates JSON, ensures `price` looks like a currency string (regex), otherwise returns nulls.
- CORS headers, input validation with `zod` (or hand-rolled), 402/429 passthrough like `wine-chat`.

**`supabase/config.toml`** — no changes needed (default `verify_jwt = false` is fine for this read-only lookup).

## Out of scope

- Persisting cellar prices in a database / cache (each chat re-fetches).
- Re-fetching prices for already-shown wine cards when the toggle flips on mid-session.
- Currency conversion — we display whatever the source reports.

## Open question (please answer before I implement)

Use **Perplexity** for the price lookup? If yes, I'll trigger the connector setup as the first implementation step.
