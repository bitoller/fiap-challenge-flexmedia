# Handoff

## Delivered

- The kiosk check-in identification screen now offers only CPF, reservation number, and QR code.
- The card-based option has been removed from the identification flow.
- QR scanning is wired through `html5-qrcode` and activates the device camera when the QR mode is selected.
- The QR scanner now renders as a single camera surface inside a square frame, which keeps the feed stable and aligned with the kiosk theme.
- The backend reservation lookup contract now accepts `QR_TOKEN` as a search type.
- QR token lookup now accepts either the full reservation code or the numeric reservation token, which makes QR test generation more flexible.
- Recovery and not-found messages now distinguish CPF, reservation number, QR token, and non-eligible reservation states.
- The kiosk UI keeps the vertical totem layout and uses a clearer visual hierarchy for the active lookup area.
- The check-in screen continues to use the hotel branding tokens already centralized in the kiosk shell.
- The check-in flow now renders inside the same `KioskLayout` shell used by home and checkout, so the header, footer, and hotel branding remain consistent across the kiosk.
- The kiosk entry point no longer uses `React.StrictMode`, which avoids duplicate scanner mounts during development.

## Validation

- `mvn test` passed in `backend/services/checkin-service`.
- `mvn test` passed in `backend/services/reservation-service`.
- `npm run build` passed in `frontend/kiosk-web`.

## Notes

- QR token lookup currently resolves through the reservation token flow and is treated by the backend as a reservation-code search path.
- The rest of the check-in journey remains unchanged after successful identification.
- The OpenSpec tasks for this change are fully completed.
