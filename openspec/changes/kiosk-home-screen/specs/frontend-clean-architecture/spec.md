## ADDED Requirements

### Requirement: Frontend organized in clean architecture layers
The system SHALL organize frontend code into distinct layers: domain (models, types), data (API client, repositories, mocks), and presentation (components, pages, hooks).

#### Scenario: Directory structure creation
- **WHEN** the frontend project is initialized
- **THEN** the following directory structure exists:
  - `src/domain/` for models and types
  - `src/data/api/` for API client and endpoints
  - `src/data/repositories/` for repository classes
  - `src/data/repositories/mocks/` for mock data
  - `src/presentation/components/` for React components
  - `src/presentation/features/` for feature-specific screens and logic

#### Scenario: Clean dependency flow
- **WHEN** a component needs data
- **THEN** it uses a hook (e.g., `useApi()`) which calls a repository (e.g., `checkinRepository`)
- **AND** the repository calls the API client with fallback to mocks
- **AND** all types flow from `domain/` models

### Requirement: Domain layer defines core types
The system SHALL define domain models (Reservation, Guest, Session, Room, etc.) as TypeScript types, independent of framework concerns.

#### Scenario: Domain types are exported
- **WHEN** other layers need to work with reservations
- **THEN** they import from `domain/models/Reservation.ts`
- **AND** the type includes properties: id, code, status, hotelName, arrivalDate, departureDate, totalAmount, eligible

### Requirement: Repository pattern abstracts API and mocks
The system SHALL use repository pattern to abstract data access, allowing seamless switching between API and mock data.

#### Scenario: Successful API response
- **WHEN** `reservationRepository.searchByCode()` is called and API is reachable
- **THEN** the API response is returned as a domain model

#### Scenario: API timeout falls back to mock
- **WHEN** the API request takes longer than 10 seconds
- **THEN** the system automatically returns mock data from the repository
- **AND** a warning is logged (optional user notification)

### Requirement: Presentation layer uses custom hooks for state
The system SHALL use React hooks (useState, useContext) for state management, avoiding global state libraries initially.

#### Scenario: useLanguage hook
- **WHEN** a component calls `useLanguage()`
- **THEN** it receives current language, a setter function, and language persists to localStorage

#### Scenario: useApi hook
- **WHEN** a component calls `useApi(apiCall)`
- **THEN** it receives loading, error, and data states with automatic error handling
