# Design system

Status: Phase 2 core palette and Phase 2.5 visual refinement are preserved; Phase 3 desktop core
view semantic mappings and actual-client validation were completed on 2026-08-02. Phase 5B shifts
light panels toward glass-grey, raises default second-voice washes, and recedes night cobalt from
neon. Image evidence remains in `docs/visual-analysis.md`; this document is the token and UI-role
specification for the current review build.

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

They appear as quote washes, Properties lilac, and unresolved-link pink. They must not become a
rainbow heading system, a gender code, or competing primary actions. Meaning must remain
understandable without color.

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
| `--aoi-cloud-cool`      | `#F5F8F7` | Cool cloud-white raised surface                      |
| `--aoi-mist-blue`       | `#E4ECEB` | Glass-grey sidebar and quiet panel                   |
| `--aoi-cloud-shadow`    | `#D7E1E0` | Cloud shadow and stronger inactive surface           |
| `--aoi-ice-border`      | `#C3D2D2` | Ice-grey one-pixel boundary                          |
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

| Primitive                 | Value     | Visual purpose                        |
| ------------------------- | --------- | ------------------------------------- |
| `--aoi-night-canvas`      | `#191F26` | Deepest night canvas                  |
| `--aoi-night-surface`     | `#222A30` | Main night reading surface            |
| `--aoi-night-panel`       | `#2C343C` | Raised night panel                    |
| `--aoi-night-border`      | `#46535F` | Night boundary                        |
| `--aoi-night-left`        | `#1C272E` | Left night sidebar surface            |
| `--aoi-night-right`       | `#29282F` | Right night sidebar surface           |
| `--aoi-night-text`        | `#E5EBEB` | Ice-cloud primary text                |
| `--aoi-night-strong-text` | `#DAE8F4` | Strongest night text step             |
| `--aoi-night-muted`       | `#B8C4C8` | Secondary night text and icons        |
| `--aoi-night-faint`       | `#9DADB4` | Faint night structure                 |
| `--aoi-night-sky`         | `#7FC3E8` | Secondary night interaction           |
| `--aoi-night-cobalt`      | `#8AADD9` | Primary night link, action, and focus |
| `--aoi-night-sakura`      | `#DEA5C0` | Sparse night second voice             |
| `--aoi-night-violet`      | `#C2B1DA` | Night lilac bridge                    |

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
| Reading / raised / side surface | warm paper / cloud / glass mist                 | night surface / panel / canvas                  |
| Hover / selected fill           | quiet sky wash / glass shadow                   | panel mixed with sky/cobalt                     |
| Border / keyboard focus         | ice-grey border / focus blue                    | night border / night cobalt                     |
| Body / secondary / faint text   | ink indigo / ink muted / ink faint              | night text / night muted / night faint          |
| Link / current / primary action | link blue, then deep cobalt on hover            | night cobalt, then night sky on hover           |
| Unresolved link                 | muted dusty pink plus wavy sakura underline     | night sakura plus wavy violet underline         |
| Input and secondary control     | cloud field with ice/powder boundary            | night canvas with border/sky boundary           |
| Selection / highlight           | watercolor cyan mix / pale warm yellow          | cobalt mix / translucent night warning          |
| Code / quote / callout          | cloud code, sakura quote, preserved safety hues | canvas code, panel quote, preserved safety hues |
| Properties / table              | cloud card; icon and key share lilac            | canvas card; icon and key share panel           |
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
- Dark mode interaction blues stay lighter than source cobalt so links and focus remain visible on
  all three night surfaces. Night cobalt is `#8AADD9` (6.79:1 on the reading surface), steel rather
  than electric lavender.

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
- cloud-white raised areas and glass-grey secondary panels;
- deep violet-navy body text;
- cobalt links, focus, current state, and primary action;
- quiet sky hover/selection fills with an additional non-color cue;
- sakura/lilac second voice on quotes, Properties, and unresolved links;
- thin borders and little or no shadow.

The interface should feel high-key and calm without washing out control boundaries.

## Dark mode

Dark mode is a separate night register, not an inverted daytime palette. It is derived from the
film's only dark material — the violet-navy ink — rather than from the accent blue, and Phase 6
supersedes the earlier navy version recorded below it:

