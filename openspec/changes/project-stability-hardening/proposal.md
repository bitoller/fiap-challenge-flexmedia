## Why

The project has reached a point where the biggest risk is not missing features, but inconsistency: duplicated dependency declarations, fragmented build setup, and mixed persistence paths can make stable flows look broken again. This change focuses on tightening the repository structure and validation path so the current backend and frontend behavior stays reliable while the codebase is cleaned up.

## What Changes

- Add a root Maven aggregator so shared build metadata can live in one place without removing the service-level `pom.xml` files.
- Normalize duplicated dependency declarations across backend services so the Oracle driver and test dependencies are managed consistently.
- Remove redundant implementation paths where they no longer add value, while preserving the existing microservice boundaries.
- Keep Oracle-backed persistence as the source of truth for admin, check-in, checkout, and reservations.
- Improve test coverage for the critical flows so regressions are caught earlier.
- Document the stabilized project layout in OpenSpec so future work resumes from a clean baseline.

## Capabilities

### New Capabilities
- `project-stability`: repository-level build aggregation, dependency normalization, cleanup, and regression protection without changing user-facing product behavior.

### Modified Capabilities
- None

## Impact

- Backend Maven structure across all services.
- Shared dependency management for Oracle JDBC and test libraries.
- Existing admin, kiosk, checkout, and reservation flows, which must remain behaviorally unchanged.
- OpenSpec history and future implementation handoff.
