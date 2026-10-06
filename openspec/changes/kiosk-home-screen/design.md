## Context

FlexCheck Hotel is a luxury hotel automation system with a kiosk-based guest interface. Currently, the frontend (React + Vite) has a minimal structure with all logic concentrated in a single App.tsx. The backend provides microservices via an API gateway with check-in, reservations, and other operations. The kiosk is a physical touchscreen with vertical (portrait) orientation targeting a 16:9 or similar aspect ratio.

Key constraints:
- **Vertical layout**: Kiosk is ~2-3 meters tall display, portrait orientation
- **No database access from frontend**: All data flows through `/api/v1` endpoints  
- **Oracle backend**: Remote Oracle FIAP database; frontend is stateless
- **Multiple scenarios**: Hotels may have different configurations, guest types, edge cases
- **Language support**: Must support EN, ES, PT-BR with persistent selection
- **Reliability**: API may timeout; fallback to mocks enables continued demo/development

## Goals / Non-Goals

**Goals:**
- Establish scalable, maintainable frontend architecture following clean code and clean architecture principles
- Create a professional home screen matching luxury hotel branding with language selection
- Implement robust API client with timeout handling and mock fallback
- Enable rapid development of future screens (check-in, checkout) using established patterns
- Support multilingual UI with persistent language preference
- Provide realistic mock data for development without requiring backend availability

**Non-Goals:**
- Real-time collaborative features (scope for future phases)
- Mobile app (web-only, kiosk-optimized)
- Analytics or heat mapping (future)
- Offline-first architecture (backend always primary)
- Global state management library (use Context/hooks initially)

## Decisions

### 1. **Clean Architecture Layering: Domain → Data → Presentation**

**Decision**: Organize frontend into three layers:
- **Domain**: TypeScript types (Reservation, Guest, Session, Room)
- **Data**: API client, repositories, mocks (abstracted data access)
- **Presentation**: Components, pages, hooks (React UI layer)

**Rationale**:
- Enables independent testing of business logic vs. UI
- Easy to swap API for mocks without touching components
- Clear separation of concerns aligns with FlexCheck backend architecture
- Scales well as more services/features are added

**Alternatives considered**:
- Monolithic component structure: Faster initially but creates spaghetti code; rejected
- Redux/Zustand global state: Overkill for MVP; adds complexity; rejected
- MVC pattern: Less suitable for React's component model; rejected

### 2. **Repository Pattern for Data Access**

**Decision**: Use repository pattern with automatic fallback to mocks on timeout.

**Rationale**:
- Repositories abstract whether data comes from API or mocks
- Components don't know or care about the source
- Easy to test: pass mock repository to component
- Supports scenarios where backend is down/slow during development
- 10-second timeout threshold chosen based on UX research (beyond ~8s, users perceive system as broken)

**Alternatives considered**:
- Hooks-only approach: Less testable; logic scattered; rejected
- Redux for async: Overkill; Redux middleware adds boilerplate; rejected

### 3. **React-i18next for Multilingual Support**

**Decision**: Use react-i18next with localStorage persistence.

**Rationale**:
- Industry standard for React i18n
- Provides `useTranslation()` hook for easy component integration
- Built-in namespace support for modular translations
- localStorage persistence is sufficient for kiosk context
- No additional server-side complexity

**Alternatives considered**:
- Context API only: Simpler initially but loses translation features; rejected
- Backend-driven translations: Adds network calls; slower; rejected

### 4. **Bootstrap 5 for Responsive Layout**

**Decision**: Use Bootstrap 5 for base styling and responsive utilities.

**Rationale**:
- Mature, well-documented framework
- Mobile-first responsive grid (can adapt for vertical)
- Accessibility built-in
- Reduces CSS boilerplate
- Easy custom theming via SCSS variables

**Alternatives considered**:
- Tailwind CSS: More verbose for kiosk vertical layout; rejected
- CSS Modules only: More manual work on responsive utilities; rejected
- Material-UI: Too heavy for MVP; adds unnecessary components; rejected