- near-neutral cool grey surfaces with a violet leaning (`#191F26` canvas, `#222A30` reading,
  `#2C343C` raised), so the plane and the interaction colour no longer share one hue;
- left and right sides keep their own temperature (`#1C272E` / `#29282F`);
- ice-white body text and readable muted text drawn from the film's glass-white family;
- cobalt and sky interactions stay the brightest elements on screen;
- softened sakura/lilac details;
- no neon glow, true-black default, glass blur, or automatic image filter.

Earlier description (historical, superseded by Phase 6): "a summer night with deep navy canvas,
slightly lighter reading surface, and blue-raised panels". The navy surfaces were withdrawn because
they reused the accent's hue as the plane.

## Phase 6 space and dark re-derivation

Implemented from `docs/aesthetic-audit-2026-09-11.md` §12. Light keeps paper, ink, link and focus
unchanged and gains a spatial relationship instead of a restyle.

### Light: two voices with a bridge

| Role                             | Light value | Purpose                                                  |
| -------------------------------- | ----------- | -------------------------------------------------------- |
| `--aoi-workspace-left-surface`   | `#EAF4F4`   | Left navigation. Watercolour cyan white.                 |
| `--aoi-workspace-bridge-surface` | `#F6F8F7`   | Central shell, status bar, sidebar-less windows.         |
| `--aoi-workspace-right-surface`  | `#F5EFF4`   | Right outline/backlinks. Blush glass white.              |
| Reading paper                    | `#FBFAF8`   | Unchanged. The Markdown core never carries the gradient. |

Each sidebar draws one static horizontal wash that fades inward: the left from
`--aoi-workspace-left-wash`, the right from `--aoi-workspace-right-wash`. Strength comes from the
existing `--aoi-sidebar-wash-strength` (Quiet/Balanced/Clear `2%/5%/7%`). The centre is not the
arithmetic mean of the two ends; both ends converge on near-white so the bridge stays a wide quiet
platform rather than a grey-violet band.

### Dark: derived, not inverted

Night surfaces move off navy and stop sharing the accent's hue with the reading plane:

| Token                 | Was       | Now       |
| --------------------- | --------- | --------- |
| `--aoi-night-canvas`  | `#111827` | `#191F26` |
| `--aoi-night-surface` | `#172338` | `#222A30` |
| `--aoi-night-panel`   | `#20344D` | `#2C343C` |
| `--aoi-night-border`  | `#36516C` | `#46535F` |
| `--aoi-night-text`    | `#EAF3F5` | `#E5EBEB` |
| `--aoi-night-muted`   | `#B3C5D4` | `#B8C4C8` |
| `--aoi-night-faint`   | `#92A7B8` | `#9DADB4` |
| `--aoi-night-left`    | —         | `#1C272E` |
| `--aoi-night-right`   | —         | `#29282F` |

`--aoi-night-cobalt` stays `#8AADD9` for this round so the effect of the surfaces can be judged
separately from the interaction blue. Dark quote wash has its own ladder (Whisper/Balanced/Present
`2%/4%/6%`) because the light 12% reads as a pink card on a neutral night face.

The dark active and selected navigation backgrounds are bounded by that decision. Navigation text
switches to `--aoi-night-cobalt` in those states, so every percent of cobalt mixed into the surface
raises the background luminance towards the text. At the original `78%`/`84%` mixes the pairs
measured `3.63:1` and `3.91:1` against the sidebar; both are now `92%` panel, which measures
`4.72:1` and `4.63:1`. The tint still separates active and selected rows from the hover surface, and
the active row keeps its `--font-semibold` weight, so the state is not carried by colour alone.
Light mode is unaffected: `--nav-item-color-active` there is `--aoi-cobalt-deep` on
`--aoi-cloud-shadow`, which measures `7.21:1`.

Dark is deliberately _not_ the light palette inverted, and it is also not the earlier "summer night"
navy. Navy was the wrong choice for a different reason than inversion: it reused the accent's hue as
the plane, leaving no chromatic separation between surface and interaction. This is recorded as an
original UI translation, not an official movie night palette.

