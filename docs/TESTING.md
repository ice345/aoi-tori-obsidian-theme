# Testing

## Phase 6 space and dark re-derivation review

Implemented from `docs/aesthetic-audit-2026-09-11.md` §12 and exercised on 2026-09-12 in the
installed Obsidian 1.13.7 desktop client on macOS, frameless full-screen, with the theme symlinked
from `test-vault-content/.obsidian/themes/Aoi Tori` to this checkout.

**Pixel evidence, not computed style.** An earlier round of this pass was misread: the split's
computed background was already the new value while the rendered pixels stayed mist, because
Obsidian paints `--background-secondary` on `.workspace-tabs .workspace-leaf` above the split. Every
result below is a modal read of the rendered PNG with `body.is-focused` true.

### V01 default, both sidebars, no Style Settings

| Region                                                    | Light             | Dark              |
| --------------------------------------------------------- | ----------------- | ----------------- |
| Traffic-light corner, left pane, vault strip, left toggle | `#EAF4F4` H197.0° | `#1C272E` H236.5° |
| Central tab bar (empty area), status bar                  | `#F6F8F7` H165.1° | `#232A30` H244.2° |
| Central reading pane                                      | `#FBFAF8` H84.6°  | `#232A30` H244.2° |
| Right toggle, right pane                                  | `#F5EFF4` H331.0° | `#29282F` H292.1° |

Contrast at the measured surfaces, body / nav-or-secondary: light 12.47/5.39, 13.10/5.11,
13.39/5.22, 12.33/5.33; dark 12.63/8.53, 12.05/8.14, 12.10/8.18.

### Worst-case tint (Sky = Clear, outer edge)

The figures above use the untinted surface. The shipped background is surface **plus** wash, so the
extreme was measured separately: the 7% wash at the outer edge composites to `#DEEDF1` (left) and
`#EBE4EC` (right), and nav text there measures 5.03:1 and 4.84:1. Real pixels at that setting read
`#DFEDF1` and `#EBE4EC`, matching the model, and return to the plain surface at the inner edge.

An earlier revision of this pass shipped `--nav-item-color` at `--aoi-ink-muted` and measured 4.54:1
/ 4.37:1 at the same points — the right side below the 4.5 floor. `--aoi-ink-muted-side` (`#516577`)
is used for text on the tinted surfaces; `--text-muted` keeps its paper value.

### Layout variants (dark)

| Layout        | Left strip                      | Centre            | Right strip                          |
| ------------- | ------------------------------- | ----------------- | ------------------------------------ |
| Both sidebars | `#1C272E` H236.5°               | `#232A30` H244.2° | `#29282F` H292.1°                    |
| Left only     | `#1C272E` H236.5°               | `#232A30` H244.2° | `#232A30` (bridge, no blush remnant) |
| No sidebar    | neutral night family throughout |                   |                                      |

### Component surfaces (dark, composited)

| Surface               | Measured              | Body / secondary                    |
| --------------------- | --------------------- | ----------------------------------- |
| Reading               | `#232A30` H244.2°     | 12.05 / 8.14                        |
| Quote                 | `#333941` H260.1°     | 9.71 / 6.56                         |
| Code / inline code    | `#191F26` H252.5°     | 13.76 / 9.30                        |
| HR                    | `#47535F` H248.4°     | visible against `#232A30`           |
| Properties card / key | `#191F26` / `#2C343C` | card and key remain distinguishable |

Quote sits `ΔL +0.076` above the dark reading surface at a `ΔH +23.6°` shift, so the default 4%
(Balanced) wash reads as a tint rather than a pink card. Code is a `ΔL −0.044` step from the reading
surface, a shallow well rather than a blue-black recess.

The quote row above and this paragraph were re-measured on 2026-09-13 from the current build,
because the earlier record quoted the 2% Whisper level while Balanced 4% is the shipped default.
Measured in an isolated Chromium page against the built `theme.css`, compositing the blockquote
gradient over its base colour:

