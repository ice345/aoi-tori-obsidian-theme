# PLANS.md

This project is complex enough to justify a durable execution plan. Keep this file concise, current,
and evidence-based.

## 2026-09-14 control geometry and atmosphere audit

- Scope: audit square-looking buttons and theme-wide aesthetic gaps; produce a Chinese problem,
  implementation and acceptance report. Documentation only, preserving the uncommitted icon
  integration and all theme source. Compare current native CSS rather than assuming all buttons have
  the same DOM or radius.
- Method: source/official-reference review plus isolated native-CSS computed controls and state
  checks; distinguish confirmed cascade defects, aesthetic recommendations and untested surfaces.
- Status: batch 1 done. G03 and G04 are fixed and gated; batches 2-4 are open.
- G03, dark mobile hover. Native `.is-mobile.theme-dark` is two classes, so it outranks the theme's
  single `.theme-dark` and re-points `--interactive-normal` and `--interactive-hover` at the two
  border tokens. On a phone a normal button's resting fill became the border colour and its hover
  fill the sky accent `#7FC3E8`, under `--text-normal`: measured **1.60:1** on an enabled button
  carrying text. The fix names the control surfaces as their own role in the semantic layer
  (`--aoi-control-surface`, `--aoi-control-surface-hover`, `--aoi-field-surface`,
  `--aoi-hover-surface`) and restores them from `body.theme-dark.is-mobile`, which is two classes
  and an element and so outranks the native rule on specificity rather than on load order. Hover is
  now **7.51:1**. Same root cause also left the field fill equal to its own border.
- G03b, an unreported failure the audit did not list. Native `.is-mobile button.mod-warning` sets
  `background-color: var(--interactive-normal)`, so a delete button lost the rose surface it has on
  the desktop. Against the border-coloured fill its resting text measured **3.91:1**, below the
  4.5:1 floor for enabled text. Restoring the destructive fill under `body.is-mobile` puts it at
  **7.36:1** on the intended `#3b1f2a`. The text colour was already correct.
- G04, disabled states. The disabled block was declared before the enabled rules, and
  `input[type="text"]` and `input:hover` are both one pseudo-class and an element, so they
  re-applied the fill, the border and the shadow to a disabled field. Native's
  `textarea:disabled, input[type="date"]:disabled, ...` is two pseudo-classes and an element, so the
  theme also lost the opacity and rendered native's 0.5 instead of 0.68. The block now comes last
  and carries the attribute forms, and the press decoration is guarded with
  `:where(:not(:disabled):not([aria-disabled="true"]))` so it stays at base specificity. Measured:
  opacity 0.5 to 0.68, resting shadow and hover lift gone, press displacement gone, and enabled
  controls keep their hover shadow and their 1px press.
- Gate. `npm run scenarios` gains the native mobile rules in its contract, an assertion that the
  control surfaces resolve identically on the desktop and on a phone in both modes, and an assertion
  that a disabled field has no shadow and no fill change on hover while an enabled one keeps its
  hover shadow. Reverting the token fix reports
  `--interactive-hover is #394b58 on the desktop and #7fc3e8 on a phone`; reverting the disabled
  scoping reports the resting shadow, the hover lift and the fill change. `box-shadow`, `opacity`
  and `transform` joined the watched properties.
- G03c, a regression this batch introduced and then fixed. The first version of the destructive
  restoration was `body.is-mobile button.mod-warning`, two classes and two elements, against the
  theme's `button.mod-warning.mod-cta` at two classes and one element. It therefore repainted a
  primary destructive button with the secondary rose and collapsed the two destructive levels on
  phones only: `#7f2a39` became `#3b1f2a`. Scoping it with `:where(:not(.mod-cta))` keeps the same
  specificity while leaving a primary button to the rule that already handles it. Caught by
  measuring the primary and secondary surfaces against each other rather than by reading the rule.
- Also verified while checking this: keyboard focus is unchanged. Inputs, buttons and icon buttons
  all take a 2px solid cobalt outline under `:focus-visible`, identically before and after, and the
  enabled input keeps native's focus border and inset shadow. The disabled work stays on the
  disabled side of the cascade and does not raise the enabled base rule's specificity.
- G01, icon shape. `.clickable-icon` read `--radius-s` directly, so the theme supplied 4px in every
  mode and native's `--clickable-icon-radius` was never consulted. On a phone native sets that to
  the 44px touch size and the theme ignored it. The icon now consumes the native variable, and the
  theme's value is declared on `body` rather than in the mode layer: a mode-layer selector is a
  class and would outrank `.is-mobile`, pinning a phone to the desktop corner. Measured: 4px becomes
  8px on the desktop and 44px on a phone.
- G02, button shape. Buttons and fields both read `--input-radius`, so a button could not round
  further than the field beside it without moving every input, search box and settings row. Buttons
  now read `--button-radius`, native's own interface, at 10px; fields stay at `--input-radius`, 8px.
  `--input-radius` deliberately stays in the mode layer, because the audit keeps fields at 8px in
  every mode - a field is a writing container rather than a touch target - while the icon role is
  one the platform owns.
- The four shape primitives live in `primitives.css` (`--aoi-radius-button`, `-field`, `-icon`,
  `-toolgroup`; the last is for G07). The stylelint prefix list gained `button` and `clickable`,
  both real Obsidian interfaces read out of `app.css` rather than invented.
- G05, selector crosstalk. Two real defects, both measured. A `button` that is also
  `.clickable-icon` inherited the text-button surface, border and shadow, so the same icon rendered
  with a box around it when a plugin used a button and without one when it used a div. And the field
  hover rule was `input:hover`, wider than the base rule's explicit type list, so hovering a
  checkbox, radio, range or colour input painted a form-field fill, a border and a shadow behind a
  control the theme never styles at rest. The icon exclusions use `:where()`, which keeps the
  element selector's own specificity, and the hover rule now lists the same types as its base.
- G07, canvas tool group. Native rounds `.canvas-control-group` through `--canvas-controls-radius`
  and clips it, so the square edges between items are the group's structure and not a defect. The
  theme's role is 12px and it is declared on `body` for the same reason as the icon radius, so
  `.is-mobile` can still supply the 40px touch radius. Measured: group 12px, items 0px, overflow
  hidden.
- G06, shadow roles. A field and a button shared `--input-shadow` and `--input-shadow-hover`, so
  every settings row read as a small card. A field is bounded by its border, which already carries
  the 3:1 control floor, so it needs no outer lift; a button keeps one because it is a discrete
  action. The roles are separate tokens (`--aoi-shadow-control`, `--aoi-shadow-field`), and
  `--input-shadow` points at the control role rather than the field one because native consumes it
  for surfaces the theme does not own - selects, combobox buttons, the Canvas group. That is the
  value it already held, so those consumers are unchanged. Native's
  `select:not(:disabled):not(.mod-disabled):hover` is three pseudo-classes and an element and beat a
  plain `select:hover`, so the fill guard is mirrored to keep selects consistent with fields.
- While here: `--aoi-radius-field` was documented in DESIGN.md but never consumed - the field was
  still reading `--radius-m`. Both are 8px so nothing rendered differently, but doc and source
  disagreed; the field now reads its own role.
- The disabled-field guard assertion was reworded. It required a hover shadow, which was the correct
  test before G06 and the wrong one after: a field now signals hover through fill and border. It
  asks that hovering an enabled field changes something.
- G09, Callout space levels. The default padding moved to 18px 20px while Airy stayed on the spacing
  scale at 16px 20px, so choosing the airier option made a Callout _tighter_ than the default it was
  meant to open up. Airy is now 22px 24px, and the three levels are literal values rather than scale
  steps so they keep their order whatever the scale does. Gate:
  `vertical padding runs 8 / 18 / 16 for quiet / default / airy; the levels are out of order`.
- Building that gate found a harness bug. `evalTokens` returned a multi-value declaration as a raw
  token list without resolving each token, so every `var()` inside one -
  `--callout-padding: var(--a) var(--b)` - read back as two variable references and no assertion
  could see through it. Each token is now resolved. The native spacing scale and `--border-width`
  also joined the contract, so a scale change that breaks the callout ordering fails rather than
  reading as unresolved.
- G08, density and touch geometry. Measured before changing anything, and the audit's premise did
  not hold here: `.text-icon-button` tracks the density exactly as a plain button does (34 / 32 /
  38px against `--input-height`), not the ~25px of the audit's fixture, and the themed mobile touch
  containers already reach the 44px project target - `.view-action`, `.mobile-navbar-action` and
  `.mobile-toolbar-option` all measure 44 x 44 or wider, as do the field and the buttons. The audit
  also warns against giving `.clickable-icon` a forced global size, and the small bare icon in its
  own fixture is explicitly not to be read as a global mobile defect. So this item closes as
  **verified and gated rather than changed**: the gate holds the density token at 32 / 34 / 38px and
  the three touch containers at 44px, and DESIGN records which geometry follows density and which is
  deliberately left to the glyph. What is _not_ verified is the alignment of an icon against a text
  button inside a real toolbar row, which needs the client.
- G10, motion scope. The durations were at `:root`, so native's `body` outranked them and
  `--anim-duration-fast` resolved to native's 140ms rather than the theme's 120ms - the same scope
  defect as the geometry. They are declared on `body` now, and the reduced-motion zeroing moved with
  them so native cannot win under the preference either. Measured with the native stylesheet loaded:
  `--anim-duration-fast` is `0.12s`. The reduced-motion guard in `accessibility.css` turns
  transitions and transforms off as _properties_, so it never depended on these tokens and is
  unaffected.
- G11, writing direction. The quote and Callout accents sit on the inline-start edge, but their
  corners were written physically as `0 r r 0`, so under RTL the accent moved and the square corners
  stayed on the wrong side. They now use the four logical corner properties, and the wash gradient's
  direction moved into `--aoi-wash-direction`, which `.mod-rtl` reverses. Verified in a browser with
  `direction: rtl`: the accent edge keeps its square corners and the wash flips.
- Not covered: real touch on a device, real pointer hover, RTL, and the shapes of batches 2-4.

## 2026-09-14 Callout icon integration

- Authorized: integrate the accepted original icons into theme source, default 22 px icons and
  circular badges, align the custom Callouts with the preview, publish a consolidated usage guide,
  and feature them in README. Existing concept changes belong to this task and are preserved.
- Naming: `aoi-` namespace for new types; `aoi-tori` remains the falling feather. Provide distinct
  light/ink feather types; keep `second-voice` and previously previewed instrument names as aliases.
- Implementation: a dedicated imported CSS module with native SVG strings, semantic geometry and
  color roles, standard-type fallback isolation, and no plugin dependency. Keep native fold icons.
- Validation planned: generated CSS, native SVG parsing behavior, deep/light surfaces, nesting,
  aliases and complete repository check; distinguish isolated rendering from actual-client tests.
- Status: complete. Added `src/editor/callout-icons.css`, semantic defaults, consolidated
  `docs/CALLOUTS.md`, a README icon illustration and copyable examples; updated preview defaults,
  architecture/design/DOM/testing records, and alias/nesting regression checks.
