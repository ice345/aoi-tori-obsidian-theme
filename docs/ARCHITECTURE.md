# Architecture

## Purpose

Aoi Tori uses modular source CSS and produces a readable review artifact plus a minified installable
`theme.css`. The architecture separates visual primitives, semantic Obsidian mappings, component
behavior, and generated release output.

## Build flow

```text
reference images
      ↓
docs/visual-analysis.md
      ↓
primitive visual tokens
      ↓
light/dark semantic mappings
      ↓
component and view modules
      ↓
src/index.css
      ↓
scripts/build.mjs
      ↓
theme.css (readable root artifact)
      └── npm run package → dist/Aoi-Tori/theme.css (minified package artifact)
```

Both CSS artifacts are generated and must not be edited directly.

## Layers

### 1. Primitive tokens

Location:

```text
src/tokens/primitives.css
```

Contains image-derived and accessibility-adjusted values:

- Cloud and paper whites
- Sky and water blues
- Deep bird/cobalt blues
- Sakura and lilac accents
- Ink and muted text colors
- Night-mode primitives
- Semantic safety colors such as danger, warning, and success

Primitive names describe visual identity, not UI usage.

### 2. Semantic tokens

Locations:

```text
src/tokens/semantic-light.css
src/tokens/semantic-dark.css
```

These map Aoi Tori primitives onto Obsidian variables such as:

```css
--background-primary
--text-normal
--text-accent
--interactive-accent
--background-modifier-hover
```

Light and dark mode are independently designed. Dark mode is not an inversion.

### 3. Typography, motion, and accessibility

Locations:

```text
src/tokens/typography.css
src/tokens/motion.css
src/tokens/accessibility.css
```

These define system/CJK font stacks, line height, durations, theme geometry controls, operating
system reduced-motion and increased-contrast responses, and a bounded forced-colors fallback.

### 4. Components and views

The current theme contains only modules with real styles:

```text
src/
├── workspace/
│   └── shell.css       # app surfaces, sidebars, ribbon, status, tabs, navigation
├── editor/
│   ├── content.css     # editor/reading content, code, quotes, callouts, properties, tables
│   └── images.css      # stable image hover/focus surface only
├── components/
│   ├── controls.css    # buttons, fields, dropdowns, toggles, icons
│   └── overlays.css    # menu, modal, tooltip, notice, settings
├── platform/
│   └── mobile.css      # mobile/tablet surfaces, responsive content, touch targets
└── settings/
    └── style-settings.css  # optional plugin metadata and constrained variants
```

`src/index.css` imports base tokens before view modules, then mobile, Style Settings, and system
accessibility overrides. This keeps official semantic mappings authoritative while allowing explicit
user/system accessibility choices to win without `!important`. Empty `views/` and `integrations/`
directories are not created in advance.

Phase 3 covers Bases, Canvas, Graph, PDF, embeds, search, and pop-outs through official semantic
variables in the light/dark token files. Actual 1.13.4 testing found no need for a dedicated view
module or a new internal selector. This keeps native rendering, virtualization, resizing, and window
behavior owned by Obsidian.

Phase 4 adds one platform module because mobile navigation, drawers, narrow Settings, nested images,
and touch targets require real responsive rules. It uses the official `is-mobile`, `is-phone`, and
`is-tablet` root states plus stable component classes confirmed in 1.13.4. Bases keeps its native
internal scrolling and per-view card `imageFit`; Canvas and Graph keep native rendering while their
visible mobile controls receive a minimum 44 px hit target.

Style Settings metadata lives beside its bounded class/variable variants. Lightning CSS does not
retain the metadata comment while bundling, so `scripts/build.mjs` reads that source block and
prepends it to generated `theme.css`. `scripts/audit-css.mjs` verifies the source metadata, required
groups, and generated preservation. The theme remains fully functional without the plugin.

A component module must:

- Consume semantic variables.
- Avoid component-local colors.
- Prefer official Obsidian variables.
- Keep selectors shallow.
- Document any internal DOM dependency.
- Include keyboard, reduced-motion, and dark-mode considerations.

### 5. Build artifacts

The two generated CSS files have different review and distribution purposes:

```text
theme.css                 # readable, formatted root artifact
dist/Aoi-Tori/theme.css   # minified install/release artifact
```

`build()` in `scripts/build.mjs` requires an explicit `outputFile` and accepts `minify`. The
`npm run build` script passes `theme.css` with `minify: false`, using Lightning CSS plus the
repository's Prettier configuration to produce stable readable CSS while keeping the complete
`@settings` comment. `scripts/package.mjs` runs the full quality gate first, then calls the same
builder with `outputFile` set directly to `dist/Aoi-Tori/theme.css` and `minify: true`; it never
overwrites the root artifact. `dist/` is ignored, so only the root readable artifact is visible in
normal source review.

## Dependency policy

Dependencies are development-only. The installed theme must be pure CSS plus `manifest.json`.

A new dependency requires:

- A clear build or validation purpose.
- No runtime requirement in Obsidian.
- A note in `PLANS.md`.
- Review for maintenance and license risk.

## Selector policy

Use this preference order:

1. Official Obsidian CSS variables.
2. Stable documented classes.
3. Low-specificity component selectors.
4. Version-specific internal selectors only when unavoidable.

Version-specific selectors must be recorded in `docs/obsidian-dom.md`.

## Generated-file policy

Do not manually edit:

```text
theme.css
dist/Aoi-Tori/theme.css
```

Generated output is reproducible using:

```bash
npm run build
npm run package
```

## Release package

`npm run package` prepares the local release-candidate install directory:

```text
dist/Aoi-Tori/
├── manifest.json
└── theme.css
```

The command runs the local quality gate, creates a minified generated CSS file directly at
`dist/Aoi-Tori/theme.css`, rebuilds only the validated package path under `dist/`, copies the
manifest, checks for local paths, remote CSS resources, Base64 assets, test/reference/source
markers, unexpected files, and prints a SHA-256 line for each packaged file.

`dist/` is ignored and is not a source or documentation directory. Repository presentation assets
such as `assets/cover.png` and README screenshots stay outside the installed theme package.

## Future module layout

As implementation grows, prefer:

```text
src/
├── tokens/
├── workspace/
├── editor/
├── components/
├── views/
├── platforms/
├── integrations/
└── utilities/
```

Do not pre-create empty modules merely to satisfy a planned tree. Add them when they contain real
code and tests.

## Local visual-test vault

`test-vault-content/` is source-controlled review content, not a release asset directory. Its
`.obsidian/` configuration and theme link are local-only and ignored. The build does not read this
directory, so the diagnostic note and original SVG test image cannot enter `theme.css` or a
Community Theme package.

`test-vault-content/Phase 3/` expands that boundary with original image/media/PDF fixtures, Bases,
Canvas, Graph, Settings, pop-out, and long-path cases. The audit verifies required fixtures exist,
every import resolves under `src/`, and built CSS contains no excluded local/reference/test path.
Review screenshots remain under ignored `.analysis/phase-3-review/` and `.analysis/phase-4-review/`.
