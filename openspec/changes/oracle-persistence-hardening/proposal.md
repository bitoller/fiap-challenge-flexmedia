## Why

The admin portal still keeps hotel profile and audit data in memory, so changes to branding, content, and operational history do not survive a restart or show up in Oracle. In parallel, the kiosk checkout flow depends on persisted stays, but existing checked-in reservations can still end up without a `fc_stay` row, which blocks checkout and breaks the Oracle-backed data model.

## What Changes

- Move admin hotel profile, branding, content, dashboard metrics, and audit history to Oracle-backed storage.
- Replace the remaining in-memory repositories in `admin-service` with JDBC repositories.
- Persist hotel branding/content in Oracle with a schema that can be read and updated directly by the admin portal.
- Keep dashboard numbers live by aggregating Oracle data and operational service data instead of storing a local snapshot.
- Guarantee that check-in completion creates a persisted stay row in Oracle before the flow is considered complete.
- Backfill or reconcile legacy checked-in reservations that exist without a `fc_stay` row so checkout can work on current data.
- **BREAKING**: remove the assumption that admin hotel content and audit history are volatile in-memory state.

## Capabilities

### New Capabilities
- `admin-oracle-persistence`: Admin hotel profile, branding, content, dashboard data, and audit events persist in Oracle and are reloaded from Oracle after restarts.
- `checkin-stay-integrity`: Check-in completion and checkout lookup operate on persisted stay records, with a durable reconciliation path for legacy checked-in reservations.

### Modified Capabilities
- none

## Impact

- `backend/services/admin-service` gains JDBC persistence and Oracle schema usage.
- `backend/services/checkin-service` gets a stronger stay persistence guarantee and migration/reconciliation support.
- `database/oracle/schema.sql` and Oracle bootstrap scripts need schema additions or data reconciliation steps.
- `docker-compose.yml` and service configuration may need updates for the new admin persistence dependencies.
- Admin dashboard UI behavior stays the same, but the data it edits becomes durable instead of volatile.
