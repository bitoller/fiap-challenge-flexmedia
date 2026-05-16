## 1. Shared Recovery UI

- [x] 1.1 Create a shared kiosk recovery screen component that renders the generic premium error layout.
- [x] 1.2 Add localized generic title/body copy for shared recovery states in all supported locales.
- [x] 1.3 Remove any direct rendering of raw backend messages from the guest-facing recovery body.

## 2. Flow Integration

- [x] 2.1 Route check-in not-found and recovery states into the shared recovery screen with flow-aware copy.
- [x] 2.2 Route check-out recovery states into the shared recovery screen with flow-aware copy.
- [x] 2.3 Preserve the correct retry destination for each recovery code so users return to the right step.

## 3. Validation

- [x] 3.1 Verify the recovery screen remains localized in EN, PT-BR, and ES without mixed-language text.
- [x] 3.2 Verify the recovery screen preserves the kiosk layout in portrait and landscape orientations.
- [x] 3.3 Validate the kiosk build after the recovery screen refactor.
