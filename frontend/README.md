# FlexCheck - Frontend

The FlexCheck frontend workspace contains the guest-facing kiosk application and the hotel administration portal. The kiosk is designed for a vertical self-service hotel terminal, while the admin portal is a separate operational interface for hotel staff.

Both applications are built with React, Vite, and TypeScript. They communicate with the backend through the API gateway and use Oracle-backed backend services for persistence.

## Project Functionalities

This frontend workspace is composed of two applications:

- Kiosk Web: Guest-facing vertical kiosk for check-in, checkout, privacy policy, concierge contact, and service flows.
- Admin Web: Staff-facing administration portal for dashboard views, hotel context selection, devices, audit placeholders, branding placeholders, and reservation test management.

Current kiosk flows:

- Home: Displays hotel branding and the main check-in, checkout, and services options.
- Check-In Lookup: Searches an open reservation by CPF, reservation number, or QR code.
- QR Code Scanner: Uses the kiosk camera to read a reservation token.
- Reservation Summary: Confirms that the correct reservation was found.
- Identity Verification: Captures a document, performs OCR, captures a selfie, and validates the guest identity.
- Consent: Collects stay terms and biometric consent inside the identity verification flow.
- Add-On Services: Allows guests to add optional services before payment.
- Payment: Shows reservation balance, selected services, and payment method selection.
- Access Instructions: Shows room, facial access, physical key fallback, and final check-in completion.
- Checkout Lookup: Searches an active stay by CPF or facial verification.
- Checkout Settlement: Shows open checkout charges and payment controls.
- Checkout Completion: Confirms room release, receipt availability, and card return.
- Privacy Policy: Displays stay, privacy, document, and biometric usage terms without losing the current flow state.
- Concierge Contact: Notifies the admin backend that the kiosk needs assistance.

Current admin flows:

- Admin Login: Authenticates staff using backend-provided credentials.
- Dashboard: Shows operational cards and hotel context data.
- Hotel Selector: Allows switching the active hotel context.
- Device Views: Displays kiosk fleet and device monitoring placeholders.
- Audit Views: Displays operational audit placeholders.
- Branding Views: Prepares hotel visual identity management areas.
- Reservation Test Area: Creates and deletes real persisted reservations for testing kiosk flows.

## Technologies and Tools Used

- `React 19`: UI library for both frontend applications.
- `Vite 6.3.5`: Development server and production bundler.
- `TypeScript 5.8.3`: Static typing.
- `React Router`: Client-side routing.
- `Nginx`: Production static file server inside Docker.
- `Docker`: Frontend production runtime.
- `Backend REST API`: Provides hotel, reservation, check-in, checkout, payment, device, and admin data.

## Libraries and Frameworks Used

Kiosk Web:

- `@vitejs/plugin-react`
- `bootstrap`
- `html5-qrcode`
- `i18next`
- `i18next-browser-languagedetector`
- `lucide-react`
- `react`
- `react-dom`
- `react-i18next`
- `react-router-dom`
- `sass`
- `typescript`
- `vite`

Admin Web:

- `@vitejs/plugin-react`
- `react`
- `react-dom`
- `react-router-dom`
- `typescript`
- `vite`

## Project Status

The current kiosk check-in and checkout flows are implemented. The admin portal includes authentication, dashboard structure, hotel context, and persistent reservation testing tools.

## Frontend Folder Architecture

```text
frontend/
  README.md
  kiosk-web/
    Dockerfile
    docker/
      nginx.conf
    src/
      core/
      data/
      domain/
      i18n/
      presentation/
      shared/
  admin-web/
    Dockerfile
    docker/
      nginx.conf
    src/
      admin/
      components/
      pages/
```

Kiosk architecture:

- `core`: Application-level setup and cross-cutting runtime configuration.
- `data`: API clients, repositories, adapters, and external data access.
- `domain`: Business models, contracts, and domain-oriented types.
- `i18n`: Translation namespaces for English, Portuguese, and Spanish.
- `presentation`: Pages, routes, layouts, and feature UI.
- `presentation/components`: Shared presentation components.
- `presentation/features`: Feature-specific screens such as home, check-in, checkout, legal, map, and services.
- `shared`: Shared styles, helpers, and reusable frontend utilities.

Admin architecture:

- `admin`: Admin-specific application logic.
- `components`: Reusable admin UI components.
- `pages`: Admin route pages.

