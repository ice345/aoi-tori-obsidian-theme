# Contributing to Aoi Tori

Thanks for helping test Aoi Tori. This project is an independent Obsidian theme, not an official
theme for any film, studio, brand, or product.

## Before opening an issue

- Try the latest release-candidate version.
- Include Obsidian version, installer version, operating system, theme version, light/dark mode, and
  Style Settings status.
- Redact private notes before sharing screenshots.
- Do not upload an entire private Vault.
- Check whether the issue also appears in Obsidian's Default theme.

## Development setup

```bash
npm install
npm run build
npm run check
```

Install the theme into a test Vault by copying or linking `manifest.json` and `theme.css` into:

```text
<Vault>/.obsidian/themes/Aoi Tori/
```

## Release-candidate checks

Before proposing a release-facing change, run:

```bash
npm run format
npm run check
npm run package
```

Manual testing should record the exact Obsidian version, installer version, OS, theme version, mode,
plugins, steps, and result. Do not mark physical mobile, Windows High Contrast, or assistive
technology as passed unless you actually tested them.

## CSS rules

- Change source files under `src/`; do not hand-edit generated `theme.css`.
- Prefer official Obsidian CSS variables.
- Keep selectors low-specificity and documented when they depend on current DOM.
- Do not add `!important`, `:has()`, remote assets, Base64 assets, bundled fonts, broad image
  selectors, or hover-only essential controls.
- Keep component colors mapped through semantic tokens rather than local hex values.

## Visual and license rules

- Do not add official artwork, screenshots, posters, logos, character art, copied feathers, copied
  flowers, or reference-image crops.
- Do not copy CSS or assets from another Obsidian theme. If a future change adapts exact code, it
  must first document the source, commit, license, copied portion, and required notice.
- Aoi Tori is prepared for MIT licensing. GPL code must not be mixed into this MIT release.

## Pull request notes

Please include:

- What changed.
- Why it is needed.
- Commands run and results.
- Manual Obsidian testing performed.
- Remaining untested states.
