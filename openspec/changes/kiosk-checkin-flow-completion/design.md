## Context

The kiosk frontend already has a solid layered structure and the first half of the check-in journey is implemented. The remaining screens and backend handoffs are still missing, which means the user can identify a reservation but cannot complete the full hotel-grade flow shown in the references.

The backend is now split into stable services. The check-in journey can therefore rely on `checkin-service` for session, guest, consent, and completion contracts, while `admin-service` can supply hotel profile and branding data. The frontend must remain portrait-first, touch-friendly, and modular so the later checkout and concierge flows can be added without rewriting the foundation.

## Goals / Non-Goals

**Goals:**
- Complete the remaining check-in journey from reservation confirmation through success.
- Persist guest-entered data through the existing backend contracts instead of keeping it only in the browser.
- Add a kiosk branding data path so hotel identity can come from the backend.
- Preserve the current feature-based clean architecture in `kiosk-web`.
- Keep the implementation safe for a kiosk display in vertical orientation.

**Non-Goals:**
- Building the checkout flow in this change.
- Building the main services/concierge flow in this change.
- Replacing the existing backend contracts.
- Introducing a global state library or a large client-state framework.

## Decisions

### 1. Keep the remaining check-in journey route-driven
The flow will continue to use route-level screens for each major step instead of one large page.

**Why:** The current app already models the first part of the journey as routes. Extending that pattern keeps back navigation, recovery, and visual structure predictable on a kiosk.

**Alternatives considered:**
- One long wizard screen with internal step state.
- A global state machine controlling every screen.

**Why not those:** They would make the recovery screens and the success state harder to isolate, and the current route-based design already fits the app.

### 2. Keep flow state local to the check-in feature
The completion screens will reuse the existing feature-scoped context/repository approach instead of promoting the journey into application-wide state.

**Why:** The journey is bounded, temporary, and only needs to survive long enough to complete the check-in interaction.

**Alternatives considered:**
- Redux/Zustand or another global state tool.
- Browser storage as the primary source of truth.

**Why not those:** They would add more moving parts than this flow needs, and the backend is already the durable source of truth for the completed transaction.

### 3. Split backend access by responsibility
The frontend will keep the existing repository pattern and add focused adapters where needed:
- `checkin-service` for session, guest, consent, and completion calls
- `admin-service` for hotel profile and branding

**Why:** This keeps data mapping out of React components and avoids hard-coding HTTP details in the UI layer.

**Alternatives considered:**
- Direct `fetch` calls inside pages.
- A generic service layer with all API calls mixed together.

**Why not those:** They reduce clarity and make the app harder to test and extend.

### 4. Treat backend persistence as authoritative, frontend state as transient
The kiosk will store the active flow state only long enough to move between screens. The backend will persist the actual guest, consent, and check-in data.

**Why:** The kiosk should not pretend to be the system of record. The backend already owns the hotel data model.

**Alternatives considered:**
- Persisting the whole journey in localStorage.
- Rebuilding the flow from browser memory after reload.

**Why not those:** They would make the kiosk fragile, especially across reloads or crashes.

### 5. Load branding from the backend with safe defaults
The kiosk shell will request the active hotel profile from the admin backend and apply it if available, while keeping local defaults when the request fails or data is incomplete.

**Why:** The product is meant to be white-label friendly, but the kiosk still needs to render if the admin backend is slow or unavailable.

**Alternatives considered:**
- Hard-code branding into the frontend.
- Block the whole kiosk until branding loads.

**Why not those:** Hard-coding breaks white-label use cases, and blocking the UI would make the kiosk feel unreliable.

### 6. Keep check-in completion separate from checkout and concierge
The completion work will stop at the post-check-in success state and will not try to build checkout or the service menu in the same change.

**Why:** The remaining screens are already a meaningful slice of work, and combining them with later flows would make the change harder to review and test.

**Alternatives considered:**
- Completing checkout and concierge in the same pass.

**Why not that:** It would stretch the scope too far and blur the boundary that the current backlog already established.

## Risks / Trade-offs

- [Reservation/session drift] If the frontend advances screens without checking responses carefully, the UI can drift from backend state. → Mitigation: keep every transition tied to a successful repository call and preserve error screens for recovery.
- [Partial hotel profile data] The branding endpoint may return only some values. → Mitigation: layer backend values over safe defaults instead of replacing the whole theme.
- [Kiosk reload mid-flow] A browser refresh can clear transient UI state. → Mitigation: keep the authoritative data in backend contracts and rebuild the flow from the identification step if needed.
- [Extra API round-trips] The flow adds more backend calls than the current prototype. → Mitigation: keep the repositories thin, avoid duplicate requests, and only fetch what the current step needs.
- [Visual fidelity vs. scope] Matching every image perfectly can delay the flow completion. → Mitigation: preserve the shell, spacing, and typography first, then refine individual screens within the same design system.

## Migration Plan

1. Add the backend-driven branding adapter and render the kiosk shell from the hotel profile when available.
2. Extend the check-in feature state machine with the remaining steps after reservation confirmation.
3. Wire each step to the existing backend contracts in sequence:
   - guest confirmation
   - consents
   - payment and check-in completion
4. Add the success screen and the recovery states for rejection and payment failures.
5. Validate the portrait layout and the gateway-backed flow in the running app.
6. Leave checkout and concierge placeholders intact for the next change.

Rollback is frontend-only: disable the new routes and revert to the last stable check-in step if the flow needs to be backed out.

## Open Questions

- Should the kiosk resolve the active hotel profile from a configured hotel ID, or should it derive the profile from the backend list response?
- Should the post-check-in success screen auto-return to the home screen after a timeout, or wait for the guest to tap the primary action?
- Should the contact review screen prefill fields only from reservation data, or also remember the last valid kiosk input across retries?
