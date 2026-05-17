# Docker And Environments

## 1. Decision

Docker is used from the start, with a controlled scope.

For the MVP, the main purpose is to standardize the database and demo runtime. This reduces differences between team machines and makes the presentation more predictable.

## 2. Recommended Strategy

### MVP

```text
Docker:
  Remote Oracle FIAP-backed demo stack

Local:
  Java Spring Boot backend
  React frontend
```

This approach is the safest starting point because it avoids spending time packaging services before the main flow is stable.

### After The MVP

```text
Docker:
  Oracle SQL
  checkin-service
  reservation-service
  mock-integration-service
  kiosk-web
  admin-web
```

### Final Architecture

```text
Docker Compose:
  api-gateway
  identity-service
  reservation-service
  checkin-service
  payment-service
  key-service
  biometry-service
  device-service
  pms-adapter-service
  notification-service
  kiosk-web
  admin-web
  oracle-db
```

## 3. Why Not Containerize Everything Immediately

Containerizing everything before the product flow is stable adds work around ports, networks, builds, variables, CORS, and troubleshooting. For this challenge, that can drain energy from the most important goal: a functional MVP.

A stronger architecture narrative is:

- Complete structure defined.
- Docker available from the start.
- Incremental implementation.
- Stable demo.

## 4. Initial Compose

The root `docker-compose.yml` starts the complete demo stack and can optionally start local Oracle through a dedicated profile.

## 5. Variables

`.env.example` documents:

- Oracle connection.
- runtime ports.
- application user.
- JDBC URL.
- mocked modes for PMS, payment, biometrics, and key issuance.

## 6. Oracle In Docker

The optional local container uses the official Oracle Database Free image:

```text
container-registry.oracle.com/database/free:latest-lite
```

When started with an empty volume, scripts under `database/oracle/init` are mounted into `/opt/oracle/scripts/setup`, create the local user, run the schema, and load test data.

## 7. Risk And Fallback Plan

Oracle in a container can be heavy, especially on machines with limited memory. The fallback is to use the faculty Oracle instance. The backend can create tables through JPA/Hibernate and `seed.sql` can load demo data. The complete scripts remain available for controlled resets.

## 8. Presentation Talking Point

Suggested explanation:

"We use Docker to standardize the development and demo environment. The MVP uses an Oracle-backed runtime with automated schema and data setup. The architecture already includes templates for packaging Java services and React frontends, but we prioritized delivering the functional flow before containerizing every component."
