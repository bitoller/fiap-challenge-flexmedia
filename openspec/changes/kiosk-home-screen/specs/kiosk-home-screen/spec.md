## ADDED Requirements

### Requirement: Home screen displays hotel branding and welcome message
The system SHALL display the hotel name "LUXE GRAND HOTEL" in the header and a "Welcome Home" message with subtitle "SELECT AN OPTION TO BEGIN" on the home screen.

#### Scenario: Initial page load
- **WHEN** user navigates to the home screen
- **THEN** the header displays "LUXE GRAND HOTEL" with professional hotel branding
- **AND** the main content displays "Welcome Home" and subtitle text

### Requirement: Home screen displays three action buttons
The system SHALL display three equally-sized, accessible buttons for Check-in, Check-out, and Services flows. Each button SHALL include an icon and descriptive text.

#### Scenario: Button layout
- **WHEN** user views the home screen
- **THEN** three buttons are displayed vertically in a column
- **AND** each button contains an icon (🔑 for check-in, 📋 for check-out, 🔔 for services)
- **AND** each button displays title text ("Check-in", "Check-out", "Services") and subtitle text

#### Scenario: Check-in button click
- **WHEN** user clicks the Check-in button
- **THEN** the system navigates to the check-in flow

#### Scenario: Check-out button click
- **WHEN** user clicks the Check-out button
- **THEN** the system navigates to the check-out flow

#### Scenario: Services button click
- **WHEN** user clicks the Services button
- **THEN** the system navigates to the services flow

### Requirement: Language selector in header
The system SHALL display language selection options (EN, PT, ES) in the top-right corner of the header as toggle buttons.

#### Scenario: Language selector visibility
- **WHEN** user views the home screen
- **THEN** three language options are visible in the header: "EN", "PT", "ES"
- **AND** the currently selected language is highlighted/indicated

#### Scenario: Language change triggers re-render
- **WHEN** user clicks a different language button
- **THEN** the entire page content updates to the selected language
- **AND** the selection is persisted to localStorage

### Requirement: Footer displays legal information
The system SHALL display a footer with copyright notice and links to privacy policy and contact information.

#### Scenario: Footer display
- **WHEN** user views the home screen
- **THEN** a footer is visible at the bottom displaying "© 2024 LUXE HOTEL GROUP"
- **AND** footer includes links to "Privacy Policy" and "Contact" (not yet clickable, placeholder)

### Requirement: Responsive vertical layout for kiosk
The system SHALL optimize the layout for vertical/portrait orientation with appropriate spacing and touch targets for kiosk use.

#### Scenario: Vertical aspect ratio
- **WHEN** the kiosk displays at 16:9 portrait orientation (or similar vertical format)
- **THEN** all content is readable without horizontal scrolling
- **AND** buttons have sufficient spacing (minimum 50px) for touch interaction
- **AND** fonts are readable from 1-2 meters away

### Requirement: Color scheme reflects luxury hotel branding
The system SHALL use warm, elegant colors derived from the provided hotel branding image (gold/tan, dark brown, off-white backgrounds).

#### Scenario: Color application
- **WHEN** user views the home screen
- **THEN** the background uses off-white/cream tones
- **AND** buttons use warm gold/tan borders and text
- **AND** the header uses dark brown for text
- **AND** the overall appearance matches luxury hotel aesthetic
