## Why

The current check-in flow asks guests to review a long contact form and then accept terms on a separate screen, which slows down the kiosk journey and adds unnecessary manual effort. Replacing those steps with guided document capture, selfie verification, and inline consent keeps the experience faster, clearer, and closer to a real hotel self-service check-in.

## What Changes

- Add a new identity verification step after the reservation summary.
- Capture a physical photo document through the kiosk webcam.
- Extract guest name and CPF from the document using a lightweight OCR provider.
- Capture a selfie through the kiosk webcam.
- Compare the selfie with the document photo using a lightweight face match provider.
- Validate extracted document data against the selected reservation before allowing check-in to continue.
- Include terms and biometric consent directly in the identity verification screen.
- Allow a document-only fallback only when OCR matches the reservation and the face match provider is unavailable.
- Reject the flow when the face match provider is available and returns a biometric mismatch.
- Remove the long contact confirmation screen from the active check-in flow.
- Remove the standalone terms and conditions screen from the active check-in flow.
- Keep providers abstracted so free/demo providers can be replaced later without changing the kiosk flow.

## Capabilities

### New Capabilities

- `kiosk-identity-verification`: Covers document capture, OCR matching, selfie capture, face matching, fallback behavior, inline consent, and check-in flow routing after the reservation summary.

### Modified Capabilities

- None.

## Impact

- Frontend kiosk check-in routing, state management, UI components, i18n copy, and camera capture behavior.
- Backend check-in session APIs for identity verification and inline consent registration.
- Biometry integration boundary for face matching.
- New OCR integration boundary for document data extraction.
- Persistence/audit records for document verification, biometric verification, consent, scores, status, and failure reasons.
- Docker and environment configuration for free/lightweight demo providers.
- Existing check-in completion behavior, because document and biometric statuses will feed the existing complete-checkin step.
