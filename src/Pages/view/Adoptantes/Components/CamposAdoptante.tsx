import React from "react";
import {
  Autocomplete,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import {
  soloDigitos,
  propsNumericos,
  correoValido,
  LARGO_TELEFONO,
  AYUDA_TELEFONO,
} from "../../../../utils/campos";

// Campos de la ficha del adoptante que van más allá del contacto básico.
//
// Están en un componente propio porque los usan el formulario de alta y el de
// edición, y porque el backend valida exactamente lo mismo (ver
// helpers/adoptante.js). Tener las dos listas de opciones separadas fue lo que
// permitió que se guardaran valores que el servidor después descarta.

export interface FichaAdoptante {
  correo: string;
  distrito: string;
  telefono_referencia: string;
  fecha_nacimiento: string;
  tipo_vivienda: string;
  tenencia_vivienda: string;
  tiene_patio: string;
  tiene_otras_mascotas: string;
  detalle_mascotas: string;
}

export const FICHA_VACIA: FichaAdoptante = {
  correo: "",
  distrito: "",
  telefono_referencia: "",
  fecha_nacimiento: "",
  tipo_vivienda: "",
  tenencia_vivienda: "",
  tiene_patio: "",
  tiene_otras_mascotas: "",
  detalle_mascotas: "",
};

// Las mismas listas que acepta el servidor. Cualquier otro valor lo descarta.
export const TIPOS_VIVIENDA = ["Casa", "Departamento", "Quinta", "Otro"];
export const TENENCIAS = ["Propia", "Alquilada", "Familiar"];

// Sugerencias, no una lista cerrada: los adoptantes registrados vienen de
// distritos de Lima y Callao, e incluso de fuera.
export const DISTRITOS = [
  "Bellavista", "Callao", "Carmen de la Legua", "La Perla", "La Punta",
  "Mi Perú", "Ventanilla",
  "Ate", "Breña", "Callao Cercado", "Chorrillos", "Comas", "El Agustino",
  "Independencia", "Jesús María", "La Victoria", "Lima Cercado", "Los Olivos",
  "Magdalena", "Miraflores", "Pueblo Libre", "Puente Piedra", "Rímac",
  "San Juan de Lurigancho", "San Juan de Miraflores", "San Martín de Porres",
  "San Miguel", "Santa Anita", "Surco", "Surquillo", "Villa El Salvador",
  "Villa María del Triunfo",
];

export const EDAD_MINIMA = 18;

/** Edad cumplida hoy, o null si la fecha no sirve. */
export function edadDe(fechaNacimiento: string): number | null {
  if (!fechaNacimiento) return null;
  const nacimiento = moment(fechaNacimiento, "YYYY-MM-DD", true);
  if (!nacimiento.isValid() || nacimiento.isAfter(moment())) return null;
  return moment().diff(nacimiento, "years");
}

/**
 * Devuelve el primer problema de la ficha, o null si está bien. Es el mismo
 * criterio del servidor: acá solo sirve para avisar antes de mandar.
 */
export function validarFicha(ficha: FichaAdoptante): string | null {
  if (ficha.correo && !correoValido(ficha.correo)) {
    return "El correo electrónico no tiene un formato válido.";
  }
  if (ficha.telefono_referencia && !/^\d{9}$/.test(ficha.telefono_referencia)) {
    return "El teléfono de referencia debe tener 9 dígitos numéricos.";
  }
  if (ficha.fecha_nacimiento) {
    const edad = edadDe(ficha.fecha_nacimiento);
    if (edad === null) return "La fecha de nacimiento no es válida.";
    if (edad < EDAD_MINIMA) {
      return `El adoptante debe ser mayor de ${EDAD_MINIMA} años para firmar el contrato de adopción.`;
    }
  }
  return null;
}

/** Convierte lo que devuelve el backend (booleanos, nulls) al estado del formulario. */
export function fichaDesdeApi(datos: any): FichaAdoptante {
  const siNo = (v: any) => (v === true || v === 1 ? "si" : v === false || v === 0 ? "no" : "");
  return {
    correo: datos?.correo ?? "",
    distrito: datos?.distrito ?? "",
    telefono_referencia: datos?.telefono_referencia ?? "",
    fecha_nacimiento: datos?.fecha_nacimiento ? String(datos.fecha_nacimiento).slice(0, 10) : "",
    tipo_vivienda: datos?.tipo_vivienda ?? "",
    tenencia_vivienda: datos?.tenencia_vivienda ?? "",
    tiene_patio: siNo(datos?.tiene_patio),
    tiene_otras_mascotas: siNo(datos?.tiene_otras_mascotas),
    detalle_mascotas: datos?.detalle_mascotas ?? "",
  };
}

/** Los campos tal como los espera el backend. */
export function fichaParaApi(ficha: FichaAdoptante) {
  return {
    correo: ficha.correo || null,
    distrito: ficha.distrito || null,
    telefono_referencia: ficha.telefono_referencia || null,
    fecha_nacimiento: ficha.fecha_nacimiento || null,
    tipo_vivienda: ficha.tipo_vivienda || null,
    tenencia_vivienda: ficha.tenencia_vivienda || null,
    tiene_patio: ficha.tiene_patio || null,
    tiene_otras_mascotas: ficha.tiene_otras_mascotas || null,
    detalle_mascotas: ficha.tiene_otras_mascotas === "si" ? ficha.detalle_mascotas || null : null,
  };
}

const estiloFecha: React.CSSProperties = {
  width: "100%",
  borderRadius: "8px",
  border: "1px solid var(--cya-border)",
  padding: "8.5px 10px",
  fontFamily: "inherit",
  fontSize: "1rem",
  boxSizing: "border-box",
};

function Subtitulo({ texto }: { texto: string }) {
  return (
    <Grid item xs={12}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, color: "var(--cya-primary)", mt: 0.5, mb: -0.5 }}
      >
        {texto}
      </Typography>
    </Grid>
  );
}