| Mode / level   | Wash | Composited quote | ΔL vs reading surface | ΔH        | Chroma   |
| -------------- | ---- | ---------------- | --------------------- | --------- | -------- |
| Light Whisper  | 6%   | `#F3F3F3`        | `+0.005`              | `+130.6°` | `0.0010` |
| Light Balanced | 12%  | `#F2EEF0`        | `−0.007`              | `+148.1°` | `0.0053` |
| Light Present  | 16%  | `#F1EAEE`        | `−0.015`              | `+149.5°` | `0.0082` |
| Dark Whisper   | 2%   | `#30363F`        | `+0.065`              | `+17.6°`  | `0.0175` |
| Dark Balanced  | 4%   | `#333941`        | `+0.076`              | `+23.6°`  | `0.0171` |
| Dark Present   | 6%   | `#373B44`        | `+0.086`              | `+29.8°`  | `0.0169` |

These are computed-CSS measurements, not Obsidian screenshots. The `90-final-light.png` /
`91-final-dark.png` captures predate this round and were **not** re-taken, so they are not evidence
for the current default.

### Missing icon registry

`[!aoi-tori]` and `[!second-voice]` resolve to inline SVG in 1.13.7. `lucide-bird` is **not**
registered in this client, so `[!bluebird]` is deferred. No remote SVG or guessed id was added.

### Mobile drawer

With `dev:mobile on` (desktop emulator, `is-mobile` true, `is-phone` false, 1188 px) the left drawer
resolved to `rgb(28,39,46)` = `#1C272E`, the left night surface, with a transparent header.
Phone-class layout and physical devices remain untested.

### Verification status

One matrix, so a simulated check is never read as a real-device pass. "Simulated" means an isolated
Chromium page rendering the built `theme.css` with forced body classes and CDP media emulation; it
tests the author CSS cascade, not Obsidian's own rendering or the operating system.

The nav-state row loads Obsidian's own consumption rules (`.tree-item-self.is-active`,
`.is-selected`, and `:hover` from `app.css`) because the theme styles `.nav-file-title.is-active`
only and leaves `--nav-item-color-selected` / `--nav-item-background-selected` to the client.
Without those rules the selected state silently falls back to the base colour and reads as a pass it
never earned. The forced-colors row also covers the theme's own setting classes: they declare the
same tokens at equal specificity, so any check that sets only `theme-light` / `theme-dark` misses
them.

`npm run scenarios` is the repeatable form of every "Simulated pass" row below. It parses the built
`theme.css` with `lightningcss` and resolves the real cascade — source order, specificity, and the
`forced-colors` / `prefers-contrast` media queries — over 582 scenarios. It runs inside
`npm run check`, so a regression fails the gate instead of waiting for a review. The Chromium runs
were the independent check on that script: reverting the Soft fix makes the script exit 1, and
perturbing `--aoi-workspace-tint-max-aqua` by one hex step fails the derived-versus-precomputed
assertion, so both the fix and the constants are genuinely covered.

### Pixel check

`scripts/check-pixels.mjs` is the only check that reads what was painted rather than what was
declared, and the only one that is **not** part of `npm run check`: a real pixel test needs a
renderer, and putting a browser in CI for a static-CSS theme is a dependency the audit asks to
avoid.

Procedure:

1. Serve `.analysis/pixel/px-<mode>.html`, which loads the saved native `app.css` and the built
   `theme.css`, at a viewport of 400x200 with devicePixelRatio 1.25.
2. The stage is exactly 400x200 CSS px; the Callout sits at (40,40) and measures 300x120, with its
   title and content hidden so no glyph or shadow can fall in a sample band. CSS coordinate x 1.25 =
   device pixel.
3. Screenshot the viewport to `shot-<mode>.png`, then run
   `node scripts/check-pixels.mjs <directory>`.

Tolerance is 3 per channel; PNG is lossless, so the allowance only absorbs antialiasing. The script
asserts the page colour, the full-opacity semantic edge, that the interior differs from the page,
and that the wash fades toward the surface. The wash direction is measured as distance from the
surface rather than luminance, because it brightens a dark surface and darkens a light one.

