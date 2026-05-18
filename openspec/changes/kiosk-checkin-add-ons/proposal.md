# Kiosk Check-in Add-ons

## Summary
Add an optional services step between identity verification and payment in the kiosk check-in flow.

## Motivation
Guests should be able to add hotel services during check-in, such as breakfast, room upgrades, and late checkout. Selected services must be persisted with the reservation and reflected in the payment total.

## Scope
- Add a check-in add-ons screen after identity verification.
- Persist selected add-ons in Oracle through the check-in API.
- Recalculate reservation totals immediately after add-on selection.
- Route payment to use the updated reservation total.
- Keep the UI aligned with the existing luxury kiosk design and internationalization pattern.

## Out of Scope
- Admin management of the add-on catalog.
- Room-specific imagery for every accommodation type.
- Itemized checkout folio redesign.