### Settings migration

`Sidebar tint` gains `Duet` (recommended) as the new default. Cloud / Glass mist / Pale aqua keep
their earlier single-tint light meaning; they now also unify both sides to one cold surface and
return the bridge to neutral, so an old choice cannot combine an old base with a new blush edge.
Dark has no sidebar-tint class and therefore always uses the new night surfaces.

`Sidebar contrast` cannot be a colour ladder in light mode. The light sidebars sit close to the
4.5:1 floor already: the measured lightest nav text that still clears it on the worst background
(Aqua with the Clear 7% wash) is only 0.003 lightness away from the standard step, so the two are
indistinguishable. `Soft` therefore lowers the nav weight to `--font-light` (300) and stops
promoting headings to indigo, instead of lowering text contrast. `Strong` still darkens the text.
Every high-contrast path — the theme's High contrast switch, Light contrast = High,
`prefers-contrast: more` and forced colours — resets the weight to normal, so a user who asks for
more contrast never keeps the light weight. Obsidian consumes `--nav-item-weight` on
`.tree-item-self` and re-declares `--nav-item-weight-active` on the active row afterwards, so the
current file keeps its semibold cue.

### Layer note

Obsidian paints `--background-secondary` on `.workspace-tabs .workspace-leaf`, which sits above the
split. Sidebar `.workspace-leaf` and `.workspace-leaf-content` are therefore both cleared; the
central leaf remains opaque at `--background-primary` so long-form reading keeps a stable plane.

## Phase 5B glass-grey duet

A bounded atmosphere pass after Phase 5A. Paper, ink, and light-mode link/focus cobalt are
unchanged. Light mist/cloud/ice shift toward glass-grey; the selected-file sky mix drops from 17% to
10%. Default quote wash is 12% and Properties violet wash is 8%, with Style Settings Whisper/Present
still available. Night cobalt is `#8AADD9`. The Aqua sidebar option remains for a more cyan panel.
Sky, powder, and watercolor cyan stay as chroma ceiling, not default panel color. Property keys keep
the second voice on the icon and key together; values stay on the card surface.

## Phase 2.5 visual refinement

### Watercolor air without texture assets

- The light sidebar keeps its solid mist-blue semantic surface and adds one static cyan wash at 5%
  from a corner. It remains visibly cooler than the paper reading field.
- Properties keeps a solid cloud surface underneath two static 4% washes: gray violet from the upper
  left and cyan/mist from the lower right. The border and row dividers were also lightened.
- Quote keeps a solid cloud/night panel underneath one left-to-right sakura fade. Its 2 px sakura
  edge is structural; body text stays normal ink or normal night text.
- Light Callouts use a 5% semantic wash and dark Callouts 6%, with the Success/Warning/Failure
  family at 5% in dark. The type default is declared per Callout element, and the Quiet/Airy setting
  supplies an override that always wins, so the setting is not silently replaced by the type value
  on the element that carries it.
- The outer Callout owns the complete solid surface and semantic wash, through the dedicated
  `--aoi-callout-surface` role. Its content layer is transparent so the wash remains continuous
  behind the title and body instead of being masked by a nested white slab in light mode or a nested
  black slab in dark mode.
- Callouts declare `--callout-blend-mode: normal`. The native chain resolves to `darken` in light
  mode and `lighten` in dark, and `lighten` preserves the brighter channel of foreground and
  background: because the previous dark surface was darker than the body, the container disappeared
  into the page and only the wash edge survived, which is the defect the 2026-09-13 audit recorded
  as D01. Normal compositing is what lets a surface darker than the body exist at all.
- A dark Callout now separates from the body by about 1.15:1 of surface plus a 2 px semantic
  inline-start edge that measures 7.54:1 against the page, so the container is identified by the
  structure rather than by pushing the whole panel brighter. The panel was chosen over a lighter
  candidate because a brighter surface costs link contrast: a 7% wash on the next panel step drops
  cobalt to 4.41:1.

