# Handoff

## Completed Scope

- Admin dashboard now reads Oracle-backed data without crashing on null audit fields.
- Admin login returns Oracle-backed hotel listings instead of relying on the old in-memory hotel source.
- Kiosk branding now uses a public hotel profile endpoint so the hotel name and hero copy can load without admin auth.
- Home screen hero copy now follows the active kiosk language instead of staying fixed to branding text.
- Admin portal error handling now shows readable messages instead of raw JSON blobs.
- Admin service now has test coverage for dashboard audit mapping and hotel fallback persistence.

## Validation

- `mvn test` passed for `backend/services/admin-service`
- `mvn test` passed for `backend/services/checkin-service`
- `npm run build` passed for `frontend/kiosk-web`
- `npm run build` passed for `frontend/admin-web`

## Resume Here Next

- Expand admin tests if more persistence edge cases are added.
- Tighten kiosk language coverage for any remaining static labels that should be localized.
- Archive this change once the current fix set is accepted.
