import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "lightningcss";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const themeFile = path.join(projectRoot, "theme.css");
const MINIMUM_RATIO = 4.5;

const TEXT_TOKENS = [
  "--nav-item-color",
  "--nav-heading-color",
  "--tab-text-color",
  "--status-bar-text-color",
  "--titlebar-text-color"
];

const SIDEBAR_TEXT_TOKENS = ["--nav-item-color", "--nav-heading-color", "--tab-text-color"];

const NAV_STATES = [
  { id: "nav", color: "--nav-item-color", background: null },
  { id: "nav-hover", color: "--nav-item-color-hover", background: "--nav-item-background-hover" },
  {
    id: "nav-active",
    color: "--nav-item-color-active",
    background: "--nav-item-background-active"
  },
  // Selected is consumed by Obsidian core `.tree-item-self.is-selected`, not by this
  // theme. Resolve the tokens directly; do not require a theme `.is-selected` rule.
  {
    id: "nav-selected",
    color: "--nav-item-color-selected",
    background: "--nav-item-background-selected"
  },
  { id: "nav-focus", color: "--nav-item-color", background: null }
];

const MODES = ["theme-light", "theme-dark"];
const SIDEBARS = [
  { id: "duet", className: null },
  { id: "cloud", className: "aoi-sidebar-cloud" },
  { id: "mist", className: "aoi-sidebar-mist" },
  { id: "aqua", className: "aoi-sidebar-aqua" }
];
const SKIES = [
  { id: "quiet", className: "aoi-sky-quiet" },
  { id: "balanced", className: "aoi-sky-balanced" },
  { id: "clear", className: "aoi-sky-clear" }
];
const CONTRASTS = [
  { id: "none", className: null },
  { id: "soft", className: "aoi-sidebar-contrast-soft" },
  { id: "strong", className: "aoi-sidebar-contrast-strong" }
];
const ACCESSIBILITY = [
  { id: "none", className: null, prefersContrast: false },
  { id: "high-contrast", className: "aoi-high-contrast", prefersContrast: false },
  { id: "contrast-high", className: null, prefersContrast: false, modeClass: true },
  { id: "prefers-contrast", className: null, prefersContrast: true }
];
const MEDIA = [
  { id: "none", forcedColors: false },
  { id: "forced-colors", forcedColors: true }
];

const CORE_VALUES = new Map([
  ["--font-light", { kind: "number", value: 300 }],
  ["--font-normal", { kind: "number", value: 400 }],
  ["--font-medium", { kind: "number", value: 500 }],
  ["--font-semibold", { kind: "number", value: 600 }],
  ["--font-bold", { kind: "number", value: 700 }],
  ["--font-ui-small", { kind: "length", value: 13, unit: "px" }],
  ["--font-ui-smaller", { kind: "length", value: 12, unit: "px" }]
]);

const FORCED_COLOR_EXPECTATIONS = [
  ["--aoi-workspace-left-surface", "Canvas"],
  ["--aoi-workspace-right-surface", "Canvas"],
  ["--background-primary", "Canvas"],
  ["--nav-item-color", "CanvasText"],
  ["--nav-heading-color", "CanvasText"],
  ["--tab-text-color", "CanvasText"],
  ["--status-bar-text-color", "CanvasText"],
  ["--titlebar-text-color", "CanvasText"],
  ["--nav-item-color-active", "CanvasText"],
  ["--nav-item-color-selected", "CanvasText"],
  ["--tab-text-color-focused-active-current", "CanvasText"],
  ["--text-muted", "CanvasText"],
  ["--text-faint", "GrayText"],
  ["--icon-color", "ButtonText"],
  ["--background-modifier-border", "CanvasText"]
];

const FORCED_COLOR_NEGATIVES = [
  ["aoi-cobalt-decisive"],
  ["aoi-paper-warmer"],
  ["aoi-high-contrast"],
  ["aoi-light-contrast-high"],
  ["aoi-stronger-borders"],
  [
    "aoi-cobalt-decisive",
    "aoi-paper-warmer",
    "aoi-high-contrast",
    "aoi-light-contrast-high",
    "aoi-stronger-borders"
  ]
];

if (!existsSync(themeFile)) {
  console.error("theme.css is missing; run npm run build");
  process.exit(1);
}

const source = await readFile(themeFile);
const normalised = transform({
  filename: "theme.css",
  code: source,
  minify: false,
  errorRecovery: false
});

const customRules = [];
let ruleOrder = 0;

/* Obsidian's own `app.css` is not shipped with the theme and cannot be redistributed,
   but several values the theme declares lose to it by inheritance rather than
   specificity: `body` is a type selector, so a `:root` declaration is outranked by it
   no matter which stylesheet the browser parsed last. Without this layer the harness
   resolves the theme's own `:root` values and reports a pass for a theme that renders
   nothing, which is how D01-D05 survived the existing gates.

   Only the declarations the contract depends on are reproduced here, written by hand
   from Obsidian 1.13.7 `app.css`. The full native stylesheet is not bundled. Parsed
   first, so these carry the lowest source order and lose ties the way the real load
   order does. */
const NATIVE_CORE_CONTRACT = `
body {
  --callout-border-width: 0px;
  --callout-blend-mode: var(--highlight-mix-blend-mode);
  --callout-content-background: transparent;
  --code-border-width: 0px;
}
.theme-light {
  --highlight-mix-blend-mode: darken;
}
.theme-dark {
  --highlight-mix-blend-mode: lighten;
}
`;

function parseCustomRules(code, filename) {
  transform({
    filename,
    code: typeof code === "string" ? Buffer.from(code) : code,
    minify: false,
    errorRecovery: false,
    visitor: {
      StyleSheet(stylesheet) {
        collectRules(stylesheet.rules, []);
      }
    }
  });
}

parseCustomRules(NATIVE_CORE_CONTRACT, "native-core-contract.css");
parseCustomRules(normalised.code, "theme.css");