- Validation: `npm run check` passes; isolated native-CSS rendering passed 858 assertions and both
  modes were visually inspected. Generated `theme.css` rebuilt from source; `git diff --check`
  passes. Original/native stroke tests use float tolerance for Lightning CSS float32 numbers.
- Remaining: actual-client folding/keyboard, physical devices, forced-colors visual verification,
  and 1.14.x testing. The existing local test-vault link targets a different checkout and was
  preserved. No commit, push, version bump or release performed.

## 2026-09-14 expanded icon study

- User follow-up: add trumpet, distinguish tuba/euphonium structurally, and draw additional original
  motifs informed by the official film site and interview. Extend the existing concept page and
  recommendation; preserve the theme source and all earlier candidates.
- Decision: select a rotary tuba and piston euphonium as distinguishable representative forms, not
  universal instrument definitions. Atmospheric motifs are design interpretations, not claims of
  official symbols. Existing uncommitted concept files belong to this ongoing task.
- Status: complete. Added trumpet and six atmospheric motifs, redrew the two low-brass icons, and
  expanded the page to 15 candidates with a separate equal-size brass comparison. Updated the
  Chinese recommendation with source distinctions, purposes, and remaining recognition risks.
- Validation: all 15 SVGs parse as XML; nine new/revised selections and mode/size/badge controls
  verified in the in-app browser; light/dark visual inspection and 390 px layout without overflow.
  `npm run check` and `git diff --check` pass. Generated `theme.css` remains byte-identical at the
  SHA-256 recorded below. No theme integration, dependency, or release changes.
- Remaining: real Obsidian rendering and instrument-recognition validation before integration.

## 2026-09-14 original Callout icon study

- Scope: explore a more feather-like Aoi Tori mark and original flute, oboe, tuba/euphonium and duet
  motifs, with small-size and light/dark previews. Preserve the current repaired theme.
- Decision: the user's request opens original icon design beyond the earlier native-icon-first
  recommendation. This is a concept study, not permission to copy reference outlines or replace
  native safety/control icons. No theme integration or new runtime dependency in this pass.
- Deliver original SVG concepts and a self-contained comparison page under
  `docs/concepts/callout-icons-2026-09-14/`, plus a Chinese design recommendation.
- Status: complete. Delivered eight original SVGs, a standalone interactive comparison page, and a
  Chinese design/integration recommendation. Reviewed reference imagery and official
  narrative/instrument sources; no borrowed SVG paths or bundled reference artwork.
- Validation: SVG XML parsing, isolated Chromium light/dark screenshots, all eight selections,
  size/badge/mode controls, and a 390 px layout without horizontal overflow. The narrow-layout theme
  button was subsequently constrained to one line. `npm run check` and `git diff --check` pass.
  Generated `theme.css` remains byte-identical (SHA-256
  `acc216c811128b0e9f9bae1995446740de0b9e34a9d7270eb529079f16510932`).
- Remaining: actual Obsidian SVG injection, native style interaction, accessibility/device
  verification, and instrument recognition testing before integration. Theme source is unchanged.

## 2026-09-13 dark surface audit and repair proposal

- Scope: investigate the supplied dark Callout screenshot and adjacent component surfaces; deliver
  `docs/dark-surface-audit-2026-09-13.md` in Chinese. Documentation and ignored audit evidence only.
- Baseline: clean worktree at `e65b220`; preserve source CSS and release metadata. Regenerate
  `theme.css` through the quality gate and verify that it remains byte-identical.
- Inspect source, native Obsidian 1.13.7 CSS, computed rendering, settings interactions, and
  existing test coverage. Separate confirmed defects, low-separation design risks, and untested
  interactions.
- Decision: earlier implementation plans are historical context, not authorization to implement
  proposed fixes in this audit. No theme changes, commit, push, or release in this pass.
- Status: complete. The report identifies Callout blend-mode and inherited geometry failures,
  missing default active-line/image aliases, code default mismatch, incomplete border propagation,
  and Callout setting/alias inconsistencies. Current-client native CSS plus isolated DOM covered 27
  scenarios / 48 nodes each; these are not full Obsidian interaction tests.
- Validation: `npm run check` passes (45 contrast pairs and 582 scenarios); `git diff --check`
  passes. The initial check stopped on this new plan entry's formatting, which was corrected.
  Generated `theme.css` remains byte-identical at SHA-256
  `66f7d394ac38b3b7e67ffdcba942042fca656bdb29d7d64ed6f1fe8f5d0bbd55`.
- Remaining: implement and visually validate the proposed fixes, then perform the documented
  interaction, plugin lifecycle, accessibility, and device regressions. No source fixes in this
  pass.

## 2026-09-13 dark surface repair

Implementation of `docs/dark-surface-audit-2026-09-13.md` stages T2, T3 and T5. No version bump,
commit, push, or release. `theme.css` regenerated from source; `npm run check` passes.

- **T2 Callouts (D01/D02)** — Callouts declare `--callout-blend-mode: normal`, because the native
  chain resolved to `lighten` in dark mode and the dark surface was darker than the body, so the
  container was cancelled channel by channel and only the wash edge survived. The outer element now
  paints the dedicated `--aoi-callout-surface` role (`--aoi-night-panel` in dark, unchanged
  `--aoi-cloud-cool` in light) instead of borrowing `--callout-content-background`, whose native
  meaning is the inner content layer. `--callout-border-width: 2px` and `--code-border-width: 1px`
  moved from `:root`, where Obsidian's `body` declarations outranked them, to the mode classes.
- **T3 defaults (D03/D04/D05)** — `--aoi-active-line-background` and `--aoi-image-selection-color`
  moved into the mode blocks, where the native variables they reference actually exist; at `:root`
  they were invalid at computed-value time, which is why the default active line was transparent and
  the theme's own selected-image outline never rendered. The selected-image default is now Cobalt in
  both modes, matching the shipped setting default so the no-plugin and default-class appearances
  agree.
- **T5 Callout family (D07/D08)** — the wash strength is resolved on the Callout element in two
  layers: a per-element type default and a user override that always wins. Quiet and Airy previously
  never reached the types whose rule was declared on the element, so the setting could not be used
  to make a Callout visible. `attention` and `missing` now join the warning and failure families.
- **Gate (T1)** — `npm run scenarios` now carries a native core contract: a minimal hand-written
  reproduction of the six `app.css` declarations these values lose to, parsed before `theme.css` so
  it carries the lowest source order. Ten assertions cover both modes. Two harness fidelity gaps had
  to be closed first, and both were found by running the assertions against the pre-repair tree:
  inherited declarations were being resolved in the consumer's context instead of where they are
  declared, and the mode class was on `html` as well as `body`, which let `:root` aliases match the
  mode block. With both corrected the ten assertions fail on the pre-repair build and pass now, and
  the existing 582 scenarios are unchanged with no new skips.
- **Verified** — an isolated Chromium page loading the saved native `app.css` 1.13.7 and the built
  `theme.css`, run against both the previous and the current build: `mix-blend-mode` `lighten` ->
  `normal`, inline-start edge `0px` -> `2px`, dark surface `#1A2027` -> `#2C343C` (1.15:1 against
  the body) with a 7.54:1 semantic edge, code border `0px` -> `1px`, active line and selected-image
  outline restored. A 25-type x 2-mode x Quiet/Balanced/Airy matrix confirms the setting now reaches
  every type. Values, not screenshots; no real-note capture was taken.
- **Not done** — T4 border roles (D06) and the T6 weak-hierarchy pass (R01), plus the R02 default
  scope drift for Callout radius (still 4px rather than the declared 8px), heading weight and
  `--font-text-theme`. The audit sequences those as their own controlled stages, and R02 warns that
  migrating the rest of `typography.css` would move accepted typography. Real Obsidian interaction,
  plugin lifecycle, Canvas/Graph/Bases, Windows High Contrast and device regressions remain open.

## Open work

The outstanding items, gathered from `docs/dark-surface-audit-2026-09-13.md` (T-steps, section 8,
section 10), `docs/implementation-review-2026-09-13.md` (section 6) and the Untested rows in
`docs/TESTING.md`. Stages T0-T3, T5 and T8 are complete; this is what remains.

Suggested order: A1 -> B5 -> A2/A3 -> C3 + C1 -> the rest.

### A. Source defects

- [x] **A1 - D06 border roles.** Done. Components consumed the `--aoi-ice-border` /
      `--aoi-night-border` primitives directly, so the Border strength, Stronger borders and High
      contrast settings only moved `--background-modifier-border` and reached almost nothing.
      `--aoi-border-structural` (decorative dividers) and `--aoi-border-control` (inputs, unchecked
      checkboxes) now sit between the primitives and the components; focus, selection and semantic
      edges keep their own colours and are not weakened. The control role starts at the 3:1 non-text
      minimum and no level lowers it, including Soft. `--table-header-border-color` was a second,
      separately declared table variable that also had to be routed. Verified in Chromium: all eight
      components take four or five distinct values across the levels, and the gate fails on the
      pre-repair tree.
- [x] **A2 - R01 weak hierarchy.** Done for the structural collapses. The dark table header shared
      `--aoi-night-canvas` with the zebra rows, so a header cell and an alternating row were the
      same colour and the table had no header hierarchy at all; it now takes the panel, which
      measures 1.154:1 against the page and 1.315:1 against the rows. The header grid took a second,
      weaker mix of the same border role, leaving it within 1.53:1 and 1.44:1 of the page; it now
      uses the role directly. The highlight sat at 1.126:1 in dark and 1.060:1 in light, below the
      1.15:1 container separation, and both are frozen washes now measuring 1.358:1 and 1.181:1. All
      four are asserted in the gate and fail on the pre-repair tree. Deliberately unchanged: **menu
      and modal backgrounds equal the page**, which the audit states is not automatically an error
      because the native border and shadow carry the layer; the **Properties fill** stays at canvas,
      because the audit's remedy for it is the boundary and A1 already routes
      `--metadata-border-color` through the structural role; and the **in-document search
      highlight** is drawn by Obsidian's own hardcoded colours rather than a theme token, so it can
      only be judged in a real client (C3).

- [x] **A3 - R02 default scope drift.** Done for geometry, and the finding is larger than the three
      names R02 listed. Diffing every theme `:root` declaration against the native `body` set: 65
      names clash and **41 of them held a different value from the one the theme intends**, so the
      theme was rendering Obsidian's defaults for Callout and input shape, the Properties card and
      settings row radius, `--radius-xl`, and the active navigation weight. 13 geometry and
      interaction values moved into the mode layer and are asserted in the gate; 24 of the 65
      happened to coincide with the native value and needed nothing. **Deferred, 27 typography
      names.** Not applied, because doing so would change typography the accepted screenshots
      already show, and R02 warns against migrating the whole file at once. Each needs its own
      before/after decision: font stacks (3) `--font-text-theme`, `--font-interface-theme`,
      `--font-monospace-theme`; heading families, sizes, line heights and letter spacing (21)
      `--h1-font` through `--h6-font`, `--h1-size` through `--h6-size`, `--h1-line-height` through
      `--h6-line-height`, `--h1-letter-spacing` to `--h3-letter-spacing`; reading metrics (3)
      `--line-height-normal` (intent 1.75, actual 1.5), `--line-height-tight` (1.35 vs 1.3) and
      `--file-line-width` (760px vs 700px). The gate deliberately does **not** assert these, so they
      cannot be changed by accident.

