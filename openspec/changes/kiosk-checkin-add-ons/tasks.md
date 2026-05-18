- [x] Add backend add-on catalog, persistence, and reservation total recalculation.
- [x] Add API endpoints to list and apply add-ons for a check-in session.
- [x] Add Oracle schema support for persisted reservation add-ons.
- [x] Add kiosk add-ons route and page between identity verification and payment.
- [x] Add i18n copy for add-ons in English, Portuguese, and Spanish.
- [x] Verify backend and frontend builds.

## Validation
- Backend check-in service tests passed with `mvn test`.
- Kiosk frontend production build passed with `npm run build`.
- Docker images were rebuilt and the kiosk, gateway, check-in service, and Oracle containers are running.
- Kiosk Docker image was rebuilt again after the responsive portrait action-button refinement.
