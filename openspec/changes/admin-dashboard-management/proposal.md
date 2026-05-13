## Why

The kiosk experience is now separated and complete, so the backend and operator tools need a dedicated administrative surface that is not exposed on the totem. We need a secure admin login and a hotel-aware dashboard where operators can manage the properties, review metrics, and run persistent test operations without affecting the guest kiosk flow.

## What Changes

- Add a standalone administrator portal with its own login flow, separated from the kiosk UI.
- Create a hotel-aware dashboard shell with left navigation, top-level views, and a consistent luxury theme aligned with the kiosk branding.
- Expose operational views for dashboards, devices, audit, identity, and branding when the underlying backend data already exists.
- Add a persistent test area where admins can create and delete reservations for different hotels to validate kiosk flows.
- Keep hotel selection explicit so metrics, reservations, and test data are scoped to the chosen hotel.
- Reuse existing backend capabilities where available instead of duplicating data models or business rules.

## Capabilities

### New Capabilities
- `admin-authentication`: administrator login and session entrypoint for the portal.
- `admin-portal`: hotel-aware dashboard, navigation, metrics, devices, audit, branding, and reservation test tooling.

### Modified Capabilities
- None.

## Impact

- New frontend application surface for administrators, separate from `kiosk-web`.
- Admin backend endpoints may need small additions for hotel-scoped reservations and persistent test CRUD if current contracts are not sufficient.
- Existing admin-service, reservation-service, device-service, audit data, and hotel branding data will be reused where available.
- Future backend and database work may be needed if any dashboard or test view requires data that does not yet exist in the physical Oracle environment.
