# Frontend

The frontend workspace contains two React/Vite applications:

- `kiosk-web`: the vertical hotel kiosk experience.
- `admin-web`: the administration portal for hotel operations and test reservation management.

Both applications use the API gateway by default.

## Kiosk Web

Run locally:

```bash
cd frontend/kiosk-web
npm install
npm run dev
```

Default local URL:

```text
http://127.0.0.1:5173
```

Build:

```bash
npm run build
```

Environment:

```env
VITE_API_URL=/api/v1
VITE_API_TIMEOUT_MS=10000
VITE_USE_MOCKS=false
VITE_MOCK_SCENARIO=SUCCESS
VITE_DEFAULT_LANGUAGE=en
```

The kiosk supports the home screen, check-in, checkout, shared error recovery, and language switching. QR check-in and identity verification use the browser camera and require camera permission in the browser.

Current check-in path:

1. Reservation lookup by CPF, reservation number, or QR token.
2. Compact reservation summary.
3. Identity verification with document capture, selfie capture, inline terms, and biometric consent.
4. Existing next step of the check-in flow.

The old contact review page and standalone terms page are no longer routed by the kiosk. Terms and biometric consent are handled inside the identity verification screen.

## Admin Web

Run locally:

```bash
cd frontend/admin-web
npm install
npm run dev
```

Default local URL:

```text
http://127.0.0.1:5175
```

Build:

```bash
npm run build
```

Environment:

```env
VITE_API_URL=/api/v1
```

Admin credentials are not hardcoded in the frontend. They are validated by `admin-service` using the values configured in the root `.env`.

## Docker

The root `docker-compose.yml` builds and serves both frontends with Nginx:

- Kiosk: `http://127.0.0.1:3000`
- Admin portal: `http://127.0.0.1:3001`

Start from the repository root:

```bash
docker compose up -d --build
```

## Development Notes

- Keep kiosk UI text in i18n files.
- Keep code, file names, folders, comments, and configuration in English.
- Do not commit local `.env` files or real credentials.
- Prefer the API gateway for local and Docker integration tests.
