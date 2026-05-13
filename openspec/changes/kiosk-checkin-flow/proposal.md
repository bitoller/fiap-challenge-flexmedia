## Why

The kiosk already has a working home screen and the backend already exposes the reservation lookup, session creation, check-in, and checkout contracts needed for the next step of the journey. We need a dedicated check-in flow in the frontend so the user can move from the home screen into a branded identification, error, and reservation confirmation experience without changing the backend.

## What Changes

- Add a new kiosk check-in journey starting from the home screen.
- Add a branded identification screen that matches the provided references and supports manual reservation lookup.
- Add a reservation-not-found state with retry and reception fallback actions.
- Add a reservation confirmation screen that presents the fetched stay summary in the same luxury kiosk style.
- Wire the flow to the existing backend endpoints for reservation search and session handoff.
- Keep the implementation modular in the frontend using the current clean architecture split between presentation, data, and domain concerns.

## Capabilities

### New Capabilities
- `checkin-flow`: End-to-end kiosk check-in entry flow from home into identification, error handling, and reservation confirmation.

### Modified Capabilities

- None.

## Impact

- Frontend only: new route-level pages, reusable flow components, typed API adapters, and translations.
- Existing backend contracts remain unchanged and are reused as-is through the API gateway.
- Shared kiosk styling will expand to cover the new portrait-oriented screens and bottom navigation patterns.
