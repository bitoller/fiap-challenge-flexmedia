# Design

## Flow
The add-ons page continues to persist selected services and update the reservation total. The payment page becomes the final financial confirmation before the existing `complete-checkin` endpoint runs.

```text
Add-ons
  -> Payment summary and method
  -> Processing state
  -> Room access completion
```

## Payment Screen
The screen presents a compact folio:
- reservation base amount;
- selected services amount;
- final amount to authorize.

Payment methods remain card and Pix, with card selected by default. Confirming payment calls the existing complete check-in use case. While the request is pending, the UI shows a subtle processing panel so the guest understands that payment and room activation are happening.

## Completion Screen
The completion screen replaces the previous generic success grid. It explains:
- the assigned room;
- facial access is ready for door entry;
- a physical card is available as fallback;
- the total authorized.

The screen keeps one final action to end the kiosk session and return home.

## Backend
No new backend persistence is required. The current complete check-in use case already records payment, creates the stay, issues a key, marks the room occupied, syncs PMS, and sends a receipt.
