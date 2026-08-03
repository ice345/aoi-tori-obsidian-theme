# Aoi Tori

A watercolor-inspired Obsidian theme shaped by cloud white, clear sky blue, deep cobalt, subtle
sakura pink, quiet distance, and two parallel voices.

> **Project status:** the desktop core, bounded mobile layout, Style Settings, and accessibility
> pass are implemented and under review. The theme is not ready for Community Themes submission yet;
> real iOS/iPadOS/Android and Windows forced-colors review remain release prerequisites.

## Name

**Aoi Tori** comes from the Japanese phrase **青い鳥** — “blue bird”. The name echoes the visual and
emotional language associated with _Liz and the Blue Bird_, but this repository is an independent,
unofficial project and does not contain official artwork, logos, or bundled film assets.

## Design direction

Aoi Tori should feel:

- Bright, airy, and suitable for long reading sessions.
- Blue-and-white without turning every element blue.
- Watercolor-soft without blurring text or reducing performance.
- Calm and spacious rather than glossy, neon, or heavily glassmorphic.
- Native enough to feel at home on macOS while remaining usable on Windows, Linux, iOS, and Android.
- Carefully compatible with current Obsidian editor, image, settings, Bases, Canvas, and mobile
  interactions.

Reference images placed in `references/` are the primary visual source. Hex colors in the
documentation are starting points only.

## Repository layout

```text
.
├── AGENTS.md
├── PLANS.md
├── README.md
├── manifest.json
├── package.json
├── theme.css                  # generated; do not edit directly
├── references/                # local design references; exclude copyrighted files from releases
├── scripts/
│   ├── audit-css.mjs
│   ├── build.mjs
│   ├── check-contrast.mjs
│   ├── dev.mjs
│   └── validate-manifest.mjs
├── src/
│   ├── index.css
│   ├── components/           # controls and overlays
│   ├── editor/               # content and image states
│   ├── platform/
│   │   └── mobile.css        # mobile/tablet layout and touch targets
│   ├── settings/
│   │   └── style-settings.css
│   ├── workspace/
│   └── tokens/
│       ├── accessibility.css
│       ├── motion.css
│       ├── primitives.css
│       ├── semantic-dark.css
│       ├── semantic-light.css
│       └── typography.css
└── docs/
    ├── ARCHITECTURE.md
    ├── DESIGN.md
    ├── TESTING.md
    ├── attribution.md
    ├── contrast-pairs.json
    ├── obsidian-dom.md
    └── visual-analysis.md
```

## Requirements

- Node.js 20 or newer
- npm
- A local Obsidian vault for manual testing
- Obsidian developer tools for DOM inspection

## Setup

```bash
npm install
npm run build
```

Copy or symlink this repository into a vault theme directory:

```text
<Vault>/.obsidian/themes/Aoi Tori/
```

The theme directory must contain at least:

```text
manifest.json
theme.css
```

Then open **Settings → Appearance → Themes** and select **Aoi Tori**.

The optional [Style Settings](https://github.com/obsidian-community/obsidian-style-settings) plugin
exposes bounded palette, typography, workspace, editor, image, and accessibility controls. Aoi
Tori's defaults are the complete intended theme and do not require that plugin.

## Commands

```bash
npm run dev           # watch source CSS and rebuild theme.css
npm run build         # build readable theme.css
npm run format        # format supported repository files
npm run format:check  # verify formatting
npm run lint          # run CSS lint and formatting checks
npm run audit         # enforce repository/theme safety rules
npm run contrast      # verify configured text/background contrast pairs
npm run check         # run the complete quality gate
npm run release       # run checks and create minified theme.css
```

## Working with Codex or another coding agent

The root `AGENTS.md` is the authoritative repository instruction file. For complex work, update
`PLANS.md` before implementation. Do not edit generated `theme.css` directly.

A useful task request should identify:

- The Obsidian version being targeted.
- The UI or interaction being changed.
- Which reference images matter.
- Whether the task includes research, implementation, testing, or release preparation.
- The expected evidence, such as screenshots, DOM notes, or command output.

## Visual references

Place reference images in `references/` and update `docs/visual-analysis.md`.

Rules:

- Images are for local analysis and design reference.
- Do not bundle copyrighted reference images in release artifacts.
- Do not publish film screenshots or promotional art as the theme cover.
- The final theme must rely on CSS and original abstract presentation assets.
- Extracted colors must be adjusted for UI semantics and accessibility.

## Release principles

Before a release:

1. Verify the current Obsidian changelog and theme documentation.
2. Review relevant community-theme Health/Review findings.
3. Test light and dark modes.
4. Test keyboard and Vim interactions.
5. Test Live Preview image controls and lightbox behavior.
6. Test settings, Bases, Canvas, pop-out windows, and mobile layouts on actual target devices.
7. Run `npm run check`.
8. Review `docs/TESTING.md` and the release section of `PLANS.md`.

## License

The intended project license is MIT. Add the final copyright holder and year before a public
release.

Reference images retain their original copyrights and are not covered by this repository’s license.
