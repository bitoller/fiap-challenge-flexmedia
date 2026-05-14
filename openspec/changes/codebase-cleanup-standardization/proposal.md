## Why

The project is functional, but a lot of historical scaffolding still remains around it: mock fallbacks, thin repository wrappers, memory-backed services that are still part of runtime, and inconsistent naming or error messages across modules. This change focuses on tightening the codebase so the current behavior stays stable while the structure becomes easier to maintain and safer to extend.

## What Changes

- Remove redundant aliases, wrappers, and dead paths that no longer add value to the active runtime.
- Standardize names for classes, methods, folders, and variables where the current naming is misleading or inconsistent.
- Rename shared Docker template files to clearer conventional names and update the references that point to them.
- Tighten imports and package references so the code reads cleanly and avoids accidental confusion between old and new paths.
- Review and improve user-facing error messages so failures are clear, consistent, and actionable.
- Keep the existing user flows and Oracle-backed behavior unchanged while the cleanup happens.
- Preserve intentionally active runtime components that still serve as live adapters or compatibility layers until they can be migrated safely.

## Capabilities

### New Capabilities
- `codebase-cleanup-standardization`: project-wide cleanup and naming standardization that removes redundant code, aligns structure, and improves error clarity without changing validated product behavior.

### Modified Capabilities
- None

## Impact

- Backend service structure, especially repeated in-memory repositories, error handling, and naming consistency.
- Frontend repository and context layers, especially thin wrappers, mock-related legacy paths, and placeholder handling.
- Documentation and OpenSpec handoff files, so future work resumes from a cleaner and better labeled baseline.
- Build and import paths across the project, where stale references may still point to old names or unnecessary layers.
