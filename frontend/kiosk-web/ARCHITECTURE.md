# kiosk-web Architecture

## Goals

The kiosk frontend is designed to be:

- easy to extend for new guest flows,
- stable in the canonical API-backed runtime,
- compatible with opt-in mock fixtures for development,
- localized in English, Brazilian Portuguese, and Spanish,
- readable on a tall portrait display.

## Layers

### Domain

Pure TypeScript models and validators live here.

Examples:

- `Reservation`
- `Guest`
- `Room`
- `Session`
- CPF, passport, email, and phone validators

### Data

This layer owns communication with the backend.

It includes:

- `data/api/client.ts`
- `data/api/endpoints.ts`
- `data/api/interceptors.ts`
- `data/repositories/checkinRepository.ts`
- `data/repositories/sessionRepository.ts`
- compatibility fixtures

The repository decides whether to call the API or use compatibility fixtures.

### Presentation

This layer owns React UI concerns.

It includes:

- shared UI components
- kiosk layout
- custom hooks
- the home feature

### Core

Shared application wiring lives here:

- providers
- constants

### i18n

Translation setup is isolated so new languages and namespaces can be added without touching the rest of the app.

### Shared styles

Visual tokens and kiosk-specific layout rules live under `shared/styles`.

## Data Flow

1. A component uses a hook.
2. The hook calls a repository.
3. The repository calls the API client.
4. The API client injects headers, enforces timeout, and parses errors.
5. If needed, the repository uses compatibility fixtures.

## Design Notes

- The kiosk is optimized for portrait displays.
- Touch targets are kept large for public hardware.
- The language preference is persisted to localStorage.
- Placeholder routes are kept until the future flows are implemented.
