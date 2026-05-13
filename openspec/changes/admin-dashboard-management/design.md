## Context

The kiosk experience now runs as a separate portrait-first product. The administrator workflow should be a distinct web app, not another kiosk route, because it needs authentication, richer navigation, hotel-level filtering, and operational actions that must never be exposed on the guest-facing totem.

The backend already has reusable data and services for hotels, reservations, devices, audit, and branding. However, the current admin tooling is not organized as a secure operator portal, and the project still lacks a persistent reservation test surface that lets admins create and delete reservations per hotel for validation purposes.

The goal is to build a separate admin portal with the same luxury visual language as the kiosk, while keeping its data access and security posture appropriate for staff-only usage.

## Goals / Non-Goals

**Goals:**
- Create a dedicated admin portal with its own login flow and session boundary.
- Keep the admin portal separate from the kiosk application and from the totem routes.
- Provide hotel-scoped dashboard, device, audit, branding, identity, and reservation-management views where backend data already exists.
- Add a persistent reservation test area that can create and delete reservations for different hotels.
- Preserve clean architecture, isolated feature modules, and hotel-scoped data access.
- Reuse existing backend services and Oracle persistence whenever possible.

**Non-Goals:**
- Adding admin capabilities to the kiosk application.
- Building a full identity provider or enterprise SSO integration.
- Reworking PMS or biometrics in this change.
- Designing a full-blown CRM or revenue-management module.
- Replacing the existing backend services with a monolith.

## Decisions

### 1. Build the admin experience as a separate frontend application
The admin portal should live outside `kiosk-web` so the guest kiosk and the operator console remain physically and logically separated.

**Why:** The admin portal has different navigation, security, and information density requirements. Separating the apps also prevents accidental exposure of operator tools on the totem.

**Alternatives considered:**
- Adding admin routes inside `kiosk-web`.
- Building the admin UI as modal screens in the kiosk app.

**Why not those:** They blur the guest/operator boundary and make it easier to ship the wrong surface to the kiosk.

### 2. Require administrator authentication before any dashboard access
The first screen in the admin portal must be a login flow. The portal should not show metrics or management actions before the user is authenticated.

**Why:** The dashboard includes sensitive operational data and write actions, especially reservation creation and deletion.

**Alternatives considered:**
- Relying only on network access or obscurity.
- Shipping the portal with a default session.

**Why not those:** They are not safe enough for staff-only tools.

### 3. Make hotel selection a first-class filter for the whole portal
The dashboard should explicitly choose the hotel context before showing metrics, reservations, devices, and test data.

**Why:** The operator needs to manage multiple properties without mixing data from different hotels.

**Alternatives considered:**
- Showing global data by default.
- Hiding hotel filtering inside each page.

**Why not those:** That makes the portal harder to reason about and increases the risk of acting on the wrong property.

### 4. Keep reservation test tools persistent and backend-backed
The reservation test area should create and delete reservations through backend APIs and Oracle persistence, not local in-memory state.

**Why:** The user explicitly needs test reservations that survive reloads and can be used to validate kiosk flows end-to-end.

**Alternatives considered:**
- Local-only mock state.
- Browser storage seeded data.

**Why not those:** They do not validate the real system and would not help test the kiosk against true persisted data.

### 5. Reuse existing backend data where it already exists
Dashboard cards, devices, audit logs, hotel branding, and hotel lists should reuse current backend capabilities instead of inventing duplicate data models.

**Why:** The backend already owns those domains and should remain the source of truth.

**Alternatives considered:**
- Replicating data into a new admin-specific storage layer.
- Hard-coding dashboard summaries in the frontend.

**Why not those:** They duplicate logic and drift away from the real operational data.

### 6. Preserve the luxury visual language while optimizing for dense information
The admin portal should look like the same hotel ecosystem, but its layout should favor tables, cards, filters, and operational controls instead of kiosk simplicity.

**Why:** The operator needs fast scanning and bulk actions, while still seeing the same visual brand family as the kiosk.

**Alternatives considered:**
- Reusing the kiosk layout exactly.
- Using a generic enterprise admin template.

**Why not those:** The kiosk layout is too sparse for admin operations, and a generic template would break the product identity.

## Risks / Trade-offs

- [Auth scope] A separate admin portal adds more authentication and session state to maintain. → Mitigation: keep auth isolated in a single admin context and avoid sharing guest kiosk state.
- [Hotel scoping mistakes] Reservations, metrics, and devices could be shown against the wrong hotel if filters are not enforced consistently. → Mitigation: make hotel selection mandatory and pass hotel identifiers through all admin requests.
- [Persistent test data] Admin-created reservations may interfere with kiosk smoke tests if not clearly labeled. → Mitigation: mark test reservations distinctly and keep their creation/deletion actions in a dedicated admin section.
- [Backend surface growth] Reservation CRUD and hotel-scoped queries may require extra endpoints. → Mitigation: add only the contracts needed by the portal and keep them aligned with the existing service boundaries.
- [UI complexity] Admin pages can become dense quickly. → Mitigation: use a consistent shell, tabs, and reusable cards/tables to keep the layout predictable.

## Migration Plan

1. Create the separate admin portal frontend application with its own login entrypoint.
2. Add admin authentication and a hotel-aware shell that persists the selected hotel context.
3. Expose dashboard, device, audit, branding, and identity views using existing backend data where possible.
4. Add persistent reservation test tooling with create and delete actions backed by the backend and Oracle.
5. Fill any missing backend endpoints only if the existing contracts are insufficient.
6. Smoke test the admin portal against the real backend and verify it does not appear in the kiosk routes.

Rollback is app-scoped: the admin portal can be disabled without affecting the kiosk app, and the reservation test actions can be removed independently if they require backend adjustments later.

## Open Questions

- Should the admin portal use a separate backend auth endpoint or reuse an existing identity service contract?
- Should reservation deletion be soft delete or hard delete in the operator test area?
- Which existing dashboard data should be shown as empty-state placeholders when the hotel has no records yet?
- Should the hotel selector default to the operator's last chosen hotel or force a choice on every login?
