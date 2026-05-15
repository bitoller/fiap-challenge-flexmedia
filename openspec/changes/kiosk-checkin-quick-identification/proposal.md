## Why

The current check-in identification screen is functional, but it still includes options that slow the guest down and distract from the primary goal: finding a valid reservation as quickly as possible. The kiosk needs a more direct path for CPF, reservation number, and QR code so the experience feels faster, clearer, and more aligned with a hotel self-service flow.

## What Changes

- Simplify the check-in identification screen so it focuses exclusively on reservation lookup.
- Keep CPF and reservation number as the primary manual lookup paths.
- Add QR code scanning as a first-class lookup path for reservation identification.
- Remove the card-based option from the check-in identification screen because it does not fit this step of the journey.
- Refresh the kiosk visual treatment for this step while preserving the vertical totem layout and the established hotel branding language.
- Improve the clarity of the lookup error state when no valid reservation is found.
- Introduce cleaner iconography for the identification screen to improve visual consistency.

## Capabilities

### New Capabilities

- `kiosk-checkin-identification`: Direct reservation discovery on the kiosk using CPF, reservation number, or QR code, with a streamlined and visually consistent identification screen.

## Impact

Affected areas include the kiosk frontend identification screen, the reservation lookup contract used by the check-in journey, QR scanning dependencies for the kiosk web app, and the error-handling path shown when a reservation cannot be located.
