# Release research

Status: Phase 5A release-candidate research snapshot, checked on 2026-08-03 (Asia/Shanghai). These
rules are time-sensitive; recheck official sources before a real Community Themes submission.

## Official sources checked

| Source                                                                                                                                                                    | Current finding for Aoi Tori                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Obsidian Developer Documentation repository](https://github.com/obsidianmd/obsidian-developer-docs)                                                                      | Current theme docs are available in the official docs source even when some previous public page URLs return a Not Found page in this environment.                                                        |
| [Manifest documentation](https://github.com/obsidianmd/obsidian-developer-docs/blob/main/en/Reference/Manifest.md)                                                        | Themes require `name`, `version`, `minAppVersion`, and `author`; `authorUrl` is optional. `version` uses `x.y.z` semantic versioning.                                                                     |
| [Theme guidelines](https://github.com/obsidianmd/obsidian-developer-docs/blob/main/en/Themes/App%20themes/Theme%20guidelines.md)                                          | Prefer CSS variables, low-specificity selectors, local assets, and no `!important`. Themes must not load remote assets.                                                                                   |
| [Submit your theme](https://github.com/obsidianmd/obsidian-developer-docs/blob/main/en/Themes/App%20themes/Submit%20your%20theme.md)                                      | Initial submission is through `community.obsidian.md`; after acceptance, users update from GitHub releases. A release tag must match `manifest.json` version and attach `manifest.json` plus `theme.css`. |
| [Release with GitHub Actions](https://github.com/obsidianmd/obsidian-developer-docs/blob/main/en/Themes/App%20themes/Release%20your%20theme%20with%20GitHub%20Actions.md) | The official automated release example creates a draft GitHub Release on tag push and uploads only `manifest.json` and `theme.css`. Phase 5A intentionally adds CI only, not release automation.          |
| [Embed fonts and images](https://github.com/obsidianmd/obsidian-developer-docs/blob/main/en/Themes/App%20themes/Embed%20fonts%20and%20images%20in%20your%20theme.md)      | If a theme bundles runtime CSS assets, they must be embedded in CSS as data URLs, but Aoi Tori intentionally uses no runtime fonts, remote images, or Base64 assets.                                      |
| [Developer policies](https://github.com/obsidianmd/obsidian-developer-docs/blob/main/en/Developer%20policies.md)                                                          | Community themes must include a license, respect licenses/trademarks, avoid telemetry, and avoid network-loaded theme assets.                                                                             |
| [Theme self-critique checklist](https://github.com/obsidianmd/obsidian-developer-docs/blob/main/en/Obsidian%20October%20theme%20self-critique%20checklist.md)             | Check CSS variables, `!important`, Live Preview vertical margins, `:has()`, external assets, README freshness, screenshot size, and license before release.                                               |
| [Obsidian Community launch / automated review announcement](https://obsidian.md/blog/future-of-plugins/)                                                                  | The Community site has project detail pages, screenshots, safety scorecards, a developer dashboard, and automated review scanning every version.                                                          |
| [obsidianmd/obsidian-releases](https://github.com/obsidianmd/obsidian-releases)                                                                                           | The current community theme index is `community-css-themes.json`; it records theme name, author, repository, screenshot path, and light/dark modes.                                                       |

## Official release flow

The current official flow for a new Community Theme is:

1. Keep repository root files accurate: `README.md`, `LICENSE`, `manifest.json`, `theme.css`, and a
   representative screenshot.
2. Update `manifest.json` to the intended semantic version.
3. Create a GitHub Release whose tag equals the manifest version.
4. Attach `manifest.json` and `theme.css` as release assets.
5. Sign in to [Obsidian Community](https://community.obsidian.md), connect GitHub, choose
   **Themes**, then **New theme**.
6. Submit the GitHub repository URL and agree to the Developer Policies.
7. Address automated review feedback by publishing a new incremented version and release.

The directory processes `manifest.json` at the HEAD of the default branch during submission. When a
user installs the theme, Obsidian downloads `manifest.json` and `theme.css` from the GitHub Release
whose tag matches the committed manifest version.

Phase 5A stops before step 3: it prepares `0.9.0` local release-candidate files only. It does not
create a tag, GitHub Release, Community submission, push, or commit.

## Manifest candidate

```json
{
  "name": "Aoi Tori",
  "version": "0.9.0",
  "minAppVersion": "1.13.4",
  "author": "ice345",
  "authorUrl": "https://github.com/ice345"
}
```

Name check against the current `community-css-themes.json` found no exact `Aoi Tori` match. The name
uses Basic Latin, does not include `Obsidian`, does not include `Theme`, and does not duplicate a
core feature name. The submitted theme name may not be changeable after acceptance, so the user must
confirm the final name before a real submission.

`minAppVersion` remains `1.13.4` because the implemented image workflow, Settings, Bases, Canvas,
mobile-emulation, and Style Settings pass were tested against Obsidian/Installer 1.13.4. There is no
Phase 5A evidence supporting a lower minimum.

## Accepted theme repository snapshot

At least three recent, accepted themes from the current `community-css-themes.json` were inspected
through GitHub on 2026-08-03:

| Theme       | Repository                             | Recent release evidence                              | Root structure observed                                                                                                          | Screenshot field              |
| ----------- | -------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| macOS Tahoe | `alex-yelisieiev/macos-tahoe-obsidian` | Release `1.2.1`, assets `manifest.json`, `theme.css` | `.gitignore`, `LICENSE`, `README.md`, `manifest.json`, `poster.png`, `screenshot.png`, `theme.css`, `versions.json`              | `screenshot.png`              |
| Retro Relay | `rahelaq/retro-relay`                  | Release `1.0.0`, assets `manifest.json`, `theme.css` | `.github`, `LICENSE`, `README.md`, `SECURITY.md`, `docs`, `manifest.json`, `package.json`, `screenshots`, `scripts`, `theme.css` | `screenshots/screenshot.png`  |
| Nebula      | `devmandalia/Nebula`                   | Release `1.0.3`, assets `manifest.json`, `theme.css` | `LICENSE`, `README.md`, `manifest.json`, `screenshot.png`, `screenshots`, `theme.css`                                            | `screenshots/dark-kanban.png` |
| March       | `sakurastral/obsidian-march-theme`     | Release `1.6.0`, assets `manifest.json`, `theme.css` | `.github`, `LICENSE`, `README.md`, `image`, `manifest.json`, `package.json`, `src`, `theme.css`, `versions.json`                 | `image/cover.png`             |

Practical conclusion: current accepted repositories vary between single-file themes and source
builds. Their GitHub Release assets consistently include only `manifest.json` and `theme.css`.
Screenshot paths in the community index can be root files or subdirectory files, despite the
submission guide's simpler wording about a screenshot in the root folder.

## Package contents

For the release candidate package, the installed theme directory should contain only:

```text
manifest.json
theme.css
```

Do not package `src/`, `scripts/`, `docs/`, `references/`, `.analysis/`, `node_modules/`,
`test-vault-content/`, `package.json`, `package-lock.json`, local vault configuration, or
screenshots. Screenshots are repository assets for README/Community presentation, not runtime theme
files.

## Health and Review scorecard behavior

The current Community site announcement says project detail pages include screenshots and a safety
scorecard. The automated review system scans every version for security and code quality, not only
the initial submission. A failing or caution result should be treated as actionable review feedback,
not as a visual preference.

For Aoi Tori, the local checks most directly aligned with known scorecard issues are:

- `npm run audit`: no `!important`, no `:has()`, no remote CSS resources, no Base64, no destructive
  global `img`, no excluded paths in built CSS.
- `npm run lint`: Stylelint plus formatting.
- `npm run contrast`: configured WCAG contrast pairs.
- `npm run validate:manifest`: local manifest schema and naming guard.
- `npm run package`: release-package file list, local-path, remote-resource, excluded-marker, and
  SHA-256 audit.

The real dashboard preview scan remains untested because this Phase 5A task does not sign in,
submit, tag, or create a GitHub Release.

## Unclear or conflicting points

- Some older docs URLs used in Phase 1/3 research returned Not Found in this environment, while the
  official `obsidian-developer-docs` repository still contains the current pages. The GitHub source
  is treated as the reliable official record for this phase.
- The submission guide lists a screenshot among root repository files and recommends 512 x 288 px.
  Current accepted entries in `community-css-themes.json` also use `screenshots/...`, `image/...`,
  and `assets/...` paths. Aoi Tori keeps `assets/cover.png` as the 512 x 288 candidate and records
  the path for user review before submission.
- The Health/Review scorecard details visible to logged-out users can change. Aoi Tori can prepare
  for common findings locally, but only the Community dashboard preview scan can confirm the exact
  review result for a submitted release.
