## ADDED Requirements

### Requirement: The kiosk loads hotel branding from the admin backend
The kiosk SHALL be able to load the active hotel profile from the admin backend and use that profile to render the hotel name, visual identity, and localized content in the kiosk shell.

#### Scenario: Kiosk starts with hotel profile data
- **WHEN** the kiosk initializes or refreshes its shell configuration
- **THEN** it SHALL request the hotel profile from the backend and render the returned hotel name and branding data

#### Scenario: Hotel profile is available through the gateway
- **WHEN** the admin backend returns hotel profile data through the API gateway
- **THEN** the kiosk SHALL use that data without requiring a frontend rebuild

### Requirement: Branding changes do not reset the guest flow
The kiosk SHALL keep the current guest flow state separate from branding state so that hotel profile refreshes do not erase the active check-in journey.

#### Scenario: Branding data refreshes during the flow
- **WHEN** the kiosk receives updated branding data while a guest is mid-flow
- **THEN** the kiosk SHALL update the visible shell styling and keep the active flow state intact

### Requirement: The kiosk falls back to safe defaults when branding is unavailable
The kiosk SHALL render with safe default branding and copy when the admin backend is unavailable or returns incomplete profile data.

#### Scenario: Admin backend is offline
- **WHEN** the kiosk cannot load hotel branding from the backend
- **THEN** the kiosk SHALL continue rendering with the built-in default branding and the check-in flow SHALL remain usable

#### Scenario: Profile data is partial
- **WHEN** the backend returns only part of the hotel profile
- **THEN** the kiosk SHALL use the returned values where available and keep defaults for missing fields
