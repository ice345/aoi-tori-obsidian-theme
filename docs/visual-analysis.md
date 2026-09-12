# Visual analysis

Status: Phase 1 image analysis complete and Phase 2 palette implemented on 2026-08-02. Phase 5B
updates the implemented mist/cloud/ice and night-cobalt steps toward glass-grey panels and steel
night interaction. Phase 6 adds the left/bridge/right spatial relationship and an independently
derived dark palette; its official-site evidence and reference-to-UI translation are recorded below.
This file preserves the visual evidence; `docs/DESIGN.md` is the final UI-role specification for the
current review build.

## Phase 6 official-site and reference evidence

Measured 2026-09-11/12. These are readings taken from the live site and from the local reference
files; they are **UI design values**, not claimed official colour specifications.

### Official site backgrounds (live computed styles)

| Section             | Live value                                            |
| ------------------- | ----------------------------------------------------- |
| `.introductionWrap` | `linear-gradient(to right, #D3F4F8 0%, #FFEBF9 100%)` |
| `.ticketWrap`       | `linear-gradient(to right, #E6EFFF 0%, #FFE3E3 100%)` |
| `.goodsWrap`        | `linear-gradient(to right, #FFF0F0 0%, #D1FCFF 100%)` |
| `body`              | `background: #fff`                                    |

The three gradients share one structure: lightness stays nearly fixed (L 0.94–0.97), chroma stays
low (C 0.016–0.044), and only hue travels — by 131°, 116° and 176° respectively. The site therefore
carries its two voices as hue motion inside one band, on a plain white ground, rather than as two
adjacent coloured panels. The site's own pink family sits at H 336–359°, which is close to the
theme's existing `--aoi-sakura-pale` (H 358.0°) and `--aoi-sakura` (H 350.9°).

### Reference-image measurement

Hue and chroma were measured per image in OKLCH. Family proportions are shares of the total pixel
count; the warm/cool split is by hue, not by image grouping.

| Reference              | Glass white | Rose white | Violet-white | Deep ink |
| ---------------------- | ----------- | ---------- | ------------ | -------- |
| `8a0e7011…png`         | 95.0%       | 0.0%       | 0.2%         | 0.2%     |
| `5ecd7474…jpg`         | 83.9%       | 0.0%       | 0.6%         | 0.3%     |
| `155e3f22…png`         | 34.7%       | 2.1%       | 3.0%         | 0.0%     |
| `c5b00c9e…png`         | 0.0%        | 85.4%      | 12.9%        | 0.4%     |
| `file_0000…jpg`        | 0.3%        | 55.5%      | 28.1%        | 0.3%     |
| `Liz To Aoi Tori.jpeg` | 16.0%       | 0.5%       | 53.4%        | 5.2%     |

Area-weighted across the six watercolour references: glass white H 194.7° (25.6% of pixels), rose
white H 18.6° (17.0%), violet-white H 297.2° (8.4%), deep ink H 292.4° (1.2%). The violet axis is
consistent between the near-white and the deep ink, which is why the dark palette derives its depth
from that family. The deep-ink figure is thin — it rests almost entirely on the key visual — while
the violet axis is independently supported by the 8.4% violet-white share.

Critically, **no single reference image mixes a large glass-white area with a large rose-white
area**; each is dominated by one family. The theme's earlier attempt to use a blush reading field
beside a cyan panel combined two different compositions and was withdrawn. Phase 6 instead keeps a
near-white paper core and moves the two voices to the sidebars.

Chroma medians of the coloured pixels: blue family C 0.0194 (H 201°), pink family C 0.0157 (H ~6°).
Phase 6's sidebar endpoints (`#EAF4F4`, `#F5EFF4`) sit at C 0.0106 and 0.0092 — deliberately below
those medians because the sidebars also carry dense small text and icons.

## Method and evidence limits

All eight files in `references/raw/` were opened at original resolution and inspected individually.
A local contact sheet and semantic crops were then used to compare cloud white, sky gradients,
clothing, ink outlines, feather blue, the two rings, sakura washes, gold-orange flowers, the cyan
bird, and water highlights.

