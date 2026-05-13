## 1. Branding and Shell Integration

- [x] 1.1 Add a frontend branding data adapter for loading the active hotel profile from `admin-service` through the gateway, with safe fallback defaults.
- [x] 1.2 Wire the kiosk shell header, footer, and top-level theme tokens to the loaded branding data without coupling it to the guest flow state.
- [x] 1.3 Document the kiosk hotel profile selection approach in the frontend README and environment examples.

## 2. Check-in Flow Completion

- [x] 2.1 Extend the check-in flow state/context to represent contact review, terms acceptance, payment, success, and recovery states.
- [x] 2.2 Add the remaining route-level screens for contact review, terms and conditions, payment selection, and success feedback in the existing presentation structure.
- [x] 2.3 Connect the new screens to the existing `checkin-service` repository methods for guest confirmation, consent submission, and check-in completion.
- [x] 2.4 Remove duplicated reservation lookup behavior from the identification path so the flow advances with one clean backend handoff per step.
- [x] 2.5 Preserve dedicated recovery states for reservation-not-found, document rejection, biometry rejection, and payment decline.

## 3. Polish and Validation

- [x] 3.1 Add and update translations for all new check-in screens and branding labels in English, Portuguese-BR, and Spanish.
- [x] 3.2 Refine portrait kiosk spacing, touch targets, and typography so the new screens match the reference visuals on vertical hardware.
- [x] 3.3 Validate the full check-in journey against the running backend to confirm that submitted guest data, consents, and completion data persist correctly.
- [x] 3.4 Keep the checkout and services placeholders untouched for the future changes that will follow this flow.
