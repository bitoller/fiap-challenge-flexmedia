# Kiosk Check-in Add-ons Specification

## ADDED Requirements

### Requirement: Optional add-ons during check-in
The kiosk SHALL present optional add-on services after identity verification and before payment.

#### Scenario: Guest selects services
- GIVEN a guest has completed identity verification
- WHEN the guest selects one or more add-ons
- THEN the system persists the selected add-ons for the reservation
- AND the reservation total is recalculated before payment.

#### Scenario: Guest skips services
- GIVEN a guest has completed identity verification
- WHEN the guest skips add-ons
- THEN the system clears any selected add-ons for that session
- AND the guest continues to payment with the reservation total.

### Requirement: Add-ons are persisted
The backend SHALL store selected add-ons in Oracle using the check-in session and reservation.

#### Scenario: Selection is changed
- GIVEN a session already has selected add-ons
- WHEN a new selection is applied
- THEN previous selected add-ons for that session are removed from the active total
- AND only the new selection is reflected in the reservation total.
