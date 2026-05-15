## ADDED Requirements

### Requirement: Kiosk identification screen focuses on reservation lookup
The kiosk SHALL present an identification screen that prioritizes reservation lookup and includes CPF, reservation number, and QR code as the supported identification modes.

#### Scenario: Guest chooses a supported identification mode
- **WHEN** the guest opens the check-in identification screen
- **THEN** the kiosk SHALL present CPF, reservation number, and QR code options
- **AND** the kiosk SHALL NOT present a card-based identification option

### Requirement: CPF lookup is hotel-scoped
The kiosk SHALL allow the guest to enter a CPF and SHALL search for an open reservation that belongs to the active hotel.

#### Scenario: CPF finds an eligible reservation
- **WHEN** the guest enters a valid CPF for an open reservation in the active hotel
- **THEN** the kiosk SHALL locate the reservation
- **AND** the kiosk SHALL continue the check-in flow

#### Scenario: CPF does not match an open reservation
- **WHEN** the guest enters a CPF that does not match an open reservation in the active hotel
- **THEN** the kiosk SHALL route the guest to the recovery screen
- **AND** the kiosk SHALL show a clear reservation-not-found message

### Requirement: Reservation number lookup is hotel-scoped
The kiosk SHALL allow the guest to enter a reservation number and SHALL search for an open reservation that belongs to the active hotel.

#### Scenario: Reservation number finds an eligible reservation
- **WHEN** the guest enters a valid reservation number for an open reservation in the active hotel
- **THEN** the kiosk SHALL locate the reservation
- **AND** the kiosk SHALL continue the check-in flow

#### Scenario: Reservation number does not match an open reservation
- **WHEN** the guest enters a reservation number that does not match an open reservation in the active hotel
- **THEN** the kiosk SHALL route the guest to the recovery screen
- **AND** the kiosk SHALL show a clear reservation-not-found message

### Requirement: QR code lookup validates a reservation token
The kiosk SHALL allow the guest to scan a QR code and SHALL resolve the scanned token into a reservation lookup request.

#### Scenario: QR code resolves to an open reservation
- **WHEN** the kiosk scans a QR token that maps to an open reservation in the active hotel
- **THEN** the kiosk SHALL locate the reservation
- **AND** the kiosk SHALL continue the check-in flow

#### Scenario: QR code token is invalid or expired
- **WHEN** the kiosk scans a QR token that does not map to an open reservation
- **THEN** the kiosk SHALL route the guest to the recovery screen
- **AND** the kiosk SHALL show a clear lookup failure message

### Requirement: Identification flow remains visually optimized for the totem
The kiosk identification screen SHALL preserve the vertical totem layout and SHALL use a simplified visual hierarchy that emphasizes the active lookup field and the supported modes.

#### Scenario: Guest views the identification screen on the kiosk
- **WHEN** the identification screen loads
- **THEN** the layout SHALL remain vertical and kiosk-friendly
- **AND** the active lookup area SHALL be visually emphasized over inactive or unsupported options

### Requirement: Recovery messaging must remain clear and guest-friendly
The kiosk SHALL show a clear, guest-friendly error message when reservation lookup fails, regardless of whether the failure is caused by missing data, an invalid token, or a non-eligible reservation.

#### Scenario: Lookup fails for any reason
- **WHEN** the kiosk cannot complete the reservation lookup
- **THEN** the kiosk SHALL route the guest to a recovery state
- **AND** the message SHALL explain the situation in plain language without exposing internal implementation details
