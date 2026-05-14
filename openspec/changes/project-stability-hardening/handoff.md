# Project Stability Handoff

Status: core kiosk, checkout, admin, and reservation flows are aligned on the Oracle-backed runtime again.

## What Changed

- The Maven aggregator lives in `backend/pom.xml`, which is the correct location for the backend reactor.
- All backend service modules now inherit from the backend parent and no longer repeat shared build metadata unnecessarily.
- Docker builds use `backend/` as the build context and resolve each service through its own Dockerfile.
- The admin portal is separate from the kiosk and uses Oracle-backed persistence for dashboard, reservations, branding, and test data.
- The checkout flow was fixed to accept room-only lookup as well as room-plus-document lookup, and the runtime image was rebuilt so the live containers match the repository contract.
- The previously unused in-memory admin repository classes were removed to reduce noise and avoid the impression of a memory-backed path.

## Validation Completed

- `mvn test` from `backend/` passed for the full reactor.
- `docker compose up -d --build` rebuilt the full stack successfully.
- `docker compose build --no-cache checkin-service api-gateway` was used to force the live checkout runtime onto the current code.
- Admin login and dashboard calls returned valid Oracle-backed data.
- Reservation create/list/delete worked through the gateway and persisted changes in Oracle.
- Check-in and checkout completed end-to-end on fresh reservations, with stay creation and checkout receipt generation.
- The checkout lookup endpoint now accepts `roomNumber` alone and no longer requires `documentType`/`documentNumber` when they are not provided.

## Notes

- The remaining work is product expansion, not stabilization: more front-office screens, richer dashboard analytics, and any future PMS/biometry integrations.
- The active runtime path is now Oracle-backed for the main kiosk, checkout, admin, and reservation flows.
- If any stale checkout behavior reappears, the first thing to refresh is the `checkin-service` and `api-gateway` images, not the Oracle schema.
