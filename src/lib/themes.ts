export type ThemeId =
  | "indigo-night"
  | "madinah-emerald"
  | "kiswah-obsidian"
  | "baghdad-sapphire"
  | "ajmer-rose"
  | "parchment-noor"
  | "alabaster-lavender"
  | "ottoman-ivory";

/** Accepts legacy "dark" / "light" persisted values and normalizes them */
export type PersistedThemeInput = ThemeId | "dark" | "light";

export interface SanctuaryThemeMeta {
  id: ThemeId;
  name: string;
  subtitle: string;
  arabicTitle: string;
  mode: "dark" | "light";
  inspiration: string;
  swatches: {
    canvas: string;
    surface: string;
    primary: string;
    gold: string;
  };
  themeColorHex: string;
}

export const SANCTUARY_THEMES: SanctuaryThemeMeta[] = [
  {
    id: "indigo-night",
    name: "Midnight Layl",
    subtitle: "Royal Indigo & Amethyst",
    arabicTitle: "ليل التهجد",
    mode: "dark",
    inspiration: "Tahajjud night sky with royal violet and warm peach-gold illumination",
    swatches: {
      canvas: "#040C23",
      surface: "#121931",
      primary: "#A44AFF",
      gold: "#F9B091",
    },
    themeColorHex: "#040C23",
  },
  {
    id: "madinah-emerald",
    name: "Green Dome Emerald",
    subtitle: "Masjid an-Nabawi ﷺ",
    arabicTitle: "القبة الخضراء",
    mode: "dark",
    inspiration: "Sacred emerald canopy of Rawdah ash-Sharifah paired with brass-gold lanterns",
    swatches: {
      canvas: "#031611",
      surface: "#0A261E",
      primary: "#10B981",
      gold: "#FBBF24",
    },
    themeColorHex: "#031611",
  },
  {
    id: "kiswah-obsidian",
    name: "Kaaba Kiswah Gold",
    subtitle: "OLED Obsidian & Pure Gold",
    arabicTitle: "كسوة الكعبة",
    mode: "dark",
    inspiration: "True OLED black silk woven with luminous gold-embroidered calligraphy",
    swatches: {
      canvas: "#050508",
      surface: "#111118",
      primary: "#EAB308",
      gold: "#FDE047",
    },
    themeColorHex: "#050508",
  },
  {
    id: "baghdad-sapphire",
    name: "Baghdad Sapphire",
    subtitle: "Qadri Azure & Amber",
    arabicTitle: "ياقوت بغداد",
    mode: "dark",
    inspiration: "Glazed turquoise-cobalt ceramic domes of Bab ash-Shaykh in Baghdad Sharif",
    swatches: {
      canvas: "#041122",
      surface: "#0C213B",
      primary: "#38BDF8",
      gold: "#F59E0B",
    },
    themeColorHex: "#041122",
  },
  {
    id: "ajmer-rose",
    name: "Chishti Rose & Saffron",
    subtitle: "Velvet Plum & Rose Gold",
    arabicTitle: "گلشن اجمیر",
    mode: "dark",
    inspiration: "Damask rose petals and warm saffron lamps at Dargah Ajmer Sharif",
    swatches: {
      canvas: "#160714",
      surface: "#261023",
      primary: "#F472B6",
      gold: "#FB923C",
    },
    themeColorHex: "#160714",
  },
  {
    id: "alabaster-lavender",
    name: "Alabaster Fajr",
    subtitle: "Crisp Daylight & Violet",
    arabicTitle: "نور الفجر",
    mode: "light",
    inspiration: "Cool marble courtyard at dawn with soft lavender and coral-gold accents",
    swatches: {
      canvas: "#F6F4FC",
      surface: "#FFFFFF",
      primary: "#7C3AED",
      gold: "#D97706",
    },
    themeColorHex: "#F6F4FC",
  },
  {
    id: "parchment-noor",
    name: "Madinah Parchment",
    subtitle: "Warm Mushaf Cream & Emerald",
    arabicTitle: "رق المصحف",
    mode: "light",
    inspiration: "Classic cream-tinted Mushaf paper crafted for zero eye strain during long reading",
    swatches: {
      canvas: "#FAF5E8",
      surface: "#FFFDF7",
      primary: "#047857",
      gold: "#B45309",
    },
    themeColorHex: "#FAF5E8",
  },
  {
    id: "ottoman-ivory",
    name: "Ottoman Iznik",
    subtitle: "Porcelain Teal & Burnished Gold",
    arabicTitle: "خزف إزنيق",
    mode: "light",
    inspiration: "Illuminated Ottoman manuscripts with Iznik teal borders and burnished gold leaf",
    swatches: {
      canvas: "#F2F7F8",
      surface: "#FFFFFF",
      primary: "#0F766E",
      gold: "#B45309",
    },
    themeColorHex: "#F2F7F8",
  },
];

export function normalizeThemeId(input?: string | null): ThemeId {
  if (!input) return "indigo-night";
  if (input === "dark") return "indigo-night";
  if (input === "light") return "alabaster-lavender";
  const found = SANCTUARY_THEMES.find((t) => t.id === input);
  return found ? found.id : "indigo-night";
}

export function getThemeMeta(id?: string | null): SanctuaryThemeMeta {
  const norm = normalizeThemeId(id);
  return SANCTUARY_THEMES.find((t) => t.id === norm) || SANCTUARY_THEMES[0];
}