function collectRules(rules, mediaStack) {
  for (const rule of rules) {
    if (rule.type === "media") {
      collectRules(rule.value.rules, [...mediaStack, rule.value.query]);
      continue;
    }

    if (rule.type !== "style") continue;

    const declarations = new Map();
    for (const declaration of rule.value.declarations?.declarations ?? []) {
      if (declaration.property !== "custom") continue;
      const name = String(declaration.value.name);
      if (!name.startsWith("--")) continue;
      declarations.set(name, declaration.value.value);
    }

    if (declarations.size === 0) continue;

    for (const selector of rule.value.selectors) {
      assertSelectorSupported(selector);
    }

    customRules.push({
      selectors: rule.value.selectors,
      declarations,
      order: ruleOrder++,
      media: mediaStack
    });
  }
}

function serializeSelector(selector) {
  return selector.map(serializeComponent).join("");
}

function serializeComponent(component) {
  switch (component.type) {
    case "type":
      return component.name;
    case "class":
      return `.${component.name}`;
    case "id":
      return `#${component.name}`;
    case "universal":
      return "*";
    case "attribute": {
      const operation = component.operation
        ? `${operatorToken(component.operation.operator)}"${component.operation.value}"`
        : "";
      return `[${component.name}${operation}]`;
    }
    case "combinator":
      if (component.value === "descendant") return " ";
      if (component.value === "child") return " > ";
      if (component.value === "next-sibling") return " + ";
      if (component.value === "later-sibling") return " ~ ";
      return ` ${component.value} `;
    case "pseudo-class":
      if (component.selectors) {
        return `:${component.kind}(${component.selectors.map(serializeSelector).join(", ")})`;
      }
      return `:${component.kind}`;
    case "pseudo-element":
      return `::${component.kind ?? component.name}`;
    default:
      return `<${component.type}>`;
  }
}

function operatorToken(operator) {
  switch (operator) {
    case "equal":
      return "=";
    case "includes":
      return "~=";
    case "dash-match":
      return "|=";
    case "prefix":
      return "^=";
    case "substring":
      return "*=";
    case "suffix":
      return "$=";
    default:
      return "=";
  }
}

function unsupportedSelector(selector, reason) {
  throw new Error(
    `Unsupported selector for cascade matching (${reason}): ${serializeSelector(selector)}`
  );
}

function assertSelectorSupported(selector) {
  for (const component of selector) {
    assertComponentSupported(component, selector);
  }
}

function assertComponentSupported(component, selector) {
  switch (component.type) {
    case "type":
    case "class":
    case "id":
    case "universal":
    case "attribute":
    case "pseudo-element":
      return;
    case "combinator":
      if (
        component.value === "descendant" ||
        component.value === "child" ||
        component.value === "next-sibling" ||
        component.value === "later-sibling"
      ) {
        return;
      }
      unsupportedSelector(selector, `combinator ${component.value}`);
      return;
    case "pseudo-class": {
      const kind = component.kind;
      if (
        kind === "root" ||
        kind === "hover" ||
        kind === "active" ||
        kind === "focus" ||
        kind === "focus-visible" ||
        kind === "focus-within" ||
        kind === "disabled"
      ) {
        return;
      }
      if (kind === "is" || kind === "where" || kind === "not") {
        for (const inner of component.selectors) assertSelectorSupported(inner);
        return;
      }
      unsupportedSelector(selector, `pseudo-class :${kind}`);
      return;
    }
    default:
      unsupportedSelector(selector, `component type ${component.type}`);
  }
}

function specificityOfSelector(selector) {
  let spec = [0, 0, 0];
  for (const component of selector) {
    spec = addSpec(spec, specificityOfComponent(component));
  }
  return spec;
}

function specificityOfComponent(component) {
  switch (component.type) {
    case "id":
      return [1, 0, 0];
    case "class":
    case "attribute":
      return [0, 1, 0];
    case "type":
      return [0, 0, 1];
    case "universal":
    case "combinator":
      return [0, 0, 0];
    case "pseudo-element":
      return [0, 0, 1];
    case "pseudo-class":
      if (component.kind === "where") return [0, 0, 0];
      if (component.kind === "is" || component.kind === "not") {
        let best = [0, 0, 0];
        for (const inner of component.selectors) {
          const spec = specificityOfSelector(inner);
          if (compareSpec(spec, best) > 0) best = spec;
        }
        return best;
      }
      return [0, 1, 0];
    default:
      return [0, 0, 0];
  }
}

