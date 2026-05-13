## 1. Foundation

- [x] 1.1 Create the new check-in flow feature structure under presentation, data, and domain layers.
- [x] 1.2 Add route definitions for the identification, not-found, and confirmation screens.
- [x] 1.3 Add typed data adapters for reservation search and check-in session handoff using the existing API gateway.

## 2. Identification Screen

- [x] 2.1 Build the portrait kiosk shell for the identification screen with the branded header, step indicator, and bottom navigation.
- [x] 2.2 Implement the method cards and the CPF/reservation code input mode selection.
- [x] 2.3 Implement the numeric keypad, input state, delete action, and submit action.
- [x] 2.4 Wire the identification submit flow to the reservation search endpoint and session creation endpoint.

## 3. Recovery And Confirmation

- [x] 3.1 Build the reservation-not-found screen with retry and reception fallback actions.
- [x] 3.2 Map backend lookup failures to the dedicated error screen and preserve a clean retry path.
- [x] 3.3 Build the reservation confirmation screen with guest, stay, room, and price summary blocks.
- [x] 3.4 Wire the success path so a found reservation is attached to the created session before confirmation is shown.

## 4. Polish And Validation

- [x] 4.1 Add and update translations for the new flow screens and button labels.
- [x] 4.2 Apply the portrait kiosk styling, including spacing, typography, and card proportions from the reference images.
- [x] 4.3 Validate the flow in the running frontend against the backend contracts and adjust any data mapping gaps.
