# Kiosk Footer Legal and Support Actions

## Why

The kiosk footer exposes legal and concierge actions, but both links currently behave as placeholders. Guests need a reliable way to read stay, privacy, and biometric terms without losing progress in the current flow, and they also need a quick way to request help from reception when they are blocked.

## What Changes

- Add a localized privacy and biometric policy screen reachable from the kiosk footer.
- Preserve the current kiosk flow when a guest opens the policy page and returns.
- Convert the concierge footer action into a real support request that records an admin audit event for the active hotel and kiosk.
- Show a short localized confirmation message after reception is notified.

## Impact

- Kiosk frontend gains a legal route, legal translations, and footer interaction state.
- The concierge action reuses the existing admin audit event endpoint, so no database migration is required.
- Existing check-in, checkout, and identity verification state remains owned by the current flow providers.
