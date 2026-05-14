## 1. Admin Oracle Persistence

- [x] 1.1 Add Oracle-backed repositories for hotel profile, branding, content, dashboard metrics, and audit history.
- [x] 1.2 Add Oracle schema support for admin persistence if current tables are not sufficient.
- [x] 1.3 Replace admin in-memory repository implementations with JDBC-backed services.
- [x] 1.4 Wire admin use cases and controllers to the Oracle-backed repositories.

## 2. Check-in Stay Integrity

- [x] 2.1 Verify and harden the stay creation path in `checkin-service` so every successful check-in persists `fc_stay`.
- [x] 2.2 Add a reconciliation path for already checked-in reservations that are missing a stay record.
- [x] 2.3 Confirm checkout lookup and checkout settlement work only against persisted Oracle stays.

## 3. Validation and Safety

- [x] 3.1 Add or update tests for Oracle persistence in admin and stay integrity in check-in.
- [x] 3.2 Run backend verification against the local Oracle container and the physical Oracle flow assumptions.
- [x] 3.3 Update OpenSpec handoff once the fix is verified.
