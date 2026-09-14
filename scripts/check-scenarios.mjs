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
const propertyRules = [];
let ruleOrder = 0;

/* Real properties the gate must be able to read back. The audit's 8.2.2 is explicit that a
   CSS custom property being present is not proof: the check has to see the value that
   reaches an element. These are the properties the repaired defects actually changed. */
const WATCHED_PROPERTIES = new Set([
  "border-inline-start-width",
  "border-top-width",
  "border-top-color",
  "mix-blend-mode",
  "font-weight",
  "outline-style",
  "background-color",
  /* The disabled-state pass: a disabled control is defined by what it does not have, so the
     gate has to be able to read the absence of a shadow and of a press displacement. */
  "box-shadow",
  "opacity",
  "transform",
  "border-radius"
]);

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
  --callout-radius: var(--radius-s);
  --callout-title-weight: calc(var(--font-weight) + var(--bold-modifier));
  --code-border-width: 0px;
  --input-height: 30px;
  --input-radius: 5px;
  --metadata-border-radius: 0;
  --metadata-property-radius: 6px;
  --setting-items-radius: var(--radius-l);
  --radius-xl: 24px;
  --tab-radius-active: 6px 6px 0 0;
  --nav-item-weight-active: inherit;
  --font-text-size: 16px;
  --line-height-normal: 1.5;
  --line-height-tight: 1.3;
  --file-line-width: 700px;
  --image-radius: 4px;
  --h1-size: 1.618em;
  --h2-size: 1.462em;
  --h3-size: 1.318em;
  --h4-size: 1.188em;
  --h5-size: 1.076em;
  --h6-size: 1em;
}

.canvas-control-group {
  border-radius: var(--canvas-controls-radius);
}

.canvas-control-item {
  border-radius: 0px;
}

.is-mobile {
  --input-radius: var(--touch-radius-m);
  --clickable-icon-radius: var(--touch-size-m);
  --touch-size-s: 40px;
  --touch-size-m: 44px;
  --touch-radius-s: var(--touch-size-s);
  --touch-radius-m: var(--touch-size-m);
}

.is-mobile.theme-dark {
  --interactive-normal: var(--background-modifier-border);
  --interactive-hover: var(--background-modifier-border-hover);
  --background-modifier-form-field: var(--background-modifier-border);
}

