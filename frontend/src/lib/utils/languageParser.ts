import config from "../../config/config.json";
import menu from "../../config/menu.json";

// Simplified version - no multi-language support
// All language-related functions now just return default values

export const languages = ["en"];
export const locales = { en: menu };

// Returns 'en' - kept for compatibility
export function getLangFromUrl(url: URL): string {
  return "en";
}

// Returns menu and translations - no language logic needed
export const getTranslations = async (lang?: string) => {
  return menu;
};

// Simple supported language - just english
export const supportedLang = [""];

// Simplified slug selector - just returns the URL with trailing slash logic
export const slugSelector = (url: string, lang?: string) => {
  const { trailing_slash } = config.site;

  let constructedUrl = url;

  // Adjust for trailing slash
  if (trailing_slash) {
    if (!constructedUrl.endsWith("/")) {
      constructedUrl += "/";
    }
  } else {
    if (constructedUrl.endsWith("/") && constructedUrl !== "/") {
      constructedUrl = constructedUrl.slice(0, -1);
    }
  }

  return constructedUrl;
};
