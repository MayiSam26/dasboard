import moment from "moment";
import { TIPOS, GENEROS } from "../../Colitas/constantes";

// Contrato de adopción responsable en PDF.
//
// Se arma en el navegador con jsPDF (la misma librería que ya usan los otros
// reportes del panel) en vez de generarlo en el servidor: no hace falta
// desplegar nada nuevo, el documento sale al instante, y no queda una copia
// guardada en Railway de un archivo que se puede volver a emitir cuando se
// quiera a partir de los datos de la adopción.

const MARGEN = 16;
const ANCHO_HOJA = 210; // A4 en milímetros
const ANCHO_UTIL = ANCHO_HOJA - MARGEN * 2;
const PIE = 276; // a partir de aquí ya no cabe contenido: toca hoja nueva

const NARANJA: [number, number, number] = [228, 96, 47];
const CREMA: [number, number, number] = [251, 247, 242];
const CREMA_HEX = "#FBF7F2"; // el mismo crema, para rellenar la transparencia del logo
const TEXTO: [number, number, number] = [45, 45, 45];
const GRIS: [number, number, number] = [110, 110, 110];

// Datos del refugio. Van aquí y no leídos de la ficha del refugio porque esa
// ficha solo la puede consultar quien tenga el permiso "refugio": si se leyeran
// de ahí, un usuario sin ese permiso emitiría el contrato sin encabezado.
const REFUGIO = {
  nombre: "Refugio Colitas y Amor",
  direccion: "Callao, Provincia Constitucional del Callao",
  telefono: "+51 981557865",
  correo: "refugiocolitasyamor@gmail.com",
};

// Plazo que se le da al adoptante para esterilizar cuando el animal sale del
// refugio sin esterilizar.
const MESES_PARA_ESTERILIZAR = 6;

// moment no tiene el idioma español cargado en el panel, y no vale la pena
// arrastrar el paquete de idiomas entero solo por la fecha de cierre.
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre",
];

export interface AdopcionContrato {
  idadopcion: number;
  Fecha_Adopcion?: string | null;
  Observaciones?: string | null;
  Estado?: string | null;
  adoptante?: {
    Nombre?: string;
    Apellido?: string;
    Dni?: string;
    Direccion?: string;
    telefono?: string;
    correo?: string | null;
    distrito?: string | null;
    telefono_referencia?: string | null;
    tipo_vivienda?: string | null;
    tenencia_vivienda?: string | null;
    tiene_patio?: boolean | number | null;
    tiene_otras_mascotas?: boolean | number | null;
    detalle_mascotas?: string | null;
  } | null;
  animales?: {
    nombre?: string;
    idtipoanimal?: number | string;
    idgenero?: number | string;
    tamano?: string;
    peso?: string;
    esterelizacion?: string;
    Fecha_Ingreso?: string;
    foto?: string;
    edad_texto?: string | null;
  } | null;
}

function etiqueta(lista: { valor: string; etiqueta: string }[], valor: any, porDefecto = "—") {
  const encontrado = lista.find((o) => o.valor === String(valor));
  return encontrado ? encontrado.etiqueta : porDefecto;
}

function texto(valor: any, porDefecto = "—") {
  const limpio = valor === null || valor === undefined ? "" : String(valor).trim();
  return limpio === "" ? porDefecto : limpio;
}

function fecha(valor: any, porDefecto = "—") {
  const m = moment(valor);
  return valor && m.isValid() ? m.format("DD/MM/YYYY") : porDefecto;
}

/** "15 de marzo de 2026", para la línea de cierre del contrato. */
function fechaLarga(valor: any) {
  const m = moment(valor);
  const usar = valor && m.isValid() ? m : moment();
  return usar.date() + " de " + MESES[usar.month()] + " de " + usar.year();
}

/** "~2 años, 3 meses" se lee mejor como "aprox. 2 años, 3 meses". */
function edadLegible(valor: any) {
  const limpio = texto(valor, "");
  if (!limpio) return "No determinada";
  return limpio.startsWith("~") ? "aprox. " + limpio.slice(1) : limpio;
}

/** "Casa · Propia · con patio", o "—" si no se registró nada. */
function describirVivienda(a: any) {
  const partes = [a?.tipo_vivienda, a?.tenencia_vivienda].filter(Boolean);
  if (a?.tiene_patio === true || a?.tiene_patio === 1) partes.push("con patio o área cerrada");
  else if (a?.tiene_patio === false || a?.tiene_patio === 0) partes.push("sin patio");
  return partes.length ? partes.join(" · ") : "—";
}

