# Obsidian DOM findings

Status: Phase 3 desktop and Phase 3.5 Toggle baselines were inspected in the real Obsidian 1.13.4
client on 2026-08-02. Phase 4 mobile-responsive, Style Settings, and accessibility inspection
continued in the same installed client on 2026-08-03. Physical mobile devices remain untested.

## Environment

| Item              | Phase 3 finding                                                                     |
| ----------------- | ----------------------------------------------------------------------------------- |
| Obsidian          | Desktop `1.13.4`                                                                    |
| Installer         | `1.13.4`                                                                            |
| Runtime           | Electron `43.1.1`, Chrome `150.0.7871.114`, Node `24.18.0`                          |
| Platform          | macOS 26.5 (25F71), Apple silicon (`arm64`)                                         |
| Theme revision    | Phase 2.5 checkpoint `fe70a54`; Phase 3 is intentionally uncommitted                |
| Vault             | `test-vault-content`; Restricted mode on; no community plugins                      |
| Modes             | Light/dark, Vim off/on, main/pop-out, narrow and multi-column layouts               |
| Inspection method | Rendered DOM, computed style, native input, Electron DevTools protocol, screenshots |
| Date              | 2026-08-02 (Asia/Shanghai)                                                          |

The official changelog is the behavioral baseline, not a DOM contract. The installed application
matches the Phase 3 minimum regression target, so no version-conditional selector was needed.

## Live Preview image structure and state

An internal image still renders with the stable hierarchy already adopted in Phase 2:

```html
<div class="internal-embed media-embed image-embed is-loaded" tabindex="-1">
  <div class="image-wrapper">
    <img />
    <div class="image-resize-corner"></div>
  </div>
  <div class="embed-actions">
    <div class="embed-action" aria-label="Zoom in">…</div>
    <div class="embed-action edit-block-button" aria-label="Edit this block">…</div>
  </div>
</div>
```

Pointer, normal-keyboard, and Vim selection all add `is-selected` to `.image-embed` and
`mod-image-selected` to `.markdown-source-view`. During drag resize the image root temporarily adds
`is-resizing`; the native handle persists the resulting width into Markdown. The table editor first
selects a `.table-editor` cell; editing the cell exposes the same `.image-embed`, actions, and
native resize handle inside the cell.

Observed content containers include `HyperMD-list-line`, `HyperMD-quote`, Callout block structure,
the table editor, embedded notes, pop-outs, and split panes. These classes are evidence for tests,
not new theme selectors. Inline images add the native `no-hover-actions` behavior; Aoi Tori does not
set `pointer-events` on images or actions.

### Approved internal selectors

| Selector                       | Actual reason and scope                                             | Official-variable investigation                         | Risk / fallback                                                           | Regression case                                     |
| ------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| `.image-embed`                 | Image-only radius, hover, focus, and transition surface             | `--image-radius` covers value, not state geometry       | Low; native layout remains when the rule does not match                   | Internal/external, inline/block, nested and pop-out |
| `.image-embed.is-selected`     | Non-layout-changing outer selection cue                             | No official variable selects the root state             | Medium; native inset cue remains if the class changes                     | Pointer, keyboard and Vim selected states           |
| `.image-embed .embed-action`   | Preserve icon color, hover and focus within confirmed image actions | Embed action variables cover colors but not every state | Medium; native action remains visible and clickable                       | Zoom/Edit pointer, hover, focus and lightbox        |
| `.image-embed .clickable-icon` | Focus-visible fallback for the current action implementation        | No narrower documented variable for this focus geometry | Medium; native clickable-icon focus remains if selector no longer matches | Keyboard action focus; light/dark and pop-out       |

No selector targets `img` globally, `.image-resize-corner`, Lightbox internals, table internals, or
nested content. The selected outline is 1 px with a 2 px offset and retains the native inner cue;
selection causes no layout movement. Width and height are never animated, action pointer events stay
`auto`, roots remain unclipped, and Aoi Tori introduces no z-index override.

## Non-image embed evidence

