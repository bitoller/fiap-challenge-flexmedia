# Codebase Cleanup Handoff

## What Changed

- Removed redundant kiosk frontend wrappers:
  - `checkinFlowRepository.ts`
  - `checkoutFlowRepository.ts`
- Removed the redundant `searchReservations(...)` alias from `checkinRepository.ts`.
- Cleaned stale imports and dead references from `sessionRepository.ts`.
- Rewrote the kiosk architecture and README documentation in English and marked mock fallback behavior as compatibility-only.
- Renamed the `docs` tree to English filenames and folder names, including the `diagramas` -> `diagrams` folder move and the new document names in the main index.
- Rewrote `docs/08-estrutura-do-projeto.md` in English and aligned it with the canonical API-backed runtime.
- Rewrote the main narrative documents in a more formal tone:
  - executive report
  - business rules
  - requirements and backlog
  - software architecture
  - project status
  - consolidated report

## What Was Preserved

The following remain intentionally active because they still support the live runtime or compatibility path:

- `frontend/kiosk-web/src/data/repositories/checkinRepository.ts` mock fallback logic
- `frontend/kiosk-web/src/data/repositories/hotelRepository.ts` fallback brand profile logic
- in-memory backend adapters that are still used by live services:
  - `InMemoryIdentityRepository`
  - `InMemoryDeviceRepository`
  - `InMemoryKeyRepository`
  - `InMemoryPaymentRepository`
  - `InMemoryNotificationRepository`
  - `InMemoryAdminSessionRepository`

## Verification

- `mvn test` passed in `backend/`
- `npm run build` passed in `frontend/kiosk-web`

## Remaining Cleanup Candidates

- Standardize clearly misleading names only when a rename does not create unnecessary churn.
- Normalize backend and frontend error responses further if a future change needs more consistent domain messaging.
- Remove or migrate the remaining compatibility layers only after a dedicated migration change proves the replacement is safe.

## Resume Point

The repository is now cleaner and documented in English for the structural pieces that changed in this cleanup. Continue from here with future cleanup or feature work without needing to rediscover the deleted wrapper layers.
