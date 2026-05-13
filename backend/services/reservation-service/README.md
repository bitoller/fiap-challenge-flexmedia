# reservation-service

Reservation service for FlexCheck.

## Status

Implemented as an independent JDBC service.

## Responsibilities

- Search reservations by code, document, e-mail, or kiosk.
- List reservations by hotel.
- Create persistent test reservations for a selected hotel.
- Delete persistent test reservations by hotel and reservation id.
- Confirm guest details during check-in.

## Endpoints

- `GET /api/v1/reservations/search`
- `GET /api/v1/reservations/{reservationId}`
- `GET /api/v1/reservations/hotels/{hotelId}`
- `POST /api/v1/reservations/hotels/{hotelId}`
- `DELETE /api/v1/reservations/hotels/{hotelId}/{reservationId}`
- `POST /api/v1/reservations/{reservationId}/guest-confirmation`

## Notes

- The create endpoint can upsert the selected hotel and room when needed.
- The admin portal uses the hotel-scoped list/create/delete actions for persistent testing.
