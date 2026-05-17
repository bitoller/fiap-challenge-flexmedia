## Implementation Handoff

The check-in flow now routes from reservation lookup to a compact reservation summary and then to a combined identity verification screen. The previous long contact review and standalone terms screens are removed from active kiosk routing.

## Active Flow

1. The guest finds an open reservation by CPF, reservation number, or QR token.
2. The kiosk shows the reservation summary checkpoint.
3. The guest captures a physical photo document.
4. The backend sends the document image to OCR.space and compares extracted CPF/name against the attached reservation.
5. The guest captures a selfie.
6. The backend sends the document image and selfie to CompreFace.
7. If the face match score satisfies the threshold, biometric verification is approved.
8. If CompreFace is unavailable and document-only fallback is enabled, the flow may continue with fallback metadata.
9. If CompreFace returns a face mismatch, the flow is rejected and the kiosk shows recovery.
10. Required stay terms and biometric consent are accepted inline on the identity verification screen.

## Removed From Active Kiosk Routing

- Long contact review page.
- Standalone terms and conditions page.
- Frontend contact-review state and repository calls.
- Frontend standalone consent-registration state and repository calls.

The backend guest-confirmation and consent endpoints remain available as compatibility contracts, but they are no longer part of the active kiosk check-in route.

## Configuration

- `OCR_SPACE_API_KEY` enables real OCR.space document verification.
- `COMPREFACE_URL` and `COMPREFACE_API_KEY` enable real CompreFace face verification.
- `COMPREFACE_THRESHOLD` controls the minimum accepted face similarity score.
- `IDENTITY_DOCUMENT_ONLY_FALLBACK_ENABLED` allows document-only continuation only when the face provider is unavailable, not when a face mismatch is detected.
- No Oracle schema change is required for the OCR.space or CompreFace setup.

## Verification Notes

- Document mismatch should reject the identity step.
- Face mismatch should reject the identity step.
- Provider unavailable may use fallback only when document verification is approved and fallback is enabled.
- The kiosk should show processing feedback while comparing the document and while running facial recognition.
