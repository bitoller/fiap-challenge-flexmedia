# Kiosk Check-in Payment and Access Completion

## Summary
Refine the final check-in steps by combining payment selection with a financial summary and replacing the generic success page with a room access completion screen.

## Motivation
The kiosk check-in flow should remain fast after optional add-ons are selected. Guests need a clear final review of the amount being authorized, a simple payment selection, and a polished completion screen that explains both facial room access and physical card fallback.

## Scope
- Redesign the check-in payment page as a payment and value summary step.
- Display reservation, selected services, and updated total before payment authorization.
- Show a discreet payment processing state while the existing check-in completion API runs.
- Redesign the success page to communicate room assignment, facial access, physical card fallback, and final instructions.
- Keep the existing backend completion flow and persistence behavior.
- Keep copy localized in English, Portuguese, and Spanish.

## Out of Scope
- Real payment gateway integration.
- Persistent facial door access enrollment beyond the existing biometric verification result.
- Physical kiosk dispenser hardware integration.
