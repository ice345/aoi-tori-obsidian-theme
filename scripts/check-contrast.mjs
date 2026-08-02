import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pairFile = path.join(projectRoot, "docs", "contrast-pairs.json");

function parseVariables(css) {
  const variables = new Map();
  const pattern = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match;

  while ((match = pattern.exec(css)) !== null) {
    variables.set(match[1], match[2].trim());
  }

  return variables;
}

function resolveValue(name, variables, stack = []) {
  if (stack.includes(name)) {
    throw new Error(`Circular variable reference: ${[...stack, name].join(" -> ")}`);
  }

  const raw = variables.get(name);
  if (!raw) throw new Error(`Unknown variable: ${name}`);

  const variableMatch = raw.match(/^var\((--[a-z0-9-]+)\)$/i);
  if (variableMatch) {
    return resolveValue(variableMatch[1], variables, [...stack, name]);
  }

  return raw;
}

function parseHex(value) {
  const hex = value.trim().toLowerCase();
  if (!/^#[0-9a-f]{6}$/.test(hex)) {
    throw new Error(`Contrast checker supports six-digit hex values only, received: ${value}`);
  }

  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16)
  ];
}

function linearize(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(rgb) {
  const [red, green, blue] = rgb.map(linearize);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

const pairs = JSON.parse(await readFile(pairFile, "utf8"));
const failures = [];

for (const pair of pairs) {
  const variables = new Map();

  for (const relativeFile of pair.sources) {
    const css = await readFile(path.join(projectRoot, relativeFile), "utf8");
    for (const [name, value] of parseVariables(css)) {
      variables.set(name, value);
    }
  }

  try {
    const foregroundValue = resolveValue(pair.foreground, variables);
    const backgroundValue = resolveValue(pair.background, variables);
    const ratio = contrastRatio(parseHex(foregroundValue), parseHex(backgroundValue));
    const formatted = ratio.toFixed(2);

    console.log(`${pair.name}: ${formatted}:1 (minimum ${pair.minimum}:1)`);

    if (ratio < pair.minimum) {
      failures.push(`${pair.name}: ${formatted}:1 is below ${pair.minimum}:1`);
    }
  } catch (error) {
    failures.push(`${pair.name}: ${error.message}`);
  }
}

if (failures.length) {
  console.error("\nContrast check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("\nAll configured contrast pairs passed.");
}
