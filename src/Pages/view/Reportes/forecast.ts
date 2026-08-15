// Lógica pura de Reportes.tsx (colores + tendencias/proyección), separada
// en su propio archivo sin dependencias (axios, MUI, etc.) para que se
// pueda probar de forma aislada y rápida — importar Reportes.tsx completo
// arrastra todo su árbol de imports.

export function cssVar(name: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export const CYA_PRIMARY = cssVar("--cya-primary", "#E4602F");
export const CYA_SECONDARY = cssVar("--cya-secondary", "#3F9E5C");
export const CYA_ACCENT = "#F4A731";
export const CYA_ERROR = "#C0392B";
export const CYA_MUTED = "#B7C2C9";

// Ajuste por mínimos cuadrados sobre los últimos N meses (x = índice de mes,
// y = valor). Es la Recomendación #2 de la tesis ("herramientas predictivas
// para anticipar tendencias") resuelta de forma simple y explicable: una
// tendencia lineal, no un modelo de caja negra. Nunca negativo.
export function linearRegression(values: number[]): { slope: number; intercept: number } {
  const n = values.length;
  const meanX = (n - 1) / 2;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  values.forEach((y, x) => {
    num += (x - meanX) * (y - meanY);
    den += (x - meanX) ** 2;
  });
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  return { slope, intercept };
}

export function linearForecast(values: number[], stepsAhead: number): number[] {
  if (values.length < 2) return Array(stepsAhead).fill(Math.max(0, values[0] ?? 0));
  const { slope, intercept } = linearRegression(values);
  return Array.from({ length: stepsAhead }, (_, k) =>
    Math.max(0, Math.round(intercept + slope * (values.length + k)))
  );
}

export function tendenciaDe(values: number[]): { label: string; color: string } {
  const { slope } = linearRegression(values);
  const media = values.reduce((a, b) => a + b, 0) / values.length;
  const umbral = Math.max(0.5, media * 0.05);
  if (slope > umbral) return { label: "↑ En aumento", color: CYA_SECONDARY };
  if (slope < -umbral) return { label: "↓ En descenso", color: CYA_ERROR };
  return { label: "→ Estable", color: CYA_MUTED };
}
