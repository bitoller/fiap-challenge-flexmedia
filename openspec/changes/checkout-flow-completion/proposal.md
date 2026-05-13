## Why

The kiosk still stops at a checkout placeholder, but the backend already has the core settlement endpoint for ending a stay. We need to finish the guest checkout journey now so the kiosk can identify the stay, show the bill, settle charges, issue the receipt, and end the session with the same architectural discipline already used in check-in.

## What Changes

- Add a dedicated checkout flow in `kiosk-web` with portrait-first screens for identification, bill review, reconciliation, payment, receipt, and final thank-you.
- Add a backend lookup contract that can find an active stay using hotel, room number, and guest document data so the kiosk can start checkout without a raw `stayId`.
- Reuse the existing checkout settlement endpoint to finalize the stay and trigger payment, key revocation, PMS sync, notification, and audit side effects.
- Keep checkout isolated from check-in and concierge/service flows while still reusing the shared kiosk shell, branding, and localization infrastructure.
- Keep the visual language aligned with the checkout Figma references and the feature-based clean architecture already established in the frontend.

## Capabilities

### New Capabilities
- `kiosk-checkout-flow`: Complete the guest checkout journey from stay identification through settlement, receipt, and session closeout inside the kiosk.
- `checkout-active-stay-lookup`: Find and preview an active stay for checkout using hotel, room, and guest document data, and return the data needed by the kiosk checkout flow.

### Modified Capabilities
- None

## Impact

- Frontend code under `frontend/kiosk-web/src/`
- Backend checkout lookup and checkout orchestration in `backend/services/checkin-service`
- API gateway routing for the new checkout lookup contract
- Frontend translations, styling, and kiosk layout behavior
- OpenSpec history for the kiosk checkout work
