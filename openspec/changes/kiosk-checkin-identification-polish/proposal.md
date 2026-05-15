## Why

The current check-in identification screen is functionally correct, but its visual hierarchy still feels busier than necessary for a kiosk. The goal of this change is to make the reservation discovery step simpler, clearer, and faster to read while preserving the existing vertical totem shell, brand palette, and supported identification modes.

## What Changes

- Refine the check-in identification screen layout so the primary action is visually clearer.
- Keep the current vertical kiosk orientation and the existing hotel brand colors.
- Improve the balance between the identification method cards and the active lookup panel.
- Replace the inconsistent clear/backspace icon with a cleaner, more legible icon.
- Harmonize the icon set used on this screen so it feels more cohesive.
- Make the QR scanner area feel lighter and more integrated into the page composition.
- Preserve the existing check-in behavior and routing flow.

## Capabilities

### Existing Capability Refinement

- `kiosk-checkin-identification-ui`: A more polished and kiosk-friendly version of the check-in identification screen, with improved hierarchy, clearer icons, and a simpler interaction model.

## Impact

Affected areas include the kiosk check-in identification page, its shared local components, and the supporting presentation styles for the identification step. No changes are expected to the header, footer, or the broader check-in flow logic.