### B. Gates and automation

- [x] B0 - section 8.2.1 native consumption contract. Done.
- [x] **B1 - section 8.2.2 browser computed-style test.** Done without adding a dependency. The
      audit asks to settle the local-versus-CI conditions and prefer the existing runtime, so rather
      than ship a headless-browser devDependency the harness now resolves **real properties** on
      synthetic elements, not only custom properties. `collectRules` records a watched property set
      alongside the custom ones, `resolveElementProperty` cascades those declarations and
      substitutes `var()` against the element's own resolved custom properties, and the native
      contract gained the rules Obsidian uses to consume them
      (`.callout { mix-blend-mode: var(--callout-blend-mode); border-width: var(--callout-border-width) }`).
      Obsidian's own stylesheet is still never bundled. Two obstacles had to be solved. Lightningcss
      returns shorthand declarations containing `var()` as `unparsed`, so the whole `.callout` rule
      was opaque; the `unparsed` shape does expose `propertyId` and the token list, and a
      shorthand's first token is the width. And `mix-blend-mode` is never declared by the theme at
      all — it is consumed by native — which the contract now models. The four assertions fail on
      the pre-repair tree with the same values the browser measured: removing
      `--callout-blend-mode: normal` reports `resolved to darken` / `lighten`, and moving
      `--callout-border-width` back to `:root` reports `resolved to 0px, expected 2px`. The Chromium
      fixture stays as the independent cross-check; the harness is the CI gate.

- [x] **B2 - section 8.2.3 final pixel test.** Done as `scripts/check-pixels.mjs`, which reads the
      PNGs, decodes them without a dependency, samples outside the container, the inline-start edge
      and three points along the wash, and asserts within a documented tolerance. It is deliberately
      **not** part of `npm run check`: a real pixel test needs a renderer, and putting a browser in
      CI for a static-CSS theme is the dependency the audit asks to avoid. The capture procedure,
      the 1.25 devicePixelRatio and the 3-per-channel tolerance are recorded in the script header
      and in `docs/TESTING.md`. Evidence: against the pre-repair build it reports "the Callout
      interior painted `#222A30`, the same as the page; the container is invisible" in dark and "the
      inline-start edge painted `#EDF2F3`, expected `#245F90`" in light; against the current build
      both modes pass and paint the surface, the semantic edge and a fading wash.
- [x] **B3 - section 8.2.4 default consistency test.** Done, and it found a real defect. Style
      Settings applies thirty classes **and** writes its five variable settings as inline custom
      properties on `body`, where they outrank every selector. Modelling both states in the harness
      showed the theme rendering two different reading surfaces for the same defaults:
      `--line-height-normal` was 1.5 without the plugin and 1.75 with it, and `--file-line-width`
      700px against 760px, because both were declared at `:root` and lost to the native `body`
      values while the plugin's inline values won. Both moved into the mode layer, exactly where the
      A3 geometry went, and the two states now agree on every token in both modes. The gate asserts
      zero differences, so a future setting that only the plugin can apply fails. Note this is a
      visible change for no-plugin users: the reading surface moves from 1.5/700px to the 1.75/760px
      the theme always intended and the plugin already delivered.
- [x] **B4 - section 8.2.5 state and nesting test.** Done for the structural half. A nested
      `.callout[data-callout="info"]` inside an `error` one is compared against the same type
      standing alone: the audit's warning was that the type default would be inherited rather than
      declared per element, and moving that default onto the mode block reproduces it as "nested
      info resolves 5.00% but standalone info resolves 6.00%; nesting changed the type resolution".
      The colour is checked the same way, and code inside a Callout must keep its own
      `--code-border-width: 1px` rather than inheriting the container. Building this exposed a
      harness bug rather than a theme one: `var(--x, fallback)` ignored the fallback, so the whole
      two-layer strength design read as unresolved. The fallback is now evaluated, which is what the
      browser does and what the design depends on. Not covered, because they are interactions rather
      than resolutions: a Callout holding an image, a quote or a table, and same-fill states
      distinguished by their full signal set. Those need a real client and are listed under C and D.

- [x] **B5 - section 8.3 reverse tests.** Done, all eight. Five were already covered (blend, Callout
      width, code width, active-line alias, image-selection alias) and A1 added the sixth (Stronger
      borders changing only the shared token). The last two need a Callout element rather than the
      body, because the wash strength and the type colour resolve on the element: - a fixed wash on
      the safety family fails with 24 reports, one per type per setting; - a brighter Callout
      surface fails on link contrast: at the current `#2C343C` the Airy 7% wash leaves the link at
      4.68-4.74:1, and the mutated surface drops it to 2.15:1.

### C. Real-environment regression

- [ ] **C1** Style Settings lifecycle: install, defaults, reset, plugin disabled; confirm reset
      really removes the old setting classes (audit 7.4).
- [ ] **C2** Cloud / Mist / Aqua to Duet migration.
- [ ] **C3** Canvas, Graph, PDF, Bases, sidebar search and backlinks, against the root
      `.view-content` fill and the transparent sidebar leaves. Recorded as an open regression in
      `docs/obsidian-dom.md`.
- [ ] **C4** Pop-out, two-note split, single sidebar, both sidebars hidden, narrow window,
      phone-class, and 90% / 100% / 110% zoom.
- [ ] **C5** Real Windows High Contrast. The simulated matrix passes 198 combinations; the platform
      check is outstanding.
- [ ] **C6** Physical iOS / iPadOS / Android, safe areas, virtual keyboard, long press, swipe,
      pinch, RTL, assistive technology.

### D. Callout interaction matrix (audit 10.1, none done)

- [ ] Full family of 30 types / aliases / unknown; content volume (empty, single line, long title,
      long body, collapsed); two and three level nesting; Reading / Live Preview / Source; first,
      middle and last code line plus Quiet and Bordered; active line Off / Subtle / Clear with
      selection and Vim; image mouse and keyboard selection, resize and Lightbox; Properties, table
      and Bases across resting, hover, edit, focus, selected and disabled; controls and overlays in
      their error and disabled states.

### E. Release

- [ ] **E1** Clean-vault install test. The Obsidian launch in `docs/release-install-test.md` is
      incomplete; redo it after quitting Obsidian normally or on a fresh account, then confirm theme
      selection, light/dark switching, Style Settings absent and present, restart persistence, and a
      clean Console.
- [x] **E2** Release package verified. `npm run package` from a clean `dist/` produces
      `dist/Aoi-Tori/{theme.css,manifest.json}`, 91391 and 142 bytes, with SHA-256 reported for
      each. The packaged CSS contains no `src/` reference, no `node_modules`, no local path, no
      remote http/https resource, no `@import`, no `@font-face` and no Base64 asset; it has zero
      `!important` and zero `:has()`, and it parses cleanly with lightningcss. Version stays 0.9.0;
      a real release still needs the E1 launch and a version decision. verification.

### F. Deferred

- [ ] **F1** `[!bluebird]`. `lucide-bird` is not registered in the local client; no remote SVG or
      guessed id was added.
- [ ] **F2** Obsidian 1.14.1 Catalyst compatibility: coloured highlight, Bases layout and input
      hover changes need separate verification. Do not raise the target version without testing it.
- [x] **F3** Division of labour documented. The four accessibility settings are tabulated in
      `docs/DESIGN.md` and each now carries a description in the Style Settings metadata, including
      the deliberate limit that the High contrast toggle does not touch borders.
      `prefers-contrast: more` and Stronger borders so each setting name matches what it actually
      does (audit 7.3).

### Gate coverage note

The gate can see colour and tokens: 45 contrast pairs, 582 scenarios and 10 native-contract
assertions. It cannot see border width, blend mode, gradient compositing or an element's final
paint, so defects of the A1 and A2 kind will still pass.

## 2026-09-13 implementation review

- Scope: review the current Phase 6 implementation against the aesthetic handoff; do not fix theme
  code in this pass.
- Review source/settings cascade, reproduce the quality gates, inspect saved final screenshots, and
  document actionable findings in `docs/implementation-review-2026-09-13.md`.
- Status: complete; see the review document for three actionable findings, remaining validation
  gaps, and the next implementation sequence. Theme source and existing user changes are preserved.
  Full check currently fails CSS lint; independent audit, contrast, and manifest checks pass.

## 2026-09-13 review fixes

Implementation pass addressing `docs/implementation-review-2026-09-13.md`. No version bump, commit,
push, or release packaging; Phase 5B/6 remain uncommitted.

- **R3** — added the missing empty line before the new primitive comment. `.omp/config.yml` and
  `checkout-diff.md` are local working material, not project sources; both are now listed with
  explanatory comments in `.prettierignore`. `npm run check` runs to completion again.
- **R1** — `aoi-sidebar-contrast-soft` no longer reuses `--aoi-ink-faint`. A lighter nav-text step
  is not available in light mode: the measured lightest colour clearing 4.5:1 on the worst sidebar
  background (Aqua + Sky=Clear) is 0.003 lightness from the standard step. Soft now lowers the nav
  weight to `--font-light` and stops promoting headings to indigo instead, so the setting has a
  visible effect without lowering contrast; the active row keeps its semibold cue because Obsidian
  re-declares `--nav-item-weight-active` after `--nav-item-weight`. Theme High contrast, Light
  contrast = High, `prefers-contrast: more` and forced colours all reset the weight to normal, and
  all four now reach the nav, tab, titlebar and status tokens, which `--text-muted` alone did not
  cover.
- **R2** — both forced-colors cascade chains are closed. The surface/text block is guarded by
  `[class*="aoi-"]` at `(0,2,1)` because the theme's 80+ setting classes declare the same tokens at
  that specificity; an explicit list had already gone stale. Decoration removal names the two
  gradient switches explicitly instead of using `:where()`, and the HR fallback outranks their
  `background-color`. Navigation, tab, titlebar, status, list-marker and HR tokens now map to system
  colours.
- **Also fixed, found by the review's hover/active/focus requirement** — dark
  `--nav-item-background-active`/`-selected` mixed `22%`/`16%` of the accent into the panel while
  the text switched to `--aoi-night-cobalt`, measuring `3.63:1` and `3.91:1`. Both are now `92%`
  panel, measuring `4.72:1` and `4.63:1`.
- **Evidence** — new `--aoi-workspace-tint-max-aqua` primitive and a 45th contrast pair so the Aqua
  extreme is gated. New `npm run scenarios` (`scripts/check-scenarios.mjs`), wired into
  `npm run check` after `contrast`. It parses the built `theme.css` with the existing `lightningcss`
  dependency and resolves the real cascade — source order, specificity, and the `forced-colors` /
  `prefers-contrast` media queries — instead of the static checker's per-file regex. 582 scenarios
  cover both modes x four sidebar options x three Sky levels x three sidebar-contrast levels x four
  accessibility paths x two media modes, plus nav base/hover/active/selected/focus and the
  forced-colors setting-class negatives. It also asserts that the wash background derived from the
  live surface, wash colour and strength equals the precomputed tint-max primitives, so those
  constants cannot silently drift. Reverting the Soft fix makes it exit 1.
