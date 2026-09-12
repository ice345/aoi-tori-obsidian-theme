# Phase 3 desktop test matrix

Status: actual-client pass recorded on 2026-08-02. “Passed” means the stated action was exercised in
this environment; it is not a cross-platform support claim. “Partial” names the exact remaining path
instead of assuming compatibility.

## Environment

| Item               | Value                                                                  |
| ------------------ | ---------------------------------------------------------------------- |
| Obsidian           | Desktop `1.13.4`                                                       |
| Installer          | `1.13.4`                                                               |
| Runtime            | Electron `43.1.1`, Chrome `150.0.7871.114`, Node `24.18.0`             |
| Operating system   | macOS 26.5 (25F71), Apple silicon (`arm64`)                            |
| Test vault         | `test-vault-content`                                                   |
| Theme installation | Local symlink at `.obsidian/themes/Aoi Tori`                           |
| Theme revision     | Phase 2.5 commit `fe70a54` plus uncommitted Phase 3 working tree       |
| Theme version      | `0.1.0`                                                                |
| Community plugins  | None; Restricted mode remained on                                      |
| Modes/layouts      | Light/dark, Vim off/on, main/pop-out, 760×820 narrow, split/multi-pane |
| Inspection         | Real client, actual input, rendered DOM/computed style, screenshots    |

## Live Preview image matrix

| Area / action                                    | Result  | Actual evidence / limitation                                                                  |
| ------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------- |
| Internal, external, no-alt, width, large/small   | Passed  | Original local fixtures plus one explicit remote diagnostic rendered without a global rule    |
| Transparent PNG, SVG, GIF, inline and standalone | Passed  | Transparency/playback/layout retained; block action surface remained separate from inline     |
| Paragraph, ordered/unordered/task/nested list    | Passed  | Real rendered contexts preserved indentation, selection, and actions                          |
| Quote, Callout/nested Callout, embedded note     | Passed  | No clipping or body-surface break; nested image actions and outline remained visible          |
| Markdown table                                   | Passed  | Native handle/actions passed in automation; user manually confirmed Table image Resize normal |
| Pop-out, narrow and multi-column                 | Passed  | Image pointer state and variables matched main window; 760 px layout had no horizontal spill  |
| Pointer hover/select/deselect                    | Passed  | `is-selected`/`mod-image-selected`; 1 px outer + native inner cue; no layout shift            |
| Keyboard select from adjacent text               | Passed  | Arrow navigation reached the image and exposed the selected/action states                     |
| Copy, cut, Delete and Backspace                  | Passed  | Clipboard or deletion verified; each mutation immediately restored with Undo                  |
| `+`, `-`, `0`                                    | Passed  | Width added, shrunk, and reset in Markdown                                                    |
| Enter and Tab editing flows                      | Passed  | Enter exposed embed markup; Tab selected/manual-positioned the width segment                  |
| Space and Zoom button Lightbox                   | Passed  | Both paths opened the native Lightbox; filename shown; Escape/close dismissed it              |
| Drag resize, persist, continue editing, reset    | Passed  | Standalone width persisted; no width/height animation; reset restored fixture                 |
| Action visibility, hover, pointer and overflow   | Passed  | Zoom/Edit stayed visible/clickable, `pointer-events:auto`, no clipping or z-index override    |
| Selected/hover/focus separation and image switch | Passed  | States remained distinguishable; selecting another element cleared the image selection        |
| Multi-image previous/next and Lightbox pan       | Partial | Lightbox itself passed; this fixture exposed a single-item modal and no separate nav controls |

## Vim mode

| Action                                       | Result | Actual evidence                                                         |
| -------------------------------------------- | ------ | ----------------------------------------------------------------------- |
| Text-to-image movement and visible selection | Passed | Real `j` then `l` produced both selected classes and visible outline    |
| `:image grow`, shrink and reset              | Passed | Commands changed and restored Markdown width                            |
| Counted `:5image grow`                       | Passed | Counted command executed, followed by reset                             |
| Copy, cut and delete                         | Passed | Each real action executed and was undone                                |
| Space Lightbox and Escape                    | Passed | CDP `Space` opened the native modal; Cancel/Escape closed it            |
| Vim cursor/active line overlap               | Passed | Selected outline/actions stayed visible over the current-line treatment |