/** Domicilio con el distrito pegado, que es como se escribe una dirección. */
function domicilioCompleto(a: any) {
  const direccion = texto(a?.Direccion, "");
  const distrito = texto(a?.distrito, "");
  if (!direccion && !distrito) return "—";
  if (!distrito) return direccion;
  if (!direccion) return distrito;
  return direccion + ", " + distrito;
}

function estaEsterilizado(valor: any) {
  return String(valor || "").trim().toLowerCase().startsWith("s");
}

/** Número correlativo legible del contrato: ADOP-2026-0007. */
export function numeroContrato(adopcion: AdopcionContrato) {
  const m = moment(adopcion.Fecha_Adopcion);
  const anio = adopcion.Fecha_Adopcion && m.isValid() ? m.format("YYYY") : moment().format("YYYY");
  return "ADOP-" + anio + "-" + String(adopcion.idadopcion ?? 0).padStart(4, "0");
}

function base64Desde(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binario = "";
  // De a pedazos: pasarle el arreglo entero a fromCharCode revienta la pila
  // con imágenes grandes.
  for (let i = 0; i < bytes.length; i += 8192) {
    binario += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 8192)));
  }
  return btoa(binario);
}

/** jsPDF necesita saber el formato; se deduce de la propia data URL. */
function formatoDe(dataUrl: string) {
  return dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
}

/**
 * Descarga una imagen y la deja lista para incrustar. Devuelve null si no se
 * pudo traer: el contrato se emite igual, solo que sin la imagen. Cuando hay
 * canvas disponible la reduce antes, porque las fotos subidas desde un celular
 * pesan varios MB y el contrato terminaría pesando lo mismo.
 *
 * `fondo` es el color con el que se rellena la transparencia. Importa para el
 * logo, que es un PNG transparente y va sobre la banda crema del encabezado:
 * aplanarlo sobre blanco le dejaría un recuadro blanco alrededor.
 */
async function cargarImagen(url: string, fondo = "#FFFFFF"): Promise<string | null> {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) return null;
    const blob = await respuesta.blob();
    if (!blob.type.startsWith("image/")) return null;

    const crudo = "data:" + blob.type + ";base64," + base64Desde(await blob.arrayBuffer());
    if (typeof document === "undefined" || typeof Image === "undefined") return crudo;

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = crudo;
    });

    const escala = Math.min(1, 480 / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * escala));
    const h = Math.max(1, Math.round(img.height * escala));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return crudo;
    // Sin este relleno los PNG transparentes salen con el fondo en negro.
    ctx.fillStyle = fondo;
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.78);
  } catch {
    return null;
  }
}

