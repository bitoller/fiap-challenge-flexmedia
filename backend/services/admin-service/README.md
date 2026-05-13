# admin-service

Administrative service for FlexCheck.

## Status

Implemented for dashboard, devices, audit, branding, hotel profile, and portal authentication.

## Responsibilities

- Expose hotel-scoped dashboard metrics.
- Expose device status and audit events.
- Manage hotel profile, branding, and kiosk content.
- Authenticate administrator portal sessions.

## Endpoints

- `POST /api/v1/admin/auth/login`
- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/devices`
- `GET /api/v1/admin/audit`
- `POST /api/v1/admin/audit-events`
- `GET /api/v1/admin/hotels`
- `GET /api/v1/admin/hotels/{hotelId}`
- `PUT /api/v1/admin/hotels/{hotelId}/branding`
- `PUT /api/v1/admin/hotels/{hotelId}/content`

## Default Login

- username: `admin@flexcheck.local`
- password: `FlexCheck@2026`

## Notes

- The admin portal is a separate frontend from the kiosk.
- Admin requests require the `X-Admin-Token` header after login.
