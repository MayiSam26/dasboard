import { linearForecast, tendenciaDe } from "./forecast";

describe("linearForecast", () => {
  test("serie creciente clara proyecta hacia arriba", () => {
    expect(linearForecast([1, 2, 3, 4, 5, 6], 2)).toEqual([7, 8]);
  });

  test("serie plana proyecta el mismo valor", () => {
    expect(linearForecast([3, 3, 3, 3, 3, 3], 2)).toEqual([3, 3]);
  });

  test("serie decreciente nunca proyecta valores negativos", () => {
    const resultado = linearForecast([6, 5, 4, 3, 2, 1], 2);
    resultado.forEach((v) => expect(v).toBeGreaterThanOrEqual(0));
  });

  test("con un solo dato, repite ese valor", () => {
    expect(linearForecast([4], 2)).toEqual([4, 4]);
  });

  test("con todo en cero, proyecta cero (no negativo)", () => {
    expect(linearForecast([0, 0, 0, 0, 0, 0], 2)).toEqual([0, 0]);
  });

  test("con ruido leve alrededor de un promedio estable, no se dispara", () => {
    const resultado = linearForecast([2, 3, 2, 3, 2, 3], 2);
    resultado.forEach((v) => expect(v).toBeGreaterThanOrEqual(2));
    resultado.forEach((v) => expect(v).toBeLessThanOrEqual(4));
  });
});

describe("tendenciaDe", () => {
  test("serie creciente clara se etiqueta como en aumento", () => {
    expect(tendenciaDe([1, 2, 3, 4, 5, 6]).label).toBe("↑ En aumento");
  });

  test("serie decreciente clara se etiqueta como en descenso", () => {
    expect(tendenciaDe([6, 5, 4, 3, 2, 1]).label).toBe("↓ En descenso");
  });

  test("serie plana se etiqueta como estable", () => {
    expect(tendenciaDe([3, 3, 3, 3, 3, 3]).label).toBe("→ Estable");
  });

  test("ruido leve alrededor de un promedio estable no se lee como tendencia", () => {
    expect(tendenciaDe([2, 3, 2, 3, 2, 3]).label).toBe("→ Estable");
  });

  test("siempre devuelve una de las tres etiquetas válidas", () => {
    const etiquetasValidas = ["↑ En aumento", "↓ En descenso", "→ Estable"];
    expect(etiquetasValidas).toContain(tendenciaDe([0, 0, 0, 0, 0, 0]).label);
  });
});