The Callout rows are also covered by `npm run scenarios`, which now carries a native core contract:
a hand-written, minimal reproduction of the six `app.css` declarations these values lose to
(`body { --callout-border-width: 0px; --code-border-width: 0px; --callout-blend-mode: var(--highlight-mix-blend-mode) }`
and the two `--highlight-mix-blend-mode` mode values). It is parsed before `theme.css` so it carries
the lowest source order, the way the real load order behaves. Full native CSS is never bundled.

Two fidelity gaps had to be closed in the harness before those assertions meant anything, and both
were found by running them against the pre-repair tree rather than assuming they worked:

- The harness resolved inherited declarations in the _consumer's_ context, so a `:root` alias whose
  `var()` referenced a mode variable resolved fine at `body` and passed. A browser evaluates a
  custom property where it is declared, so it is invalid there and inherits as invalid. Each element
  now resolves its own declarations, and only finished values inherit.
- The harness also put the mode class on `html`, which let `:root` aliases match the mode block.
  Obsidian puts the mode class on `body` only.

With both corrected, all ten contract assertions fail on the pre-repair build and pass on the
current one, and the 582 existing scenarios are unchanged (no new skips, identical anchor ratios).
The isolated Chromium fixture is retained as the independent check: it loads the saved native CSSOM
snapshot and the built `theme.css` together and confirms each value reaching the rendered element,
which the harness only models.

