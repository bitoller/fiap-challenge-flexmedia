## ADDED Requirements

### Requirement: The admin portal requires authentication before access
The system SHALL require an administrator to authenticate before viewing any dashboard, management, or test tools in the admin portal.

#### Scenario: Unauthenticated access
- **WHEN** a user opens the admin portal without a valid session
- **THEN** the system SHALL show the admin login screen instead of operational data

#### Scenario: Valid admin login
- **WHEN** a user submits valid administrator credentials
- **THEN** the system SHALL create an authenticated admin session and allow access to the portal

### Requirement: The admin portal remains separate from the kiosk
The system SHALL keep the admin portal unavailable from the guest kiosk routes and navigation.

#### Scenario: Kiosk user opens admin URL
- **WHEN** a user attempts to reach the admin portal from the kiosk experience
- **THEN** the system SHALL treat the admin portal as a separate surface and not expose it through kiosk navigation

#### Scenario: Admin login succeeds
- **WHEN** the administrator enters the portal successfully
- **THEN** the system SHALL present the admin shell instead of the kiosk shell
