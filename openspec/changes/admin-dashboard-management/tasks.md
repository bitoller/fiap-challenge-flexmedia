## 1. Admin access and API surface

- [x] 1.1 Add the admin authentication contract needed for a staff-only portal session.
- [x] 1.2 Expose or adapt hotel-scoped admin endpoints for dashboard, devices, audit, branding, and identity data.
- [x] 1.3 Add persistent reservation create and delete contracts scoped by hotel so test data survives reloads.

## 2. Admin portal shell

- [x] 2.1 Create a dedicated admin frontend application separated from the kiosk routes.
- [x] 2.2 Implement the admin login screen using the same luxury visual language as the kiosk.
- [x] 2.3 Build the authenticated admin shell with hotel selection, left navigation, and responsive layout.

## 3. Admin dashboard views

- [x] 3.1 Implement the operational dashboard view with hotel-scoped metrics and current system summaries.
- [x] 3.2 Implement the devices, audit, branding, and identity views using existing backend data when available.
- [x] 3.3 Add empty states for views that do not yet have backend records for the selected hotel.

## 4. Reservation test tools

- [x] 4.1 Build the persistent reservation test screen for creating reservations in the selected hotel.
- [x] 4.2 Build the reservation deletion action so admin-created test data can be removed through the backend.
- [x] 4.3 Add hotel-aware reservation listing and filtering so the test area only shows records for the selected hotel.

## 5. Polish, validation, and handoff

- [x] 5.1 Add translations, reusable components, and styling for the new admin portal screens.
- [x] 5.2 Verify the admin login, dashboard, and reservation test flow against the backend and Oracle persistence.
- [x] 5.3 Update the OpenSpec handoff so future work can resume from the admin portal checkpoint.
