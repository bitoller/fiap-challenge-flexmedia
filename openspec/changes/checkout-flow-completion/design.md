## Context

The kiosk checkout route is still a placeholder in `kiosk-web`, but the backend already has the core settlement endpoint that closes a stay. The missing piece is the guest-facing entry point that can locate the correct active stay from room and document input, then guide the guest through bill review, payment, receipt, and closeout in a portrait-first kiosk flow.

The current codebase already has the architectural patterns we want to preserve:
- feature-scoped frontend modules
- repository adapters for API access
- route-level screens for each major kiosk step
- backend orchestration in `checkin-service`
- shared kiosk shell and hotel branding

This change should complete checkout without collapsing the architecture into a single page or a monolithic service.

## Goals / Non-Goals

**Goals:**
- Build a dedicated checkout flow in the kiosk frontend.
- Add a backend lookup path that resolves the active stay from hotel, room, and guest document data.
- Reuse the existing checkout settlement endpoint and its side effects.
- Keep the UX consistent with the check-in journey and the Figma references.
- Preserve clean architecture and clean code boundaries in both frontend and backend.

**Non-Goals:**
- Creating a new payment processor integration.
- Building a real card-reader hardware integration.
- Expanding concierge/services into this change.
- Replacing the existing checkout settlement endpoint with a new service.
- Introducing a global state management library.

## Decisions

### 1. Keep checkout as a dedicated frontend feature module
The kiosk checkout journey will live under its own feature folder with its own context, repository adapter, pages, and components.

**Why:** The check-in implementation already proved that route-driven, feature-scoped screens are easier to test and reason about on a kiosk.

**Alternatives considered:**
- Reusing the check-in flow folder and mixing checkout screens into it.
- Building checkout as a single giant page with internal state.

**Why not those:** They would blur the boundary between check-in and checkout and make the kiosk harder to maintain.

### 2. Resolve the active stay before settlement
The backend will expose a lookup contract that returns the active stay and review data from hotel, room, and guest document inputs before the final checkout request is sent.

**Why:** The kiosk should not depend on a manual `stayId` entry. The Figma flow starts from guest-visible data, and the backend already owns the stay lifecycle.

**Alternatives considered:**
- Asking the user to type a stay ID.
- Deriving the stay entirely in the frontend from cached data.

**Why not those:** They are brittle, error-prone, and less aligned with the kiosk UX.

### 3. Keep the settlement orchestration in `checkin-service`
The existing checkout endpoint in `checkin-service` will remain the source of truth for closing a stay, handling payment capture, key revocation, PMS sync, receipt notification, and audit.

**Why:** The service already owns the stay domain and the current checkout transaction.

**Alternatives considered:**
- Moving checkout into a new dedicated service.
- Splitting payment and stay closure into separate backend calls.

**Why not those:** That would add unnecessary surface area and duplicate orchestration that already exists in the current service.

### 4. Render bill details from backend data
The checkout summary screen will render the charge breakdown returned by the backend instead of hard-coding line items in the frontend.

**Why:** The kiosk should not invent billing logic. If itemized charges are available, they should come from the backend contract.

**Alternatives considered:**
- Hard-coding room, minibar, and restaurant lines in the frontend.
- Showing only the final total.

**Why not those:** Hard-coding duplicates business logic, and showing only the total weakens the billing review experience shown in the Figma.

### 5. Treat card insertion as a UI state, not a hardware dependency
The kiosk will show the card-insertion screen and payment selection states now, but the implementation will remain compatible with future real reader hardware.

**Why:** The visual flow needs to exist now, but the hardware integration is a separate concern.

**Alternatives considered:**
- Building the flow around a concrete reader SDK immediately.
- Omitting the card step until hardware is available.

**Why not those:** The first option overcouples the app to hardware; the second leaves the checkout flow incomplete.

### 6. Reuse the existing kiosk shell and branding model
Checkout will use the same portrait shell, hotel branding, and localization patterns already used by check-in.

**Why:** This preserves the white-label kiosk experience and reduces duplicated layout code.

**Alternatives considered:**
- Creating a separate shell for checkout.
- Hard-coding a checkout theme independent of the hotel profile.

**Why not those:** They would introduce inconsistent UX and duplicate styling logic.

## Risks / Trade-offs

- [Lookup ambiguity] Room number and document data may not uniquely identify a stay in edge cases. → Mitigation: scope the lookup by hotel and reject ambiguous or inactive results explicitly.
- [Synthetic billing data] The initial implementation may not have a full PMS-grade folio source. → Mitigation: return a structured preview with available charge lines and keep the backend contract ready for richer PMS data later.
- [Hardware gap] The card insertion screen may remain a visual state before a real reader is integrated. → Mitigation: keep the payment state isolated so hardware can be attached later without redesigning the flow.
- [Flow drift] Checkout and check-in share the kiosk shell, which can create state leakage if context is not isolated. → Mitigation: keep checkout in its own feature context and clear transient state on exit.

## Migration Plan

1. Add the backend checkout lookup contract and expose it through the API gateway.
2. Add the checkout feature module in `kiosk-web` with its own repository and route set.
3. Wire the identification screen to resolve the active stay before showing the summary.
4. Implement the summary, reconciliation, payment, card, receipt, and success screens.
5. Reuse the existing checkout settlement endpoint from `checkin-service`.
6. Validate the end-to-end flow in the kiosk and document the final operational path.

Rollback is frontend-safe and backend-safe: the checkout placeholder can be restored if needed, and the existing settlement endpoint can remain untouched while the lookup path is revised.

## Open Questions

- Should the backend return a fully itemized folio immediately, or should the first version expose a minimal preview with total due plus available line items?
- Should the receipt screen auto-return to home after a timeout, or wait for the guest to tap a final action?
- Should email receipt sending be part of the checkout screen now, or stay as a follow-up to the receipt flow?
