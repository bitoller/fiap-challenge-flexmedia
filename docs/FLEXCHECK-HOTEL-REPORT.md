# FlexCheck Hotel Consolidated Report

## 1. Identification

- Project: FlexCheck Hotel
- Challenge: self-service kiosk for the hotel industry
- Partner company: Flexmedia
- Proposed stack: Java, React, and Oracle SQL
- Environment: Docker and Docker Compose
- Architecture: microservices with simulated integrations in the MVP

## 2. Executive Summary

FlexCheck Hotel is a self-service platform for hotels that allows guests to perform check-in and check-out at a kiosk, reducing queues, standardizing processes, and freeing reception staff to handle more complex cases.

The solution covers reservation lookup, data confirmation, LGPD consent, document validation, optional biometrics, payment or pre-authorization, key issuance, and stay closure.

## 3. Problem Statement

Traditional hotel operations often generate queues, delays, rework, and verification failures. Processes such as reservation validation, payment, document review, and key issuance are repetitive and can be safely automated.

## 4. Solution Overview

The proposal uses a React kiosk connected to Java microservices and an Oracle database. The system also includes an administrative dashboard so reception and management can monitor sessions, failures, and kiosk status.

## 5. MVP Scope

Included in the MVP:

- functional check-in;
- functional check-out;
- simulated reservation and PMS behavior;
- simulated payment;
- simulated digital or physical key issuance;
- optional simulated biometrics;
- Oracle database with demo data;
- Docker Compose for local database standardization;
- initial administrative dashboard;
- audit of the main operations.

Outside the MVP:

- real PMS integration;
- real payment processing;
- production biometric validation;
- real RFID when hardware is unavailable.

## 6. Main Business Rules

- A reservation must be confirmed and within the check-in window.
- Duplicate check-in attempts must be blocked.
- Minors must be redirected to assisted service.
- Rejected documents must prevent automatic completion.
- Biometrics are optional and require consent.
- Declined payment prevents automatic check-in.
- A key can only be issued after check-in is completed.
- Check-out requires resolution of any pending financial items.
- All critical operations must be audited.
- PMS unavailability must trigger contingency and reconciliation handling.

## 7. Architecture

Defined microservices:

- `api-gateway`: single entry point
- `identity-service`: identity, users, and tokens
- `reservation-service`: reservations, guests, rooms, and eligibility
- `checkin-service`: check-in and check-out orchestration
- `key-service`: key issuance and revocation
- `payment-service`: payments and pre-authorizations
- `biometry-service`: optional facial validation
- `notification-service`: receipts and communications
- `device-service`: kiosks and hardware
- `pms-adapter-service`: PMS integration

## 8. Data Model

Main Oracle tables:

- `fc_hotel`
- `fc_room`
- `fc_guest`
- `fc_reservation`
- `fc_reservation_guest`
- `fc_kiosk_device`
- `fc_checkin_session`
- `fc_consent`
- `fc_document_verification`
- `fc_biometry_verification`
- `fc_stay`
- `fc_payment_transaction`
- `fc_key_credential`
- `fc_device_event`
- `fc_pms_event`
- `fc_audit_log`

Database creation:

- JPA entities in `backend/services/checkin-service/src/main/java/.../infrastructure/persistence/entity`
- Hibernate with `JPA_DDL_AUTO=update`

Support scripts:

- `database/oracle/schema.sql`
- `database/oracle/seed.sql`

Environment:

- `docker-compose.yml`
- `.env.example`
- `database/oracle/init`

## 9. Security and LGPD

The solution must respect data minimization, consent, biometrics as an opt-in path, logs without sensitive information, and full auditability.

Key points:

- Facial biometrics are optional.
- Raw images must not be persisted.
- Consent must be versioned.
- Financial data must not be stored in plain form.
- Administrative access must use roles and permissions.

## 10. User Experience

The kiosk should provide:

- large buttons;
- simple language;
- short steps;
- immediate feedback;
- a clear path to reception;
- a final screen with receipt and key.

The dashboard should provide:

- reservations for the day;
- active sessions;
- failures by reason;
- kiosk status;
- summarized audit history.

## 11. Differentiators

- Architecture prepared for real PMS providers.
- Anti-corruption adapter for integrations.
- LGPD considerations built into the design.
- Auditability and traceability.
- Contingency mode.
- Kiosk monitoring as a physical device.
- Well-designed exception flows.

## 12. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Scope too large | Prioritize the check-in/check-out flow and simulate integrations |
| Real PMS unavailable | Create a mocked `pms-adapter-service` |
| Biometrics too complex | Simulate the flow and explain the LGPD design |
| Demo instability | Use fixed seed data and a rehearsed demo script |
| Oracle difficult to run locally | Use the faculty database or a portable script |

## 13. Delivery Timeline

- 11/05 to 13/05: close documentation, prototype, and mentoring narrative.
- 14/05 to 18/05: implement the core backend and database.
- 19/05 to 21/05: integrate React with the APIs.
- 22/05 to 23/05: test the demo, record the video, and prepare the PDF.
- 24/05: deliver the ZIP package.
- Until 17/06: refine UX, dashboard, audit, and the final presentation.

## 14. Project References

- Executive report: `docs/00-executive-report.md`
- Business rules: `docs/01-business-rules.md`
- Requirements and backlog: `docs/02-requirements-and-backlog.md`
- Software architecture: `docs/03-software-architecture.md`
- Oracle data model: `docs/04-oracle-data-model.md`
- API contracts: `docs/05-api-contracts.md`
- Security and LGPD: `docs/06-security-lgpd.md`
- Delivery pitch plan: `docs/07-delivery-pitch-plan.md`
- Project structure: `docs/08-project-structure.md`
- Docker and environments: `docs/09-docker-and-environments.md`
- MVP implemented: `docs/10-mvp-implemented.md`
- Oracle FIAP setup: `docs/11-oracle-fiap-setup.md`
- Project status and next steps: `docs/12-project-status-and-next-steps.md`
- Clean Architecture and SOLID: `docs/13-clean-architecture-solid.md`
