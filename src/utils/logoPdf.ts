// Logo del refugio en la cabecera de los PDF del panel.
//
// Estaba repetido en cada reporte, y en todos se dibujaba dentro de un cuadro
// de 16x16 mm. El archivo mide 500x358, así que salía aplastado. Además cada
// reporte lo resolvía a su manera: unos incrustaban el PNG con transparencia
// (jsPDF lo guarda descomprimido y engorda el archivo cientos de KB) y otro lo
// aplanaba sobre blanco, lo que dejaba un recuadro blanco sobre la banda crema
// del encabezado.

// El mismo crema de la banda: rellenar la transparencia con este color hace que
// el logo se funda con el fondo en vez de recortarse contra él.
const CREMA = "#FBF7F2";

/** Ancho máximo que se le permite ocupar, por si el archivo del logo cambia. */
const ANCHO_MAXIMO = 30;

async function cargarLogo(url: string): Promise<string | null> {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) return null;
    const blob = await respuesta.blob();
    if (!blob.type.startsWith("image/")) return null;

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const objectUrl = URL.createObjectURL(blob);
      const el = new Image();
      el.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(el);
      };
      el.onerror = (e) => {
        URL.revokeObjectURL(objectUrl);
        reject(e);
      };
      el.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = CREMA;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return null;
  }
}

/**
 * Ancho que debe tener el logo para un alto dado sin deformarse. Se separa del
 * dibujo para poder comprobarlo sin navegador, que es donde estaba el error:
 * el ancho iba fijo en 16 mm sin mirar la proporción del archivo.
 */
export function anchoDelLogo(anchoOriginal: number, altoOriginal: number, alto: number) {
  if (!(anchoOriginal > 0) || !(altoOriginal > 0) || !(alto > 0)) return alto;
  return Math.min(ANCHO_MAXIMO, (anchoOriginal / altoOriginal) * alto);
}

/**
 * Dibuja el logo en la cabecera respetando su proporción y devuelve la
 * coordenada X donde puede empezar el texto del encabezado.
 *
 * Si el logo no carga devuelve la posición de siempre (x + 20), para que el
 * reporte salga igual que antes en vez de con el título descolocado.
 */
export async function dibujarLogoCabecera(
  doc: any,
  x = 10,
  y = 4,
  alto = 16
): Promise<number> {
  const logo = await cargarLogo(`${window.location.origin}/images/logocito.png`);
  if (!logo) return x + 20;

  try {
    const props = doc.getImageProperties(logo);
    const ancho = anchoDelLogo(props.width, props.height, alto);
    doc.addImage(logo, "JPEG", x, y, ancho, alto);
    return x + ancho + 4;
  } catch {
    return x + 20;
  }
}
