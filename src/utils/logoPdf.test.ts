import { anchoDelLogo, dibujarLogoCabecera } from "./logoPdf";

// El logo del refugio mide 500x358. Todos los reportes lo dibujaban en un
// cuadro de 16x16 mm, o sea aplastado. Estas pruebas fijan la regla: el ancho
// sale de la proporción del archivo, nunca de un valor fijo.

const LOGO = { ancho: 500, alto: 358 };

describe("anchoDelLogo", () => {
  test("respeta la proporción del logo real", () => {
    const ancho = anchoDelLogo(LOGO.ancho, LOGO.alto, 16);
    expect(ancho / 16).toBeCloseTo(LOGO.ancho / LOGO.alto, 3);
  });

  test("una imagen cuadrada sí ocupa un cuadrado", () => {
    expect(anchoDelLogo(200, 200, 16)).toBeCloseTo(16, 5);
  });

  test("una imagen muy alargada se recorta al ancho máximo", () => {
    expect(anchoDelLogo(3000, 100, 16)).toBe(30);
  });

  test("medidas inválidas no producen un ancho absurdo", () => {
    for (const [w, h] of [[0, 358], [500, 0], [-1, 10], [NaN, 10]]) {
      expect(anchoDelLogo(w, h, 16)).toBe(16);
    }
  });
});

describe("dibujarLogoCabecera", () => {
  test("si el logo no carga, el título queda donde siempre estuvo", async () => {
    // En jsdom no hay canvas, así que se toma el camino de fallo a propósito:
    // lo que importa es que el encabezado no se descoloque por eso.
    const doc = {
      getImageProperties: () => ({ width: LOGO.ancho, height: LOGO.alto }),
      addImage: jest.fn(),
    };
    await expect(dibujarLogoCabecera(doc, 10, 4, 16)).resolves.toBe(30);
    expect(doc.addImage).not.toHaveBeenCalled();
  });
});
