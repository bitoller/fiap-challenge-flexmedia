# Design

## Flow
1. Guest locates a reservation.
2. Guest reviews the reservation summary.
3. Guest completes identity verification and consent.
4. Guest optionally selects add-on services.
5. Guest continues to payment with the updated total.

## Persistence
Selected add-ons are stored by reservation and check-in session. Re-applying a selection replaces the previous selection for that session, preventing duplicated charges.

## Pricing
The initial catalog is static and lightweight:
- Breakfast: one-time per primary guest.
- Room upgrade: per night.
- Late checkout: one-time charge.

The backend calculates totals using the reservation dates and persists the updated reservation total.

## UI
The kiosk presents three large cards with visual placeholders, concise descriptions, and clear selected states. A summary strip shows the base reservation amount, add-ons amount, and updated total before continuing.
