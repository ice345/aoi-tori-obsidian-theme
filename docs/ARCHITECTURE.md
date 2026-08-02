# Architecture

## Purpose

Aoi Tori uses modular source CSS and produces one installable `theme.css`. The architecture
separates visual primitives, semantic Obsidian mappings, component behavior, and generated release
output.

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
theme.css
```

`theme.css` is generated and must not be edited directly.

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

### 3. Typography and motion

Locations:

```text
src/tokens/typography.css
src/tokens/motion.css
```

These define system font stacks, line height, durations, and reduced-motion behavior.

### 4. Components and views

The Phase 2 preview slice contains only modules with real styles:

```text
src/
├── workspace/
│   └── shell.css       # app surfaces, sidebars, ribbon, status, tabs, navigation
├── editor/
│   ├── content.css     # editor/reading content, code, quotes, callouts, properties, tables
│   └── images.css      # stable image hover/focus surface only
└── components/
    ├── controls.css    # buttons, fields, dropdowns, toggles, icons
    └── overlays.css    # menu, modal, tooltip, notice, settings
```

`src/index.css` imports tokens before modules so every component consumes already-defined semantic
variables. Empty `views/`, `platforms/`, and `integrations/` directories are not created in advance.

A component module must:

- Consume semantic variables.
- Avoid component-local colors.
- Prefer official Obsidian variables.
- Keep selectors shallow.
- Document any internal DOM dependency.
- Include keyboard, reduced-motion, and dark-mode considerations.

### 5. Build artifact

```text
theme.css
```

The release artifact contains bundled CSS imports. Development builds are readable. Release builds
are minified.

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
```

Generated output is reproducible using:

```bash
npm run build
```

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
