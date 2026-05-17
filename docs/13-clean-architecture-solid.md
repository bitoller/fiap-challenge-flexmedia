# Clean Architecture And SOLID

## 1. Decision

`checkin-service` was organized around Clean Architecture.

The adopted rule is:

```text
Controller -> Service -> Domain
Infrastructure/Repository -> Repository interfaces
```

The domain does not depend on Spring, JDBC, Oracle, HTTP DTOs, or React.

## 2. Current Structure

```text
br.com.fiap.flexcheck.checkin
├── controller
│   ├── KioskController
│   └── ApiExceptionHandler
├── dto
│   └── Dtos
├── mapper
│   ├── ApiMapper
│   └── ResultMapper
├── service
│   ├── command
│   ├── result
│   └── *UseCase
├── repository
│   └── interfaces
├── domain
│   ├── entity
│   ├── exception
│   └── service
├── infrastructure
│   ├── persistence
│   │   └── entity
│   └── repository
└── config
```

## 3. Layer Responsibilities

### controller

HTTP entry layer.

Responsibilities:

- Receive REST requests.
- Validate DTOs with Bean Validation.
- Handle errors.

It must not contain business rules.

### dto

API input and output contracts.

Responsibilities:

- Represent HTTP requests and responses.
- Declare simple format and required-field validations.
- Avoid exposing domain entities directly.

### mapper

Conversion layer.

Responsibilities:

- Convert DTOs into service commands.
- Convert service results into response DTOs.
- Isolate HTTP contract changes from business rules.

### service

Use-case layer.

Responsibilities:

- Orchestrate business flows.
- Use repository interfaces.
- Control transactions.
- Decide use-case error messages.

Current use cases:

- `CreateSessionUseCase`
- `AttachReservationUseCase`
- `ConfirmGuestUseCase`
- `RegisterConsentsUseCase`
- `CompleteCheckinUseCase`
- `CheckoutUseCase`
- `CheckoutLookupUseCase`

### domain

Center of business rules.

Responsibilities:

- Business models.
- Domain policies.
- Business exceptions without framework dependencies.

Examples:

- `Reservation`
- `Guest`
- `Room`
- `Stay`
- `ReservationEligibilityPolicy`

### infrastructure

Technical detail layer.

Responsibilities:

- JPA entities for Hibernate table creation.
- JDBC.
- Oracle/H2.
- SQL queries.
- Concrete repository interface implementations.

Current implementation:

- JDBC repositories under `infrastructure/repository`.
- `*JpaEntity` classes under `infrastructure/persistence/entity`.

JPA entities remain in infrastructure to preserve a clean domain. This allows the database model to be generated without coupling business rules to Hibernate.

## 4. Repository Interfaces

Services depend on interfaces, not directly on the database:

- `SessionRepository`
- `ConsentRepository`
- `VerificationRepository`
- `StayRepository`
- service-specific HTTP clients for external service boundaries

This allows Oracle to be replaced by a mock, another database, or an external API without changing the use cases.

## 5. SOLID Principles

### S - Single Responsibility

Each use case has one clear responsibility. Example: `CheckoutUseCase` only handles stay checkout.

### O - Open/Closed

New integrations can be added through new interface implementations without changing use cases.

### L - Liskov Substitution

Any repository implementation can replace another as long as it respects the contract.

### I - Interface Segregation

Interfaces are separated by capability, avoiding one oversized system interface.

### D - Dependency Inversion

Use cases depend on abstractions. JDBC implements repositories, but the domain does not know JDBC.

## 6. Created Test

The project includes a flow test directly against use cases:

```text
CheckinFlowUseCaseTest
```

It validates:

1. Session creation.
2. Reservation search and attachment.
3. Guest data confirmation.
4. Consent registration.
5. Check-in.
6. Key issuance.
7. Checkout.

This test runs without a web server, using in-memory H2.
In the test profile, H2 also creates tables from JPA entities and uses `data.sql` only to load data.

## 7. Evolution

Next steps while preserving the architecture:

- Expand `reservation-service` coverage while keeping the same concepts.
- Keep `payment-service` and `key-service` behind service clients.
- Add unit tests for reservation eligibility.
- Add tests for error cases such as declined payment and rejected document.
