import { bundle } from "lightningcss";
import prettier from "prettier";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entryFile = path.join(projectRoot, "src", "index.css");
const styleSettingsFile = path.join(projectRoot, "src", "settings", "style-settings.css");

export async function build({ outputFile, minify = false } = {}) {
  if (!outputFile) {
    throw new Error("build() requires an explicit outputFile path");
  }

  const resolvedOutputFile = path.resolve(projectRoot, outputFile);
  await mkdir(path.dirname(resolvedOutputFile), { recursive: true });

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
    " * Aoi Tori - generated theme artifact",
    " * Do not edit generated CSS directly.",
    ` * Build mode: ${minify ? "release/minified" : "development/readable"}`,
    " */",
    ""
  ].join("\n");

  const bundledCss = result.code.toString();
  // The readable root artifact is formatted with the repository's Prettier CSS parser. The
  // complete metadata comment is included in the same parse, while minified package output
  // intentionally skips formatting so its CSS body stays compact.
  const rawOutput = `${banner}${styleSettingsMetadata}\n\n${bundledCss}`;
  const prettierConfig = minify ? null : await prettier.resolveConfig(resolvedOutputFile);
  const output = minify
    ? rawOutput
    : await prettier.format(rawOutput, { ...prettierConfig, parser: "css" });
  await writeFile(resolvedOutputFile, output, "utf8");
  console.log(
    `Built ${path.relative(projectRoot, resolvedOutputFile)} (${Buffer.byteLength(output)} bytes).`
  );
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  const minify = process.argv.includes("--minify");
  const outputFlagIndex = process.argv.indexOf("--output-file");
  const outputFile = outputFlagIndex >= 0 ? process.argv[outputFlagIndex + 1] : "theme.css";

  if (!outputFile || outputFile.startsWith("--")) {
    console.error("--output-file requires a path");
    process.exitCode = 1;
  } else {
    build({ outputFile, minify }).catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  }
}
