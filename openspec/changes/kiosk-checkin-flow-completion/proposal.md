## Why

The kiosk frontend already has a clean architectural foundation and the first check-in screens, but the guest journey still stops before the actual operational end of check-in. We need to finish the remaining flow now so the kiosk can collect contact data, confirm terms, complete the check-in transaction, and show a real success state that persists through the backend contracts.

## What Changes

- Add the remaining check-in journey screens after reservation confirmation, including contact review, terms, payment, and post-check-in success.
- Connect the frontend flow to the existing backend contracts so session data, guest data, consent data, and check-in completion persist through the API gateway.
- Load hotel branding and kiosk content from the admin service instead of keeping the shell fully static.
- Keep the kiosk portrait-first layout, luxury styling, and feature-based architecture already established in `kiosk-web`.
- Keep checkout and services flows out of scope for this change and leave them as future follow-up work.

## Capabilities

### New Capabilities
- `kiosk-checkin-completion`: Complete the guest journey from reservation confirmation through contact review, terms acceptance, payment, and success feedback inside the kiosk.
- `kiosk-branding-sync`: Read hotel branding and content from the backend and apply it to the kiosk shell and check-in screens.

### Modified Capabilities
- None

## Impact

- Frontend code under `frontend/kiosk-web/src/`
- Frontend routes, screens, translations, and kiosk styling
- Frontend repositories that call `checkin-service` and `admin-service`
- API gateway routes already exposed by the backend
- OpenSpec history for the kiosk frontend
