## 1. Inventory and classification

- [x] 1.1 Inventory redundant wrappers, aliases, fallback paths, and duplicate entrypoints across backend and frontend modules.
- [x] 1.2 Classify each item as safe to remove now, safe to rename now, or keep as an explicit compatibility layer.
- [x] 1.3 Identify user-facing error messages that are raw, inconsistent, or too generic for normal troubleshooting.

## 2. Safe structural cleanup

- [x] 2.1 Remove redundant frontend aliases and thin pass-through wrappers that do not add behavior.
- [x] 2.2 Remove stale imports, unused variables, and dead references left behind by earlier refactors.
- [ ] 2.3 Standardize names for clearly misleading files, classes, methods, or variables without changing behavior.
- [x] 2.4 Rename the shared Docker template files to clearer conventional names and update all references.
- [x] 2.5 Update documentation references so legacy fallback behavior is described as compatibility-only.

## 3. Error clarity and consistency

- [x] 3.1 Normalize backend validation and business error responses so they return clear, stable messages and codes.
- [x] 3.2 Align frontend recovery and error copy so user-facing failures remain concise and actionable.
- [x] 3.3 Ensure unexpected failures do not expose stack traces or confusing low-level details to users.

## 4. Verification and handoff

- [x] 4.1 Run backend and frontend builds after the cleanup to verify no import or naming conflicts were introduced.
- [ ] 4.2 Re-run the critical kiosk, checkout, admin, and reservation smoke tests against the Oracle-backed runtime.
- [x] 4.3 Update the OpenSpec handoff with the cleaned baseline and any remaining compatibility paths that were intentionally preserved.