.is-mobile button.mod-warning {
  background-color: var(--interactive-normal);
  color: var(--text-error);
}
.theme-light {
  --highlight-mix-blend-mode: darken;
}
.theme-dark {
  --highlight-mix-blend-mode: lighten;
}
.callout {
  mix-blend-mode: var(--callout-blend-mode);
  border-width: var(--callout-border-width);
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
    const properties = new Map();
    const record = (name, value) => {
      if (WATCHED_PROPERTIES.has(name)) {
        properties.set(name, value);
        return;
      }
      /* A shorthand is kept as one unparsed declaration and its first token is the width,
         so `border-inline-start: var(--x) solid var(--y)` is read as the start width. */
      if (name === "border-inline-start" && WATCHED_PROPERTIES.has("border-inline-start-width")) {
        const first = (Array.isArray(value) ? value : []).find(
          (token) => !(token.type === "token" && token.value.type === "white-space")
        );
        if (first) properties.set("border-inline-start-width", [first]);
      }
    };

    for (const declaration of rule.value.declarations?.declarations ?? []) {
      if (declaration.property === "custom") {
        const name = String(declaration.value.name);
        if (name.startsWith("--")) declarations.set(name, declaration.value.value);
        continue;
      }
      if (declaration.property === "unparsed") {
        const id = declaration.value?.propertyId?.property;
        if (typeof id === "string" && Array.isArray(declaration.value?.value)) {
          record(id, declaration.value.value);
        }
        continue;
      }
      record(declaration.property, declaration.value);
    }

    if (declarations.size === 0 && properties.size === 0) continue;

    for (const selector of rule.value.selectors) {
      assertSelectorSupported(selector);
    }

    if (declarations.size > 0) {
      customRules.push({
        selectors: rule.value.selectors,
        declarations,
        order: ruleOrder++,
        media: mediaStack
      });
    }
    if (properties.size > 0) {
      propertyRules.push({
        selectors: rule.value.selectors,
        properties,
        order: ruleOrder++,
        media: mediaStack
      });
    }
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
  if (token.type === "var") {
    const value = lookup(token.value.name.ident);
    /* `var(--x, fallback)` is how the Callout strength lets the user override sit in front
       of the type default. Without this the fallback is ignored and the property reads as
       unresolved, which is a harness bug, not a theme one. */
    if (
      token.value.fallback &&
      (value.kind === "unresolved" || value.kind === "unset" || value.kind === "empty")
    ) {
      return evalTokens(token.value.fallback, lookup);
    }
    return value;
  }
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

/* `formatValue` answers "what colour or length is this"; a shadow is a token list and it answers
   "list". Comparing two shadows needs their text, so this walks the raw token tree instead of
   interpreting it. */
function formatRawValue(value) {
  if (value == null) return "<missing>";
  if (value.kind === "list") return (value.tokens || []).map(formatRawValue).join(" ");
  if (value.kind === "token") return formatRawValue(value.value);
  if (value.kind === "color") return formatHex(value);
  if (value.kind === "length") return `${value.value}${value.unit}`;
  if (value.kind === "number") return String(value.value);
  if (value.kind === "percentage") return `${(value.value * 100).toFixed(2)}%`;
  if (value.kind === "ident") return value.name;
  if (value.kind === "var") return `var(${value.name.ident})`;
  if (value.kind === "unresolved") return `unresolved ${value.name}`;
  if (typeof value.value === "number" && value.unit) return `${value.value}${value.unit}`;
  return JSON.stringify(value);
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

/* Resolve a real property (not a custom one) on an element, the way the browser does: cascade
   the declarations, then substitute `var()` against the element's own resolved custom
   properties. This is what lets the gate assert "border-inline-start-width is 2px" instead of
   "the token string exists somewhere". */
function resolveElementProperty(element, ancestors, env, inherited, property) {
  let winner = null;
  for (const rule of propertyRules) {
    if (!mediaMatches(rule.media, env)) continue;
    let bestSpec = null;
    for (const selector of rule.selectors) {
      if (!matchesSelector(selector, element, ancestors)) continue;
      const spec = specificityOfSelector(selector);
      if (!bestSpec || compareSpec(spec, bestSpec) > 0) bestSpec = spec;
    }
    if (!bestSpec) continue;
    if (!rule.properties.has(property)) continue;
    if (
      !winner ||
      compareSpec(bestSpec, winner.spec) > 0 ||
      (compareSpec(bestSpec, winner.spec) === 0 && rule.order >= winner.order)
    ) {
      winner = { spec: bestSpec, order: rule.order, value: rule.properties.get(property) };
    }
  }
  if (!winner) return null;

  const elementResolved = resolveSpecified(
    cascadeCustomProperties(element, ancestors, env, inherited)
  );
  const scratch = new Map(elementResolved.entries);
  scratch.set("__watched", winner.value);
  return resolveSpecified(scratch).get("__watched");
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
const AOI_ICON_TYPES = [
  "aoi-tori",
  "aoi-feather-light",
  "aoi-feather-ink",
  "aoi-duet",
  "aoi-flute",
  "aoi-oboe",
  "aoi-trumpet",
  "aoi-tuba",
  "aoi-euphonium",
  "aoi-bluebird",
  "aoi-window",
  "aoi-breath",
  "aoi-resonance",
  "aoi-storybook",
  "aoi-steps"
];
const AOI_ICON_ALIASES = {
  "aoi-feather": "aoi-tori",
  "second-voice": "aoi-duet",
  flute: "aoi-flute",
  oboe: "aoi-oboe",
  tuba: "aoi-tuba",
  euphonium: "aoi-euphonium"
};

const CALLOUT_TYPES = [
  ...AOI_ICON_TYPES,
  ...Object.keys(AOI_ICON_ALIASES),
  "aoi-music",
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

/* Shipping contract: aliases must preserve artwork and color, each original mark is
   distinct, and standard descendants must reset artistic stroke weight. */
for (const mode of MODES) {
  const drawings = new Set();
  for (const type of AOI_ICON_TYPES) {
    const { callout } = resolveCallout(mode, [], type);
    const svg = callout.get("--callout-icon");
    if (
      svg?.kind !== "string" ||
      !svg.value.startsWith("<svg") ||
      !svg.value.includes('<g fill="none"')
    ) {
      failures.push(`${mode} ${type}: missing SVG or child-group fill protection`);
    } else {
      drawings.add(svg.value);
    }
    for (const [property, expected] of [
      ["--aoi-callout-icon-size", "22px"],
      ["--aoi-callout-badge-size", "28px"],
      ["--aoi-callout-icon-stroke", "1.25"]
    ]) {
      if (formatValue(callout.get(property)) !== expected)
        failures.push(`${mode} ${type}: wrong ${property}`);
    }
  }
  if (drawings.size !== AOI_ICON_TYPES.length)
    failures.push(`${mode}: original Callout drawings are missing or duplicated`);
  for (const [alias, canonical] of Object.entries(AOI_ICON_ALIASES)) {
    const left = resolveCallout(mode, [], alias).callout;
    const right = resolveCallout(mode, [], canonical).callout;
    for (const prop of ["--callout-icon", "--callout-color"]) {
      if (JSON.stringify(left.get(prop)) !== JSON.stringify(right.get(prop)))
        failures.push(`${mode}: ${alias} differs from ${canonical} for ${prop}`);
    }
  }
  const html = createElement("html", []);
  const body = createElement("body", [mode]);
  const htmlValues = resolveSpecified(cascadeCustomProperties(html, [], {}, new Map()));
  const bodyValues = resolveSpecified(
    cascadeCustomProperties(body, [html], {}, htmlValues.entries)
  );
  const parent = createElement("div", ["callout"]);
  parent.attributes.set("data-callout", "aoi-tori");
  const parentValues = resolveSpecified(
    cascadeCustomProperties(parent, [html, body], {}, bodyValues.entries)
  );
  for (const type of ["note", "warning", "aoi-music", "unknown-type"]) {
    const child = createElement("div", ["callout"]);
    child.attributes.set("data-callout", type);
    const childValues = resolveSpecified(
      cascadeCustomProperties(child, [html, body, parent], {}, parentValues.entries)
    );
    if (
      Math.abs(childValues.get("--aoi-callout-icon-stroke")?.value - 1.8) > 0.00001 ||
      childValues.get("--aoi-callout-icon-stroke")?.kind !== "number"
    )
      failures.push(`${mode}: nested ${type} inherits artwork stroke`);
  }
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

/* Audit 4.6. Diffing every `:root` declaration against the native `body` set found 41
   names where the theme's value never took effect, because `body` is a closer ancestor
   than `html`. The geometry half is fixed and asserted here; the typography half is a
   separate decision and is deliberately not asserted, so nobody "fixes" it by accident. */
for (const mode of ["theme-light", "theme-dark"]) {
  const geometry = resolveScenario({ mode, bodyClasses: [mode] }).resolved;
  const expected = {
    "--callout-radius": "8px",
    "--callout-title-weight": "500",
    "--input-height": "34px",
    "--input-radius": "8px",
    "--input-border-width-focus": "1px",
    "--metadata-border-radius": "8px",
    "--metadata-property-radius": "4px",
    "--setting-items-radius": "8px",
    "--radius-xl": "16px",
    "--tab-radius-active": "8px",
    "--nav-item-weight-active": "600"
  };
  for (const [name, want] of Object.entries(expected)) {
    const got = formatValue(geometry.get(name));
    if (got !== want) {
      failures.push(
        `${mode}: ${name} resolved to ${got}, expected ${want}; it is losing to the native body declaration`
      );
    }
  }
}

/* Audit R01. The surfaces that share a colour and therefore carry no hierarchy. The table
   header used to equal the zebra row exactly, so the table had no header at all, and both
   the highlight and the Callout-free containers sat below the 1.15:1 separation this
   project asks of an ordinary content container. Menu and modal backgrounds equal the page
   by design and are deliberately not asserted. */
for (const mode of ["theme-light", "theme-dark"]) {
  const resolved = resolveScenario({ mode, bodyClasses: [mode] }).resolved;
  const color = (name) => {
    const value = resolved.get(name);
    return value && value.kind === "color" ? value : null;
  };
  const page = color("--background-primary");
  const header = color("--table-header-background");
  const zebra = color("--table-row-alt-background");
  const highlight = color("--aoi-highlight-background");

  if (!page || !header || !zebra || !highlight) {
    failures.push(`${mode}: a hierarchy surface did not resolve`);
    continue;
  }
  if (formatHex(header) === formatHex(zebra)) {
    failures.push(
      `${mode}: the table header and the zebra row share ${formatHex(header)}; the table has no header hierarchy`
    );
  }
  const headerPage = contrastRatio(header, page);
  if (headerPage < 1.15) {
    failures.push(
      `${mode}: the table header is ${headerPage.toFixed(3)}:1 against the page, below the 1.15:1 container separation`
    );
  }
  const highlightPage = contrastRatio(highlight, page);
  if (highlightPage < 1.15) {
    failures.push(
      `${mode}: the highlight is ${highlightPage.toFixed(3)}:1 against the page, below the 1.15:1 container separation`
    );
  }
}

/* Audit 8.2.2. The custom-property checks above prove a value resolves; they do not prove it
   reaches an element. These read the property the browser would actually paint, on a synthetic
   element carrying the same classes and attributes Obsidian uses. Each expectation is the value
   the browser fixture measured, so the two independent checks agree. */
for (const mode of ["theme-light", "theme-dark"]) {
  const html = createElement("html", []);
  const body = createElement("body", [mode]);
  const env = { forcedColors: false, prefersContrast: false };
  const htmlResolved = resolveSpecified(cascadeCustomProperties(html, [], env, new Map()));
  const bodySpecified = cascadeCustomProperties(body, [html], env, htmlResolved.entries);

  const callout = createElement("div", ["callout"]);
  callout.attributes.set("data-callout", "aoi-tori");
  const content = createElement("div", ["callout-content"]);

  const cases = [
    [
      "callout border-inline-start-width",
      callout,
      [html, body],
      "--callout-border-width source",
      "border-inline-start-width",
      "2px"
    ],
    ["callout mix-blend-mode", callout, [html, body], "blend", "mix-blend-mode", "normal"],
    ["callout background-color", callout, [html, body], "surface", "background-color", null],
    [
      "callout-content background-color",
      content,
      [html, body, callout],
      "inner layer",
      "background-color",
      null
    ]
  ];

  for (const [label, element, ancestors, why, property, expected] of cases) {
    const value = resolveElementProperty(element, ancestors, env, bodySpecified, property);
    if (!value || value.kind === "unresolved" || value.kind === "unset") {
      failures.push(`${mode} ${label}: ${why} did not resolve on the element`);
      continue;
    }
    if (expected === null) {
      /* The two layers must differ: a continuous outer surface and a transparent inner one. */
      const other = resolveElementProperty(
        property === "background-color" && element === callout ? content : callout,
        property === "background-color" && element === callout
          ? [html, body, callout]
          : [html, body],
        env,
        bodySpecified,
        "background-color"
      );
      if (other && formatValue(other) === formatValue(value)) {
        failures.push(
          `${mode} ${label}: the Callout and its content layer share ${formatValue(value)}`
        );
      }
      continue;
    }
    if (formatValue(value) !== expected) {
      failures.push(`${mode} ${label}: resolved to ${formatValue(value)}, expected ${expected}`);
    }
  }
}

/* Audit 8.2.4. Style Settings applies classes and, for its five variable settings, writes
   inline custom properties on `body`. Inline wins over every selector, so the plugin state and
   the no-plugin state can disagree even though both are "the defaults". */
const PLUGIN_DEFAULT_CLASSES = [
  "aoi-sky-balanced",
  "aoi-cobalt-balanced",
  "aoi-sakura-balanced",
  "aoi-violet-balanced",
  "aoi-paper-balanced",
  "aoi-sidebar-duet",
  "aoi-interface-font-system",
  "aoi-body-font-literary",
  "aoi-monospace-font-system",
  "aoi-heading-weight-balanced",
  "aoi-density-default",
  "aoi-tab-cobalt-line",
  "aoi-status-visible",
  "aoi-watercolor-wash-on",
  "aoi-heading-accent-balanced",
  "aoi-link-underline-native",
  "aoi-unresolved-balanced",
  "aoi-active-line-subtle",
  "aoi-code-bordered",
  "aoi-quote-watercolor",
  "aoi-callout-balanced",
  "aoi-table-density-default",
  "aoi-image-border-hover",
  "aoi-image-shadow-none",
  "aoi-image-selection-cobalt",
  "aoi-image-action-default"
];

const PLUGIN_DEFAULT_VARIABLES = [
  ["--font-text-size", "16px"],
  ["--line-height-normal", "1.75"],
  ["--file-line-width", "760px"],
  ["--image-radius", "8px"],
  ["--aoi-image-selection-outline-width", "1px"]
];

function parseInlineValue(raw) {
  const length = /^(-?[\d.]+)(px|em|rem|%)$/.exec(raw);
  if (length) return { kind: "length", value: Number(length[1]), unit: length[2] };
  if (/^-?[\d.]+$/.test(raw)) return { kind: "number", value: Number(raw) };
  return { kind: "ident", name: raw };
}

for (const mode of ["theme-light", "theme-dark"]) {
  const bare = resolveScenario({ mode, bodyClasses: [mode] }).resolved.entries;
  const plugin = resolveScenario({
    mode,
    bodyClasses: [mode, ...PLUGIN_DEFAULT_CLASSES]
  }).resolved.entries;
  /* Style Settings writes its variable settings inline on `body`, where they outrank every
     selector, so the plugin state is the stylesheet state plus those five values. */
  const merged = new Map(plugin);
  for (const [name, raw] of PLUGIN_DEFAULT_VARIABLES) merged.set(name, parseInlineValue(raw));

  const names = new Set([...bare.keys(), ...merged.keys()]);
  const differences = [];
  for (const name of [...names].sort()) {
    const a = formatValue(bare.get(name));
    const b = formatValue(merged.get(name));
    if (a !== b) differences.push(`${name} is ${a} without the plugin and ${b} with it`);
  }
  for (const difference of differences) {
    failures.push(
      `${mode} defaults disagree: ${difference}; a setting the plugin can apply must also be the theme default`
    );
  }
}

/* Audit 8.2.5. The audit's specific warning for the strength design was that a nested
   Callout must not inherit its parent's type value: the type default is declared on the
   element precisely so the inner one resolves its own. A nested pair and a Callout holding
   code are the two structures that can expose a mistake here. */
for (const mode of ["theme-light", "theme-dark"]) {
  const html = createElement("html", []);
  const body = createElement("body", [mode]);
  const env = { forcedColors: false, prefersContrast: false };
  const htmlResolved = resolveSpecified(cascadeCustomProperties(html, [], env, new Map()));
  const bodySpecified = cascadeCustomProperties(body, [html], env, htmlResolved.entries);

  const outer = createElement("div", ["callout"]);
  outer.attributes.set("data-callout", "error");
  const outerResolved = resolveSpecified(
    cascadeCustomProperties(outer, [html, body], env, bodySpecified)
  );

  const inner = createElement("div", ["callout"]);
  inner.attributes.set("data-callout", "info");
  const innerResolved = resolveSpecified(
    cascadeCustomProperties(inner, [html, body, outer], env, outerResolved.entries)
  );

  /* Compare the nested Callout against the same type standing alone. Comparing it against
     the outer one would be wrong in light mode, where the theme deliberately uses a single
     strength for every type; the property that must hold in both modes is that nesting does
     not change the result. */
  const standalone = createElement("div", ["callout"]);
  standalone.attributes.set("data-callout", "info");
  const standaloneResolved = resolveSpecified(
    cascadeCustomProperties(standalone, [html, body], env, bodySpecified)
  );

  const strength = (r) => formatValue(r.get("--aoi-callout-wash-strength"));
  const colour = (r) => formatHex(requireColor(r, "--callout-color"));

  if (strength(innerResolved) !== strength(standaloneResolved)) {
    failures.push(
      `${mode} nested Callout: nested info resolves ${strength(innerResolved)} but standalone info resolves ${strength(standaloneResolved)}; nesting changed the type resolution`
    );
  }
  if (colour(innerResolved) !== colour(standaloneResolved)) {
    failures.push(
      `${mode} nested Callout: nested info took ${colour(innerResolved)} but standalone info is ${colour(standaloneResolved)}`
    );
  }
  if (colour(outerResolved) === colour(innerResolved)) {
    failures.push(`${mode} nested Callout: error and info share ${colour(innerResolved)}`);
  }

  /* Code inside a Callout must keep its own border rather than inheriting the container. */
  const pre = createElement("pre", []);
  const preResolved = resolveSpecified(
    cascadeCustomProperties(pre, [html, body, outer], env, outerResolved.entries)
  );
  const codeWidth = formatValue(preResolved.get("--code-border-width"));
  if (codeWidth !== "1px") {
    failures.push(
      `${mode} code inside a Callout: --code-border-width is ${codeWidth}, expected 1px`
    );
  }
}

/* Audit G03. Native `.is-mobile.theme-dark` re-points the three control surfaces at the border
   tokens. It is two classes, so it outranks the theme's single `.theme-dark` and a phone renders
   a different control surface than the desktop does - 1.60:1 on a hovered button. The invariant is
   that putting the theme on a phone does not change what a control is made of. */
for (const mode of ["theme-light", "theme-dark"]) {
  const html = createElement("html", []);
  const env = { forcedColors: false, prefersContrast: false };
  const htmlResolved = resolveSpecified(cascadeCustomProperties(html, [], env, new Map()));
  const surfaces = (classes) => {
    const body = createElement("body", classes);
    return resolveSpecified(cascadeCustomProperties(body, [html], env, htmlResolved.entries))
      .entries;
  };
  const desktop = surfaces([mode]);
  const phone = surfaces([mode, "is-mobile"]);
  for (const name of [
    "--interactive-normal",
    "--interactive-hover",
    "--background-modifier-form-field",
    "--background-modifier-hover"
  ]) {
    const a = formatValue(desktop.get(name));
    const b = formatValue(phone.get(name));
    if (a !== b) {
      failures.push(
        `${mode} mobile control surface: ${name} is ${a} on the desktop and ${b} on a phone; the border accent must not become a control fill`
      );
    }
  }
}

/* The mobile destructive restoration must not flatten the two destructive levels. An
   unguarded `body.is-mobile button.mod-warning` is two classes and two elements, which beats the
   theme's `button.mod-warning.mod-cta` at two classes and one element, so it repainted the primary
   surface with the secondary rose on phones only. */
for (const mode of ["theme-light", "theme-dark"]) {
  const html = createElement("html", []);
  const env = { forcedColors: false, prefersContrast: false };
  const htmlResolved = resolveSpecified(cascadeCustomProperties(html, [], env, new Map()));
  const body = createElement("body", [mode, "is-mobile"]);
  const bodySpecified = cascadeCustomProperties(body, [html], env, htmlResolved.entries);
  const bodyResolved = resolveSpecified(bodySpecified).entries;

  const surface = (classes) => {
    const el = createElement("button", classes);
    return formatValue(
      resolveElementProperty(el, [html, body], env, bodySpecified, "background-color")
    );
  };
  const ordinary = surface(["mod-warning"]);
  const primary = surface(["mod-warning", "mod-cta"]);
  const primaryDestructive = surface(["mod-destructive", "mod-cta"]);

  if (ordinary === primary) {
    failures.push(
      `${mode} mobile destructive: the secondary and primary delete buttons share ${ordinary}; the two destructive levels must stay distinct on a phone`
    );
  }
  for (const [label, value] of [
    ["mod-warning mod-cta", primary],
    ["mod-destructive mod-cta", primaryDestructive]
  ]) {
    const expected = formatValue(bodyResolved.get("--aoi-destructive-primary-background"));
    if (value !== expected) {
      failures.push(
        `${mode} mobile destructive: ${label} painted ${value}, expected the primary surface ${expected}`
      );
    }
  }
}

/* Audit G04. A disabled control must not gain a resting shadow, a hover lift or a press
   displacement. The enabled rules that were declared after the disabled ones are only visible in
   the resolved property, so these read the property rather than the token string. `pseudos` is how
   the harness stands in for a state the client would otherwise have to enter. */
{
  const html = createElement("html", []);
  const body = createElement("body", ["theme-dark"]);
  const env = { forcedColors: false, prefersContrast: false };
  const htmlResolved = resolveSpecified(cascadeCustomProperties(html, [], env, new Map()));
  const bodySpecified = cascadeCustomProperties(body, [html], env, htmlResolved.entries);

  const field = (pseudos) => {
    const el = createElement("input", []);
    el.attributes.set("type", "text");
    for (const name of pseudos) el.pseudos.add(name);
    return el;
  };

  const cases = [
    [field(["disabled"]), "box-shadow", "none", "a disabled field must not carry a resting shadow"],
    [field(["disabled", "hover"]), "box-shadow", "none", "a disabled field must not lift on hover"],
    [
      field(["disabled", "hover"]),
      "background-color",
      null,
      "a disabled field must not change fill on hover"
    ]
  ];
  for (const [element, property, expected, why] of cases) {
    const got = formatValue(
      resolveElementProperty(element, [html, body], env, bodySpecified, property)
    );
    if (expected === null) {
      const resting = formatValue(
        resolveElementProperty(field(["disabled"]), [html, body], env, bodySpecified, property)
      );
      if (got !== resting) {
        failures.push(`theme-dark ${why}: ${property} moves from ${resting} to ${got} on hover`);
      }
      continue;
    }
    if (got !== expected)
      failures.push(`theme-dark ${why}: ${property} resolved to ${got}, expected ${expected}`);
  }

  /* The guard must not cost an enabled control its feedback. */
  const hovers = formatRawValue(
    resolveElementProperty(field(["hover"]), [html, body], env, bodySpecified, "box-shadow")
  );
  const restShadow = formatRawValue(
    resolveElementProperty(field([]), [html, body], env, bodySpecified, "box-shadow")
  );
  if (hovers === "none" || hovers === restShadow) {
    failures.push(
      `theme-dark enabled field: hover box-shadow is ${hovers}, the same as rest ${restShadow}; the disabled guard is too broad`
    );
  }
}

/* Audit G01 and G02. A button, a field and an icon each have their own shape role, and the
   icon role is the platform's to override on touch: reading `--radius-s` directly is what made a
   phone render 4px corners and ignore the 44px touch radius native sets for `.is-mobile`. */
for (const [mode, mobile] of [
  ["theme-dark", false],
  ["theme-light", false],
  ["theme-dark", true],
  ["theme-light", true]
]) {
  const label = `${mode}${mobile ? " mobile" : ""}`;
  const html = createElement("html", []);
  const env = { forcedColors: false, prefersContrast: false };
  const htmlResolved = resolveSpecified(cascadeCustomProperties(html, [], env, new Map()));
  const bodyClasses = mobile ? [mode, "is-mobile"] : [mode];
  const body = createElement("body", bodyClasses);
  const bodySpecified = cascadeCustomProperties(body, [html], env, htmlResolved.entries);
  const bodyResolved = resolveSpecified(bodySpecified).entries;

  const radius = (tag, classes) => {
    const el = createElement(tag, classes);
    return formatValue(
      resolveElementProperty(el, [html, body], env, bodySpecified, "border-radius")
    );
  };

  const button = radius("button", []);
  const field = radius("input", [], "text");
  const icon = radius("div", ["clickable-icon"]);

  if (button === field) {
    failures.push(
      `${label} control shape: the button and the field both round at ${button}; they are separate roles`
    );
  }
  const expected = {
    button: formatValue(bodyResolved.get("--button-radius")),
    icon: formatValue(bodyResolved.get("--clickable-icon-radius"))
  };
  for (const [what, got, want] of [
    ["button", button, expected.button],
    ["icon", icon, expected.icon]
  ]) {
    if (got !== want) {
      failures.push(`${label} control shape: the ${what} rounds at ${got} but its role is ${want}`);
    }
  }
  if (mobile && icon !== "44px") {
    failures.push(
      `${label} control shape: the icon corner is ${icon}; the platform's 44px touch radius must reach it`
    );
  }
}

/* Audit G05 and G07. An icon control must render the same whether a plugin used a `div` or a
   `button`, the field hover rule must not reach input types the theme never styles, and a Canvas
   tool group is rounded on the group while its items keep their square seams. */
{
  const html = createElement("html", []);
  const body = createElement("body", ["theme-dark"]);
  const env = { forcedColors: false, prefersContrast: false };
  const htmlResolved = resolveSpecified(cascadeCustomProperties(html, [], env, new Map()));
  const bodySpecified = cascadeCustomProperties(body, [html], env, htmlResolved.entries);
  const bodyResolved = resolveSpecified(bodySpecified).entries;
  const read = (tag, classes, property, pseudos) => {
    const el = createElement(tag, classes);
    for (const name of pseudos ?? []) el.pseudos.add(name);
    return formatValue(resolveElementProperty(el, [html, body], env, bodySpecified, property));
  };

  for (const property of ["border-top-width", "background-color"]) {
    const asDiv = read("div", ["clickable-icon"], property);
    const asButton = read("button", ["clickable-icon"], property);
    if (asDiv !== asButton) {
      failures.push(
        `theme-dark icon control: ${property} is ${asDiv} on a div and ${asButton} on a button; an icon must not inherit the text-button surface`
      );
    }
  }

  /* The field hover rule must not reach controls the theme does not style. */
  for (const type of ["checkbox", "radio", "range", "color"]) {
    const el = (pseudos) => {
      const node = createElement("input", []);
      node.attributes.set("type", type);
      for (const name of pseudos) node.pseudos.add(name);
      return node;
    };
    const rest = formatValue(
      resolveElementProperty(el([]), [html, body], env, bodySpecified, "background-color")
    );
    const hover = formatValue(
      resolveElementProperty(el(["hover"]), [html, body], env, bodySpecified, "background-color")
    );
    if (rest !== hover) {
      failures.push(
        `theme-dark input[type="${type}"]: hover repaints the background from ${rest} to ${hover}; the theme does not style this control at rest`
      );
    }
  }

  const groupRadius = formatValue(
    resolveElementProperty(
      createElement("div", ["canvas-control-group"]),
      [html, body],
      env,
      bodySpecified,
      "border-radius"
    )
  );
  const wanted = formatValue(bodyResolved.get("--aoi-radius-toolgroup"));
  if (groupRadius !== wanted) {
    failures.push(
      `theme-dark canvas tool group: rounds at ${groupRadius}, expected the tool group role ${wanted}`
    );
  }
  /* A four-corner `border-radius` resolves to a per-corner structure rather than a length, so
     read the dimensions out of it instead of formatting the whole thing. */
  const itemRadius = resolveElementProperty(
    createElement("button", ["canvas-control-item"]),
    [html, body],
    env,
    bodySpecified,
    "border-radius"
  );
  const dimensions = [];
  const collect = (value) => {
    if (!value || typeof value !== "object") return;
    if (typeof value.value === "number") dimensions.push(value.value);
    for (const key of Object.keys(value)) collect(value[key]);
  };
  collect(itemRadius);
  if (dimensions.length === 0 || dimensions.some((n) => n !== 0)) {
    failures.push(
      `theme-dark canvas tool group: the item rounds at ${dimensions.join("/") || "unresolved"}; the group provides the corner and the items keep their seams`
    );
  }
}

if (failures.length) {
  console.error(`\n${failures.length} scenario failure${failures.length === 1 ? "" : "s"}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("\nAll scenario contrast checks passed.");
}
