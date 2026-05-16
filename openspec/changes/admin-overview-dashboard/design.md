## Context

The admin portal is already authenticated and hotel-scoped, but the current overview page is still too sparse and technical for the primary landing experience. The new version should feel like a premium operations dashboard inspired by the reference image: calm, organized, high-trust, and visually distinctive without becoming ornamental.

The page must still respect the project patterns already in place:

- hotel selection stays explicit
- data stays backend-driven
- empty and error states remain visible
- the shell and navigation stay consistent with the existing admin portal

## Goals / Non-Goals

**Goals:**
- Make the overview page the strongest and most polished page in the admin portal.
- Keep all overview data functional and backed by the current services.
- Present the layout in a way that feels closer to an operational hotel command center than a generic SaaS dashboard.
- Improve readability of live activity and system status.
- Make the design direction reusable for future admin pages.

**Non-Goals:**
- Redesigning the reservations, branding, devices, audit, or identity pages in this change.
- Reworking admin authentication or portal navigation.
- Inventing new hotel business data that does not exist yet.
- Introducing heavy charting infrastructure if the current payload can be rendered with a simpler, lighter component.

## Decisions

### 1. Keep this change limited to the overview page
The first iteration should focus only on the admin overview route and not spread into the rest of the portal.

**Why:** A smaller scope makes the page easier to polish deeply and reduces the risk of mixing concerns with the other admin sections.

**Alternatives considered:**
- Updating the whole admin portal at once.
- Folding the redesign into the reservations page too.

**Why not those:** They would slow the change down and blur the page-by-page rollout the user wants.

### 2. Treat the reference image as the layout and mood target
The overview should follow the same visual rhythm as the image: headline, compact KPI cards, a primary chart area, a live activity panel, and a lower section for unit performance.

**Why:** The image gives a clear product direction and avoids generic enterprise-dashboard styling.

**Alternatives considered:**
- Building a totally different visual system.
- Reusing the current admin styles with minor spacing adjustments.

**Why not those:** They would miss the requested design target and leave the page feeling like the current implementation.

### 3. Render operational summaries instead of raw records
Dashboard activity and device information should be formatted into readable rows and cards.

**Why:** Raw JSON is functional but not trustworthy or scan-friendly for operators.

**Alternatives considered:**
- Showing `JSON.stringify` output.
- Hiding activity sections until richer backend models exist.

**Why not those:** They reduce clarity and make the page feel unfinished.

### 4. Prefer lightweight visualizations over overbuilt charting
If the backend data can support a simple trend visualization, use a lightweight component or CSS-based chart treatment before introducing a large charting dependency.

**Why:** The page should stay fast and maintainable, and the overview only needs a clean signal visualization.

**Alternatives considered:**
- Adding a full analytics charting library.
- Omitting the trend section entirely.

**Why not those:** The first adds unnecessary weight, and the second would weaken the page compared with the reference.

### 5. Make state handling part of the design
Loading, empty, and error states should be visible and intentional, not incidental.

**Why:** The overview is the page operators will trust first, so it should explain itself when data is missing or slow.

**Alternatives considered:**
- Keeping the current generic inline message approach.
- Showing only the happy path.

**Why not those:** They make the page feel fragile in real use.

## Risks / Trade-offs

- [Data shape mismatch] The current dashboard payload may not expose a perfect fit for live activity or unit performance. → Mitigation: map the best available data first and only extend the backend if the page genuinely needs more structure.
- [Visual drift] A strong redesign could accidentally diverge from the kiosk brand family. → Mitigation: keep the color palette, tone, and premium feel aligned with the existing hotel ecosystem.
- [Scope creep] Once the overview looks better, it may be tempting to update other pages immediately. → Mitigation: keep the change page-specific and preserve the page-by-page rollout.
- [Overdesign] The page could become visually rich but hard to scan. → Mitigation: keep the information hierarchy strict and limit decorative elements.

## Migration Plan

1. Reshape the overview data rendering so all visible sections use structured values rather than raw JSON.
2. Rebuild the overview layout to match the reference: KPI row, primary trend card, activity panel, and performance cards.
3. Add explicit loading, empty, and error states for the overview.
4. Refine the typography, spacing, card surfaces, and accent color treatment to match the requested visual direction.
5. Verify the page with real hotel data and adjust any backend mapping needed for stable rendering.

Rollback is page-scoped: the rest of the admin portal can remain untouched if this overview redesign needs to be backed out.
