# Handoff Notes

**Change:** `split-backend-services`
**Date:** 2026-05-13
**Status:** completed and validated

## What Was Delivered

- `checkin-service` remains the orchestration boundary for the kiosk journey.
- `reservation-service`, `payment-service`, `key-service`, `admin-service`, and `device-service` are separated as their own backend services.
- `identity-service` was added for authentication, user listing, and kiosk credentials.
- `notification-service` was added for receipts and operational alerts.
- `biometry-service` and `pms-adapter-service` were kept as future integration contracts.
- Oracle configuration and bootstrap scripts were aligned to `rm553134` and password `060892`.
- Gateway routing was updated to cover the new public service boundaries.
- Docker Compose now boots the full backend stack successfully.

## Validation Already Completed

- `mvn test` passed for:
  - `checkin-service`
  - `reservation-service`
  - `payment-service`
  - `key-service`
  - `admin-service`
  - `api-gateway`
  - `identity-service`
  - `notification-service`
- `docker compose up -d --build` completed successfully with the full stack.
- The main check-in journey completed end to end through the gateway.

## Important Implementation Notes

- `identity-service` and `notification-service` currently use in-memory storage for the MVP.
- PMS and biometrics were intentionally preserved as service contracts so they can become real integrations later without changing the split.
- The `admin-service` owns hotel branding and content management for the hotel owner use case.
- `admin-service`, `device-service`, and `reservation-service` now accept `hotelId`-scoped queries so the future dashboard can switch hotels without mixing metrics or reservations.
- The Oracle database did not require a new physical change after the cleanup and documentation pass.

## Where To Resume Next Time

If work continues from this point, the next natural area is the frontend, using the backend contracts already stabilized here.

If backend work resumes instead, start by checking:

1. `openspec/changes/split-backend-services/tasks.md`
2. `README.md`
3. `backend/services/README.md`
4. the service READMEs for `identity-service` and `notification-service`

## Notes For Future Maintenance

- Keep public API paths stable through the gateway.
- Keep `checkin-service` focused on orchestration only.
- Add future production integrations for PMS and biometry without collapsing the current service boundaries.
- Treat `identity-service` and `notification-service` as the main expansion points for security and communication features.