Twelve-color quantization was used only as supporting evidence for approximate area ratios. It
cannot identify narrative importance: a tiny feather, ring, title, or flower may carry more UI
meaning than a large pale background. Compression, painted transparency, neighboring colors, and
display calibration also make sampled values unsuitable as final tokens without visual and contrast
review.

The files appear to include alternate crops or orientations of the same visual families. Those
variants confirm behavior in wide and narrow compositions, but they are not counted as independent
votes for palette frequency.

## Priority hierarchy

Phase 2 confirms two authority tiers. Watercolor and work-related imagery owns the theme identity;
the cleaner, more saturated summer-sky pair supplies transparency and a chroma ceiling only.
Alternate portrait crops remain lower-weight variants inside their family's tier rather than a third
visual direction.

| File                                        | Dimensions | Tier | Identity role                                                                                              |
| ------------------------------------------- | ---------: | ---- | ---------------------------------------------------------------------------------------------------------- |
| `blue-sky-herizontal.png`                   |   1672×941 | B    | Wide summer-sky clarity, cloud separation, and saturation ceiling; not the default UI area ratio           |
| `blue-sky.jpg`                              |   864×1536 | B    | Narrow confirmation of the same high-chroma ceiling and clear blue/white separation                        |
| `8a0e7011-7e5f-4d31-b278-c09025bb3d56.png`  |   1672×941 | A    | Main pale watercolor, two-person spacing, cool white, and cyan wash identity                               |
| `155e3f22-d9ac-420b-ac16-5650cd3d8541.png`  |   1672×941 | A    | Watercolor bridge between sky, white cloud, blue bird, pink title, and a denser flower field               |
| `c5b00c9e-0a20-43d1-bd7a-079df384a48f.png`  |   1672×941 | A    | Main pink-blue paper wash, flowers, feather, cyan bird, and deep-ink outline identity                      |
| `Liz To Aoi Tori.jpeg`                      |  2940×1968 | A    | Close-up identity evidence for deep ink, powder-blue clothing, cobalt feather, dual rings, and gold orange |
| `5ecd7474-9e26-4342-908f-238e12393fd9.jpg`  |   864×1536 | A*   | Lower-weight portrait validation of the pale two-person watercolor family                                  |
| `file_00000000e4147230b67d65ec38d6ea5e.jpg` |   864×1536 | A*   | Lower-weight portrait validation of the pink-blue watercolor and cyan-bird family                          |

`A*` means “Tier A family, lower independent evidential weight,” not “safe to redistribute.” None of
the reference artwork, characters, titles, or traced motifs may become theme or promotional assets.

## Per-image findings

### `blue-sky-herizontal.png`

- **Description:** a wide, high-key blue sky occupies most of the frame. White clouds enter from
  both sides, a pale reflective water band rests at the bottom, small deep-cobalt birds/figures and
  feathers provide anchors, and a pink title supplies a very small warm counter-voice.
- **Color hierarchy:** clear sky blue is dominant; cloud white, ice blue, and water highlight are
  supporting; cobalt is the structural dark; pink/purple is an accent; almost-white cloud edges are
  the highlight.
- **Distribution:** quantization suggests roughly 55% medium sky blues, 40% cloud/water lights, 4%
  stronger blue, and less than 1% title and very dark detail.
- **Hue/chroma/value:** the sky is a fairly clean neutral-to-slightly-cyan blue, more saturated than
  the watercolor images. The image stays high in lightness despite that chroma. Cobalt shapes are
  blue rather than black.
- **UI lesson:** use its clear blue/white separation for interaction hierarchy, not its literal 55%
  blue area. A document UI with that much medium blue would become oppressive.

### `blue-sky.jpg`

- **Description:** the vertical companion concentrates the same cloud frame, blue field, cobalt
  silhouettes and feathers, pink title, and pale water into a narrow composition.