- Simulated verification outside the script: 198 forced-colors combinations and 120 nav-state
  combinations in an isolated Chromium page. Recorded in `docs/TESTING.md` as a single matrix that
  separates simulated, real-device, and untested rows.
- Not started: real Obsidian interaction regression, Style Settings install/reset, Canvas/Graph/PDF/
  Bases regression against the Phase 6 selectors, real Windows High Contrast, physical devices.

## README and screenshot refresh — 2026-09-13

- Scope: update public documentation and capture the current theme in the local test Vault; preserve
  theme code.
- Completed: refreshed README and SVG cover; captured light, dark, and tablet-emulator views in
  Obsidian 1.13.7 using the current theme. Restored desktop light mode afterward.
- Validation: npm run check, git diff --check, README local links, SVG parsing, and visual
  inspection of all three screenshots passed. No theme source changes.
- Capture build SHA-256: 66f7d394ac38b3b7e67ffdcba942042fca656bdb29d7d64ed6f1fe8f5d0bbd55.
- Scope remains documentation and promotional assets; screenshot capture does not close the
  outstanding full interaction or physical-device test matrix. Commit and push authorized by the
  user.

## Active objective

Build the first maintainable Aoi Tori theme release with:

- An image-derived visual system.
- Independent light and dark modes.
- Stable Obsidian semantic-token mappings.
- Compatibility with current editor and image interactions.
- Reproducible build, lint, audit, contrast, and release commands.
- Documentation suitable for future Community Themes submission.

## Current audit — 2026-09-11

Documentation-only aesthetic audit requested by the user: compare the current Phase 5B source and
local reference image with the film website and official interviews; assess a left watercolor /
white bridge / right blush composition, independent dark mode, and suitable motif sources. Deliver
`docs/aesthetic-audit-2026-09-11.md`. Preserve all existing uncommitted implementation and release
work.

- [x] Read repository guidance, source tokens, component rules, and historical evidence.
- [x] Inspect the named reference image and existing Obsidian screenshots.
- [x] Inspect the official website visually and read its live background styles and asset
      references.
- [x] Write the detailed findings, proposed changes, implementation sequence, and acceptance
      criteria.
- [x] Run validation and record current failures separately from this documentation change.

Decision: the user's request opens discussion of wider static gradients and sparse motifs despite
older DESIGN restrictions. These are proposals only; this audit does not enact CSS exceptions or
redistribute official art. Public theme assets retain the independent-project boundary in AGENTS.md.
Dark palette candidates are original UI translations, not claimed official movie night colors.

Result: audit document complete; implementation remains proposed. Build regenerated `theme.css`
byte-identically (88,942 bytes). CSS lint, 14-file audit, 28 contrast pairs, manifest validation,
and touched-document formatting pass. Full `npm run check` stops at the pre-existing formatting
issue in `checkout-diff.md`, which is preserved. No source, release metadata, package, or Obsidian
settings changes; no new manual Obsidian test claims. See the report for candidate values, source
links, known limits, and the staged implementation/acceptance plan.

### Implementation handoff specification — follow-up

The user requests more explicit instructions for another AI to implement correctly. Expand the same
audit document with a normative task sequence, token/selector mapping, configuration migration,
cascade and fallback rules, regression cases, and a copyable execution brief. This follow-up edits
only documentation; candidate visuals remain unimplemented.

- [x] Recheck current workspace, settings, content, mobile, and audit code for concrete constraints.
- [x] Add and review the detailed handoff specification.
- [x] Validate the touched documents and confirm implementation files are unchanged.

Result: section 12 now specifies T00–T09, token assignments, Duet option migration, dark Quote
strength, CSS cascade and inheritance safeguards, HR/system-color fallbacks, V01–V14 acceptance
cases, and a copyable implementation prompt. Documentation formatting passes; existing source and
generated CSS hashes remain unchanged. No new implementation or manual-test claim.

## Current phase

**Phase 6 — Aesthetic audit implementation (T00–T09; core complete, real-device items open)**

Implements `docs/aesthetic-audit-2026-09-11.md` chapter 12. Light keeps paper, ink, link and focus
unchanged and gains a left watercolour-cyan / neutral bridge / right blush spatial relationship.
Dark gets independently derived low-chroma night surfaces instead of a blue-tinted inversion.

Token layer (`primitives.css`):

- New: `--aoi-air-cyan-white` `#EAF4F4`, `--aoi-air-cyan-bloom` `#DDEFF3`, `--aoi-air-bridge-white`
  `#F6F8F7`, `--aoi-air-blush-white` `#F5EFF4`, `--aoi-air-blush-bloom` `#EFE5EF`.
- New: `--aoi-night-left` `#1C272E`, `--aoi-night-right` `#29282F`.
- Night per §5.2: canvas `#111827`→`#191F26`, surface `#172338`→`#222A30`, panel
  `#20344D`→`#2C343C`, border `#36516C`→`#46535F`, text `#EAF3F5`→`#E5EBEB`, muted
  `#B3C5D4`→`#B8C4C8`, faint `#92A7B8`→`#9DADB4`.
- `--aoi-night-cobalt` `#8AADD9` retained for the first round, per the handoff specification.

Role layer: `--aoi-workspace-left-surface`, `-right-surface`, `-bridge-surface`, `-left-wash`,
`-right-wash` mapped independently in both mode files. `--background-secondary` keeps its generic
mist role and is not repurposed as the right-hand colour.

- [x] T00 Baseline hashes recorded; existing uncommitted work preserved. `git status` shows 25
      modified plus 13 untracked entries before and after this phase.
- [x] T01 Primitives and mode role tokens added; night values follow §5.2.
- [x] T02 `shell.css` split into independent left/right rules; central shell and status bar use the
      bridge; ribbon follows the left edge; tab bars are transparent so each region shows its own
      surface.
- [x] T03 Night surfaces traced across `semantic-dark.css`; existing semantic roles reused so that
      inputs, menus, tables, Callout, Properties and code follow the new surfaces. Dark quote wash
      gets its own ladder.
- [x] T04 `aoi-sidebar-duet` added as the new default; Cloud/Mist/Aqua keep the earlier single-tint
      light appearance and now also unify both sides and neutralise the bridge. Dark quote wash
      ladder is 2%/4%/6%.
- [x] T05 HR always carries `background-color: var(--hr-color)` beneath the gradient; both
      gradient-off switches now share one object list including HR; forced-colors maps the three new
      role tokens to `Canvas` and flattens HR to `CanvasText`.
- [x] T06 Mobile left/right drawers use their own surfaces; pop-outs and sidebar-less windows get
      the neutral bridge automatically through `.workspace`.
- [x] T07 `[!aoi-tori]` and `[!second-voice]` verified to render inline icons in Obsidian 1.13.7.
      `lucide-bird` is **not registered** in this client, so the optional `[!bluebird]` type is
      deferred rather than guessed.
- [x] T08 `npm run check` runs; build, CSS lint, 14-file audit and manifest validation pass.
      Contrast gate expanded from 28 to 38 pairs including left/right/bridge surfaces; all pass,
      with light muted-on-right at 4.81:1 as the tightest.
- [x] T09 `theme.css` regenerated from `src/` (92,029 bytes).

Real Obsidian 1.13.7 pixel verification of V01 (no Style Settings, both sidebars):

| Region        | Light             | Dark              |
| ------------- | ----------------- | ----------------- |
| Left sidebar  | `#EAF4F4` H197.0° | `#1C272E` H236.5° |
| Centre        | `#FBFAF8` H84.6°  | `#232A30` H244.2° |
| Right sidebar | `#F5EFF4` H331.0° | `#29282F` H292.1° |

Contrast at those measured surfaces: light 12.47/4.86, 13.39/5.22, 12.33/4.81; dark 12.63/8.53,
12.05/8.14, 12.10/8.18 (body / secondary).

**Resolved during implementation:** the first attempt left `.workspace-tabs .workspace-leaf` painted
with `--background-secondary` above the split, so pixels stayed mist while the split's computed
background was already correct. Sidebar `.workspace-leaf` is now cleared alongside
`.workspace-leaf-content`; the central leaf stays opaque at `--background-primary`.

**Second review round — per-side chrome.** The user reported that the traffic-light corner, the
vault-switcher strip and the right-hand collapse button did not match their own side. Three separate
causes were confirmed by pixel reads with the window focused:

| Symptom                                              | Cause                                                                                                                                                                                     | Fix                                                                                                                          |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Top-left corner and left pane differed while focused | `--titlebar-background` also feeds `body.is-focused` → `--titlebar-background-focused`, and Obsidian paints `.workspace-ribbon.mod-left:before` from it                                   | `--titlebar-background(-focused)` set to the neutral bridge; `.workspace-ribbon.mod-left::before` pinned to the left surface |
| Vault-switcher strip stayed mist                     | Obsidian sets `background-color: var(--background-secondary)` on `body:not(.is-mobile) .workspace-split.mod-left-split .workspace-sidedock-vault-profile`                                 | matched selector paints the left surface, plus the right-side equivalent                                                     |
| Right collapse button showed the left cyan           | `.mod-macos.is-hidden-frameless:not(.is-popout-window) .sidebar-toggle-button.mod-right` reads `--tab-container-background`, which derives from the single global `--titlebar-background` | explicit per-side rules for `.sidebar-toggle-button.mod-left` and `.mod-right`                                               |
| Central tab bar showed paper instead of the bridge   | Obsidian paints `.workspace-split.mod-root` with `--background-primary`, hiding the bridge                                                                                                | root split cleared; `.workspace-leaf` / `.workspace-leaf-content` / `.view-content` keep the opaque paper                    |

Verified by pixel reads with `body.is-focused` true, both modes:

| Region                                                       | Light                 | Dark                  |
| ------------------------------------------------------------ | --------------------- | --------------------- |
| Traffic-light corner / left pane / vault strip / left toggle | all `#EAF4F4` H197.0° | all `#1C272E` H236.5° |
| Central tab bar (empty area) / status bar                    | `#F6F8F7` H165.1°     | `#232A30` H244.2°     |
| Central reading pane                                         | `#FBFAF8` H84.6°      | `#232A30` H244.2°     |
| Right toggle / right pane                                    | all `#F5EFF4` H331.0° | all `#29282F` H292.1° |

**Central transition is intentionally absent.** Per §12.5 the central Markdown core stays opaque and
the "bridge" is realised as the visible neutral central tab bar plus the paper relationship, not as
a gradient behind text. §4.3 item 4 states the more visible continuous gradient belongs to the
periphery or empty views, and §12.1 item 3 rejects claiming a gradient that opaque children cover.

**Third round — T05 and layout verification.** Both decorative-gradient switches and forced-colors
were exercised.

