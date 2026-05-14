# kiosk-web

React frontend for the FlexCheck self-service kiosk.

## Architecture

The app is organized in layers to keep the guest flow predictable:

- `src/domain/`: types and validation rules
- `src/data/`: HTTP client, endpoints, interceptors, repositories, and compatibility fixtures
- `src/presentation/`: layout, components, features, and hooks
- `src/i18n/`: `react-i18next` setup and namespaces
- `src/core/`: global providers and constants
- `src/shared/styles/`: visual tokens, kiosk layout, and Bootstrap customizations

See also [ARCHITECTURE.md](./ARCHITECTURE.md).

## Running Locally

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Canonical Runtime and Compatibility Mode

The kiosk uses the API as the canonical runtime path.

When the backend is unavailable or when compatibility mode is explicitly enabled, the repository layer can still fall back to mock fixtures so the UI remains usable during development.

### Use the real API

```text
VITE_USE_MOCKS=false
VITE_API_URL=http://127.0.0.1:8088/api/v1
VITE_ACTIVE_HOTEL_ID=1
```

### Force compatibility fixtures

```text
VITE_USE_MOCKS=true
VITE_MOCK_SCENARIO=SUCCESS
```

### Mock scenarios

- `SUCCESS`
- `NOT_FOUND`
- `INVALID_DOCUMENT`
- `PAYMENT_DECLINED`

## Environment Variables

- `VITE_API_URL`: API base URL
- `VITE_API_TIMEOUT_MS`: request timeout in milliseconds
- `VITE_USE_MOCKS`: forces compatibility fixtures without hitting the network
- `VITE_MOCK_SCENARIO`: chooses which mock scenario to use
- `VITE_DEFAULT_LANGUAGE`: initial language
- `VITE_ACTIVE_HOTEL_ID`: hotel used by the kiosk to load branding and content

## Hotel Selection

The kiosk loads the hotel profile using `VITE_ACTIVE_HOTEL_ID`.

- The default value is `1`.
- The frontend calls `GET /api/v1/admin/hotels/{hotelId}` through the gateway.
- If the API becomes unavailable, the kiosk keeps a fallback brand profile so the screen does not break.

## Supported Languages

The kiosk supports:

- English (`en`)
- Brazilian Portuguese (`pt-BR`)
- Spanish (`es`)

Namespaces:

- `common`
- `home`
- `errors`

## Available Flows

- Home with language selection
- Check-in flow placeholder for the current release
- Check-out flow placeholder for the current release
- Services flow placeholder for the current release

## Build

```bash
npm run build
```

## Notes

- The layout is optimized for portrait orientation.
- Touch targets are intentionally large for kiosk hardware.
- The HTTP client injects `X-Correlation-Id` automatically.
