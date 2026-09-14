# Release checklist

Status: Phase 5A `0.9.0` Release Candidate self-check. `Untested` means exactly that; it is not a
pass.

| Area                         | Status         | Evidence / action                                                                                                                                                       |
| ---------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CSS Variables                | Pass           | Core UI, editor, embeds, Bases, Canvas, Graph, controls, and mobile surfaces are primarily mapped through official Obsidian variables.                                  |
| `!important`                 | Pass           | `npm run audit` rejects `!important`; current source count is zero.                                                                                                     |
| Live Preview vertical margin | Pass           | The theme avoids broad vertical-margin rewrites in Live Preview editor classes.                                                                                         |
| `:has()`                     | Pass           | `npm run audit` rejects `:has()`; current source count is zero.                                                                                                         |
| External CSS resources       | Pass           | `npm run audit` and `npm run package` reject remote `url(http...)`.                                                                                                     |
| Remote fonts                 | Pass           | No bundled or remote fonts are used.                                                                                                                                    |
| Base64 assets                | Pass           | `npm run audit` and `npm run package` reject Base64 data assets.                                                                                                        |
| README                       | Pass           | Phase 5A README describes install, testing, features, limitations, credits, and license without local absolute paths.                                                   |
| License                      | Pass           | MIT `LICENSE` is present with `Copyright (c) 2026 ice345`; final public copyright name still needs user confirmation.                                                   |
| Manifest                     | Pass           | `manifest.json` validates locally and is prepared as `0.9.0`, `minAppVersion` `1.13.4`, author `ice345`.                                                                |
| Theme name                   | Pass           | `Aoi Tori` uses Basic Latin, does not include `Obsidian` or `Theme`, and has no exact match in the current community theme index.                                       |
| Screenshot assets            | Pass           | `assets/screenshots/light.png`, `dark.png`, `mobile.png`, and `assets/cover.png` are original repository assets derived from real Aoi Tori UI screenshots.              |
| Screenshot size              | Pass           | `assets/cover.png` is 512 x 288 px.                                                                                                                                     |
| Screenshot copyright         | Pass           | Release assets do not use reference artwork, characters, official logos, official title art, remote images, or copied theme assets.                                     |
| Contrast                     | Pass           | All configured light/dark text, link, button, destructive-button, emphasis, highlight, tag, input, icon, and focus contrast pairs pass.                                 |
| Markdown semantics           | Pass           | Obsidian 1.13.4 screenshots cover light/dark Reading, Live Preview, Source, destructive buttons, tags/tasks, footnotes/KBD/HR, and focus-visible.                       |
| Light / Dark                 | Pass           | Desktop light/dark modes were tested in Obsidian/Installer 1.13.4 on macOS.                                                                                             |
| Mobile                       | Partial        | Official desktop mobile emulator and controlled phone/tablet viewports passed; physical iOS/iPadOS/Android remain untested.                                             |
| Canvas performance           | Partial        | Native Canvas variables and controls passed in 1.13.4; no large third-party Canvas stress test or physical mobile Canvas test was run.                                  |
| Images                       | Pass           | Desktop Live Preview image selection/actions/resize/Vim flows passed; mobile image layout passed in emulator. Physical mobile gestures remain untested.                 |
| Style Settings               | Pass           | Style Settings 1.0.9 parsed all 48 entries with no errors in the ignored test Vault.                                                                                    |
| Forced colors                | Partial        | Chromium forced-colors emulation passed; real Windows High Contrast remains untested.                                                                                   |
| Clean install                | Partial        | Package files copied into a fresh ignored Vault and matched SHA-256; actual clean-Vault UI launch/restart remained untested. Details in `docs/release-install-test.md`. |
| Package contents             | Pass           | `npm run package` produces only `manifest.json` and `theme.css` in `dist/Aoi Tori`.                                                                                     |
| Local absolute paths         | Pass           | Package and README checks found no `/Users/ice/...` paths in release-facing files.                                                                                      |
| Copyright material           | Pass           | No reference image, film screenshot, poster, logo, character art, or traced motif is packaged.                                                                          |
| Attribution                  | Pass           | `docs/attribution.md` records official sources, Style Settings schema usage, researched themes, and Phase 5A asset provenance.                                          |
| Test claims                  | Pass           | README and docs distinguish tested macOS desktop, desktop mobile emulation, and untested physical devices/platforms.                                                    |
| GitHub Release               | Not applicable | Phase 5A explicitly does not create a GitHub Release.                                                                                                                   |
| Git tag                      | Not applicable | Phase 5A explicitly does not create a Git tag.                                                                                                                          |
| Community submission         | Not applicable | Phase 5A explicitly does not submit the theme.                                                                                                                          |