| Check                                          | Result                                                                                                                                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `aoi-watercolor-wash-off` on left/right splits | `background-image: none`; base surfaces `#1C272E` / `#29282F` retained                                                                                                                                  |
| `aoi-disable-decorative-gradients` on the same | identical result                                                                                                                                                                                        |
| Reset after either switch                      | gradient restored                                                                                                                                                                                       |
| HR with either switch on                       | solid `#46535F` 1px line retained, only the gradient removed                                                                                                                                            |
| forced-colors emulation (CDP, Chromium)        | left/right/bridge surfaces → `Canvas`; `--text-normal` → `CanvasText`; `--text-faint` → `GrayText`; accent → `Highlight`; links → `LinkText`; focus ring 3px; HR → solid `CanvasText`, gradient removed |
| Layout: both sidebars                          | left `#1C272E`, centre `#232A30`, right `#29282F`                                                                                                                                                       |
| Layout: left only                              | left `#1C272E`; centre and right side return to the bridge with no blush remnant                                                                                                                        |
| Layout: no sidebar                             | neutral night family throughout, no cyan or blush leak                                                                                                                                                  |
| Mobile drawer (`dev:mobile on`)                | left drawer `#1C272E`, transparent header                                                                                                                                                               |

**Specificity defect found and fixed.** The two off switches were written as `body.aoi-… :where(…)`,
which resolves to 0,1,1 and lost the cascade to the new 0,2,0 split rules in `shell.css`; the
gradient stayed on. Both switches now use explicit selectors (0,2,1) with no `!important`, and the
shared object list keeps them from drifting apart.

**Not verified for T05/T06:** real Windows High Contrast, pop-out windows and multi-note split,
phone-class and physical mobile layouts, and the Style Settings plugin itself.

**Fourth round — worst-case tint contrast and default parity.** Two review findings, both confirmed.

_Worst-case contrast._ The 38-pair gate sampled each side surface as a flat token, but the shipped
background is token **plus** wash gradient, so the reported 4.86:1 was the untinted midpoint rather
than the extreme. Compositing the strongest wash (Sky = Clear, 7%) at the outer edge gives `#DEEDF1`
/ `#EBE4EC`, where `--nav-item-color` measured **4.54:1** on the left and **4.37:1** on the right —
the right side was below the 4.5 floor. Root cause is not the wash: the audit's own blush bloom
`#EFE5EF` already measures 4.44:1 against the same muted text, so the AA margin was gone before any
gradient was drawn. Light paper gives muted text only +0.72 of margin, the left surface +0.36, the
right surface +0.31.

Fix: a dedicated `--aoi-ink-muted-side` (`#516577`) for text on the tinted side surfaces, applied to
`--nav-item-color`, `--tab-text-color` and `--titlebar-text-color`. `--text-muted` keeps its paper
value so body text is unchanged. Worst case becomes 5.03:1 left / 4.84:1 right.

The gate now carries the extreme rather than the midpoint: four precomputed composite tokens
(`--aoi-workspace-{left,right}-tint-max[-night]`) are checked directly. Pairs grew 38 → 44. Real
pixels at Clear confirm the model: left outer edge `#DFEDF1`, right outer edge `#EBE4EC`, both
returning to the plain surface at the inner edge.

_Default parity._ §12.4 sets the dark quote ladder to Whisper/Balanced/Present = 2/4/6%, and the
Style Settings metadata default is `aoi-sakura-balanced`, but `semantic-dark.css` shipped 2%. With
the plugin installed and reset, dark therefore resolved to 4% while the no-plugin default resolved
to 2%, violating §12.1 item 6. `semantic-dark.css` is now 4% (quote body 9.66:1, secondary 6.53:1).
A sweep of every `@settings` default against its class rule found no other mismatch:
`aoi-sky-balanced` 5%, `aoi-violet-balanced` 8% and `aoi-callout-balanced` (no rule; mode defaults
5% light / 6% dark) all match their no-plugin values.

_Documentation sync._ `README.md`, `docs/DESIGN.md` and the primitive evidence map in
`docs/visual-analysis.md` still described the withdrawn navy night. All three now state the Phase 6
values, with the superseded ones explicitly marked as historical rather than left as contradictions.

**Still open (not claimed as tested):** V02–V05 and V07–V14 remaining cases; the Style Settings
plugin install/reset and Cloud/Mist/Aqua/Duet switching; pop-out windows and multi-note split;
narrow and phone-class viewports and physical mobile; RTL; real Windows High Contrast;
assistive-technology sessions; the pre-existing `checkout-diff.md` formatting failure in
`npm run check`; and the deferred `[!bluebird]` type.

No commit, push, version bump, or package rebuild was requested. `checkout-diff.md` is untouched
because it is a pre-existing user document.

## Previous phase

**Phase 5B — Glass-grey duet refinement (complete; awaiting user visual review)**

Bounded atmosphere pass on top of uncommitted Phase 5A. Paper, ink, and light-mode link/focus cobalt
stay. No version bump, commit, push, or release packaging.

Approved production values (preview was slightly exaggerated):

- `--aoi-cloud-cool` `#F6FAFA` → `#F5F8F7`
- `--aoi-mist-blue` `#E8F2F4` → `#E4ECEB`
- `--aoi-cloud-shadow` `#DFECEF` → `#D7E1E0`
- `--aoi-ice-border` `#CBDFE8` → `#C3D2D2`
- light `--background-modifier-hover` sky mix `17%` → `10%`
- `--aoi-night-cobalt` `#8EAEF2` → `#8AADD9` (surface 6.79:1, canvas 7.65:1, panel 5.46:1)
- quote wash default `9%` → `12%` (whisper `6%`, present `16%`)
- properties violet wash default `4%` → `8%` (whisper `3%`, present `12%`)

No new Style Settings entries. Aqua sidebar remains the cyan escape hatch.

- [x] Record this phase without rewriting Phase 5A results.
- [x] Update primitives, light hover mix, wash defaults, and Style Settings ladders.
- [x] Sync `docs/DESIGN.md` and `docs/visual-analysis.md`.
- [x] Run `npm run format` and `npm run check`. Passed on 2026-09-10. Dark link measures 6.79:1.
- [x] Real Obsidian 1.13.7 screenshots from `test-vault-content`. Saved under ignored
      `.analysis/glass-duet/obsidian-*.png`. The theme symlink was retargeted from the earlier
      checkout of this repository to this one so the vault loads the Phase 5B CSS. `obsidian.json`
      restored after quit.
- [x] Property key icon and key text share `--metadata-label-background`. The whole Properties card
      is not recolored; values stay on the card surface.

No commit, push, version bump, or package rebuild was requested.

## Previous phase

**Phase 5A — Release Candidate and public testing preparation (complete with release blockers)**

### Build artifact strategy adjustment (complete)

The repository is correcting the generated-artifact boundary after the release packaging script
overwrote the root `theme.css` with its minified output. The readable development artifact will be
written to the repository root, while `npm run package` will write the minified artifact directly to
`dist/Aoi-Tori/theme.css`. Both files remain generated from `src/`; neither will be hand-edited.

- [x] Make `build()` require an explicit output path and minification mode at each caller.
- [x] Format the readable root artifact while preserving the complete `@settings` metadata block.
- [x] Build the minified package artifact directly under `dist/Aoi-Tori/` without touching root
      `theme.css`.
- [x] Verify both artifacts, documentation, and quality gates.

**Build artifact result:** `npm run build` now writes the Prettier-formatted readable artifact to
root `theme.css` (2,507 lines, 79,073 bytes) with `Build mode: development/readable`.
`npm run package` runs `npm run check` first, then calls `build({ outputFile, minify: true })`
directly for `dist/Aoi-Tori/theme.css` (the CSS body is one minified line; the preserved `@settings`
comment remains multiline). The package manifest is copied separately, and the root file remains
readable after packaging. Metadata is byte-identical and Lightning CSS normalization confirms
semantic CSS equivalence between both artifacts.

### Release-candidate semantic polish (completed)

The current bounded RC polish fixes the destructive confirmation-button contrast and adds Aoi
Tori-specific Markdown semantics without redesigning the approved light palette, adding Style
Settings entries, broadening plugin compatibility, creating a release, committing, or pushing.

- [x] Re-read the attached task, repository instructions, design, architecture, testing, DOM, and
      matrix documentation.
- [x] Confirm the working branch is `master` and preserve existing uncommitted Phase 5A changes.
- [x] Record the pre-change `npm run check` baseline as passing.
- [x] Confirm Obsidian 1.13.4's installed stylesheet supports the targeted official Markdown
      variables and exposes `button.mod-destructive.mod-cta`.
- [x] Implement destructive secondary and primary semantics without changing global
      `--text-on-accent`.
- [x] Implement scoped Markdown semantics for bold, italic, bold italic, strikethrough, highlight,
      tags, completed tasks, footnotes, `<kbd>`, horizontal rules, and source-formatting marks.
- [x] Add local ignored Markdown semantic test content and expand contrast pairs.
- [x] Capture the requested ignored review screenshots in `.analysis/semantic-polish/`.
- [x] Run the final `npm run format`, `npm run build`, `npm run lint`, `npm run audit`,
      `npm run contrast`, `npm run validate:manifest`, `npm run check`, and `npm run package`.

**Current evidence:** the screenshot issue is caused by Obsidian's destructive CTA state applying
`--text-color: var(--text-on-accent)` to a soft error background. The fix sets both `--text-color`
and `color` through new destructive semantic tokens. The expanded contrast gate currently measures
light destructive primary at 6.27:1, light destructive secondary at 5.44:1, dark destructive primary
at 8.13:1, and dark destructive secondary at 7.36:1. Real Obsidian 1.13.4 computed styles for the
fixture button confirmed the primary destructive focus ring as `rgb(21, 88, 160) solid 2px` with a
`2px` offset outside the error border.

**Manual/visual evidence:** the ignored semantic test note was reviewed in Obsidian Desktop
1.13.4/Installer 1.13.4 on macOS in light, dark, Reading, Live Preview, and Source views. UI zoom
0.9/1.0/1.1, a 760 px narrow window, and one pop-out window smoke passed without horizontal document
overflow or theme loss. Copy/cut/paste mutation flows and Vim mode were not repeated in this bounded
polish pass and remain manual release-candidate checks.

**Final quality result:** the full required command sequence passed on 2026-08-03. Root `theme.css`
is readable at 2,770 lines / 88,518 bytes; release `dist/Aoi-Tori/theme.css` is minified at 457
lines / 80,806 bytes. `npm run package` produced `manifest.json` SHA-256
`63c43169f73761b4a0dc3ec21ff2898b472526c9b4e7100e689864238abf08ae` and `theme.css` SHA-256
`29a53bb7c94cc0771eb3ce38898373833a4eb22c302b0b836653abe583760ef2`.

Phase 5A packages the completed theme as a `0.9.0` public-test Release Candidate. It does not
redesign the palette, add broad compatibility features, create a GitHub Release, tag, push, commit,
or submit to Community Themes.

### Phase 5A execution boundary

- [x] Re-read the attached task, repository rules, current README, plan, architecture, design,
      testing, DOM, matrix, research, and attribution records.
- [x] Confirm `master`, clean worktree, recent Phase 3.5 / Phase 4 commit `817a629`, and passing
      pre-change `npm run check`.
- [x] Verify current official release/submission requirements from Obsidian sources and current
      accepted Community Theme repositories.
- [x] Prepare `0.9.0` manifest/package metadata, MIT license, release README, attribution, and
      release research documentation without changing the theme name.
- [x] Create original repository screenshots/cover assets from real Aoi Tori Obsidian UI evidence,
      with no reference artwork or remote assets.
