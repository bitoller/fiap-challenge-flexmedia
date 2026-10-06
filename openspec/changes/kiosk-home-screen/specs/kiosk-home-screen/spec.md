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

### Requirement: Guest service requests reach hotel operations
The system SHALL submit Housekeeping, Amenities, Dining, and Concierge requests to the backend and SHALL only display a success state after the backend accepts the request.

#### Scenario: Successful service request
- **WHEN** a guest confirms a service request
- **THEN** the kiosk sends the hotel ID, kiosk ID, service type, and current route to `/api/v1/guest-service-requests`
- **AND** the backend records a correlated `GUEST_SERVICE_REQUESTED` audit event
- **AND** the admin dashboard includes the request in its open support count
- **AND** the admin audit trail identifies the requested service type

#### Scenario: Service request submission fails
- **WHEN** the backend cannot accept a service request
- **THEN** the kiosk keeps the request unconfirmed
- **AND** the kiosk displays a localized retry message

#### Scenario: Administrator acknowledges requests
- **WHEN** an administrator acknowledges open support requests for a hotel
- **THEN** both current guest-service requests and legacy concierge requests are marked acknowledged
- **AND** acknowledged requests are no longer included in the open support count

### Requirement: Services supports interactive discovery and wayfinding
The system SHALL let guests select a stay intent, receive a contextual hotel recommendation, and open an active route to the recommended destination.

#### Scenario: Guest selects a stay mood
- **WHEN** a guest selects Unwind, Taste, Move, or Discover
- **THEN** the recommendation title, description, destination, and travel time update immediately
- **AND** the selected mood has a visible and accessible pressed state

#### Scenario: Guest builds a recommended route
- **WHEN** a guest activates the recommendation route
- **THEN** the hotel map opens with the matching destination selected
- **AND** an animated route from reception is displayed
- **AND** the route status names the destination and estimated travel time

#### Scenario: Guest changes map destination
- **WHEN** a guest selects another map destination
- **THEN** the detail panel updates for that destination
- **AND** route highlighting returns to an inactive state until explicitly requested

### Requirement: Admin audit uses human-readable operational language
The system SHALL localize audit actions and statuses and SHALL not display internal route or query-string values as primary admin copy.

#### Scenario: Service request appears in audit
- **WHEN** an administrator views a guest-service audit entry
- **THEN** the action, service type, status, and kiosk source are human-readable in the selected language
- **AND** internal paths such as `/services?verification=backend` are not repeated in the visible description

### Requirement: Hotel map provides detailed, accessible orientation
The system SHALL preserve the established clean map zones, route paths, and route animation while providing enough written context for guests to understand destinations and floor changes.

#### Scenario: Guest orients on the hotel map
- **WHEN** a guest opens the hotel map
- **THEN** destination markers and labels remain visually dominant over the abstract hotel zones
- **AND** decorative floor-plan illustrations do not compete with the route network
- **AND** a legend distinguishes the guest location, destination, and route

#### Scenario: Guest reviews destination directions
- **WHEN** a guest selects a destination
- **THEN** the detail panel shows its floor journey and destination-specific steps
- **AND** step-free route availability is stated
- **AND** selecting a different destination replaces the journey and directions without automatically activating a route

#### Scenario: Guest activates a detailed route
- **WHEN** a guest activates route guidance
- **THEN** the previously established route geometry and animation are used
- **AND** the destination-specific directions remain visible alongside the active route status
