## Context

The platform is already delivering the main kiosk, checkout, admin, and Oracle-backed reservation flows. The remaining problem is structural: several modules still carry legacy mock paths, thin wrapper layers, and in-memory repositories that obscure the canonical runtime path. This makes the system harder to reason about and increases the chance of accidental regression when future changes are made.

The cleanup must span multiple modules and languages:
- backend microservices in Java
- kiosk and admin frontends in TypeScript/React
- shared Docker templates and OpenSpec/docs that still describe older fallback behavior

The main constraint is stability. The project already has a working Oracle-backed path, so this change should reduce noise without changing validated behavior.

## Goals / Non-Goals

**Goals:**
- Remove redundant code paths that do not add runtime value.
- Standardize names, imports, and module boundaries where the current structure is misleading.
- Improve error messages so users and developers see clear, actionable failures instead of raw or confusing output.
- Rename shared Docker template files to clearer conventional names and update the references that point to them.
- Keep the canonical Oracle-backed runtime intact for kiosk, checkout, admin, and reservation flows.
- Make the codebase easier to extend by reducing historical clutter.

**Non-Goals:**
- Re-architect the whole solution again.
- Replace the remaining runtime adapters that are still needed for live functionality.
- Change product behavior, data model semantics, or public API contracts unless a cleanup is required to preserve clarity.
- Delete mock/fallback infrastructure that is still actively used as a compatibility layer without first proving it is safe to remove.

## Decisions

### 1. Prefer surgical cleanup over large refactors
We will remove only clearly redundant code and rename only the parts that create confusion or conflict. This reduces the risk of reintroducing the regressions that happened when broader behavior changes were mixed with cleanup.

Alternatives considered:
- **Big-bang refactor**: faster to simplify on paper, but much more likely to break stable checkout/check-in/admin flows.
- **Do nothing**: preserves stability but leaves the codebase increasingly fragile and harder to maintain.

### 2. Preserve the canonical runtime path and document the legacy paths
Some in-memory repositories and mock fallbacks still act as live adapters. They should remain until the codebase can prove an Oracle-backed or real-service replacement is fully covering them. The cleanup should explicitly label them as compatibility layers, not as the main architecture.

Alternatives considered:
- **Remove all legacy layers now**: cleaner, but too risky because some services still depend on them for runtime behavior.
- **Keep them undocumented**: safe short term, but confusing and misleading for future work.

### 3. Standardize error handling around clear domain messages
User-facing errors should be translated into predictable, human-readable messages with stable codes where possible. Unexpected exceptions should remain generic enough for safety, but still carry enough context for debugging.

Alternatives considered:
- **Expose raw exceptions**: easier to debug in the moment, but poor UX and inconsistent across services.
- **Hide all details**: safer for users, but difficult to diagnose when a cleanup exposes an actual bug.

### 4. Treat naming cleanup as a consistency pass, not a product change
Names that communicate the wrong thing, duplicate the same concept, or preserve a now-dead path should be updated. The cleanup should stop short of renaming stable concepts that are already widely used unless the rename clearly improves clarity and does not ripple through unrelated behavior.

Alternatives considered:
- **Rename everything for consistency**: too risky and likely to create unnecessary churn.
- **Rename nothing**: keeps old confusion in place.

### 5. Shared Docker templates should use conventional, descriptive names
The shared Docker template files in `infra/docker/templates` should be renamed to names that are easier to recognize and reference in documentation. The docs should point to the new filenames immediately so there is no split-brain between the repository and the instructions.

Alternatives considered:
- **Leave the template names as-is**: no behavioral risk, but the current names are awkward and stand out from the rest of the project.
- **Rename service-level Dockerfiles too**: unnecessary, because those already follow the common convention used in the services themselves.

## Risks / Trade-offs

- [Risk] Removing a wrapper that still hides a live compatibility path could break an active flow. → Mitigation: verify usage and runtime behavior before removing anything.
- [Risk] Renaming types or files may create import churn and accidental build failures. → Mitigation: keep renames narrow and update references in the same change set.
- [Risk] Improving error messages can expose behavior that was previously masked by generic failures. → Mitigation: preserve stable error codes and test the user-facing responses.
- [Risk] The project still contains legacy runtime adapters by design. → Mitigation: label them clearly and leave them in place until a dedicated migration change is approved.
- [Risk] Cleanup work can drift into architecture work. → Mitigation: keep this change focused on hygiene, clarity, and safe redundancy removal only.

## Migration Plan

1. Inventory redundant wrappers, aliases, stale docs, and misleading names.
2. Classify each item as:
   - safe to remove now,
   - safe to rename now,
   - must remain as an active compatibility layer.
3. Apply cleanup only to the safe subset first.
4. Rebuild and retest the critical kiosk, checkout, admin, and reservation flows.
5. Review error messages and replace any remaining raw or confusing responses with consistent domain messages.
6. Update OpenSpec handoff notes so future work starts from the cleaned baseline.

Rollback strategy:
- Prefer small, isolated cleanup commits or task slices.
- If a rename or removal breaks a runtime path, restore the previous name/path and keep the compatibility layer until a dedicated migration is planned.

## Open Questions

- Which legacy mock or in-memory paths are still intentionally part of runtime compatibility versus leftover clutter?
- Should the cleanup keep all existing fallback toggles in the kiosk, or remove only the ones that are no longer used in normal operation?
- Which rename candidates are high value enough to justify the import churn they will create?
