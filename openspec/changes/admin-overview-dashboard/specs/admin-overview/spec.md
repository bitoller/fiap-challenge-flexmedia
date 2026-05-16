## ADDED Requirements

### Requirement: The admin overview must present hotel-scoped operational summaries
The system SHALL render the overview page using the selected hotel context and the dashboard data returned by the backend.

#### Scenario: Hotel selected
- **WHEN** an administrator opens the overview with a selected hotel
- **THEN** the system SHALL show that hotel's KPI cards, health summary, and live activity sections

#### Scenario: Hotel switched
- **WHEN** the administrator switches to another hotel
- **THEN** the system SHALL refresh the overview content for the new hotel context

### Requirement: The admin overview must show the core operational signals first
The system SHALL prioritize the most important operational signals in the overview layout before secondary details.

#### Scenario: Overview loads successfully
- **WHEN** dashboard data is available
- **THEN** the system SHALL present summary metrics, system health, live activity, and unit-level performance in a clear hierarchy

#### Scenario: Secondary sections are unavailable
- **WHEN** some secondary data is missing
- **THEN** the system SHALL keep the primary KPI and health sections visible and use empty states for the missing sections

### Requirement: The admin overview must render human-readable activity
The system SHALL transform dashboard activity data into readable operational entries instead of raw JSON payloads.

#### Scenario: Recent sessions exist
- **WHEN** the backend returns recent session or activity data
- **THEN** the system SHALL display each item with a label, timestamp, and concise summary

#### Scenario: Activity data is missing
- **WHEN** no activity data exists for the selected hotel
- **THEN** the system SHALL show an intentional empty state instead of a blank or raw technical view

### Requirement: The admin overview must remain usable while data loads or fails
The system SHALL show intentional loading and error states on the overview page.

#### Scenario: Data is loading
- **WHEN** the overview data is being refreshed
- **THEN** the system SHALL indicate loading without breaking the page layout

#### Scenario: Data fetch fails
- **WHEN** the backend request fails
- **THEN** the system SHALL show a clear error state and preserve the rest of the portal shell