| Check                                                             | Status                            | Evidence                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme High contrast + sidebar contrast Soft                       | Simulated pass                    | Nav text resolves to `#3E4B5C`, 6.81:1 at Aqua + Clear                                                                                                                                                                                                          |
| Light contrast = High + Soft                                      | Simulated pass                    | 6.81:1                                                                                                                                                                                                                                                          |
| `prefers-contrast: more` + Soft                                   | Simulated pass                    | 6.81:1                                                                                                                                                                                                                                                          |
| `forced-colors: active`, 2 themes x 4 sidebar x 2 switches        | Simulated pass                    | 24/24: `Canvas` surfaces, `CanvasText` text, `none` decoration, HR `CanvasText`                                                                                                                                                                                 |
| Navigation base / hover / active / selected / focus               | Simulated pass                    | 120/120 (24 scenarios x 5 states) at or above 4.5:1; worst pairs dark active 4.72:1, dark selected 4.63:1                                                                                                                                                       |
| Soft nav weight, and its reset on high contrast                   | Simulated pass                    | Soft 300, active row still 600; class switch, Light contrast = High, `prefers-contrast: more` and forced colours all reset to 400                                                                                                                               |
| Native core contract (D01-D05)                                    | In `npm run check`                | 10 assertions, both modes, all fail on the pre-repair build: border widths `0px` -> `2px`/`1px`, blend `darken`/`lighten` -> `normal`, both aliases `unresolved` -> resolved                                                                                    |
| Border roles reach every boundary (D06)                           | In `npm run check`                | Both modes fail pre-repair with "the border roles do not resolve"; each level then must move the dividers and keep the control outline at or above 3:1                                                                                                          |
| Border role values, computed in Chromium                          | Simulated pass                    | Dark: input 4.24 / 5.37 / 6.18 / 6.35:1 across standard, strong, stronger and contrast-high; checkbox 3.72 / 4.71 / 5.42 / 5.57:1. All eight components take four or five distinct values                                                                       |
| Audit 8.3 reverse tests, all eight                                | In `npm run check`                | Each mutation is demonstrated, not asserted: a fixed wash on the safety family reports 24 failures; a brighter Callout surface fails link contrast at 2.15:1 against the current 4.68-4.74:1                                                                    |
| Component geometry scope (R02)                                    | In `npm run check`                | 20 assertions fail pre-repair: `--callout-radius` 4px vs 8px, `--callout-title-weight` unsupported vs 500, `--input-height` 30px vs 34px, `--input-radius` 5px vs 8px, `--metadata-border-radius` 0 vs 8px and the rest                                         |
| Geometry values, computed in Chromium                             | Simulated pass                    | 13 of 13 tokens now effective; Callout radius 4px -> 8px, input 30px/5px -> 34px/8px, Callout title weight renders 500                                                                                                                                          |
| Container hierarchy (R01)                                         | In `npm run check`                | 4 assertions fail pre-repair: the dark table header shares `#191F26` with the zebra row, header 1.140:1 and highlight 1.126:1 against the page, light highlight 1.060:1. Now 1.154 / 1.315 / 1.358 / 1.181                                                      |
| Element consumption contract (8.2.2)                              | In `npm run check`                | Real properties resolved on a synthetic `.callout`, not custom-property strings: removing `--callout-blend-mode: normal` reports `resolved to darken`/`lighten`; moving `--callout-border-width` back to `:root` reports `resolved to 0px, expected 2px`        |
| Final pixels (8.2.3)                                              | Local, `scripts/check-pixels.mjs` | Pre-repair: "the Callout interior painted `#222A30`, the same as the page; the container is invisible" (dark) and the edge painted `#EDF2F3` instead of `#245F90` (light). Current build passes both modes. Not in `npm run check`, because it needs a renderer |
| Dark Callout surface and edge (D01/D02)                           | Simulated pass                    | Native `app.css` 1.13.7 + built `theme.css` in one page: `mix-blend-mode` `lighten` -> `normal`, inline-start edge `0px` -> `2px`, surface `#1A2027` -> `#2C343C`                                                                                               |
| Callout defaults and geometry (D03-D05)                           | Simulated pass                    | `--callout-border-width` 0px -> 2px, `--code-border-width` 0px -> 1px, active-line alias resolves, selected-image outline `none` -> `solid 1px`                                                                                                                 |
| Callout type and strength matrix (D07/D08)                        | Simulated pass                    | 25 types x 2 modes x Quiet/Balanced/Airy: Quiet 3% and Airy 7% reach every type; `attention` and `missing` join the right family                                                                                                                                |
| Real Windows High Contrast                                        | **Untested**                      | Requires a Windows host                                                                                                                                                                                                                                         |
| Style Settings install / reset / plugin disable                   | **Untested this round**           | Last exercised 2026-08-03 on Style Settings 1.0.9                                                                                                                                                                                                               |
| Cloud / Mist / Aqua -> Duet migration                             | **Untested this round**           | Cascade verified only                                                                                                                                                                                                                                           |
| Canvas / Graph / PDF / Bases / search in sidebar                  | **Untested this round**           | Central surface and transparent leaves not re-checked                                                                                                                                                                                                           |
| Pop-out, multi-note split, single sidebar, narrow and phone-class | **Untested this round**           | —                                                                                                                                                                                                                                                               |

`checkout-diff.md` and `.omp/config.yml` are local working material, not project sources; both are
listed with an explanatory comment in `.prettierignore` so `npm run format:check` no longer reports
them.

## Phase 4 mobile and accessibility review

Phase 4 was exercised on 2026-08-03 in the installed Obsidian/Installer 1.13.4 desktop client on
macOS 26.5 arm64, Electron 43.1.1. The official desktop mobile emulator supplied `is-mobile` and
`is-tablet`; controlled `is-phone` runs used 390×844, 320×700, and 844×390 viewports. These are
responsive/DOM tests in the official desktop client, not physical iPhone, iPad, or Android tests.

The pass covered light/dark editor and Reading view, side drawers, Search, bottom navigation, mobile
toolbar, command palette, Quick switcher, Settings, modal/menu surfaces, Properties, Callouts, wide
tables, images, selected image actions, Lightbox, Bases Table/Cards, Canvas, Graph, tablet and
narrow/landscape layouts. Document scroll width remained equal to viewport width; wide tables and
Bases Table scrolled inside their native containers. Important visible targets measure at least
44×44 px, while Toggle tracks retain native geometry inside a larger Settings hit region.

