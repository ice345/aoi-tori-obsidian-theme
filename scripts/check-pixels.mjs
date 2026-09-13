#!/usr/bin/env node
/*
 * Final pixel check for the Callout surface, the last of the audit's section 8.2 layers.
 *
 * This is the only check that reads what was actually painted rather than what was declared.
 * It needs a renderer, so it is NOT part of `npm run check`: that would put a browser in CI
 * for a theme of static CSS. Capture the fixture with any browser, point this script at the
 * PNGs, and it asserts the samples within a documented tolerance.
 *
 * Capture procedure (record these alongside any result):
 *   1. Serve `.analysis/pixel/px-<mode>.html`, which loads the saved native `app.css` and the
 *      built `theme.css`, at a viewport of 400x200 with devicePixelRatio 1.25.
 *   2. The stage is exactly 400x200 CSS px; the Callout sits at (40,40) and measures 300x120,
 *      with its title and content hidden so no glyph or shadow can fall in a sample band.
 *   3. Screenshot the viewport to `shot-<mode>.png`. CSS coordinate * 1.25 = device pixel.
 *
 * Usage: node scripts/check-pixels.mjs <directory containing shot-dark.png and shot-light.png>
 */
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import path from "node:path";

const CAPTURE_SCALE = 1.25;
const TOLERANCE = 3; // per channel; PNG is lossless, so this only absorbs antialiasing

/* Sample points in CSS coordinates, chosen to avoid every glyph, shadow and antialiased edge. */
const SAMPLES = {
  outside: [10, 10],
  sideEdge: [41, 100],
  gradientStart: [46, 46],
  gradientMiddle: [190, 100],
  gradientEnd: [330, 152]
};

/* Expected painted values. `outside` is the page, `end` is the Callout surface where the
   gradient has fully faded, and `sideEdge` is the semantic colour at full opacity. The
   gradient samples only have to be monotonic between the two, not exact, because the
   gradient position is a rendering detail rather than a token. */
const EXPECTED = {
  dark: {
    outside: [34, 42, 48],
    sideEdge: [127, 195, 232],
    surface: [44, 52, 60]
  },
  light: {
    outside: [251, 250, 248],
    sideEdge: [36, 95, 144],
    surface: [245, 248, 247]
  }
};

function readPng(file) {
  const data = readFileSync(file);
  if (data.subarray(0, 8).toString("binary") !== "\x89PNG\r\n\x1a\n") {
    throw new Error(`${file}: not a PNG`);
  }
  let pos = 8;
  let width = 0;
  let height = 0;
  let depth = 0;
  let colourType = 0;
  let idat = Buffer.alloc(0);
  while (pos < data.length) {
    const length = data.readUInt32BE(pos);
    const type = data.subarray(pos + 4, pos + 8).toString("binary");
    const chunk = data.subarray(pos + 8, pos + 8 + length);
    if (type === "IHDR") {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      depth = chunk[8];
      colourType = chunk[9];
    } else if (type === "IDAT") {
      idat = Buffer.concat([idat, chunk]);
    }
    pos += 12 + length;
  }
  if (depth !== 8 || (colourType !== 2 && colourType !== 6)) {
    throw new Error(`${file}: unsupported PNG (depth ${depth}, colour type ${colourType})`);
  }

  const channels = colourType === 6 ? 4 : 3;
  const stride = width * channels;
  const raw = inflateSync(idat);
  const rows = [];
  let previous = Buffer.alloc(stride);
  let cursor = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[cursor];
    cursor += 1;
    const line = Buffer.from(raw.subarray(cursor, cursor + stride));
    cursor += stride;
    for (let i = 0; i < stride; i += 1) {
      const a = i >= channels ? line[i - channels] : 0;
      const b = previous[i];
      const c = i >= channels ? previous[i - channels] : 0;
      if (filter === 1) line[i] = (line[i] + a) & 255;
      else if (filter === 2) line[i] = (line[i] + b) & 255;
      else if (filter === 3) line[i] = (line[i] + ((a + b) >> 1)) & 255;
      else if (filter === 4) {
        const pa = Math.abs(b - c);
        const pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        line[i] = (line[i] + pr) & 255;
      }
    }
    rows.push(line);
    previous = line;
  }
  return { width, height, channels, rows };
}