/** Cláusulas del contrato. El texto cambia según el animal salga o no esterilizado. */
function clausulas(nombreAnimal: string, esterilizado: boolean): [string, string][] {
  const animal = nombreAnimal === "—" ? "el animal" : nombreAnimal;
  return [
    [
      "PRIMERA. OBJETO",
      "EL REFUGIO entrega en adopción a EL ADOPTANTE al animal descrito en el presente documento, de " +
        "forma gratuita y con el único fin de que reciba un hogar y tenencia responsable. La entrega no " +
        "constituye compraventa ni genera contraprestación económica alguna.",
    ],
    [
      "SEGUNDA. ESTADO DEL ANIMAL",
      "EL REFUGIO declara entregar a " + animal + " en las condiciones de salud y comportamiento que " +
        "constan en su ficha, las cuales han sido informadas a EL ADOPTANTE, quien manifiesta recibirlo " +
        "de conformidad.",
    ],
    [
      "TERCERA. COMPROMISOS DE EL ADOPTANTE",
      "EL ADOPTANTE se obliga a proveer alimentación adecuada, agua limpia permanente, alojamiento digno " +
        "y protegido, atención veterinaria oportuna, vacunación y desparasitación al día. Se obliga " +
        "asimismo a no mantenerlo encadenado ni en encierro permanente, a no someterlo a maltrato, " +
        "abandono ni situaciones de riesgo, y a no destinarlo a experimentación, reproducción con fines " +
        "comerciales, peleas ni ninguna actividad lucrativa.",
    ],
    [
      "CUARTA. ESTERILIZACIÓN",
      esterilizado
        ? "EL REFUGIO entrega a " + animal + " ya esterilizado. EL ADOPTANTE se obliga a conservar la " +
          "constancia correspondiente y a no someterlo a procedimientos reproductivos."
        : "Al no encontrarse esterilizado a la fecha, EL ADOPTANTE se compromete a esterilizarlo dentro " +
          "de los " + MESES_PARA_ESTERILIZAR + " meses siguientes a la suscripción del presente " +
          "documento, y a comunicar dicho acto a EL REFUGIO.",
    ],
    [
      "QUINTA. SEGUIMIENTO POSTERIOR",
      "EL ADOPTANTE autoriza a EL REFUGIO a realizar el seguimiento del animal adoptado mediante " +
        "comunicación virtual, envío de fotografías o visitas previamente coordinadas, durante el primer " +
        "año posterior a la adopción, y se compromete a responder dichas comunicaciones.",
    ],
    [
      "SEXTA. DEVOLUCIÓN Y TRASPASO",
      "Si por cualquier motivo EL ADOPTANTE no pudiera continuar a cargo del animal, se obliga a " +
        "comunicarlo a EL REFUGIO y a devolverlo, quedando prohibida su entrega, venta o cesión a " +
        "terceros sin autorización escrita de EL REFUGIO.",
    ],
    [
      "SÉPTIMA. INCUMPLIMIENTO",
      "El incumplimiento de cualquiera de las obligaciones asumidas faculta a EL REFUGIO a recuperar al " +
        "animal, sin derecho a reembolso ni indemnización alguna, y sin perjuicio de las acciones " +
        "previstas en la Ley N.° 30407, Ley de Protección y Bienestar Animal.",
    ],
    [
      "OCTAVA. DATOS PERSONALES",
      "EL ADOPTANTE autoriza el tratamiento de sus datos personales por parte de EL REFUGIO, con la " +
        "única finalidad de gestionar la adopción y su seguimiento, conforme a la Ley N.° 29733, Ley de " +
        "Protección de Datos Personales.",
    ],
    [
      "NOVENA. ACEPTACIÓN",
      "Las partes declaran haber leído el presente documento y aceptar su contenido en todos sus " +
        "extremos, suscribiéndolo en dos ejemplares de igual valor.",
    ],
  ];
}

/**
 * Arma el contrato y devuelve el documento jsPDF, sin descargarlo. Se expone
 * aparte de la descarga para poder generarlo y revisarlo en pruebas.
 */
