## ADDED Requirements

### Requirement: The admin portal must be hotel-aware
The system SHALL let the administrator choose a hotel context before viewing operational data or performing write actions.

#### Scenario: Hotel context not selected
- **WHEN** the admin portal loads without a selected hotel
- **THEN** the system SHALL prompt the user to choose a hotel before showing scoped metrics or management actions

#### Scenario: Hotel context selected
- **WHEN** the administrator selects a hotel
- **THEN** the system SHALL scope dashboard, reservations, devices, audit, and branding views to that hotel

### Requirement: The admin portal shows operational views for existing backend data
The system SHALL display dashboard, devices, audit, identity, and branding views when the backend provides data for them.

#### Scenario: Backend data exists
- **WHEN** the selected hotel has dashboard, device, audit, identity, or branding records available
- **THEN** the system SHALL render those records in the corresponding admin views

#### Scenario: Backend data is missing
- **WHEN** the selected hotel has no records for a given operational view
- **THEN** the system SHALL show an empty state instead of inventing or duplicating data

### Requirement: The admin portal includes a persistent reservation test area
The system SHALL provide a reservation test area that allows administrators to create and delete reservations for the selected hotel using backend persistence.

#### Scenario: Create a reservation
- **WHEN** the administrator submits a valid reservation test form
- **THEN** the system SHALL persist the reservation in the backend for the selected hotel

#### Scenario: Delete a reservation
- **WHEN** the administrator deletes a previously created test reservation
- **THEN** the system SHALL remove that reservation through the backend so the change remains reflected after reloads

### Requirement: The admin portal keeps reservation tools scoped to the selected hotel
The system SHALL ensure reservation test and management actions do not cross hotel boundaries.

#### Scenario: Different hotel selected
- **WHEN** the administrator switches to another hotel
- **THEN** the system SHALL show only reservations and metrics for that hotel

#### Scenario: Cross-hotel access attempt
- **WHEN** a user attempts to view or modify a reservation outside the selected hotel
- **THEN** the system SHALL reject the action or present no matching records
