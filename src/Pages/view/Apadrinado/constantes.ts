// Un apadrinamiento sostiene económicamente a un animal mientras el refugio lo
// mantiene alojado, así que solo tiene sentido para los que siguen adentro.
// "proceso" entra porque la adopción todavía no se cierra y el animal sigue en
// el albergue; "adoptado" y "Fallecido" quedan fuera.
export const ANIMALES_EN_ALBERGUE = ["En refugio", "proceso"];

/** true si el animal ya no está en el refugio (o no se pudo resolver). */
export function yaNoEstaEnElAlbergue(animal: any): boolean {
  if (!animal || !animal.estado) return false; // sin dato no afirmamos nada
  return !ANIMALES_EN_ALBERGUE.includes(animal.estado);
}
