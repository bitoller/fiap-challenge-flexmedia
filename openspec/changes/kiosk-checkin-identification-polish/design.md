## Context

The kiosk check-in identification step already supports CPF, reservation number, and QR code lookup. The current implementation is operational, but the screen still reads as visually dense in places and the icon treatment is inconsistent. This change focuses strictly on the identification step and keeps the kiosk shell, hotel branding, and vertical orientation intact.

## Goals / Non-Goals

**Goals:**

- Improve the visual hierarchy of the identification step.
- Make the layout feel more intentional and easier to scan at a glance.
- Replace the awkward clear/backspace icon with a more standard and readable symbol.
- Use a more cohesive icon set across the identification screen.
- Reduce the visual weight of non-primary elements without changing the color palette.
- Keep the QR scanner functional and visually aligned with the rest of the kiosk.

**Non-Goals:**

- Redesign the kiosk header or footer.
- Change the hotel branding system or theme source.
- Alter the supported identification methods or the backend lookup behavior.
- Modify the broader check-in journey beyond the identification screen.

## Decisions

### 1. Keep the same three identification modes

The screen will continue to support:

- CPF
- reservation number
- QR code

The intent is to refine presentation, not to change the flow.

### 2. Rebalance the layout instead of adding more elements

The screen should feel lighter and more guided by:

- reducing visual competition among the left-side method cards
- making the active lookup area the most legible part of the screen
- tightening spacing so the user reads the screen as one clear step

This is preferable to introducing additional UI sections or embellishments.

### 3. Use one coherent icon language

The identification screen should rely on a single icon family with similar stroke weight and visual tone.

Recommended approach:

- keep `lucide-react` for consistency
- replace the custom backspace glyph with a standard backspace/delete icon
- ensure method icons and action icons feel visually aligned

### 4. Treat the QR scanner as a content block, not a separate visual system

The QR scanning area should be integrated into the same page rhythm as the CPF and reservation number modes.

That means:

- the scanner remains square and kiosk-appropriate
- the frame uses the existing palette
- the camera feed should not dominate the page beyond what the interaction needs

### 5. Preserve the existing shell and brand source

The kiosk header, footer, and hotel identity should continue to come from the shared kiosk shell and branding source.

This keeps the identification screen consistent with the home and checkout flows and avoids fragmenting the brand treatment.

## Risks / Trade-offs

- [UX simplification] Removing visual noise can make the screen feel more minimal, so the active state must remain strong enough to guide the guest.
- [Icon consistency] Swapping icons is low risk, but it still requires careful spacing and sizing to avoid introducing new imbalance.
- [Scanner integration] The QR panel must remain obvious enough to use, while staying visually subordinate to the main lookup task.
- [Layout restraint] Because the colors and shell remain fixed, the composition must carry more of the design quality than the palette does.