Style Settings 1.0.9 was locally installed in the ignored test Vault for this pass. It parsed all 48
Aoi Tori entries with an empty error list, defaults reproduced the reviewed theme, and
representative palette/accessibility variants updated and reset correctly. Community-plugin presence
is relevant only to this test; the built theme has no plugin runtime dependency.

Chromium media emulation verified `prefers-reduced-motion: reduce` (`transition-property: none`,
duration `0s`), `prefers-contrast: more` (3 px focus), and `forced-colors: active`. Under simulated
forced colors, links were system-colored and underlined, a phone Settings Toggle retained a system
track/thumb distinction, and Settings buttons retained visible system boundaries. Windows High
Contrast remains a required real-platform check.

That 2026-08-03 pass did not test the theme's own sidebar decoration under forced colors. A
2026-09-13 review found the theme's `background-image: none` rules lost the cascade to the sidebar
and HR rules, and that the sidebar options could still override the `Canvas` surfaces. Both are
fixed and covered by the simulated matrix above; the real Windows check is still outstanding.

Untested: physical iPhone/iPad/Android phone/tablet, real safe-area hardware, virtual-keyboard
avoidance, long-press, swipe dismissal, drag/pan, pinch zoom, double-tap zoom, mobile previous/next,
and an actual mobile external keyboard. The desktop keyboard path was checked in emulation, but is
not labeled as a mobile-hardware result.

## Phase 3 desktop review

The desktop interaction matrix was exercised on 2026-08-02 in Obsidian Desktop and Installer 1.13.4
on macOS 26.5 (Apple silicon), using Electron 43.1.1. The local theme symlink and Vault
configuration remain ignored. Restricted mode stayed enabled and no community plugin was loaded.

Actual testing covered light/dark, Vim off/on, the complete normal image command flow, Vim image
commands, nested image contexts, non-image embeds, current Settings controls, Bases, Canvas, global
and local Graph, native core views, note/Canvas/Bases/Graph/Settings pop-outs, fullscreen/maximized,
760×820 narrow, and multi-column layouts. Exact actions, partial states, environment fields, and
review screenshots are in `docs/test-matrix.md`; DOM evidence and the selector risk register are in
`docs/obsidian-dom.md`.

This remains a macOS desktop test, not a release-support claim. The residual checks are Graph
transient hover/selected/search-highlight inspection, a Canvas minimap that the current client does
not expose, plugin cards under unrestricted mode, the Community Health/Review presentation, stock
validation-error/textarea states, ultrawide hardware, Windows/Linux, and physical mobile/touch. The
user subsequently confirmed Table image Resize, Bases Cards, light Graph, Canvas group/node
hierarchy, and narrow pop-out behavior as normal.

## Phase 2 historical review

The earlier minimum preview slice used the same Obsidian/Installer 1.13.4 environment with Vim off.
Phase 3 supersedes its “untested” image, embed, pop-out, narrow-layout, Bases, Canvas, Graph, and
core view rows. Phase 2 screenshots remain historical evidence and are not promoted to Phase 3
claims.

## Phase 1 baseline

The Phase 1 compatibility target recorded on 2026-08-02 was Obsidian Desktop code `1.13.4` and
Mobile `1.13`, including the current 1.13 image workflow. Phase 1 observed a `1.12.7` installer
shell and performed no live vault test. The Phase 2 run supersedes that local-shell observation:
both the application and Settings now report Installer 1.13.4. Phase 1 interaction rows remain
historical untested evidence rather than retroactive test claims.

Do not convert official changelog behavior or source inspection into a manual-test claim. Record the
app code version and installer version separately because current features may behave differently on
older installer shells.

## Automated quality gate

Run:

```bash
npm run check
```

This executes:

1. CSS build
2. Stylelint
3. Formatting check
4. Repository/theme audit
5. Configured contrast checks
6. Manifest validation

A successful automated check does not replace manual Obsidian testing.

