## ADDED Requirements

### Requirement: Admin hotel profile changes must persist in Oracle
The system SHALL store hotel profile, branding, and content changes in Oracle so the admin portal can reload them after a restart.

#### Scenario: Update branding
- **WHEN** an administrator saves new branding values for a hotel
- **THEN** the system SHALL persist those values in Oracle and return the saved profile

#### Scenario: Update content
- **WHEN** an administrator saves new hotel content values
- **THEN** the system SHALL persist those values in Oracle and return the saved profile

#### Scenario: Reload after restart
- **WHEN** the admin service restarts
- **THEN** the system SHALL reload the last saved hotel profile from Oracle instead of falling back to volatile memory

### Requirement: Admin audit history must persist in Oracle
The system SHALL record admin audit events in Oracle so operational history survives restarts and can be queried by hotel.

#### Scenario: Record an audit event
- **WHEN** the admin portal or backend records an audit event
- **THEN** the system SHALL store that event in Oracle

#### Scenario: Query audit history
- **WHEN** the administrator opens the audit view for a hotel
- **THEN** the system SHALL return only the Oracle-backed audit events for that hotel

### Requirement: Admin dashboard metrics must be derived from persisted data
The system SHALL calculate dashboard metrics from persisted Oracle data and live device status instead of a local in-memory snapshot.

#### Scenario: Dashboard loads for a hotel
- **WHEN** the administrator selects a hotel
- **THEN** the dashboard SHALL aggregate metrics from persisted reservation, stay, and audit data for that hotel

#### Scenario: Dashboard reloads after restart
- **WHEN** the admin service restarts
- **THEN** the dashboard SHALL continue showing the same persisted metrics for the selected hotel

### Requirement: Admin persistence must remain hotel-scoped
The system SHALL prevent admin updates and views from crossing hotel boundaries.

#### Scenario: Different hotel selected
- **WHEN** the administrator switches to another hotel
- **THEN** the system SHALL show the Oracle-backed data only for that hotel

#### Scenario: Cross-hotel update attempt
- **WHEN** a write request targets a hotel outside the selected hotel context
- **THEN** the system SHALL reject the request or return no matching record
