## ADDED Requirements

### Requirement: Canonical runtime behavior remains unchanged
The system SHALL preserve the validated kiosk, checkout, admin, and reservation behavior while the codebase is cleaned up. Cleanup work SHALL not alter the expected Oracle-backed runtime path for these flows.

#### Scenario: Critical flows still work after cleanup
- **WHEN** the kiosk check-in, kiosk checkout, admin login, admin dashboard, and reservation create/delete flows are executed after the cleanup
- **THEN** each flow SHALL continue to complete successfully using the same persisted runtime behavior as before the cleanup

### Requirement: Redundant active-path code is removed or isolated
The system SHALL avoid maintaining duplicate active-path implementations for the same operation. If a compatibility layer must remain, it SHALL be clearly isolated from the canonical path and SHALL not be presented as the primary implementation.

#### Scenario: Single canonical path is visible in the active runtime
- **WHEN** a developer inspects the active frontend and backend runtime paths for check-in, checkout, admin, or reservation operations
- **THEN** each operation SHALL have one clear canonical implementation and any remaining compatibility layer SHALL be explicitly labeled as such

### Requirement: User-facing errors are clear and consistent
The system SHALL return error responses with stable codes and human-readable messages. Validation, business, and unexpected failures SHALL be distinguishable without exposing raw stack traces to the user.

#### Scenario: Validation and business errors remain actionable
- **WHEN** a request fails due to invalid input or a domain rule violation
- **THEN** the system SHALL return a clear message and a stable error code that explains what the user or operator needs to fix

#### Scenario: Unexpected errors stay generic but readable
- **WHEN** an unhandled failure occurs
- **THEN** the system SHALL return a safe, human-readable message that does not expose internal stack traces or low-level exception details

### Requirement: Legacy fallback behavior is not the default runtime path
The system SHALL treat legacy mock or fallback paths as compatibility behavior only. Normal operation SHALL rely on the canonical persisted runtime paths, and any fallback that remains SHALL require explicit opt-in or documented justification.

#### Scenario: Normal runtime does not rely on fallback paths
- **WHEN** the kiosk or admin portal starts with the standard runtime configuration
- **THEN** it SHALL use the canonical persisted implementations rather than mock or fallback behavior

#### Scenario: Compatibility paths remain clearly identified
- **WHEN** a legacy fallback remains in the codebase for compatibility
- **THEN** it SHALL be clearly identified as non-canonical so future cleanup work can remove it safely later
