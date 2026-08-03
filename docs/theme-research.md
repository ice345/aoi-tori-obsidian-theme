# Obsidian and community-theme research

Status: Phase 1 research snapshot completed and the current Obsidian baseline rechecked for Phase 3
on 2026-08-02 (Asia/Shanghai).

This document records a time-sensitive research snapshot. Versions, scorecards, download counts, and
repository heads can change after this date. Official Obsidian sources and each theme's own
repository were preferred over secondary summaries.

No external theme code or asset was copied into Aoi Tori. The themes below were inspected for
architecture, release practice, compatibility patterns, and failure modes only.

## Current Obsidian baseline

| Surface              | Current published state on 2026-08-02                                                                                 | Evidence                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Desktop Stable       | Public 1.13, distributed at Desktop code/build `1.13.4` on 2026-07-30                                                 | [Official changelog](https://obsidian.md/changelog/) and [download page](https://obsidian.md/download) |
| Desktop Early Access | Latest published Catalyst entry: `1.13.4` on 2026-07-27; no newer Catalyst entry was visible after the public release | [Official changelog](https://obsidian.md/changelog/)                                                   |
| Mobile Stable        | Public 1.13 on 2026-07-30, including features and fixes through Desktop `1.13.4`                                      | [Official changelog](https://obsidian.md/changelog/)                                                   |
| Mobile Early Access  | Latest published Catalyst entry: `1.13.4` on 2026-07-27                                                               | [Official changelog](https://obsidian.md/changelog/)                                                   |
| Installer            | `1.13.4`; the Windows, macOS, and APK links all target `v1.13.4` artifacts                                            | [Official download page](https://obsidian.md/download)                                                 |
| Desktop runtime      | Electron `43.1.1` in the current installer                                                                            | [1.13 Desktop developer notes](https://obsidian.md/changelog/)                                         |

“Early Access equals Stable” in this snapshot means only that the latest published Catalyst and
public builds share the `1.13.4` code level. It is not a promise that a newer Catalyst build will
not appear later.

### Changes that materially affect theme work

The public 1.13 release introduced a redesigned searchable Settings experience, keyboard navigation,
an optional separate Settings window, and a new image workflow. Live Preview images can be selected
by mouse or keyboard; copied, cut, or deleted; grown, shrunk, or reset; edited via Enter or Tab;
opened in the lightbox by click, Space, or the zoom button; and controlled in Vim by the new
`:image` command. Follow-up builds added a selection state and zoom button, fixed table resizing,
image action appearance, non-image embed actions, indented-line behavior, and image disappearance
while editing embeds. Mobile added double-tap zoom fixes and swipe-down dismissal.

Other relevant changes:

- Settings controls and validation states changed, including permanent slider values and reset
  buttons for slider/color definitions.
- Bases gained column resizing and received pop-out, formula-editor, color, and image-label fixes.
- Canvas received rendering-performance improvements.
- Base colors moved to OKLCH.
- `--callout-color` now accepts a complete CSS color instead of an RGB triplet; old triplet-only
  theme values are a compatibility risk.
- Pop-out windows, snippets, touch events, and older-installer image actions received fixes.

The release notes describe behavior but do not expose a stable public DOM contract. Phase 1 found a
local 1.13.4 installation without instrumenting it; Phase 3 subsequently launched the real test
Vault and confirmed Desktop/Installer 1.13.4 with Electron 43.1.1. The current public and latest
published Catalyst entries were still 1.13.4 on 2026-08-02. Rendered selector evidence, official
variables, and remaining limits are recorded in `docs/obsidian-dom.md` rather than inferred from
release notes.

## Official CSS and submission guidance

The current
[CSS variable documentation](https://docs.obsidian.md/Reference/CSS%20variables/About%20styling)
describes hundreds of built-in variables intended for theme overrides. The practical order for Aoi
Tori is therefore:

1. map image-derived primitives to official Obsidian semantic variables;
2. use low-specificity component rules only where a variable is insufficient;
3. inspect the current DOM before using an internal selector;
4. keep fallbacks and manual regression cases for every internal dependency.

The official [Theme guidelines](https://docs.obsidian.md/Themes/App%20themes/Theme%20guidelines) and
[Developer policies](https://docs.obsidian.md/Developer%20policies) reinforce the repository rules
already adopted here: prefer CSS variables, keep specificity low, avoid `!important`, keep assets
local, do not load network resources, disclose external code, preserve licenses, and keep the
project maintained. The October review checklist also cautions against `:has()` when broad installer
compatibility matters and against changing Live Preview vertical margins.

Current [manifest guidance](https://docs.obsidian.md/Reference/Manifest) requires `name`, `version`,
`minAppVersion`, and `author`; a submitted theme name is effectively permanent. Current
[submission guidance](https://docs.obsidian.md/Themes/App%20themes/Submit%20your%20theme) and the
[Community launch FAQ](https://obsidian.md/blog/future-of-plugins/) require or recommend:

- root `README.md`, `LICENSE`, `manifest.json`, and `theme.css`;
- a representative screenshot, with 512×288 as the recommended marketplace size;
- a semantic-version release tag matching `manifest.json`;
- `manifest.json` and `theme.css` attached to the GitHub release;
- signing in to Obsidian Community, connecting GitHub, selecting the repository, and completing the
  developer-dashboard submission;
- passing the automated review before a new project becomes searchable, normally within 24 hours;
- a new release version for corrections instead of silently replacing an already reviewed artifact.

No release metadata was changed in Phase 1.

## Health and Review scorecards

The new Community scorecard is explicitly a work in progress.

- **Health** summarizes repository hygiene, maintenance cadence, issue responsiveness, and adoption.
  It is not a security verdict.
- **Review** is an automated scan of the latest submitted release for policy, compatibility, and
  code-quality findings. A “Caution” label may represent maintainability or compatibility warnings
  rather than malicious behavior.
- Obsidian warns that scorecards can have false positives and false negatives. Manual review
  continues.
- All new projects must pass automated review. Each new version is scanned; a failing version can be
  removed from search within 24 hours. Older projects currently have a temporary exception, without
  a published end date.
- A developer can run a preview scan from the dashboard before publishing.

Because compatibility checks can use a theme's declared `minAppVersion`, warnings such as partial
support for `text-decoration`, `display: contents`, or `:has()` may refer to that older installer
baseline rather than the current 1.13 runtime. They still reveal the maintenance cost of broad
compatibility.

## Community-theme snapshot

Store version/update, Health, Review, and license come from each Community page. Repository-head
versions come from the current default-branch manifest. For Shimmering Focus, Border, and Kanagawa,
default-branch code was newer than the release that the scorecard scanned.

| Theme                                                                     | Store version / updated | Default-branch manifest | Health    | Review                    | License                                                |
| ------------------------------------------------------------------------- | ----------------------- | ----------------------- | --------- | ------------------------- | ------------------------------------------------------ |
| [Minimal](https://community.obsidian.md/themes/minimal)                   | `9.0.2` / 2026-07-28    | `9.0.2`                 | Excellent | Caution — 85 findings     | MIT                                                    |
| [Baseline](https://community.obsidian.md/themes/baseline)                 | `3.2.12` / 2026-07-31   | `3.2.12`                | Excellent | Caution — 277 findings    | MIT                                                    |
| [Shimmering Focus](https://community.obsidian.md/themes/shimmering-focus) | `5.86.0` / 2026-07-20   | `5.87.0`                | Excellent | Caution — 64 findings     | MIT; embedded fonts have additional OFL/Apache notices |
| [Border](https://community.obsidian.md/themes/border)                     | `1.13.6` / 2026-05-30   | `1.13.7`                | Excellent | Caution — 302 findings    | MIT                                                    |
| [Things](https://community.obsidian.md/themes/things)                     | `2.2.4` / 2026-06-07    | `2.2.4`                 | Excellent | Caution — 59 findings     | MIT; retained Minimal copyright notice                 |
| [Transparent](https://community.obsidian.md/themes/transparent)           | `2.4.166` / 2026-07-05  | `2.4.166`               | Excellent | Satisfactory — 3 findings | GPL-3.0                                                |
| [Kanagawa](https://community.obsidian.md/themes/kanagawa)                 | `4.0.0` / 2026-05-12    | `4.0.1`                 | Excellent | Passed — 0 findings       | MIT                                                    |

### Health details

These values are a snapshot, not a ranking of visual quality.

| Theme            | Hygiene                                                         | Maintenance                                                                                             | Responsiveness                                 | Adoption                           |
| ---------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------- |
| Minimal          | README, license, contributing guide, issue/PR templates present | Last commit/release about 5 days; 42 commits/year                                                       | 81% of 842 issues closed; 1 listed contributor | About 2.5M downloads; 5.3k stars   |
| Baseline         | Contributing guide missing; other hygiene items present         | About 2 days; 1,299 commits/year                                                                        | 91% of 234 issues closed; 1 contributor        | About 94.8k downloads; 1.5k stars  |
| Shimmering Focus | Contributing guide missing                                      | About 2 weeks; 93 commits/year                                                                          | 99% of 294 issues closed; 2 contributors       | About 333.8k downloads; 641 stars  |
| Border           | Contributing guide missing                                      | Last commit about 2 months; 125 commits/year; scorecard did not report a separate last-release interval | 93% of 342 issues closed; 1 contributor        | About 289.3k downloads; 2.5k stars |
| Things           | Contributing guide missing                                      | About 2 months; 19 commits/year                                                                         | 74% of 179 issues closed; 1 contributor        | About 1.3M downloads; 1k stars     |
| Transparent      | Contributing guide missing                                      | Commit about 3 weeks; release about 4 weeks; 404 commits/year                                           | 67% of 3 issues closed; 1 contributor          | About 27.1k downloads; 58 stars    |
| Kanagawa         | Contributing guide missing                                      | Commit about 2 months; release about 3 months; 5 commits/year                                           | 100% of 3 issues closed; 1 contributor         | About 24.1k downloads; 32 stars    |

### Review findings by theme

The counts below describe the Community release scan, not an independent security audit.

- **Minimal — 85:** 49 uses of `!important`; 30 `:has()` selectors; 4 partial-support
  `text-decoration` findings at its installer baseline; 1 oversized CSS file; 1 `text-indent`
  compatibility finding.
- **Baseline — 277:** 218 uses of `!important`; 49 `:has()` selectors; 3 duplicate `width`
  declarations; 3 invalid/unknown `::focus-visible` pseudo-element findings; 2 partial-support
  `display: contents` findings; 1 unreachable manifest URL; 1 oversized CSS file.
- **Shimmering Focus — 64:** 31 `:has()` selectors; 21 uses of `!important`; 10 partial-support
  `text-decoration` findings; 1 oversized CSS file; 1 `text-indent` compatibility finding.
- **Border — 302:** 180 uses of `!important`; 56 `:has()` selectors; 37 repeated `body` selector
  findings; repeated `.theme-light` and `.theme-dark` selector findings (3 each); 3 `text-indent`
  compatibility findings; 3 short-HEX findings; 2 graph-selector findings; plus isolated
  duplicate-selector, shorthand/redundancy, `text-decoration`, and `text-justify`/compatibility
  findings.
- **Things — 59:** 34 uses of `!important`; 23 partial-support CSS mask findings at its old
  installer baseline; 1 `text-decoration` compatibility finding; 1 duplicate `-webkit-mask-image`
  declaration. No `:has()` finding was reported.
- **Transparent — 3:** 3 partial-support `text-decoration` findings at its `1.5.8` installer
  baseline. The scanned release received Satisfactory rather than Caution.
- **Kanagawa — 0:** no automated Review findings in release `4.0.0`.

Current default branches can differ slightly from these counts. For example, the inspected Minimal
head contains 32 `:has()` occurrences rather than the release scan's 30, Border head contains 60
rather than 56, and Transparent head now contains one `!important`. Release scorecard numbers remain
the comparable baseline.

## Theme profiles

### Minimal

**Repository:** [kepano/obsidian-minimal](https://github.com/kepano/obsidian-minimal)

- **Source and build:** deeply modular SCSS under `src/scss/`, divided into variables, app,
  components, content, features, mobile, core plugins, community plugins, and color schemes.
  `build.js` uses Sass and Chokidar to build `theme.css` and an expanded `Minimal.css`; the current
  branch temporarily emits expanded CSS to both outputs.
- **Token architecture:** a small HSL base/accent input creates intermediate background (`bg`),
  interface (`ui`), text (`tx`), accent (`ax`), and highlight steps. A separate mapping layer
  assigns those values to official Obsidian semantic variables. Color schemes are isolated modules.
- **Style Settings:** extensive embedded settings plus the companion Minimal Theme Settings and
  Hider plugins. High capability also means a large option and regression surface.
- **Images:** optional image grids use `:has()`; full-width media respects explicit widths and the
  newer image wrapper; filters and width helper classes add more behavior. A focus-within rule
  preserves wrapper radius. These optional features still need testing against every 1.13 native
  image-selection/action state before any pattern is adapted.
- **Mobile, Bases, Canvas, Settings:** dedicated mobile folder, Bases module, Canvas module, and
  semantic settings surfaces. It also carries extensive community-plugin compatibility.
- **Learn:** clear module boundaries, intermediate-to-semantic token mapping, explicit build
  outputs, and documentation of helper classes.
- **Do not copy:** its visual identity, feature breadth, many optional selectors, or 49/30
  `!important`/`:has()` release footprint. Aoi Tori should stay smaller and preserve native 1.13
  image behavior by default.

### Baseline

**Repository:** [aaaaalexis/obsidian-baseline](https://github.com/aaaaalexis/obsidian-baseline)

- **Source and build:** modular SCSS with an explicit `src/theme.scss` import graph covering app,
  editor, layouts, elements, features, and color schemes. No root `package.json` or reproducible
  build command was present in the inspected branch, so the SCSS-to-committed-CSS process is not
  documented as a self-contained local build.
- **Token architecture:** official Obsidian variables are the main semantic surface, supplemented by
  motion, density, icon, and layout variables and numerous scheme modules. Some modules include
  component-local colors and highly specific internal selectors, which Aoi Tori should avoid.
- **Style Settings:** very deep integration, plus a preset marketplace and migration tool.
- **Images:** media width, fitting, dark-mode muting, banners, filters, grids, and a desktop
  `:active` full-screen zoom feature. That click/hold zoom behavior overlaps conceptually with
  Obsidian 1.13's native lightbox and is a test case, not a pattern to inherit.
- **Mobile, Bases, Canvas, Settings:** dedicated mobile, settings, Bases, and core-plugin modules;
  the current manifest targets `1.13.4`. It also detects newer CSS support to warn about stale
  installers.
- **Learn:** keeping current-Obsidian concerns in named modules, documenting preset migration, and
  treating mobile as a first-class design surface.
- **Do not copy:** its layout systems, encoded window-control artwork, large selector surface, or
  218/49 `!important`/`:has()` footprint.

### Shimmering Focus

**Repository:** [chrisgrieser/shimmering-focus](https://github.com/chrisgrieser/shimmering-focus)

- **Source and build:** numbered vanilla-CSS folders (`1-colorschemes` through `6-plugins`) make
  concatenation order explicit. GitHub Actions concatenates sources, uses Lightning CSS to lower
  syntax and minify, runs `doiuse`, appends Style Settings YAML, bumps the version, and creates the
  release. A Justfile supports the author's local-vault workflow.
- **Token architecture:** hue/saturation inputs generate a light/dark base scale, then scheme and
  semantic variables define accents and UI roles.
- **Style Settings:** a separate YAML source with more than one hundred options, appended to the
  release CSS.
- **Images:** custom maximum width, click/hold zoom through `:active`, alt-text captions, borders,
  and forced centering. The centering uses two documented `!important` declarations. These rules
  predate the complete 1.13 native image interaction and must not be treated as a DOM template.
- **Mobile, Bases, Canvas, Settings:** mobile adjustments are distributed through modules;
  core-plugin CSS handles Bases and Canvas; a dedicated settings file has recent 1.13 fixes.
- **Learn:** deterministic source ordering, syntax-lowering for installer compatibility,
  compatibility linting, and explicit changelog discipline.
- **Do not copy:** aggressive hiding of native controls, condensed spacing, image zoom behavior,
  embedded Base64 fonts, or its 21/31 `!important`/`:has()` footprint. Aoi Tori explicitly forbids
  bundled/Base64 fonts and must retain discoverable controls and whitespace.

### Border

**Repository:** [Akifyss/obsidian-border](https://github.com/Akifyss/obsidian-border)

- **Source and build:** one large `theme.css` plus `test.css`, preset files, and documentation; no
  package/build pipeline was found. The default branch is roughly 380 KB and contains several
  embedded Style Settings blocks.
- **Token architecture:** official base variables and many custom component/preset variables are
  mixed into a monolithic file. This enables broad customization but makes ownership and regression
  scope difficult to isolate.
- **Style Settings:** central to the theme, covering auto-hide, layouts, colors, Canvas, graph,
  images, and many presets.
- **Images:** generic image alignment/darkening and media-card rules exist, but no current
  image-wrapper/selection-specific implementation was found in the inspected branch.
- **Mobile, Bases, Canvas, Settings:** many mobile and settings selectors and an explicit Canvas
  configuration; no explicit current Bases class was found in the inspected CSS.
- **Learn:** clear user-facing preset documentation and visible credit for specific inspirations.
- **Do not copy:** the monolithic structure, broad internal-DOM targeting, appearance presets, or
  the review footprint led by 180 `!important` and 56 `:has()` findings. Credited portions from
  Maple, Minimal, and Mado Miniflow would also require tracing their original licenses before any
  adaptation.

### Things

**Repository:** [colineckert/obsidian-things](https://github.com/colineckert/obsidian-things)

- **Source and build:** a compact single-file theme with both `theme.css` and legacy `obsidian.css`;
  no package/build process is documented.
- **Token architecture:** root HSL base/accent inputs and named colors feed official semantic
  variables. This is understandable, but primitives, semantics, and components share one file.
- **Style Settings:** one embedded block for selected colors and features.
- **Images:** image-card styling and legacy selectors are present, but no dedicated 1.13 image
  wrapper/selection implementation was found.
- **Mobile, Bases, Canvas, Settings:** explicit phone/tablet sizing and a mobile floating action
  button; no explicit current Bases or Canvas rules in the inspected release; settings customization
  is limited.
- **Learn:** a small semantic core and deliberate mobile ergonomics can produce a coherent theme
  without a huge framework.
- **Do not copy:** the Things visual identity, legacy masks/icons, floating action control, or code
  inherited from Minimal. Its MIT license file retains the Minimal copyright notice, so any actual
  extraction would need that notice and more detailed provenance.

### Transparent

**Repository:** [Oczko24/Obsidian-transparent](https://github.com/Oczko24/Obsidian-transparent)

- **Source and build:** a single `theme.css` with screenshots/assets and no build pipeline.
- **Token architecture:** official semantic variables are combined with custom opacity, tint,
  animation, blur, border, and background controls.
- **Style Settings:** extensive embedded configuration for presets, remote custom image URLs,
  gradients, blur, animations, mobile behavior, and plugin integrations.
- **Images:** no dedicated native 1.13 image selection/wrapper code was found.
- **Mobile, Bases, Canvas, Settings:** explicit mobile/phone rules, Bases table handling, Canvas
  background/export handling, and settings styling are present.
- **Learn:** it demonstrates how a single file can expose coherent user controls and how to separate
  phone/tablet cases.
- **Do not copy:** GPL-3.0 code cannot be combined into the intended MIT Aoi Tori release without
  changing the project's licensing obligations. Remote backgrounds, large blur values,
  transparency/glass effects, and broad animation also directly conflict with Aoi Tori's asset,
  performance, and readability rules.

### Kanagawa

**Repository:** [sspaeti/obsidian_kanagawa](https://github.com/sspaeti/obsidian_kanagawa)

- **Source and build:** one roughly 18 KB `theme.css`; the package script only bumps versions and
  does not build CSS.
- **Token architecture:** a readable `:root` primitive palette maps directly to light/dark semantic
  variables. It is the simplest of the seven structures.
- **Style Settings:** none.
- **Images:** no special image handling was found.
- **Mobile, Bases, Canvas, Settings:** no dedicated rules were found for these current surfaces.
- **Learn:** small primitive-to-semantic mappings can remain understandable and can pass the
  automated scan with zero findings.
- **Do not copy:** the Kanagawa palette or editor identity, broad heading color spectrum, and lack
  of current-surface coverage. A clean scan does not prove complete 1.13 behavior.

## Cross-theme conclusions for Aoi Tori

1. Adopt **Minimal's module boundaries** and **Shimmering Focus's reproducible compatibility
   checks**, but keep Aoi Tori's existing PostCSS source-of-truth and audit scripts.
2. Keep a **small primitive layer → explicit semantic layer → low-specificity component layer**.
   Kanagawa shows the value of simplicity; Minimal shows the value of a separate mapping layer.
3. Treat `!important`, `:has()`, data URIs, internal DOM, and large selector graphs as budgeted
   exceptions. The target remains zero `!important` and zero `:has()` until a documented current DOM
   case proves otherwise.
4. Do not add a large Style Settings surface in the first implementation. A coherent default with a
   few meaningful options is preferable to hundreds of interdependent variants.
5. Do not implement custom image zoom, click/hold sizing, or image grids before the 1.13 native
   interaction matrix passes. Current native image behavior is the default contract.
6. Mobile, Bases, Canvas, pop-outs, and the separate/embedded Settings presentations need named test
   cases even if their CSS remains mostly semantic-variable mapping.
7. Preserve safety colors and accessibility semantics. A beautiful theme can still receive a clean
   review only if structure, maintenance, and release hygiene remain disciplined.

## Primary sources

- [Obsidian changelog](https://obsidian.md/changelog/)
- [Obsidian download page](https://obsidian.md/download)
- [CSS variables: About styling](https://docs.obsidian.md/Reference/CSS%20variables/About%20styling)
- [Theme guidelines](https://docs.obsidian.md/Themes/App%20themes/Theme%20guidelines)
- [Submit your theme](https://docs.obsidian.md/Themes/App%20themes/Submit%20your%20theme)
- [Manifest reference](https://docs.obsidian.md/Reference/Manifest)
- [Developer policies](https://docs.obsidian.md/Developer%20policies)
- [Community and automated-review announcement](https://obsidian.md/blog/future-of-plugins/)
- Theme repositories and Community pages linked in the snapshot and profile sections.