Vim was saved as off and the app reloaded after the test, leaving the normal default restored.

## Non-image embeds

| Surface                  | Result  | Actual evidence / limitation                                                    |
| ------------------------ | ------- | ------------------------------------------------------------------------------- |
| Markdown/PDF/audio/video | Passed  | Loaded roots, native media controls, PDF toolbar/sidebar and Edit action        |
| Canvas/Bases embeds      | Passed  | Both interactive embeds loaded; Bases Edit action remained clickable            |
| External webpage/iframe  | Passed  | Frame rendered; no theme fixed height, pointer block, or clipping               |
| Missing attachment       | Passed  | Native missing-file error remained readable                                     |
| Collapse/expand          | Partial | No dedicated collapsible state was offered for every embed type in this fixture |
| Pop-out                  | Passed  | Note pop-out inherited the same semantic surfaces and embed behavior            |

## Settings and controls

| Surface / state                               | Result   | Actual evidence / limitation                                                         |
| --------------------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| Separate Settings window, sidebar and search  | Passed   | Real `is-popout-window is-popout-modal`; grouped search results rendered             |
| Button/input/search/dropdown/toggle           | Passed   | Light and dark Appearance panes plus keyboard focus                                  |
| Slider/value/reset and color/reset            | Passed   | Native value and reset controls present and readable                                 |
| Hotkey editor                                 | Passed   | 196 hotkey rows plus search/add/delete controls                                      |
| Disabled control                              | Passed   | Disabled Restore default remained visually identifiable                              |
| Theme cards/count/version/install             | Passed   | Community browser rendered 452 cards; selected detail exposed count/version/action   |
| Plugin cards/enable/update                    | Untested | Restricted mode deliberately remained on                                             |
| Health/Review scorecard                       | Untested | Current 1.13.4 Community Themes detail did not present this block                    |
| Validation error/textarea/destructive confirm | Untested | Stock configuration did not expose these states; no destructive operation was forced |

## Bases

| Surface / state                                     | Result  | Actual evidence / limitation                                                     |
| --------------------------------------------------- | ------- | -------------------------------------------------------------------------------- |
| Table and grouped Cards                             | Passed  | Three rows, image covers, groups for sky/night/second voice                      |
| Text/status/number/checkbox/date/tag/link/long text | Passed  | Actual fields rendered; long values wrapped without theme overflow               |
| Sort/filter/group/search                            | Passed  | Real toolbar/menu controls; no-match search produced `0` results                 |
| Cell edit, hover, active/focus and context menu     | Passed  | Active cell and right-click file menu exercised                                  |
| Empty and error                                     | Passed  | Empty query state and controller `.bases-error` exercised, then restored         |
| Loading                                             | Partial | 1.13.4 controller `startLoader()` is a no-op, so no loading visual was available |
| Pop-out and narrow density                          | Passed  | Dark pop-out inherited tokens; narrow main view remained usable                  |

## Canvas and Graph

| Surface                                            | Result   | Actual evidence / limitation                                                 |
| -------------------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| Empty, mixed six-node and large 20-node Canvas     | Passed   | Text/file/image/group/edges/labels and multi-image data rendered             |
| Select/multi-select/hover/edit/resize/context menu | Passed   | Native states exercised; resize 360×210→420×280; Undo restored data          |
| Zoom/fit/reset/undo/redo/help controls             | Passed   | Actual native controls remained visible and clickable                        |
| Canvas minimap                                     | Untested | Current 1.13.4 UI exposed no minimap                                         |
| Canvas light/dark and pop-out                      | Passed   | Official tokens inherited; images stayed unfiltered/unclipped                |
| Global Graph                                       | Passed   | 23 nodes/43 links plus Filters, Groups, Display, Forces                      |
| Local Graph                                        | Passed   | 7 nodes/10 links in a split                                                  |
| Graph semantic node roles and light/dark           | Passed   | Official ordinary/current/unresolved/tag/attachment/edge variables inspected |
| Graph hover/selected/search-highlight              | Partial  | No separate inspectable DOM state surfaced through automation                |

