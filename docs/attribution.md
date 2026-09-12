# Attribution and provenance

Status: Phase 1 research record plus Phase 2–5A implementation and release-candidate provenance,
2026-08-03.

No external theme code, icon, font, image, screenshot, title treatment, or other release asset has
been copied or adapted into Aoi Tori. The sources below informed analysis, architecture choices, or
narrative interpretation only.

If a future change adapts an implementation, add the exact repository, file, commit, license, copied
or modified portion, required notice, and compatibility with this project's intended license before
merging it.

## Local reference images

The files under `references/raw/` are visual research inputs only. Their provenance and release
rights are not established by this repository, so they are treated as non-redistributable.

- They are ignored by Git except for `references/README.md`.
- Local contact sheets and crops live only under the ignored `.analysis/` directory.
- They must not be copied to `assets/`, embedded in CSS, packaged with a release, or used in a
  Community Theme cover.
- Characters, official titles, flowers, feathers, birds, and complete compositions must not be
  traced or reconstructed.

The future cover may use an original abstract graphic and a screenshot of Aoi Tori running in
Obsidian. It may not use these references as a background or collage.

## Work and narrative research

| Source                                                                                     | Role in this phase                                                                                       | Material used                                          |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [Kyoto Animation work page](https://www.kyotoanimation.co.jp/en/works/liz/)                | Confirmed the film/work identity and official production source                                          | Bibliographic context only                             |
| [Official Japanese site](https://liz-bluebird.com/)                                        | Confirmed the fairy-tale/music framing and official terminology                                          | Concepts only; no artwork, logo, title, or text copied |
| [Director Naoko Yamada interview](https://liz-bluebird.com/interview/)                     | Informed the UI translation of quiet accumulation, interpersonal distance, breath, warmth, and restraint | Paraphrased design interpretation only                 |
| [Pony Canyon official English synopsis](https://ponycanyon.us/show/liz-and-the-blue-bird/) | Confirmed the oboe/flute duet and the near-but-not-aligned relationship                                  | Paraphrased narrative context only                     |
| [Official site stylesheet](https://liz-bluebird.com/css/common.css)                        | Read live computed background gradients and colour values as evidence for the two-voice relationship     | Values studied as data; no CSS copied or redistributed |

The resulting UI narrative is original design analysis. It does not claim endorsement by Kyoto
Animation, Pony Canyon, the creators, or rights holders.

## Obsidian sources

| Source                                                                                 | Role in this phase                                                     | Material used                           |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| [Obsidian changelog](https://obsidian.md/changelog/)                                   | Current Desktop/Mobile/installer and 1.13 interaction baseline         | Facts and compatibility requirements    |
| [Obsidian developer documentation](https://docs.obsidian.md/)                          | CSS variables, manifest, theme, submission, and policy rules           | Engineering guidance only               |
| [Obsidian Mobile help](https://obsidian.md/help/mobile)                                | Current mobile navigation, toolbar, drawer, and gesture model          | Testing expectations only               |
| [Obsidian Community](https://community.obsidian.md/themes)                             | Current theme versions, Health/Review scorecards, and licenses         | Research snapshot only                  |
| [Community/automated review announcement](https://obsidian.md/blog/future-of-plugins/) | Interpretation of Health/Review status and submission flow             | Policy facts only                       |
| [obsidianmd/obsidian-releases](https://github.com/obsidianmd/obsidian-releases)        | Current theme index, screenshot paths, and accepted repository records | Release-structure evidence only         |
| [Style Settings](https://github.com/obsidian-community/obsidian-style-settings)        | Optional metadata schema and current plugin test target                | Schema usage only; no theme code copied |

## Community-theme research

| Theme and source                                                     | License/provenance note                                                                  | What was learned                                                                                                    | What was copied                                                 |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [Minimal](https://github.com/kepano/obsidian-minimal)                | MIT; extracted code would require the copyright and license notice                       | Modular SCSS boundaries, dynamic intermediate tokens, separate semantic mapping, explicit build outputs             | Nothing                                                         |
| [Baseline](https://github.com/aaaaalexis/obsidian-baseline)          | MIT; its README separately credits several theme sources                                 | Current-surface modules, mobile-first treatment, Style Settings migration/presets, installer-baseline signaling     | Nothing                                                         |
| [Shimmering Focus](https://github.com/chrisgrieser/shimmering-focus) | MIT theme; embedded fonts carry SIL OFL and Apache licenses                              | Deterministic source ordering, Lightning CSS syntax lowering, `doiuse`, changelog discipline                        | Nothing; embedded fonts/Base64 assets are specifically rejected |
| [Border](https://github.com/Akifyss/obsidian-border)                 | MIT; README credits Maple, Minimal, and Mado Miniflow for specific inspiration           | Preset documentation, bilingual Style Settings, and the maintenance cost of a monolithic selector surface           | Nothing                                                         |
| [Things](https://github.com/colineckert/obsidian-things)             | MIT file retains Stephan Ango/Minimal copyright; README acknowledges Minimal as its base | Small semantic core, mobile ergonomics, and the provenance burden of theme-derived code                             | Nothing                                                         |
| [Transparent](https://github.com/Oczko24/Obsidian-transparent)       | GPL-3.0; combining its code into an MIT release would create incompatible obligations    | Mobile/Bases/Canvas coverage and the performance/readability risks of blur, remote backgrounds, and broad animation | Nothing; code reuse is prohibited for this project              |
| [Kanagawa](https://github.com/sspaeti/obsidian_kanagawa)             | MIT; its palette comments reference the separate Kanagawa editor theme                   | Value of a small primitive-to-semantic mapping and a low-complexity release                                         | Nothing; palette and visual identity are not used               |

General architecture ideas and observed failure modes are not copied code. If an exact selector,
algorithm, build fragment, or asset is adapted later, this table is insufficient: a new concrete
attribution entry is required.

The Phase 2 CSS modules, token names, test note, and diagnostic SVG were authored specifically for
Aoi Tori. They do not adapt CSS, selectors, graphics, or assets from the researched themes or from
the local reference images.

Phase 3 adds only independently authored semantic-variable mappings, documentation, audit logic, and
local test fixtures. The SVG/PNG/GIF/video frames use original geometric fields and paired curves;
the WAV and one-page PDF are original diagnostics generated for the test Vault. No fixture is a
release asset. `example.com` and one explicit placeholder-image URL are runtime connectivity tests
only; neither URL is imported by CSS or packaged. No source code, icon, Canvas design, Bases layout,
Graph palette, media, or screenshot was copied from another theme or from the local reference
images.

Phase 4's responsive CSS, accessibility media rules, Style Settings options, build metadata
preservation, and audit checks were authored for Aoi Tori. The Style Settings project supplied only
the public metadata contract and a local parser/runtime for verification; no preset, theme CSS,
icon, asset, or implementation block was copied. Mobile behavior was derived from official Obsidian
documentation and the locally rendered 1.13.4 DOM.

Phase 5A's `assets/screenshots/light.png`, `assets/screenshots/dark.png`, and
`assets/screenshots/mobile.png` were cropped or resized from this repository's own real Obsidian Aoi
Tori review screenshots under ignored `.analysis/`. They contain UI evidence only and no reference
artwork. `assets/cover.svg` is an original abstract composition using those UI screenshots, two
original near-parallel curves, low-opacity color fields, one tiny gold point, and a geometrically
constructed cobalt feather mark. `assets/cover.png` is rendered from that SVG. No official title
treatment, character, flower, bird, feather outline, poster, screenshot, reference crop, remote
image, Base64 asset, or external theme asset was used.

## Current attribution conclusion

- External code adapted: **none**.
- External assets included: **none**.
- Remote fonts/images/stylesheets added: **none**.
- GPL code incorporated: **none**.
- Reference artwork included in release paths: **none**.
