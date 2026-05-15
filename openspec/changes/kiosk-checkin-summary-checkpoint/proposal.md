## Why

The current reservation confirmation screen is visually richer than the next step now requires. Since the flow will move into facial recognition after reservation lookup, this screen should become a fast, lightweight checkpoint that reassures the guest without adding unnecessary visual weight or room-specific media management.

## What Changes

- Reframe the reservation confirmation screen as a compact summary checkpoint before facial recognition.
- Reduce the prominence of the large room image and replace it with a reusable hotel-facing visual block that works for every reservation.
- Keep the key reservation details visible and easy to verify at a glance: guest, room, dates, nights, and total.
- Preserve the kiosk portrait orientation, header, and footer as they are.
- Keep the action path focused on a clear continue step and a secondary back step.

## Capabilities

### New Capabilities
- `kiosk-checkin-summary-checkpoint`: Present a compact reservation summary on the kiosk so the guest can quickly confirm the booking details before moving to facial recognition.

### Modified Capabilities
- None

## Impact

- Frontend kiosk check-in confirmation screen and related styling
- Frontend copy and translations for the reservation summary step
- Reuse of a single generic visual block instead of per-room imagery
- No backend contract changes are expected for this change
