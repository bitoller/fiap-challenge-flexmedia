## ADDED Requirements

### Requirement: Realistic mock data fixtures for hotel scenarios
The system SHALL provide mock data representing multiple hotel scenarios to enable development without requiring a running backend.

#### Scenario: Success scenario mock
- **WHEN** mock data is loaded for a valid reservation search
- **THEN** the mock returns a complete reservation object with:
  - Reservation code: "RSV-2026-0001"
  - Guest name: "John Smith"
  - Room number: "501"
  - Check-in/checkout dates
  - Eligible status: true
  - Total amount: realistic price

#### Scenario: Not found scenario mock
- **WHEN** mock data is loaded for an invalid reservation code
- **THEN** the mock returns error: `{ code: "RESERVATION_NOT_FOUND" }`

#### Scenario: Invalid document scenario mock
- **WHEN** mock data is loaded for a guest with document mismatch
- **THEN** the mock returns reservation with `eligible: false` and `eligibilityReasons: ["INVALID_DOCUMENT_TYPE", "DOCUMENT_MISMATCH"]`

#### Scenario: Payment declined scenario mock
- **WHEN** mock data is loaded for payment processing
- **THEN** the mock returns error: `{ code: "PAYMENT_DECLINED", retryable: true }`

### Requirement: Mock data matches domain models
The system SHALL ensure mock data conforms to domain TypeScript types (Reservation, Guest, Room, Session, etc.).

#### Scenario: Type safety
- **WHEN** TypeScript compilation runs
- **THEN** mock data assignments to typed variables compile without errors
- **AND** mock fixtures are in `src/data/repositories/mocks/` as TypeScript constants

### Requirement: Mock data is easily switchable
The system SHALL organize mocks so that switching between scenarios or between API/mocks is simple configuration.

#### Scenario: Mock scenario selection
- **WHEN** environment variable `VITE_MOCK_SCENARIO` is set to "INVALID_DOCUMENT"
- **THEN** the repository uses that mock dataset instead of calling the API

#### Scenario: Mock enable/disable
- **WHEN** environment variable `VITE_USE_MOCKS` is true
- **THEN** all API calls immediately return mock data without attempting network requests
- **WHEN** `VITE_USE_MOCKS` is false
- **THEN** only timeouts trigger fallback to mocks; API is tried first

### Requirement: Mock data includes realistic hotel property details
The system SHALL include realistic details for hotel properties including names, room types, pricing, and dates.

#### Scenario: Hotel property details in mock
- **WHEN** mock reservation is loaded
- **THEN** it includes:
  - Hotel name: "LUXE GRAND HOTEL"
  - Room types: "Suite Deluxe", "Standard Room", etc.
  - Realistic Brazilian Real (BRL) pricing
  - Dates in 2026
