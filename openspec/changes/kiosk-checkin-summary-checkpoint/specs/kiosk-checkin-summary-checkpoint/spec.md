## ADDED Requirements

### Requirement: Compact reservation checkpoint
The kiosk SHALL present the reservation confirmation step as a compact summary checkpoint that allows the guest to verify the booking before moving to facial recognition.

#### Scenario: Guest reviews a valid reservation
- **WHEN** the guest reaches the reservation confirmation step
- **THEN** the screen SHALL show a concise summary of the reservation and a clear action to continue

### Requirement: Reusable summary visual
The kiosk SHALL use a single reusable visual block for the summary checkpoint instead of requiring room-specific imagery for each reservation.

#### Scenario: Reservation details change
- **WHEN** the reservation changes to a different room or stay
- **THEN** the summary visual SHALL remain reusable and SHALL NOT require a unique room photo

### Requirement: Essential reservation details
The kiosk SHALL display the essential reservation data needed for quick verification, including the primary guest, room, arrival date, departure date, number of nights, and total amount.

#### Scenario: Guest validates the booking
- **WHEN** the reservation confirmation screen is rendered
- **THEN** the guest SHALL be able to verify the core booking details at a glance

### Requirement: Clear continuation path
The kiosk SHALL present a primary action to continue to the next step and a secondary action to go back without changing the kiosk shell.

#### Scenario: Guest confirms the reservation
- **WHEN** the guest taps continue
- **THEN** the kiosk SHALL advance to the next step in the check-in flow

#### Scenario: Guest goes back
- **WHEN** the guest taps back
- **THEN** the kiosk SHALL return to the prior check-in step without changing the header or footer
