# Handoff - kiosk-checkin-flow-completion

## Status

The kiosk frontend check-in flow is now complete for the current scope:

- hotel branding is loaded from `admin-service`
- the kiosk shell uses backend-driven hotel identity with safe defaults
- the check-in journey now continues through contact review, terms, payment, and success
- the identification path no longer duplicates reservation lookup
- recovery states are preserved for reservation, document, biometry, and payment failures
- checkout and services placeholders remain untouched for future work

## What Was Delivered

- Added the hotel branding adapter and provider in `frontend/kiosk-web`
- Wired the kiosk header, footer, home hero, and theme tokens to the active hotel profile
- Added the missing route-level screens:
  - contact review
  - terms and conditions
  - payment
  - success
  - recovery
- Connected the new screens to the existing backend contracts:
  - guest confirmation
  - consent submission
  - check-in completion
- Updated translations in English, Portuguese-BR, and Spanish
- Refined the portrait kiosk layout and touch targets
- Documented the hotel selection approach with `VITE_ACTIVE_HOTEL_ID`

## Validation

- `npm run build` passed in `frontend/kiosk-web`
- Backend smoke test passed against the running gateway:
  - reservation `RSV-2026-0002`
  - created session `7`
  - completed check-in successfully
  - persisted result:
    - `stayId: 3`
    - `roomNumber: 1501`
    - `keyValue: KEY-3-2`

## Notes

- `VITE_ACTIVE_HOTEL_ID` defaults to `1`
- The kiosk still falls back to built-in branding if the admin backend is unavailable
- The checkout and services routes were intentionally left as placeholders

## Next Recommended Work

1. Bring `checkout` to the same standard as the check-in flow
2. Build the main services/concierge flow
3. Replace the mock / in-memory behavior with real backend-driven data where needed for the next phase
