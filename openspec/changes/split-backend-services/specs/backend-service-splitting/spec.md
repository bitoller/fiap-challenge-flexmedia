## ADDED Requirements

### Requirement: Service ownership by domain
The backend SHALL separate business responsibilities into domain-focused services so that reservation, check-in orchestration, payment, key issuance, notification, device, identity, biometry, and PMS concerns are not implemented as unrelated features inside a single service.

#### Scenario: Reservation lookup is owned by reservation-service
- **WHEN** a client searches for a reservation by code or document
- **THEN** the request SHALL be handled by `reservation-service`

#### Scenario: Check-in orchestration remains in checkin-service
- **WHEN** a client starts or advances a check-in session
- **THEN** the request SHALL be handled by `checkin-service`

### Requirement: Public routing through the API gateway
The API gateway SHALL route public requests to the correct backend service based on the request path and service boundary.

#### Scenario: Reservation traffic is routed to reservation-service
- **WHEN** the client calls the reservation search endpoint through the gateway
- **THEN** the gateway SHALL forward the request to `reservation-service`

#### Scenario: Check-in traffic is routed to checkin-service
- **WHEN** the client calls a check-in session endpoint through the gateway
- **THEN** the gateway SHALL forward the request to `checkin-service`

### Requirement: Service-level MVC structure
Each backend service SHALL organize its code with a presentation layer, an application layer, and an infrastructure layer so controllers stay thin, business rules stay centralized, and persistence stays isolated.

#### Scenario: A request is handled in MVC order
- **WHEN** a service receives a REST request
- **THEN** the controller SHALL delegate to an application service and the application service SHALL delegate to a repository or adapter only when needed

### Requirement: Service-owned persistence
Each backend service SHALL own its persistence access and SHALL NOT depend on another service's repository implementation or internal persistence classes.

#### Scenario: Payment writes stay inside payment-service
- **WHEN** a payment authorization or capture is stored
- **THEN** only `payment-service` persistence components SHALL write that data

#### Scenario: Reservation data is not read through checkin-service repositories
- **WHEN** a service needs reservation data
- **THEN** it SHALL call `reservation-service` or its public contract instead of importing its repositories directly
