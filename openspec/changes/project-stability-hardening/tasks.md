## 1. Build and Dependency Structure

- [x] 1.1 Create a root Maven aggregator with shared dependency and plugin management.
- [x] 1.2 Remove duplicated Oracle JDBC version declarations from service POMs and align shared build metadata.
- [x] 1.3 Verify each backend service still builds independently after the root aggregator is introduced.

## 2. Cleanup and Consistency

- [ ] 2.1 Remove redundant runtime fallback paths that no longer match the active Oracle-backed contracts.
- [ ] 2.2 Keep kiosk and admin data loading on the current persistent contract and avoid reintroducing memory-only shortcuts.
- [ ] 2.3 Align any remaining error handling or responses that still surface raw or confusing output to users.

## 3. Validation and Documentation

- [x] 3.1 Run the backend and frontend builds and the focused tests for the critical flows.
- [x] 3.2 Verify the kiosk, checkout, admin login, dashboard, and reservation management still persist to Oracle.
- [x] 3.3 Update OpenSpec handoff with the stabilized project baseline and any remaining follow-up items.
