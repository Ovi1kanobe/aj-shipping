// tw-theme.mjs
import plugin from "tailwindcss/plugin";
import themeConfig from "../config/theme.json" assert { type: "json" };

// Helper to extract a clean font name.
const findFont = (fontStr) =>
  fontStr.replace(/\+/g, " ").replace(/:[^:]+/g, "");

// Build font families from theme.json (ignoring *_type keys)
const fontFamilies = Object.entries(themeConfig.fonts.font_family || {})
  .filter(([key]) => !key.endsWith("_type"))
  .reduce((acc, [key, font]) => {
    acc[key] = `${findFont(font)}, ${
      themeConfig.fonts.font_family?.[`${key}_type`] || "sans-serif"
    }`;
    return acc;
  }, {});

// Color groups
const defaultColorGroups = [
  { colors: themeConfig.colors?.default?.theme_color || {}, prefix: "" },
  { colors: themeConfig.colors?.default?.text_color || {}, prefix: "" },
];

const darkColorGroups = [];
if (themeConfig.colors?.darkmode?.theme_color) {
  darkColorGroups.push({ colors: themeConfig.colors.darkmode.theme_color, prefix: "darkmode-" });
}
if (themeConfig.colors?.darkmode?.text_color) {
  darkColorGroups.push({ colors: themeConfig.colors.darkmode.text_color, prefix: "darkmode-" });
}

const getVars = (groups) => {
  const vars = {};
  for (const { colors, prefix } of groups) {
    for (const [k, v] of Object.entries(colors)) {
      const cssKey = k.replace(/_/g, "-");
      vars[`--color-${prefix}${cssKey}`] = v;
    }
  }
  return vars;
};

const defaultVars = getVars(defaultColorGroups);
const darkVars = getVars(darkColorGroups);

// Font sizes
const baseSize = Number(themeConfig.fonts?.font_size?.base ?? 16);
const scale = Number(themeConfig.fonts?.font_size?.scale ?? 1.25);
const calculateFontSizes = (base, scale) => {
  const sizes = {};
  let current = scale;
  for (let i = 6; i >= 1; i--) {
    sizes[`h${i}`] = `${current}rem`;
    sizes[`h${i}-sm`] = `${current * 0.9}rem`;
    current *= scale;
  }
  sizes.base = `${base}px`;
  sizes["base-sm"] = `${base * 0.8}px`;
  return sizes;
};
const fontSizes = calculateFontSizes(baseSize, scale);

// Vars for fonts + sizes
const fontVars = {};
for (const [k, v] of Object.entries(fontSizes)) fontVars[`--text-${k}`] = v;
for (const [k, v] of Object.entries(fontFamilies)) fontVars[`--font-${k}`] = v;

const baseVars = { ...fontVars, ...defaultVars };

// Colors map for matchUtilities
const colorsMap = {};
for (const { colors, prefix } of [...defaultColorGroups, ...darkColorGroups]) {
  for (const [key] of Object.entries(colors)) {
    const cssKey = key.replace(/_/g, "-");
    colorsMap[prefix + cssKey] = `var(--color-${prefix}${cssKey})`;
  }
}

export default plugin.withOptions(() => {
  return ({ addBase, addUtilities, matchUtilities }) => {
    // Vars: light on :root, dark on .dark
    addBase({
      ":root": baseVars,
      ".dark": darkVars,
    });

    // Font family & size utilities
    const fontUtils = {};
    for (const key of Object.keys(fontFamilies)) {
      fontUtils[`.font-${key}`] = { fontFamily: `var(--font-${key})` };
    }
    for (const key of Object.keys(fontSizes)) {
      fontUtils[`.text-${key}`] = { fontSize: `var(--text-${key})` };
    }
    // In v4, you typically don't pass { variants: [...] } here — variants are just class prefixes (hover:, focus:, etc.)
    addUtilities(fontUtils);

    // Color utilities (supports bg-*, text-*, border-*, fill-*, stroke-*)
    matchUtilities(
      {
        bg: (value) => ({ backgroundColor: value }),
        text: (value) => ({ color: value }),
        border: (value) => ({ borderColor: value }),
        fill: (value) => ({ fill: value }),
        stroke: (value) => ({ stroke: value }),
      },
      { values: colorsMap, type: "color" }
    );

    // Gradients: from-*, via-*, to-* mapped to your CSS vars
    matchUtilities(
      {
        from: (value) => ({
          "--tw-gradient-from": value,
          "--tw-gradient-via-stops":
            "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
          "--tw-gradient-stops":
            "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
        }),
        to: (value) => ({
          "--tw-gradient-to": value,
          "--tw-gradient-via-stops":
            "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
          "--tw-gradient-stops":
            "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
        }),
        via: (value) => ({
          "--tw-gradient-via": value,
          "--tw-gradient-via-stops":
            "var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)",
        }),
      },
      { values: colorsMap, type: "color" }
    );
  };
});