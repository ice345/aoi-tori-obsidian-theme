# Design system

Status: Phase 2 core palette and Phase 2.5 visual refinement are preserved; Phase 3 desktop core
view semantic mappings and actual-client validation were completed on 2026-08-02. Image evidence
remains in `docs/visual-analysis.md`; this document is the token and UI-role specification for the
current review build.

## Identity

Aoi Tori translates a blue-bird watercolor atmosphere into a practical Obsidian interface. It is not
simply a blue-and-white skin and it is not an unofficial film-branded product.

The identity depends on relationships:

- warm paper and cool cloud white create room to breathe;
- pale cyan watercolor creates quiet spatial layers;
- clear sky blue carries atmosphere;
- deep cobalt carries the blue-bird motif, navigation, focus, and present action;
- violet-navy ink preserves reading clarity and supplies the deepest anchor;
- sakura and lilac create a second voice that approaches blue without merging into it;
- a nearly absent gold-orange point prevents the cool system from becoming emotionally flat;
- empty space, thin boundaries, and small changes of distance are part of the composition.

## Source hierarchy

Final visual decisions use this order:

1. Images in `references/raw/`
2. `docs/visual-analysis.md`
3. This design document
4. Existing semantic tokens
5. Supplied HEX anchors
6. Other themes

Supplied HEX values are historical anchors, not fixed requirements. Community themes are engineering
references only.

## Narrative translation