- [x] Add a repeatable `npm run package` command that checks, creates a release build, rebuilds only
      `dist/Aoi-Tori`, audits contents, and reports SHA-256 values.
- [x] Perform a clean install test from `dist/Aoi-Tori` into an ignored temporary Vault and record
      exact tested and untested states.
- [x] Add lightweight CI, issue templates, contributing guidance, release notes, and a release
      checklist.
- [x] Run the requested final `npm run format`, `npm run check`, and `npm run package` sequence and
      record results.

The official docs currently confirm that the first Community Theme submission happens through
`community.obsidian.md`, that the release tag must match `manifest.json` version, and that the
GitHub release must attach `manifest.json` and `theme.css`. Current accepted themes still vary in
where screenshots live (`screenshot.png`, `screenshots/...`, `assets/...`), so screenshot path
acceptance is recorded as a practical observation rather than a stronger official guarantee.

Phase 4's local audit expected ignored `test-vault-content/Phase 3` fixtures to exist, while Phase
5A requires CI to run in a clean checkout where ignored local Vault content is absent. The release
decision is to keep strict fixture checks whenever that local tree exists, but downgrade the missing
tree to an audit warning for clean CI. Release package checks remain strict and still reject test
Vault content.

**Phase 5A result:** `manifest.json` and `package.json` are prepared as `0.9.0`, the project now has
an MIT `LICENSE`, release-facing README, current official release research, release notes,
contribution/issue templates, CI, original UI-based screenshot assets, and a repeatable package
command. `npm run package` produces only `manifest.json` and `theme.css` under ignored
`dist/Aoi-Tori`; the current package SHA-256 values are
`63c43169f73761b4a0dc3ec21ff2898b472526c9b4e7100e689864238abf08ae` for `manifest.json` and
`e6ecd03585ad6ee3584aef833a395d7c84cee524f6899d6a5533c977996339eb` for the minified `theme.css`. The
clean install package copied into an ignored fresh Vault and matched the package hashes, but the
real Obsidian clean-Vault UI launch/restart check could not be completed without force-closing the
user's existing Obsidian session. That UI clean-install pass, physical mobile, Windows/Linux, real
Windows High Contrast, and assistive-technology testing remain prerequisites before a final `1.0.0`
or real Community submission.

## Previous phase

**Phase 4 — Mobile, Style Settings, and accessibility (complete; commit `817a629`)**

Phase 3.5 preserves the reviewed Phase 3 visual system and repairs the Settings Toggle geometry
against the actual Obsidian 1.13.4 DOM. Phase 4 may begin only after the Toggle repair, evidence,
`npm run format`, and `npm run check` all pass.

### Phase 3.5 / Phase 4 execution boundary

- [x] Re-read the attached task, repository rules, current plan, design, testing, and DOM notes.
- [x] Preserve the existing uncommitted Phase 3 and user-owned test-vault changes.
- [x] Identify the Toggle root cause from real computed geometry rather than guessing a vertical
      offset: a theme-added one-pixel physical border reduces the native fixed-height content box.
- [x] Capture the Toggle before state, remove the layout-affecting edge, and validate checked,
      unchecked, hover, active, focus, disabled, light, dark, Settings contexts, UI zoom, and
      Retina.
- [x] Record Phase 3.5 DOM measurements and screenshots, then pass formatting and the complete
      check.
- [x] Research the current official desktop/mobile baseline and implement bounded Phase 4 mobile,
      Style Settings, and accessibility support.
- [x] Run the requested final quality sequence and document real, emulated, and untested coverage
      without conflating them.

No commit, push, release, promotional artwork, remote asset, palette redesign, broad third-party
compatibility pass, or destructive operation is authorized. Actual-device claims are limited to
hardware or simulators genuinely available in this environment.

**Phase 3.5 gate result:** the physical Toggle border was removed from
`src/components/controls.css`; all measured roots and thumbs are vertically symmetric, the user's
separate-window preference and 100% zoom were restored, and `npm run format` plus `npm run check`
passed on 2026-08-02. Phase 4 therefore began without an unresolved Phase 3.5 blocker.

**Phase 4 implementation result:** the official desktop mobile emulator and controlled phone-class
viewports cover light/dark responsive layout, drawers, mobile navigation/toolbars, Settings,
Properties, tables, images/Lightbox, Bases, Canvas, and Graph without document overflow. Important
visible mobile targets are at least 44 px. Style Settings 1.0.9 parses all 48 bounded entries with
no errors and defaults reset to the reviewed theme. Chromium media emulation verifies reduced
motion, increased contrast, and forced-colors structure. Physical iOS/iPadOS/Android, real
gestures/virtual keyboard/safe areas, Windows High Contrast, Windows/Linux, and assistive-technology
sessions remain explicit release prerequisites rather than inferred passes.

**Phase 4 gate result:** `npm run format`, readable build, lint, audit, contrast, manifest
validation, and the concluding `npm run check` all pass on 2026-08-03. The readable generated CSS is
78,580 bytes; Stylelint and Prettier pass, the audit covers 14 source CSS files, and all 16
configured contrast pairs pass. Phase 4 remains uncommitted and unpushed, and no release build or
Community submission was started.

## Previous phase

**Phase 3 — Desktop interactions and core-view compatibility (complete; awaiting user review)**

Phase 3 preserves the approved Phase 2.5 visual system while validating and adapting current desktop
interactions, embeds, Settings, Bases, Canvas, Graph, core views, pop-outs, and narrow or split
layouts. It does not begin mobile, Style Settings, third-party plugin compatibility, promotional
artwork, or Community submission.

### Active Phase 3 task

**Starting evidence**

- [x] Re-read all repository, design, testing, research, attribution, and DOM guidance.
- [x] Confirm `master` and the clean Phase 2.5 checkpoint `fe70a54`.
- [x] Run the pre-change quality gate; build, lint, audit, contrast, and manifest checks pass.
- [x] Re-verify the official 2026-08-02 baseline: Desktop/Mobile public 1.13 include 1.13.4, latest
      Catalyst is 1.13.4, installer 1.13.4 uses Electron 43.1.1.
- [x] Record current 1.13.4 DOM evidence, state classes, official variables, selector risks,
      fallbacks, and regression cases.
- [x] Expand original test-vault fixtures for image interactions, non-image embeds, Bases, Canvas,
      Graph, long/deep names, Settings, and pop-out review.
- [x] Exercise the complete desktop Live Preview image matrix with Vim off and on.
- [x] Verify embeds, Settings controls, Bases table/card, Canvas, Graph, core views, pop-outs,
      narrow windows, and multi-column layouts in light and dark modes.
- [x] Add only evidence-backed, low-specificity compatibility rules and semantic mappings.
- [x] Capture the required ignored Phase 3 review screenshots and update the test matrix.
- [x] Run the full requested quality sequence and record final results and residual risks.

**Evidence and commit boundary**

- Actual test target: Obsidian and Installer 1.13.4 on macOS 26.5 Apple silicon; 1.13.4 is both the
  minimum regression baseline and the installed current version for this pass.
- Current official release evidence was checked against the public 1.13 Desktop/Mobile changelog,
  the latest 1.13.4 Catalyst entries, the download page, and official CSS-variable guidance on
  2026-08-02.
- Internal selectors require rendered DOM evidence, a stated reason, scope, official-variable
  investigation, stability risk, fallback, and regression case in `docs/obsidian-dom.md`.
- `theme.css` remains generated from `src/index.css`; no direct generated-file edit is allowed.
- The requested Phase 2.5 checkpoint is complete. Phase 3 changes will not be committed or pushed
  without a separate explicit request.

**Result**

- The installed Obsidian and Installer are both 1.13.4 on macOS 26.5 arm64, using Electron 43.1.1.
  Light/dark, Vim off/on, main/pop-out, 760×820 narrow, maximized/fullscreen, and multi-column
  states were exercised in the real client with Restricted mode on and no community plugins.
- Live Preview image pointer, keyboard, copy/cut/delete, grow/shrink/reset, Enter/Tab, Space/Zoom
  Lightbox, standalone drag resize, action visibility, nested content, pop-out, narrow, and Vim
  command flows passed. The only image residual is manual confirmation of table-contained handle
  dragging: its native image/actions/handle were visible and unobstructed, but automated dragging
  did not persist the width.
- Markdown, PDF, audio, video, Canvas, Bases, iframe, and missing embeds were tested without fixed
  height, clipping, pointer blocking, or image-rule leakage. Original test media and a one-page PDF
  remain confined to `test-vault-content/Phase 3/`.
- Current Settings controls, search, hotkeys, disabled state, and Community Theme cards were tested.
  Restricted-mode plugin cards, Health/Review display, stock validation textarea/error, and a
  destructive confirmation were not exposed and remain untested.
- Bases Table/Cards, fields, groups, edit/focus/menu/no-match/error/pop-out states passed; its
  1.13.4 loader method exposes no visual. Empty/mixed/large Canvas,
  selection/edit/resize/menu/controls and global/local Graph passed. Canvas exposed no minimap;
  Graph transient hover/selected/search state could not be isolated through automation.
- Phase 3 adds official semantic variables for embeds/PDF, Search, Bases, Canvas, and Graph. It adds
  no new component module or internal selector and does not change the approved palette. The four
  Phase 2 image selectors were reverified and documented with risk/fallback/regression evidence.
- The audit now verifies source-only imports, required Phase 3 fixtures, internal-selector
  documentation, and exclusion of `.analysis/`, `test-vault-content/`, and `references/raw/` from
  built CSS. No dependency, remote asset, Base64 asset, `!important`, `:has()`, global image rule,
  or disabled quality check was added.
- Stylelint's strict custom-property namespace allowlist now recognizes only the five additional
  verified official prefixes used here: `bases`, `canvas`, `graph`, `pdf`, and `search`. The naming
  rule and suffix pattern remain enabled and unchanged.
- The final requested command sequence passes: readable `theme.css` is 46,947 bytes, Stylelint and
  Prettier pass, the expanded audit passes all 11 source CSS files, all 16 configured contrast pairs
  pass, the manifest is valid, and the concluding `npm run check` passes.
- Required review screenshots are stored only under ignored `.analysis/phase-3-review/`. Phase 3
  remains uncommitted and unpushed. Mobile, Style Settings, third-party compatibility, release, and
  Phase 4 have not started.

### Phase 2.5 checkpoint

**Phase 2.5 — Visual refinement (complete; review correction verified; commit `fe70a54`)**

This bounded pass preserves the approved light-mode identity and refines callout semantics,
watercolor air, dark-mode hue relationships, small hierarchy details, and the selected-image
outline. It does not begin the remaining Phase 3 or Phase 4 roadmap.

The visual review found that Obsidian's opaque `.callout-content` background masks the parent
Callout wash and reads as a nested white/black slab. The bounded correction makes only that content
layer transparent so the outer Callout owns one continuous surface. The current user request also
explicitly authorizes one Git checkpoint after this correction; this overrides the earlier Phase 2.5
no-commit constraint for that checkpoint only. Phase 3 changes remain uncommitted unless separately
authorized.

### Phase 2.5 task: review corrections

**Scope**

