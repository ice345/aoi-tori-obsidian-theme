# Obsidian DOM findings

Status: Phase 2 macOS Live Preview DOM inspected in Obsidian 1.13.4 on 2026-08-02. Only the narrow
image selectors listed below are approved; all other image, Vim, mobile, and nested-context states
remain untested.

## Environment

| Item                  | Phase 2 finding                                                                  |
| --------------------- | -------------------------------------------------------------------------------- |
| Obsidian version      | Desktop `1.13.4`                                                                 |
| Installer version     | `1.13.4` as shown in Settings and the application bundle                         |
| Local cached app code | `/Users/ice/Library/Application Support/obsidian/obsidian-1.13.4.asar`           |
| Platform              | macOS 26.5 (25F71), Apple silicon (`arm64`)                                      |
| Theme revision        | Unborn `master` branch; no commit exists                                         |
| Vault                 | `test-vault-content`, no community plugins                                       |
| Mode                  | Light and dark tested; Vim off                                                   |
| Inspection method     | Rendered client DOM through the Electron DevTools protocol, plus captured images |
| Date                  | 2026-08-02 (Asia/Shanghai)                                                       |

The local application and installer now both report 1.13.4. The Phase 1 `1.12.7` installer-shell
observation is superseded by this actual test run; it appears the local installer changed before
Phase 2 testing. The version displayed in Settings is the evidence used for this matrix.

## Official 1.13 behavior baseline

The [official changelog](https://obsidian.md/changelog/) establishes the required behavior matrix,
but does not publish a stable DOM contract. In current 1.13 releases:

- Live Preview images can be selected with pointer or keyboard and acted on with copy, cut, and
  delete.
- Image actions include grow, shrink, reset, editing transitions, and a zoom/lightbox path.
- Enter and Tab participate in image editing/sizing flows; Space and the zoom button can open the
  lightbox.
- Vim gained image commands and must retain a visible selected state.
- Follow-up fixes cover table resizing, image action visibility, non-image embed actions,
  indentation, and images disappearing during embed editing.
- Mobile fixes cover double-tap zoom and swipe-down lightbox dismissal.

The same release family also changed Settings, Bases, Canvas, pop-outs, touch behavior, and
`--callout-color`. See `docs/theme-research.md` for the release and documentation snapshot.

## Phase 2 rendered DOM evidence

The local SVG embed rendered in Live Preview as this hierarchy (file URL omitted):

```html
<div class="internal-embed media-embed image-embed is-loaded" tabindex="-1">
  <div class="image-wrapper">
    <img width="640" />
    <div class="image-resize-corner"></div>
  </div>
  <div class="embed-actions">
    <div class="embed-action" aria-label="Zoom in">…</div>
    <div class="embed-action edit-block-button" aria-label="Edit this block">…</div>
  </div>
</div>
```

Pointer selection adds `is-selected` to `.image-embed` and `mod-image-selected` to the containing
`.markdown-source-view`. The embed remains `tabindex="-1"`; pointer selection leaves DOM focus on
the CodeMirror content. This is why the theme uses the confirmed `.image-embed.is-selected` class
for the selected outline instead of pretending that mouse selection is `:focus-visible`.

The following are the only approved image selectors in the Phase 2 slice:

| Selector                       | Evidence and use                                                     | Fallback                                      |
| ------------------------------ | -------------------------------------------------------------------- | --------------------------------------------- |
| `.image-embed`                 | Rendered embed root; radius and hover/focus surface                  | Native image layout remains unchanged         |
| `.image-embed.is-selected`     | Confirmed pointer-selected state; cobalt outline without reflow      | Native inset selection overlay remains intact |
| `.image-embed .embed-action`   | Confirmed zoom/edit actions; color, hover, and focus-visible styling | Official embed-action variables still apply   |
| `.image-embed .clickable-icon` | Stable icon fallback within an image action surface                  | Native icon style                             |

No rule targets `img` globally, changes image dimensions, disables pointer events, clips the action
surface, changes its `z-index`, or styles the resize corner/lightbox. The official
`--embed-action-color`, `--embed-actions-background`, `--embed-actions-shadow`, and `--image-radius`
variables do most of the work.

## Verified image observations

- Mouse selection added `is-selected` and exposed both action buttons.
- The embed bounding box was identical before and after selection (`561.3203125 × 315.7421875` CSS
  pixels in that window), confirming that the outline did not shift layout.
- The selected outline computed to 2 px `#1558A0` with a 3 px offset in light mode.
- Actions computed as visible with `pointer-events: auto`; hovering Zoom in changed both icon and
  background while keeping the action clickable.
- Activating Zoom in created native `.lightbox`, `.lightbox-bg`, `.lightbox-content`,
  `.lightbox-media`, and `.lightbox-controls` elements; Escape closed it.
- The native resize corner was present and visible. Drag resizing was not performed, so resize
  persistence and table resizing remain untested.
- The embedded image had no running transition (`0s`); Aoi Tori defines no width/height animation.
- General keyboard navigation produced a visible 2 px cobalt `:focus-visible` outline. Keyboard and
  Vim image-selection flows remain untested and are not claimed.

## Live Preview image states to capture

Record the DOM, official variables, classes, attributes, focus movement, and state transitions for:

- Default image and width-specified image
- Mouse-selected image
- Keyboard-selected image
- Vim-selected image and counted commands
- Action buttons and zoom button
- Resize control and table-contained resizing
- Enter and Tab editing flows
- Markdown embed editing and non-image embed actions
- Lightbox opening, filename, pan/navigation, and dismissal
- List, nested-list, callout, quote, table, embed, pop-out, and narrow contexts
- Touch selection, double-tap zoom, and swipe-down dismissal

## Risk register

| Dependency                           | Stability                     | Why it might be needed                                     | Current fallback                                    | Required evidence                                          |
| ------------------------------------ | ----------------------------- | ---------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| Official Obsidian semantic variables | Preferred                     | Color, focus, border, and surface mapping                  | Preserve native value where no mapping is required  | Verify variable behavior in 1.13 light/dark and pop-outs   |
| Internal image-selection selector    | Narrow pointer state approved | Official variables cannot express the selected root state  | Keep native inset selection styling                 | Keyboard, Vim, and nested-context tests are still required |
| Internal action selector             | Narrow action class approved  | Makes current zoom/edit actions visible within the palette | Official embed variables and native action behavior | Keyboard action focus and non-image embeds remain untested |
| Internal resize selector             | Observed; not styled          | No Phase 2 style is necessary                              | Keep native control                                 | Drag, table, nesting, and keyboard resize tests            |
| Internal lightbox selector           | Unknown; not approved         | Only if semantic variables cannot style it safely          | Keep native lightbox                                | Desktop/mobile DOM and open/pan/dismiss tests              |

This register must contain concrete selectors and fallbacks before any exception to the low-risk
semantic-variable strategy is implemented.
