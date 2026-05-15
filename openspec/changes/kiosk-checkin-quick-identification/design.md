## Context

The kiosk check-in flow already has a working reservation lookup path for CPF and reservation number. The first screen, however, still exposes options that do not help the guest find a valid stay quickly, and the QR path is not yet a first-class flow. The goal is to reduce friction at the start of check-in while keeping the vertical totem experience consistent with the current visual language.

This change affects the kiosk frontend, the check-in flow state model, and the reservation lookup contract used by the backend. It also introduces a camera-based QR scanning dependency.

## Goals / Non-Goals

**Goals:**

- Reduce the number of identification choices to the ones that actually help the guest find a reservation.
- Support CPF, reservation number, and QR code as reservation lookup paths.
- Use a QR token that can uniquely identify a reservation in a hotel-scoped and availability-aware way.
- Keep the kiosk vertical layout and the current gold-and-ivory brand language.
- Improve error messaging when a reservation cannot be found or is not eligible.
- Replace the current placeholder iconography with a more consistent icon set.

**Non-Goals:**

- Redesign the remainder of the check-in flow beyond identification.
- Change the business rules for check-in eligibility.
- Replace the existing reservation lifecycle or persistence model.
- Add card-based identification to the kiosk; that option is intentionally removed from this step.

## Decisions

### 1. Keep a single identification screen with three real modes

The screen will focus on the three paths that help the guest locate a stay:

- CPF
- reservation number
- QR code

The current card-based option will be removed because it does not contribute to reservation discovery in this step.

**Why this over keeping the current four-card layout?**

The four-card layout dilutes the primary action. A smaller set of choices improves clarity, reduces cognitive load, and better matches a kiosk experience where speed matters.

### 2. Treat QR as a reservation token, not as a visual shortcut for reservation number

The QR scan should resolve a token that maps to a reservation. This keeps the QR flow secure and allows the hotel to rotate or invalidate tokens independently of the human-readable reservation code.

**Alternatives considered:**

- Encode the `reservation_code` directly in the QR.
- Encode a dedicated reservation token in the QR.

The dedicated token is preferable because it is more flexible for future integrations and better aligned with a production hospitality flow.

### 3. Use `react-zxing` for QR scanning

The QR experience should use a React-friendly scanning library rather than a low-level imperative wrapper.

**Alternatives considered:**

- `html5-qrcode`
- `qr-scanner`
- `react-zxing`

`react-zxing` fits the current frontend stack well, keeps the component model simpler, and avoids excessive imperative camera management in the kiosk UI.

### 4. Replace the ad-hoc SVG set with a small icon library

The kiosk currently uses inline SVGs that are serviceable but inconsistent. A lightweight icon library such as `lucide-react` will make the screen more coherent and easier to maintain.

**Alternatives considered:**

- continue with inline SVGs
- use a larger icon pack

`lucide-react` is the better balance between consistency, bundle size, and visual polish.

### 5. Extend the reservation lookup contract to accept a QR token

The backend should support a QR-specific search type so the kiosk can locate a reservation without reusing the reservation number path.

**Alternatives considered:**

- overload the reservation number search type
- add a QR-specific lookup type

The QR-specific lookup type keeps the contract explicit and avoids mixing two different business meanings in the same field.

### 6. Reuse the existing recovery flow for failures

Invalid credentials, missing reservations, unavailable cameras, and non-eligible reservations should continue to route into the existing recovery experience with clearer messages.

**Why this over a new error screen?**

The recovery page already fits the kiosk pattern and provides a consistent escalation path to reception. The change only needs to make the failure messages sharper and more specific.

## Risks / Trade-offs

- [QR token contract] → The backend must agree on the token shape and search type before the kiosk can fully rely on QR scanning.
- [Camera permissions] → Browser permission prompts or device limitations may prevent QR scanning, so the manual CPF and reservation paths must remain strong fallback options.
- [Library adoption] → Adding a QR dependency increases the frontend dependency surface, but it is justified by the kiosk use case.
- [UI simplification] → Removing the card option improves clarity, but it also reduces the number of visible choices; the screen must remain visually strong enough to compensate.
- [Error sensitivity] → Better error messages can expose operational detail if they are not phrased carefully, so the messages must remain guest-friendly.
