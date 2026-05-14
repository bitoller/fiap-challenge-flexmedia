# Requirements and Backlog

## 1. Functional Requirements

### FR-001 - Start a kiosk session

The system shall create a service session for each flow initiated at the kiosk.

### FR-002 - Search for a reservation

The guest shall be able to search for a reservation by code, CPF, passport, e-mail, or simulated QR code.

### FR-003 - Display reservation summary

The kiosk shall present the guest name, dates, hotel, room when available, number of guests, and reservation status.

### FR-004 - Confirm personal data

The guest shall review and correct required data before check-in.

### FR-005 - Accept terms and LGPD consent

The system shall capture the guest consent to the terms of use and LGPD notices.

### FR-006 - Validate documents

The system shall validate the guest document or simulate validation in the MVP.

### FR-007 - Optional facial recognition

The guest shall be able to opt into facial recognition as an alternative validation step.

### FR-008 - Register payment or pre-authorization

The system shall allow payment or pre-authorization when the stay requires it.

### FR-009 - Issue key

The system shall issue a digital or physical key after check-in is completed.

### FR-010 - Complete check-in

The system shall create an active stay and update the reservation status to `CHECKED_IN`.

### FR-011 - Perform check-out

The guest shall be able to review charges and complete the stay through the kiosk.

### FR-012 - Administrative dashboard

Operators shall be able to view reservations, sessions, stays, kiosk status, and failures.

### FR-013 - Multi-hotel support

The platform shall support more than one hotel and allow hotel-specific branding and operational views.

## 2. Non-Functional Requirements

### NFR-001 - Usability

The kiosk flow shall be completed with a small number of touches and with direct language.

### NFR-002 - Accessibility

The kiosk shall remain suitable for portrait hardware with large touch targets and adequate contrast.

### NFR-003 - Auditability

Sensitive operations shall be auditable with a traceable correlation identifier.

### NFR-004 - Security

Administrative access shall require authentication and shall not be exposed through kiosk flows.

### NFR-005 - Extensibility

The architecture shall support future PMS, payment, key, and biometric integrations without rewriting the core flow.

## 3. User Stories

- As a guest, I want to locate my reservation and check in at the kiosk so I can avoid reception queues.
- As a guest, I want to review my information before confirming so I can correct any mistakes.
- As a guest, I want to receive my key after check-in so I can access my room immediately.
- As a guest, I want to check out at the kiosk so I can leave quickly.
- As a guest, I want assisted support when the system cannot complete my request so I do not get blocked.
- As a manager, I want to view sessions and kiosk status so I can identify operational issues.
- As a manager, I want to create and delete reservations in a test area so I can validate the flows persistently.

## 4. Implementation Backlog

### High priority

- Create the navigable kiosk prototype.
- Create the architecture documentation.
- Implement reservation search.
- Implement check-in completion.
- Implement the dashboard base.
- Set up the Oracle schema and seed data.

### Medium priority

- Implement admin authentication.
- Implement hotel branding management.
- Implement device status reporting.
- Implement reservation test management.

### Low priority

- Expand the checkout flow.
- Expand PMS integration.
- Expand biometric integration.
- Strengthen analytics and operational reporting.

## 5. Acceptance Criteria

- The happy path for check-in works end to end.
- The happy path for check-out works end to end.
- The dashboard shows persisted operational data.
- The admin portal supports hotel-scoped operations.
- The documentation remains sufficient to explain the architecture and business behavior.
