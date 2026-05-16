## Why

The admin portal already exists, but its overview screen still feels too generic for an operational hotel console. We need the first admin page to be the strongest one: clear, premium, and trustworthy, while still using the real backend data already available.

## What Changes

- Redesign the admin overview page to match the provided visual direction: light luxury palette, stronger typography hierarchy, soft cards, and a structured dashboard layout.
- Keep the page fully functional by wiring every visible section to real backend data instead of placeholder content.
- Present the most important operational signals first: hotel-scoped KPI cards, live activity, system health, and unit-level performance.
- Replace raw JSON-style activity rendering with human-readable operational summaries.
- Add a refreshable, resilient state model for loading, empty, and error conditions so the overview feels production-ready.

## Capabilities

### New Capabilities
- `admin-overview-dashboard`: hotel-scoped overview page with metrics, health, live activity, and unit performance cards.

### Modified Capabilities
- `admin-portal`: the overview page becomes the first polished page of the admin experience and sets the design direction for the rest of the portal.

## Impact

- Changes the main landing experience of `frontend/admin-web`.
- May require small backend response shaping if the current dashboard payload does not yet expose enough data for live activity and unit-level performance cards.
- Establishes the visual language that future admin pages should follow, so later screens stay consistent.
