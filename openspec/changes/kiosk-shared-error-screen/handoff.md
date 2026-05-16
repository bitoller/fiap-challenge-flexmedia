# Handoff

The kiosk recovery experience now uses a shared screen for both check-in and check-out.

## Delivered

- Added a reusable `RecoveryScreen` component for the premium kiosk error layout.
- Replaced guest-facing recovery pages with the shared component.
- Removed raw backend message rendering from the visible recovery body.
- Added localized generic recovery copy in EN, PT-BR, and ES.
- Preserved the existing retry destinations for each flow.
- Stabilized the recovery layout so button sizing stays consistent across languages.
- Centered the checkout recovery state within the available kiosk viewport.
- Refined the visual treatment to stay aligned with the existing luxury palette instead of the earlier brown/mustard emphasis.
- Narrowed the check-in recovery width so it now follows the same tighter card proportion as checkout.

## Validation

- `npm run build` passed for `frontend/kiosk-web`.

## Notes

- The shared screen is now the single guest-facing recovery pattern for check-in and check-out.
- Flow-specific code remains available in state for routing decisions, but the UI now uses localized generic copy only.
