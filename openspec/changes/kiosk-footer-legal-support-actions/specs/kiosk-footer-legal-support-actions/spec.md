# kiosk-footer-legal-support-actions Specification

## ADDED Requirements

### Requirement: Footer privacy action opens legal policy without losing progress

The kiosk footer SHALL provide a privacy policy action that opens a localized legal policy screen and preserves the user's current flow state.

#### Scenario: Guest returns to the same flow step

- **GIVEN** a guest is in the middle of a kiosk flow
- **WHEN** they open the privacy policy from the footer
- **THEN** the policy screen is displayed in the kiosk shell
- **AND** the back action returns to the route that opened the policy screen
- **AND** existing in-memory check-in or checkout progress remains available.

### Requirement: Legal policy content covers stay and biometric terms

The legal policy screen SHALL include hotel stay terms, document verification terms, facial biometric validation terms, data handling terms, and fallback support guidance.

#### Scenario: Guest reads biometric terms

- **GIVEN** a guest opens the policy screen
- **WHEN** the screen renders
- **THEN** it presents clear sections for document capture, facial comparison, consent, retention, and human support.

### Requirement: Concierge contact records support request

The kiosk footer SHALL provide a concierge contact action that records a persistent support request for the active hotel and kiosk.

#### Scenario: Guest requests help

- **GIVEN** the kiosk is connected to the backend
- **WHEN** the guest selects concierge contact
- **THEN** the kiosk records an admin audit event for the active hotel
- **AND** the guest sees a localized confirmation that reception was notified.

### Requirement: Footer support feedback is localized and stable

Footer support confirmation and error feedback SHALL be localized in English, Portuguese, and Spanish, with stable card and button dimensions.

#### Scenario: Language changes after support request

- **GIVEN** a support confirmation is visible
- **WHEN** the guest changes language
- **THEN** the message remains visually stable and uses the selected language.