function sample(image, cssX, cssY) {
  const x = Math.round(cssX * CAPTURE_SCALE);
  const y = Math.round(cssY * CAPTURE_SCALE);
  const offset = x * image.channels;
  const row = image.rows[y];
  return [row[offset], row[offset + 1], row[offset + 2]];
}

function close(actual, expected) {
  return actual.every((value, index) => Math.abs(value - expected[index]) <= TOLERANCE);
}

function hex(rgb) {
  return `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const directory = process.argv[2];
if (!directory) {
  console.error(
    "usage: node scripts/check-pixels.mjs <directory with shot-dark.png and shot-light.png>"
  );
  process.exit(2);
}

let failed = 0;
for (const mode of ["dark", "light"]) {
  const file = path.join(directory, `shot-${mode}.png`);
  let image;
  try {
    image = readPng(file);
  } catch (error) {
    console.error(`${mode}: ${error.message}`);
    failed += 1;
    continue;
  }

  const painted = Object.fromEntries(
    Object.entries(SAMPLES).map(([name, [x, y]]) => [name, sample(image, x, y)])
  );
  const expected = EXPECTED[mode];
  const problems = [];

  if (!close(painted.outside, expected.outside)) {
    problems.push(`page is ${hex(painted.outside)}, expected ${hex(expected.outside)}`);
  }
  if (!close(painted.sideEdge, expected.sideEdge)) {
    problems.push(
      `the inline-start edge painted ${hex(painted.sideEdge)}, expected ${hex(expected.sideEdge)}; a zero-width or blended edge shows the page instead`
    );
  }
  /* The whole point of the dark repair: the container must paint something other than the
     page. Before it, this sample and `outside` were the same colour in dark mode. */
  if (close(painted.gradientEnd, painted.outside)) {
    problems.push(
      `the Callout interior painted ${hex(painted.gradientEnd)}, the same as the page; the container is invisible`
    );
  }
  if (!close(painted.gradientEnd, expected.surface)) {
    problems.push(
      `the Callout interior painted ${hex(painted.gradientEnd)}, expected the surface ${hex(expected.surface)}`
    );
  }
  /* The wash must fade toward the surface along the gradient. Its sign differs by mode: it
     brightens a dark surface and darkens a light one, so the check is the distance from the
     surface colour rather than the luminance direction. */
  const distance = (rgb) =>
    rgb.reduce((total, value, index) => total + Math.abs(value - expected.surface[index]), 0);
  const wash = ["gradientStart", "gradientMiddle", "gradientEnd"].map((name) =>
    distance(painted[name])
  );
  const fades = wash[0] > wash[1] && wash[1] > wash[2] && wash[2] <= TOLERANCE * 3;
  if (!fades) {
    problems.push(
      `the wash does not fade toward the surface: distance ${wash.join(" -> ")} from ${hex(expected.surface)}`
    );
  }

  console.log(
    `${mode}: ${image.width}x${image.height} px, scale ${CAPTURE_SCALE}, tolerance ${TOLERANCE}`
  );
  for (const [name, rgb] of Object.entries(painted)) {
    console.log(`  ${name.padEnd(16)} ${hex(rgb)}`);
  }
  if (problems.length) {
    failed += 1;
    for (const problem of problems) console.error(`  FAIL ${problem}`);
  }
}

if (failed) {
  console.error(`\n${failed} mode${failed === 1 ? "" : "s"} failed the pixel check.`);
  process.exitCode = 1;
} else {
  console.log("\nBoth modes paint the surface, the semantic edge and a fading wash.");
}