interface Props {
  ficha: FichaAdoptante;
  onChange: (campo: keyof FichaAdoptante, valor: string) => void;
}

/** Se pinta dentro de un <Grid container> del formulario que lo use. */
export default function CamposAdoptante({ ficha, onChange }: Props) {
  const edad = edadDe(ficha.fecha_nacimiento);
  const menor = edad !== null && edad < EDAD_MINIMA;
  const hoy = React.useMemo(() => moment().format("YYYY-MM-DD"), []);

  return (
    <>
      <Subtitulo texto="Contacto" />

      <Grid item xs={12} sm={6}>
        <TextField
          label="Correo electrónico"
          variant="outlined"
          fullWidth
          size="small"
          value={ficha.correo}
          error={!!ficha.correo && !correoValido(ficha.correo)}
          helperText={
            ficha.correo && !correoValido(ficha.correo)
              ? "Revisa el formato: nombre@dominio.com"
              : "Por aquí se hace el seguimiento posterior"
          }
          onChange={(e) => onChange("correo", e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Teléfono de referencia"
          variant="outlined"
          fullWidth
          size="small"
          value={ficha.telefono_referencia}
          helperText={`${AYUDA_TELEFONO} · respaldo si cambia de número`}
          inputProps={propsNumericos(LARGO_TELEFONO)}
          onChange={(e) => onChange("telefono_referencia", soloDigitos(e.target.value, LARGO_TELEFONO))}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Autocomplete
          freeSolo
          options={DISTRITOS}
          value={ficha.distrito}
          onChange={(_e, valor) => onChange("distrito", (valor as string) || "")}
          onInputChange={(_e, valor) => onChange("distrito", valor || "")}
          renderInput={(params) => (
            <TextField {...params} label="Distrito" size="small" variant="outlined" />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
          Fecha de nacimiento
        </Typography>
        <input
          type="date"
          max={hoy}
          value={ficha.fecha_nacimiento}
          onChange={(e) => onChange("fecha_nacimiento", e.target.value)}
          style={{
            ...estiloFecha,
            borderColor: menor ? "var(--cya-primary)" : "var(--cya-border)",
          }}
        />
        {edad !== null && (
          <Chip
            size="small"
            label={menor ? `${edad} años · menor de edad` : `${edad} años`}
            color={menor ? "error" : "default"}
            sx={{ mt: 0.8 }}
          />
        )}
      </Grid>

      <Subtitulo texto="Vivienda y convivencia" />

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth size="small">
          <InputLabel id="tipo-vivienda-label">Tipo de vivienda</InputLabel>
          <Select
            labelId="tipo-vivienda-label"
            label="Tipo de vivienda"
            value={ficha.tipo_vivienda}
            onChange={(e) => onChange("tipo_vivienda", e.target.value)}
          >
            <MenuItem value="">Sin especificar</MenuItem>
            {TIPOS_VIVIENDA.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth size="small">
          <InputLabel id="tenencia-label">La vivienda es</InputLabel>
          <Select
            labelId="tenencia-label"
            label="La vivienda es"
            value={ficha.tenencia_vivienda}
            onChange={(e) => onChange("tenencia_vivienda", e.target.value)}
          >
            <MenuItem value="">Sin especificar</MenuItem>
            {TENENCIAS.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth size="small">
          <InputLabel id="patio-label">¿Tiene patio o área cerrada?</InputLabel>
          <Select
            labelId="patio-label"
            label="¿Tiene patio o área cerrada?"
            value={ficha.tiene_patio}
            onChange={(e) => onChange("tiene_patio", e.target.value)}
          >
            <MenuItem value="">Sin especificar</MenuItem>
            <MenuItem value="si">Sí</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth size="small">
          <InputLabel id="mascotas-label">¿Tiene otras mascotas?</InputLabel>
          <Select
            labelId="mascotas-label"
            label="¿Tiene otras mascotas?"
            value={ficha.tiene_otras_mascotas}
            onChange={(e) => onChange("tiene_otras_mascotas", e.target.value)}
          >
            <MenuItem value="">Sin especificar</MenuItem>
            <MenuItem value="si">Sí</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* El detalle solo aparece si respondió que sí: preguntarlo cuando dijo
          que no deja fichas contradictorias, y el servidor lo descartaría. */}
      {ficha.tiene_otras_mascotas === "si" && (
        <Grid item xs={12}>
          <TextField
            label="¿Cuáles?"
            variant="outlined"
            fullWidth
            size="small"
            value={ficha.detalle_mascotas}
            placeholder="Ej: un perro mestizo de 4 años y dos gatos"
            onChange={(e) => onChange("detalle_mascotas", e.target.value)}
          />
        </Grid>
      )}
    </>
  );
}
