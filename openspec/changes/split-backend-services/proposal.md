## Why

The backend currently concentrates reservation, check-in, checkout, payment, key issuance, dashboard, audit, and persistence concerns inside `checkin-service`, while the other service folders exist only as placeholders. This change splits those responsibilities into real services so the codebase matches the intended architecture and becomes easier to evolve, test, and maintain.

## What Changes

- Split the backend into domain-focused services instead of keeping multiple business areas inside `checkin-service`.
- Keep `checkin-service` focused on check-in orchestration and session flow.
- Move reservation search, payment, key issuance, notification, device, identity, biometry, and PMS responsibilities into their own services.
- Preserve the API gateway as the public entry point and update routing to the new services.
- Update Oracle configuration and bootstrap scripts to use the new user `rm553134`.
- Update SQL scripts so the empty Oracle schema can be created cleanly under the new user.
- Standardize backend code in English and align each service to a clean MVC structure with clear application and infrastructure boundaries.

## Capabilities

### New Capabilities
- `backend-service-splitting`: Split the backend into microservices with clear ownership, routing, and service-level boundaries.
- `oracle-user-alignment`: Bootstrap and run the Oracle database under the new user `rm553134` with matching configuration and SQL scripts.

### Modified Capabilities
- None

## Impact

- Backend Spring Boot services under `backend/services/*`
- API gateway routing and service URLs
- Oracle init scripts, schema scripts, and seed scripts
- Root and service-level environment examples
- Backend and database documentation
- Test setup and service-level contract coverage
