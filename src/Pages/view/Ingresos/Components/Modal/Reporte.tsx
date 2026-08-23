import moment from "moment";

// Miniatura de la evidencia tal cual se ve en la miniatura de la tabla.
// Ancho/alto en milímetros dentro del PDF.
const EVIDENCIA_MM = 22;
// Lado máximo en píxeles al que se reduce cada evidencia antes de meterla al
// PDF: las capturas de Yape/Plin vienen en resolución de celular y sin
// reducirlas el archivo terminaba pesando decenas de MB.
const EVIDENCIA_PX = 260;

interface Miniatura {
  dataUrl: string;
  ratio: number; // ancho / alto
}

/**
 * Descarga la evidencia y la deja como data URL reducida. Devuelve null si la
 * imagen no existe, no carga o el registro no tiene evidencia: en ese caso el
 * reporte muestra un guion en vez de romperse.
 */
async function cargarMiniatura(url: string): Promise<Miniatura | null> {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) return null;
    const blob = await respuesta.blob();
    if (!blob.type.startsWith("image/")) return null;
    const objectUrl = URL.createObjectURL(blob);

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = objectUrl;
      });

      const escala = Math.min(1, EVIDENCIA_PX / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * escala));
      const h = Math.max(1, Math.round(img.height * escala));

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      // Fondo blanco: los PNG con transparencia salían negros al pasarlos a JPEG.
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      return { dataUrl: canvas.toDataURL("image/jpeg", 0.72), ratio: w / h };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

export interface IngresoReporte {
  idtblingreso: number;
  donante?: { fullname?: string } | null;
  monto?: any;
  suministro?: string;
  donacion?: string;
  pago?: string;
  fecha_registro?: string;
  evidencia?: string;
}

/**
 * Genera el reporte de ingresos en PDF, con la evidencia de cada registro
 * incrustada en su fila. `onProgreso` permite avisar en pantalla mientras se
 * descargan las imágenes, que es la parte lenta.
 */
export async function generarReporteIngresos(
  ingresos: IngresoReporte[],
  buildImgUrl: (evidencia: string) => string,
  onProgreso?: (hechos: number, total: number) => void
) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  // Las evidencias se bajan antes de dibujar: autoTable pinta las celdas de
  // forma síncrona y no puede esperar una promesa dentro del callback.
  const miniaturas: (Miniatura | null)[] = [];
  for (let i = 0; i < ingresos.length; i++) {
    const evidencia = ingresos[i].evidencia;
    miniaturas.push(evidencia ? await cargarMiniatura(buildImgUrl(evidencia)) : null);
    onProgreso?.(i + 1, ingresos.length);
  }

  const doc = new jsPDF({ orientation: "portrait" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const usuario = localStorage.getItem("user") || "—";

  doc.setFillColor(251, 247, 242);
  doc.rect(0, 0, pageWidth, 24, "F");
  doc.setDrawColor(228, 96, 47);
  doc.setLineWidth(0.7);
  doc.line(0, 24, pageWidth, 24);

  const logo = await cargarMiniatura(`${window.location.origin}/images/logocito.png`);
  if (logo) doc.addImage(logo.dataUrl, "JPEG", 10, 4, 16, 16);

  doc.setTextColor(228, 96, 47);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Refugio Colitas y Amor", 30, 12);
  doc.setTextColor(90, 90, 90);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Reporte de Ingresos", 30, 19);

  const totalMonto = ingresos.reduce((suma, i) => suma + (Number(i.monto) || 0), 0);
  const conEvidencia = miniaturas.filter(Boolean).length;

  doc.setTextColor(110, 110, 110);
  doc.setFontSize(9);
  doc.text(
    `Generado: ${moment().format("DD-MM-YYYY HH:mm")}   ·   Exportado por: ${usuario}   ·   Total: ${
      ingresos.length
    } ingreso(s)`,
    10,
    31
  );
  doc.text(
    `Monto acumulado: S/ ${totalMonto.toFixed(2)}   ·   Con evidencia adjunta: ${conEvidencia} de ${ingresos.length}`,
    10,
    36
  );

  autoTable(doc, {
    startY: 41,
    head: [["Fecha", "Donante", "Monto (S/)", "Donación", "Tipo pago", "Suministro", "Evidencia"]],
    body: ingresos.map((i) => [
      i.fecha_registro ? moment(i.fecha_registro).format("DD-MM-YYYY") : "",
      i.donante?.fullname || "—",
      Number(i.monto || 0).toFixed(2),
      i.donacion || "",
      i.pago || "",
      i.suministro || "",
      "", // la evidencia se dibuja como imagen en didDrawCell
    ]),
    styles: { fontSize: 8, cellPadding: 3, textColor: [60, 60, 60], valign: "middle" },
    headStyles: { fillColor: [228, 96, 47], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [251, 247, 242] },
    columnStyles: {
      2: { halign: "right" },
      6: { cellWidth: EVIDENCIA_MM + 6, minCellHeight: EVIDENCIA_MM + 4, halign: "center" },
    },
    didDrawCell: (data: any) => {
      if (data.section !== "body" || data.column.index !== 6) return;
      const mini = miniaturas[data.row.index];
      if (!mini) {
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.text("—", data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 1, {
          align: "center",
        });
        return;
      }
      // Se respeta la proporción original para que la captura no salga estirada.
      const alto = mini.ratio >= 1 ? EVIDENCIA_MM / mini.ratio : EVIDENCIA_MM;
      const ancho = mini.ratio >= 1 ? EVIDENCIA_MM : EVIDENCIA_MM * mini.ratio;
      const x = data.cell.x + (data.cell.width - ancho) / 2;
      const y = data.cell.y + (data.cell.height - alto) / 2;
      doc.addImage(mini.dataUrl, "JPEG", x, y, ancho, alto);
    },
  });

  const pageCount = doc.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 30, pageHeight - 8);
    doc.text("Refugio Colitas y Amor", 10, pageHeight - 8);
  }

  doc.save(`ingresos_${moment().format("YYYYMMDD_HHmm")}.pdf`);
}
