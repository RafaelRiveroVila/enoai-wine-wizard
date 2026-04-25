## Plan

Update the mobile chat scrolling so it behaves like an iPhone-style indicator: only a small pill appears while scrolling, then fades away, with no visible track/background behind it.

### What I’ll change
1. Remove the current global mobile scrollbar styling that targets `html`, `body`, and `*`, since that is forcing custom scrollbars everywhere and is likely what creates the dark/black background.
2. Scope native scrollbar styling to desktop-only usage, or make mobile scrollbars effectively invisible.
3. In `ChatInterface`, add a small custom scroll indicator overlay for the messages area:
   - positioned on the right edge of the chat panel
   - sized based on scrollable content height
   - updated as the user scrolls
   - fades in during scrolling and fades out shortly after scrolling stops
4. Keep the indicator trackless so the page/card background remains fully visible behind it.
5. Preserve the current mobile layout fixes so the chat still fills the phone height correctly.

### Files likely involved
- `src/index.css`
- `src/components/ChatInterface.tsx`

### Technical details
- The current CSS applies scrollbar rules globally:
  - `scrollbar-color: transparent transparent`
  - `::-webkit-scrollbar`, `::-webkit-scrollbar-track`, `::-webkit-scrollbar-thumb`
- On mobile-like preview environments, browser scrollbar styling can still render an unwanted dark track/background.
- Instead of fighting browser scrollbar rendering, I’ll hide the native visual scrollbar for the chat scroller on mobile and render a lightweight overlay pill using React state + scroll position.

```text
Chat scroll area
┌───────────────────────────────┐
│ message content          │    │
│                         │ pill│  <- visible only while scrolling
│                         │    │
└───────────────────────────────┘
```

### Result
- No black scrollbar background
- A clean iPhone-like floating pill on mobile
- Indicator appears only while scrolling and disappears when idle
- The page background remains the actual visible background

Approve this plan and I’ll implement it.