## Core views, windows, and layout

| Area                                                         | Result   | Actual evidence / limitation                                              |
| ------------------------------------------------------------ | -------- | ------------------------------------------------------------------------- |
| Explorer/Search/Bookmarks/Outline/Backlinks/Outgoing/Tags    | Passed   | Real leaves opened; Search `Phase` produced 9 files/17 matches            |
| File Properties/Recovery/Sync                                | Passed   | Sidebar or Settings surfaces opened and remained readable                 |
| Command palette/Quick switcher/context menu/Notice           | Passed   | Keyboard selection, long mixed-language path, and actual menus exercised  |
| Tooltip                                                      | Partial  | Phase 2 runtime passed; Phase 3 hover automation did not expose one again |
| Status bar/Ribbon/tabs/overflow                              | Passed   | Visible in main/narrow/multi-pane layouts                                 |
| Note/Canvas/Bases/Graph/Settings pop-outs                    | Passed   | Simultaneous 1024×800 dark pop-outs inherited background/text/accent      |
| Fullscreen/maximized, dual/triple pane, both sidebars        | Passed   | Real window state transitions and multi-column layout exercised           |
| Narrow 760×820                                               | Passed   | `scrollWidth === clientWidth`; no horizontal overflow                     |
| Ultrawide, Windows/Linux chrome, forced-colors, mobile/touch | Untested | No matching hardware/runtime was used                                     |

## Local review screenshots

All paths are ignored local QA evidence, never release or promotional assets.

| #   | Screenshot               | Path                                                            |
| --- | ------------------------ | --------------------------------------------------------------- |
| 1   | Normal keyboard selected | `.analysis/phase-3-review/01-image-keyboard-selected-final.png` |
| 2   | Vim selected             | `.analysis/phase-3-review/02-vim-image-selected-final6.png`     |
| 3   | Image resize             | `.analysis/phase-3-review/03-image-resize.png`                  |
| 4   | Nested Callout image     | `.analysis/phase-3-review/04-nested-callout-image-final.png`    |
| 5   | Non-image embeds         | `.analysis/phase-3-review/05-non-image-embeds-final4.png`       |
| 6   | Settings controls        | `.analysis/phase-3-review/06-settings-controls-verified2.png`   |
| 7   | Bases Table              | `.analysis/phase-3-review/07-bases-table-final4.png`            |
| 8   | Bases Cards              | `.analysis/phase-3-review/08-bases-cards-final4.png`            |
| 9   | Canvas                   | `.analysis/phase-3-review/09-canvas-final7.png`                 |
| 10  | Global Graph             | `.analysis/phase-3-review/10-graph-final4.png`                  |
| 11  | Note pop-out             | `.analysis/phase-3-review/11-popout-note-final.png`             |
| 12  | Dark core views          | `.analysis/phase-3-review/12-dark-core-final4.png`              |
| 13  | Narrow layout diagnostic | `.analysis/phase-3-review/13-narrow-layout-final.png`           |

Additional diagnostics remain in the same ignored directory. They are not part of the reviewed set,
and the build/release audit rejects references to that directory.

## Phase 3 user review confirmation

The user supplied the following manual review results after the automated Phase 3 pass. They apply
to the same Phase 3 review build and do not broaden platform coverage:

| Review item                     | Result | Evidence boundary                                               |
| ------------------------------- | ------ | --------------------------------------------------------------- |
| Table image Resize              | Passed | User reported the real manual interaction normal                |
| Bases Cards                     | Passed | User reported the visual/interaction review normal              |
| Light Graph                     | Passed | User reported the light presentation normal                     |
| Canvas group and node hierarchy | Passed | User reported the hierarchy normal                              |
| Narrow pop-out                  | Passed | User reported the narrow pop-out normal                         |
| Toggle thumb                    | Fixed  | User screenshot exposed offset; Phase 3.5 repair measured below |