## Open and Run the Frontend Locally

Before running a frontend application locally, install Node.js 22 or a compatible current LTS version.

The backend should be running before testing real API flows. The simplest option is to start the backend and gateway from the repository root:

```bash
docker compose up -d --build api-gateway
```

You can also start the full platform:

```bash
docker compose up -d --build
```

### Run Kiosk Web

From the repository root:

```bash
cd frontend/kiosk-web
npm install
npm run dev
```

The kiosk development server should be available at:

```text
http://127.0.0.1:5173
```

If the browser opens with `localhost`, that is also fine:

```text
http://localhost:5173
```

### Run Admin Web

From the repository root:

```bash
cd frontend/admin-web
npm install
npm run dev
```

The admin development server should be available at:

```text
http://127.0.0.1:5175
```

## Build the Frontend

Build the kiosk:

```bash
cd frontend/kiosk-web
npm run build
```

Build the admin portal:

```bash
cd frontend/admin-web
npm run build
```

Preview a production build locally:

```bash
npm run preview
```

## Run the Frontend with Docker

From the repository root, build and start the full stack:

```bash
docker compose up -d --build
```

Open:

```text
Kiosk: http://127.0.0.1:3000
Admin:  http://127.0.0.1:3001
```

Rebuild only the kiosk image:

```bash
docker compose up -d --build kiosk-web
```

Rebuild only the admin image:

```bash
docker compose up -d --build admin-web
```

## Frontend Environment

The Docker build receives frontend environment values from the root `.env` file through build arguments.

Common root `.env` values for frontend:

```env
KIOSK_PORT=3000
KIOSK_API_URL=/api/v1
KIOSK_ID=1
ACTIVE_HOTEL_ID=1
ADMIN_WEB_PORT=3001
ADMIN_WEB_API_URL=/api/v1
```

For local Vite development, the default API path is `/api/v1`. Keep the API gateway running so requests can be resolved.

If you need to override values directly for local development, create a local `.env` file inside the specific frontend app folder. Do not commit local environment files.

Example for `frontend/kiosk-web/.env`:

```env
VITE_API_URL=/api/v1
VITE_KIOSK_ID=1
VITE_ACTIVE_HOTEL_ID=1
```

Example for `frontend/admin-web/.env`:

```env
VITE_API_URL=/api/v1
```

## Communication with the API

Frontend applications should call the API through the gateway path:

```text
/api/v1
```

Docker URLs:

```text
Kiosk web:  http://127.0.0.1:3000
Admin web:  http://127.0.0.1:3001
API gateway: http://127.0.0.1:8088
```

Development URLs:

```text
Kiosk web: http://127.0.0.1:5173
Admin web: http://127.0.0.1:5175
```

The backend and gateway details are documented in `backend/README.md`.

## Camera Features

The kiosk uses the browser camera for:

- QR code reservation lookup.
- Document capture.
- Selfie capture.
- Facial verification during check-in.
- Facial lookup during checkout.

Camera usage requires:

- A browser with camera support.
- Camera permission granted to the site.
- HTTPS or localhost-compatible browser behavior. Localhost and `127.0.0.1` are accepted by modern browsers for camera testing.

If the camera does not open:

- Confirm that no other tab is using the camera.
- Confirm browser permissions.
- Reload the kiosk page.
- Prefer Chrome or Edge for local testing.

## Internationalization

Kiosk text is translated through the `i18n` folder. The supported languages are:

- English
- Portuguese
- Spanish

UI text belongs in translation files. Code, file names, folders, methods, variables, and configuration should remain in English.

## Development Guidelines

- Keep kiosk layout stable across languages and orientations.
- Reuse shared components before creating new feature-specific UI.
- Keep guest-facing text in i18n namespaces.
- Do not store credentials in frontend code.
- Do not commit local `.env` files.
- Validate both portrait and landscape kiosk layouts before considering a screen complete.
- Keep admin pages separate from kiosk routes.

## Troubleshooting

If API calls fail:

```bash
docker compose ps
```

Confirm that `api-gateway` is running and available at:

```text
http://127.0.0.1:8088
```

If a Docker frontend looks outdated:

```bash
docker compose up -d --build kiosk-web
docker compose up -d --build admin-web
```

If dependencies are stale:

```bash
cd frontend/kiosk-web
npm install
```

or:

```bash
cd frontend/admin-web
npm install
```