### 5. **10-Second API Timeout with Automatic Mock Fallback**

**Decision**: Set fetch timeout to 10 seconds; on timeout, return mock data seamlessly.

**Rationale**:
- UX research suggests ~8-10s is human perception threshold for "system broken"
- During development, when backend is down, user gets same experience as if API was slow
- No error splash screens; demo continues
- Gradual rollback: if API comes back, next request tries again

**Alternatives considered**:
- No timeout: Frontend hangs; rejected
- Immediate mock fallback (0s): Never tries real API; defeats purpose; rejected
- Configurable per endpoint: Over-engineering for MVP; rejected

### 6. **Namespace-Based Translation Files**

**Decision**: Organize translations by feature (home.json, checkin.json, errors.json, common.json).

**Rationale**:
- Scalable as more screens are added
- Different teams can work on different namespaces
- Smaller files are easier to maintain
- Easy to add new namespace without refactoring existing ones

**Alternatives considered**:
- Single translation file: Becomes unwieldy; rejected
- Per-component files: Too fragmented; hard to find strings; rejected

### 7. **Frontend Validation Before API Submission**

**Decision**: Validate document numbers and basic fields on frontend using regex/util functions.

**Rationale**:
- Better UX: immediate feedback without API roundtrip
- Reduces unnecessary API calls
- Backend still validates (defense-in-depth)
- CPF/passport validation patterns standardized in domain/validators

**Alternatives considered**:
- Backend-only validation: Slower UX; more API calls; rejected
- No frontend validation: Wastes backend resources; rejected

### 8. **Vertical-First, No Mobile-First Compromise**

**Decision**: Optimize layout for vertical 16:9 kiosk orientation; responsive but not mobile-first.

**Rationale**:
- Kiosk is the primary use case (fixed hardware)
- Vertical layout is the constraint driving CSS
- Bootstrap's mobile-first grid can still adapt
- Touch targets sized for finger (50px minimum)

**Alternatives considered**:
- Mobile-first everywhere: Wastes vertical space on kiosk; rejected
- Fixed layout only: Not responsive if kiosk breaks; rejected

### 9. **Domain Models as Immutable TypeScript Types**

**Decision**: Define domain entities as readonly TypeScript interfaces, not classes.

**Rationale**:
- Simpler than class constructors
- Immutable by design (easier to reason about)
- Cleaner separation from framework concerns
- Works well with React's functional components

**Alternatives considered**:
- OOP classes with getters/setters: More boilerplate; rejected
- Zod/runtime validation: Added complexity; mvp doesn't need it; rejected

### 10. **Guest Service Requests Use the Persisted Audit Workflow**

**Decision**: Submit kiosk service requests through a dedicated public endpoint that validates the service type and records a server-authored `GUEST_SERVICE_REQUESTED` audit event.

**Rationale**:
- Prevents the kiosk from choosing arbitrary audit actions
- Preserves hotel, kiosk, route, correlation ID, request type, and timestamp in the existing operational record
- Makes requests immediately visible to the admin dashboard and audit trail
- Reuses the existing acknowledgement workflow without introducing a second source of truth
- Keeps legacy concierge audit entries compatible with the new request count

**Alternatives considered**:
- Continue posting directly to the generic audit endpoint: weaker validation and allows client-authored audit semantics; rejected
- Add a separate service-request table immediately: duplicates status and acknowledgement behavior for the current request scope; deferred until room/stay-level fulfillment tracking is required

### 11. **Services Uses Intent-Based Discovery and Explicit Route State**

**Decision**: Make the Guest Hub respond to a guest-selected mood and connect each recommendation to a destination-aware map route. Map highlighting is an explicit on/off state for the currently selected destination rather than a hard-coded SPA action.

**Rationale**:
- Gives guests a useful discovery path when they do not arrive with a specific request
- Connects editorial hotel content to a concrete next action
- Makes route highlighting visibly reversible and understandable
- Keeps the same interaction usable for every map destination
- Prevents backend action codes, raw result values, and internal routes from leaking into admin-facing copy

