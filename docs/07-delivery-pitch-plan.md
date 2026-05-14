# Delivery Plan and Pitch

## 1. Delivery Package

The challenge submission must include a `.ZIP` package containing:

1. a PDF with the team name, the members' names, and the public video link;
2. a compressed archive with the files and folders for the delivered MVP.

The pitch video must not exceed 3 minutes.

## 2. Recommended PDF Structure

- Project name: FlexCheck Hotel
- Team name
- Team members
- RM of each member, if required by the course
- Public link to the video
- One-sentence summary of the solution

## 3. Three-Minute Pitch Script

### 0:00 to 0:25 - Problem

"In hotels, check-in and check-out still depend on queues, manual document review, payment handling, and key issuance. This creates waiting time for guests and operational overload for reception."

### 0:25 to 0:50 - Solution

"FlexCheck Hotel is a self-service kiosk integrated with hospitality systems. It allows the guest to locate the reservation, confirm personal data, validate documents, accept terms, complete payment, and receive an access key."

### 0:50 to 2:20 - Demonstration

Show:

- kiosk home screen;
- reservation lookup;
- guest data confirmation;
- LGPD consent;
- document validation or simulated biometrics;
- simulated payment;
- completed check-in with key issuance;
- check-out with balance closure;
- administrative dashboard with operational status.

### 2:20 to 2:45 - Architecture and Differentiators

"The solution was built with React, Java Spring Boot, Oracle SQL, and a microservices architecture. The PMS is isolated behind an adapter, which makes it possible to integrate different hotels without rewriting the system. The solution also addresses LGPD, auditability, and contingency mode."

### 2:45 to 3:00 - Closing

"As a result, the hotel reduces queues, standardizes service, and delivers a faster and safer guest experience."

## 4. Recommended Demo Flow

Use one success flow and one exception flow.

Success flow:

- reservation `RSV-2026-0001`
- approved guest
- approved payment
- issued digital key

Exception flow:

- reservation `RSV-2026-0002`
- declined payment or document under review
- system redirects to reception

## 5. Quality Checklist

- The video is under 3 minutes.
- The link is public.
- The PDF includes the names and the link.
- The ZIP includes frontend, backend, database, and documentation.
- The README explains how to run the project.
- Test data is ready.
- The demo does not depend on external internet access.
- A fallback plan exists if the physical kiosk is unavailable.
- The team can clearly explain what is real, what is simulated, and what remains future work.

## 6. Likely Board Questions

### How do you integrate with different PMS platforms?

Answer: through a `pms-adapter-service` that translates the internal contract into the contract of each PMS. The check-in flow does not change when the hotel changes provider.

### How do you handle LGPD for facial recognition?

Answer: biometrics are optional, depend on explicit consent, include a fallback path, and do not require storing raw images in the MVP.

### What happens if payment fails?

Answer: the flow does not complete automatically. The guest may try again or be redirected to human assistance.

### What happens if the PMS is unavailable?

Answer: the system can operate in contingency mode using recently synchronized data and later reconcile pending events.

### Why microservices?

Answer: because the domain includes independent integrations such as PMS, payment, keys, devices, and biometrics. Separation reduces coupling and allows each part to evolve independently. For the MVP, the implementation remains intentionally controlled so delivery stays safe.
