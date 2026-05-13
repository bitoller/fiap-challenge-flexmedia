## 1. Oracle and Configuration

- [x] 1.1 Update all Oracle environment examples and defaults to use `rm553134`.
- [x] 1.2 Update the Oracle bootstrap scripts so the empty database creates `rm553134` with password `060892`.
- [x] 1.3 Update the schema and seed execution scripts to run inside the new user schema.
- [x] 1.4 Update backend and database documentation to reflect the new Oracle user and setup flow.

## 2. Service Boundaries

- [x] 2.1 Define the target service ownership map for reservation, check-in, payment, key, identity, biometry, notification, device, and PMS concerns.
- [x] 2.2 Extract reservation lookup into `reservation-service`.
- [x] 2.3 Extract payment handling into `payment-service`.
- [x] 2.4 Extract key issuance into `key-service`.
- [x] 2.5 Extract dashboard and audit-facing operations into the appropriate service boundary.

## 3. Application Layer Split

- [x] 3.1 Move shared request and response contracts into service-specific application boundaries.
- [x] 3.2 Split `checkin-service` so it only orchestrates the check-in flow and calls external service contracts.
- [x] 3.3 Replace direct cross-domain repository usage with service-to-service clients or public contracts.
- [x] 3.4 Keep each service organized with controller, application, domain, and infrastructure layers.

## 4. Gateway and Contracts

- [x] 4.1 Update the API gateway routes to the new service endpoints.
- [x] 4.2 Preserve the public API paths required by the kiosk flow.
- [x] 4.3 Add or adjust service contracts so the frontend can still complete the same business journey through the gateway.

## 5. Validation

- [x] 5.1 Add or update tests for the refactored service boundaries.
- [x] 5.2 Verify the Oracle bootstrap runs cleanly on the empty schema.
- [x] 5.3 Verify the main check-in journey still works end to end through the gateway after the split.
