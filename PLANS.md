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

**Phase 2.5 — Visual refinement (complete; review correction verified)**

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
- [ ] File explorer, search, outline, backlinks, tags

### Phase 4 — Current Obsidian interactions

- [x] Live Preview image selected state (pointer path only)
- [x] Image action buttons (pointer visibility, hover, and zoom path)
- [ ] Resize handles
- [ ] Lightbox
- [ ] Vim image commands
- [x] Settings window and controls (macOS smoke test)
- [ ] Bases
- [ ] Canvas
- [ ] Graph
- [ ] Pop-out windows
- [ ] Mobile and touch

### Phase 5 — Configuration and accessibility

- [ ] Style Settings metadata
- [ ] High-contrast option
- [ ] Reduced-motion behavior
- [ ] Forced-colors behavior
- [ ] Larger-control option
- [ ] Documentation for optional settings

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

| Date       | Decision                                                                                                                      | Reason                                                                                         | Consequence                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 2026-08-02 | Use `Aoi Tori` as the working name                                                                                            | It reflects 青い鳥 more directly than Aozora                                                   | Use `--aoi-*` token prefix                                                              |
| 2026-08-02 | Reference images outrank supplied HEX values                                                                                  | The images carry the intended atmosphere and color relationships                               | HEX values remain adjustable anchors                                                    |
| 2026-08-02 | Do not edit `theme.css` directly                                                                                              | It is a generated release artifact                                                             | All styling work happens in `src/`                                                      |
| 2026-08-02 | Do not create a SKILL yet                                                                                                     | No repository workflow has been repeated enough to stabilize                                   | Revisit after release audits become recurring                                           |
| 2026-08-02 | Use warm paper and cool cloud/mist as distinct white families                                                                 | The primary images consistently balance paper warmth against cool atmospheric light            | Main reading surfaces stay warm-neutral; panels may lean cool                           |
| 2026-08-02 | Separate watercolor cyan, clear sky, and cobalt interaction blue                                                              | The images give these blues different value, chroma, and narrative roles                       | Pale cyan is a surface; sky is atmosphere; accessible cobalt is functional              |
| 2026-08-02 | Use violet-navy ink instead of pure black                                                                                     | The close-up supplies the missing structural dark and keeps the palette coherent               | Body text, outlines, code, and dark surfaces use an ink/night family                    |
| 2026-08-02 | Limit sakura/lilac to a sparse second voice and gold orange to a micro-accent                                                 | Their small image area matters narratively but does not justify broad UI coverage              | No pink workspace, rainbow headings, or gold replacement for warning semantics          |
| 2026-08-02 | Approve an original abstract feather, two near-parallel curves, pale fields, and cloud-white space as future graphic language | These translate feather, duet, watercolor, and distance without copying reference art          | Final cover waits until Phase 6 and uses an actual Aoi Tori UI screenshot               |
| 2026-08-02 | Keep native 1.13 image behavior until current DOM evidence exists                                                             | Release notes define behavior but not stable selectors; Phase 1 did not instrument a vault     | No custom zoom/grid/resizing CSS or internal selectors before Phase 4 inspection        |
| 2026-08-02 | Treat Community Health/Review as time-stamped guidance, not a safety ranking                                                  | Scorecards are automated, evolving, and may contain false positives or negatives               | Record exact findings and keep Aoi Tori's target at zero `!important` and zero `:has()` |
| 2026-08-02 | Preserve the existing unborn `master` branch during engineering normalization                                                 | The repository was already initialized; the request only required `main` when initializing     | Do not reinitialize or rename; report the actual branch                                 |
| 2026-08-02 | Treat watercolor/work-related imagery as Tier A and the saturated summer-sky pair as Tier B                                   | The current user decision narrows the Phase 1 hierarchy                                        | Tier B sets clarity/chroma limits but cannot determine UI area ratios                   |
| 2026-08-02 | Combine roadmap Phase 2 with a bounded slice of Phase 3/4 for this review build                                               | The current task explicitly requests final tokens plus a real preview slice                    | Mark only implemented/tested rows complete; keep broader compatibility work pending     |
| 2026-08-02 | Approve `.image-embed.is-selected` and `.embed-action` only after rendered 1.13.4 DOM inspection                              | Pointer selection and actions were observed in the disposable local Vault                      | Style a non-layout cobalt outline and action states; leave resize/lightbox DOM native   |
| 2026-08-02 | Keep all 53 Phase 2 primitive colors only because each has a current semantic reference                                       | The task requires removing unused token candidates                                             | Phase 2.5 may add a used accessible step, but no dormant primitive remains              |
| 2026-08-02 | Record the local installer as 1.13.4 for Phase 2                                                                              | Both Settings and the application bundle reported 1.13.4 during the actual test                | Supersede, but do not erase, the earlier Phase 1 observation of a 1.12.7 shell          |
| 2026-08-02 | Use only cold-start-verified 1.13.4 Lucide IDs for Phase 2.5 Callouts                                                         | Hot reload left even native Callout SVGs empty; cold start produced reliable registry evidence | Use `lucide-info` when `lucide-circle-info` fails; add no external/custom icon asset    |
| 2026-08-02 | Express watercolor air with bounded static semantic gradients                                                                 | Small hue layers improve the summer-watercolor identity without raster texture or blur         | Keep paper/text/actions solid; cap each refined component at two simple gradient layers |
| 2026-08-02 | Keep `.callout-content` transparent and let the parent own the surface                                                        | The native opaque content layer masked the parent wash as a nested white/black rectangle       | Preserve one continuous Callout ground without changing body text or spacing            |
| 2026-08-02 | Create one Phase 2.5 checkpoint before starting Phase 3                                                                       | The current user explicitly requested staging and committing this reviewed baseline            | Phase 3 work starts from that commit and remains uncommitted without new authorization  |

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
