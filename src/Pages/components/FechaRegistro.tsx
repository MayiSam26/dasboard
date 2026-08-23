import React from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import moment from "moment";

interface Props {
  /** Texto sobre el campo. Ej: "Fecha de registro". */
  label: string;
  /** Valor actual en formato YYYY-MM-DD. */
  value: string;
  onChange: (valor: string) => void;
  /** Texto del checkbox que habilita la edición manual. */
  labelDesbloquear?: string;
}

/**
 * Fecha de creación de un registro: se llena sola con la de hoy y queda
 * bloqueada, porque se supone que el dato se está guardando ahora. Si de
 * verdad hace falta cargar algo con otra fecha (un ingreso de la semana
 * pasada, un rescate que recién se digitaliza), el checkbox la libera.
 *
 * Tenerla bloqueada por defecto evita dos cosas: que quede vacía por olvido,
 * y que se pueda poner cualquier fecha sin darse cuenta.
 */
export default function FechaRegistro({
  label,
  value,
  onChange,
  labelDesbloquear = "Registrar con otra fecha",
}: Props) {
  const hoy = React.useMemo(() => moment().format("YYYY-MM-DD"), []);
  const [manual, setManual] = React.useState(false);

  // Al abrir el formulario la fecha ya viene puesta: nadie tiene que elegirla.
  React.useEffect(() => {
    if (!value) onChange(hoy);
    // Solo al montar: después manda lo que el usuario haya elegido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alternarManual = (activo: boolean) => {
    setManual(activo);
    // Al volver a bloquearla se restablece la de hoy, para no dejar guardada
    // una fecha que se escribió y después se descartó.
    if (!activo) onChange(hoy);
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
        {label}
      </Typography>
      <input
        type="date"
        value={value || hoy}
        disabled={!manual}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px",
          width: "100%",
          border: "1px solid var(--cya-border)",
          borderRadius: "8px",
          boxSizing: "border-box",
          background: manual ? "#fff" : "var(--cya-bg-alt)",
          color: manual ? "inherit" : "var(--cya-text-muted)",
          cursor: manual ? "auto" : "not-allowed",
        }}
      />
      <FormControlLabel
        sx={{ mt: 0.2 }}
        control={
          <Checkbox
            size="small"
            checked={manual}
            onChange={(e) => alternarManual(e.target.checked)}
          />
        }
        label={
          <Typography variant="caption" sx={{ color: "var(--cya-text-muted)" }}>
            {labelDesbloquear}
          </Typography>
        }
      />
    </Box>
  );
}