The paper reading surface, body text, primary cobalt interactions, semantic safety foregrounds, code
palette, and native control surfaces remain deliberately solid colors. Real watercolor textures were
rejected because they would turn the reference art into an interface asset, reduce text
predictability, and invite blur/filter work. The current gradients use no image, Base64, filter,
blur, backdrop filter, blend mode, or text-covering pseudo-element; each component stays at one or
two simple static layers.

### Declaration scope

Two classes of defect on 2026-09-13 came from where a value was declared rather than what it said.

Obsidian declares several of these variables on `body`, which is a type selector. A theme
declaration at `:root` therefore loses no matter how the stylesheets were ordered, because a closer
explicit value on an ancestor is not a specificity contest the descendant can win.
`Sidebar contrast` and the Callout geometry are declared on the mode classes, which are class
selectors and win outright: `--callout-border-width: 2px` and `--code-border-width: 1px` now
actually reach the editor, where `:root` had silently lost to the native `0px`.

The second class is an alias declared where its dependency does not exist. `:root` sits above the
mode block, so `--aoi-active-line-background: var(--background-modifier-hover)` found nothing to
resolve against, became invalid at computed-value time, and rendered as no value at all: the default
active line was transparent and the theme's own selected-image outline never appeared unless a
setting class supplied the colour. Aliases over native variables belong beside those variables in
the mode block.

Both are worth checking for whenever a declared value appears to have no effect. Neither produces a
warning; the declaration simply never arrives.

Diffing every `:root` declaration against the native `body` set showed how far the second class had
spread: 65 names clash, and 41 of them were rendering a different value from the one this repository
intends. The Callout and input shapes, the Properties card and settings row radii, `--radius-xl` and
the active navigation weight were all Obsidian's defaults, not the theme's. Thirteen geometry and
interaction values moved into the mode layer, where they now take effect and are asserted.

Two of the clashing typography names were moved after all, and not for taste reasons. Style Settings
has a variable slider for `--line-height-normal` and `--file-line-width` and writes it as an inline
custom property on `body`, where it outranks every selector in the stylesheet. Declared at `:root`
the theme value lost to the native `body` value, so the theme rendered 1.5 and 700px without the
plugin and 1.75 and 760px with it — two different reading surfaces for the same defaults. They now
sit in the mode layer and the two states agree. This is visible for no-plugin users: the reading
surface moves to the values the theme always intended and the plugin already delivered.

The remaining 27 clashing typography names were deliberately **not** moved. Heading families, sizes,
line heights and letter spacing, the three font stacks, `--line-height-normal`,
`--line-height-tight` and `--file-line-width` would all change the reading surface that the accepted
screenshots already show. They are listed in `PLANS.md` as their own decision, and the gate does not
assert them, so they cannot be changed by accident.

### Container hierarchy

Not every surface below the 3:1 non-text ratio is a defect. Decorative containers only need a
continuous fill and a readable structure, and this project's low bound for them is about 1.15:1
against the page. Two of them fell short in ways that destroyed hierarchy rather than merely looking
quiet.

The dark table header shared `--aoi-night-canvas` with the zebra rows, so a header cell and an
alternating row were literally the same colour: the table had no header. It takes the panel now,
which measures 1.154:1 against the page and 1.315:1 against the rows. The header grid had also been
a second, weaker mix of the same border role as the body grid, leaving the two within 1.53:1 and
1.44:1 of the page, so it takes the role directly and reads as the stronger line.

The highlight sat at 1.126:1 in dark and 1.060:1 in light. Both are now frozen washes over the
warning hue, measuring 1.358:1 and 1.181:1, precomputed as primitives because the static contrast
gate reads six-digit hex only.

Two things are deliberately **not** changed. Menu and modal backgrounds equal the page, which is not
an error: the native border and shadow carry the layer, and the audit asks only that the boundary
and overlay be confirmed. The Properties fill stays at canvas for the same reason its boundary
mattered more than its fill: canvas is already the deepest surface, so mixing it toward the panel
would move it toward the page rather than away. Its remedy is the outer boundary, which the
structural role already provides.

### Control shape roles

A button, a field and an icon are different objects and no longer share one corner. The roles are
declared once in `primitives.css` and mapped onto Obsidian's own interfaces:

