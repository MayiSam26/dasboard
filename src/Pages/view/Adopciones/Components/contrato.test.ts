import { numeroContrato, nombreArchivoContrato, AdopcionContrato } from "./contrato";

// El número de contrato y el nombre del archivo son lo único que el usuario ve
// fuera del PDF: aparecen en el aviso de descarga y en su carpeta de descargas.
// Si dos adopciones distintas compartieran número, dos contratos firmados se
// referirían al mismo documento.

const base: AdopcionContrato = {
  idadopcion: 7,
  Fecha_Adopcion: "2026-03-15",
  animales: { nombre: "Rocky" },
};

describe("numeroContrato", () => {
  test("usa el año de la adopción y rellena el correlativo", () => {
    expect(numeroContrato(base)).toBe("ADOP-2026-0007");
  });

  test("dos adopciones distintas nunca comparten número", () => {
    const otra = { ...base, idadopcion: 8 };
    expect(numeroContrato(otra)).not.toBe(numeroContrato(base));
  });

  test("una adopción del mismo id pero de otro año se distingue", () => {
    const anterior = { ...base, Fecha_Adopcion: "2025-11-02" };
    expect(numeroContrato(anterior)).toBe("ADOP-2025-0007");
  });

  test("sin fecha de adopción cae al año actual en vez de romperse", () => {
    const sinFecha = { ...base, Fecha_Adopcion: null };
    expect(numeroContrato(sinFecha)).toMatch(/^ADOP-\d{4}-0007$/);
  });

  test("un correlativo de más de cuatro cifras no se recorta", () => {
    expect(numeroContrato({ ...base, idadopcion: 12345 })).toBe("ADOP-2026-12345");
  });
});

describe("nombreArchivoContrato", () => {
  test("incluye el número y el nombre del animal", () => {
    expect(nombreArchivoContrato(base)).toBe("Contrato de adopcion ADOP-2026-0007 - Rocky.pdf");
  });

  test("un nombre con caracteres que Windows rechaza no rompe la descarga", () => {
    const raro = { ...base, animales: { nombre: 'Luna/Sol: "la <travieza>"' } };
    expect(nombreArchivoContrato(raro)).not.toMatch(/[\\/:*?"<>|]/);
    expect(nombreArchivoContrato(raro).endsWith(".pdf")).toBe(true);
  });

  test("sin animal asociado igual produce un nombre utilizable", () => {
    expect(nombreArchivoContrato({ ...base, animales: null })).toBe(
      "Contrato de adopcion ADOP-2026-0007 - animal.pdf"
    );
  });
});
