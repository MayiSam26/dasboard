// Saneado y validación de los campos numéricos del sistema, en un solo lugar
// para que todos los formularios se comporten igual.
//
// Nota sobre <input type="number">: parece la opción obvia, pero el navegador
// igual acepta "e", "+", "-" y notación científica, ignora maxLength y deja
// escribir cuantos dígitos quieras. Por eso los campos usan type="text" con
// inputMode="numeric" (el celular muestra el teclado numérico) y se sanea lo
// que se escribe.

/** Deja solo dígitos y recorta a `max` caracteres. */
export function soloDigitos(valor: string, max: number): string {
  return (valor || "").replace(/\D/g, "").slice(0, max);
}

/**
 * Deja un número positivo con decimales: dígitos y un único punto.
 * Sirve para montos, precios y pesos (no acepta signos ni "e").
 */
export function soloDecimal(valor: string, maxEnteros = 9, maxDecimales = 2): string {
  let limpio = (valor || "").replace(/[^\d.]/g, "");
  const partes = limpio.split(".");
  const enteros = partes.shift()!.slice(0, maxEnteros);
  if (partes.length === 0) return enteros;
  return enteros + "." + partes.join("").slice(0, maxDecimales);
}

// Perú: los números de contacto (celular o fijo con código) son de 9 dígitos.
export const LARGO_TELEFONO = 9;
export const LARGO_DNI = 8;
export const LARGO_RUC = 11;

export const AYUDA_TELEFONO = "9 dígitos";
export const AYUDA_DNI = "8 dígitos";
export const AYUDA_RUC = "11 dígitos";

/** true si el campo está completo y bien formado. Vacío se considera válido
 *  (los campos opcionales no deben marcarse en rojo por estar en blanco);
 *  la obligatoriedad la decide cada formulario. */
export function telefonoValido(valor: string): boolean {
  return !valor || /^\d{9}$/.test(valor);
}

export function dniValido(valor: string): boolean {
  return !valor || /^\d{8}$/.test(valor);
}

export function rucValido(valor: string): boolean {
  return !valor || /^\d{11}$/.test(valor);
}

export function correoValido(valor: string): boolean {
  return !valor || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
}

/** Props listas para un TextField que solo acepta dígitos. */
export function propsNumericos(max: number) {
  return { inputMode: "numeric" as const, maxLength: max, pattern: "[0-9]*" };
}