The audit also checks that every CSS import stays under `src/`, that built CSS contains no
`.analysis/`, `test-vault-content/`, or `references/raw/` path, that the four styled image selectors
are recorded in `docs/obsidian-dom.md`, and that Style Settings metadata/groups survive the build.
When the ignored local `test-vault-content/Phase 3` tree exists, the audit also verifies the
required fixture set. In a clean CI checkout where that ignored tree is absent, the audit warns and
continues. These are release-boundary checks, not permission to package the fixture directory.

## Release-candidate package test

For a release-candidate pass, run:

```bash
npm run format
npm run check
npm run package
```

`npm run package` must produce `dist/Aoi-Tori/` with only `manifest.json` and `theme.css`. The
package audit must reject local absolute paths, remote CSS resources, Base64 assets, source/test
markers, and unexpected files, then print SHA-256 values for the packaged files.

The root `theme.css` is the readable generated artifact used by review and Git diff. The package
script first runs `npm run check` (which rebuilds that root file), then generates the minified
`dist/Aoi-Tori/theme.css` directly; it must not copy a minified file over the root artifact. Both
artifacts must retain the complete `@settings` metadata comment.

Install the package into a fresh ignored test Vault rather than relying only on the development
symlink:

```text
<Clean Test Vault>/.obsidian/themes/Aoi Tori/
├── manifest.json
└── theme.css
```

Record whether Obsidian recognized the theme, whether light and dark modes opened, whether the
optional Style Settings plugin was absent or present, whether a restart preserved the theme, whether
the manifest name/version matched the package, and whether the Console exposed resource-loading
errors caused by the theme.

Do not mark physical mobile devices, Windows/Linux window chrome, real Windows High Contrast,
assistive technologies, or broad third-party plugin compatibility as passed from this clean-install
test unless those environments were actually used.

## Release-candidate Markdown semantic polish

The pre-RC visual polish adds `test-vault-content/Aoi-Tori-Markdown-Semantics.md` as ignored local
review content. It covers Chinese/Japanese/English mixed text, bold, italic, bold italic,
strikethrough, highlight, tags, tasks, footnotes, links, `<kbd>`, tables, quote and Callout nested
emphasis, long emphasis paragraphs, and continuous highlights.

For this pass, run:

```bash
npm run format
npm run build
npm run lint
npm run audit
npm run contrast
npm run validate:manifest
npm run check
npm run package
```

The contrast configuration must include destructive primary/secondary buttons, bold, italic,
highlight, and tags in both light and dark modes. Keep `test-vault-content/` and
`.analysis/semantic-polish/` out of release packages. When screenshots are produced, store them only
under `.analysis/semantic-polish/`.

The 2026-08-03 semantic-polish review used Obsidian Desktop/Installer 1.13.4 on macOS with the local
theme symlinked from the repository root. Screenshots were captured for light/dark destructive
buttons, focus-visible, Reading, Live Preview, Source mode, tags/tasks, and footnotes/KBD/HR. UI
zoom smoke covered 90%, 100%, and 110%; narrow-window smoke used a 760 px wide window; pop-out smoke
opened the current Markdown file in a new window and closed it after verifying the theme and active
file. Copy/cut/paste mutation flows and Vim mode were not repeated in this bounded visual-polish
pass.

## Phase 3 fixture discipline

`test-vault-content/Phase 3/` is source-controlled QA content. It contains original geometric
SVG/PNG/GIF/audio/video/PDF diagnostics, interaction notes, Bases data, Canvas fixtures, a small
Graph network, and long/deep mixed-language paths. It must not be imported by `src/index.css`,
copied to release assets, or used as promotional art. `.analysis/phase-3-review/` contains ignored
screenshots only. Phase 4 evidence follows the same rule under ignored `.analysis/phase-4-review/`.

After mutation tests, restore fixture Markdown/Canvas data with the application Undo command or a
narrow source edit, confirm the active editor is not dirty, and leave Vim mode off. Never use a
destructive cleanup command for test artifacts without user approval.

