# Testing

## Phase 2 local review

The minimum preview slice was exercised on 2026-08-02 in Obsidian Desktop and Installer 1.13.4 on
macOS 26.5 (Apple silicon). The theme was linked into the ignored configuration for
`test-vault-content`; Vim was off and no community plugins were installed. Light mode, dark mode,
Live Preview, Source mode, Reading view, the Settings pop-out, mouse image selection, action-button
visibility/hover, native lightbox opening, and a real Tab-driven `:focus-visible` state were tested.

This is a bounded macOS smoke test, not a release-support matrix. Keyboard/Vim image commands,
resize mutation, nested image contexts, document pop-outs, narrow layouts, mobile/touch, Bases,
Canvas, and other platforms remain untested. Exact rows and screenshot paths are in
`docs/test-matrix.md`; confirmed image DOM is in `docs/obsidian-dom.md`.

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