# Phase 4 mobile and accessibility matrix

Status: responsive/client-emulation pass recorded on 2026-08-03. “Emulated pass” means the actual
Obsidian 1.13.4 desktop renderer and DOM were exercised under its official mobile mode or a
controlled phone-class viewport. It does not mean a physical mobile platform passed.

## Phase 4 environment

| Item                    | Value                                                               |
| ----------------------- | ------------------------------------------------------------------- |
| Obsidian / Installer    | `1.13.4` / `1.13.4`                                                 |
| Runtime                 | Electron `43.1.1`, Chrome `150.0.7871.114`, Node `24.18.0`          |
| Host                    | macOS 26.5 (25F71), Apple silicon, Retina DPR 2                     |
| Mobile environment      | Official desktop mobile emulator; controlled `is-phone` where noted |
| Viewports               | 820×900 tablet; 390×844 phone; 320×700 narrow; 844×390 landscape    |
| Theme revision          | Phase 2.5 `fe70a54` plus uncommitted Phase 3–4 working tree         |
| Style Settings          | `1.0.9`, installed only in the ignored local test Vault             |
| Real mobile devices     | None                                                                |
| Accessibility emulation | Chromium DevTools `prefers-*` and `forced-colors` media features    |

## Phase 3.5 Toggle regression

| State/context                     | Result  | Measurement / evidence                                              |
| --------------------------------- | ------- | ------------------------------------------------------------------- |
| Settings light/dark, off/on       | Passed  | 44×20 track, 26×16 thumb, 2 px top / 2 px bottom                    |
| Core/Graph compact Toggle         | Passed  | 36×16 track, 20×12 thumb, 2 px top / 2 px bottom                    |
| Phone-class Settings Toggle       | Passed  | 52×30 track, 26×26 thumb, 2 px top / 2 px bottom                    |
| Hover                             | Passed  | Geometry unchanged                                                  |
| Active                            | Passed  | Native 34×24 pressed thumb extends 2 px / 2 px                      |
| Focus-visible                     | Passed  | 2 px ring plus 2 px offset, no clipping                             |
| Disabled                          | Partial | Controlled current-DOM fixture passed; no organic disabled Toggle   |
| Embedded/separate Settings        | Passed  | Same symmetric geometry                                             |
| UI zoom 90% / 100% / 110%, Retina | Passed  | CSS gaps symmetric; raster difference at most 0.006 CSS px          |
| Third-party plugin Settings       | Partial | Style Settings loaded later; no dedicated plugin Toggle was exposed |

## Mobile layout and core surfaces

| Surface / state                             | Result        | Actual evidence / limitation                                                    |
| ------------------------------------------- | ------------- | ------------------------------------------------------------------------------- |
| Light/dark editor and Reading view          | Emulated pass | No page overflow at phone/tablet sizes; mixed-language content remains readable |
| Portrait/narrow/landscape/tablet            | Emulated pass | Document scroll/client widths equal; native navbar kept a 32 px emulator inset  |
| File Explorer and Search drawers            | Emulated pass | Drawer/search operable; file/folder rows and search targets at least 44 px      |
| Tabs, bottom nav and mobile toolbar         | Emulated pass | Visible actions at least 44 px; no hover-only required action                   |
| Command palette and Quick switcher          | Emulated pass | Bottom sheet 390×729; 52 px input; viewport-contained                           |
| Settings, modal, menu and Toggle            | Emulated pass | Phone Settings 390×844; controls usable; Toggle symmetric                       |
| Properties and Callouts                     | Emulated pass | 358 px content surface, usable inputs, continuous semantic surfaces             |
| Markdown table                              | Emulated pass | Component scroll 422 px / 342 px client; document stays 390 px                  |
| Bases Table/Cards                           | Emulated pass | Table scroll remains in `.bases-view`; Cards fit 366 px container               |
| Canvas and Graph                            | Emulated pass | No page overflow; visible control targets raised from 40/28 px to 44 px         |
| Virtual keyboard / actual external keyboard | Untested      | No mobile OS keyboard/hardware available                                        |
| Physical safe areas / font scaling          | Untested      | Emulator inset observed; no iOS/Android hardware or OS font-scaling environment |

