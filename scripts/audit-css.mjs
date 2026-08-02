import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(projectRoot, "src");
const themeFile = path.join(projectRoot, "theme.css");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".css")) {
      files.push(fullPath);
    }
  }

  return files;
}

function relative(filePath) {
  return path.relative(projectRoot, filePath);
}

function approximateSelectorDepth(css) {
  const depths = [];
  // Comments and statement at-rules such as @import are not selector text. Requiring a rule
  // boundary also prevents preceding imports/declarations from being joined to the next rule.
  const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rulePattern = /(?:^|[{};])\s*([^@{};][^{};]*)\{/g;
  let match;

  while ((match = rulePattern.exec(cssWithoutComments)) !== null) {
    const selectorGroup = match[1].trim();
    if (!selectorGroup || selectorGroup.includes(":root") || selectorGroup.includes("--")) {
      continue;
    }

    for (const selector of selectorGroup.split(",")) {
      const depth = selector
        .trim()
        .split(/\s+|>|\+|~/)
        .filter(Boolean).length;
      depths.push({ selector: selector.trim(), depth });
    }
  }

  return depths;
}

const failures = [];
const warnings = [];
const sourceFiles = await walk(srcRoot);

for (const filePath of sourceFiles) {
  const css = await readFile(filePath, "utf8");
  const file = relative(filePath);

  if (/!important\b/.test(css)) {
    failures.push(`${file}: contains !important`);
  }

  if (/:has\(/.test(css)) {
    failures.push(`${file}: contains :has(); document and explicitly allow it before use`);
  }

  if (/url\(\s*["']?https?:\/\//i.test(css)) {
    failures.push(`${file}: contains a remote URL`);
  }

  if (/data:[^;,)]+;base64,/i.test(css)) {
    failures.push(`${file}: contains a Base64 asset`);
  }

  if (/(^|[,{]\s*)img\s*[{,]/m.test(css)) {
    failures.push(`${file}: contains a destructive global img selector`);
  }

  const isTokenFile = file.startsWith(`src${path.sep}tokens${path.sep}`);
  if (!isTokenFile && /#[0-9a-fA-F]{3,8}\b/.test(css)) {
    failures.push(`${file}: contains a hex color outside src/tokens`);
  }

  for (const { selector, depth } of approximateSelectorDepth(css)) {
    if (depth > 4) {
      failures.push(`${file}: selector depth ${depth} exceeds 4: ${selector}`);
    }
  }
}

const builtCss = await readFile(themeFile, "utf8").catch(() => null);
if (!builtCss) {
  failures.push("theme.css is missing; run npm run build");
} else {
  const bytes = Buffer.byteLength(builtCss);
  if (bytes > 300_000) {
    warnings.push(`theme.css is ${bytes} bytes; review size before release`);
  }
}

if (warnings.length) {
  console.warn("Audit warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (failures.length) {
  console.error("Audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Audit passed for ${sourceFiles.length} source CSS files.`);
}
