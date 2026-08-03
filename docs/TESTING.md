# Testing

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
are recorded in `docs/obsidian-dom.md`, that the required Phase 3 fixture set exists, and that Style
Settings metadata/groups survive the build. These are release-boundary checks, not permission to
package the fixture directory.

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
