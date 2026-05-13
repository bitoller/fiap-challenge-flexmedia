## ADDED Requirements

### Requirement: HTTP client wraps fetch with correlation ID
The system SHALL implement an HTTP client that automatically injects an `X-Correlation-Id` header into all requests for traceability.

#### Scenario: Correlation ID injection
- **WHEN** the API client makes a request
- **THEN** a UUID is generated and included as `X-Correlation-Id` header
- **AND** the same correlation ID is used for all related requests in a session

### Requirement: API client handles errors gracefully
The system SHALL catch API errors, parse error responses, and throw descriptive error messages.

#### Scenario: API error response
- **WHEN** the API returns a 4xx or 5xx error with body `{ code, message, details }`
- **THEN** the client extracts the message and throws an Error with that message
- **AND** the component receives a user-friendly error message

#### Scenario: Network error
- **WHEN** the network request fails (timeout, connection refused, etc.)
- **THEN** the client catches the error and returns a descriptive message
- **AND** the fallback to mocks is triggered

### Requirement: 10-second timeout with mock fallback
The system SHALL set a 10-second timeout on all API requests. If timeout is exceeded, the system SHALL fall back to mock data without user disruption.

#### Scenario: Successful request within timeout
- **WHEN** API responds within 10 seconds
- **THEN** the response data is used (no fallback to mocks)

#### Scenario: Request timeout triggers mock fallback
- **WHEN** API request exceeds 10 seconds
- **THEN** the system automatically cancels the request
- **AND** mock data is returned to the component
- **AND** a warning is logged (optional notification to user: "Using cached data")

#### Scenario: Subsequent request after timeout
- **WHEN** a new request is made after a timeout
- **THEN** the system attempts the API again (no permanent fallback)

### Requirement: API endpoints defined as constants
The system SHALL define API endpoint paths as constants to avoid magic strings.

#### Scenario: Endpoint constants
- **WHEN** code needs to reference the check-in sessions endpoint
- **THEN** it uses `API_ENDPOINTS.CHECKIN_SESSIONS` (value: `/checkin-sessions`)
- **AND** all endpoints are defined in `src/data/api/endpoints.ts`

### Requirement: API client supports common HTTP methods
The system SHALL support GET, POST, PUT, PATCH, DELETE operations.

#### Scenario: POST request
- **WHEN** creating a new session via `api.createSession(flowType)`
- **THEN** a POST request is made to `/checkin-sessions` with JSON body
- **AND** the response is parsed and returned

### Requirement: Content-Type header automatic injection
The system SHALL automatically set `Content-Type: application/json` for all requests.

#### Scenario: Headers injection
- **WHEN** any request is made
- **THEN** headers include `Content-Type: application/json` by default
- **AND** custom headers can be added/overridden
