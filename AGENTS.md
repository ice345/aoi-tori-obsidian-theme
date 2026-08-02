# AGENTS.md

## Project identity

This repository contains **Aoi Tori**, an independent Obsidian community theme inspired by
watercolor blue-and-white imagery, the motif of a blue bird, quiet distance, and two voices moving
in parallel.

This is not an official theme for any film, studio, brand, or product. Do not add copyrighted
screenshots, posters, logos, character art, or bundled reference images to release artifacts.

## Instruction priority

When instructions conflict, use this order:

1. The current user request.
2. This `AGENTS.md`.
3. The active section in `PLANS.md`.
4. `docs/ARCHITECTURE.md`.
5. `docs/DESIGN.md`.
6. `docs/TESTING.md`.
7. Existing implementation conventions.

Do not silently ignore a conflict. Record the decision in `PLANS.md`.

## Visual source of truth

The visual source priority is:

1. Images placed in `references/`.
2. `docs/visual-analysis.md`, once created from those images.
3. `docs/DESIGN.md`.
4. Existing semantic tokens.
5. Reference hexadecimal colors.
6. Visual conventions from other Obsidian themes.

The provided hexadecimal colors are **reference anchors only**. They are not immutable
specifications. Analyze the images before finalizing hue, lightness, chroma, contrast, and UI roles.

Other Obsidian themes are engineering and interaction references. Do not copy one theme and replace
its colors. The final visual system must remain recognizably Aoi Tori.

## Required first steps

Before changing code:

1. Read this file.
2. Read `README.md`.
3. Read `PLANS.md`.
4. Read `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, and `docs/TESTING.md`.
5. Inspect `git status`.
6. Identify whether the requested change affects generated files, source files, documentation, or
   release metadata.
7. For work affected by a recent Obsidian release, verify the current official changelog and CSS
   documentation before editing selectors.

For a multi-file or multi-stage task, update `PLANS.md` before implementation.

## Generated files

- `theme.css` is generated from `src/index.css`.
- Never hand-edit `theme.css`.
- Make changes in `src/`, then run `npm run build`.
- A release build is produced with `npm run release`.

## Commands

Install dependencies:

```bash
npm install
```

Development watcher:

```bash
npm run dev
```

Build readable `theme.css`:

```bash
npm run build
```

Format files:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Lint CSS:

```bash
npm run lint
```

Audit theme rules and repository constraints:

```bash
npm run audit
```

Check configured color contrast pairs:

```bash
npm run contrast
```

Run the complete local quality gate:

```bash
npm run check
```

Create the minified release `theme.css`:

```bash
npm run release
```

## Definition of done

A change is complete only when:

- Source files, documentation, and plan status agree.
- `npm run check` passes.
- `theme.css` has been regenerated.
- No direct edit was made only to `theme.css`.
- No remote font, remote image, remote stylesheet, or Base64 asset was introduced.
- No `!important` was introduced.
- No `:has()` was introduced without an explicit documented exception.
- UI colors are applied through semantic tokens rather than component-local hex values.
- Keyboard focus remains visible.
- Light and dark modes remain usable.
- The affected Obsidian interaction has been manually tested or clearly marked as untested.
- The final response lists changed files, commands run, results, and remaining risks.

## CSS architecture rules

- Primitive visual values live in `src/tokens/primitives.css`.
- Obsidian semantic mappings live in `src/tokens/semantic-light.css` and
  `src/tokens/semantic-dark.css`.
- Component files consume semantic variables.
- Do not put hex, rgb, hsl, oklch, or named colors in component files.
- Prefer official Obsidian CSS variables before targeting internal DOM.
- Prefer low-specificity selectors, including `:where(...)`.
- Keep selector depth at four levels or fewer unless documented.
- Do not apply destructive global rules to `img`, `svg`, `canvas`, or embeds.
- Do not animate image width or height.
- Do not hide unknown native controls with `display: none`.
- Respect `prefers-reduced-motion`, `forced-colors`, and keyboard navigation.
- Preserve semantic error, warning, and destructive colors.

## Obsidian compatibility rules

For Live Preview image work, verify all relevant states in the target Obsidian version:

- Mouse and keyboard image selection.
- Copy, cut, delete.
- Grow, shrink, and reset.
- Enter and Tab editing flows.
- Space and zoom-button lightbox opening.
- Resize handles.
- Vim mode image commands.
- Images inside lists, callouts, quotes, tables, and embeds.
- Pop-out windows and narrow layouts.
- Touch targets on mobile.

Never guess new internal selectors from memory. Inspect the current DOM and document risky selectors
in `docs/obsidian-dom.md`.

## Reference-theme research rules

When studying community themes:

- Check current maintenance status and source repository.
- Read the actual Health/Review findings rather than relying on a badge alone.
- Check the license before adapting code.
- Learn architecture, token design, testing, and compatibility patterns.
- Do not copy visual identity, bundled assets, icons, or large CSS sections.
- Record concrete borrowing in `docs/attribution.md`.
- Do not combine GPL code into an MIT release.

## Documentation rules

Update documentation when behavior or structure changes:

- Architecture changes → `docs/ARCHITECTURE.md`
- Visual/token changes → `docs/DESIGN.md`
- Test procedure changes → `docs/TESTING.md`
- Long-running task status or decisions → `PLANS.md`
- External code inspiration → `docs/attribution.md`
- Current Obsidian DOM findings → `docs/obsidian-dom.md`
- Image palette findings → `docs/visual-analysis.md`

Do not create documents that only repeat other files.

## Scope discipline

- Make the smallest coherent change that satisfies the task.
- Do not redesign unrelated components during a bug fix.
- Do not add dependencies without documenting why they are needed.
- Do not claim a platform or Obsidian version was tested unless it was actually tested.
- Preserve unrelated user changes.
- Stop and report uncertainty if the requested action could overwrite uncommitted work.

## SKILL.md policy

Do not add a skill merely to describe this repository. Repository-wide guidance belongs here.

Create a `SKILL.md` only after a workflow has become genuinely repeatable across tasks, for example:

- Auditing a new Obsidian release for theme regressions.
- Extracting and documenting a palette from a new reference-image set.
- Preparing and validating a community-theme release.

A skill must define inputs, ordered steps, expected outputs, and final checks. Until a workflow has
been repeated and stabilized, keep it in `PLANS.md` or the relevant documentation.
