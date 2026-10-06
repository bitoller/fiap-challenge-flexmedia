## Why

The FlexCheck Hotel kiosk currently lacks a professional, localized home screen that matches the brand identity of luxury hotel properties. Guests need an intuitive entry point to select between check-in, check-out, and concierge services. This change establishes the foundation for a vertical-oriented, multilingual kiosk interface that supports clean architecture principles and integrates seamlessly with the existing backend API and Oracle database.

## What Changes

- **New frontend architecture**: Establishes a clean, feature-driven structure with separate layers for domain models, data repositories (API + mocks), and presentation components
- **Home screen UI**: Creates the welcome screen with language selector (EN, PT-BR, ES) and three action buttons (Check-in, Check-out, Services)
- **Internationalization (i18n)**: Implements react-i18next with language persistence to localStorage across all future screens
- **API client layer**: Wraps fetch with correlation ID injection, error handling, and automatic fallback to realistic mocks when backend is unavailable
- **Data mocking**: Creates fixture-based mocks for multiple hotel scenarios (success, not found, invalid document, payment declined) to enable frontend development independently of backend availability
- **Bootstrap integration**: Uses Bootstrap 5 for responsive vertical layout tailored to kiosk displays
- **Frontend validation**: Implements document number and basic field validation before sending to backend API
- **State management**: Establishes patterns for session management, language preference persistence, and error handling
- **10-second API timeout**: Configures reasonable timeout before falling back to mocks; backend remains primary data source
- **Guest service requests**: Sends typed kiosk requests to the backend and surfaces them in the admin dashboard and audit trail
- **Detailed guest wayfinding**: Enriches the hotel map with a clear legend, floor transitions, accessible directions, and destination-specific steps while preserving its clean visual zones and established route network

## Capabilities

### New Capabilities
- `kiosk-home-screen`: Welcome screen with language selection and navigation to check-in, check-out, and services flows
- `frontend-clean-architecture`: Layered frontend structure (domain, data, presentation) supporting maintainability and modularity
- `frontend-i18n`: Multilingual support (English, Spanish, Portuguese-BR) with localStorage persistence
- `api-client-layer`: HTTP client with correlation ID tracking, error handling, and mock fallback
- `data-fixtures`: Realistic mock data supporting hotel scenarios for frontend development without backend

### Modified Capabilities
<!-- No existing capabilities modified in this change; this establishes new frontend patterns -->

## Impact

- **Code**: New `frontend/kiosk-web/src/` structure with domain, data, presentation layers; new i18n configuration
- **Dependencies**: Adds `react-i18next`, `i18next`, `bootstrap`, optionally `axios` or fetch wrapper
- **APIs**: Consumes existing endpoints (`/api/v1/health`, `/api/v1/checkin-sessions`) and adds `/api/v1/guest-service-requests`; adds interceptor for correlation IDs
- **Database**: No schema changes; uses existing Oracle tables via API
- **Vertical orientation**: Prioritizes portrait/kiosk aspect ratio; responsive but not mobile-first in traditional sense
- **Future**: Enables seamless addition of check-in flow, check-out flow, and services screens using established patterns