| Embed              | Observed root/state                                                   | Theme dependency                                       |
| ------------------ | --------------------------------------------------------------------- | ------------------------------------------------------ |
| Markdown note      | `.internal-embed.markdown-embed.inline-embed.is-loaded`               | Official embed variables; no dedicated selector        |
| PDF                | `.internal-embed.pdf-embed.is-loaded` plus native PDF toolbar/sidebar | Official PDF and embed variables                       |
| Audio / video      | `.media-embed.audio-embed` / `.media-embed.video-embed` with controls | Native media controls preserved                        |
| Canvas             | `.canvas-embed.inline-embed.is-loaded`                                | Official Canvas and embed variables                    |
| Bases              | `.bases-embed.interactive-child.is-loaded` with Edit action           | Official Bases and embed variables                     |
| External webpage   | Native iframe embed                                                   | No fixed height, overflow, pointer, or resize override |
| Missing attachment | `.file-embed.mod-empty-attachment`                                    | Native error surface and error semantics preserved     |

The PDF, Bases, and Markdown actions remained clickable. No non-image embed is routed through the
image selector and no fixed embed height was introduced.

## Settings evidence

Settings opens as a separate `is-popout-window is-popout-modal` window in this client. Actual DOM
included setting-item groups, buttons, text/search inputs, dropdowns, toggles, range sliders with
visible values, color inputs and reset controls, hotkey rows, and searchable result groups
(`.setting-search-result-group`, `.setting-search-result-tab`, `.setting-search-result-item`). The
Community Themes browser rendered `.community-item` cards, download count, version, and Install and
use action.

Restricted mode was intentionally retained, so third-party plugin cards and enable/update flows were
unavailable. The current Community Themes detail did not expose a Health/Review scorecard block.
Stock Settings also did not expose a validation-error textarea in this test configuration; these
states remain untested rather than inferred.

### Phase 3.5 Toggle geometry evidence

Target: Obsidian and Installer 1.13.4, Electron 43.1.1, macOS 26.5 arm64, Retina DPR 2 at 100% UI
zoom. The stable Toggle root is a focusable `label.checkbox-container[tabindex="0"]` containing an
input with `tabindex="-1"`; the checked state adds `.is-enabled`, and the thumb is `::after`.
Obsidian 1.13.4 sizes and moves it through the official native variables `--toggle-width`,
`--toggle-thumb-width`, `--toggle-thumb-height`, and `--toggle-border-width` (plus their
`--toggle-s-*` compact equivalents).

The Phase 3 theme rule added `border: 1px` to the fixed-height root. That changed the root's content
box without changing Obsidian's two-pixel thumb margin: the 44×20 Settings track and 26×16 thumb
measured 3px above and 1px below in both checked and unchecked states. The repair removes that
layout-affecting border and leaves Obsidian's native inset shadow, dimensions, active expansion, and
horizontal transforms intact. No `top`, vertical margin, `translateY`, fixed thumb height, or
component-local color was added.

| Context / state           | Track | Thumb | Horizontal transform  | Vertical result   |
| ------------------------- | ----- | ----- | --------------------- | ----------------- |
| Settings group, unchecked | 44×20 | 26×16 | 2px                   | 2px / 2px         |
| Settings group, checked   | 44×20 | 26×16 | 16px                  | 2px / 2px         |
| Core-plugin Settings list | 36×16 | 20×12 | checked 14px          | 2px / 2px         |
| Graph Settings, unchecked | 36×16 | 20×12 | 2px                   | 2px / 2px         |
| Graph Settings, checked   | 36×16 | 20×12 | 14px                  | 2px / 2px         |
| Pressed Settings Toggle   | 44×20 | 34×24 | native value retained | extends 2px / 2px |

Additional validation:

- Light and dark checked/unchecked geometry is identical; only semantic track colors change.
- Hover was forced through the Settings renderer's DevTools pseudo-state support and retained the
  centered dimensions. Active expands the thumb according to native variables and remains vertically
  symmetric instead of being clipped.
- Keyboard traversal produced `:focus-visible` on the root with a two-pixel theme focus outline and
  two-pixel offset; the ring is outside the track and does not alter its box.
- A controlled disabled-state fixture cloned the current native DOM, set the nested input disabled,
  removed the root from the tab order, and verified that clicking did not change state. Geometry
  remained 2px / 2px. No naturally disabled Toggle was exposed by the installed Settings pages, so
  that fixture is recorded separately from an organic application state.
- Separate-window Settings and embedded main-window Settings both measured 44×20 / 26×16 with 2px /
  2px gaps. The user's “Open settings in new window” preference was restored after the test.