- **Color hierarchy:** sky blue remains dominant; clouds and water provide ice-white relief; cobalt
  establishes focus; pink is a small title accent.
- **Distribution:** approximately 65% sky blues, 30% pale cloud/water, 3% cobalt, and about 1% pink
  or other small accents.
- **Difference from the wide image:** the narrow crop feels more saturated because less lateral
  white space is visible. It validates keeping blue interaction states distinct on mobile while
  retaining large pale reading areas.
- **UI lesson:** narrow layouts need stronger spacing and surface separation, not darker or more
  saturated panels.

### `8a0e7011-7e5f-4d31-b278-c09025bb3d56.png`

- **Description:** two lightly rendered figures sit in a broad field of cool white and pale cyan
  watercolor. Their relationship and surrounding empty space are more important than literal
  character detail.
- **Color hierarchy:** mist-white and pale aqua dominate; powder and denim blues support; localized
  navy/cobalt hair, clothing, and line work anchor the composition.
- **Distribution:** the coarse palette is about 88% very pale cool white, 9% pale cyan, and under 3%
  combined medium/dark detail.
- **Edges and transparency:** blooms have feathered, uneven boundaries and visible density changes;
  hard ink marks appear only where structure is needed.
- **UI lesson:** this is the strongest evidence for a mostly white interface with a small number of
  decisive dark anchors. Empty space is an active identity element.

### `155e3f22-d9ac-420b-ac16-5650cd3d8541.png`

- **Description:** a denser watercolor landscape combines pale sky, cloud/birch whites, two figures,
  a small blue bird, pink title, and a flower field with green, yellow, and lilac notes.
- **Color hierarchy:** pale sky/cool white remain dominant; watery green and yellow form a broad
  supporting field; blue and pink identify the subject/title; small ink lines add structure.
- **Distribution:** a coarse reading gives roughly 65–70% pale cyan/white, 20–25% green-yellow
  field, and under 10% blue, pink, gray, and figure detail.
- **Warm/cool relation:** it proves that restrained warmth can live inside the cool identity, but
  the botanical green/yellow density is specific to this scene.
- **UI lesson:** borrow the alternation of open and dense passages and the tiny warm notes. Do not
  turn the default theme into a green garden palette or reproduce its title/flower composition.

### `c5b00c9e-0a20-43d1-bd7a-079df384a48f.png`

- **Description:** a warm pink-paper watercolor field contains two figures, blue flowers and
  feathers, a cyan bird, and dark ink outlines. Blue marks cross the blush ground without becoming a
  rainbow.
- **Color hierarchy:** warm paper/blush white dominates; ice and powder blues support; deep
  purple-charcoal ink anchors; cyan bird and feather blue are accents; pink and lilac connect the
  two voices.
- **Distribution:** about 79% pale blush paper, 8–10% pale blue, 7–9% gray/ink, and only a few
  percent chromatic bird, feather, flower, and title detail.
- **Pink direction:** predominantly sakura/gray-pink rather than candy pink. Purple enters through
  shadow and line work, not a large lavender surface.
- **UI lesson:** this is the strongest evidence for a warm paper option inside an otherwise cool
  system and for a restrained sakura secondary voice.

### `Liz To Aoi Tori.jpeg`

- **Description:** a close-up with large paper-white negative space, deep ink hair and contours,
  powder-blue clothes, a saturated cobalt-to-blue-violet feather, pale blue/pink dual rings, and a
  few gold-orange flowers.
- **Color hierarchy:** paper white is dominant; purple-charcoal/deep navy is the strongest shadow;
  powder blue is the main midtone; feather cobalt is the high-chroma cool accent; rings are a soft
  blue/pink dialogue; gold orange is the smallest warm counterpoint.
- **Distribution:** quantization gives about 62% paper white, roughly 18% combined deep hair/ink,
  about 10% powder blues, 4–6% feather/ring blues, and well under 1% gold-orange detail.
- **Near-view findings:** the deepest color is not neutral black but a violet-navy charcoal. The
  powder-blue clothing is much softer than the sky photos. The feather shifts more violet than the
  watercolor cyan. The gold flower has orange-brown shadows and yellow highlights.
