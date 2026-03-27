# Design System Document: The Editorial Wealth Experience

## 1. Overview & Creative North Star
**The Creative North Star: "The Private Ledger"**
This design system moves away from the cluttered, neon-heavy aesthetic of retail "day-trading" apps. Instead, it adopts the persona of a high-end digital ledger—an experience that feels as much like a premium financial broadsheet as it does a data tool. 

By leveraging **Editorial Asymmetry**, we break the rigid 12-column grid. Key metrics are not trapped in identical boxes; they are given room to breathe with varying weights and unconventional placements. We use high-contrast typography scales (the juxtaposition of the structural *Manrope* and the functional *Inter*) to guide the eye through complex data sets, ensuring the interface feels authoritative, curated, and bespoke.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in a deep, nocturnal foundation, using vibrancy only to signal financial health and intentional action.

### The "No-Line" Rule
**Borders are prohibited for structural sectioning.** To define the transition between a navigation sidebar and a main content area, or between a header and a list, use a shift in surface tokens (e.g., `surface` to `surface-container-low`). 1px solid lines create visual "noise" that diminishes the premium feel.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. Use the `surface-container` tiers to create organic depth:
*   **Base Layer:** `surface` (#131313)
*   **Secondary Sections:** `surface-container-low` (#1c1b1b)
*   **Interactive Cards:** `surface-container` (#201f1f)
*   **Elevated Overlays:** `surface-container-high` (#2a2a2a)

### The "Glass & Gradient" Rule
For floating elements like "Add Transaction" FABs or Modal headers, use **Glassmorphism**. Apply a background of `surface-variant` at 60% opacity with a `20px` backdrop-blur. 

**Signature Texture:** Use a subtle linear gradient on primary action buttons or high-value growth charts: `primary` (#bbc6e2) transitioning to `primary-container` (#1b263b) at a 135° angle. This adds a "lithographic" soul to the digital interface.

---

## 3. Typography: The Editorial Voice
We utilize a dual-font system to balance prestige with utility.

*   **Display & Headlines (Manrope):** These are the "Editorial" voices. Use `display-lg` for total net worth and `headline-md` for section titles. The wide apertures of Manrope convey openness and modern wealth.
*   **Functional Text (Inter):** All data points, labels, and body copy use Inter. It is the "Workhorse."
    *   **Title-SM / Title-MD:** Use for account names and transaction titles.
    *   **Label-MD:** Use for "Secondary" data like timestamps or metadata.
    *   **Body-LG:** Use for explanatory notes or investment descriptions.

---

## 4. Elevation & Depth: Tonal Layering
In this system, "Up" does not always mean "Shadow." 

*   **The Layering Principle:** Achieve lift by stacking. A `surface-container-lowest` card placed on a `surface-container-low` background creates a "recessed" look, while a `surface-container-highest` card creates a "raised" look.
*   **Ambient Shadows:** For high-elevation elements (Modals, Dropdowns), use a shadow with a blur radius of `32px` and an opacity of `8%`. The shadow color must be derived from `on-surface` (#e5e2e1) to create a natural, atmospheric glow rather than a muddy black stain.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., input fields), use the `outline-variant` (#45474d) at **20% opacity**. This creates a "suggestion" of a boundary without breaking the "No-Line" rule.

---

## 5. Components: Precision & Purpose

### Buttons (The Anchor)
*   **Primary:** Background: `primary` (#bbc6e2), Text: `on-primary` (#263046). Corner Radius: `md` (0.75rem). Use the Signature Gradient on hover.
*   **Secondary (Emerald Growth):** Background: `secondary-container` (#00a572), Text: `on-secondary` (#003824). Reserved for "Save," "Invest," or "Profit" actions.
*   **Tertiary:** Ghost style. No background. Use `primary-fixed` text.

### Cards & Data Lists
*   **The "No-Divider" Rule:** Forbid 1px dividers between transactions. Use `1.5` (0.375rem) vertical spacing between items, or alternate background shades between `surface-container-low` and `surface-container`.
*   **Corner Treatment:** Use `lg` (1rem) for parent containers and `md` (0.75rem) for nested child elements to create a harmonious "nested" aesthetic.

### Input Fields
*   **Default State:** Background `surface-container-highest`, no border.
*   **Active State:** A `2px` "Ghost Border" using `surface-tint` (#bbc6e2) at 40% opacity.
*   **Typography:** Labels must use `label-md` in `on-surface-variant` color.

### Financial Chips
*   **Action Chips:** Used for filtering timeframes (1D, 1W, 1M). Use `surface-container-high` with `on-surface` text. When selected, switch to `primary` background.

---

## 6. Do’s and Don’ts

### Do:
*   **DO** use white space as a structural element. If a screen feels crowded, increase the spacing from `4` (1rem) to `8` (2rem) before adding a divider.
*   **DO** use `secondary` (#4edea3) sparingly. It should be a beacon for growth, not a primary decorative color.
*   **DO** overlap elements. Let a line chart slightly "break" the container of a card to create a sense of dynamic movement.

### Don’t:
*   **DON’T** use pure black (#000000). Always use `surface` (#131313) for the deepest blacks to maintain tonal softness.
*   **DON’T** use standard 1px borders for any container.
*   **DON’T** use harsh "Drop Shadows." If you can see where the shadow starts, it is too heavy.
*   **DON’T** center-align everything. Use intentional left-aligned "Editorial" layouts to keep the interface feeling professional and structured.