| Role                          | Primitive                | Interface                 | Start |
| ----------------------------- | ------------------------ | ------------------------- | ----- |
| Text button, CTA, destructive | `--aoi-radius-button`    | `--button-radius`         | 10px  |
| Field, select, dropdown       | `--aoi-radius-field`     | `--input-radius`          | 8px   |
| Dense toolbar icon            | `--aoi-radius-icon`      | `--clickable-icon-radius` | 8px   |
| Grouped tool button           | `--aoi-radius-toolgroup` | Canvas group rule         | 12px  |

`--button-radius` and `--clickable-icon-radius` are declared on `body`, not in the mode layer.
Native declares both on `body` and then rebinds the icon one on `.is-mobile` to the 44px touch size.
A mode-layer declaration is a class selector and would outrank `.is-mobile`, so a phone would keep
the desktop corner and the platform's touch geometry would never arrive. Declared on `body`, the
platform still wins where it has an opinion and the theme supplies the rest.

A field and a button do not share a lift. A field is bounded by its border, which already carries
the 3:1 control floor, so it carries no outer shadow and signals hover through its fill and border;
a button keeps a light resting shadow and lifts on hover, because it is a discrete action. Overlays
keep their own layer shadow. Native consumes `--input-shadow` for surfaces the theme does not own -
selects, combobox buttons, the Canvas group - so the roles are separate tokens and `--input-shadow`
points at the control role, which is the value it already held.

An icon control renders identically whether a plugin builds it from a `div` or a `button`: the
text-button surface, border and shadow are excluded with `:where(:not(.clickable-icon))`, which
leaves the element selector's specificity alone. The field hover rule lists the same input types as
its own base rule, so a checkbox, radio, range or colour input is never repainted by a hover it was
never styled for.

A Canvas tool group is rounded on the group and clipped, so its items keep square edges; the square
seam is the group's structure, not a missing corner.

`--input-radius` stays in the mode layer on purpose: fields keep 8px in every mode, because a field
is a writing container and the audit keeps its shape fixed. The icon corner is different - it is a
touch affordance, so it belongs to the platform.

### Air and optical weight

A dimmed layer is not a quiet colour. The Quiet status bar used `opacity: 0.72`, which composites
the text and the icons together, so the result depends on whatever sits behind the layer and cannot
be reasoned about from the stylesheet. Measured, light mode came out at 2.95:1 - under the floor -
while dark mode passed. The setting now selects a quieter semantic foreground, which puts the
contrast back in the colour where it can be checked: 4.52:1 light and 6.29:1 dark against 5.22 and
8.16 for the normal state.

The original Callout icons draw at a 1.25 stroke where Obsidian's own draw at 1.8. That is an
optical question - whether a path is too dense or a hairline disappears - and it is reviewed at 100
/ 125 / 200% and across pixel densities rather than answered by bolding every path.

### Writing direction

The quote and Callout accents sit on the inline-start edge, so the two inline-start corners stay
square and the two inline-end corners round. Expressing that with the four logical corner properties
instead of `0 r r 0` means the corners follow the accent when the writing direction changes; written
physically, the accent moved under RTL while the square edges stayed on the old side.

The wash gradient needs the same treatment, and CSS has no logical gradient direction. The direction
lives in `--aoi-wash-direction`, which `.mod-rtl` reverses, so the wash always travels from the
accent edge outward.

### Density and touch geometry

Density moves one token, `--input-height`: 32px compact, 34px default, 38px relaxed. Obsidian's own
controls and the theme's fields and buttons read it, so a toolbar row keeps one height across the
three settings. Measured with the native stylesheet present: 34 / 32 / 38px for the field and the
button.

A text-and-icon button needs an explicit role, because native styles `.text-icon-button` without a
height and lets the element decide what that means. As a `button` it inherited the button box and
tracked the density; as a `div` it was content-height and stayed at 26px at every level, so the two
forms of the same control would not line up in one row. It now carries
`min-block-size: var(--input-height)` for both forms, which is measured at 34 / 32 / 38px either
way.

