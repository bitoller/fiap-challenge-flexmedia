## ADDED Requirements

### Requirement: Shared kiosk recovery screen
The kiosk SHALL render a single shared recovery screen for check-in and check-out error states, using the active locale for all user-facing text.

#### Scenario: Check-in lookup fails
- **WHEN** a check-in search cannot locate a valid reservation
- **THEN** the kiosk SHALL display the shared recovery screen with check-in-appropriate localized title and body text

#### Scenario: Check-out lookup fails
- **WHEN** a check-out lookup cannot locate an active stay
- **THEN** the kiosk SHALL display the shared recovery screen with check-out-appropriate localized title and body text

### Requirement: Generic guest-safe error copy
The kiosk SHALL display guest-safe localized error copy by default and SHALL NOT render raw backend message text as the primary error body unless the message has been explicitly mapped to a localized variant.

#### Scenario: Unknown backend error
- **WHEN** the kiosk receives an unrecognized error code or a message without a localized mapping
- **THEN** the kiosk SHALL display the generic localized recovery title and body for the active flow

#### Scenario: Mapped backend error
- **WHEN** the kiosk receives a recognized recovery code
- **THEN** the kiosk SHALL display the localized title and body associated with that code

### Requirement: Flow-aware retry action
The shared recovery screen SHALL provide a retry action that returns the user to the appropriate step for the current flow.

#### Scenario: Check-in retry
- **WHEN** a user retries after a check-in recovery screen
- **THEN** the kiosk SHALL return the user to the check-in step that can restart the lookup or the closest valid entry point for that recovery code

#### Scenario: Check-out retry
- **WHEN** a user retries after a check-out recovery screen
- **THEN** the kiosk SHALL return the user to the check-out identification step or the closest valid entry point for that recovery code

### Requirement: Consistent kiosk recovery layout
The shared recovery screen SHALL use a centered premium kiosk layout with stable card proportions, localized typography, and a consistent action area across supported locales.

#### Scenario: Locale changes on recovery screen
- **WHEN** the user switches between supported locales
- **THEN** the recovery screen SHALL preserve its layout structure, action order, and button placement

#### Scenario: Vertical kiosk rendering
- **WHEN** the kiosk viewport is in portrait orientation
- **THEN** the recovery screen SHALL remain readable and centered without exposing backend text or overlapping UI
