import {
  soloDigitos,
  soloDecimal,
  telefonoValido,
  dniValido,
  rucValido,
  correoValido,
  LARGO_TELEFONO,
  LARGO_DNI,
  LARGO_RUC,
} from "./campos";

describe("soloDigitos", () => {
  it("descarta todo lo que no sea número", () => {
    expect(soloDigitos("abc987def654xyz321", 9)).toBe("987654321");
    expect(soloDigitos("+51 987-654-321", 9)).toBe("519876543");
    expect(soloDigitos("9e5", 9)).toBe("95");
    expect(soloDigitos("-12.5", 9)).toBe("125");
  });

  it("recorta al largo máximo", () => {
    expect(soloDigitos("98765432112345", LARGO_TELEFONO)).toBe("987654321");
    expect(soloDigitos("1234567890", LARGO_DNI)).toBe("12345678");
    expect(soloDigitos("123456789012345", LARGO_RUC)).toBe("12345678901");
  });

  it("tolera vacío y nulos sin romperse", () => {
    expect(soloDigitos("", 9)).toBe("");
    expect(soloDigitos(undefined as any, 9)).toBe("");
  });
});

describe("soloDecimal", () => {
  it("acepta montos con hasta dos decimales", () => {
    expect(soloDecimal("150.75")).toBe("150.75");
    expect(soloDecimal("0.5")).toBe("0.5");
  });

  it("no deja escribir negativos ni notación científica", () => {
    expect(soloDecimal("-150")).toBe("150");
    expect(soloDecimal("1e10")).toBe("110");
    expect(soloDecimal("+80")).toBe("80");
  });

  it("colapsa varios puntos en uno solo", () => {
    expect(soloDecimal("12.34.56")).toBe("12.34");
    expect(soloDecimal("1.2.3")).toBe("1.23");
  });

  it("recorta los decimales sobrantes", () => {
    expect(soloDecimal("10.999")).toBe("10.99");
  });

  it("quita letras y símbolos de moneda", () => {
    expect(soloDecimal("S/ 250 soles")).toBe("250");
  });
});

describe("validación de documentos y contacto (Perú)", () => {
  it("el teléfono debe tener exactamente 9 dígitos", () => {
    expect(telefonoValido("987654321")).toBe(true);
    expect(telefonoValido("98765432")).toBe(false);
    expect(telefonoValido("9876543210")).toBe(false);
    expect(telefonoValido("")).toBe(true); // vacío lo decide cada formulario
  });

  it("el DNI debe tener exactamente 8 dígitos", () => {
    expect(dniValido("12345678")).toBe(true);
    expect(dniValido("1234567")).toBe(false);
    expect(dniValido("123456789")).toBe(false);
  });

  it("el RUC debe tener exactamente 11 dígitos", () => {
    expect(rucValido("20123456789")).toBe(true);
    expect(rucValido("2012345678")).toBe(false);
  });

  it("el correo necesita usuario, arroba y dominio con punto", () => {
    expect(correoValido("refugio@gmail.com")).toBe(true);
    expect(correoValido("refugio@gmail")).toBe(false);
    expect(correoValido("refugio.com")).toBe(false);
    expect(correoValido("a b@gmail.com")).toBe(false);
  });
});
