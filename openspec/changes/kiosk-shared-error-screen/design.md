## Context

The kiosk currently has separate recovery and not-found experiences in the check-in and check-out flows. Those screens reuse similar visual language, but they still leak backend text in some branches, which causes mixed-language output and inconsistent recovery messaging.

The goal is to centralize the user-facing error experience into a single kiosk pattern that is reusable across both flows while preserving each flow's retry behavior and recovery routing.

## Goals / Non-Goals

**Goals:**
- Provide one consistent, fully localized error/recovery experience for kiosk flows.
- Eliminate raw backend message rendering in the primary error UI.
- Keep flow-specific retry actions intact for check-in and check-out.
- Preserve the premium kiosk visual language and vertical layout behavior.
- Allow the UI to express generic errors when the backend code is unknown or unmapped.

**Non-Goals:**
- Changing backend error contract semantics.
- Adding new backend endpoints or error codes.
- Reworking the success, summary, payment, or identification steps beyond how they route into recovery.
- Exposing technical diagnostics to the guest-facing screen.

## Decisions

### 1. Use a shared kiosk error shell for all recovery states
The application should render a single recovery pattern for check-in and check-out instead of maintaining multiple visually different error pages.

**Why:** The kiosk should present one coherent recovery experience. A shared shell avoids duplicated layout code and ensures the visual tone remains consistent.

**Alternatives considered:**
- Separate pages per flow: rejected because it fragments the UX and encourages message drift.
- One shared component only for the body text: rejected because layout and actions also need to stay consistent.

### 2. Treat backend text as non-authoritative for the guest screen
The UI should map backend codes to localized labels and bodies. Raw backend messages may be retained in state for logging or troubleshooting, but they should not be rendered as the primary content unless explicitly mapped.

**Why:** Mixed-language output and technical phrasing are both symptoms of showing backend messages directly to guests.

**Alternatives considered:**
- Show backend messages with simple filtering: rejected because it still leaks language and operational details.
- Translate backend messages in place: rejected because it is brittle and couples UI to backend wording.

### 3. Keep flow-specific retry destinations
The shared screen must receive enough context to route back to the correct step for each flow.

**Why:** Check-in and check-out recover differently. The same screen can be shared, but the CTA logic cannot be fully generic.

**Alternatives considered:**
- Always return to home: rejected because it forces users to restart unnecessarily.
- Always return to the flow root: accepted only as a fallback when the original step cannot be determined.

### 4. Use a generic visual treatment with a single premium card
The shared screen should use a centered card treatment aligned with the kiosk aesthetic, with a concise heading, short supporting copy, and two action buttons.

**Why:** The error state should feel like part of the same product system rather than an exception page.

**Alternatives considered:**
- Full-screen alert styling: rejected because it feels too harsh and less premium.
- Reusing the exact recovery screens as-is: rejected because they still contain duplicated logic and mixed-content edge cases.

## Risks / Trade-offs

- [Risk] Localized text can still diverge in length across EN/PT/ES → [Mitigation] reserve consistent card widths/heights and keep copy intentionally short.
- [Risk] Some recovery states may lose a specific backend message that could have been useful to the guest → [Mitigation] preserve technical details in state/logging while showing guest-safe copy.
- [Risk] Shared screen changes may affect multiple flows at once → [Mitigation] keep flow-specific retry routing isolated and validate both check-in and check-out paths after implementation.
- [Risk] Over-generalizing the error page could hide important distinctions between not-found and generic failures → [Mitigation] preserve code-based variants and map them to distinct localized titles/bodies where appropriate.
