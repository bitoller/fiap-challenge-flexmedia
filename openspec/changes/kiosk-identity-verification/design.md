## Context

The kiosk check-in flow currently runs through reservation lookup, reservation summary, contact review, terms acceptance, payment, and success. The contact review and standalone terms screens add friction because they require guests to read and confirm many fields before the system can continue.

The new flow keeps the existing reservation lookup and summary screens, then replaces the long contact review and separate terms screens with a single guided identity verification screen. The screen uses the kiosk webcam to capture a physical photo document, extract document data through OCR, capture a selfie, compare the selfie with the document photo, and collect terms/biometric consent before moving to payment.

The project is a lightweight academic demo, so integrations must remain free or self-hosted where possible. The design must keep provider boundaries clean so OCR and face match can be replaced later without reshaping the kiosk journey.

## Goals / Non-Goals

**Goals:**

- Shorten the check-in flow by replacing contact review and standalone terms with one identity verification step.
- Use webcam-based document capture and selfie capture inside the kiosk UI.
- Validate OCR-extracted CPF/name against the reservation already attached to the check-in session.
- Validate selfie against the document face using a free/lightweight face match provider.
- Support a document-only fallback when configured, OCR data matches the reservation, and the face match provider is unavailable.
- Keep terms and biometric consent on the identity verification screen.
- Persist verification status, scores, provider metadata, and failure reasons for auditability.
- Keep the code organized around current clean architecture boundaries.

**Non-Goals:**

- Production-grade fraud prevention.
- Long-term storage of raw document/selfie images by default.
- Paid OCR, paid face match, or government ID validation integrations.
- Admin dashboard controls for biometric rules in this change.
- Reworking reservation lookup, reservation summary, payment, checkout, or success screens beyond routing changes required by the new step.

## Decisions

### Single Identity Verification Screen

The kiosk SHALL route from reservation summary to a new identity verification screen instead of the current contact review screen. This screen owns document capture, selfie capture, verification status, terms consent, and the continue action.

Alternatives considered:
- Keep contact review and add verification after it. This preserves existing screens but keeps the flow slow.
- Add separate document, selfie, and terms screens. This is easier to implement incrementally but makes kiosk check-in feel long and fragmented.

### Provider Abstraction

The backend SHALL expose OCR and face match through ports/adapters rather than calling providers directly from UI code. Frontend captures images and sends them to the backend. Backend adapters handle provider-specific payloads, keys, timeouts, scores, and mapping.

Initial providers:
- OCR: OCR.space free tier, called from backend only.
- Face match: CompreFace, deployed locally through Docker when available.

Fallback adapters can return deterministic demo results when providers are not configured, but the UI must display the same state model either way.

### No Raw Image Storage by Default

Raw document and selfie images SHALL be treated as transient request data. The system stores verification result metadata only: status, score, extracted fields, provider name, timestamps, and failure reason. If a future production workflow requires image retention, it should be introduced as a separate explicit change.

### Identity Verification State Model

The frontend SHALL represent identity verification as a state machine:

```text
idle
  -> capturing-document
  -> document-processing
  -> document-approved | document-rejected
  -> capturing-selfie
  -> face-processing
  -> face-approved | face-rejected | document-only-approved
  -> consent-ready
  -> complete
```

The backend SHALL return explicit statuses so the UI can show stable, translated recovery states rather than provider-specific error messages.

### Fallback Rule

When OCR data matches the reservation but the face match provider is unavailable, the backend SHALL allow a configurable document-only fallback for demo purposes. When the face match provider is available and returns a biometric mismatch, the backend SHALL reject the selfie verification and block automatic continuation. The completion payload should mark fallback biometric status as `SKIPPED` or `DOCUMENT_ONLY` rather than `APPROVED`, preserving audit clarity.

### Terms Consolidation

The standalone terms page SHALL be removed from active routing. The identity verification page SHALL include a concise terms acceptance section and biometric consent section before allowing the guest to continue.

## Risks / Trade-offs

- OCR.space free tier can be slow, rate-limited, or inconsistent on physical camera captures → Use backend timeouts, clear retry states, and allow demo adapter fallback.
- CompreFace may require additional Docker resources → Keep it optional in Docker and isolate it behind a face match client.
- Webcam quality can reduce OCR and face match accuracy → Use guided framing UI, short instructions, and retry buttons.
- Biometric/document data is sensitive → Avoid raw image persistence, keep provider keys server-side, and persist only audit metadata.
- Document-only fallback is weaker than full biometric approval → Store fallback status distinctly, make it configurable, and never use it for an explicit face mismatch.
- Removing contact review means fewer manual correction opportunities → Trust reservation data and use OCR match only for identity verification, not for editing guest profile.

## Migration Plan

1. Add backend identity verification endpoints and provider adapters without removing current contact/terms endpoints.
2. Add the new frontend page and route it after reservation summary.
3. Redirect successful identity verification to the current payment step.
4. Remove active navigation to contact review and standalone terms pages.
5. Keep legacy contact/terms code only if needed for rollback during implementation, then remove dead files once the new flow is validated.
6. Update Docker and environment examples for optional OCR/CompreFace configuration.
7. Run kiosk smoke tests for reservation lookup, summary, identity verification approval, face mismatch rejection, provider-unavailable fallback, and continuation to the existing next step.

## Open Questions

- Should document-only fallback remain enabled by default in local/demo Docker, or should it be disabled unless explicitly needed for classroom testing?
- Should OCR match require exact CPF and fuzzy name, or CPF-only for the first version?
- Should the terms text be a short consent block on this screen, or a collapsible detailed version with the same content as the old terms page?
