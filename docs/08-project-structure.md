# Project Structure

## 1. Purpose

The structure is designed to show architectural maturity without losing delivery speed. It separates business domains, makes each microservice responsibility clear, and gives the review board a natural path from MVP to production-grade product.

## 2. Overall Layout

```text
backend/
  services/
    api-gateway/
    identity-service/
    reservation-service/
    checkin-service/
    key-service/
    payment-service/
    biometry-service/
    notification-service/
    device-service/
    PMS-adapter-service/
frontend/
  kiosk-web/
  admin-web/
database/
  oracle/
docs/
  diagrams/
infra/
  docker/
docker-compose.yml
.env.example
```

## 3. Recommended Implementation Order

### Step 1 - Navigable MVP

Build the `kiosk-web` with navigable screens and compatibility fixtures. This helps during mentoring and demo sessions while the canonical runtime is still being completed.

### Step 2 - Oracle Database

Run Oracle through Docker Compose or use the faculty Oracle instance. The backend creates the tables through the schema scripts; then run `seed.sql` to load reservation, guests, rooms, and kiosk data.

### Step 3 - Core Services

Implement:

- `reservation-service`
- `checkin-service`
- `payment-service` compatibility adapter
- `key-service` compatibility adapter

### Step 4 - Integration

Connect `kiosk-web` to the backend through the `api-gateway` or directly to the services during development.

### Step 5 - Admin and Differentiators

Implement `admin-web`, `device-service`, auditing, dashboard, and exception flows.

## 4. MVP Service Scope

| Service | MVP | Evolution |
| --- | --- | --- |
| api-gateway | Routing and CORS | JWT, rate limiting, and aggregation |
| identity-service | Simple or mock admin login | Full RBAC and technical tokens |
| reservation-service | reservation CRUD and search | Real PMS synchronization |
| checkin-service | check-in/check-out orchestration | Robust saga and contingency handling |
| key-service | Simulated digital key | RFID, real QR, and mobile key |
| payment-service | Simulated payment | Real acquirer and reconciliation |
| biometry-service | Simulated result | Facial provider with liveness checks |
| notification-service | Delivery logging | Email, SMS, and WhatsApp |
| device-service | Kiosk status | Hardware monitoring |
| PMS-adapter-service | PMS compatibility adapter | Provider-specific connectors |

## 5. Internal Microservice Pattern

Each Java service follows a simple split:

```text
src/main/java/br/com/fiap/flexcheck/<service>/
  controller/       REST controllers and error handling
  dto/              Request and response models
  mapper/           Conversions between API, service, and domain
  service/          Use cases, commands, and results
  repository/       Contracts used by the service layer
  domain/           Entities, rules, and business exceptions
  infrastructure/
    persistence/
      entity/       JPA entities that create the tables
    repository/     JDBC/JPA implementations of the contracts
  config/           Spring configuration
src/test/java/
```

## 6. Naming Conventions

- Use case classes: `CreateCheckinSessionUseCase`
- Controllers: `CheckinSessionController`
- Input DTOs: `CreateSessionRequest`
- Output DTOs: `SessionResponse`
- Repositories: `CheckinSessionRepository`
- JPA entities: names close to the tables, such as `CheckinSession`

## 7. Demo Strategy

For the final delivery, the demo should stay predictable:

- Use fixed data from `seed.sql`.
- Use approved and declined test cards.
- Use one approved reservation and one exception case.
- Show logs or dashboards only when they add value.
- Avoid depending on external real-world integrations.

## 8. Next Code Files

When implementation starts, the first recommended technical base is:

- `backend/pom.xml` as the Maven parent project.
