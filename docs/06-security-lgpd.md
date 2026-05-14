# Security and LGPD

## 1. Security Principles

FlexCheck Hotel processes personal data, financial data, and potentially biometric data. The security model therefore follows three guiding principles:

- minimize data collection to the lowest viable scope;
- protect data at rest and in transit;
- provide transparency and a reliable fallback path for the guest.

## 2. Personal Data Processed

The solution may process the following categories of information:

- name;
- document number;
- date of birth;
- nationality;
- phone number;
- e-mail address;
- reservation data;
- tokenized or simulated payment data;
- document validation result;
- biometric validation result, when consent is granted.

## 3. Sensitive Data

Facial biometrics are sensitive personal data and must be treated with particular care.

Recommended handling:

- biometrics must remain optional;
- the guest must always have a non-biometric fallback;
- consent must be stored separately from the biometric result;
- raw images must never be persisted in the MVP;
- if a biometric template exists, it must be encrypted or replaced by a provider reference.

## 4. Legal Bases

The project can be framed around the following legal bases:

- performance of contract: data required to complete hospitality services;
- legal or regulatory obligation: data required for hospitality and control purposes;
- legitimate interest: operational security, provided it remains proportional and justified;
- consent: biometrics and optional communications.

## 5. Security Controls

### Authentication

- Operators authenticate with username and password.
- Kiosks use a technical token associated with the device.
- Tokens must expire and be revocable.

### Authorization

Suggested roles:

- `ADMIN`: configures hotels, users, and policies;
- `MANAGER`: oversees operations and reports;
- `RECEPTIONIST`: resolves exceptions;
- `AUDITOR`: reviews audit data;
- `KIOSK`: executes kiosk flows.

### Encryption

- HTTPS is required in production;
- passwords are hashed with BCrypt;
- sensitive data must be encrypted or tokenized where applicable;
- secrets must remain outside the repository.

### Logging

Logs must not contain:

- full document numbers;
- card data;
- images;
- biometric templates;
- authentication tokens.

### Audit

The following actions should always be audited:

- administrative login;
- reservation lookup;
- guest data updates;
- consent acceptance or refusal;
- document validation result;
- biometric validation result;
- payment attempts;
- key issuance or revocation;
- check-in and check-out;
- kiosk redirection to reception.

## 6. Threats and Mitigations

| Threat | Example | Mitigation |
| --- | --- | --- |
| Reservation misuse | Someone attempts to use another guest's reservation | Document validation, optional biometrics, booking code, and identity data |
| Duplicate check-in | Two simultaneous attempts are submitted | Idempotency key and reservation locking |
| Data leakage | Logs contain document or image data | Masking rules and a strict logging policy |
| PMS failure | PMS is unavailable during peak time | Contingency mode and later reconciliation |
| Duplicate payment | A request is replayed | Transaction idempotency |
| Compromised kiosk | A technical token is stolen | Revocable scoped token and monitoring |
| False biometric rejection | A legitimate guest is rejected | Fallback path and human assistance |

## 7. Retention Policy

Recommended retention guidelines:

- temporary sessions: expire after inactivity;
- audit records: retain according to hotel policy;
- consent records: retain as long as proof is required;
- biometrics: do not store raw images in the MVP;
- receipts: retain according to fiscal and operational policy.

## 8. Suggested Kiosk Consent Message

Recommended text for the MVP:

"We will use your data to confirm your reservation and complete your stay. Facial recognition is optional and is used only for identity validation during this service. You may continue without biometrics and, if preferred, request reception support."
