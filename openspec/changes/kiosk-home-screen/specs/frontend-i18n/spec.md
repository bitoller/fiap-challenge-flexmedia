## ADDED Requirements

### Requirement: Support for three languages
The system SHALL support English, Spanish, and Portuguese-Brazilian with complete translation coverage for all UI text.

#### Scenario: Language files exist
- **WHEN** the frontend initializes
- **THEN** translation files exist at:
  - `src/i18n/locales/en.json`
  - `src/i18n/locales/es.json`
  - `src/i18n/locales/pt-BR.json`

#### Scenario: Complete translation coverage
- **WHEN** user selects a language
- **THEN** all visible text is translated including:
  - Home screen (titles, button labels, subtitles)
  - Footer (copyright, links)
  - Error messages
  - Loading states

### Requirement: Language preference persists to localStorage
The system SHALL save the user's language selection to localStorage so it persists across page reloads and future visits.

#### Scenario: Language selection persists
- **WHEN** user selects Portuguese-BR on the home screen
- **THEN** the language is saved to localStorage under key `kiosk-language`
- **AND** when the page is reloaded, Portuguese-BR remains selected

#### Scenario: Default language on first visit
- **WHEN** user visits for the first time (no localStorage value)
- **THEN** the system detects browser language or defaults to English

### Requirement: React-i18next integration
The system SHALL use react-i18next library for translations, providing a `useTranslation()` hook in components.

#### Scenario: useTranslation hook usage
- **WHEN** a component needs to display translated text
- **THEN** it calls `const { t, i18n } = useTranslation()`
- **AND** it uses `t('key.path')` to retrieve translated strings

#### Scenario: Language switching updates UI
- **WHEN** user clicks a language button
- **THEN** `i18n.changeLanguage('es')` is called
- **AND** the entire UI re-renders with Spanish translations

### Requirement: Namespaced translation files
The system SHALL organize translations into namespaces for modularity (common, home, checkin, errors).

#### Scenario: Namespace structure
- **WHEN** a translator needs to work on a feature
- **THEN** they edit the relevant namespace file (e.g., `home.json` for home screen text)
- **AND** the component imports via `useTranslation('home')`
