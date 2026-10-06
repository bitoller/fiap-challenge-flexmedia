## 1. Project Setup and Dependencies

- [x] 1.1 Update package.json with required dependencies (react-i18next, i18next, bootstrap)
- [x] 1.2 Update tsconfig.json with appropriate compiler options
- [x] 1.3 Update vite.config.ts to handle environment variables correctly
- [x] 1.4 Create .env.local file with development configuration

## 2. Directory Structure and Foundation

- [x] 2.1 Create domain/ directory with models, types, and validators subdirectories
- [x] 2.2 Create data/ directory with api/ and repositories/ subdirectories
- [x] 2.3 Create presentation/ directory with components/, features/, and hooks/ subdirectories
- [x] 2.4 Create i18n/ directory with config, locales, and namespaces structure
- [x] 2.5 Create core/ directory for providers and constants
- [x] 2.6 Create shared/styles/ for CSS variables, layout, and Bootstrap overrides

## 3. Domain Layer Implementation

- [x] 3.1 Define TypeScript interfaces for Reservation, Guest, Room, Session in domain/models
- [x] 3.2 Create domain/types/index.ts exporting all domain types
- [x] 3.3 Create domain/validators with functions for CPF, passport, and document validation
- [x] 3.4 Create domain/errors with custom error types (ApiError, ValidationError, TimeoutError)

## 4. Data Layer - API Client

- [x] 4.1 Create data/api/client.ts with fetch wrapper function
- [x] 4.2 Implement correlation ID injection in request headers
- [x] 4.3 Implement 10-second timeout with AbortController
- [x] 4.4 Implement error parsing and handling
- [x] 4.5 Create data/api/endpoints.ts with API route constants
- [x] 4.6 Create data/api/interceptors.ts for request/response transformation

## 5. Data Layer - Mock Fixtures

- [x] 5.1 Create data/repositories/mocks/reservations.ts with success scenario fixture
- [x] 5.2 Add not-found scenario fixture to mocks
- [x] 5.3 Add invalid-document scenario fixture to mocks
- [x] 5.4 Add payment-declined scenario fixture to mocks
- [x] 5.5 Create data/repositories/mocks/index.ts exporting all fixtures
- [x] 5.6 Verify all mock data conforms to domain TypeScript types

## 6. Data Layer - Repositories

- [x] 6.1 Create data/repositories/checkinRepository.ts with searchReservation method
- [x] 6.2 Implement mock fallback on timeout in repository
- [x] 6.3 Create data/repositories/sessionRepository.ts for session management
- [x] 6.4 Add environment variable support for VITE_USE_MOCKS and VITE_MOCK_SCENARIO

## 7. Internationalization Setup

- [x] 7.1 Create i18n/config.ts with react-i18next initialization
- [x] 7.2 Configure language detection and localStorage persistence
- [x] 7.3 Create i18n/locales/en.json with all English translations
- [x] 7.4 Create i18n/locales/pt-BR.json with all Portuguese translations
- [x] 7.5 Create i18n/locales/es.json with all Spanish translations
- [x] 7.6 Organize translations into namespaces: common.json, home.json, errors.json
- [x] 7.7 Verify all text keys are present in all three language files

## 8. Presentation Layer - Shared Components

- [x] 8.1 Create presentation/components/common/Button.tsx with styling
- [x] 8.2 Create presentation/components/common/Card.tsx for button containers
- [x] 8.3 Create presentation/components/common/Header.tsx with hotel name and language selector
- [x] 8.4 Create presentation/components/common/Footer.tsx with copyright and links
- [x] 8.5 Create presentation/components/common/LoadingSpinner.tsx
- [x] 8.6 Create presentation/components/common/ErrorDisplay.tsx

## 9. Presentation Layer - Layout Components

- [x] 9.1 Create presentation/components/layouts/KioskLayout.tsx wrapping all screens
- [x] 9.2 Ensure layout uses vertical-first responsive grid
- [x] 9.3 Apply Bootstrap utilities for touch-target sizing (min 50px)

## 10. Presentation Layer - Custom Hooks

- [x] 10.1 Create presentation/hooks/useLanguage.ts for language selection and persistence
- [x] 10.2 Create presentation/hooks/useApi.ts for loading/error/data state management
- [x] 10.3 Create presentation/hooks/useSession.ts for session state management
- [x] 10.4 Create presentation/hooks/useValidation.ts for input validation utilities

