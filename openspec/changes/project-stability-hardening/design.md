## Context

The backend is organized as separate Maven services and the frontend is split into kiosk and admin apps. That structure is good for isolation, but the repository now carries repeated dependency declarations, repeated runtime assumptions, and a growing amount of operational knowledge spread across code, Docker, and OpenSpec.

The current goal is to stabilize the project shape without changing product behavior. The fix must preserve the microservice boundaries, keep Oracle-backed persistence as the source of truth, and reduce the odds of regressions caused by duplicated configuration.

## Goals / Non-Goals

**Goals:**
- Introduce a root Maven aggregator for shared dependency and plugin management.
- Normalize repeated Maven dependency declarations across service modules.
- Keep backend and frontend flows working exactly as they do now.
- Keep Oracle persistence as the authoritative runtime source.
- Reduce redundant implementation and documentation drift where it does not add value.
- Add or improve tests around the existing critical flows.

**Non-Goals:**
- Do not collapse the microservices back into a monolith.
- Do not redesign kiosk or admin UX as part of this cleanup.
- Do not change business rules for check-in, checkout, dashboard, or reservation handling.
- Do not introduce new runtime stores or replace Oracle.

## Decisions

### 1. Add a root aggregator `pom.xml` instead of removing service-level POMs
The repository needs shared build metadata, but each service must still be independently buildable and containerizable.

**Decision:** create a root parent/aggregator `pom.xml` and keep the module `pom.xml` files in each service.

**Why this over deleting module POMs?**
- Each microservice already builds independently.
- Dockerfiles and local development workflows depend on module-level builds.
- A parent aggregator gives a single place for shared dependency versions and plugin settings without losing service isolation.

### 2. Centralize shared dependency versions in the parent POM
The project currently repeats the Oracle JDBC dependency and other build metadata in multiple service modules.

**Decision:** move shared dependency management to the root POM and let module POMs declare only what is specific to each service.

**Why this over leaving versions duplicated?**
- Duplicate version declarations are error-prone and create IDE warnings.
- Shared version management makes upgrades predictable.
- It keeps service POMs smaller and easier to scan.

### 3. Keep cleanup focused on redundant runtime paths, not feature behavior
The repository already has the right service boundaries, but some flows still carry old fallback paths or documentation that no longer match current behavior.

**Decision:** remove only redundant implementation paths that no longer serve the active runtime contract, and keep product behavior unchanged.

**Why this over a broader rewrite?**
- The active check-in, checkout, kiosk branding, and admin portal flows are already valuable and should not be destabilized.
- A rewrite would risk reintroducing the regressions we just fixed.

### 4. Expand validation around the current Oracle-backed flows
The project needs guardrails that prove the stable flows still work after cleanup.

**Decision:** preserve and extend tests around admin Oracle persistence, check-in stay integrity, and build-level verification.

**Why this over relying only on manual smoke tests?**
- Manual checks are useful but easy to miss during refactors.
- A small amount of automated coverage protects the critical paths from regression.

## Risks / Trade-offs

- [Risk] A new root POM can conflict with module-level configuration if shared settings are too aggressive. → Mitigation: keep the parent limited to version and plugin management, not service-specific wiring.
- [Risk] Removing redundant paths may expose hidden assumptions in kiosk or admin flows. → Mitigation: make cleanup incremental and validate each affected flow after changes.
- [Risk] More centralized dependency management may initially require multiple module updates. → Mitigation: update modules in one pass and verify with full backend builds.
- [Risk] Expanding tests may add maintenance cost. → Mitigation: keep tests focused on the highest-value persistence and flow-integrity cases.
