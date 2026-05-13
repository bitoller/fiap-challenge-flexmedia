## 1. Admin access and API surface

- [ ] 1.1 Add the admin authentication contract needed for a staff-only portal session.
- [ ] 1.2 Expose or adapt hotel-scoped admin endpoints for dashboard, devices, audit, branding, and identity data.
- [ ] 1.3 Add persistent reservation create and delete contracts scoped by hotel so test data survives reloads.

## 2. Admin portal shell

- [ ] 2.1 Create a dedicated admin frontend application separated from the kiosk routes.
- [ ] 2.2 Implement the admin login screen using the same luxury visual language as the kiosk.
- [ ] 2.3 Build the authenticated admin shell with hotel selection, left navigation, and responsive layout.

## 3. Admin dashboard views

- [ ] 3.1 Implement the operational dashboard view with hotel-scoped metrics and current system summaries.
- [ ] 3.2 Implement the devices, audit, branding, and identity views using existing backend data when available.
- [ ] 3.3 Add empty states for views that do not yet have backend records for the selected hotel.

## 4. Reservation test tools

- [ ] 4.1 Build the persistent reservation test screen for creating reservations in the selected hotel.
- [ ] 4.2 Build the reservation deletion action so admin-created test data can be removed through the backend.
- [ ] 4.3 Add hotel-aware reservation listing and filtering so the test area only shows records for the selected hotel.

## 5. Polish, validation, and handoff

- [ ] 5.1 Add translations, reusable components, and styling for the new admin portal screens.
- [ ] 5.2 Verify the admin login, dashboard, and reservation test flow against the backend and Oracle persistence.
- [ ] 5.3 Update the OpenSpec handoff so future work can resume from the admin portal checkpoint.