- **UI lesson:** this image supplies the missing text/code/dark-mode anchor. Gold is too scarce and
  too bright to become the main accent or warning color; it is a tiny decorative counterpoint.

### `5ecd7474-9e26-4342-908f-238e12393fd9.jpg`

- **Description:** a narrow version of the pale two-person watercolor, with a large quiet field of
  cool white and a concentrated cyan wash around the figures.
- **Distribution:** roughly 87% mist-white, 8% pale cyan, and under 5% combined figure and ink
  detail.
- **UI lesson:** confirms that the identity survives in narrow layouts when whitespace remains
  dominant. It does not introduce a separate color direction from the wide source.

### `file_00000000e4147230b67d65ec38d6ea5e.jpg`

- **Description:** a vertical crop of the pink-blue watercolor family. Warm paper white dominates;
  the cyan bird, blue feather, flowers, and deep outlines sit mainly in the lower/side regions.
- **Distribution:** about 79% pale blush/paper, 6% pale blue, 5% gray, with the remaining area split
  among ink and small chromatic marks.
- **UI lesson:** confirms that the second voice should remain sparse and that decorative color can
  collect near edges without coloring the entire reading surface.

## Cross-image synthesis

### Validation of the initial hypotheses

| Hypothesis                                                                         | Result                             | Refinement                                                                                                                                       |
| ---------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cloud white, warm paper white, and mist-blue white form the main background family | Confirmed                          | Reading surfaces should be warm-neutral; secondary panels may be cooler. A single blue-white everywhere would lose the paper/watercolor balance. |
| Pale cyan and ice blue suit panels and selections                                  | Confirmed                          | Keep them very light and pair selection with outline/icon/state changes so color is not the only cue.                                            |
| Clear sky and powder blue carry atmosphere                                         | Confirmed                          | They are two different blues: clear sky is cleaner and more chromatic; powder blue is softer and grayer.                                         |
| Deep cobalt carries links, active state, and focus                                 | Confirmed with adjustment          | Original feather/bird blues need a darker light-mode step for WCAG contrast; dark mode needs a lighter cobalt step.                              |
| Deep ink indigo carries text, outlines, code, and dark mode                        | Strongly confirmed by the close-up | Prefer violet-navy charcoal over pure black; do not tint all body text blue.                                                                     |
| Sakura and gray-purple are a second voice                                          | Confirmed                          | Sakura is the main warm second voice; lilac is a tertiary bridge/shadow. Both stay sparse.                                                       |
| Gold orange can be a warm counterpoint                                             | Confirmed only as a micro-accent   | Its whole-image area is below 1%. Preserve Obsidian warning semantics rather than replacing warning amber with this decorative gold.             |

### Hue, value, and chroma

- **Hue:** watercolor blues lean cyan/gray; sky images use clearer neutral-to-cyan blue; the feather
  introduces blue-violet cobalt; deep ink leans violet-navy. Pink is mainly sakura/gray-pink, while
  a small amount of pink-purple appears in titles and rings. Gold-orange is isolated.
- **Lightness:** most primary references are high-key. Depending on the family, 65–90% of the area
  lies in white, paper, cloud, ice, or pale wash values. Medium sky can dominate an illustration but
  should not dominate an application shell. Dark anchors are usually under 10%, except in the
  close-up where they intentionally provide stronger structure.
- **Chroma:** most of the painted area is low-to-medium chroma. High chroma belongs to the sky,
  feather, small bird/title details, and the gold flower. Their semantic importance is high but
  their area is low.
- **Temperature:** the identity is neither cold monochrome nor warm stationery. Cool cloud/sky
  fields are balanced by paper/blush whites, then stabilized by deep violet-navy ink.

### Recommended UI area target

The illustration ratios must be translated, not copied literally:

```text
Paper, cloud, and open neutral space: 65–75%
Mist, ice, and pale aqua surfaces:     15–25%
Sky, cobalt, and ink structure:         5–8%
Sakura and lilac second voice:          2–4%
Gold-orange warm point:                 0–1%
```

