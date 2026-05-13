## ADDED Requirements

### Requirement: Checkout begins with stay identification
The kiosk SHALL present a checkout identification screen that collects the room number and guest document needed to locate the active stay.

#### Scenario: Guest starts checkout
- **WHEN** the guest selects the check-out action from the kiosk home screen
- **THEN** the kiosk SHALL show the checkout identification screen with room and document inputs

#### Scenario: Guest submits identification data
- **WHEN** the guest confirms a room number and guest document
- **THEN** the kiosk SHALL request the active stay lookup before advancing to the next checkout step

### Requirement: Checkout shows a bill summary before settlement
The kiosk SHALL present a bill summary screen that shows the stay details, the total due, and any itemized charges returned by the backend.

#### Scenario: Stay lookup succeeds
- **WHEN** the backend returns an active stay preview
- **THEN** the kiosk SHALL render the bill summary screen with the returned stay and charge details

#### Scenario: Itemized charges are available
- **WHEN** the backend includes line items in the checkout preview
- **THEN** the kiosk SHALL display those line items in the summary instead of replacing them with hard-coded frontend values

### Requirement: Checkout supports reconciliation and human assistance
The kiosk SHALL present a reconciliation step that lets the guest ask for concierge help or continue with the checkout if the bill needs review.

#### Scenario: Guest questions a charge
- **WHEN** the guest indicates that the summary needs support or correction
- **THEN** the kiosk SHALL show the reconciliation screen with concierge assistance actions

#### Scenario: Guest chooses to continue
- **WHEN** the guest elects to proceed after reviewing the bill
- **THEN** the kiosk SHALL continue to the payment step without losing the active checkout state

### Requirement: Checkout can collect payment method and finalize the stay
The kiosk SHALL let the guest choose a payment method, persist that choice for the active checkout flow, and submit the final settlement request to the backend.

#### Scenario: Guest selects a payment method
- **WHEN** the guest chooses card or PIX on the payment screen
- **THEN** the kiosk SHALL preserve that choice and use it when the checkout is finalized

#### Scenario: Guest confirms payment
- **WHEN** the guest confirms the payment step
- **THEN** the kiosk SHALL submit the checkout request to the backend and wait for the settlement response before advancing

### Requirement: Checkout ends with receipt and session closeout
The kiosk SHALL show a receipt or thank-you screen after successful checkout and SHALL provide a clear action to return to the kiosk start.

#### Scenario: Checkout completes successfully
- **WHEN** the backend returns a successful checkout response
- **THEN** the kiosk SHALL show the checkout receipt and final thank-you state

#### Scenario: Guest leaves the receipt screen
- **WHEN** the guest finishes the checkout flow
- **THEN** the kiosk SHALL clear the transient checkout state and return to the kiosk home screen

### Requirement: Checkout recovery states remain explicit
The kiosk SHALL present dedicated recovery states for lookup failures and payment declines so the guest can retry or request help without breaking the flow.

#### Scenario: Stay lookup fails
- **WHEN** the backend cannot locate an active stay for the provided identification data
- **THEN** the kiosk SHALL show a calm recovery screen with retry and concierge actions

#### Scenario: Payment is declined
- **WHEN** the backend or checkout flow rejects the payment
- **THEN** the kiosk SHALL show a payment-recovery state and preserve the path back to the payment step