A bare `.clickable-icon` is deliberately **not** given a height or an `aspect-ratio`. Its box is
whatever the glyph and the surrounding row make it, and native uses the class for tab close buttons,
menu items and view actions whose geometry the theme does not own; forcing a size on it would move
controls the theme has never seen. What is designed instead is the platform: on a phone the themed
touch containers - view actions, the navbar action, the toolbar option - hold the 44px project
target in both axes.

### Contrast and border settings

Four settings touch accessibility, and the audit asks for their responsibilities to be written down
so a name matches what it does. They are not interchangeable:

| Setting                           | Text and icons | Structural borders | Control outlines | Focus and selection |
| --------------------------------- | -------------- | ------------------ | ---------------- | ------------------- |
| High contrast (toggle)            | yes            | no                 | no               | unchanged           |
| Light/Dark contrast = High        | yes            | yes                | yes              | unchanged           |
| `prefers-contrast: more`          | yes            | yes                | yes              | 3 px ring           |
| Border strength, Stronger borders | no             | yes                | yes              | unchanged           |

The toggle is deliberately narrower than its name suggests, and its description now says so: it
strengthens secondary text, icons and navigation labels, and leaves borders to the two border
settings. A reader who wants everything stronger should use Light/Dark contrast, which also carries
the border roles.

What every path shares is a floor rather than a ceiling: no border setting takes a control outline
below the 3:1 non-text minimum, `Soft` quiets only the decorative dividers, and none of the four
weakens a focus or selection colour.

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

### Border roles

Components consumed the `--aoi-ice-border` / `--aoi-night-border` primitives directly, so the Border
strength, Stronger borders and High contrast settings only moved `--background-modifier-border` and
reached almost nothing: inputs, Properties, code, tags, checkboxes, menus, modals and the table
header all kept the same outline at every level. Two roles now sit between the primitives and the
components, so a setting scales the whole set at once.

`--aoi-border-structural` is a decorative divider: tables, cards, code, tags, menus, modals and
Properties. It stays quiet by default and steps up only when asked, which keeps dense grids light.

`--aoi-border-control` outlines a shape that is the only thing identifying a control — an input
whose fill is 1.14:1 against the page, and an unchecked checkbox. It therefore starts at the 3:1
non-text minimum against the lightest surface it can sit on, rather than below it, and no level
lowers it again. Measured in dark: 4.24:1 for the input, 3.72:1 for the checkbox. `Soft` quiets the
dividers and deliberately leaves this role alone, because 1.4:1 would leave the shape unreadable.

Focus and selection edges are a third role and keep their own functional colour; no border setting
weakens them. Semantic edges — error, warning, success, Callout types — are untouched, so a safety
meaning is never remapped to blue-grey.

In dark, one table variable took longer to find: `--table-header-border-color` is declared
separately from `--table-border-color`, and it still pointed at the primitive, so the header grid
ignored every setting while the body grid responded.

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

## Release-candidate semantic polish

The pre-RC Markdown polish keeps the approved light palette intact and treats Markdown syntax as
document semantics, not a color showcase. Aoi Tori now uses four stable semantic color families:

- **ink indigo and deep cobalt:** structure, strong emphasis, links, focus, and action;
- **gray violet and sakura:** second voice, aside-like emphasis, deleted text lines, and unresolved
  softness;
- **warm gold:** highlight and brief attention, never essential small text on paper;
- **mist blue and watercolor cyan:** technical or auxiliary surfaces, tags, rules, and quiet fields.

### Destructive buttons

The screenshot failure came from a destructive confirmation button that combined Obsidian's CTA and
danger states. Obsidian 1.13.4 defines `button.mod-destructive.mod-cta` with
`--text-color: var(--text-on-accent)` on `--background-modifier-error`; because Aoi Tori's error
modifier is a soft watercolor pink-red surface, the result was white text on a pale error
background. The theme now sets both `--text-color` and `color` for destructive buttons so Obsidian's
button base rule and the theme rule agree.

Two destructive levels are used:

- Secondary destructive actions use a soft error surface with deep error text and a low-strength
  error border.
- Primary destructive confirmations use an accessible solid error background with warm/ice text and
  an error border. The cobalt focus ring remains outside the error border and does not replace the
  danger cue.

