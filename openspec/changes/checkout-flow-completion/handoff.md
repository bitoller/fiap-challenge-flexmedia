# Checkout Flow Handoff

## What was delivered

- Added a backend active-stay lookup path in `checkin-service`:
  - `POST /api/v1/stays/lookup`
  - scopes by hotel, room number, and guest document
  - returns stay preview data with itemized charges for the kiosk summary
- Kept the existing checkout settlement endpoint in `checkin-service` as the source of truth for closing the stay.
- Added a dedicated `checkout-flow` module in `frontend/kiosk-web` with:
  - isolated context
  - repository adapter
  - route-driven pages
  - portrait-first kiosk styling
- Wired the checkout journey to the backend lookup and settlement contracts.
- Kept the kiosk shell hotel-aware and consistent with the check-in experience.

## Validation completed

- `npm run build` passed in `frontend/kiosk-web`
- `mvn test` passed in `backend/services/checkin-service`
- The checkout flow compiles and is ready for end-to-end smoke testing against a real active stay

## Current flow

1. Guest enters room number and CPF on the checkout identification screen.
2. Frontend resolves the active stay through `POST /api/v1/stays/lookup`.
3. The bill summary renders the backend charges and stay details.
4. Guest can ask for reconciliation help or continue.
5. Guest chooses payment method and confirms the checkout.
6. Frontend submits the final settlement request to the existing backend checkout endpoint.
7. Receipt and success screens complete the kiosk journey.

## Notes for future work

- The receipt email screen is currently a kiosk UI state and does not yet send a real notification.
- The folio breakdown is backed by the current preview contract and can be enriched later if PMS data becomes available.
- The concierge/services path remains a placeholder and should be handled in a separate change.

## Where to continue

- Frontend improvements or polish for checkout: `frontend/kiosk-web/src/presentation/features/checkout-flow/`
- Backend lookup and settlement behavior: `backend/services/checkin-service/src/main/java/br/com/fiap/flexcheck/checkin/`
- OpenSpec tasks and follow-up work: `openspec/changes/checkout-flow-completion/tasks.md`
