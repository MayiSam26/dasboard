// Valores compartidos por la tabla, el buscador y los formularios de Colitas.
// Estaban repetidos en tres archivos, así que agregar un estado obligaba a
// acordarse de los tres.

export interface OpcionEstado {
  valor: string;
  etiqueta: string;
}

// Ojo con las mayúsculas: estos son los valores tal como están guardados en la
// base. Se respetan tal cual para no romper los registros existentes.
export const ESTADOS: OpcionEstado[] = [
  { valor: "En refugio", etiqueta: "En refugio" },
  { valor: "proceso", etiqueta: "En proceso" },
  { valor: "adoptado", etiqueta: "Adoptado" },
  { valor: "Fallecido", etiqueta: "Fallecido" },
  { valor: "De baja", etiqueta: "De baja" },
];

// Salidas del albergue que no son una adopción. Marcar una sin explicar por
// qué deja un hueco en la trazabilidad, así que el motivo es obligatorio.
// El backend valida lo mismo (ver ColitasController).
export const ESTADOS_CON_MOTIVO = ["De baja", "Fallecido"];

export function exigeMotivo(estado: string): boolean {
  return ESTADOS_CON_MOTIVO.includes(estado);
}

// Motivos frecuentes, para no obligar a escribirlos cada vez. La lista es
// solo una ayuda: el campo admite texto libre.
export const MOTIVOS_SUGERIDOS: Record<string, string[]> = {
  "De baja": [
    "Trasladado a otro albergue",
    "Devuelto a su dueño",
    "Se escapó del refugio",
    "Error en el registro",
  ],
  Fallecido: [
    "Falleció por enfermedad",
    "Falleció por edad avanzada",
    "Falleció tras un accidente",
  ],
};

export const TIPOS: OpcionEstado[] = [
  { valor: "1", etiqueta: "Gato" },
  { valor: "2", etiqueta: "Perro" },
];

export const GENEROS: OpcionEstado[] = [
  { valor: "1", etiqueta: "Macho" },
  { valor: "2", etiqueta: "Hembra" },
];

export const TAMANOS: OpcionEstado[] = [
  { valor: "pequeño", etiqueta: "Pequeño" },
  { valor: "mediano", etiqueta: "Mediano" },
  { valor: "grande", etiqueta: "Grande" },
];