- Included: verify current 1.13.4 Lucide callout IDs, map built-in callout icons through
  `--callout-icon`, add restrained semantic callout washes, add limited static gradients to the
  sidebar/Properties/Quote, reduce selected heading/link/border intensity, adjust the approved image
  outline, run the full quality gate, and capture seven local comparison screenshots.
- Excluded: Blowfish/Font Awesome assets, copied/custom icon art while Lucide `feather` exists,
  global content-margin repairs, real texture assets, Bases, Canvas, mobile, Style Settings,
  third-party plugins, remotes, pushes, unsolicited commits beyond the authorized checkpoint, and
  Phase 3 expansion.

**Starting evidence**

- [x] Re-read repository, plan, design, testing, image-analysis, architecture, and DOM guidance.
- [x] Confirm Phase 2 baseline commit `34ba7f1` on `master` with a clean worktree.
- [x] Run the pre-change quality gate.
- [x] Verify every selected Lucide candidate against the running Obsidian 1.13.4 icon registry.
- [x] Implement the narrow semantic, gradient, hierarchy, and image-outline refinements.
- [x] Inspect Callout Markdown structure for content-caused blank height.
- [x] Test light/dark Callout, Quote, Properties, headings, and image selection in the real client.
- [x] Capture seven ignored Phase 2.5 review screenshots.
- [x] Run `npm run format` and the final `npm run check`.
- [x] Record final visual decisions, test evidence, changed files, and deferred risks.
- [x] Resolve the reviewed nested Callout body slab and verify one continuous surface in both modes.

**Constraints**

- Component CSS continues to consume semantic variables; color literals stay in token files.
- Each refined component uses at most two simple static gradient layers and no filters, blur,
  backdrop filters, blend modes, texture assets, or text-covering pseudo-elements.
- Native Callout structure and image-selection cues remain present. No `!important`, `:has()`,
  layout-changing image border, or unverified selector is introduced.

**Result**

- The pre-change and final `npm run check` both pass. The final build is 41,630 bytes; Stylelint,
  Prettier, the 11-file CSS audit, all 16 configured contrast pairs, and manifest validation pass
  without a disabled rule or reduced threshold.
- Obsidian and Installer 1.13.4 on macOS verified all final built-in Callout icons after a cold
  start. `lucide-circle-info` did not resolve and was replaced by verified `lucide-info`; the other
  selected IDs, including `lucide-music-2` and `lucide-feather`, resolved. No external or custom
  icon asset was added.
- Light Callouts now use quiet semantic washes and a 2 px semantic edge; dark Callouts use distinct
  5–6% night semantic layers while retaining normal night body text. Quote, Properties, and the
  light sidebar receive only the bounded static gradients documented in `docs/DESIGN.md`.
- Light H2, unresolved links, Properties/table borders, dark H2/H3, and dark table borders were
  reduced without redesigning the approved light palette or changing code syntax colors.
- The 1.13.4 image selection retains the native inner cue and action buttons. The theme outline is 1
  px with a 2 px offset and does not alter layout.
- Seven final screenshots are stored under ignored `.analysis/phase-2.5-review/`: light/dark
  Callouts, light/dark Quote, light Properties, dark heading hierarchy, and light selected image.
- The reviewed nested Callout body slab is removed: computed `.callout-content` background is
  transparent in light and dark mode, leaving the parent solid color and semantic wash continuous.
  Updated reading-view evidence is stored as `09-light-callouts-unified-body-reading.png` and
  `08-dark-callouts-unified-body-reading.png` in the same ignored review directory.
- Bases, Canvas, mobile, Style Settings, third-party plugins, Phase 3 expansion, final promotional
  artwork, further commits, and pushes remain outside this pass. One explicitly authorized Phase 2.5
  checkpoint commit follows this verified correction.

### Phase 2 baseline

**Phase 2 — Final tokens and minimum preview slice (complete; visually approved in light mode)**

This phase turns the accepted Phase 1 image analysis into a reviewable core theme in a local
Obsidian vault. It does not attempt full Community Theme coverage.

### Active task: reviewable core slice

**Scope**

- Included: final primitive and semantic tokens, typography and motion, a small set of real
  workspace/editor/component modules, conservative image interaction styling, a visual test note,
  expanded contrast checks, local test-vault installation, macOS Obsidian screenshots, test matrix,
  and design/architecture documentation.
- Excluded: copied or traced reference art, final promotional artwork, third-party plugin coverage,
  full Bases/Canvas/mobile adaptation, unverified internal DOM selectors, Git commits, remotes, and
  pushes.

**Starting evidence**

- [x] Re-read all repository, design, research, attribution, testing, and DOM documents.
- [x] Confirm the existing uncommitted state: unborn `master` branch; all project files untracked.
- [x] Run the pre-change `npm run check`; all build, lint, audit, contrast, and manifest checks
      pass.
- [x] Re-verify the current official 1.13 changelog and CSS-variable guidance before selector work.
- [x] Finalize used primitive tokens and light/dark official semantic mappings.
- [x] Implement only the requested minimum workspace, editor, component, and image modules.
- [x] Create the visual test note and local-only test-vault installation.
- [x] Expand contrast pairs and pass the complete local quality gate.
- [x] Test the current local Obsidian environment and capture seven local review screenshots.
- [x] Record tested/untested states, final decisions, risks, and command results.

**Constraints and evidence boundary**

- The local app cache contains Obsidian `1.13.4`, but the installer shell reports `1.12.7`.
- The branch has no commit, so the test environment must record the theme revision as “unborn branch
  / no commit” rather than inventing a hash.
- `docs/obsidian-dom.md` currently approves no internal image selector. Image styling therefore
  stays on official variables and stable low-specificity classes until Developer Tools evidence is
  recorded.
- The existing untracked files are preserved. No removal command is authorized in this phase.

**Result**

- Finalized 53 used primitive colors and broad official light/dark semantic mappings. Component
  files contain no literal colors; the reference gold remains decorative and warnings retain a
  separate accessible semantic family.
- Added five real modules for the workspace shell, editor content/images, controls, and overlays. No
  Bases, Canvas, mobile, or third-party compatibility module was started.
- Added a mixed-language visual test note and original diagnostic SVG under `test-vault-content/`.
  The Vault configuration and local theme link are ignored, and the build does not package this
  directory.
- Expanded contrast coverage from 8 to 16 pairs. All light/dark body, secondary, link, unresolved,
  primary-button, input, icon, and focus pairs pass their configured WCAG thresholds.
- Tested Obsidian/Installer 1.13.4 on macOS 26.5 with light/dark, Live Preview, Source, Reading,
  Settings, pointer image selection, action hover/lightbox, and generic keyboard focus. Detailed
  limits are in `docs/test-matrix.md`.
- Captured seven required local review screenshots under ignored `.analysis/review/`. No final
  promotional image or reference artwork was generated or packaged.
- The final requested command sequence and complete `npm run check` pass; readable `theme.css` is
  generated from `src/index.css`, never edited directly.

### Pre-Phase 2 status

**Pre-Phase 2 — Engineering baseline normalization (complete)**

Phase 1 research is complete. This maintenance task establishes a reproducible Git/npm baseline and
runs the full quality gate without starting Phase 2 visual implementation.

### Active task: Git and npm baseline

**Scope**

- Included: inspect the existing Git repository, preserve its current branch, install declared
  development dependencies, retain `package-lock.json`, format supported files, run the complete
  quality gate, repair repository-caused failures without weakening rules, and verify ignored
  local/reference/dependency directories.
- Excluded: Git commits, remotes, pushes, branch renaming, new visual tokens, component CSS, DOM
  selectors, promotional assets, and Phase 2 implementation.

**Starting state**

- [x] Repository already contains `.git`; no reinitialization is required.
- [x] Current branch is `master` with no commits.
- [x] All project files are currently untracked; this task will not stage or commit them.
- [x] Confirm no Git remotes are configured or added.
- [x] Run `npm install` and retain `package-lock.json`.
- [x] Run `npm run format`.
- [x] Run `npm run check` and fix repository-caused failures without disabling rules.
- [x] Confirm `.analysis/`, `references/raw/`, and `node_modules/` are ignored.
- [x] Record final command results and changed files.

**Result**

- Git was already initialized before this task. It remains on the unborn `master` branch with no
  commits, staging, remotes, or pushes; the conditional `git init -b main` step was not run.
- `npm install` added 125 packages, audited 126 packages, reported 0 vulnerabilities, and generated
  the retained `package-lock.json`.
- `npm run format` formatted the supported repository files using the declared Prettier setup.
- The first `npm run check` built `theme.css`, then found 31 Stylelint errors: five import-notation
  errors, 23 custom-property spacing errors, and three typography/spacing errors.
- `npm run lint:css -- --fix` repaired those mechanical source-format issues under the existing
  rules. No rule or threshold was disabled or weakened, and no visual component was added.
- The final `npm run check` passed build, Stylelint, Prettier, CSS audit, all eight configured
  contrast pairs, and manifest validation. The readable generated `theme.css` is 5,876 bytes.
- `git check-ignore` and `git status --ignored` confirm `.analysis/`, `references/raw/`, and
  `node_modules/` are ignored. None was staged or committed.
- Phase 2 visual-token and component work has not started.

### Phase 1 status

**Phase 1 — Research and evidence (complete; awaiting design confirmation)**

### Phase 0 exit criteria

- [x] Root `AGENTS.md`
- [x] Human-facing `README.md`
- [x] Reproducible npm commands
- [x] Architecture, design, and testing documents
- [x] Generated `theme.css` workflow
- [x] Reference images placed in `references/raw/`
- [x] First `docs/visual-analysis.md` completed
- [x] Current Obsidian release/environment baseline recorded; live DOM inspection explicitly
      deferred rather than guessed

### Active task: first-stage visual and ecosystem research

**Goal**

Establish an image-led visual system, current Obsidian compatibility baseline, and license-aware
engineering references before theme implementation begins.

**Scope**

- Included: all images in `references/raw/`, local-only analysis outputs, current official Obsidian
  documentation/version research, seven named community themes, attribution and abstract-graphic
  design guidance.
- Excluded: component CSS, source-token changes, generated `theme.css`, release metadata, final
  promotional artwork, and any bundled reference imagery.

**Evidence required**

- Official Obsidian changelog, CSS-variable documentation, theme guidelines, submission rules, and
  Health/Review documentation.
- Direct inspection of every reference image, supported by non-authoritative pixel statistics.
- Current source repositories, manifests/releases, scorecards, and licenses for Minimal, Baseline,
  Shimmering Focus, Border, Things, Transparent, and Kanagawa.
- Explicitly marked limitations where current Obsidian DOM or platform behavior cannot be inspected
  locally.

**Work status**

- [x] Read repository instructions and baseline documentation.
- [x] Inspect repository structure and attempt `git status`.
- [x] Inventory and visually inspect every reference image.
- [x] Create ignored local contact sheet and focused crops.
- [x] Synthesize image-led primitive and semantic token candidates.
- [x] Verify current Obsidian releases and official theme documentation.
- [x] Research named themes, scorecards, licenses, and engineering patterns.
- [x] Update visual analysis, design guidance, attribution, and phase status.
- [x] Run documentation-safe validation without regenerating `theme.css`.

