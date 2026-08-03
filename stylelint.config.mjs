export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "declaration-no-important": true,
    "selector-max-compound-selectors": 4,
    "selector-max-id": 0,
    "selector-not-notation": "simple",
    "selector-class-pattern": "^([a-z][a-z0-9-]*|HyperMD-[A-Za-z0-9-]+)$",
    "custom-property-pattern":
      "^(aoi|anim|background|bases|blockquote|callout|canvas|caret|checkbox|code|color|embed|file|font|graph|h[1-6]|header|hr|icon|image|indentation|input|interactive|line|link|list|menu|metadata|modal|nav|pdf|radius|ribbon|search|setting|shadow|size|status|tab|table|text|titlebar)-[a-z0-9-]+$",
    "color-function-notation": "modern",
    "alpha-value-notation": "number",
    "no-descending-specificity": null
  }
};
