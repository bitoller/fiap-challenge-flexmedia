## Context

The kiosk check-in journey now uses the reservation confirmation step as a brief checkpoint before facial recognition. The screen should reassure the guest that the reservation is correct, keep the luxury aesthetic intact, and avoid introducing room-specific image management or a dense editorial layout that slows down the kiosk flow.

## Goals / Non-Goals

**Goals:**
- Make the reservation confirmation step faster to understand on a vertical kiosk.
- Reduce visual weight while preserving the premium hotel style.
- Use a reusable visual treatment that does not depend on a unique photo for each room.
- Keep the confirmation details legible and the continuation action obvious.

**Non-Goals:**
- Do not implement facial recognition itself.
- Do not change the kiosk header or footer.
- Do not introduce backend contract changes.
- Do not add per-room media management.

## Decisions

### Decision: Treat the screen as a checkpoint, not a full details page
The current step should behave like a concise confirmation gate before biometric verification. A checkpoint model fits kiosk usage better than a full “stay details” page because it asks the guest only to verify what matters and continue.

Alternatives considered:
- Keep the existing split “details + hero image” composition: visually attractive, but too heavy for a quick kiosk checkpoint.
- Collapse to a single card with no visual accent: efficient, but less premium and less aligned with the brand language.

### Decision: Use one reusable visual block instead of per-room imagery
Per-room image management increases operational overhead and is not necessary for the confirmation step. A single reusable hotel-facing visual block keeps the layout consistent, reduces maintenance, and avoids tying the UX to room-specific assets.

Alternatives considered:
- Per-room imagery: richer, but adds content management complexity and makes the flow harder to scale.
- No image at all: simplest, but loses some brand presence and makes the card feel too plain.

### Decision: Keep the layout compact and portrait-first
The screen must stay optimized for a kiosk. The composition should preserve enough white space to feel premium, but the information and the primary action must remain close together so the guest can confirm and proceed without scanning too much of the screen.

Alternatives considered:
- Full-width wide hero composition: attractive, but wastes vertical kiosk real estate.
- Dense multi-panel summary: informative, but too busy for a quick confirmation checkpoint.

## Risks / Trade-offs

- [Reduced visual richness] -> Mitigate by keeping a reusable branded visual block and refined typography.
- [Guests miss key reservation details] -> Mitigate by keeping guest, room, dates, nights, and total clearly grouped.
- [Layout feels too compact on large displays] -> Mitigate by preserving balanced spacing and responsive scaling for kiosk sizes.
