## Context

The repository already contains folder placeholders for future backend services, but only `checkin-service` and `api-gateway` have Java code. `checkin-service` currently mixes check-in orchestration with reservation lookup, checkout, payment simulation, key issuance, audit logging, dashboard queries, and persistence concerns. The Oracle setup also still references the previous user in several files, while the new target schema is empty and can be rebuilt from scratch.

## Goals / Non-Goals

**Goals:**
- Split backend responsibilities into real microservices with clear service ownership.
- Keep the public API stable behind the gateway while internal ownership changes.
- Move Oracle bootstrap and runtime credentials to environment-provided configuration.
- Keep service code readable, English-only, and organized with clean MVC and clean architecture boundaries.
- Reduce unnecessary coupling between business domains and persistence adapters.

**Non-Goals:**
- Rewriting the frontend in this change.
- Introducing a full event bus or saga platform in the first pass.
- Perfect production-grade distributed transactions.
- Replacing every placeholder service with a fully mature implementation in one step.

## Decisions

### 1. Build real services in the existing service folders
The implementation SHALL place each service in its existing folder under `backend/services/*` instead of inventing a new root layout.

Rationale: the repository already communicates the intended service map, and reusing those folders minimizes churn while making the split obvious.

Alternatives considered:
- Create a single new multi-module build from scratch. Rejected because it adds unnecessary migration overhead.
- Keep everything inside `checkin-service`. Rejected because it preserves the current coupling problem.

### 2. Keep `checkin-service` as the orchestration boundary
`checkin-service` SHALL retain the session and orchestration flow, but domain-specific responsibilities such as reservation lookup, payment, key issuance, and notifications SHALL move out.

Rationale: the check-in workflow is the central user journey, so it should orchestrate cross-service behavior instead of owning all business logic itself.

Alternatives considered:
- Make `checkin-service` the owner of all data and expose thin facade services elsewhere. Rejected because it does not actually split ownership.

### 3. Use service-level MVC inside each microservice
Each service SHALL use controllers for transport, application services for use cases, and repositories/adapters for persistence and external integration.

Rationale: this keeps the code easy to navigate and supports clean architecture without overcomplicating the first delivery.

Alternatives considered:
- Pure hexagonal architecture with more abstraction layers. Rejected for now because it would add ceremony without enough benefit for the current codebase size.

### 4. Keep Oracle as a single shared platform, but isolate ownership by service
All services SHALL run against the Oracle platform configured through environment variables, while each service owns its tables, queries, and adapters.

Rationale: the repo already assumes Oracle as the shared backend platform, and the new empty schema allows a clean rebuild without old data or legacy ownership constraints.

Alternatives considered:
- Separate Oracle users per service. Rejected because the current request only changes to one new user and the repo is not yet set up for multiple Oracle accounts.

### 5. Align the Oracle bootstrap scripts with the new user
The Oracle init flow SHALL create the local application schema and execute schema/seed scripts in that schema.

Rationale: the new user is part of the migration goal, and the empty database makes it safe to regenerate the schema cleanly.

## Risks / Trade-offs

- [Cross-service duplication] Some shared models and validation rules may appear in more than one service early on. → Mitigate with small shared contracts and keep duplication only where the boundaries truly differ.
- [Gateway drift] The gateway can lag behind the new service map if routes are not updated together. → Mitigate by updating routing in the same change set and testing the public paths.
- [Oracle coupling] A single shared Oracle platform reduces infrastructure complexity but is weaker than fully isolated databases. → Mitigate by keeping persistence ownership strict and by planning a later split if needed.
- [Migration size] The split is large and can break existing flows if done all at once. → Mitigate by implementing service-by-service and validating one business path at a time.
