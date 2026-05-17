## ADDED Requirements

### Requirement: Oracle bootstrap uses the new user
The Oracle bootstrap scripts SHALL create and use a local application schema for local setup and demo execution.

#### Scenario: Empty database is initialized successfully
- **WHEN** the Oracle container starts with an empty data volume
- **THEN** the initialization scripts SHALL create the application user and prepare the schema under that user

#### Scenario: Numeric password is accepted by the bootstrap script
- **WHEN** the bootstrap script creates the local application user with a placeholder password
- **THEN** the script SHALL quote the password correctly so Oracle accepts it

### Requirement: Application defaults match the new Oracle user
Backend services SHALL require explicit Oracle credentials from the environment.

#### Scenario: Local run without overrides
- **WHEN** the backend starts without `ORACLE_USER` in the environment
- **THEN** it SHALL read the Oracle user from the configured environment

### Requirement: Schema scripts run under the new schema
The Oracle schema and seed scripts SHALL run successfully inside the configured schema without depending on a personal user name.

#### Scenario: Setup script runs in the new schema
- **WHEN** `setup_fiap.sql` is executed after bootstrap
- **THEN** the schema and seed scripts SHALL create and populate the database under the configured application schema
