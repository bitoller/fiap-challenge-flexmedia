## ADDED Requirements

### Requirement: Identity Verification Replaces Contact And Terms Steps
The kiosk check-in flow SHALL route from the reservation summary to a combined identity verification screen and SHALL NOT require the previous long contact confirmation screen or standalone terms screen during the active check-in journey.

#### Scenario: Continue from reservation summary
- **WHEN** a guest confirms the reservation summary
- **THEN** the kiosk opens the identity verification screen instead of the contact confirmation screen

#### Scenario: Terms are accepted in identity verification
- **WHEN** the guest completes identity verification and accepts the required consents
- **THEN** the kiosk continues to the next check-in step without opening a separate terms screen

### Requirement: Document Capture
The kiosk SHALL let the guest capture a physical photo document with the kiosk webcam and submit the captured image to the backend for OCR processing.

#### Scenario: Capture document image
- **WHEN** the guest taps the document capture action
- **THEN** the kiosk captures the current webcam frame and sends it to the check-in identity verification backend

#### Scenario: Retry document capture
- **WHEN** OCR processing fails or the extracted data does not match the reservation
- **THEN** the kiosk allows the guest to retake the document photo or request help

### Requirement: OCR Reservation Matching
The backend SHALL extract document name and CPF using an OCR provider and compare the normalized extracted fields with the reservation attached to the check-in session.

#### Scenario: OCR data matches reservation
- **WHEN** OCR returns a CPF and name that match the attached reservation
- **THEN** the backend records document verification as approved and returns a document-approved status

#### Scenario: OCR data does not match reservation
- **WHEN** OCR returns a CPF or name that does not match the attached reservation
- **THEN** the backend records document verification as rejected and returns a document-rejected status

#### Scenario: OCR provider unavailable
- **WHEN** the OCR provider is unavailable or times out
- **THEN** the backend returns a recoverable provider-unavailable status without exposing provider internals to the kiosk UI

### Requirement: Selfie Capture
The kiosk SHALL let the guest capture a selfie with the kiosk webcam after document verification is approved.

#### Scenario: Capture selfie image
- **WHEN** the guest taps the selfie capture action after document approval
- **THEN** the kiosk captures the current webcam frame and sends it to the backend for face matching

#### Scenario: Selfie before document approval
- **WHEN** the document has not been approved
- **THEN** the kiosk prevents selfie verification from being submitted

### Requirement: Face Match Verification
The backend SHALL compare the selfie against the document photo through a face match provider and record biometric verification status, score, provider, and failure reason.

#### Scenario: Face match approved
- **WHEN** the face match score satisfies the configured threshold
- **THEN** the backend records biometric verification as approved and returns a face-approved status

#### Scenario: Face match rejected
- **WHEN** the face match score does not satisfy the configured threshold
- **THEN** the backend records biometric verification as rejected and returns a face-rejected status

#### Scenario: Face provider unavailable
- **WHEN** the face match provider is unavailable or times out
- **THEN** the backend records the provider failure and returns a recoverable status

### Requirement: Document-Only Fallback
The backend SHALL support a configurable document-only fallback when OCR data matches the reservation but the face match provider is unavailable.

#### Scenario: Fallback enabled
- **WHEN** document verification is approved and the face match provider is unavailable while fallback is enabled
- **THEN** the backend allows the check-in flow to continue with biometric status marked as document-only or skipped

#### Scenario: Fallback disabled
- **WHEN** document verification is approved and the face match provider is unavailable while fallback is disabled
- **THEN** the backend blocks continuation and returns a recovery status that directs the guest to retry or ask reception

#### Scenario: Face mismatch does not use fallback
- **WHEN** document verification is approved and the face match provider returns a biometric mismatch
- **THEN** the backend rejects the selfie verification and does not allow document-only fallback

### Requirement: Inline Terms And Biometric Consent
The identity verification screen SHALL include required terms acceptance and biometric consent before allowing the guest to continue.

#### Scenario: Consents missing
- **WHEN** the guest has not accepted required terms or biometric consent
- **THEN** the continue action remains disabled

#### Scenario: Consents accepted
- **WHEN** identity verification is approved or fallback-approved and required consents are accepted
- **THEN** the kiosk allows the guest to continue to the next check-in step

### Requirement: Verification Audit Metadata
The system SHALL persist verification metadata without storing raw document or selfie images by default.

#### Scenario: Verification recorded
- **WHEN** document OCR or face match verification completes
- **THEN** the system stores status, score when available, provider name, timestamp, extracted document fields when available, and failure reason when available

#### Scenario: Raw image retention
- **WHEN** verification completes
- **THEN** the system does not persist raw document or selfie image data unless a future explicit retention feature is introduced

### Requirement: Provider Configuration
The system SHALL keep OCR and face match providers configurable so local/demo environments can run with free or self-hosted services and future providers can be swapped without changing kiosk UI behavior.

#### Scenario: Demo provider configured
- **WHEN** OCR.space or CompreFace configuration is present
- **THEN** the backend uses the configured provider through its adapter

#### Scenario: Provider not configured
- **WHEN** no provider configuration is present
- **THEN** the backend returns a clear provider-unavailable or demo fallback status according to environment configuration
