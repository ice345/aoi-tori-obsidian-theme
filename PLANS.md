# PLANS.md

This project is complex enough to justify a durable execution plan. Keep this file concise, current,
and evidence-based.

## Active objective

Build the first maintainable Aoi Tori theme release with:

- An image-derived visual system.
- Independent light and dark modes.
- Stable Obsidian semantic-token mappings.
- Compatibility with current editor and image interactions.
- Reproducible build, lint, audit, contrast, and release commands.
- Documentation suitable for future Community Themes submission.

## Current phase

**Phase 4 — Mobile, Style Settings, and accessibility (complete; awaiting release review)**

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

| Date       | Decision                                                                                                                      | Reason                                                                                         | Consequence                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 2026-08-02 | Use `Aoi Tori` as the working name                                                                                            | It reflects 青い鳥 more directly than Aozora                                                   | Use `--aoi-*` token prefix                                                                     |
| 2026-08-02 | Reference images outrank supplied HEX values                                                                                  | The images carry the intended atmosphere and color relationships                               | HEX values remain adjustable anchors                                                           |
| 2026-08-02 | Do not edit `theme.css` directly                                                                                              | It is a generated release artifact                                                             | All styling work happens in `src/`                                                             |
| 2026-08-02 | Do not create a SKILL yet                                                                                                     | No repository workflow has been repeated enough to stabilize                                   | Revisit after release audits become recurring                                                  |
| 2026-08-02 | Use warm paper and cool cloud/mist as distinct white families                                                                 | The primary images consistently balance paper warmth against cool atmospheric light            | Main reading surfaces stay warm-neutral; panels may lean cool                                  |
| 2026-08-02 | Separate watercolor cyan, clear sky, and cobalt interaction blue                                                              | The images give these blues different value, chroma, and narrative roles                       | Pale cyan is a surface; sky is atmosphere; accessible cobalt is functional                     |
| 2026-08-02 | Use violet-navy ink instead of pure black                                                                                     | The close-up supplies the missing structural dark and keeps the palette coherent               | Body text, outlines, code, and dark surfaces use an ink/night family                           |
| 2026-08-02 | Limit sakura/lilac to a sparse second voice and gold orange to a micro-accent                                                 | Their small image area matters narratively but does not justify broad UI coverage              | No pink workspace, rainbow headings, or gold replacement for warning semantics                 |
| 2026-08-02 | Approve an original abstract feather, two near-parallel curves, pale fields, and cloud-white space as future graphic language | These translate feather, duet, watercolor, and distance without copying reference art          | Final cover waits until Phase 6 and uses an actual Aoi Tori UI screenshot                      |
| 2026-08-02 | Keep native 1.13 image behavior until current DOM evidence exists                                                             | Release notes define behavior but not stable selectors; Phase 1 did not instrument a vault     | No custom zoom/grid/resizing CSS or internal selectors before Phase 4 inspection               |
| 2026-08-02 | Treat Community Health/Review as time-stamped guidance, not a safety ranking                                                  | Scorecards are automated, evolving, and may contain false positives or negatives               | Record exact findings and keep Aoi Tori's target at zero `!important` and zero `:has()`        |
| 2026-08-02 | Preserve the existing unborn `master` branch during engineering normalization                                                 | The repository was already initialized; the request only required `main` when initializing     | Do not reinitialize or rename; report the actual branch                                        |
| 2026-08-02 | Treat watercolor/work-related imagery as Tier A and the saturated summer-sky pair as Tier B                                   | The current user decision narrows the Phase 1 hierarchy                                        | Tier B sets clarity/chroma limits but cannot determine UI area ratios                          |
| 2026-08-02 | Combine roadmap Phase 2 with a bounded slice of Phase 3/4 for this review build                                               | The current task explicitly requests final tokens plus a real preview slice                    | Mark only implemented/tested rows complete; keep broader compatibility work pending            |
| 2026-08-02 | Approve `.image-embed.is-selected` and `.embed-action` only after rendered 1.13.4 DOM inspection                              | Pointer selection and actions were observed in the disposable local Vault                      | Style a non-layout cobalt outline and action states; leave resize/lightbox DOM native          |
| 2026-08-02 | Keep all 53 Phase 2 primitive colors only because each has a current semantic reference                                       | The task requires removing unused token candidates                                             | Phase 2.5 may add a used accessible step, but no dormant primitive remains                     |
| 2026-08-02 | Record the local installer as 1.13.4 for Phase 2                                                                              | Both Settings and the application bundle reported 1.13.4 during the actual test                | Supersede, but do not erase, the earlier Phase 1 observation of a 1.12.7 shell                 |
| 2026-08-02 | Use only cold-start-verified 1.13.4 Lucide IDs for Phase 2.5 Callouts                                                         | Hot reload left even native Callout SVGs empty; cold start produced reliable registry evidence | Use `lucide-info` when `lucide-circle-info` fails; add no external/custom icon asset           |
| 2026-08-02 | Express watercolor air with bounded static semantic gradients                                                                 | Small hue layers improve the summer-watercolor identity without raster texture or blur         | Keep paper/text/actions solid; cap each refined component at two simple gradient layers        |
| 2026-08-02 | Keep `.callout-content` transparent and let the parent own the surface                                                        | The native opaque content layer masked the parent wash as a nested white/black rectangle       | Preserve one continuous Callout ground without changing body text or spacing                   |
| 2026-08-02 | Create one Phase 2.5 checkpoint before starting Phase 3                                                                       | The current user explicitly requested staging and committing this reviewed baseline            | Phase 3 work starts from that commit and remains uncommitted without new authorization         |
| 2026-08-03 | Remove the theme-added physical Toggle border instead of repositioning the thumb                                              | The border shrank a fixed native track content box and produced asymmetric 3 px / 1 px gaps    | Native checked transforms, active expansion, dimensions, and 2 px / 2 px centering stay intact |
| 2026-08-03 | Treat desktop mobile emulation as responsive evidence, not device certification                                               | No iOS/iPadOS/Android simulator or hardware is installed                                       | Record physical gestures, keyboard, safe areas, and platform rendering as untested             |
| 2026-08-03 | Keep Bases card image fit document-owned                                                                                      | Obsidian writes the Base view's `imageFit` as an inline style                                  | Style Settings gives native guidance instead of using `!important`                             |
| 2026-08-03 | Preserve Style Settings metadata explicitly in the build                                                                      | Lightning CSS strips the plugin metadata comment while bundling                                | Build prepends the source block and audit verifies its groups in source and output             |
| 2026-08-03 | Provide both OS-media and optional manual accessibility responses                                                             | OS preferences should work without a plugin, while manual controls help users without them     | Reduced motion, contrast, focus, borders, targets, gradients, and forced colors remain bounded |

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
