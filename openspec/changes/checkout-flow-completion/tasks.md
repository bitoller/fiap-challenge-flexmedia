## 1. Backend checkout lookup

- [x] 1.1 Add an active-stay lookup contract in `checkin-service` that resolves hotel, room, and guest document to a single checkout candidate.
- [x] 1.2 Extend the checkout response model so the kiosk receives stay details, bill preview data, and the checkout identifier needed for settlement.
- [x] 1.3 Expose the lookup contract through the API gateway and document the public endpoint in the backend READMEs.

## 2. Kiosk checkout flow

- [x] 2.1 Create a dedicated `checkout-flow` feature module in `frontend/kiosk-web` with its own context, repository adapter, and route structure.
- [x] 2.2 Implement the checkout identification, bill summary, reconciliation, payment, card, receipt, and success screens to match the provided kiosk visuals.
- [x] 2.3 Wire the new checkout screens to the backend lookup and settlement contracts so the flow persists data end-to-end.

## 3. Styling, localization, and shell integration

- [x] 3.1 Update shared kiosk layout, branding, and navigation behavior so checkout uses the same hotel-aware shell as the rest of the app.
- [x] 3.2 Add or update translations, reusable components, and portrait layout styles needed by the new checkout journey.

## 4. Verification and handoff

- [x] 4.1 Run frontend and backend build checks and smoke test the checkout flow against a real active stay.
- [x] 4.2 Update the OpenSpec handoff and implementation notes so future work can continue from the checkout checkpoint.