export async function construirContrato(adopcion: AdopcionContrato, urlFoto?: string | null) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const adoptante = adopcion.adoptante || {};
  const animal = adopcion.animales || {};
  const numero = numeroContrato(adopcion);

  const nombreAdoptante = texto([adoptante.Nombre, adoptante.Apellido].filter(Boolean).join(" "));
  const nombreAnimal = texto(animal.nombre);
  const especie = etiqueta(TIPOS, animal.idtipoanimal);
  const sexo = etiqueta(GENEROS, animal.idgenero);
  const esterilizado = estaEsterilizado(animal.esterelizacion);

  const alturaLinea = () => doc.getLineHeight() / doc.internal.scaleFactor;

  // --- Encabezado -----------------------------------------------------------
  doc.setFillColor(CREMA[0], CREMA[1], CREMA[2]);
  doc.rect(0, 0, ANCHO_HOJA, 26, "F");
  doc.setDrawColor(NARANJA[0], NARANJA[1], NARANJA[2]);
  doc.setLineWidth(0.7);
  doc.line(0, 26, ANCHO_HOJA, 26);

  // El logo no es cuadrado (500x358), asi que se calcula el ancho a partir de
  // su proporcion: forzarlo a un cuadrado lo dejaria aplastado. El texto del
  // encabezado arranca despues de donde termine el logo.
  let xTexto = MARGEN + 24;
  try {
    const logo = await cargarImagen(window.location.origin + "/images/logocito.png", CREMA_HEX);
    if (logo) {
      const props = doc.getImageProperties(logo);
      const altoLogo = 16;
      const anchoLogo = Math.min(30, (props.width / props.height) * altoLogo);
      doc.addImage(logo, formatoDe(logo), MARGEN, 5, anchoLogo, altoLogo);
      xTexto = MARGEN + anchoLogo + 5;
    }
  } catch {
    // Sin logo el contrato sigue siendo válido; no vale la pena abortar.
  }

  doc.setTextColor(NARANJA[0], NARANJA[1], NARANJA[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(REFUGIO.nombre, xTexto, 12);
  doc.setTextColor(GRIS[0], GRIS[1], GRIS[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(REFUGIO.direccion + "  ·  " + REFUGIO.telefono, xTexto, 17.5);
  doc.text(REFUGIO.correo, xTexto, 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(NARANJA[0], NARANJA[1], NARANJA[2]);
  doc.text("N.° " + numero, ANCHO_HOJA - MARGEN, 12, { align: "right" });

  // --- Título ---------------------------------------------------------------
  doc.setTextColor(TEXTO[0], TEXTO[1], TEXTO[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("CONTRATO DE ADOPCIÓN RESPONSABLE", ANCHO_HOJA / 2, 38, { align: "center" });

  let y = 47;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const entrada =
    "Conste por el presente documento el Contrato de Adopción Responsable que celebran, de una parte, " +
    REFUGIO.nombre + ", con domicilio en " + REFUGIO.direccion + ", a quien en adelante se denominará " +
    "EL REFUGIO; y de la otra parte, " + nombreAdoptante + ", identificado(a) con DNI N.° " +
    texto(adoptante.Dni) + ", con domicilio en " + domicilioCompleto(adoptante) + ", a quien en adelante " +
    "se denominará EL ADOPTANTE; en los términos y condiciones siguientes:";
  const lineasEntrada = doc.splitTextToSize(entrada, ANCHO_UTIL);
  doc.text(lineasEntrada, MARGEN, y, { align: "justify", maxWidth: ANCHO_UTIL });
  y += lineasEntrada.length * alturaLinea() + 4;

  // --- Datos de las partes --------------------------------------------------
  const cabecera = {
    fillColor: NARANJA,
    textColor: [255, 255, 255] as [number, number, number],
    fontStyle: "bold" as const,
    fontSize: 8.5,
  };
  const cuerpo = { fontSize: 8.5, textColor: TEXTO, cellPadding: 1.6 };
  const primeraColumna = { 0: { cellWidth: 50, fontStyle: "bold" as const } };

  autoTable(doc, {
    startY: y,
    head: [[{ content: "DATOS DEL ADOPTANTE", colSpan: 2 }]],
    body: [
      ["Nombres y apellidos", nombreAdoptante],
      ["Documento de identidad", texto(adoptante.Dni)],
      ["Domicilio", domicilioCompleto(adoptante)],
      [
        "Teléfonos",
        texto(adoptante.telefono) +
          (texto(adoptante.telefono_referencia, "") ? "  ·  referencia: " + adoptante.telefono_referencia : ""),
      ],
      ["Correo electrónico", texto(adoptante.correo)],
      ["Vivienda declarada", describirVivienda(adoptante)],
    ],
    theme: "grid",
    headStyles: cabecera,
    bodyStyles: cuerpo,
    columnStyles: primeraColumna,
    margin: { left: MARGEN, right: MARGEN },
    tableWidth: ANCHO_UTIL,
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // La foto va a la derecha de la ficha del animal, así que la tabla se angosta
  // para dejarle sitio (solo si la foto se pudo traer).
  const foto = urlFoto ? await cargarImagen(urlFoto) : null;
  const anchoFoto = 40;
  const anchoTabla = foto ? ANCHO_UTIL - anchoFoto - 5 : ANCHO_UTIL;
  const yAnimal = y;

  autoTable(doc, {
    startY: y,
    head: [[{ content: "DATOS DEL ANIMAL ADOPTADO", colSpan: 2 }]],
    body: [
      ["Nombre", nombreAnimal],
      ["Especie / Sexo", especie + " / " + sexo],
      ["Edad", edadLegible(animal.edad_texto)],
      ["Tamaño / Peso", texto(animal.tamano) + " / " + texto(animal.peso)],
      ["Esterilizado", esterilizado ? "Sí" : "No"],
      ["Ingreso al refugio", fecha(animal.Fecha_Ingreso)],
      ["Fecha de adopción", fecha(adopcion.Fecha_Adopcion)],
    ],
    theme: "grid",
    headStyles: cabecera,
    bodyStyles: cuerpo,
    columnStyles: primeraColumna,
    margin: { left: MARGEN, right: MARGEN },
    tableWidth: anchoTabla,
  });
  y = (doc as any).lastAutoTable.finalY;

  if (foto) {
    try {
      // La foto se ajusta dentro del hueco reservado sin deformarse: se escala
      // por el lado que primero toca el limite y se centra en la columna. Una
      // foto vertical de celular (320x480) estirada a un cuadro fijo saldria
      // achatada, y es la cara del animal que se esta entregando.
      const props = doc.getImageProperties(foto);
      const altoMaximo = 46;
      const escala = Math.min(anchoFoto / props.width, altoMaximo / props.height);
      const w = props.width * escala;
      const h = props.height * escala;
      const x = MARGEN + anchoTabla + 5 + (anchoFoto - w) / 2;
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.rect(x - 1, yAnimal, w + 2, h + 2);
      doc.addImage(foto, formatoDe(foto), x, yAnimal + 1, w, h);
      y = Math.max(y, yAnimal + h + 2);
    } catch {
      // Imagen ilegible: se omite y el contrato sale sin foto.
    }
  }
  y += 6;

  // --- Cláusulas ------------------------------------------------------------
  const asegurarEspacio = (alto: number) => {
    if (y + alto > PIE) {
      doc.addPage();
      y = 22;
    }
  };

  const bloque = (titulo: string, parrafo: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const lineas = doc.splitTextToSize(parrafo, ANCHO_UTIL);
    asegurarEspacio(lineas.length * alturaLinea() + 10);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(NARANJA[0], NARANJA[1], NARANJA[2]);
    doc.text(titulo, MARGEN, y);
    y += alturaLinea() + 0.5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(TEXTO[0], TEXTO[1], TEXTO[2]);
    doc.text(lineas, MARGEN, y, { align: "justify", maxWidth: ANCHO_UTIL });
    y += lineas.length * alturaLinea() + 3.5;
  };

  clausulas(nombreAnimal, esterilizado).forEach(([titulo, parrafo]) => bloque(titulo, parrafo));

  // Observaciones registradas en la adopción, si las hay.
  const observaciones = texto(adopcion.Observaciones, "");
  if (observaciones) bloque("DÉCIMA. OBSERVACIONES", observaciones);

  // --- Firmas ---------------------------------------------------------------
  asegurarEspacio(48);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(TEXTO[0], TEXTO[1], TEXTO[2]);
  doc.text("Callao, " + fechaLarga(adopcion.Fecha_Adopcion) + ".", MARGEN, y);
  y += 22;

  const anchoFirma = 70;
  const xIzq = MARGEN + 6;
  const xDer = ANCHO_HOJA - MARGEN - anchoFirma - 6;
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.3);
  doc.line(xIzq, y, xIzq + anchoFirma, y);
  doc.line(xDer, y, xDer + anchoFirma, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("EL REFUGIO", xIzq + anchoFirma / 2, y, { align: "center" });
  doc.text("EL ADOPTANTE", xDer + anchoFirma / 2, y, { align: "center" });
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(GRIS[0], GRIS[1], GRIS[2]);
  doc.text(REFUGIO.nombre, xIzq + anchoFirma / 2, y, { align: "center" });
  doc.text(nombreAdoptante, xDer + anchoFirma / 2, y, { align: "center" });
  y += 4;
  doc.text("Nombre y firma del responsable", xIzq + anchoFirma / 2, y, { align: "center" });
  doc.text("DNI N.° " + texto(adoptante.Dni), xDer + anchoFirma / 2, y, { align: "center" });

  // --- Pie de página en todas las hojas -------------------------------------
  const usuario = (typeof localStorage !== "undefined" && localStorage.getItem("user")) || "—";
  const paginas = doc.getNumberOfPages();
  for (let i = 1; i <= paginas; i++) {
    doc.setPage(i);
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(MARGEN, 284, ANCHO_HOJA - MARGEN, 284);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(GRIS[0], GRIS[1], GRIS[2]);
    doc.text(
      "Contrato " + numero + "  ·  Emitido el " + moment().format("DD/MM/YYYY HH:mm") + " por " + usuario,
      MARGEN,
      288.5
    );
    doc.text("Página " + i + " de " + paginas, ANCHO_HOJA - MARGEN, 288.5, { align: "right" });
  }

  return doc;
}

/** Nombre del archivo, sin caracteres que Windows rechace. */
export function nombreArchivoContrato(adopcion: AdopcionContrato) {
  const animal = texto(adopcion.animales?.nombre, "animal");
  const base = "Contrato de adopcion " + numeroContrato(adopcion) + " - " + animal;
  return base.replace(/[\\/:*?"<>|]/g, "-") + ".pdf";
}

/** Genera el contrato y lo descarga. */
export async function generarContratoAdopcion(adopcion: AdopcionContrato, urlFoto?: string | null) {
  const doc = await construirContrato(adopcion, urlFoto);
  doc.save(nombreArchivoContrato(adopcion));
}
