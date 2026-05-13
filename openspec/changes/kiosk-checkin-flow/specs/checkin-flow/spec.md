## ADDED Requirements

### Requirement: Check-in entry from home
The system MUST allow the guest to start the check-in journey from the kiosk home screen and navigate to the identification screen without leaving the frontend flow.

#### Scenario: User selects check-in on home
- **WHEN** the guest taps the check-in action on the home screen
- **THEN** the system SHALL open the identification screen as the first step of the check-in flow

### Requirement: Identification screen matches the kiosk design
The system MUST render the identification screen in a portrait kiosk layout that preserves the branded shell, step indicator, hotel name, language controls, identification cards, CPF input area, numeric keypad, and bottom navigation shown in the reference design.

#### Scenario: Identification screen loads
- **WHEN** the identification route is opened
- **THEN** the system SHALL display the branded kiosk shell and the identification layout without requiring backend data to render the page

### Requirement: Reservation lookup uses the existing backend contract
The system MUST allow the guest to search for a reservation using the existing `/api/v1/reservations/search` contract and MUST map the selected identification method to the search type sent to the backend.

#### Scenario: CPF lookup succeeds
- **WHEN** the guest enters a CPF and submits the search
- **THEN** the system SHALL request the reservation search endpoint with the CPF search type and move to the reservation confirmation flow when a reservation is returned

#### Scenario: Reservation code lookup succeeds
- **WHEN** the guest enters a reservation code and submits the search
- **THEN** the system SHALL request the reservation search endpoint with the reservation-code search type and move to the reservation confirmation flow when a reservation is returned

### Requirement: Not-found and recoverable errors show the dedicated error state
The system MUST display a reservation-not-found screen when the backend returns `RESERVATION_NOT_FOUND` or an equivalent 404 response, and the screen MUST provide retry and reception fallback actions.

#### Scenario: Reservation is not found
- **WHEN** the backend returns `RESERVATION_NOT_FOUND`
- **THEN** the system SHALL show the reservation-not-found screen with the error message, a retry action, and a reception action

#### Scenario: User retries after a failed search
- **WHEN** the guest selects retry from the error screen
- **THEN** the system SHALL return to the identification screen and allow a new search

### Requirement: Reservation confirmation shows the fetched stay summary
The system MUST display a reservation confirmation screen using the reservation data returned by the backend, including guest, stay, room, dates, and total amount, and MUST preserve the kiosk styling used across the flow.

#### Scenario: Reservation is confirmed
- **WHEN** the backend returns a reservation and the flow is ready to continue
- **THEN** the system SHALL render the confirmation screen with the stay summary and the primary confirmation action

### Requirement: Flow state is managed without backend changes
The system MUST orchestrate the flow state in the frontend and MUST reuse the existing backend endpoints for session creation, reservation attachment, and lookup without changing the backend service contracts.

#### Scenario: Flow advances after lookup
- **WHEN** the guest completes a successful lookup
- **THEN** the system SHALL keep the flow data in the frontend and use the existing API contracts to continue the journey
