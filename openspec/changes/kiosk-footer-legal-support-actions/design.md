# Design

## Goals

- Keep footer actions available from every kiosk screen.
- Preserve the user's current screen and in-memory progress when viewing legal content.
- Use existing admin telemetry so the dashboard can surface kiosk support requests.
- Keep legal and support UI stable across English, Portuguese, and Spanish.

## Decisions

- The policy page is a standalone kiosk route rendered inside the same provider tree. The footer passes the current path as return state, and the policy page navigates back to that path.
- The concierge action sends an audit event with `CONCIERGE_HELP_REQUESTED`, `KIOSK`, and the active hotel id. This makes the event persist in Oracle through the existing admin service.
- The footer uses a compact toast-style panel instead of navigating away for concierge help, avoiding interruption to the guest flow.
- The legal copy is generic and suitable for hotel stay rules, document verification, facial biometric validation, data handling, and support fallback.

## Risks

- If the admin service is offline, the kiosk can only show a fallback error message. The guest remains on the current screen.
- The policy page preserves in-memory progress while the app session remains loaded. A full browser refresh will still reset client-only state.
