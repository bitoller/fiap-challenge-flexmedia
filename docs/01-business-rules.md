# Business Rules

## 1. Glossary

- Guest: the person who uses the reservation and the stay.
- Reservation: the booking record originating from the PMS or created for the demo.
- Stay: the effective period during which the guest occupies the room.
- PMS: Property Management System.
- Kiosk: the physical self-service terminal.
- Digital key: an access credential delivered by QR code, link, or app.
- Physical key: an RFID card or similar credential issued by the equipment.
- Pre-authorization: a temporary card hold used to cover potential charges.
- Service session: the flow started at the kiosk by a guest.

## 2. General Policies

### BR-001 - Reservation identification

The system shall allow reservation lookup by reservation code, CPF, passport, e-mail, or QR code. For the MVP, the QR code may be represented by a textual code.

### BR-002 - Reservation eligibility for check-in

A reservation may start check-in only when:

- it is confirmed;
- it is within the allowed check-in window;
- there is no active stay for the same reservation;
- there are no blocking financial restrictions;
- the guest has a valid document.

### BR-003 - Ineligible reservation

When a reservation is not eligible, the kiosk shall present a concise explanation and offer assisted service at reception.

### BR-004 - Required guest data

Before check-in, the guest shall confirm or complete:

- full name;
- document type and number;
- birth date;
- e-mail;
- phone number;
- consent to terms and LGPD notices.

### BR-005 - Minor guest handling

Guests under the legal age shall not complete autonomous check-in without a responsible adult. The flow shall redirect to reception.

### BR-006 - Document validation

The system shall record document validation. In the MVP, validation may be simulated with the statuses `APPROVED`, `REJECTED`, or `MANUAL_REVIEW`.

### BR-007 - Facial recognition

Facial recognition shall be optional, require explicit consent, and always provide an alternative. If the guest declines consent or validation fails, the flow shall continue through document validation or assisted service.

### BR-008 - Sensitive data protection

Facial images and biometric templates are sensitive data. The architecture shall avoid storing raw images. When necessary, the system shall store only a technical reference, hash, encrypted template, or provider token.

### BR-009 - Payment requirements

A reservation with blocking financial issues shall be routed to assisted service or kiosk payment handling.

### BR-010 - Room availability

Check-in may be completed only if the room is available and clean. For the MVP, room status may be controlled in the database.

### BR-011 - Key issuance

The system shall issue a key only after check-in is completed. If key issuance fails, the stay may remain in `CHECKED_IN_PENDING_KEY`, requiring reception intervention.

### BR-012 - Idempotency

The system shall not allow two check-ins to be completed for the same reservation. The operation shall be idempotent by `reservationId` and `sessionId`.

### BR-013 - Check-out timing

If the guest attempts check-out after the allowed time, the system shall apply the configured fee rule or redirect to reception.

### BR-014 - Audit

Every relevant action shall be audited with timestamp, origin, user or kiosk, correlation identifier, and outcome.

### BR-015 - Usability

The kiosk shall use clear language, large buttons, adequate contrast, and a short-step flow. Multilingual support is desirable for future evolution.

## 3. Core Flows

### Check-in flow

1. Guest starts the service at the kiosk.
2. The kiosk requests reservation identification.
3. The system validates the reservation and guest data.
4. If necessary, the system checks the internal reservation service and the PMS.
5. The system requests consent, payment, and key issuance as required.
6. The system creates the stay and finalizes check-in.

### Check-out flow

1. Guest starts the check-out flow.
2. The system identifies the reservation, room, or key.
3. The system reviews charges and pending items.
4. The system requests payment or confirmation.
5. The system closes the stay, updates status, and issues the receipt.

## 4. Exceptional Cases

- Reservation not found: present an alternative lookup path and reception support.
- Cancelled reservation: block the flow and redirect.
- Payment declined: offer retry or reception support.
- Document rejected: redirect to assisted service.
- No available room: redirect to reception.
- PMS unavailable: allow contingency handling when possible and record the incident.
