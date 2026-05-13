## Context

The kiosk already has a branded home screen and a backend that exposes the core reservation and check-in contracts through the API gateway. This change adds the next part of the guest journey: identification, reservation-not-found recovery, and reservation confirmation, all in a portrait kiosk layout inspired by the provided references.

The main constraint is that the backend must remain unchanged. The frontend must therefore orchestrate the flow, call the existing endpoints, and present the visual states as a cohesive kiosk journey.

## Goals / Non-Goals

**Goals:**
- Deliver a portrait-first kiosk flow that starts at home and continues into the check-in journey.
- Keep the UI modular and aligned with the current clean architecture split.
- Reuse the existing backend contracts for reservation search and session handoff.
- Match the visual language of the provided reference screens as closely as possible.
- Preserve the ability to localize the flow and support the current hotel branding.

**Non-Goals:**
- Changing backend endpoints, request shapes, or persistence behavior.
- Building the later biometric, consent, payment, or checkout steps in this change.
- Introducing a new global state library or cross-app architecture overhaul.
- Reworking the existing home-screen change beyond the navigation needed to enter this flow.

## Decisions

### 1. Use a route-driven flow with shared kiosk chrome
The journey will be modeled as route-level screens under one shared kiosk shell instead of a single long form.

**Why:** The design naturally breaks into distinct visual states, and route-level screens make recovery and back navigation simpler on a kiosk.

**Alternatives considered:**
- A single-page wizard with internal step state.
- A global store that controls all screens.

**Why not those:** A long wizard makes error recovery and bookmarking harder, while a global store adds more complexity than this bounded flow needs.

### 2. Keep the flow state local to the feature module
The feature will own its own state coordinator and keep reservation/session data inside the check-in module.

**Why:** The flow is bounded, the data is temporary, and this keeps the domain, data, and presentation layers isolated.

**Alternatives considered:**
- Promoting the flow state to app-wide context.
- Persisting the state in a shared store for the whole kiosk.

**Why not those:** The state is only needed during the check-in journey, and wider sharing would blur boundaries without a clear benefit.

### 3. Wrap backend access in a dedicated data adapter
The frontend will use a feature-specific adapter over the existing API client to call reservation search and session endpoints.

**Why:** This preserves clean architecture and keeps API mapping logic out of components.

**Alternatives considered:**
- Calling `fetch` directly from pages.
- Mixing request construction into hooks and UI components.

**Why not those:** Direct calls make the UI harder to test and make error mapping inconsistent across screens.

### 4. Map backend errors to explicit UI states
The flow will translate `RESERVATION_NOT_FOUND` and 404 responses into the dedicated not-found screen, while other recoverable errors will reuse the same visual recovery pattern.

**Why:** The kiosk needs a clear, calm recovery path instead of raw error output.

**Alternatives considered:**
- Showing a generic toast or alert on every failure.
- Displaying backend messages directly.

**Why not those:** The reference design uses a deliberate recovery screen, and raw technical messages would break the kiosk experience.

### 5. Keep the visual cards faithful even when the backend only supports part of the interaction
The identification screen will render the full card-based kiosk layout from the reference. The functional lookup path will rely on the backend-supported reservation search contract, while any extra visual entry points stay modular and can be wired later without changing the screen shell.

**Why:** This balances faithful design reproduction with the constraint of not changing the backend.

**Alternatives considered:**
- Removing the extra cards until they are fully functional.
- Adding backend changes to support every visual entry point immediately.

**Why not those:** Removing them would make the screen diverge from the reference, and backend changes are out of scope.

### 6. Reuse the current design tokens and internationalization layer
The new screens will use the same typography, gold/cream palette, and localization approach already established in the kiosk app.

**Why:** The change must feel like part of the same product, not a separate prototype.

**Alternatives considered:**
- Introducing a new visual system just for the check-in flow.
- Hardcoding screen copy in the components.

**Why not those:** Consistency and localization matter more than isolated visual novelty here.

## Risks / Trade-offs

- [Portrait fit on smaller kiosks] -> Use responsive clamping, a single shared shell, and layout testing at the kiosk aspect ratio before release.
- [Unsupported visual entry points] -> Keep the shell modular so QR/card entry can be wired later without redesigning the page.
- [Session state loss on reload] -> Keep the flow coordinator small and recoverable from the home screen if a refresh happens.
- [Ambiguity in backend search types] -> Normalize the frontend mapping to the search types already supported by the repository contract.
- [Visual fidelity vs. accessibility] -> Preserve accessible labels and semantic buttons even when the layout mirrors the reference closely.

## Migration Plan

1. Add the new frontend feature module and route structure alongside the existing home screen.
2. Wire the identification screen to the existing backend reservation lookup endpoint through the API layer.
3. Add the reservation-not-found and reservation-confirmation screens using shared kiosk chrome and translations.
4. Validate the flow in the kiosk viewport and adjust spacing/typography if needed.
5. Release the frontend update without backend deployment changes.

Rollback is frontend-only: revert the new routes and feature module if the flow needs to be pulled back.

## Open Questions

- Should the QR code and card insertion cards remain visual-only, or should they route to a future-ready helper state?
- Should the confirmation screen stop at reservation review, or should it immediately continue into the next check-in step in a follow-up change?
- Should the reception fallback action open a dedicated support screen or remain a static affordance for this release?