## Manual test record

For every claimed test, record:

- Date
- Operating system
- Obsidian version
- Installer version
- Theme version or commit
- Light or dark mode
- Vim mode on or off
- Plugins relevant to the test
- Steps
- Expected result
- Actual result
- Screenshot or screen recording, where useful

Do not mark a platform as supported merely because the CSS builds.

## Core smoke test

- Launch Obsidian with the theme.
- Open a plain note.
- Switch between light and dark modes.
- Open left and right sidebars.
- Open command palette, quick switcher, settings, and a modal.
- Open a pop-out window.
- Resize to a narrow width.
- Confirm visible keyboard focus.
- Confirm no console errors caused by theme assets.

## Editor modes

Test:

- Live Preview
- Source mode
- Reading view
- Mixed Chinese/Japanese/English
- Long headings
- Lists and nested lists
- Task lists
- Blockquotes
- Callouts
- Tables
- Code blocks
- Inline code
- Math
- Mermaid
- Footnotes
- Properties
- Internal embeds
- PDF embeds

## Live Preview image regression matrix

Test each relevant image state:

- Plain internal image
- External image
- Width-specified image
- Transparent PNG
- SVG
- GIF
- Image in a list
- Image in a nested list
- Image in a quote
- Image in a callout
- Image in a table
- Image in an embedded note
- Image in a pop-out window

Verify:

- Mouse selection
- Keyboard selection
- Selection by moving from adjacent text
- Copy
- Cut
- Delete
- Grow
- Shrink
- Reset
- Enter editing and return to navigation
- Tab sizing/editing flow and focus order
- Space lightbox from a keyboard-selected image
- Pointer/click lightbox where offered by the current build
- Zoom-button visibility, focus, activation, and lightbox opening
- Resize handle
- Resize within a table
- Indented-line and nested-list behavior
- Non-image embed action behavior
- Lightbox filename, previous/next navigation, pan, and dismissal
- Selected outline does not shift layout
- Action buttons remain clickable
- Action buttons do not flash and disappear
- Action buttons are not clipped
- Image does not disappear while editing an embed
- Resize does not animate width or height
- Touch targets remain usable
- Mobile double-tap zoom and swipe-down lightbox dismissal

## Vim mode

Verify:

- Image selection is visible.
- Vim cursor/active-line styling does not hide image selection.
- Image commands still work.
- Counted image commands still work.
- Space opens lightbox.
- Focus remains visible when moving between text and images.

## Settings and controls

Test:

- Settings as a window and embedded modal, where available
- Sidebar navigation
- Search
- Toggle
- Slider
- Reset button
- Color control
- Dropdown
- Text input
- Textarea
- Hotkey editor
- Validation error
- Disabled control
- Community theme/plugin cards
- Health/Review score display
- Install, enable, and update buttons
- Destructive confirmation dialogs

## Views

Test:

- File explorer
- Search
- Bookmarks
- Outline
- Backlinks
- Tags
- Bases table
- Bases cards
- Canvas
- Graph
- Sync
- File recovery
- Empty/loading/error states

## Platform matrix

Minimum release candidates should cover:

| Platform   |    Light |     Dark |                          Keyboard |    Touch |  Pop-out |
| ---------- | -------: | -------: | --------------------------------: | -------: | -------: |
| macOS      | required | required |                          required |      n/a | required |
| Windows    | required | required |                          required | optional | required |
| Linux      | required | required |                          required |      n/a | required |
| iOS/iPadOS | required | required | external keyboard where available | required |      n/a |
| Android    | required | required | external keyboard where available | required |      n/a |

Use “untested” when evidence is unavailable.

## Regression discipline

When fixing a bug:

1. Record the failing state and reproduction.
2. Identify whether the cause is an Obsidian variable, stable class, or internal DOM selector.
3. Apply the narrowest fix.
4. Re-test adjacent states.
5. Update `docs/obsidian-dom.md` if an internal selector is involved.
6. Run `npm run check`.