Pink stays distinct from error red: sakura remains a second-voice/decorative color, while
`--aoi-error` and `--aoi-night-error*` carry destructive semantics.

### Markdown emphasis

- Bold uses `--bold-color` and `--bold-weight`, with `--aoi-strong-weight: 640`. It is deep indigo
  in light mode and a quiet night-text/cobalt step in dark mode, with weight doing most of the work.
  It deliberately avoids bright sky blue because bold is too frequent for a high-chroma interaction
  color.
- Italic uses `--italic-color`, leaning toward gray violet because it represents the second voice.
  It does not use sakura by default; sakura is too decorative and would make long italic text feel
  sentimental and harder to read.
- Bold italic combines stronger weight with the same gray-violet bridge rather than introducing a
  third saturated color.
- Strikethrough reduces text toward muted and uses sakura/night-sakura for the line only. It does
  not use error red because deletion markup is an editorial state, not a destructive operation.
- Highlight uses a warm-yellow watercolor surface with normal ink or night text. It avoids orange
  text and avoids a fluorescent dark-mode marker.

### Tags, tasks, footnotes, KBD, and HR

Tags use the official `--tag-*` variables: cloud/mist surfaces, cobalt text, ice borders, and a
separate focus outline. Completed task text uses muted body color with a violet/sakura line instead
of green. Footnotes use gray violet and return to cobalt on hover/focus. Markdown `<kbd>` uses the
same mist/field surface language as inputs. Horizontal rules are one-pixel watercolor lines with a
cyan body and a restrained sakura center point, with night mode using night border/cobalt/violet
relationships.

The current implementation uses official variables where Obsidian exposes them (`--bold-color`,
`--bold-weight`, `--bold-modifier`, `--italic-color`, `--text-highlight-bg`, `--tag-*`, `--hr-*`,
and `--checklist-done-*`). Low-specificity Markdown-scoped selectors cover missing details such as
CodeMirror quote/callout strong color, strikethrough line color, bold-italic color, footnote focus,
`<kbd>`, and the gradient horizontal rule. Source/Live Preview Markdown formatting tokens stay
visible in faint gray-blue and do not inherit emphasis weight. No global `strong`, `em`, `del`, or
`mark` selector is introduced.

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

### Phase 5A release-candidate presentation assets

The first release-candidate presentation assets are:

- `assets/screenshots/light.png`
- `assets/screenshots/dark.png`
- `assets/screenshots/mobile.png`
- `assets/cover.svg`
- `assets/cover.png`

The three screenshots are cropped or resized from this repository's own Aoi Tori Obsidian review
screenshots. The cover is an original SVG composition using a large light-mode UI screenshot, small
dark/mobile UI fragments, two near-parallel sky/sakura curves, low-opacity wash fields, one tiny
gold-orange point, and a simplified geometric cobalt feather. It uses no text, no embedded font, no
remote image, no Base64 asset, no reference artwork, and no copied title/flower/feather contour.

The 512×288 `assets/cover.png` is the Community Theme cover candidate for user review. It is a
repository presentation asset and must not be imported into `src/` or packaged into the installed
theme directory.

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

## Callout icon family — 2026-09-14

The accepted original icon study is integrated: falling feather (`aoi-tori`), light/ink
alternatives, flute/oboe, trumpet, rotary tuba/piston euphonium, duet and six quiet everyday motifs.
New types use an `aoi-` namespace; historical `second-voice` and preview instrument aliases remain
supported. `aoi-music` retains the conventional note icon. See `docs/CALLOUTS.md` for the complete
contract.

All Callout icons default to 22 px in 28 px circular badges with a 10% semantic-color wash. Original
marks use 1.25 grid-unit strokes; native functional icons retain 1.8. The title gap is 10 px and
container padding 18 px by 20 px, with square start corners, rounded end corners and no shadow,
matching the accepted preview's geometry. Colors, opaque surfaces and Quiet/Balanced/Airy strength
behavior remain semantic and retain the dark-surface repair. Obsidian typography remains native.

Artistic type labels are optional content aids, not decorative staff lines or replacements for
safety symbols. The earlier native-icon-first policy is expanded only for these user-requested
Callouts; fold chevrons and other application controls remain native.
