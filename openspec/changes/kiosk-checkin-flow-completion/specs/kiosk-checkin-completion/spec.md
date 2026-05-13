## ADDED Requirements

### Requirement: Check-in flow continues beyond reservation confirmation
The kiosk SHALL continue the guest journey after reservation confirmation and SHALL present the remaining check-in steps as dedicated screens instead of ending the flow at the reservation summary.

#### Scenario: Guest confirms the reservation summary
- **WHEN** the guest confirms the reservation summary screen
- **THEN** the kiosk SHALL navigate to the contact review step of the check-in flow

#### Scenario: Guest re-enters the flow later
- **WHEN** the guest returns to the check-in journey from the home screen
- **THEN** the kiosk SHALL start from the identification step and rebuild the flow state cleanly

### Requirement: Contact, consent, and payment data persist through the backend contracts
The kiosk SHALL submit guest contact data, consent decisions, and payment choices through the existing backend check-in contracts so the backend persists the journey state.

#### Scenario: Guest updates contact data
- **WHEN** the guest confirms or edits contact information in the flow
- **THEN** the kiosk SHALL submit the guest confirmation payload to the backend before advancing

#### Scenario: Guest accepts terms and conditions
- **WHEN** the guest accepts the required consents
- **THEN** the kiosk SHALL submit the consent payload to the backend before moving to payment

#### Scenario: Guest completes payment and check-in
- **WHEN** the guest finishes the payment step
- **THEN** the kiosk SHALL submit the completion payload to the backend and persist the returned check-in result

### Requirement: Successful completion shows the post-check-in success state
The kiosk SHALL present a success screen after a successful check-in that summarizes the room assignment and the issued key, and SHALL provide a clear action to return to the kiosk start.

#### Scenario: Check-in completes successfully
- **WHEN** the backend returns a successful check-in completion response
- **THEN** the kiosk SHALL show the success screen with the room, key, and confirmation message

#### Scenario: Guest finishes the success screen
- **WHEN** the guest taps the primary action on the success screen
- **THEN** the kiosk SHALL return to the kiosk start screen

### Requirement: Recovery states remain calm and retryable
The kiosk SHALL preserve dedicated recovery states for reservation lookup failures, document rejection, biometry rejection, and payment rejection so the guest can retry or request support without breaking the flow.

#### Scenario: Reservation lookup fails
- **WHEN** the backend returns a reservation-not-found response
- **THEN** the kiosk SHALL show the not-found recovery screen with retry and reception actions

#### Scenario: Payment is declined
- **WHEN** the backend returns a payment-declined response during the check-in flow
- **THEN** the kiosk SHALL show a recovery state that explains the failure and preserves the retry path
