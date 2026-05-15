## NEW Requirements

### Requirement: Refined identification hierarchy
The kiosk identification screen SHALL present CPF, reservation number, and QR code as the only supported identification modes for the check-in step.

#### Scenario: Guest opens the identification screen
- **WHEN** the guest enters the check-in identification step
- **THEN** the screen presents the three supported modes in a clear, kiosk-friendly layout
- **AND** the active lookup area is visually emphasized as the primary interaction zone

### Requirement: Consistent iconography
The kiosk identification screen SHALL use a consistent icon style for the method cards, action buttons, and clear/backspace control.

#### Scenario: Guest views the keypad
- **WHEN** the guest sees the numeric keypad
- **THEN** the clear/backspace control uses a standard and readable icon
- **AND** the icon styling matches the rest of the screen

### Requirement: QR scanner visual integration
The QR scanner SHALL remain a square kiosk-oriented surface and integrate visually with the identification layout.

#### Scenario: Guest selects QR code mode
- **WHEN** the guest activates QR code identification
- **THEN** the camera area appears as part of the same screen composition
- **AND** the scanner frame remains aligned with the kiosk palette and vertical layout

### Requirement: Shell preservation
The identification screen SHALL continue to use the shared kiosk shell, including the existing header, footer, and hotel branding source.

#### Scenario: Guest navigates across kiosk pages
- **WHEN** the guest moves between home, check-in, and checkout
- **THEN** the header, footer, and hotel identity remain visually consistent
- **AND** this change does not introduce a separate shell for the identification screen