### Watercolor behavior without image assets

The common watercolor language is translucent layering, irregular density, soft blooming edges, and
large untouched paper areas interrupted by a few hard ink anchors. In UI this should become:

- close lightness steps rather than many unrelated hues;
- translucent hover/selection fills over stable solid surfaces;
- at most small, low-cost gradients in decorative areas;
- thin outlines and clear type where structure is required;
- no real watercolor background image, blur filter, or large `backdrop-filter` surface.

## Initial anchors

This is the only section that records the supplied/reference HEX anchors from the initial source
tokens. They are historical inputs, not the recommendation below.

- Cloud: `#fcfcfd`, `#f5f9fc`, `#e7eff5`, `#d1e3f3`, `#c2def3`
- Sky: `#a9d3f1`, `#95c9ef`, `#83beea`, `#75b3e6`, `#67a8e2`, `#569add`
- Bird/cobalt: `#297fc5`, `#174f91`, `#0d4fae`, `#123f7d`, `#183a5a`
- Sakura: `#f8e8f0`, `#e4a8c7`, `#8d4f75`
- Lilac: `#eee8f4`, `#c1add0`, `#69547c`
- Ink: `#617b91`, `#456276`, `#294a63`, `#183a5a`
- Night: `#0d1726`, `#12243a`, `#18334f`, `#eaf6ff`, `#a8c5dd`, `#6bc4f2`, `#7ca8ff`, `#e5a6c6`,
  `#c5b5ec`
- Safety anchors: `#b4232f`, `#8a5a00`, `#1f6f50`

## Implemented Phase 2 primitive evidence map

These values were chosen after the image review and adjusted for semantic contrast. They are not
direct pixel picks. Final complete names, safety colors, and UI roles are specified in
`docs/DESIGN.md`.

| Candidate                | Value     | Evidence and intended role                                       |
| ------------------------ | --------- | ---------------------------------------------------------------- |
| `--aoi-paper-warm`       | `#FBFAF8` | Warm-neutral paper balance; primary light reading surface        |
| `--aoi-cloud-cool`       | `#F5F8F7` | Cool cloud highlight; raised/alternate surface                   |
| `--aoi-mist-blue`        | `#E4ECEB` | Low-chroma glass-grey panel and hover family                     |
| `--aoi-cloud-shadow`     | `#D7E1E0` | Stronger inactive/panel separation                               |
| `--aoi-ice-border`       | `#C3D2D2` | Thin ice-grey boundaries                                         |
| `--aoi-watercolor-cyan`  | `#B8DEE8` | Watercolor wash; decorative/information surface only             |
| `--aoi-sky-blue`         | `#83BEE7` | Atmospheric sky; non-text mixed fill                             |
| `--aoi-sky-deep`         | `#65A8DE` | Clear sky bridge; native decorative blue                         |
| `--aoi-link-blue`        | `#1D5FAE` | Accessible light-mode links, actions, and current state          |
| `--aoi-cobalt-deep`      | `#174678` | Pressed state and deep blue structural accent                    |
| `--aoi-ink-muted`        | `#586C7D` | Accessible muted text on paper                                   |
| `--aoi-ink-strong`       | `#3E4B5C` | Secondary strong text, code punctuation, and outlines            |
| `--aoi-ink-indigo`       | `#292B3B` | Violet-navy body text and deepest light-mode anchor              |
| `--aoi-sakura-pale`      | `#F7E9ED` | Liz/quote/card wash                                              |
| `--aoi-sakura`           | `#DCA3BC` | Decorative second voice and dual-curve graphic                   |
| `--aoi-dusty-pink`       | `#87506F` | Text-capable secondary accent                                    |
| `--aoi-gray-violet-pale` | `#F0EAF5` | Tertiary wash                                                    |
| `--aoi-gray-violet-deep` | `#66537D` | Text-capable gray-violet accent                                  |
| `--aoi-gold-orange`      | `#E5A12A` | Tiny decorative warm point only                                  |
| `--aoi-gold-deep`        | `#95550E` | Text-capable warm variant for the limited roles that require it  |
| `--aoi-night-canvas`     | `#191F26` | Deepest night surface (Phase 6; was `#111827`)                   |
| `--aoi-night-surface`    | `#222A30` | Primary dark-mode reading surface (Phase 6; was `#172338`)       |
| `--aoi-night-panel`      | `#2C343C` | Raised dark panel (Phase 6; was `#20344D`)                       |
| `--aoi-night-border`     | `#46535F` | Night boundary (Phase 6; was `#36516C`)                          |
| `--aoi-night-left`       | `#1C272E` | Left night surface (Phase 6)                                     |
| `--aoi-night-right`      | `#29282F` | Right night surface (Phase 6)                                    |
| `--aoi-night-text`       | `#E5EBEB` | Main dark-mode text (Phase 6; was `#EAF3F5`)                     |
| `--aoi-night-muted`      | `#B8C4C8` | Muted dark-mode text (Phase 6; was `#B3C5D4`)                    |
| `--aoi-night-sky`        | `#7FC3E8` | Dark-mode sky interaction                                        |
| `--aoi-night-cobalt`     | `#8AADD9` | Dark-mode focus/link/current state (retained in Phase 6 round 1) |
| `--aoi-night-sakura`     | `#DEA5C0` | Dark-mode second voice                                           |
| `--aoi-night-violet`     | `#C2B1DA` | Dark-mode tertiary voice                                         |

