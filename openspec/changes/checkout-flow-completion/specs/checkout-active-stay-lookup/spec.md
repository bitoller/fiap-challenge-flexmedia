## ADDED Requirements

### Requirement: The backend can locate an active stay for checkout
The backend SHALL provide a lookup contract that finds an active stay using hotel scope, room number, and guest document data.

#### Scenario: Matching stay exists
- **WHEN** the kiosk sends the hotel identifier, room number, and guest document values
- **THEN** the backend SHALL return the active stay associated with those inputs

#### Scenario: Wrong hotel or room is provided
- **WHEN** the kiosk sends identification data that does not match an active stay in the specified hotel
- **THEN** the backend SHALL return a not-found style failure instead of exposing stays from another hotel

### Requirement: The lookup response includes the data needed for checkout review
The backend SHALL return a checkout preview with the stay, reservation, guest, room, and charge data required by the kiosk bill summary screen.

#### Scenario: Lookup succeeds
- **WHEN** the active stay is found
- **THEN** the backend SHALL return the stay identifier, reservation details, guest details, room details, total due, and any available charge breakdown

#### Scenario: Charge breakdown is available
- **WHEN** the backend has itemized billing data for the stay
- **THEN** the lookup response SHALL include those line items so the kiosk can render them without duplicating billing logic in the frontend

### Requirement: Only active stays can be checked out
The backend SHALL reject checkout lookup attempts for stays that are already checked out or otherwise inactive.

#### Scenario: Stay is already closed
- **WHEN** the kiosk attempts to look up a stay that is not active anymore
- **THEN** the backend SHALL reject the lookup and prevent the kiosk from reaching the settlement screen

#### Scenario: Stay is active
- **WHEN** the kiosk looks up a stay that is still active
- **THEN** the backend SHALL allow the kiosk to continue to the checkout summary and settlement flow

### Requirement: Checkout settlement remains available through the existing checkout endpoint
The backend SHALL keep the final checkout settlement contract available so the kiosk can complete payment and close the stay after a successful lookup.

#### Scenario: Kiosk confirms settlement
- **WHEN** the guest finalizes checkout after a successful lookup
- **THEN** the backend SHALL accept the existing checkout request and complete the stay closure process

#### Scenario: Settlement completes
- **WHEN** the checkout request is approved
- **THEN** the backend SHALL return the settled stay details and receipt reference needed by the kiosk
