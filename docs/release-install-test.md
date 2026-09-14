# Release install test

Status: Phase 5A `0.9.0` clean-install package test, 2026-08-03 (Asia/Shanghai).

## Environment

| Item                           | Value                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Host OS                        | macOS 26.5, Apple silicon                                                                                    |
| Obsidian app available         | `/Applications/Obsidian.app`                                                                                 |
| Installed app version evidence | Obsidian log reports latest/app up to date at `1.13.4`                                                       |
| Package source                 | `dist/Aoi Tori/`                                                                                             |
| Clean test Vault               | `.analysis/phase-5A-clean-install-vault/`                                                                    |
| Clean test user data           | `.analysis/phase-5A-obsidian-user-data/`                                                                     |
| Existing user Vault restored   | Yes; the main `obsidian.json` was restored from `.analysis/phase-5A-obsidian-json-before-clean-install.json` |

The clean Vault and isolated user-data directory are ignored local QA artifacts and are not release
assets.

## Package install file check

`dist/Aoi Tori/` contains exactly:

```text
manifest.json
theme.css
```

The files were copied into:

```text
.analysis/phase-5A-clean-install-vault/.obsidian/themes/Aoi Tori/
```

The copied files match the package SHA-256 values:

| File            |  Bytes | SHA-256                                                            |
| --------------- | -----: | ------------------------------------------------------------------ |
| `manifest.json` |    142 | `63c43169f73761b4a0dc3ec21ff2898b472526c9b4e7100e689864238abf08ae` |
| `theme.css`     | 72,192 | `2544be4254d210bfd1dbaf4af10ba431cfb024f68d3b8ac8b60322eb0fed27f4` |

Installed manifest:

```json
{
  "name": "Aoi Tori",
  "version": "0.9.0",
  "minAppVersion": "1.13.4",
  "author": "ice345",
  "authorUrl": "https://github.com/ice345"
}
```

Static package checks passed:

- no `/Users/ice/...` path in packaged CSS;
- no remote `url(http...)` CSS resource;
- no Base64 asset;
- no `.analysis/`, `test-vault-content/`, or `references/raw/` path;
- no dependency on `src/`, `node_modules/`, or the development Vault directory;
- no package file beyond `manifest.json` and `theme.css`.

## Obsidian launch attempt

Attempted methods:

1. `open -a Obsidian .analysis/phase-5A-clean-install-vault`
2. `obsidian://open?path=.../Release Candidate Smoke Test.md`
3. Temporary registration in the main Obsidian `obsidian.json`, followed by a normal quit/reopen
   attempt.
4. Separate isolated launch with `--user-data-dir=.analysis/phase-5A-obsidian-user-data`.

Results:

- The first two methods kept the already-running main Obsidian instance on `test-vault-content`.
- The normal quit request returned `User canceled`, so the app was not force-killed.
- The main `obsidian.json` was restored to its previous vault list.
- The isolated process started with the clean user-data path, but it did not expose a clean-install
  Obsidian window through System Events and later exited after writing only update-check log lines.

## Test matrix

| Check                                     | Result   | Evidence / limitation                                                                                                |
| ----------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| Package files copied from `dist/Aoi Tori` | Pass     | SHA-256 matches package output exactly.                                                                              |
| Manifest name and version                 | Pass     | `Aoi Tori` / `0.9.0` present in copied manifest.                                                                     |
| No source or dependency reliance          | Pass     | Static CSS/package audit found no `src/`, `node_modules`, local path, test path, remote URL, or Base64 dependency.   |
| Obsidian recognizes theme in clean Vault  | Untested | Could not switch the active app window to the clean Vault without force-killing the existing user instance.          |
| Light mode from clean package             | Untested | Requires successful clean-Vault UI launch.                                                                           |
| Dark mode from clean package              | Untested | Requires successful clean-Vault UI launch.                                                                           |
| Style Settings absent                     | Untested | Requires successful clean-Vault UI launch.                                                                           |
| Style Settings installed                  | Untested | Requires successful clean-Vault UI launch and plugin installation in that clean Vault.                               |
| Restart persistence                       | Untested | Normal quit was canceled; no force-kill was used.                                                                    |
| Console resource errors                   | Partial  | Static package contains no remote/local resource references; renderer Console was not reachable for the clean Vault. |

## Conclusion

The release package is clean and self-contained at the file level, but the real Obsidian clean-Vault
UI launch was not completed in this running desktop session. Before a true public release, repeat
this test after closing Obsidian normally or on a fresh user account, then confirm theme selection,
light/dark switching, Style Settings absent/present behavior, restart persistence, and Console
resource state.
