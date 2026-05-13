# admin-web

Administrative portal for hotel operators.

## Status

Implemented. This app is separate from the guest kiosk and requires administrator login.

## What it does

- Shows hotel-scoped operational metrics.
- Lets the operator switch between hotels.
- Shows devices, audit activity, branding, and identity views.
- Provides a persistent reservation test area backed by the real backend and Oracle.

## Login

The portal uses the admin login exposed by `admin-service`.

Default credentials:

- username: `admin@flexcheck.local`
- password: `FlexCheck@2026`

The session stores the token in local storage and sends it as `X-Admin-Token`.

## Local development

```bash
cd frontend/admin-web
npm install
npm run dev
```

Default API endpoint:

```text
http://127.0.0.1:8088/api/v1
```

Optional environment variable:

- `VITE_API_URL`

## Docker

From the project root:

```bash
docker compose up --build
```

The admin portal is available at:

```text
http://127.0.0.1:3001
```

## Main views

- Overview
- Reservations
- Branding
- Devices
- Audit
- Identity

## Reservation test area

The reservations view lets the operator:

- create a persistent reservation for the selected hotel
- list reservations for the selected hotel
- delete test reservations through the backend

## Notes

- The portal is intentionally separate from the kiosk.
- Reservation test data is persisted in the backend and Oracle, not local state.