## Mobile image and Lightbox

| Action/state                            | Result        | Actual evidence / limitation                                           |
| --------------------------------------- | ------------- | ---------------------------------------------------------------------- |
| Pointer selection and visible outline   | Emulated pass | Real pointer selection; 317.34 px image; outline does not shift layout |
| Image action button                     | Emulated pass | 44×44, visible, `pointer-events:auto`, not clipped                     |
| Space/Zoom Lightbox                     | Emulated pass | Native 390×844 modal, 44×44 close, responsive media                    |
| Nested/list/Callout/table image sizing  | Emulated pass | Max inline size and auto height prevent page overflow                  |
| Long press, swipe-down, drag/pan, pinch | Untested      | Desktop renderer cannot supply trustworthy mobile gestures             |
| Double-tap and previous/next            | Untested      | No physical touch; single-image fixture exposed no navigation controls |
| Virtual keyboard plus selected image    | Untested      | No mobile virtual keyboard environment                                 |

## Style Settings and accessibility

| Area / state                              | Result        | Actual evidence / limitation                                                        |
| ----------------------------------------- | ------------- | ----------------------------------------------------------------------------------- |
| Metadata and six groups                   | Passed        | Style Settings 1.0.9 parsed 48 entries; plugin error list empty                     |
| Defaults                                  | Passed        | Default classes reproduce the reviewed theme; overrides reset to `{}`               |
| Bounded palette/typography/layout options | Passed        | Representative choices applied; no arbitrary essential-color input                  |
| High contrast / stronger focus/borders    | Passed        | Manual options measured 3 px focus and stronger semantic muted/border steps         |
| Reduced motion / gradients disabled       | Passed        | Plugin classes remove theme motion/decorative gradients                             |
| `prefers-reduced-motion: reduce`          | Emulated pass | Computed transition `none`, duration `0s`                                           |
| `prefers-contrast: more`                  | Emulated pass | Computed focus width 3 px; stronger muted text/border mapping                       |
| `forced-colors: active`                   | Emulated pass | System link/underline, Toggle distinction, button borders, viewport-contained modal |
| Windows High Contrast                     | Untested      | Static rules and Chromium emulation pass; real Windows review required              |
| Keyboard order / focus-visible            | Passed        | CSS does not reorder; desktop traversal and phone-class focus cues remain visible   |
| Screen-reader reading order               | Static review | No CSS reordering/hiding; assistive-technology session still required               |

## Phase 4 local screenshots

All files are ignored local QA evidence and are not release/promotional assets.

| Screenshot                            | Path                                                                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Toggle before                         | `.analysis/phase-4-review/toggle-before.png`                                                                   |
| Toggle after, light/dark              | `.analysis/phase-4-review/toggle-after-light.png`; `toggle-after-dark.png`                                     |
| Toggle keyboard focus                 | `.analysis/phase-4-review/toggle-focus.png`                                                                    |
| Mobile light/dark editor              | `.analysis/phase-4-review/mobile-light-editor.png`; `mobile-dark-editor.png`                                   |
| Mobile Settings / Toggle              | `.analysis/phase-4-review/mobile-settings-dark.png`; `mobile-toggle-dark.png`                                  |
| Mobile selected image / Lightbox      | `.analysis/phase-4-review/mobile-image-selected-light.png`; `mobile-lightbox-light.png`                        |
| Tablet / narrow / landscape           | `.analysis/phase-4-review/tablet-wide-layout-light.png`; `narrow-view-light.png`; `mobile-landscape-light.png` |
| Style Settings                        | `.analysis/phase-4-review/style-settings-tablet.png`                                                           |
| High contrast                         | `.analysis/phase-4-review/high-contrast-light.png`                                                             |
| Reduced motion and gradients disabled | `.analysis/phase-4-review/reduced-motion-gradients-disabled-light.png`                                         |

