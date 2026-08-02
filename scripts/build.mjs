import { bundle } from "lightningcss";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entryFile = path.join(projectRoot, "src", "index.css");
const outputFile = path.join(projectRoot, "theme.css");

export async function build({ minify = false } = {}) {
  await mkdir(path.dirname(outputFile), { recursive: true });

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

  await writeFile(outputFile, banner + result.code.toString(), "utf8");
  console.log(`Built ${path.relative(projectRoot, outputFile)} (${result.code.length} bytes).`);
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
