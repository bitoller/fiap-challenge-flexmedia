## ADDED Requirements

### Requirement: Payment Summary Step
The kiosk SHALL show a payment step after add-on selection that summarizes reservation base amount, selected services amount, and final amount before completing check-in.

#### Scenario: Guest reviews final amount
- **GIVEN** a guest has selected or skipped add-ons
- **WHEN** the guest reaches payment
- **THEN** the kiosk displays the financial summary and available payment methods

### Requirement: Payment Processing Feedback
The kiosk SHALL show visible processing feedback while the existing check-in completion request is in progress.

#### Scenario: Guest confirms payment
- **GIVEN** the guest selected a payment method
- **WHEN** the guest confirms payment
- **THEN** the kiosk shows that payment and room access are being prepared until the request completes

### Requirement: Access Completion Screen
The kiosk SHALL explain the assigned room, facial room access, and physical card fallback after check-in completion.

#### Scenario: Check-in completes
- **GIVEN** the backend completed check-in successfully
- **WHEN** the guest reaches the completion screen
- **THEN** the kiosk displays room assignment, facial access readiness, physical card fallback, and an option to end the session
