## 1. Backend Identity Verification

- [x] 1.1 Add identity verification request and response DTOs for document capture, selfie capture, verification status, and consent state.
- [x] 1.2 Add check-in service endpoints for document verification, selfie verification, and final identity verification confirmation.
- [x] 1.3 Add OCR provider port and OCR.space adapter with configurable API key, timeout, and disabled-provider behavior.
- [x] 1.4 Add face match provider port and CompreFace adapter with configurable base URL, threshold, timeout, and disabled-provider behavior.
- [x] 1.5 Implement document verification use case that normalizes OCR name/CPF and compares them with the attached reservation.
- [x] 1.6 Implement selfie verification use case that compares selfie and document face through the face match provider.
- [x] 1.7 Implement configurable document-only fallback for approved document verification when the face match provider is unavailable, while rejecting explicit face mismatches.
- [x] 1.8 Persist document and biometric verification metadata without storing raw images by default.
- [x] 1.9 Register inline terms and biometric consent as part of identity verification completion.

## 2. Frontend Kiosk Flow

- [x] 2.1 Add an identity verification page after reservation summary and route successful verification to payment.
- [x] 2.2 Remove active navigation to the long contact review page.
- [x] 2.3 Remove active navigation to the standalone terms page.
- [x] 2.4 Add document capture UI using the existing kiosk camera patterns and stable vertical kiosk layout.
- [x] 2.5 Add selfie capture UI using the existing kiosk camera patterns and stable vertical kiosk layout.
- [x] 2.6 Add verification status UI for pending, approved, rejected, fallback-approved, and provider-unavailable states.
- [x] 2.7 Add inline terms acceptance and biometric consent controls to the identity verification page.
- [x] 2.8 Add translated copy for English, Portuguese, and Spanish without changing existing header/footer behavior.
- [x] 2.9 Remove dead contact review and standalone terms files after routing no longer uses them.

## 3. Integration And Configuration

- [x] 3.1 Update frontend repository calls and API endpoint definitions for the new identity verification endpoints.
- [x] 3.2 Update check-in completion payload mapping to send document and biometric statuses from identity verification.
- [x] 3.3 Add Docker configuration for optional CompreFace or documented local provider setup.
- [x] 3.4 Add environment example entries for OCR and face match provider configuration without real secrets.
- [x] 3.5 Keep provider-disabled behavior functional for local demo mode.

## 4. Verification

- [x] 4.1 Add backend tests for OCR match, OCR mismatch, face match approval, face match rejection, and fallback behavior.
- [x] 4.2 Add frontend tests or smoke coverage for document capture, selfie capture, consent gating, recovery states, and navigation.
- [x] 4.3 Run backend build and tests.
- [x] 4.4 Run kiosk frontend build.
- [x] 4.5 Run Docker rebuild and smoke test the complete check-in path from reservation lookup through identity verification to payment.