**Alternatives considered**:
- Add decorative animations without changing behavior: does not improve task completion; rejected
- Keep a SPA-only highlight button: produces no change when SPA is already selected and cannot scale to other destinations; rejected

### 12. **Map Detail Supports Orientation Without Replacing the Route Network**

**Decision**: Keep the existing destination coordinates, clean abstract zones, route paths, and route animation while adding a legend, floor transitions, and step-by-step accessible directions outside the floor-plan artwork.

**Rationale**:
- Preserves the route interaction the user already finds successful
- Keeps the floor plan visually calm and lets the destination labels remain the primary map landmarks
- Makes vertical movement through lifts and floors explicit
- Gives every destination actionable instructions instead of a generic route sentence
- Uses translated labels and directions in all supported kiosk languages

**Alternatives considered**:
- Replace the map with a geographic or third-party map: does not represent an interior hotel layout and would add unnecessary dependencies; rejected
- Add decorative room fixtures and amenity illustrations inside the zones: introduces visual noise and competes with route guidance; rejected
- Redraw the route network around a new floor plan: risks changing the familiar interaction and was explicitly out of scope; rejected

### 13. **Orientation Rules Are Scoped to the Guest Hub**

**Decision**: Add portrait, landscape, and short-landscape layout rules only under Guest Hub and hotel-map selectors. Keep the established Home, Check-in, Check-out, and shared kiosk layout rules unchanged. Use “Guest Hub” as the visible entry-point name while retaining `/services` as the internal route.

**Rationale**:
- Prevents a localized responsive improvement from regressing completed kiosk flows
- Makes wide portrait kiosks deterministic instead of relying on width breakpoints by coincidence
- Keeps touch targets and translated text readable across Guest Hub sections
- Gives the broader destination a name that covers requests, amenities, recommendations, and wayfinding

**Alternatives considered**:
- Change shared kiosk breakpoints: unnecessary risk to completed screens; rejected
- Keep the home label as “Services”: understates the destination and creates a naming discontinuity; rejected

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Mock data becomes stale** | Tests pass but real API fails differently | Keep mocks in sync with API via integration tests; review mocks quarterly |
| **localStorage quota exceeded** | Language preference lost | Unlikely given small translation file size; monitor |
| **10s timeout too short for slow networks** | Demo fails on poor connectivity | Make timeout configurable in `.env`; increase for production |
| **Single-language session assumption** | User changes language mid-flow; state inconsistency | Store language in URL query param as well; use `i18n.language` as source of truth |
| **No offline mode** | Kiosk requires network | Document requirement; add health check on app init; future: add service workers |
| **Bootstrap customization complexity** | Styling becomes unwieldy | Document color variables upfront; keep bootstrap.scss override file focused |

## Migration Plan

**Deployment**:
1. Create frontend directory structure (no breaking changes)
2. Add dependencies: react-i18next, i18next, bootstrap
3. Commit home screen with mocks; verify no warnings
4. Backend already supports `/api/v1/health` and `/api/v1/checkin-sessions`; no backend changes needed
5. Roll out to kiosk; verify language selector and button navigation

**Rollback**:
- Revert to previous commit; React app rebuilds automatically
- Mocks remain in codebase; safe to deploy

**Zero downtime**:
- Frontend is static assets; can deploy independently
- Old frontend continues working until cache expires
- New frontend fallback to mocks if backend issues

## Open Questions

1. **Hotel branding colors**: Are the hex codes available, or should we extract from the image provided?
2. **Future check-in flow**: Should session state persist across page reloads, or start fresh?
3. **Error notifications**: Toast notifications or inline messages in the flow?
4. **Accessibility**: Are there specific WCAG requirements (AA, AAA)? Voice navigation needed?
5. **Analytics**: Should we track language selection or flow abandonment for future iterations?