Phase 6 replaced the navy night surfaces because they reused the accent's hue as the plane. The
light rows above remain Phase 2 evidence and are unchanged; `docs/DESIGN.md` holds the current
authoritative table.

## Contrast evidence

WCAG relative-luminance calculations for the planned text/focus pairs:

| Foreground / background  |   Ratio | Intended use                                  |
| ------------------------ | ------: | --------------------------------------------- |
| Ink 950 / Paper 0        | 13.39:1 | Body text                                     |
| Ink 800 / Paper 0        |  8.51:1 | Strong secondary text/code                    |
| Ink 650 / Paper 0        |  5.22:1 | Muted text                                    |
| Cobalt 700 / Paper 0     |  6.10:1 | Link, primary action, focus                   |
| Cobalt 700 / Mist 100    |  5.30:1 | Interaction on tinted panels                  |
| Sakura 700 / Paper 0     |  5.91:1 | Limited text accent                           |
| Lilac 700 / Paper 0      |  6.50:1 | Limited text accent                           |
| Gold 700 / Paper 0       |  5.62:1 | Functional warm text, only if needed          |
| Gold 400 / Paper 0       |  2.13:1 | Decorative only; never essential text/control |
| Night text / Night 950   | 15.74:1 | Dark body text                                |
| Night muted / Night 900  |  8.89:1 | Dark muted text                               |
| Night sky / Night 900    |  8.15:1 | Dark secondary interaction                    |
| Night cobalt / Night 900 |  6.79:1 | Dark link/current/focus                       |
| Night sakura / Night 900 |  7.68:1 | Dark second voice                             |
| Night lilac / Night 900  |  7.94:1 | Dark tertiary voice                           |

These ratios validate candidate pairs, not every future composited or translucent state. Phase 2
must test actual semantic combinations and focus-ring contrast against every adjacent surface.

## Phase 1 semantic-token candidates

### Light mode

