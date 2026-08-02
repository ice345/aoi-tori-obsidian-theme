import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(projectRoot, "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const required = ["name", "version", "minAppVersion", "author"];
const failures = [];

for (const field of required) {
  if (typeof manifest[field] !== "string" || !manifest[field].trim()) {
    failures.push(`Missing or invalid string field: ${field}`);
  }
}

if (manifest.name?.includes("Obsidian") || manifest.name?.includes("Theme")) {
  failures.push('Theme name should not include "Obsidian" or "Theme".');
}

if (!/^\d+\.\d+\.\d+$/.test(manifest.version ?? "")) {
  failures.push("version must use x.y.z semantic version format");
}

if (!/^\d+\.\d+\.\d+$/.test(manifest.minAppVersion ?? "")) {
  failures.push("minAppVersion must use x.y.z format");
}

if (manifest.authorUrl && !/^https:\/\//.test(manifest.authorUrl)) {
  failures.push("authorUrl must use https");
}

if (failures.length) {
  console.error("Manifest validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("manifest.json is valid for this repository's checks.");
}
