## Context

The platform is already split into kiosk, admin, and backend microservices, but two important persistence gaps remain.

First, `admin-service` still keeps hotel profile, branding, content, dashboard aggregation, and audit history in memory. That means the admin portal can show and edit data during a session, but the source of truth is not Oracle and the state is lost on restart.

Second, the check-in flow already writes reservations, rooms, payments, keys, and audit events to Oracle, but current checked-in reservations can still lack a persisted stay record. That leaves checkout dependent on incomplete historical state and breaks the guarantee that a checked-in reservation always has a durable stay in Oracle.

This change hardens both sides so the admin portal and the kiosk flows always read and write persistent data instead of depending on memory-backed shortcuts.

## Goals / Non-Goals

**Goals:**
- Make admin hotel profile, branding, content, dashboard metrics, and audit history Oracle-backed.
- Keep admin write actions durable so changes survive restarts and can be read by other services.
- Guarantee that a successful check-in leaves behind a persisted `fc_stay` row.
- Reconcile existing checked-in reservations that are missing a stay so checkout can work against the real Oracle state.
- Preserve the current microservice boundaries and clean architecture style.

**Non-Goals:**
- Do not redesign the kiosk UX.
- Do not replace the admin login/session mechanism unless it becomes necessary for persistence.
- Do not move everything into a single shared database service.
- Do not introduce a temporary frontend-only fallback that invents state not present in Oracle.

## Decisions

### 1. Replace admin in-memory repositories with Oracle-backed repositories
The admin portal needs a real persistence layer for hotel configuration and audit history. The current in-memory repositories are fast for prototyping, but they violate the requirement that edits and logs survive restarts.

**Decision:** add JDBC-backed repositories in `admin-service` and persist to Oracle.

**Why this over keeping memory plus sync jobs?**
- Memory plus sync is fragile and can still lose data on restart or crash.
- Direct Oracle writes make the portal behave like a real operational console.
- It keeps the source of truth where the rest of the backend already lives.

### 2. Store hotel profile data in structured Oracle tables
The base hotel record already exists in `fc_hotel`, but branding and content are richer than the core operational columns. Rather than flattening everything into fragile JSON blobs, the design uses dedicated Oracle tables for branding and content so the admin portal can read and update them cleanly.

**Decision:** keep `fc_hotel` for core hotel metadata and add explicit tables for branding and content.

**Why this over one JSON column?**
- Structured columns are easier to query, validate, and evolve.
- The portal edits individual branding/content fields rather than opaque payloads.
- It is simpler to keep clean code in the repository layer when fields are typed.

### 3. Use Oracle audit logs as the dashboard history source
The existing `fc_audit_log` table already matches the operational audit need.

**Decision:** persist admin audit events directly to `fc_audit_log` and read dashboard history from that table instead of from memory.

**Why this over a separate audit store?**
- The schema already exists.
- Audit history becomes available to future reporting and troubleshooting.
- It avoids another storage technology just for the admin portal.

### 4. Keep dashboard metrics live and derived, not snapshot-based
Dashboard numbers should reflect the current operational state of the hotel, not a stale local cache.

**Decision:** compute dashboard metrics from Oracle-backed reservation and stay data, and combine them with device status returned by `device-service`.

**Why this over storing dashboard snapshots?**
- Metrics are derived data and should be recalculated from source records.
- Snapshots add another persistence problem without improving correctness.

### 5. Make check-in write the stay record as part of the Oracle transaction path
Checkout depends on a persisted stay. The application already has the repository contract for this, so the fix should strengthen the write path, not invent a read-time workaround.

**Decision:** guarantee stay creation in the check-in completion flow and keep checkout lookup focused on persisted active stays.

**Why this over creating stays on checkout lookup?**
- A read-time fallback hides corruption and makes the checkout flow responsible for repairing state it did not create.
- The write path is where the invariant belongs.

### 6. Add reconciliation for legacy checked-in reservations without a stay
There is already historical data in Oracle where reservations are checked in but no stay row exists. Those records need a one-time repair so the current checkout flow works.

**Decision:** include a data reconciliation step to backfill missing `fc_stay` rows for checked-in reservations before relying on checkout.

**Why this over manual SQL snippets or a hidden runtime patch?**
- It makes the data repair explicit, repeatable, and trackable.
- It keeps the system honest about what is being fixed and why.

## Risks / Trade-offs

- [Risk] Introducing JDBC into `admin-service` increases the service surface and requires new schema/migration work. → [Mitigation] Keep the repository API narrow and reuse the same Oracle conventions already used by reservation and check-in services.
- [Risk] Legacy checked-in reservations may still fail checkout if the reconciliation step is skipped. → [Mitigation] Make the migration part of the release checklist and verify it with a smoke test against a known checked-in reservation.
- [Risk] Dashboard metrics could become slower if every page load scans large tables. → [Mitigation] Use indexed Oracle queries and aggregate only the data needed for the selected hotel.
- [Risk] Structured branding/content tables add schema complexity. → [Mitigation] Keep the table shape small and aligned with the fields the portal actually edits.
- [Risk] A write failure in admin could partially update hotel settings. → [Mitigation] Keep each admin update transactional at the repository layer and return a clear failure to the portal.

## Migration Plan

1. Add the Oracle schema needed for admin branding/content persistence.
2. Add JDBC dependencies and Oracle datasource wiring to `admin-service`.
3. Replace in-memory admin repositories with Oracle-backed implementations.
4. Switch dashboard aggregation to live Oracle-derived metrics.
5. Backfill missing `fc_stay` rows for checked-in reservations already present in Oracle.
6. Tighten the check-in completion path so new check-ins always leave a persisted stay.
7. Verify the admin portal can edit hotel data and the kiosk can complete checkout for both new and legacy checked-in reservations.

Rollback strategy:
- Service code can roll back to the previous build if needed.
- Schema additions are backward-compatible if they only add tables/columns.
- The reconciliation backfill is one-way data repair, so it should be run only after validation on a known hotel and reservation.

## Open Questions

- Should hotel branding and content live in new dedicated tables or be folded into `fc_hotel` with additional columns?
- Should admin login/session state remain in memory for now, or should it be upgraded in the same pass?
- Should the reconciliation step be a one-time SQL migration or an application startup repair job?
