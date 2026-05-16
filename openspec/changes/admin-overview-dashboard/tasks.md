## 1. Overview data model

- [x] 1.1 Review the current dashboard payload and decide which fields should feed KPI cards, the live activity panel, and system health.
- [x] 1.2 Shape the overview data into display-friendly structures so the UI no longer depends on raw JSON output.
- [x] 1.3 Define any missing fallback values needed for loading, empty, and error states.

## 2. Overview layout and visual design

- [x] 2.1 Rebuild the overview page layout to follow the reference composition: title, description, KPI cards, main trend card, activity panel, and lower performance section.
- [x] 2.2 Update typography, spacing, borders, shadows, and palette to match the premium hotel-dashboard mood in the image.
- [x] 2.3 Make the layout responsive so the structure still reads well on smaller screens.

## 3. Functional dashboard sections

- [x] 3.1 Render the KPI cards from real dashboard data.
- [x] 3.2 Replace raw activity dumps with readable operational rows and metadata.
- [x] 3.3 Add a usable system-health summary and refresh interaction.
- [x] 3.4 Add the unit-performance section using the best available backend data or a clear fallback representation.

## 4. Reliability and polish

- [x] 4.1 Add loading, empty, and error states that feel intentional and consistent with the rest of the portal.
- [x] 4.2 Verify hotel switching refreshes the overview correctly.
- [ ] 4.3 Smoke test the overview against real backend data and adjust any mismatched display labels or mappings.