| Semantic role               | Candidate mapping                            | Rationale                                                              |
| --------------------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| Main reading background     | Paper 0                                      | Balances warm close-up paper and cool watercolor without looking beige |
| Alternate/raised surface    | Cloud 50                                     | Separates layers while preserving high-key identity                    |
| Sidebar and soft panel      | Mist 100                                     | Cool panel role from watercolor cyan                                   |
| Hover/selection fill        | Mist 100 → Ice 200                           | Clear but quiet; selection also needs outline/icon/state semantics     |
| Body text                   | Ink 950                                      | Deep close-up contour, not blue body copy                              |
| Muted text                  | Ink 650                                      | Meets AA on Paper 0                                                    |
| Border/divider              | Ice 200 or a mixed step between Mist and Ink | Thin spatial separator, not a heavy frame                              |
| Link/current/primary action | Cobalt 700                                   | Accessible translation of bird/feather cobalt                          |
| Keyboard focus              | Cobalt 700 outline                           | 6.10:1 against Paper 0; never remove native focus without replacement  |
| Quote/Liz surface           | Sakura 100 with Sakura 300 detail            | Warm fairy-tale voice without a pink workspace                         |
| Secondary voice             | Sakura 700; Lilac 700 only where distinct    | Duet, not rainbow headings                                             |
| Tiny warm counterpoint      | Gold 400                                     | Decorative dot/illustration only                                       |

### Dark mode

| Semantic role         | Candidate mapping          | Rationale                                            |
| --------------------- | -------------------------- | ---------------------------------------------------- |
| App canvas            | Night 950                  | Deep ink shadow without pure black                   |
| Main reading surface  | Night 900                  | Independent dark palette, not a light-mode inversion |
| Raised panel          | Night 800                  | Quiet depth without glass blur                       |
| Body/muted text       | Night text / Night muted   | Ice-cloud highlights with generous contrast          |
| Link/current/focus    | Night cobalt               | Brighter feather-blue translation for dark surfaces  |
| Secondary interaction | Night sky                  | Separates atmosphere from the primary cobalt action  |
| Second voice          | Night sakura / Night lilac | Sparse, softened counterpoint without neon glow      |

Error, destructive, warning, and success states remain mapped to Obsidian safety semantics. Pink
must not replace error red, and decorative gold must not replace warning amber.

## Decorative-only versus functional colors

- **Suitable for backgrounds:** Paper 0, Cloud 50, Mist 100, Ice 200, Sakura 100, Lilac 100, Night
  950/900/800.
- **Suitable for body text:** Ink 950/800, Night text; Ink 650 and Night muted for secondary text.
- **Suitable for interaction:** Cobalt 700/800 in light mode; Night cobalt/sky in dark mode.
- **Suitable only as decoration at the light step:** Aqua 300, Sky 400/500, Sakura 300, Lilac 300,
  Gold 400.
- **Needs darker/lighter adjustment for text:** sampled sky blue, feather blue, pale pink, lilac,
  and orange all need role-specific contrast steps rather than literal image colors.

## Rejected palette directions

1. **Medium sky blue across most of the app:** copies illustration area rather than UI function,
   increases visual pressure, and weakens selected-state contrast.
2. **All-blue text and headings:** becomes a generic blue theme, loses the deep-ink anchor, and
   collapses the blue-bird motif into noise.
3. **Large candy-pink or lavender surfaces:** overstates the second voice and loses the quiet
   warm-paper quality.
4. **Rainbow heading levels:** misrepresents the duet as a spectrum and competes with note
   hierarchy.
5. **Green/yellow garden as the default palette:** promotes a scene-specific support field over the
   shared blue-white identity.
6. **Pure black navy coding theme:** loses watercolor lightness, distance, and summer air.
7. **Gold as primary accent or warning replacement:** its source area is too small and it would blur
   semantic warning meaning.
8. **Glassmorphism, remote wallpaper, or real watercolor background:** conflicts with readability,
   performance, repository asset rules, and copyright constraints.
9. **Tracing a reference feather, title, flower, character, or complete composition:** not an
   original design and not permitted for release or promotion.

## Phase 1 conclusion

The initial hypotheses were directionally correct, but the images demand a more specific system: two
white temperatures, three distinct blue families, violet-navy ink rather than generic navy, and a
second voice that is sparse enough to remain meaningful. Light mode should carry the main watercolor
identity. Dark mode should feel like the close-up's ink shadow under summer-night blue, with the
same duet relationship preserved through lighter sky/cobalt and muted sakura/lilac.