# Release-candidate Markdown semantic polish

Status: implemented and reviewed locally on 2026-08-03. Screenshot evidence is ignored local QA
evidence only.

## Semantic polish environment

| Item                 | Value                                                                 |
| -------------------- | --------------------------------------------------------------------- |
| Obsidian target      | Desktop `1.13.4`                                                      |
| Installer target     | `1.13.4`                                                              |
| Host                 | macOS 26.5 Apple silicon                                              |
| Theme revision       | Uncommitted Release Candidate working tree                            |
| Test note            | `test-vault-content/Aoi-Tori-Markdown-Semantics.md`                   |
| Screenshot directory | `.analysis/semantic-polish/`                                          |
| Scope                | Destructive buttons and high-frequency Markdown semantics; no plugins |

## Semantic polish matrix

| Surface / state                                       | Result  | Evidence / limitation                                                                                    |
| ----------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| Destructive `mod-warning` secondary button            | Pass    | Uses soft error background, deep error text, error border, and cobalt focus via semantic variables       |
| Destructive `mod-destructive.mod-cta` primary button  | Pass    | Overrides Obsidian's white `--text-color` conflict with solid error surface and warm/night readable text |
| Disabled destructive button                           | Pass    | Disabled rule resets both `--text-color` and visible color to faint text and disabled surface            |
| Bold / italic / bold italic                           | Pass    | Official bold/italic variables plus scoped CodeMirror rules align Reading, Live Preview, and Source      |
| Strikethrough and completed tasks                     | Pass    | Muted text plus sakura/gray-violet line; no error red or green whole-line treatment                      |
| Highlight                                             | Pass    | Warm-yellow or night-warning soft surface with normal readable text                                      |
| Tags                                                  | Pass    | Official `--tag-*` variables map cloud/night panels, cobalt text, border, hover, and focus               |
| Footnotes, `<kbd>`, and horizontal rule               | Pass    | Markdown-scoped rules use second-voice footnotes, form-like keys, and a one-pixel watercolor rule        |
| Source, Live Preview, and Reading consistency         | Pass    | Actual Obsidian screenshots captured; Source formatting tokens remain visible and subdued                |
| UI zoom 90% / 100% / 110%, narrow, and pop-out states | Partial | Smoke passed; copy/cut/paste mutation flows and Vim mode remain manual RC checks                         |

## Semantic polish screenshots

All paths are ignored local QA evidence and are not release/promotional assets.

| Screenshot                            | Path                                                                  |
| ------------------------------------- | --------------------------------------------------------------------- |
| Destructive button before             | `.analysis/semantic-polish/destructive-button-before.png`             |
| Destructive button light              | `.analysis/semantic-polish/destructive-button-light.png`              |
| Destructive button dark               | `.analysis/semantic-polish/destructive-button-dark.png`               |
| Destructive button focus              | `.analysis/semantic-polish/destructive-button-focus.png`              |
| Markdown semantics light reading      | `.analysis/semantic-polish/markdown-semantics-light-reading.png`      |
| Markdown semantics light Live Preview | `.analysis/semantic-polish/markdown-semantics-light-live-preview.png` |
| Markdown semantics dark reading       | `.analysis/semantic-polish/markdown-semantics-dark-reading.png`       |
| Markdown semantics dark Live Preview  | `.analysis/semantic-polish/markdown-semantics-dark-live-preview.png`  |
| Markdown semantics light Source       | `.analysis/semantic-polish/markdown-semantics-light-source.png`       |
| Markdown semantics dark Source        | `.analysis/semantic-polish/markdown-semantics-dark-source.png`        |
| Tags and tasks light                  | `.analysis/semantic-polish/tags-and-tasks-light.png`                  |
| Tags and tasks dark                   | `.analysis/semantic-polish/tags-and-tasks-dark.png`                   |
| Footnotes, KBD, and HR light          | `.analysis/semantic-polish/footnotes-kbd-hr-light.png`                |
| Footnotes, KBD, and HR dark           | `.analysis/semantic-polish/footnotes-kbd-hr-dark.png`                 |
