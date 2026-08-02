# Phase 2 test matrix

Status: local review pass recorded on 2026-08-02. “Passed” means the stated behavior was exercised
in the environment below; it is not a cross-platform support claim.

## Environment

| Item               | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| Obsidian           | Desktop 1.13.4                                                       |
| Installer          | 1.13.4, confirmed in Settings and the application bundle             |
| Operating system   | macOS 26.5 (25F71), Apple silicon (`arm64`)                          |
| Test vault         | `test-vault-content`                                                 |
| Theme installation | Local symlink at `.obsidian/themes/Aoi Tori`                         |
| Theme revision     | Unborn `master` branch; no commit exists                             |
| Theme version      | 0.1.0                                                                |
| Community plugins  | None                                                                 |
| Vim                | Off                                                                  |
| Light / dark       | Both                                                                 |
| Inspection         | Real Electron client, rendered DOM inspection, and local screenshots |

## Core preview slice

| Area                                     | Light | Dark | Result   | Evidence / limitation                                                      |
| ---------------------------------------- | ----- | ---- | -------- | -------------------------------------------------------------------------- |
| Theme load and semantic variables        | Yes   | Yes  | Passed   | Computed primary/text/accent variables matched the Phase 2 palette         |
| Main editor, left sidebar, ribbon, tabs  | Yes   | Yes  | Passed   | Full-workspace screenshots; current file and current tab remained distinct |
| Status bar                               | Yes   | Yes  | Passed   | Visible, readable, and consistent with the workspace surface hierarchy     |
| Live Preview                             | Yes   | Yes  | Passed   | Mixed-language note rendered with properties, headings, and image embed    |
| Source mode                              | Yes   | —    | Passed   | `editor:toggle-source` removed and restored the `is-live-preview` state    |
| Reading view                             | Yes   | —    | Passed   | `markdown:toggle-preview` rendered headings, links, lists, and tasks       |
| H1–H6 and mixed Chinese/Japanese/English | Yes   | Yes  | Passed   | Visually inspected in the real note                                        |
| Links and unresolved links               | Yes   | —    | Passed   | Blue links and dusty-pink wavy unresolved links remained distinguishable   |
| Lists and tasks                          | Yes   | —    | Passed   | Reading-view screenshot includes ordered/unordered/task content            |
| Quote, code, callout, table, math        | Yes   | —    | Partial  | Present in the test note; not every state received a dedicated screenshot  |
| Properties                               | Yes   | Yes  | Passed   | Rendered labels, tags, inputs, date, checkbox, and number fields           |
| Menu, modal, tooltip, notice             | —     | —    | Untested | CSS slice is implemented; dedicated runtime interactions remain for review |

## Controls and windows

| Interaction                     | Result   | Evidence / limitation                                                |
| ------------------------------- | -------- | -------------------------------------------------------------------- |
| Settings pop-out window         | Passed   | Native 1.13.4 Settings window loaded Aoi Tori in dark mode           |
| Button, input, dropdown, toggle | Passed   | Settings exposed 8 buttons, 5 inputs, a dropdown, and 4 toggles      |
| Generic keyboard focus          | Passed   | Real Tab navigation focused Navigate back with a 2 px cobalt outline |
| Disabled and destructive state  | Partial  | Semantic mappings exist; destructive confirmation was not opened     |
| Document pop-out                | Untested | Only the Settings pop-out was exercised                              |
| Narrow desktop layout           | Untested | No narrow-window screenshot in this phase                            |

## Live Preview image interactions

| State / action                       | Result   | Evidence / limitation                                                          |
| ------------------------------------ | -------- | ------------------------------------------------------------------------------ |
| Default image                        | Passed   | Original local SVG rendered at the requested width without a global `img` rule |
| Pointer hover                        | Passed   | Quiet powder-blue outline did not change layout                                |
| Pointer selection                    | Passed   | `is-selected` appeared; cobalt outline was visually distinct                   |
| Layout stability on selection        | Passed   | Bounding box was identical before and after selection                          |
| Action surface and icons             | Passed   | Zoom/Edit buttons visible, readable, and `pointer-events: auto`                |
| Action hover                         | Passed   | Zoom icon and background changed independently of selected outline             |
| Zoom/lightbox                        | Passed   | Zoom opened the native lightbox; Escape dismissed it                           |
| Resize handle visibility             | Passed   | Native resize corner remained visible                                          |
| Drag resizing / reset / table size   | Untested | No note mutation was performed                                                 |
| Keyboard image selection             | Untested | General focus was tested, but image keyboard traversal was not completed       |
| Copy, cut, delete, Enter, Tab        | Untested | Native behavior was preserved; no support claim                                |
| Vim image commands                   | Untested | Vim was off                                                                    |
| Nested contexts and non-image embeds | Untested | Lists, callouts, quotes, tables, and embed variants remain for later phases    |
| Mobile/touch/lightbox gestures       | Untested | No mobile device or simulator was used                                         |

## Deferred product surfaces

Bases, Canvas, Graph, full file explorer/search/outline/backlinks/tags coverage, mobile/touch,
third-party plugins, forced-colors, and cross-platform Windows/Linux/iOS/Android tests are outside
this minimum slice and remain untested.

## Local review screenshots

These files are ignored local evidence and are not promotional or release assets.

| #   | Screenshot                     | Path                                                  |
| --- | ------------------------------ | ----------------------------------------------------- |
| 1   | Light full workspace           | `.analysis/review/01-light-workspace.png`             |
| 2   | Light editor / reading content | `.analysis/review/02-light-editor-reading.png`        |
| 3   | Dark full workspace            | `.analysis/review/03-dark-workspace.png`              |
| 4   | Settings window                | `.analysis/review/04-settings-window.png`             |
| 5   | Live Preview image selected    | `.analysis/review/05-live-preview-image-selected.png` |
| 6   | Image action buttons           | `.analysis/review/06-image-action-buttons.png`        |
| 7   | Keyboard `focus-visible`       | `.analysis/review/07-keyboard-focus-visible.png`      |

Additional diagnostics (`image-location-before-select.png` and `lightbox-diagnostic.png`) remain
under the same ignored local directory.