The [official synopsis](https://ponycanyon.us/show/liz-and-the-blue-bird/) frames the central
relationship as an oboe/flute duet whose parts keep turning near one another while struggling to
align. In the [director interview](https://liz-bluebird.com/interview/), Naoko Yamada emphasizes
delicate emotional accumulation, interpersonal distance, breath, warmth, and avoiding shorthand
emotional symbols. Aoi Tori should follow the same design ethic: meaning comes from repeated small
relationships, not literal character art or decorative icons.

### Liz and the fairy-tale world

Translate this voice into:

- warm-neutral paper rather than beige parchment;
- very pale sakura watercolor on optional quote/callout/card surfaces;
- light cards with thin edges and generous internal space;
- a tiny warm point where a composition benefits from counterbalance.

Do not turn the workspace pink, use ornate storybook frames, or add character/flower imagery.

### The blue bird

Translate this voice into:

- clear sky blue for atmosphere and secondary interaction;
- deep cobalt for links, current file/tab, primary actions, selected state, and keyboard focus;
- a cobalt outline or equivalent non-layout-changing cue for selected images;
- one strong active signal among otherwise quiet surfaces.

Do not color all text or every icon blue. A motif is legible because it is selective.

### The two girls as a duet

Use two neighboring but non-identical voices:

- **primary voice:** sky-to-cobalt blue;
- **secondary voice:** sakura-to-gray-purple, with lilac as the bridge.

They may appear as paired metadata, paired decorative curves, or different callout details. They
must not become a rainbow heading system, a gender code, or competing primary actions. Meaning must
remain understandable without color.

### Music and breath

The design rhythm is spatial rather than iconographic:

- use a 4 px base rhythm with common phrase intervals of 8, 16, 24, and 32 px;
- keep controls and groups clearly phrased instead of uniformly dense;
- reserve larger gaps for transitions between conceptual sections;
- keep motion brief, small, and functional;
- never add decorative note symbols, staff lines, or continuous pulsing.

### Distance and approach

Express distance through:

- two or three clear surface levels;
- one-pixel boundaries where separation is necessary;
- quiet inactive states that remain readable;
- active states with a change in both color and structure/weight/outline;
- gentle convergence of spacing or paired lines without literal collision.

Avoid thick borders, large shadows, aggressive scale changes, and controls that disappear until
hover unless Obsidian already provides an accessible alternative.

### Watercolor

Watercolor is a color-and-space system, not a texture asset:

- use close lightness steps and low-chroma surface colors;
- use limited transparency for hover/selection overlays on solid backgrounds;
- permit only small, static, low-cost gradients in decorative or promotional contexts;
- retain crisp text, focus, icons, and interactive boundaries;
- do not use real watercolor images, large blur filters, or `backdrop-filter` as interface
  backgrounds.

## Visual proportions

The Phase 1 target translated from the images is:

```text
Paper, cloud, and open neutral space: 65–75%
Mist, ice, and pale aqua surfaces:     15–25%
Sky, cobalt, and ink structure:         5–8%
Sakura and lilac second voice:          2–4%
Gold-orange warm point:                 0–1%
```

These are compositional guardrails, not a requirement to measure every screen. A narrow mobile view
still needs to feel mostly light and open even when its controls occupy a larger percentage.

## Final primitive palette

Primitive names describe what the colors mean visually. UI modules never consume these values
directly; light and dark semantic files map them to official Obsidian variables first.

### Paper, cloud, watercolor, and blue-bird structure

| Primitive               | Value     | Visual purpose                                       |
| ----------------------- | --------- | ---------------------------------------------------- |
| `--aoi-paper-warm`      | `#FBFAF8` | Warm paper-white primary reading field               |
| `--aoi-cloud-cool`      | `#F6FAFA` | Cool cloud-white raised surface                      |
| `--aoi-mist-blue`       | `#E8F2F4` | Mist-blue sidebar and quiet panel                    |
| `--aoi-cloud-shadow`    | `#DFECEF` | Cloud shadow and stronger inactive surface           |
| `--aoi-ice-border`      | `#CBDFE8` | Ice-blue one-pixel boundary                          |
| `--aoi-watercolor-cyan` | `#B8DEE8` | Translucent-looking wash and non-text selection      |
| `--aoi-powder-blue`     | `#A8CDE1` | Uniform/powder-blue midtone and hover boundary       |
| `--aoi-sky-blue`        | `#83BEE7` | Atmospheric sky used through quiet mixed fills       |
| `--aoi-sky-deep`        | `#65A8DE` | Stronger sky bridge and native decorative blue       |
| `--aoi-clear-cyan-blue` | `#3F97C5` | Clear cyan-blue information/decorative accent        |
| `--aoi-focus-blue`      | `#1558A0` | Light-mode keyboard and image focus outline          |
| `--aoi-link-blue`       | `#1D5FAE` | Accessible link, primary action, and current state   |
| `--aoi-cobalt-deep`     | `#174678` | Pressed/hovered cobalt and blue-bird structural dark |
| `--aoi-indigo-deep`     | `#303F65` | Deep indigo headings and code structure              |

### Ink, duet accents, and warm counterpoint

| Primitive                | Value     | Visual purpose                                       |
| ------------------------ | --------- | ---------------------------------------------------- |
| `--aoi-ink-indigo`       | `#292B3B` | Violet-leaning main body ink, never pure black       |
| `--aoi-ink-strong`       | `#3E4B5C` | Strong secondary text and code                       |
| `--aoi-ink-muted`        | `#586C7D` | AA-compliant secondary text and common icons         |
| `--aoi-ink-faint`        | `#627686` | Faint text that still reaches the configured AA pair |
| `--aoi-sakura-pale`      | `#F7E9ED` | Liz/quote wash                                       |
| `--aoi-sakura`           | `#DCA3BC` | Decorative sakura detail and paired-curve voice      |
| `--aoi-dusty-pink`       | `#87506F` | Accessible second-voice text                         |
| `--aoi-dusty-pink-muted` | `#7B5773` | Quieter AA-compliant unresolved-link text            |
| `--aoi-gray-violet-pale` | `#F0EAF5` | Quiet lilac metadata surface                         |
| `--aoi-gray-violet-deep` | `#66537D` | Accessible gray-violet text/code detail              |
| `--aoi-warm-yellow-pale` | `#FBF3DF` | Nonessential highlight surface                       |
| `--aoi-gold-orange`      | `#E5A12A` | Sub-1% decorative warm point; never essential text   |
| `--aoi-gold-deep`        | `#95550E` | Accessible warm code/value/native orange step        |

### Independent summer-night palette

| Primitive             | Value     | Visual purpose                        |
| --------------------- | --------- | ------------------------------------- |
| `--aoi-night-canvas`  | `#111827` | Deepest night canvas                  |
| `--aoi-night-surface` | `#172338` | Main night reading surface            |
| `--aoi-night-panel`   | `#20344D` | Raised blue-night panel               |
| `--aoi-night-border`  | `#36516C` | Night boundary                        |
| `--aoi-night-text`    | `#EAF3F5` | Ice-cloud primary text                |
| `--aoi-night-muted`   | `#B3C5D4` | Secondary night text and icons        |
| `--aoi-night-faint`   | `#92A7B8` | Faint night structure                 |
| `--aoi-night-sky`     | `#7FC3E8` | Secondary night interaction           |
| `--aoi-night-cobalt`  | `#8EAEF2` | Primary night link, action, and focus |
| `--aoi-night-sakura`  | `#DEA5C0` | Sparse night second voice             |
| `--aoi-night-violet`  | `#C2B1DA` | Night lilac bridge                    |

### Preserved safety semantics

| Role    | Light foreground / soft surface | Dark foreground / soft surface |
| ------- | ------------------------------- | ------------------------------ |
| Error   | `#A83246` / `#F7E6E9`           | `#FF9AA5` / `#3B1F2A`          |
| Warning | `#8A5A00` / `#FBF2DC`           | `#F4C56A` / `#3A3020`          |
| Success | `#276A53` / `#E3F2EC`           | `#7BD6B0` / `#19362F`          |
| Info    | `#245F90` / `#E4F1F8`           | `#7FC3E8` / `#1B3347`          |

## Final semantic mapping

The implementation maps color roles in `semantic-light.css` and `semantic-dark.css`; component files
contain no literal colors. The principal mapping is:

| UI role                         | Light mapping                                   | Dark mapping                                    |
| ------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| Reading / raised / side surface | warm paper / cloud / mist                       | night surface / panel / canvas                  |
| Hover / selected fill           | mixed sky wash / cloud shadow                   | panel mixed with sky/cobalt                     |
| Border / keyboard focus         | ice border / focus blue                         | night border / night cobalt                     |
| Body / secondary / faint text   | ink indigo / ink muted / ink faint              | night text / night muted / night faint          |
| Link / current / primary action | link blue, then deep cobalt on hover            | night cobalt, then night sky on hover           |
| Unresolved link                 | muted dusty pink plus wavy sakura underline     | night sakura plus wavy violet underline         |
| Input and secondary control     | cloud field with ice/powder boundary            | night canvas with border/sky boundary           |
| Selection / highlight           | watercolor cyan mix / pale warm yellow          | cobalt mix / translucent night warning          |
| Code / quote / callout          | cloud code, sakura quote, preserved safety hues | canvas code, panel quote, preserved safety hues |
| Properties / table              | cloud/mist/ice hierarchy                        | canvas/panel/border hierarchy                   |
| Menu / modal / Settings         | cloud or paper above a mist sidebar             | night surface above a canvas sidebar            |

Official variables cover backgrounds, text, links, controls, icons, navigation, tabs, metadata,
tables, embeds, menus, modals, and settings. Small module rules add geometry and state cues where a
variable alone cannot express the requested slice.

### Accessibility adjustments from the images

- Sampled sky and powder blues are too light for essential text on paper. Functional links and
  primary actions therefore use `#1D5FAE`; keyboard focus uses the still darker `#1558A0`.
- The close-up's near-black hair becomes violet ink `#292B3B`, keeping its hue character while
  providing 13.39:1 body contrast instead of using literal black.
- Pale sakura and gray violet remain surfaces or decoration. Required pink/violet text uses
  `#87506F` or `#66537D`; the quieter unresolved-link step `#7B5773` still measures 5.83:1 on paper
  at full opacity, then strengthens to cobalt at hover.
- The reference gold `#E5A12A` measures only 2.13:1 on warm paper. It remains decorative; the deeper
  `#95550E` is reserved for readable warm code/value roles, while warnings retain their own semantic
  amber.
- Dark mode interaction blues were lightened relative to source cobalt so links and focus remain
  visible on all three night surfaces without becoming neon.

## Color roles

The exact Phase 1 candidate values and measured contrast pairs are defined once in
`docs/visual-analysis.md`.

### Paper, cloud, mist, and ice

Use for main backgrounds, alternate surfaces, panels, form fields, hover/selection fills, and thin
boundaries. The primary reading surface is slightly warm-neutral; sidebars and raised panels may
lean cooler. Near-white values are never text.

### Sky and aqua

Use for atmosphere, soft information surfaces, larger icons, and secondary interaction. The sampled
sky blues are too light for small text on paper and require a darker semantic step when used
functionally.

### Bird/cobalt

Use for links, the current navigation state, primary actions, selected-image outlines, and visible
keyboard focus. Light mode uses a darker accessible cobalt; dark mode uses a lighter feather-like
cobalt. Do not use the same literal value in both modes.

### Sakura and lilac

Use sparingly for the second voice: quote details, paired metadata, optional small heading marks,
and original promotional curves. Text uses the darker accessible steps; pale steps are surfaces or
decoration. Unresolved links and safety states must remain semantically distinguishable.

### Ink and night

Use violet-navy ink for light-mode body text, outlines, code, and structural details. Dark mode is a
separate summer-night palette: deep navy surfaces, ice text, and brighter sky/cobalt accents. Pure
black is not the default, and images are never automatically inverted.

### Gold orange

Use only as a tiny decorative counterpoint unless the darker accessible step is deliberately
assigned a text role. It must not replace warning amber or become a general accent.

### Safety colors

Preserve Obsidian error, destructive, warning, and success semantics. Pink is not an error color;
gold is not automatically a warning color; decorative blue cannot be the only signal for selection
or focus.

## Light mode

Light mode is the primary Aoi Tori identity:

- warm-neutral paper reading surface;
- cloud-white raised areas and mist-blue secondary panels;
- deep violet-navy body text;
- cobalt links, focus, current state, and primary action;
- pale cyan hover/selection fills with an additional non-color cue;
- sparse sakura/lilac second voice;
- thin borders and little or no shadow.

The interface should feel high-key and calm without washing out control boundaries.

## Dark mode

Dark mode represents a summer night and the close-up's deep ink, not an inverted daytime palette:

- deep navy canvas, slightly lighter reading surface, and blue-raised panels;
- ice-blue-white body text and readable muted text;
- brighter cobalt/sky interactions that remain distinct from body text;
- softened sakura/lilac details;
- no neon glow, true-black default, glass blur, or automatic image filter.

## Phase 2.5 visual refinement

### Watercolor air without texture assets

- The light sidebar keeps its solid mist-blue semantic surface and adds one static cyan wash at 5%
  from a corner. It remains visibly cooler than the paper reading field.
- Properties keeps a solid cloud surface underneath two static 4% washes: gray violet from the upper
  left and cyan/mist from the lower right. The border and row dividers were also lightened.
- Quote keeps a solid cloud/night panel underneath one left-to-right sakura fade. Its 2 px sakura
  edge is structural; body text stays normal ink or normal night text.
- Light Callouts use a 5% semantic wash. Dark Info uses 6% night sky, Success/Warning/Error use 5%
  green/gold/red, and Second voice uses 6% gray violet.
- The outer Callout owns the complete solid surface and semantic wash. Its content layer is
  transparent so the wash remains continuous behind the title and body instead of being masked by a
  nested white slab in light mode or a nested black slab in dark mode.

The paper reading surface, body text, primary cobalt interactions, semantic safety foregrounds, code
palette, and native control surfaces remain deliberately solid colors. Real watercolor textures were
rejected because they would turn the reference art into an interface asset, reduce text
predictability, and invite blur/filter work. The current gradients use no image, Base64, filter,
blur, backdrop filter, blend mode, or text-covering pseudo-element; each component stays at one or
two simple static layers.

### Callout icon and structure specification

Obsidian 1.13.4 was cold-started with the test note and each final `--callout-icon` value was
confirmed to produce a built-in Lucide SVG. CSS uses the registry's `lucide-*` spelling:

| Callout type                    | Final icon              | 1.13.4 result |
| ------------------------------- | ----------------------- | ------------- |
| Info                            | `lucide-info`           | Verified      |
| Success / check / done          | `lucide-circle-check`   | Verified      |
| Warning / caution               | `lucide-triangle-alert` | Verified      |
| Error / danger / failure / fail | `lucide-circle-x`       | Verified      |
| Note                            | `lucide-notebook-pen`   | Verified      |
| Todo                            | `lucide-list-checks`    | Verified      |
| Tip                             | `lucide-lightbulb`      | Verified      |
| Question                        | `lucide-circle-help`    | Verified      |
| Bug                             | `lucide-bug`            | Verified      |
| Quote / cite                    | `lucide-quote`          | Verified      |
| Example                         | `lucide-flask-conical`  | Verified      |
| Second voice                    | `lucide-music-2`        | Verified      |
| Aoi Tori                        | `lucide-feather`        | Verified      |

The proposed `lucide-circle-info` ID did not resolve in this 1.13.4 registry, so Info uses the
verified synonymous `lucide-info`. The first choices for Success, Error, and Second voice resolved,
so their alternate candidates were unnecessary. No Blowfish, Font Awesome, or custom SVG was
introduced; even the theme-specific Aoi Tori type uses the built-in feather.

Icons render at 18 px inside a 25 px circular container, inherit `currentcolor`, use a unified 1.8
stroke weight, and receive a 10% semantic-color surface. Callouts use a 2 px semantic inline-start
edge, medium title weight, and normal body color. The test Markdown uses only the blockquote
separator required to create a real body paragraph; no global margin rule compensates for authoring
whitespace. The `.callout-content` layer intentionally has a transparent background: the parent
Callout supplies the single continuous semantic surface, while body text remains normal ink/night
text.

### Hierarchy, boundaries, and image selection

- Light H2 is mixed 9% toward muted ink, reducing cobalt intensity while leaving H1 and body text
  unchanged. Unresolved links are quieter by default, retain the sakura wave, and strengthen to
  cobalt on hover.
- Dark H2/H3 mix toward muted night text, lowering brightness without changing the code palette.
  Table borders in both modes and light Properties boundaries are quieter; no zebra striping was
  added.
- The theme-selected image outline is now 1 px with a 2 px offset. In 1.13.4 it coexists with the
  native inner selection cue and two native action buttons, uses no layout-changing border, and
  leaves the native interaction structure intact.

## Phase 3 desktop core-view decisions

Phase 3 does not change the approved primitive palette, typography, density, Callout, Quote,
Properties, heading, code, or image-selection design. It extends only official Obsidian semantic
variables so native desktop views inherit the same relationships without a separate visual system.

### Embed and PDF surfaces

- Loaded embeds keep their native geometry and controls. Light embeds use paper/cloud/ice roles;
  dark embeds use night surface/canvas/border roles.
- The start edge uses the existing accessible cobalt role, and hover uses an outline-like shadow
  rather than overflow clipping or a fixed height.
- PDF page, sidebar, thumbnail, and spread variables use the same paper/mist or night hierarchy.
  Audio/video controls stay native. Non-image embeds are never routed through image rules.

### Bases

- Table headers and summaries use the reading surface; rows hover into mist/night panel; selected
  cells use watercolor cyan or night info; active/focus cells add a cobalt outline-equivalent.
- Cards use one quiet border shadow, cloud/night cover backing, and existing text roles. They do not
  become saturated blue application cards.
- Dense data preserves restrained borders and normal body ink. Group labels remain secondary, while
  image covers supply content color rather than theme decoration.

### Canvas

- The Canvas base remains paper in light and night surface in dark, with an ice/night-border dot
  grid. Groups and ordinary structure are deliberately low chroma.
- Canvas color roles reuse accessible safety colors plus cyan sky and gray violet; no new palette
  was introduced. The theme adds no heavy node shadow, blur, image filter, or animation.
- Selected/editing/resizing behavior remains native so performance and interaction take priority
  over extra watercolor effects.

### Graph

- Ordinary nodes are muted blue-gray; current nodes are cobalt; unresolved nodes are dusty pink;
  tags are gray violet; attachments are sky blue; edges are quiet ice/night blue-gray.
- This is the duet narrative expressed as sparse semantic roles, not every node becoming vivid blue.
  `--graph-*` variables provide the entire mapping; no renderer-internal selector is used.

### Desktop windows and fixtures

- Pop-outs inherit the same variables without a main-window ancestor. Settings, note, Bases, Canvas,
  and Graph windows therefore keep consistent paper/night surfaces and accessible focus.
- Original Phase 3 diagnostic media uses only geometric circles, paired curves, mist fields, and a
  tiny gold point. It exists under `test-vault-content/` for functional testing, not as a bundled
  theme asset or final promotional image. No reference artwork, character, title, feather contour,
  flower, logo, external font, or copied theme asset is present.

## Phase 4 mobile, configuration, and accessibility decisions

Phase 4 preserves the approved palette and density. It changes responsive geometry, touch reach,
optional bounded variables, and system-accessibility responses rather than introducing a second
mobile visual identity.

### Mobile hierarchy and touch

- Phone content uses the full available measure with 16 px file margins; tablet content retains a
  roomier 24 px margin. Reading paper, mist panels, ink text, cobalt actions, and the independent
  night palette remain unchanged.
- Bottom navigation, the editing toolbar, drawers, phone Settings, and tablet tabs use the existing
  semantic surfaces. A quiet one-pixel edge and native safe-area placement are retained; the theme
  does not calculate or overwrite platform insets.
- Important mobile navigation, toolbar, menu, Settings, image-action, Bases, Canvas, and Graph
  controls receive a minimum 44×44 px target. The Toggle track itself remains native geometry; its
  surrounding Settings control supplies the larger hit region.
- Nested images use `max-inline-size: 100%`, automatic height, and `object-fit: contain`. No fixed
  image height, global `img` rule, pointer suppression, clipping, filter, or hover-only essential
  action is introduced.
- Wide Markdown and Bases tables scroll within their native component instead of widening the
  document. Cards reflow without page overflow. Bases card cover/contain remains the per-view native
  `imageFit` setting because 1.13.4 writes `background-size` inline; overriding it would require the
  forbidden `!important` and would conflict with document data.

### Style Settings contract

The default classes reproduce the reviewed theme exactly. The optional plugin parsed 48 settings
with no metadata errors in Style Settings 1.0.9. Choices that affect contrast select between bounded
semantic steps; users cannot enter arbitrary accent colors through this contract.

| Group         | Exposed controls                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Palette       | sky, cobalt, sakura, gray-violet, paper temperature, sidebar tint, light contrast, dark contrast                                   |
| Typography    | interface/body/monospace preset, 15–20 px body size, 1.5–1.9 line height, 620–920 px reading width, heading weight                 |
| Workspace     | compact/default/relaxed density, active-tab style, sidebar contrast, border strength, status visibility, watercolor wash           |
| Editor        | heading accent, link underline, unresolved-link emphasis, active line, code style, quote accent, Callout style, table density      |
| Images        | radius, border, shadow, 1–3 px selected outline, selected-outline strength, action-button surface, native Bases image-fit guidance |
| Accessibility | reduced motion, decorative-gradient removal, stronger focus, high contrast, stronger borders, 48 px controls                       |

The sky/sakura/violet choices change decorative washes, not required text. Cobalt choices use
prechecked functional steps. High-contrast mode strengthens muted text, icons, focus, and borders
without changing safety meanings. Decorative gradients can be removed independently, and no option
loads a remote resource or real watercolor texture.

### Operating-system accessibility

- `prefers-reduced-motion: reduce` removes theme transitions and pressed transforms; the Style
  Settings switch supplies the same result for users who cannot set an OS preference.
- `prefers-contrast: more` raises the focus ring to 3 px and strengthens muted text, icons, and
  borders. The manual high-contrast option is bounded to the same accessible token families.
- `forced-colors: active` removes decorative gradients, maps primary surfaces, text, fields,
  actions, links, selection, and focus to system colors, underlines links, outlines current items,
  preserves a structural Toggle track/thumb distinction, and keeps selected-image/callout edges.
- Focus never depends only on a color fill. Selected images keep a non-layout outline; active
  navigation keeps structure; Toggle state keeps thumb position and system-color contrast.
- CSS does not reorder DOM, replace labels, or hide native controls, so screen-reader order remains
  owned by Obsidian. CJK/system fallback stacks support OS font scaling without bundled fonts.

The forced-colors rules were exercised through Chromium DevTools media emulation on macOS; they
still require a real Windows High Contrast review. Real mobile virtual keyboards, gestures, and
hardware safe areas likewise remain device-review prerequisites rather than inferred support.

## Shape, depth, and typography

- Prefer subtle radii and keep native control geometry recognizable.
- Prefer a thin outline/border over a heavy shadow.
- Use an `outline` or equivalent overlay for selected images; do not shift layout.
- Use system font stacks with Chinese, Japanese, and English coverage.
- Do not bundle, Base64-encode, or remotely load fonts.
- Keep body text neutral and readable; color belongs mainly to interaction and structure.
- Use a generous line height and readable measure without copying the references' literal page
  composition.

## Motion

- Typical UI transitions should stay around 120–180 ms and move no more than 1–2 px when motion is
  necessary.
- Never animate image width or height.
- Never make an active control flash, collapse, or become unclickable.
- No decorative continuous animation.
- Under `prefers-reduced-motion: reduce`, remove nonessential transition and transform behavior; do
  not rely only on a Style Settings class.

## Original abstract graphic language

Phase 1 defines a future design vocabulary but does not generate final promotional art.

### Original cobalt feather — suitable with constraints

- Draw a new, simplified, slender asymmetric feather from geometric construction.
- Favor one tapered shaft and a few separated abstract barbs; keep enough negative space for it to
  read as a mark rather than an illustration.
- Use one cobalt family, optionally with a small sky highlight.
- Do not trace the reference feather's silhouette, barb rhythm, angle, damage, or composition.
- Use it at small scale as a signature mark, not as a page background or repeated icon texture.

### Two near-parallel curves — strongly suitable

- One curve uses sky blue and one uses sakura pink/gray-pink.
- Curves approach and separate, but do not perfectly overlap, braid, form a heart, or become a
  rainbow.
- Keep strokes light and the gap visible at normal cover size.
- The relationship should suggest two melodic lines without drawing a staff or notes.

### Pale watercolor circles or irregular fields — suitable in small number

- Use two or three original low-opacity shapes at most.
- Prefer flat translucent fills or small static gradients; no rasterized reference texture or
  runtime blur.
- Shapes should support the screenshot composition and remain visually subordinate.

### Cloud-white negative space — required

- Reserve roughly two-thirds of future promotional compositions for quiet background and actual UI
  breathing room.
- Empty space must frame the screenshot and abstract marks, not merely fill unused area.

### Tiny gold-orange point — suitable as a counterpoint

- Limit it to approximately 0.5–1% of the promotional composition.
- It may be a small dot or short accent stroke, not a copied flower.

### Future Community Theme cover

- The main subject should be a real screenshot of Aoi Tori running in Obsidian, captured by this
  project after implementation and manual testing.
- Surround it with the original feather, paired curves, minimal wash fields, and cloud-white space.
- Do not use the reference characters, official title, official artwork, logos, flowers, feather
  contour, or original compositions.
- Produce and inspect the final 512×288 marketplace image only in the release phase.

## Accessibility and compatibility

- Body text and essential controls target WCAG AA or better; the current configured pairs are
  recorded in `docs/contrast-pairs.json` and summarized in `docs/visual-analysis.md`.
- Focus remains visible in light/dark, keyboard/Vim, forced-colors, and image-selected states.
- Do not rely on color alone for error, warning, unresolved, active, or selected states.
- Prefer official variables and low-specificity selectors.
- `!important` and `:has()` remain disallowed unless a current DOM inspection documents a narrow
  exception and adjacent regression tests.
- Test pointer, keyboard, touch, pop-out, narrow, and current 1.13 image interactions before
  claiming support.

## Phase 2 preview observations

- Light mode reads first as warm paper surrounded by cool watercolor mist, with ink text and a small
  number of cobalt anchors. The clean summer-sky references set the upper chroma boundary but do not
  determine the workspace area ratio.
- Dark mode reads as navy ink and quiet blue depth. Its primary text is ice-white and its
  interaction blue is lighter than the daytime cobalt, without purple glow or black glass surfaces.
- H1 uses indigo, H2 uses cobalt, and lower headings return progressively toward ink. This is
  hierarchy within one voice, not a rainbow heading system.
- The sidebar is intentionally cooler than the reading surface; its visual strength and the H2
  cobalt level are explicit user-review targets rather than assumed final preferences.
- The actual 1.13.4 selected-image state now receives a non-layout-changing cobalt outline. Native
  inset selection, resize, action, and lightbox behavior remains present.
- Sakura is visible mainly in unresolved links, quote/callout details, and metadata washes. Gold is
  present in the diagnostic art and nonessential question/value details only, never required small
  text on paper.

## Originality rule

The final visual system must be derived from the reference-image relationships and this document,
not from recoloring an existing theme. Research themes may inform build discipline, token
architecture, and compatibility tests. Any exact code adaptation requires a new entry in
`docs/attribution.md` before use.
