## Why

The kiosk error states in check-in and check-out currently expose backend text too directly, which can mix languages and make the recovery experience feel inconsistent. We need a single, polished error surface that is generic, fully localized, and visually aligned with the rest of the kiosk.

## What Changes

- Introduce a shared kiosk error/recovery screen for check-in and check-out flows.
- Replace raw backend-facing text in the primary UI with localized, generic copy.
- Preserve contextual routing so each flow can still send the user back to the correct retry step.
- Standardize the visual treatment of error states so they match the premium kiosk style used elsewhere in the application.
- Keep technical error codes available to the flow logic, while decoupling the user-facing message from backend wording.

## Capabilities

### New Capabilities
- `kiosk-shared-error-screen`: a reusable, localized error and recovery experience for kiosk flows, with generic user-facing copy and flow-aware retry actions.

### Modified Capabilities
- _None_

## Impact

Frontend kiosk presentation, flow recovery routing, i18n content, and the shared error/recovery UX used by check-in and check-out. No backend contract changes are required for the initial version of this change.
