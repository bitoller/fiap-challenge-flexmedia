## ADDED Requirements

### Requirement: Root Maven aggregation
The repository SHALL provide a root Maven aggregator that centralizes shared build metadata while keeping each service module buildable on its own.

#### Scenario: Build from the project root
- **WHEN** a developer runs the Maven build from the repository root
- **THEN** Maven SHALL resolve the backend service modules through the root aggregator without requiring the module POMs to be removed

#### Scenario: Build an individual service
- **WHEN** a developer runs a build for a single backend service module
- **THEN** that module SHALL still build independently using its own `pom.xml`

### Requirement: Shared dependency normalization
The backend service POM files SHALL use centralized version management for shared dependencies such as the Oracle JDBC driver and test libraries.

#### Scenario: Oracle driver version is managed centrally
- **WHEN** a service declares the Oracle JDBC dependency
- **THEN** the service SHALL inherit the version from shared build management instead of repeating the version locally

#### Scenario: Test dependency alignment
- **WHEN** a service adds test support
- **THEN** the service SHALL use the shared test dependency versioning defined by the root build

### Requirement: Stable runtime behavior
Project cleanup SHALL NOT change the observed behavior of the kiosk, admin portal, or Oracle-backed persistence flows.

#### Scenario: Existing flows remain functional
- **WHEN** the kiosk performs check-in or check-out against Oracle
- **THEN** the flow SHALL continue to persist and read the expected operational records

#### Scenario: Admin behavior remains consistent
- **WHEN** the admin portal loads dashboards, hotels, or reservation test data
- **THEN** the portal SHALL continue to read and write the same Oracle-backed data without introducing new fallback behavior
