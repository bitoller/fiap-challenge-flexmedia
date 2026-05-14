## 1. Build and Dependency Structure

- [ ] 1.1 Create a root Maven aggregator with shared dependency and plugin management.
- [ ] 1.2 Remove duplicated Oracle JDBC version declarations from service POMs and align shared build metadata.
- [ ] 1.3 Verify each backend service still builds independently after the root aggregator is introduced.

## 2. Cleanup and Consistency

- [ ] 2.1 Remove redundant runtime fallback paths that no longer match the active Oracle-backed contracts.
- [ ] 2.2 Keep kiosk and admin data loading on the current persistent contract and avoid reintroducing memory-only shortcuts.
- [ ] 2.3 Align any remaining error handling or responses that still surface raw or confusing output to users.

## 3. Validation and Documentation

- [ ] 3.1 Run the backend and frontend builds and the focused tests for the critical flows.
- [ ] 3.2 Verify the kiosk, checkout, admin login, dashboard, and reservation management still persist to Oracle.
- [ ] 3.3 Update OpenSpec handoff with the stabilized project baseline and any remaining follow-up items.