**Known constraint**

During the original Phase 1 snapshot, `.git` metadata was not visible, so that phase used an
explicit before/after inventory. The repository was subsequently initialized before engineering
normalization and is now an unborn `master` branch; later phases use real Git status without
rewriting the historical Phase 1 evidence.

## Roadmap

### Phase 1 — Research and evidence

- [x] Inventory every reference image.
- [x] Extract candidate palettes and visual proportions.
- [x] Record current Obsidian stable, early-access, mobile, and installer versions.
- [x] Record the current image-behavior and local-environment baseline without guessing DOM.
- [x] Research selected community themes and their Health/Review details.
- [x] Record licenses and attribution constraints.
- [x] Update `docs/visual-analysis.md`.
- [x] Update `docs/obsidian-dom.md`.
- [x] Update `docs/attribution.md`.

Current Live Preview DOM capture remains a Phase 4 implementation prerequisite because Phase 1 did
not launch or instrument a disposable vault. This is a recorded evidence boundary, not a claim that
the interaction was tested.

### Phase 2 — Design system

- [x] Finalize primitive light palette.
- [x] Finalize independent dark palette.
- [x] Define semantic UI mappings.
- [x] Define typography, spacing, radius, shadow, and motion tokens.
- [x] Verify configured contrast pairs.
- [x] Document rejected colors and accessibility adjustments.

### Phase 3 — Core implementation

- [x] Workspace shell
- [x] Tabs and navigation
- [x] Editor and reading view
- [x] Headings, links, lists, tables, code, callouts, properties
- [x] Buttons, inputs, menus, modals, tooltips, notices
- [x] File explorer, search, outline, backlinks, tags

### Phase 4 — Current Obsidian interactions

- [x] Live Preview image selected state (pointer path only)
- [x] Image action buttons (pointer visibility, hover, and zoom path)
- [x] Resize handles
- [x] Lightbox
- [x] Vim image commands
- [x] Settings window and controls (macOS smoke test)
- [x] Bases
- [x] Canvas
- [x] Graph
- [x] Pop-out windows
- [x] Mobile responsive/touch-target pass (desktop emulator; physical devices remain untested)

### Phase 5 — Configuration and accessibility

- [x] Style Settings metadata
- [x] High-contrast option
- [x] Reduced-motion behavior
- [x] Forced-colors behavior (Chromium-emulated; Windows manual review remains)
- [x] Larger-control option
- [x] Documentation for optional settings

### Phase 6 — Release preparation

- [ ] Complete test matrix
- [ ] Complete self-critique checklist
- [ ] Create original cover artwork
- [ ] Confirm manifest metadata
- [ ] Confirm license and attribution
- [ ] Run `npm run release`
- [ ] Inspect final `theme.css`
- [ ] Prepare Community Themes submission

## Decision log

Record decisions that affect architecture, compatibility, licensing, or visual identity.

| Date       | Decision                                                                                                                      | Reason                                                                                         | Consequence                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 2026-08-02 | Use `Aoi Tori` as the working name                                                                                            | It reflects 青い鳥 more directly than Aozora                                                   | Use `--aoi-*` token prefix                                                                                 |
| 2026-08-02 | Reference images outrank supplied HEX values                                                                                  | The images carry the intended atmosphere and color relationships                               | HEX values remain adjustable anchors                                                                       |
| 2026-08-02 | Do not edit `theme.css` directly                                                                                              | It is a generated release artifact                                                             | All styling work happens in `src/`                                                                         |
| 2026-08-02 | Do not create a SKILL yet                                                                                                     | No repository workflow has been repeated enough to stabilize                                   | Revisit after release audits become recurring                                                              |
| 2026-08-02 | Use warm paper and cool cloud/mist as distinct white families                                                                 | The primary images consistently balance paper warmth against cool atmospheric light            | Main reading surfaces stay warm-neutral; panels may lean cool                                              |
| 2026-08-02 | Separate watercolor cyan, clear sky, and cobalt interaction blue                                                              | The images give these blues different value, chroma, and narrative roles                       | Pale cyan is a surface; sky is atmosphere; accessible cobalt is functional                                 |
| 2026-08-02 | Use violet-navy ink instead of pure black                                                                                     | The close-up supplies the missing structural dark and keeps the palette coherent               | Body text, outlines, code, and dark surfaces use an ink/night family                                       |
| 2026-08-02 | Limit sakura/lilac to a sparse second voice and gold orange to a micro-accent                                                 | Their small image area matters narratively but does not justify broad UI coverage              | No pink workspace, rainbow headings, or gold replacement for warning semantics                             |
| 2026-08-02 | Approve an original abstract feather, two near-parallel curves, pale fields, and cloud-white space as future graphic language | These translate feather, duet, watercolor, and distance without copying reference art          | Final cover waits until Phase 6 and uses an actual Aoi Tori UI screenshot                                  |
| 2026-08-02 | Keep native 1.13 image behavior until current DOM evidence exists                                                             | Release notes define behavior but not stable selectors; Phase 1 did not instrument a vault     | No custom zoom/grid/resizing CSS or internal selectors before Phase 4 inspection                           |
| 2026-08-02 | Treat Community Health/Review as time-stamped guidance, not a safety ranking                                                  | Scorecards are automated, evolving, and may contain false positives or negatives               | Record exact findings and keep Aoi Tori's target at zero `!important` and zero `:has()`                    |
| 2026-08-02 | Preserve the existing unborn `master` branch during engineering normalization                                                 | The repository was already initialized; the request only required `main` when initializing     | Do not reinitialize or rename; report the actual branch                                                    |
| 2026-08-02 | Treat watercolor/work-related imagery as Tier A and the saturated summer-sky pair as Tier B                                   | The current user decision narrows the Phase 1 hierarchy                                        | Tier B sets clarity/chroma limits but cannot determine UI area ratios                                      |
| 2026-08-02 | Combine roadmap Phase 2 with a bounded slice of Phase 3/4 for this review build                                               | The current task explicitly requests final tokens plus a real preview slice                    | Mark only implemented/tested rows complete; keep broader compatibility work pending                        |
| 2026-08-02 | Approve `.image-embed.is-selected` and `.embed-action` only after rendered 1.13.4 DOM inspection                              | Pointer selection and actions were observed in the disposable local Vault                      | Style a non-layout cobalt outline and action states; leave resize/lightbox DOM native                      |
| 2026-08-02 | Keep all 53 Phase 2 primitive colors only because each has a current semantic reference                                       | The task requires removing unused token candidates                                             | Phase 2.5 may add a used accessible step, but no dormant primitive remains                                 |
| 2026-08-02 | Record the local installer as 1.13.4 for Phase 2                                                                              | Both Settings and the application bundle reported 1.13.4 during the actual test                | Supersede, but do not erase, the earlier Phase 1 observation of a 1.12.7 shell                             |
| 2026-08-02 | Use only cold-start-verified 1.13.4 Lucide IDs for Phase 2.5 Callouts                                                         | Hot reload left even native Callout SVGs empty; cold start produced reliable registry evidence | Use `lucide-info` when `lucide-circle-info` fails; add no external/custom icon asset                       |
| 2026-08-02 | Express watercolor air with bounded static semantic gradients                                                                 | Small hue layers improve the summer-watercolor identity without raster texture or blur         | Keep paper/text/actions solid; cap each refined component at two simple gradient layers                    |
| 2026-08-02 | Keep `.callout-content` transparent and let the parent own the surface                                                        | The native opaque content layer masked the parent wash as a nested white/black rectangle       | Preserve one continuous Callout ground without changing body text or spacing                               |
| 2026-08-02 | Create one Phase 2.5 checkpoint before starting Phase 3                                                                       | The current user explicitly requested staging and committing this reviewed baseline            | Phase 3 work starts from that commit and remains uncommitted without new authorization                     |
| 2026-08-03 | Remove the theme-added physical Toggle border instead of repositioning the thumb                                              | The border shrank a fixed native track content box and produced asymmetric 3 px / 1 px gaps    | Native checked transforms, active expansion, dimensions, and 2 px / 2 px centering stay intact             |
| 2026-08-03 | Treat desktop mobile emulation as responsive evidence, not device certification                                               | No iOS/iPadOS/Android simulator or hardware is installed                                       | Record physical gestures, keyboard, safe areas, and platform rendering as untested                         |
| 2026-08-03 | Keep Bases card image fit document-owned                                                                                      | Obsidian writes the Base view's `imageFit` as an inline style                                  | Style Settings gives native guidance instead of using `!important`                                         |
| 2026-08-03 | Preserve Style Settings metadata explicitly in the build                                                                      | Lightning CSS strips the plugin metadata comment while bundling                                | Build prepends the source block and audit verifies its groups in source and output                         |
| 2026-08-03 | Provide both OS-media and optional manual accessibility responses                                                             | OS preferences should work without a plugin, while manual controls help users without them     | Reduced motion, contrast, focus, borders, targets, gradients, and forced colors remain bounded             |
| 2026-08-03 | Keep readable and release CSS as separate generated outputs                                                                   | Packaging previously overwrote the reviewable root file with its minified result               | `build()` receives `outputFile` and `minify`; root stays formatted and `dist/Aoi-Tori` stays install-ready |

## Phase 1 result

- **Changed tracked candidates:** `.gitignore`, `PLANS.md`, `docs/DESIGN.md`, `docs/TESTING.md`,
  `docs/attribution.md`, `docs/obsidian-dom.md`, `docs/theme-research.md`, and
  `docs/visual-analysis.md`; `scripts/audit-css.mjs` also received a narrow parser correction.
- **Local-only evidence:** ignored `.analysis/contact-sheet.png` and focused crops under
  `.analysis/crops/`.
- **Implementation:** no file in `src/` and no generated or release file was changed.
- **Validation:** all touched Markdown/JavaScript files pass Prettier; audit, existing configured
  contrast, and manifest checks pass. The audit correction prevents `@import` statements and
  comments from being joined to the next selector.
- **Validation limits:** the repository-wide format scan also found seven pre-existing formatting
  differences outside this task's allowed scope, and Stylelint is unavailable because local npm
  dependencies are not installed. The full `npm run check` gate was intentionally not run because it
  starts by regenerating `theme.css`.
- **Manual tests:** no Obsidian UI, mobile, or cross-platform interaction is claimed as tested.
- **Remaining decisions:** confirm the warm-paper/cool-panel balance, the relative strength of
  cobalt versus sakura/lilac, the summer-night dark-mode direction, and the future abstract
  feather/paired-curve graphic language before Phase 2.

## Active-task template

Copy this section for a new complex task.

### Task: `<name>`

**Goal**

Describe the user-visible result.

**Scope**

- Included:
- Excluded:

**Evidence required**

- Official documentation:
- DOM inspection:
- Reference images:
- Commands:
- Screenshots/manual tests:

**Implementation steps**

- [ ] Research
- [ ] Plan
- [ ] Implement
- [ ] Build
- [ ] Lint
- [ ] Audit
- [ ] Contrast check
- [ ] Manual test
- [ ] Documentation
- [ ] Final report

**Risks**

- Risk:
- Mitigation:

**Result**

- Changed files:
- Commands run:
- Tests:
- Remaining issues:
