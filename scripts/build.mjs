import { bundle } from "lightningcss";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entryFile = path.join(projectRoot, "src", "index.css");
const outputFile = path.join(projectRoot, "theme.css");
const styleSettingsFile = path.join(projectRoot, "src", "settings", "style-settings.css");

export async function build({ minify = false } = {}) {
  await mkdir(path.dirname(outputFile), { recursive: true });

  const styleSettingsSource = await readFile(styleSettingsFile, "utf8");
  const styleSettingsMetadata = styleSettingsSource.match(/\/\*\s*@settings[\s\S]*?\*\//)?.[0];
  if (!styleSettingsMetadata) {
    throw new Error(
      "Style Settings metadata block is missing from src/settings/style-settings.css"
    );
  }

  const result = bundle({
    filename: entryFile,
    minify,
    sourceMap: false,
    errorRecovery: false,
    drafts: {
      nesting: true
    }
  });

  const banner = [
    "/*",
    " * Aoi Tori — generated from src/index.css",
    " * Do not edit theme.css directly.",
    ` * Build mode: ${minify ? "release/minified" : "development/readable"}`,
    " */",
    ""
  ].join("\n");

  const output = `${banner}${styleSettingsMetadata}\n\n${result.code.toString()}`;
  await writeFile(outputFile, output, "utf8");
  console.log(
    `Built ${path.relative(projectRoot, outputFile)} (${Buffer.byteLength(output)} bytes).`
  );
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  const minify = process.argv.includes("--minify");
  build({ minify }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
