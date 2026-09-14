import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { build } from "./build.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(projectRoot, "dist");
/* The release folder carries the theme's spaced name, matching `manifest.json`'s `name`. */
const packageRoot = path.join(distRoot, "Aoi Tori");
const allowedFiles = ["manifest.json", "theme.css"];

function relative(filePath) {
  return path.relative(projectRoot, filePath);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: "inherit",
      shell: false
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
      }
    });
  });
}

async function assertSafePackageRoot() {
  const resolvedDist = path.resolve(distRoot);
  const resolvedPackage = path.resolve(packageRoot);

  if (!resolvedPackage.startsWith(`${resolvedDist}${path.sep}`)) {
    throw new Error(`Refusing to rebuild outside dist/: ${resolvedPackage}`);
  }

  if (resolvedPackage === resolvedDist || resolvedPackage === projectRoot) {
    throw new Error(`Refusing to rebuild broad path: ${resolvedPackage}`);
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function auditPackagedText(file, text) {
  const failures = [];

  if (text.includes(projectRoot) || /\/Users\/ice\//.test(text)) {
    failures.push(`${file}: contains a local absolute path`);
  }

  if (/url\(\s*["']?https?:\/\//i.test(text)) {
    failures.push(`${file}: contains a remote CSS resource`);
  }

  if (/data:[^;,)]+;base64,/i.test(text)) {
    failures.push(`${file}: contains a Base64 asset`);
  }

  for (const marker of [
    ".analysis/",
    "references/",
    "test-vault-content/",
    "node_modules/",
    "src/",
    "scripts/",
    "docs/"
  ]) {
    if (text.includes(marker)) {
      failures.push(`${file}: contains release-excluded marker ${marker}`);
    }
  }

  return failures;
}

async function sha256(filePath) {
  const data = await readFile(filePath);
  return createHash("sha256").update(data).digest("hex");
}

async function packageTheme() {
  await assertSafePackageRoot();
  await run("npm", ["run", "check"]);

  await mkdir(distRoot, { recursive: true });
  await rm(packageRoot, { recursive: true, force: true });
  await mkdir(packageRoot, { recursive: true });

  await build({ outputFile: path.join(packageRoot, "theme.css"), minify: true });

  await cp(path.join(projectRoot, "manifest.json"), path.join(packageRoot, "manifest.json"));

  const packagedFiles = await walk(packageRoot);
  const packagedRelative = packagedFiles
    .map((file) => path.relative(packageRoot, file))
    .sort((a, b) => a.localeCompare(b));

  const failures = [];
  for (const file of packagedRelative) {
    if (!allowedFiles.includes(file)) {
      failures.push(`Unexpected packaged file: ${file}`);
    }
  }

  for (const expected of allowedFiles) {
    if (!packagedRelative.includes(expected)) {
      failures.push(`Missing packaged file: ${expected}`);
    }
  }

  const lines = [];
  let totalBytes = 0;
  for (const relativeFile of packagedRelative) {
    const filePath = path.join(packageRoot, relativeFile);
    const fileStat = await stat(filePath);
    totalBytes += fileStat.size;
    const text = await readFile(filePath, "utf8");
    failures.push(...auditPackagedText(relativeFile, text));
    lines.push({
      file: relativeFile,
      bytes: fileStat.size,
      sha256: await sha256(filePath)
    });
  }

  if (failures.length) {
    console.error("Release package audit failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Packaged ${relative(packageRoot)} (${totalBytes} bytes):`);
  for (const line of lines) {
    console.log(`${line.sha256}  ${line.file}  ${line.bytes} bytes`);
  }
}

packageTheme().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