function addSpec(left, right) {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

function compareSpec(left, right) {
  if (left[0] !== right[0]) return left[0] - right[0];
  if (left[1] !== right[1]) return left[1] - right[1];
  return left[2] - right[2];
}

function splitByCombinator(selector) {
  const parts = [];
  let compound = [];
  let combinatorFromPrev = null;

  for (const component of selector) {
    if (component.type === "combinator") {
      parts.push({ compound, combinatorFromPrev });
      compound = [];
      combinatorFromPrev = component.value;
      continue;
    }
    compound.push(component);
  }

  if (compound.length) parts.push({ compound, combinatorFromPrev });
  return parts;
}

function matchesSelector(selector, element, ancestors) {
  const parts = splitByCombinator(selector);
  if (parts.length === 0) return false;
  return matchChain(parts, parts.length - 1, element, ancestors);
}

function matchChain(parts, index, element, ancestors) {
  if (!matchesCompound(parts[index].compound, element, ancestors)) return false;
  if (index === 0) return true;

  const combinator = parts[index].combinatorFromPrev;
  if (combinator === "child") {
    const parent = ancestors.at(-1);
    if (!parent) return false;
    return matchChain(parts, index - 1, parent, ancestors.slice(0, -1));
  }

  if (combinator === "descendant") {
    for (let ancestorIndex = ancestors.length - 1; ancestorIndex >= 0; ancestorIndex -= 1) {
      if (
        matchChain(parts, index - 1, ancestors[ancestorIndex], ancestors.slice(0, ancestorIndex))
      ) {
        return true;
      }
    }
    return false;
  }

  if (combinator === "next-sibling" || combinator === "later-sibling") return false;
  return false;
}

function matchesCompound(compound, element, ancestors) {
  if (compound.some((component) => component.type === "pseudo-element")) return false;

  return compound.every((component) => matchesSimple(component, element, ancestors));
}

function matchesSimple(component, element, ancestors) {
  switch (component.type) {
    case "universal":
      return true;
    case "type":
      return element.tag === component.name.toLowerCase();
    case "class":
      return element.classes.has(component.name);
    case "id":
      return element.id === component.name;
    case "attribute":
      return matchesAttribute(component, element);
    case "pseudo-class":
      return matchesPseudoClass(component, element, ancestors);
    default:
      return false;
  }
}

function matchesAttribute(component, element) {
  const actual = element.attributes.get(component.name);
  if (actual == null) return false;
  if (!component.operation) return true;

  const expected = component.operation.value;
  switch (component.operation.operator) {
    case "equal":
      return actual === expected;
    case "includes":
      return actual.split(/\s+/).includes(expected);
    case "prefix":
      return actual.startsWith(expected);
    case "suffix":
      return actual.endsWith(expected);
    case "substring":
      return actual.includes(expected);
    case "dash-match":
      return actual === expected || actual.startsWith(`${expected}-`);
    default:
      return false;
  }
}

function matchesPseudoClass(component, element, ancestors) {
  switch (component.kind) {
    case "root":
      return element.tag === "html";
    case "hover":
    case "active":
    case "focus":
    case "focus-visible":
    case "focus-within":
    case "disabled":
      return element.pseudos.has(component.kind);
    case "is":
    case "where":
      return component.selectors.some((inner) => matchesSelector(inner, element, ancestors));
    case "not":
      return component.selectors.every((inner) => !matchesSelector(inner, element, ancestors));
    default:
      return false;
  }
}

function mediaMatches(mediaStack, env) {
  return mediaStack.every((query) => queryListMatches(query, env));
}

function queryListMatches(query, env) {
  const mediaQueries = query.mediaQueries ?? [];
  if (mediaQueries.length === 0) return true;
  return mediaQueries.some((mediaQuery) => singleQueryMatches(mediaQuery, env));
}

function singleQueryMatches(mediaQuery, env) {
  const type = mediaQuery.mediaType;
  const typeMatches = !type || type === "all";
  const conditionMatches = mediaQuery.condition
    ? conditionMatchesEnv(mediaQuery.condition, env)
    : true;
  const matches = typeMatches && conditionMatches;
  return mediaQuery.qualifier === "not" ? !matches : matches;
}

function conditionMatchesEnv(condition, env) {
  switch (condition.type) {
    case "feature":
      return featureMatches(condition.value, env);
    case "not":
      return !conditionMatchesEnv(condition.value, env);
    case "operation":
      if (condition.operator === "and") {
        return condition.conditions.every((inner) => conditionMatchesEnv(inner, env));
      }
      if (condition.operator === "or") {
        return condition.conditions.some((inner) => conditionMatchesEnv(inner, env));
      }
      return false;
    default:
      return false;
  }
}

function featureMatches(feature, env) {
  const name = typeof feature.name === "string" ? feature.name : feature.name;
  if (feature.type === "boolean") {
    if (name === "forced-colors") return env.forcedColors;
    if (name === "prefers-contrast") return env.prefersContrast;
    return false;
  }

  if (feature.type !== "plain") return false;
  const value = feature.value?.type === "ident" ? feature.value.value : null;

  if (name === "forced-colors") return env.forcedColors && value === "active";
  if (name === "prefers-contrast") return env.prefersContrast && value === "more";
  return false;
}

function cascadeCustomProperties(element, ancestors, env, inherited) {
  const specified = new Map(inherited);
  const winners = new Map();

  for (const rule of customRules) {
    if (!mediaMatches(rule.media, env)) continue;

    let bestSpec = null;
    for (const selector of rule.selectors) {
      if (!matchesSelector(selector, element, ancestors)) continue;
      const spec = specificityOfSelector(selector);
      if (!bestSpec || compareSpec(spec, bestSpec) > 0) bestSpec = spec;
    }

    if (!bestSpec) continue;

    for (const [name, value] of rule.declarations) {
      const previous = winners.get(name);
      if (
        !previous ||
        compareSpec(bestSpec, previous.spec) > 0 ||
        (compareSpec(bestSpec, previous.spec) === 0 && rule.order >= previous.order)
      ) {
        winners.set(name, { spec: bestSpec, order: rule.order, value });
      }
    }
  }

  for (const [name, winner] of winners) specified.set(name, winner.value);
  return specified;
}

function isWhitespaceToken(token) {
  return (
    token.type === "token" && (token.value.type === "white-space" || token.value.type === "comment")
  );
}

function compactTokens(tokens) {
  return tokens.filter((token) => !isWhitespaceToken(token));
}

function resolveSpecified(specified) {
  const resolved = new Map();
  const unresolved = new Set();

  function resolveName(name, stack, fromVar) {
    if (resolved.has(name)) return resolved.get(name);
    if (CORE_VALUES.has(name)) return CORE_VALUES.get(name);
    if (stack.has(name)) {
      throw new Error(`Circular variable reference: ${[...stack, name].join(" -> ")}`);
    }

    const entry = specified.get(name);

    /* An entry that is already a resolved value came from an ancestor, where it was
       evaluated in that ancestor's own context. A custom property whose `var()`
       references something that does not exist at its declaring element becomes
       invalid there and inherits as invalid — it does not get a second chance to
       resolve against the descendant's variables. Re-resolving it here would make the
       harness accept aliases that a browser drops, which is exactly the D04/D05 bug. */
    if (entry && !Array.isArray(entry)) {
      resolved.set(name, entry);
      return entry;
    }

    if (!entry) {
      const value = fromVar
        ? (unresolved.add(name), { kind: "unresolved", name })
        : { kind: "unset" };
      resolved.set(name, value);
      return value;
    }

    stack.add(name);
    const value = evalTokens(entry, (ref) => resolveName(ref, stack, true));
    stack.delete(name);
    resolved.set(name, value);
    return value;
  }

  /* Every declaration on this element is resolved, not just the ones a caller asks
     for, because the whole resolved set is what inherits to the child. `entries` is
     that set: a child inherits finished values, never a pending `var()`.
     Resolution here is best-effort: a declaration the evaluator cannot model is kept
     as unsupported rather than thrown, because nothing has asked for it yet. It still
     throws if an assertion later requests that specific name. */
  for (const name of specified.keys()) {
    try {
      resolveName(name, new Set(), false);
    } catch {
      resolved.set(name, { kind: "unsupported", name });
    }
  }

  return {
    get(name) {
      return resolveName(name, new Set(), false);
    },
    entries: resolved,
    unresolved
  };
}

function evalTokens(tokens, lookup) {
  const compact = compactTokens(tokens);
  if (compact.length === 0) return { kind: "empty" };
  if (compact.length === 1) return evalOne(compact[0], lookup);
  return { kind: "list", tokens: compact };
}

function evalOne(token, lookup) {
  if (token.type === "color") return evalColor(token.value);
  if (token.type === "var") return lookup(token.value.name.ident);
  if (token.type === "function") {
    if (token.value.name === "color-mix") return evalColorMix(token.value.arguments, lookup);
    throw new Error(`Unsupported function: ${token.value.name}`);
  }
  if (token.type === "token") return evalRawToken(token.value, lookup);
  if (token.type === "length") {
    return { kind: "length", value: token.value.value, unit: token.value.unit };
  }
  if (token.type === "time") return { kind: "time", value: token.value };
  throw new Error(`Unsupported token type: ${token.type}`);
}

function evalRawToken(token) {
  switch (token.type) {
    case "ident":
      return evalIdent(token.value);
    case "percentage":
      return { kind: "percentage", value: token.value };
    case "number":
      return { kind: "number", value: token.value };
    case "hash":
      return parseHexColor(`#${token.value}`);
    case "string":
      return { kind: "string", value: token.value };
    default:
      throw new Error(`Unsupported raw token: ${token.type}`);
  }
}

function evalIdent(name) {
  const lower = name.toLowerCase();
  if (lower === "transparent") return { kind: "color", r: 0, g: 0, b: 0, a: 0 };
  if (
    lower === "canvas" ||
    lower === "canvastext" ||
    lower === "graytext" ||
    lower === "highlight" ||
    lower === "highlighttext" ||
    lower === "linktext" ||
    lower === "buttonface" ||
    lower === "buttontext" ||
    lower === "field" ||
    lower === "fieldtext" ||
    lower === "mark"
  ) {
    return { kind: "system", name: canonicalSystemName(lower) };
  }
  return { kind: "ident", name };
}

function canonicalSystemName(lower) {
  const names = {
    canvas: "Canvas",
    canvastext: "CanvasText",
    graytext: "GrayText",
    highlight: "Highlight",
    highlighttext: "HighlightText",
    linktext: "LinkText",
    buttonface: "ButtonFace",
    buttontext: "ButtonText",
    field: "Field",
    fieldtext: "FieldText",
    mark: "Mark"
  };
  return names[lower] ?? lower;
}

function evalColor(color) {
  if (color.type === "rgb") {
    return { kind: "color", r: color.r, g: color.g, b: color.b, a: color.alpha ?? 1 };
  }
  if (typeof color === "string") {
    return evalIdent(color);
  }
  throw new Error(`Unsupported color type: ${color.type ?? color}`);
}

function evalColorMix(args, lookup) {
  const tokens = compactTokens(args);
  let index = 0;

  const inToken = tokens[index++];
  const spaceToken = tokens[index++];
  if (
    inToken?.type !== "token" ||
    inToken.value.type !== "ident" ||
    inToken.value.value !== "in" ||
    spaceToken?.type !== "token" ||
    spaceToken.value.type !== "ident" ||
    spaceToken.value.value !== "srgb"
  ) {
    throw new Error("Only color-mix(in srgb, ...) is supported");
  }

  expectComma(tokens[index++]);
  const colorA = evalOne(tokens[index++], lookup);
  let percentA = null;
  if (tokens[index]?.type === "token" && tokens[index].value.type === "percentage") {
    percentA = tokens[index++].value.value;
  }

  expectComma(tokens[index++]);
  const colorB = evalOne(tokens[index++], lookup);
  let percentB = null;
  if (tokens[index]?.type === "token" && tokens[index].value.type === "percentage") {
    percentB = tokens[index++].value.value;
  }

  if (percentA == null && percentB == null) {
    percentA = 0.5;
    percentB = 0.5;
  } else if (percentA == null) {
    percentA = 1 - percentB;
  } else if (percentB == null) {
    percentB = 1 - percentA;
  }

  return mixSrgb(colorA, percentA, colorB, percentB);
}

function expectComma(token) {
  if (token?.type !== "token" || token.value.type !== "comma") {
    throw new Error("Expected comma in color-mix()");
  }
}

function mixSrgb(colorA, percentA, colorB, percentB) {
  if (colorA.kind === "unresolved") return colorA;
  if (colorB.kind === "unresolved") return colorB;
  if (colorA.kind !== "color" || colorB.kind !== "color") {
    throw new Error("color-mix() requires resolvable sRGB colors");
  }

  const sum = percentA + percentB;
  const weightA = sum === 0 ? 0 : percentA / sum;
  const weightB = sum === 0 ? 0 : percentB / sum;
  const alphaA = colorA.a ?? 1;
  const alphaB = colorB.a ?? 1;
  const alpha = weightA * alphaA + weightB * alphaB;
  if (alpha === 0) return { kind: "color", r: 0, g: 0, b: 0, a: 0 };

  return {
    kind: "color",
    r: (colorA.r * weightA * alphaA + colorB.r * weightB * alphaB) / alpha,
    g: (colorA.g * weightA * alphaA + colorB.g * weightB * alphaB) / alpha,
    b: (colorA.b * weightA * alphaA + colorB.b * weightB * alphaB) / alpha,
    a: alpha
  };
}

function parseHexColor(value) {
  const hex = value.trim().toLowerCase();
  if (!/^#[0-9a-f]{6}$/.test(hex)) {
    throw new Error(`Expected six-digit hex, received: ${value}`);
  }

  return {
    kind: "color",
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
    a: 1
  };
}

function clampChannel(channel) {
  return Math.min(255, Math.max(0, channel));
}

function formatHex(color) {
  const red = Math.round(clampChannel(color.r));
  const green = Math.round(clampChannel(color.g));
  const blue = Math.round(clampChannel(color.b));
  return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function formatValue(value) {
  if (!value) return "<missing>";
  if (value.kind === "color") return formatHex(value);
  if (value.kind === "system") return value.name;
  if (value.kind === "percentage") return `${(value.value * 100).toFixed(2)}%`;
  if (value.kind === "ident") return value.name;
  if (value.kind === "number") return String(value.value);
  if (value.kind === "length") return `${value.value}${value.unit}`;
  if (value.kind === "unset") return "inherit";
  if (value.kind === "unresolved") return `unresolved ${value.name}`;
  return value.kind;
}

function linearize(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(color) {
  const red = linearize(clampChannel(color.r));
  const green = linearize(clampChannel(color.g));
  const blue = linearize(clampChannel(color.b));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

function requireColor(resolved, name) {
  const value = resolved.get(name);
  if (!value) throw new Error(`Missing custom property: ${name}`);
  return value;
}

function compositeOver(foreground, background) {
  if (!foreground || (foreground.kind === "ident" && foreground.name === "transparent")) {
    return background;
  }
  if (foreground.kind === "system") return foreground;
  if (foreground.kind !== "color") return foreground;
  if ((foreground.a ?? 1) >= 1) return foreground;
  if (background.kind !== "color") return background;

  const alpha = foreground.a ?? 1;
  return {
    kind: "color",
    r: foreground.r * alpha + background.r * (1 - alpha),
    g: foreground.g * alpha + background.g * (1 - alpha),
    b: foreground.b * alpha + background.b * (1 - alpha),
    a: 1
  };
}

function washComposite(surface, wash, strength) {
  if (surface.kind === "system") return surface;
  if (surface.kind !== "color" || wash.kind !== "color") return surface;
  const amount = strength.kind === "percentage" ? strength.value : 0;
  return mixSrgb(wash, amount, surface, 1 - amount);
}

function createElement(tag, classNames) {
  const classes = classNames.filter(Boolean);
  return {
    tag,
    id: null,
    classes: new Set(classes),
    attributes: new Map([["class", classes.join(" ")]]),
    pseudos: new Set()
  };
}

function resolveScenario(scenario) {
  /* Obsidian puts the mode class on `body`, not on `html`. Keeping it off `html`
     matters: a `:root` alias that references a mode variable is invalid where it is
     declared, and must not get a second chance by matching the mode class here. */
  const html = createElement("html", []);
  const body = createElement("body", scenario.bodyClasses);
  const env = {
    forcedColors: scenario.forcedColors,
    prefersContrast: scenario.prefersContrast
  };

  /* Each element resolves its own declarations in its own context, and only the
     resulting values inherit. Evaluating an ancestor's declaration on the descendant
     would let a `:root` alias resolve against variables that exist only in the mode
     block, which a browser never does. */
  const htmlSpecified = cascadeCustomProperties(html, [], env, new Map());
  const htmlResolved = resolveSpecified(htmlSpecified);
  const bodySpecified = cascadeCustomProperties(body, [html], env, htmlResolved.entries);
  const resolved = resolveSpecified(bodySpecified);

  const leftSurface = requireColor(resolved, "--aoi-workspace-left-surface");
  const rightSurface = requireColor(resolved, "--aoi-workspace-right-surface");
  const leftWash = requireColor(resolved, "--aoi-workspace-left-wash");
  const rightWash = requireColor(resolved, "--aoi-workspace-right-wash");
  const strength = requireColor(resolved, "--aoi-sidebar-wash-strength");
  const leftBackground = washComposite(leftSurface, leftWash, strength);
  const rightBackground = washComposite(rightSurface, rightWash, strength);

  return {
    scenario,
    resolved,
    leftSurface,
    rightSurface,
    leftBackground,
    rightBackground
  };
}

function scenarioLabel(scenario) {
  const media = scenario.forcedColors ? "forced-colors" : "none";
  const parts = [
    scenario.mode === "theme-light" ? "light" : "dark",
    scenario.sidebar,
    scenario.sky,
    scenario.contrast,
    scenario.accessibility,
    media
  ];
  if (scenario.extra) parts.push(`+${scenario.extra}`);
  return parts.join(" ");
}

function buildScenarios() {
  const scenarios = [];

  for (const mode of MODES) {
    for (const sidebar of SIDEBARS) {
      for (const sky of SKIES) {
        for (const contrast of CONTRASTS) {
          for (const accessibility of ACCESSIBILITY) {
            for (const media of MEDIA) {
              const bodyClasses = [mode, sky.className];
              if (sidebar.className) bodyClasses.push(sidebar.className);
              if (contrast.className) bodyClasses.push(contrast.className);
              if (accessibility.className) bodyClasses.push(accessibility.className);
              if (accessibility.modeClass) {
                bodyClasses.push(
                  mode === "theme-light" ? "aoi-light-contrast-high" : "aoi-dark-contrast-high"
                );
              }

              scenarios.push({
                mode,
                sidebar: sidebar.id,
                sky: sky.id,
                contrast: contrast.id,
                accessibility: accessibility.id,
                forcedColors: media.forcedColors,
                prefersContrast: accessibility.prefersContrast,
                bodyClasses
              });
            }
          }
        }
      }
    }
  }

  for (const extra of FORCED_COLOR_NEGATIVES) {
    scenarios.push({
      mode: "theme-light",
      sidebar: "duet",
      sky: "balanced",
      contrast: "none",
      accessibility: "none",
      forcedColors: true,
      prefersContrast: false,
      extra: extra.join(","),
      bodyClasses: ["theme-light", "aoi-sky-balanced", ...extra]
    });
  }

  return scenarios;
}

function collectContrastPairs(evaluation) {
  const pairs = [];
  const sides = [
    ["left", evaluation.leftBackground],
    ["right", evaluation.rightBackground]
  ];

  for (const token of SIDEBAR_TEXT_TOKENS) {
    const foreground = requireColor(evaluation.resolved, token);
    for (const [side, background] of sides) {
      pairs.push({
        name: `${token} vs ${side}`,
        foreground,
        background
      });
    }
  }

  for (const state of NAV_STATES) {
    const foreground = requireColor(evaluation.resolved, state.color);
    const layer = state.background ? evaluation.resolved.get(state.background) : null;
    for (const [side, sidebar] of sides) {
      pairs.push({
        name: `${state.id} vs ${side}`,
        foreground,
        background: compositeOver(layer, sidebar)
      });
    }
  }

  return pairs;
}

function expectedNavItemWeight(scenario) {
  if (scenario.forcedColors) return 400;
  if (scenario.accessibility === "high-contrast") return 400;
  if (scenario.accessibility === "contrast-high") return 400;
  // Both mode blocks of the prefers-contrast media query reset the weight, so the
  // operating-system preference outranks Soft in light and dark alike.
  if (scenario.prefersContrast) return 400;
  if (scenario.contrast === "soft") return 300;
  return null;
}

function assertNavItemWeight(label, scenario, resolved, failures) {
  const value = resolved.get("--nav-item-weight");
  if (value?.kind === "unresolved") {
    skippedAssertions += 1;
    return;
  }

  const numeric = value?.kind === "number" ? value.value : null;
  const expected = expectedNavItemWeight(scenario);

  if (expected != null) {
    if (numeric !== expected) {
      failures.push(`${label}: --nav-item-weight is ${formatValue(value)}, expected ${expected}`);
    }
    return;
  }

  if (numeric === 300 || numeric === 400) {
    failures.push(`${label}: --nav-item-weight is ${numeric}, expected inherit`);
  }
}

const scenarios = buildScenarios();
const evaluations = scenarios.map((scenario) => {
  const evaluation = resolveScenario(scenario);
  evaluation.label = scenarioLabel(scenario);
  evaluation.key = evaluation.label;
  return evaluation;
});
const byKey = new Map(evaluations.map((evaluation) => [evaluation.key, evaluation]));

const rows = [];
const failures = [];
let skippedAssertions = 0;

for (const evaluation of evaluations) {
  const { scenario, resolved, leftSurface, rightSurface, leftBackground, rightBackground } =
    evaluation;
  const label = evaluation.label;
  let worst = Infinity;
  let worstPair = null;
  let passed = true;

  if (scenario.forcedColors) {
    for (const [name, expected] of FORCED_COLOR_EXPECTATIONS) {
      const value = requireColor(resolved, name);
      if (value.kind === "unresolved") {
        skippedAssertions += 1;
        continue;
      }
      if (value.kind !== "system" || value.name !== expected) {
        passed = false;
        failures.push(`${label}: ${name} resolved to ${formatValue(value)}, expected ${expected}`);
      }
    }

    const weightFailures = failures.length;
    assertNavItemWeight(label, scenario, resolved, failures);
    if (failures.length > weightFailures) passed = false;
    rows.push({ label, worst: "n/a", passed });
    continue;
  }

  const pairs = collectContrastPairs(evaluation);
  for (const pair of pairs) {
    if (pair.foreground.kind === "unresolved" || pair.background.kind === "unresolved") {
      skippedAssertions += 1;
      continue;
    }
    if (pair.foreground.kind !== "color" || pair.background.kind !== "color") {
      passed = false;
      failures.push(
        `${label}: ${pair.name} is not a resolvable sRGB pair (${formatValue(pair.foreground)} on ${formatValue(pair.background)})`
      );
      continue;
    }

    const ratio = contrastRatio(pair.foreground, pair.background);
    if (ratio < worst) {
      worst = ratio;
      worstPair = pair;
    }
    if (ratio < MINIMUM_RATIO) {
      passed = false;
      failures.push(
        `${label}: ${pair.name} ${formatHex(pair.foreground)} on ${formatHex(pair.background)} is ${ratio.toFixed(2)}:1 (minimum ${MINIMUM_RATIO}:1)`
      );
    }
  }

  const weightFailures = failures.length;
  assertNavItemWeight(label, scenario, resolved, failures);
  if (failures.length > weightFailures) passed = false;
  if (scenario.mode === "theme-dark" && scenario.sidebar !== "duet") {
    const duetKey = scenarioLabel({ ...scenario, sidebar: "duet" });
    const duet = byKey.get(duetKey);
    if (!duet) {
      passed = false;
      failures.push(`${label}: missing duet sibling ${duetKey} for dark surface comparison`);
    } else {
      const leftHex = formatValue(leftSurface);
      const rightHex = formatValue(rightSurface);
      const duetLeft = formatValue(duet.leftSurface);
      const duetRight = formatValue(duet.rightSurface);
      if (leftHex !== duetLeft || rightHex !== duetRight) {
        passed = false;
        failures.push(
          `${label}: dark sidebar option changed surfaces (left ${leftHex} / right ${rightHex}, duet ${duetLeft} / ${duetRight})`
        );
      }
    }
  }

  if (scenario.sky === "clear") {
    const leftTintMax = requireColor(resolved, "--aoi-workspace-left-tint-max");
    const rightTintMax = requireColor(resolved, "--aoi-workspace-right-tint-max");
    const aquaTintMax = requireColor(resolved, "--aoi-workspace-tint-max-aqua");
    const leftNight = requireColor(resolved, "--aoi-workspace-left-tint-max-night");
    const rightNight = requireColor(resolved, "--aoi-workspace-right-tint-max-night");

    if (scenario.mode === "theme-light" && scenario.sidebar === "duet") {
      if (formatHex(leftBackground) !== formatHex(leftTintMax)) {
        passed = false;
        failures.push(
          `${label}: derived left wash ${formatHex(leftBackground)} != --aoi-workspace-left-tint-max ${formatHex(leftTintMax)}`
        );
      }
      if (formatHex(rightBackground) !== formatHex(rightTintMax)) {
        passed = false;
        failures.push(
          `${label}: derived right wash ${formatHex(rightBackground)} != --aoi-workspace-right-tint-max ${formatHex(rightTintMax)}`
        );
      }
    }

    if (scenario.mode === "theme-light" && scenario.sidebar === "aqua") {
      if (formatHex(leftBackground) !== formatHex(aquaTintMax)) {
        passed = false;
        failures.push(
          `${label}: derived aqua left wash ${formatHex(leftBackground)} != --aoi-workspace-tint-max-aqua ${formatHex(aquaTintMax)}`
        );
      }
      if (formatHex(rightBackground) !== formatHex(aquaTintMax)) {
        passed = false;
        failures.push(
          `${label}: derived aqua right wash ${formatHex(rightBackground)} != --aoi-workspace-tint-max-aqua ${formatHex(aquaTintMax)}`
        );
      }
    }

    if (scenario.mode === "theme-dark") {
      if (formatHex(leftBackground) !== formatHex(leftNight)) {
        passed = false;
        failures.push(
          `${label}: derived night left wash ${formatHex(leftBackground)} != --aoi-workspace-left-tint-max-night ${formatHex(leftNight)}`
        );
      }
      if (formatHex(rightBackground) !== formatHex(rightNight)) {
        passed = false;
        failures.push(
          `${label}: derived night right wash ${formatHex(rightBackground)} != --aoi-workspace-right-tint-max-night ${formatHex(rightNight)}`
        );
      }
    }
  }

  rows.push({
    label,
    worst: Number.isFinite(worst) ? worst.toFixed(2) : "n/a",
    passed,
    worstPair: worstPair
      ? `${worstPair.name} ${formatValue(worstPair.foreground)} on ${formatValue(worstPair.background)}`
      : ""
  });
}

console.log(
  `Scenario contrast matrix (${rows.length} scenarios, ${customRules.length} custom-property rules)\n`
);
console.log(`${"scenario".padEnd(88)} ${"worst".padStart(6)}  result  pair`);
console.log("-".repeat(150));

for (const row of rows) {
  const result = row.passed ? "pass" : "FAIL";
  const pair = row.worstPair ?? "";
  console.log(
    `${row.label.padEnd(88)} ${String(row.worst).padStart(6)}  ${result.padEnd(6)} ${pair}`
  );
}

if (skippedAssertions) {
  console.log(
    `\nSkipped ${skippedAssertions} assertion${skippedAssertions === 1 ? "" : "s"} that depend on unresolved Obsidian core variables.`
  );
}

/* The native contract layer above is only useful if something fails when the theme
   stops outranking it. These check that the values actually reach a consumer, not
   merely that a declaration exists somewhere. Each one fails on the pre-repair tree,
   where `:root` loses to `body` and the aliases resolve to nothing. */
for (const mode of ["theme-light", "theme-dark"]) {
  const scenario = { mode, bodyClasses: [mode, "aoi-sidebar-contrast-standard"] };
  const evaluation = resolveScenario(scenario);
  const resolved = evaluation.resolved;
  const label = `${mode} native contract`;
  const expectations = [
    ["--callout-border-width", "2px", "loses to the native body 0px"],
    ["--code-border-width", "1px", "loses to the native body 0px"],
    ["--callout-blend-mode", "normal", "inherits lighten/darken from the native chain"],
    ["--aoi-active-line-background", null, "invalid at computed-value time"],
    ["--aoi-image-selection-color", null, "invalid at computed-value time"]
  ];

  for (const [name, expected, why] of expectations) {
    const rendered = formatValue(resolved.get(name));
    const absent =
      rendered === "<missing>" ||
      rendered === "inherit" ||
      rendered === "empty" ||
      rendered.startsWith("unresolved");
    const bad = expected === null ? absent : rendered !== expected;
    if (bad) {
      failures.push(
        `${label}: ${name} resolved to ${rendered}, expected ${expected ?? "a value"} (${why})`
      );
    }
  }
}

/* The border roles exist so that a strengthening setting reaches every boundary
   instead of only `--background-modifier-border`. These assert both halves: that each
   level moves the roles, and that no level drops a control outline below the 3:1
   non-text minimum. Before the roles existed every check here resolved to the mode's
   standard border colour, because the components consumed the primitive directly. */
const BORDER_LEVELS = [
  ["standard", null],
  ["soft", "aoi-border-soft"],
  ["strong", "aoi-border-strong"],
  ["stronger", "aoi-stronger-borders"],
  ["contrast", null]
];

for (const mode of ["theme-light", "theme-dark"]) {
  const roleColor = (evaluation, name) => {
    const value = evaluation.resolved.get(name);
    return value && value.kind === "color" ? value : null;
  };

  const standard = resolveScenario({ mode, bodyClasses: [mode] });
  const standardStructural = roleColor(standard, "--aoi-border-structural");
  const standardControl = roleColor(standard, "--aoi-border-control");

  if (!standardStructural || !standardControl) {
    failures.push(
      `${mode}: the border roles do not resolve, so no setting can reach the components`
    );
    continue;
  }

  /* Only the surfaces that actually carry a control in that mode: a light input or
     checkbox sits on paper or the cloud field fill, never on the night panel, and a
     dark one sits on the night surface, the canvas field, or the panel behind a tag. */
  const surfaceNames =
    mode === "theme-light"
      ? ["--background-primary", "--background-modifier-form-field"]
      : ["--background-primary", "--background-modifier-form-field", "--aoi-night-panel"];

  for (const [level, className] of BORDER_LEVELS.slice(1)) {
    const scenario =
      level === "contrast"
        ? {
            mode,
            bodyClasses: [
              mode,
              mode === "theme-light" ? "aoi-light-contrast-high" : "aoi-dark-contrast-high"
            ]
          }
        : { mode, bodyClasses: [mode, className] };
    const evaluation = resolveScenario(scenario);
    const label = `${mode} ${level} borders`;

    const structural = roleColor(evaluation, "--aoi-border-structural");
    if (!structural) {
      failures.push(`${label}: --aoi-border-structural does not resolve`);
    } else if (formatHex(structural) === formatHex(standardStructural)) {
      failures.push(
        `${label}: --aoi-border-structural stayed ${formatHex(structural)}; the setting did not reach the dividers`
      );
    }

    const control = roleColor(evaluation, "--aoi-border-control");
    if (!control) {
      failures.push(`${label}: --aoi-border-control does not resolve`);
      continue;
    }
    const worst = Math.min(
      ...surfaceNames.map((name) => {
        const surface = evaluation.resolved.get(name);
        if (!surface || surface.kind !== "color") return 21;
        return contrastRatio(control, surface);
      })
    );
    if (worst < 3) {
      failures.push(
        `${label}: --aoi-border-control ${formatHex(control)} is ${worst.toFixed(2)}:1 against its surface, below the 3:1 non-text minimum`
      );
    }
  }

  /* Soft is the one level that legitimately quiets the dividers, so it is excluded
     from the "must differ" half above; its control floor is still asserted by the
     same loop, because Soft no longer lowers `--aoi-border-control`. */
  if (formatHex(standardControl) === formatHex(standardStructural)) {
    failures.push(
      `${mode}: control and structural borders share ${formatHex(standardControl)}; the control role is not carrying its own minimum`
    );
  }
}

/* Audit 8.3, the last two reverse tests. Both need a Callout element rather than the
   body, because the wash strength and the type colour resolve on the element. */
const CALLOUT_TYPES = [
  "note",
  "info",
  "success",
  "check",
  "done",
  "warning",
  "caution",
  "attention",
  "failure",
  "fail",
  "missing",
  "error",
  "danger",
  "second-voice",
  "aoi-tori",
  "quote",
  "example",
  "unknown-type"
];

function resolveCallout(mode, bodyClasses, type, env = {}) {
  const callout = createElement("div", ["callout"]);
  callout.attributes.set("data-callout", type);
  const html = createElement("html", []);
  const body = createElement("body", [mode, ...bodyClasses]);
  const htmlResolved = resolveSpecified(cascadeCustomProperties(html, [], env, new Map()));
  const bodyResolved = resolveSpecified(
    cascadeCustomProperties(body, [html], env, htmlResolved.entries)
  );
  return {
    callout: resolveSpecified(
      cascadeCustomProperties(callout, [html, body], env, bodyResolved.entries)
    ),
    body: bodyResolved
  };
}

for (const mode of ["theme-light", "theme-dark"]) {
  /* Test 6: the user's strength must reach every type. A type rule that declares the
     strength on the Callout element outranks the value inherited from the body, which
     is how Quiet and Airy silently stopped working for the safety family. */
  for (const [setting, expected] of [
    ["aoi-callout-quiet", "3.00%"],
    ["aoi-callout-airy", "7.00%"]
  ]) {
    for (const type of CALLOUT_TYPES) {
      const { callout } = resolveCallout(mode, [setting], type);
      const strength = formatValue(callout.get("--aoi-callout-wash-strength"));
      if (strength !== expected) {
        failures.push(
          `${mode} ${setting} on [${type}]: --aoi-callout-wash-strength is ${strength}, expected ${expected}; the type is not following the user setting`
        );
      }
    }
  }

  /* Test 7: a brighter Callout surface would buy visibility with link contrast. The
     wash is strongest at the gradient start, so that is where the link colour is
     measured. */
  for (const type of ["success", "second-voice", "aoi-tori"]) {
    const { callout, body } = resolveCallout(mode, ["aoi-callout-airy"], type);
    const surface = callout.get("--aoi-callout-surface");
    const wash = callout.get("--callout-color");
    const strength = callout.get("--aoi-callout-wash-strength");
    const link = body.get("--link-color");

    if (surface?.kind !== "color" || wash?.kind !== "color" || link?.kind !== "color") {
      failures.push(
        `${mode} [${type}]: Callout surface, type colour or link colour did not resolve`
      );
      continue;
    }
    const pct = strength?.kind === "percentage" ? strength.value : 0;
    const washed = compositeOver({ ...wash, a: pct }, { ...surface, a: 1 });
    const ratio = contrastRatio(link, washed);
    if (ratio < 4.5) {
      failures.push(
        `${mode} [${type}]: link ${formatHex(link)} on the washed Airy surface ${formatHex(washed)} is ${ratio.toFixed(2)}:1, below 4.5:1; a brighter Callout surface would trade link contrast for box visibility`
      );
    }
  }
}

if (failures.length) {
  console.error(`\n${failures.length} scenario failure${failures.length === 1 ? "" : "s"}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("\nAll scenario contrast checks passed.");
}
