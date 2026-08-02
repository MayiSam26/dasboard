export interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryDark: string;
  sidebarBg: string;
}

export const themePresets: ThemePreset[] = [
  {
    id: "colitas",
    name: "Colitas (naranja y verde)",
    primary: "#E4602F",
    primaryDark: "#C74E23",
    secondary: "#3F9E5C",
    secondaryDark: "#2F7D46",
    sidebarBg: "#24282C",
  },
  {
    id: "oceano",
    name: "Océano",
    primary: "#2D6CDF",
    primaryDark: "#1E4FB0",
    secondary: "#17A2B8",
    secondaryDark: "#0E7A8C",
    sidebarBg: "#1B2A41",
  },
  {
    id: "uva",
    name: "Uva",
    primary: "#7C3AED",
    primaryDark: "#6023C0",
    secondary: "#EC4899",
    secondaryDark: "#C22E76",
    sidebarBg: "#241B36",
  },
  {
    id: "atardecer",
    name: "Atardecer",
    primary: "#F97316",
    primaryDark: "#D9600C",
    secondary: "#F59E0B",
    secondaryDark: "#C77D07",
    sidebarBg: "#2B211A",
  },
  {
    id: "bosque",
    name: "Bosque",
    primary: "#15803D",
    primaryDark: "#0F6430",
    secondary: "#65A30D",
    secondaryDark: "#4D7D0A",
    sidebarBg: "#1A2B1E",
  },
];

export function applyTheme(preset: ThemePreset) {
  const root = document.documentElement;
  root.style.setProperty("--cya-primary", preset.primary);
  root.style.setProperty("--cya-primary-dark", preset.primaryDark);
  root.style.setProperty("--cya-secondary", preset.secondary);
  root.style.setProperty("--cya-secondary-dark", preset.secondaryDark);
  root.style.setProperty("--cya-sidebar-bg", preset.sidebarBg);
}

export function getSavedThemeId(): string {
  return localStorage.getItem("cya-theme") || themePresets[0].id;
}

export function loadSavedTheme(): ThemePreset {
  const preset = themePresets.find((p) => p.id === getSavedThemeId()) || themePresets[0];
  applyTheme(preset);
  return preset;
}

export function saveTheme(preset: ThemePreset) {
  localStorage.setItem("cya-theme", preset.id);
  applyTheme(preset);
}

// aplica el tema guardado apenas arranca la app
loadSavedTheme();