- At zoom factors 1.0, 1.1, and 0.9 the DPR values were 2.0, 2.2, and 1.8. CSS geometry remained
  centered; sub-pixel raster differences were at most 0.006 CSS px, and zoom was restored to 1.0.
- The third-party plugin runtime is unavailable because Restricted mode remains enabled. The
  built-in Page preview plugin Settings tab was tested as the plugin-list context; third-party
  plugin Settings Toggles remain untested rather than inferred.

Ignored review evidence lives in `.analysis/phase-4-review/toggle-before.png`,
`toggle-after-light.png`, `toggle-after-dark.png`, and `toggle-focus.png`.

## Bases evidence and official variables

The actual Bases controller rendered Table and Cards views, view/sort/filter/search/group controls,
editable cells, checkboxes, tags, dates, numbers, links, long fields, image covers, context menu,
and pop-out. Search with no matches produced `0` results; the controller error path rendered
`.bases-error`. In 1.13.4 `startLoader()` is a no-op, so a loading visual could not be exposed.

Phase 3 maps official `--bases-*` variables for card/container/cover surfaces and shadows, table
headers/rows/cells/groups/summaries, active/selected/focus states, filters, embed border, and group
heading text. No `.bases-*` selector was added to source CSS.

## Canvas evidence and official variables

Actual Canvas DOM included `.canvas-node`, `.canvas-node-group`, edges and labels, native resizers,
context menus, creation/zoom/fit/reset/undo/redo/help controls, selected and multi-selected nodes,
and editing state. Empty, six-node mixed-content, and 20-node/19-edge fixtures were exercised; image
nodes remained unfiltered and unclipped. Drag resize changed a node from 360×210 to 420×280 and Undo
restored it. The current client exposed no minimap.

Phase 3 maps official Canvas background, dot, six color roles, and card-label variables. It adds no
Canvas selector, blur, heavy shadow, `:has()`, or rendering animation.

## Graph evidence and official variables

The global graph rendered 23 nodes and 43 links with Filters, Groups, Display, and Forces controls;
the local graph rendered 7 nodes and 10 links in a split. Phase 3 maps only official variables:

| Graph role | Light                 | Dark         |
| ---------- | --------------------- | ------------ |
| Ordinary   | muted blue-gray ink   | night muted  |
| Current    | deep link cobalt      | night cobalt |
| Unresolved | muted dusty pink      | night sakura |
| Tag        | deep gray violet      | night violet |
| Attachment | deeper sky blue       | night sky    |
| Edge       | low-contrast ice blue | night border |

The rendered network and controls were visually checked in light and dark. Hover, selected, and
search-highlight nodes did not expose a separately inspectable DOM state through automation, so
their native behavior and mapped variables are retained without a stronger claim.

## Core views, windows, and layout

File Explorer, Search, Bookmarks, Outline, Backlinks, Outgoing links, Tags, File Properties, Command
palette, Quick switcher, context menu, Notice, File recovery, and Sync settings views were opened in
the real client. Long mixed-language names and deep paths were exercised. A 760×820 window had equal
document scroll/client width, so no horizontal overflow was introduced.

Simultaneous note, Canvas, Bases, and Graph pop-outs plus the Settings pop-out inherited the same
background, text, and accent variables. Maximized and fullscreen transitions were exercised on
macOS. Windows/Linux title bars, ultrawide hardware, forced-colors, touch, and mobile remain
untested in this Phase 3 record; the bounded emulation evidence below supersedes only the responsive
and CSS-media portions.

## Phase 4 mobile-responsive DOM evidence

### Environment and scope

The official `obsidian dev:mobile on` desktop emulator added `emulate-mobile is-mobile is-tablet` to
the root. Tablet review used 820×900. A controlled phone-class review removed `is-tablet`, added the
native `is-phone` state, and exercised 390×844 portrait, 320×700 narrow, and 844×390 landscape. This
is the real 1.13.4 renderer and current DOM, but not a claim about iOS/iPadOS/Android rendering,
gestures, safe-area hardware, or a mobile virtual keyboard.

Observed stable roots and measurements:

| Surface                | Actual 1.13.4 evidence                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| Bottom navigation      | `.mobile-navbar`; 316×52 at phone widths, native 32 px bottom safe-area gap in the emulator       |
| Editing toolbar        | `.mobile-toolbar`; floating `.mobile-toolbar-option` targets measure 44×44 after theme adaptation |
| Side drawers           | `.workspace-drawer` and `.workspace-drawer-header`; Explorer/Search rows and search are operable  |
| Phone Settings         | `.modal.mod-settings`; 390×844 full viewport, fields/buttons 44 px high                           |
| Phone Toggle           | `.checkbox-container`; 52×30 track, 26×26 thumb, 2 px / 2 px vertical gaps in both states         |
| Command/quick switcher | Native bottom sheet; 390 px wide, 52 px search field, no document overflow                        |
| Markdown wide table    | `.el-table` parent owns `overflow-x:auto`; table 422 px / viewport content 342 px                 |
| Bases Table/Cards      | `.bases-view` owns internal scroll; Cards reflow inside 366 px without document overflow          |
| Canvas/Graph controls  | `.canvas-control-item` / `.graph-controls .clickable-icon`; visible targets raised to 44×44       |

The responsive source uses only those observed root/component classes. Mobile images retain the
desktop `.image-embed` structure; a 317.34 px selected image fit inside the 390 px document, its
action measured 44×44 with pointer events enabled, and the native Lightbox filled 390×844 with a
44×44 close control. The single-image fixture exposed no previous/next controls. A synthetic Space
event opened the Lightbox after real pointer selection; long-press, swipe-down, pan, pinch, and
multi-image navigation require physical-device review.

### Bases card image-fit boundary

The rendered `.bases-cards-cover` carries an inline `background-size: cover` generated from the Base
file's `imageFit: cover`. The theme does not override it: a theme-level cover/contain class would
lose to the inline declaration unless it used forbidden `!important`, and it would conflict with
document-owned view configuration. Style Settings therefore presents guidance instead of a
nonfunctional switch; users choose Cover/Contain in the native Bases view.

### Style Settings and CSS media evidence

Style Settings 1.0.9 added `css-settings-manager` to the root and parsed 48 Aoi Tori settings with
no errors. Default `aoi-*` classes reproduce the reviewed design. Representative palette,
high-contrast, stronger-focus/border, 48 px target, reduced-motion, and gradient-disabled classes
were applied, measured, captured, then reset through the plugin manager.

Chromium media emulation produced these actual computed outcomes:

- `prefers-reduced-motion: reduce`: Toggle transition property `none`, duration `0s`.
- `prefers-contrast: more`: focus width 3 px and stronger muted text/border mappings.
- `forced-colors: active`: links use system LinkText plus underline; a phone Toggle uses a system
  ButtonFace/CanvasText track and thumb distinction; Settings buttons have visible system borders;
  the phone Settings modal remains within the viewport.

`forced-colors` still requires Windows High Contrast manual validation. The rule is intentionally
scoped to `body.theme-light` and `body.theme-dark` so it outranks theme token mappings without
`!important`; decorative gradients are removed while native semantics remain available.

## Risk register and regression boundary

| Dependency / state              | Risk       | Current decision and fallback                                           | Required future regression                          |
| ------------------------------- | ---------- | ----------------------------------------------------------------------- | --------------------------------------------------- |
| Four image selectors above      | Low/medium | Reverified in 1.13.4; native selection/actions remain the fallback      | Recheck after every minimum-app-version change      |
| Native resize and Lightbox DOM  | Medium     | Observed but not styled                                                 | Recheck command, pointer, table, and mobile flows   |
| Bases/Canvas/Graph internal DOM | Medium     | Observation only; official variables supply the theme                   | Recheck variables before adding any selector        |
| Settings/community browser DOM  | Medium     | Observation only; generic controls and official variables remain active | Recheck when scorecard/control presentations change |
| Pop-out root implementation     | Medium     | No main-window parent dependency; semantic tokens inherit               | Recheck macOS plus Windows/Linux window chrome      |
| Mobile root/component classes   | Medium     | Scoped to confirmed 1.13.4 states; official variables remain fallback   | Recheck on physical iOS/iPadOS/Android              |
| Style Settings metadata schema  | Low/medium | Optional 1.0.9 parse passed; defaults require no plugin                 | Reparse after metadata or build-pipeline changes    |

The earlier automated table-image drag did not persist a width, but the user subsequently performed
the manual Table image Resize review and reported it normal. No CSS workaround was introduced.
Remaining interaction boundaries are real mobile gestures/keyboard/safe areas, Windows forced
colors, Graph transient renderer states, and a Canvas minimap absent from this client.