## 11. Presentation Layer - Home Feature

- [x] 11.1 Create presentation/features/home/pages/HomePage.tsx
- [x] 11.2 Create presentation/features/home/components/LanguageSelector.tsx
- [x] 11.3 Create presentation/features/home/components/ActionButton.tsx for reusable button
- [x] 11.4 Create presentation/features/home/components/ActionButtonsContainer.tsx
- [x] 11.5 Wire HomePage to display home namespace translations
- [x] 11.6 Implement navigation handlers for check-in, check-out, services (placeholder routes)

## 12. Styling and Design Tokens

- [x] 12.1 Create src/shared/styles/variables.css with luxury hotel color scheme
- [x] 12.2 Create src/shared/styles/layout.css for vertical kiosk layout utilities
- [x] 12.3 Create src/shared/styles/bootstrap.scss with Bootstrap customizations
- [x] 12.4 Define color palette: off-white background, gold/tan accents, dark brown text
- [x] 12.5 Ensure minimum font sizes for 1-2 meter viewing distance
- [ ] 12.6 Test responsive layout at 16:9 portrait aspect ratio

## 13. Core Setup and Providers

- [x] 13.1 Create core/providers.tsx with i18n provider and Router setup
- [x] 13.2 Create core/constants.ts with API_BASE, TIMEOUTS, and environment variables
- [x] 13.3 Create App.tsx with Router and theme/i18n provider wrapper
- [x] 13.4 Update main.tsx to mount App with providers

## 14. Integration and API Connection

- [ ] 14.1 Test API connection to /api/v1/health endpoint
- [ ] 14.2 Test checkinRepository.searchReservation() with mock data
- [ ] 14.3 Test timeout fallback by setting VITE_API_TIMEOUT_MS to low value
- [ ] 14.4 Verify correlation ID is present in browser DevTools Network tab
- [ ] 14.5 Test language persistence across page reload

## 15. Testing and Validation

- [ ] 15.1 Verify home screen renders without console errors
- [ ] 15.2 Verify language selector works for EN, PT-BR, ES
- [ ] 15.3 Verify language persists to localStorage correctly
- [ ] 15.4 Verify all buttons navigate (even if routes are stubs)
- [ ] 15.5 Verify responsive layout on vertical display (portrait)
- [ ] 15.6 Test API timeout by stopping backend and verifying fallback to mocks
- [ ] 15.7 Test document validation with invalid inputs
- [ ] 15.8 Verify fonts are readable from ~2 meters distance

## 16. Documentation

- [x] 16.1 Update frontend/kiosk-web/README.md with new architecture description
- [x] 16.2 Document how to run with mocks vs. real API
- [x] 16.3 Document environment variables (VITE_API_URL, VITE_USE_MOCKS, VITE_MOCK_SCENARIO)
- [x] 16.4 Document how to add new languages or translations
- [x] 16.5 Create ARCHITECTURE.md describing layers and component structure

## 17. Guest Service Request Integration

- [x] 17.1 Add a validated public backend endpoint for typed kiosk service requests
- [x] 17.2 Route guest service requests through the API gateway and persist server-authored audit events
- [x] 17.3 Connect Services quick requests and footer concierge contact to the backend with sending, success, and error states
- [x] 17.4 Include current and legacy service requests in admin open counts and acknowledgement
- [x] 17.5 Localize guest service actions and request types in the admin overview and audit trail
- [x] 17.6 Verify kiosk/admin production builds and backend/gateway tests

## 18. Services Interaction and Audit Presentation

- [x] 18.1 Replace raw audit results and internal route metadata with localized operational copy
- [x] 18.2 Add an intent-based stay planner with contextual recommendations
- [x] 18.3 Replace the SPA-only action with destination-aware animated route guidance and zoom controls
- [x] 18.4 Verify mood selection, planner-to-map handoff, and route activation in the live kiosk UI

## 19. Detailed Hotel Wayfinding

- [x] 19.1 Preserve the clean zone treatment and route geometry without decorative floor-plan illustrations
- [x] 19.2 Add a map legend, compass, floor journey, and destination-specific step-by-step directions
- [x] 19.3 Localize all wayfinding details in English, Portuguese, and Spanish with key parity
- [x] 19.4 Verify destination switching, route reset, and active route guidance in the live kiosk UI
