## 1. Kiosk Identification UI

- [x] 1.1 Redesign the check-in identification screen to show only CPF, reservation number, and QR code as supported modes.
- [x] 1.2 Remove the card-based identification option from the kiosk screen and update the supporting copy.
- [x] 1.3 Refresh the iconography and visual hierarchy so the active lookup field is the main focus on a vertical totem layout.

## 2. QR Lookup Support

- [x] 2.1 Add a QR scanning dependency and wire it into the identification screen with camera activation and token capture.
- [x] 2.2 Add a dedicated QR lookup path in the kiosk repository and flow state so the scanned token can be sent to the backend.
- [x] 2.3 Extend the backend reservation lookup contract to accept a QR token as a first-class search type.

## 3. Error Handling and Flow Continuation

- [x] 3.1 Update the recovery screens and messages to distinguish invalid CPF, invalid reservation number, invalid QR token, and non-eligible reservation states.
- [x] 3.2 Keep the kiosk flow transition to the next step unchanged when a valid open reservation is found.
- [x] 3.3 Verify that reservation lookup remains hotel-scoped and does not leak reservations across properties.

## 4. Validation

- [x] 4.1 Build the kiosk web app and confirm the identification screen renders correctly in portrait-oriented kiosk dimensions.
- [x] 4.2 Validate that CPF, reservation number, and QR token each resolve to the expected reservation path.
- [x] 4.3 Confirm that the unsupported card option is no longer present in the kiosk check-in identification flow.
