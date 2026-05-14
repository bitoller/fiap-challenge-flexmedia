# Executive Report

## 1. Context

Flexmedia develops technology solutions for security, automation, telecom, broadcast, ITS, and digital signage. The proposed challenge is to deliver a self-service kiosk for the hotel industry, enabling automated check-in and check-out with PMS integration, key issuance, facial recognition, and additional guest services.

The proposed project, named FlexCheck Hotel, leverages Flexmedia’s experience with hardware, automation, and field support to create a solution applicable to hotels of different sizes.

## 2. Identified Problem

Traditional hotel check-in and check-out processes often depend on in-person service, reception queues, manual data review, payment confirmation, manual key issuance, and PMS lookup. This creates:

- waiting time for guests, especially during peak hours;
- overload at reception due to repetitive tasks;
- higher risk of human error during document, reservation, and payment verification;
- inconsistent guest experience across shifts and hotel units;
- limited traceability of operational decisions.

## 3. Affected Audience

- Guests: expect speed, autonomy, security, and less friction.
- Reception staff: need to reduce repetitive tasks and focus on exception handling.
- Hotel managers: require operational efficiency, standardization, and reliable data.
- Hotel chains: need to integrate multiple units, PMS platforms, and shared processes.
- Flexmedia: can expand its portfolio of kiosks and digital signage into hospitality automation.

## 4. Proposed Solution

FlexCheck Hotel is composed of:

- a React application for the kiosk;
- a React-based administrative dashboard for operational oversight;
- Java microservices for reservations, check-in, keys, payments, biometrics, devices, and PMS integration;
- Oracle SQL as the transactional persistence layer;
- an integration layer for PMS providers and kiosk hardware.

Guests use the kiosk to locate a reservation, confirm personal data, validate documents, accept terms, complete payment or pre-authorization, and receive a key. During check-out, the guest reviews charges, confirms payment, and closes the stay.

## 5. Value Proposition

- Reduced queues and shorter service times.
- 24/7 operation without relying exclusively on reception.
- Standardized and auditable processes.
- Improved experience for digitally oriented guests.
- Upsell opportunities such as late check-out, room upgrades, and additional services.
- A product that aligns with Flexmedia’s technology portfolio.

## 6. MVP Scope

The MVP must remain small enough to deliver reliably while still demonstrating clear value.

Included:

- kiosk check-in flow;
- reservation lookup by CPF, passport, reservation code, or simulated QR code;
- guest data confirmation;
- LGPD consent and terms acceptance;
- simulated document validation;
- simulated facial recognition with manual fallback;
- simulated payment or pre-authorization;
- simulated digital or physical key issuance;
- check-out flow with outstanding balance closure;
- a simple administrative dashboard for sessions and reservations;
- Oracle database with real test data.

Not included in the MVP:

- real PMS integration;
- real acquirer integration;
- real RFID key issuance when hardware is unavailable;
- production-grade facial biometrics with a certified provider;
- full multilingual product coverage, although the frontend architecture must support future expansion.

## 7. Why This Stands Out

- Architecture designed for real PMS providers through adapters.
- LGPD handling for sensitive and biometric data.
- Contingency mode for network or PMS outages.
- Full audit trail for operations.
- Accessible kiosk design.
- Operational dashboard with kiosk status and failures.
- Well-defined exception flows, avoiding the feeling of an unfinished prototype.

## 8. Success Metrics

- Average check-in time below 3 minutes in the MVP.
- At least 80% of simulated cases completed without human assistance.
- Check-out completed in under 2 minutes when no pending issues exist.
- Reduced number of manual reception tasks.
- 100% auditability of sensitive operations.
- Logical kiosk availability with assisted-service fallback.

## 9. Delivery Timeline

Important challenge dates:

- 08/04/2026: first mentoring session;
- 13/05/2026: second mentoring session;
- 24/05/2026: sprint delivery;
- 17/06/2026: final board presentation.

As of 11/05/2026, the immediate priority is to reach the second mentoring session on 13/05/2026 with a clear narrative, a defined architecture, a closed scope, and the first navigable screens or flows.

Suggested plan:

- By 13/05/2026: validate the problem, the solution, the architecture, and the visual prototype.
- By 18/05/2026: deliver the backend base, Oracle schema, and main kiosk flow.
- By 21/05/2026: integrate the frontend with APIs and simulate PMS, payment, and key operations.
- By 23/05/2026: record the pitch, test the demo, and prepare the delivery package.
- By 24/05/2026: deliver the sprint.
- By 17/06/2026: refine UX, add the dashboard, metrics, audit, and the scale narrative.

## 10. Future Evolution

After the MVP, the product can evolve toward:

- integration with real PMS platforms used in the market;
- real RFID or QR key issuance;
- a mobile app for digital keys;
- certified facial recognition with liveness detection;
- real payment processing with an acquirer;
- multi-hotel and multi-chain support;
- analytics for service time, queueing, conversion, and failures;
- additional kiosk services and upsell opportunities.
