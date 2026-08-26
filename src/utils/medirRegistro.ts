import axios from "axios";
import baseurl from "../Config/axios";

// Cronómetro del indicador "Tiempo de Registro" de la tesis.
//
// El formulario avisa cuando se abre y cuando se guarda; las dos marcas de
// tiempo las pone el servidor. Antes el cronómetro arrancaba al iniciar
// sesión, así que medía la jornada entera en vez del acto de registrar.
//
// Nunca interrumpe el trabajo del usuario: si la medición falla, se ignora en
// silencio. Es un dato de apoyo, no parte del registro.

/** Avisa que se abrió un formulario. Devuelve el id de la medición. */
export async function iniciarMedicion(modulo: string): Promise<number | null> {
  try {
    const { data } = await axios.post(baseurl + "auditoria", { modulo });
    return data?.data?.idauditoria ?? null;
  } catch {
    return null;
  }
}

/** Avisa que el registro se guardó. */
export async function finalizarMedicion(id: number | null): Promise<void> {
  if (!id) return;
  try {
    await axios.put(baseurl + "auditoria/update/" + id, {});
  } catch {
    // Sin ruido: que no se pueda medir no debe estropear un guardado válido.
  }
}

/** Segundos a un texto corto y legible ("2 min 14 s"). */
export function formatearDuracion(segundos: number | null | undefined): string {
  if (segundos == null) return "—";
  if (segundos < 60) return `${segundos} s`;
  const min = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return resto === 0 ? `${min} min` : `${min} min ${resto} s`;
}
