## 1. Admin Oracle Persistence

- [ ] 1.1 Add Oracle-backed repositories for hotel profile, branding, content, dashboard metrics, and audit history.
- [ ] 1.2 Add Oracle schema support for admin persistence if current tables are not sufficient.
- [ ] 1.3 Replace admin in-memory repository implementations with JDBC-backed services.
- [ ] 1.4 Wire admin use cases and controllers to the Oracle-backed repositories.

## 2. Check-in Stay Integrity

- [ ] 2.1 Verify and harden the stay creation path in `checkin-service` so every successful check-in persists `fc_stay`.
- [ ] 2.2 Add a reconciliation path for already checked-in reservations that are missing a stay record.
- [ ] 2.3 Confirm checkout lookup and checkout settlement work only against persisted Oracle stays.

## 3. Validation and Safety

- [ ] 3.1 Add or update tests for Oracle persistence in admin and stay integrity in check-in.
- [ ] 3.2 Run backend verification against the local Oracle container and the physical Oracle flow assumptions.
- [ ] 3.3 Update OpenSpec handoff once the fix is verified.
