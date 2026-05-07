## Goal

Replace the single paperclip "attach file" button with a popover menu that lets the user choose between two ways to provide a wine list:

1. **Upload a file** (image/PDF) — current behavior
2. **Provide a URL** to a wine list — new behavior, the app fetches and reads the page

## UI changes (`src/components/ChatInterface.tsx`)

- Replace the existing paperclip `Button` with a shadcn `Popover`.
- Trigger: same paperclip icon button.
- Popover content lists two options (with icons from `lucide-react`):
  - **Upload file** (`Paperclip` / `FileText` icon) — opens the existing hidden file input.
  - **From URL** (`Link` or `Globe` icon) — reveals a small input + "Add" button inside the popover.
- When a URL is added, store it as a new "url" attachment chip alongside file chips, with the same remove (`X`) affordance. Display it as a pill showing the hostname.
- `attachments` state extended: a URL attachment has shape `{ type: "url", url: string }` (alongside existing `image`/`pdf` items). Update `FileAttachment` typing accordingly.

## Send flow

- On `handleSend`, build the existing `fileData` array from file attachments as today.
- Additionally collect URL attachments into a new `urls: string[]` field passed to `streamWineChat` and forwarded to the edge function.

## Edge function (`supabase/functions/wine-chat/index.ts`)

- Accept new `urls?: string[]` field in the request body.
- For each URL: server-side `fetch(url)` and extract readable text:
  - If `Content-Type` is HTML, strip tags / scripts / styles with a small regex-based extractor and truncate to a sane size (e.g. 20k chars) to keep token usage bounded.
  - If non-HTML text (plain text, markdown), use as-is.
  - On fetch failure, append a short note like `Could not fetch <url>: <error>` so the model can tell the user.
- Append the extracted content as additional text blocks in the multimodal `content` array of the last user message:
  ```
  Wine list from <url>:
  <extracted text>
  ```
- Keep current image/PDF handling unchanged.

## Library updates (`src/lib/wineChat.ts`)

- Extend `streamWineChat` params with optional `urls?: string[]` and include it in the POST body.

## Validation

- Client-side: validate URL with `new URL(value)` before adding; show a toast on invalid input.
- Trim input; ignore empty.

## Out of scope

- No JS rendering / headless browser. Static HTML fetch only. If user reports a JS-only menu page later, we can add Firecrawl as a follow-up.
- No persistence of URLs beyond the current message.

## Files touched

- `src/components/ChatInterface.tsx` — popover UI, URL attachment handling, send payload
- `src/lib/wineChat.ts` — pass `urls` through
- `supabase/functions/wine-chat/index.ts` — fetch & inline URL contents
