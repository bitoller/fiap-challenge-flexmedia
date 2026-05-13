## ADDED Requirements

### Requirement: Oracle bootstrap uses the new user
The Oracle bootstrap scripts SHALL create and use the database user `rm553134` for local setup and demo execution.

#### Scenario: Empty database is initialized successfully
- **WHEN** the Oracle container starts with an empty data volume
- **THEN** the initialization scripts SHALL create the `rm553134` user and prepare the schema under that user

#### Scenario: Numeric password is accepted by the bootstrap script
- **WHEN** the bootstrap script creates the user with password `060892`
- **THEN** the script SHALL quote the password correctly so Oracle accepts it

### Requirement: Application defaults match the new Oracle user
Backend services SHALL default their Oracle configuration to `rm553134` when the environment does not provide explicit Oracle credentials.

#### Scenario: Local run without overrides
- **WHEN** the backend starts without `ORACLE_USER` in the environment
- **THEN** it SHALL use `rm553134` as the default Oracle user

### Requirement: Schema scripts run under the new schema
The Oracle schema and seed scripts SHALL run successfully inside the `rm553134` schema without depending on the previous user name.

#### Scenario: Setup script runs in the new schema
- **WHEN** `setup_fiap.sql` is executed after bootstrap
- **THEN** the schema and seed scripts SHALL create and populate the database under `rm553134`
