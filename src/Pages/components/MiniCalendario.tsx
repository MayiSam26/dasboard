import React from "react";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EventIcon from "@mui/icons-material/Event";
import CloseIcon from "@mui/icons-material/Close";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import moment from "moment";

export interface EventoCalendario {
  fecha: string; // YYYY-MM-DD
  titulo: string;
  // Texto adicional mostrado solo dentro del modal de detalle (opcional).
  detalle?: string;
  // "Pendiente" | "Realizado" u otro valor libre — se muestra como Chip si viene.
  estado?: string;
  // Color para distinguir tipos de evento (ej. atención vs. seguimiento).
  // Si no viene, se usa el color primario del tema.
  color?: string;
}

interface Props {
  titulo?: string;
  eventos: EventoCalendario[];
}

export default function MiniCalendario({ titulo = "Mi Calendario", eventos }: Props) {
  const [mes, setMes] = React.useState(() => moment().startOf("month"));
  const [diaSeleccionado, setDiaSeleccionado] = React.useState<number | null>(null);

  const eventosPorDia = React.useMemo(() => {
    const map: Record<string, EventoCalendario[]> = {};
    eventos.forEach((e) => {
      if (!e.fecha || !moment(e.fecha).isSame(mes, "month")) return;
      const dia = moment(e.fecha).date();
      if (!map[dia]) map[dia] = [];
      map[dia].push(e);
    });
    return map;
  }, [eventos, mes]);

  const diasEnMes = mes.daysInMonth();
  const primerDiaSemana = (mes.day() - moment.localeData().firstDayOfWeek() + 7) % 7;
  const nombresDias = moment.weekdaysMin(true);
  const hoy = moment();

  const celdas: (number | null)[] = [
    ...Array(primerDiaSemana).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];

  const eventosDelDiaSeleccionado = diaSeleccionado ? eventosPorDia[diaSeleccionado] || [] : [];
  const fechaDialogo = diaSeleccionado ? mes.clone().date(diaSeleccionado) : null;

  const estadoColor = (estado?: string) => {
    if (estado === "Realizado") return "success";
    if (estado === "Pendiente") return "warning";
    return "default";
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #ECE4DA", height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 0.8 }}>
          <EventIcon fontSize="small" sx={{ color: "var(--cya-primary)" }} />
          {titulo}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton size="small" onClick={() => setMes((m) => m.clone().subtract(1, "month"))}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 110, textAlign: "center", textTransform: "capitalize" }}>
            {mes.format("MMMM YYYY")}
          </Typography>
          <IconButton size="small" onClick={() => setMes((m) => m.clone().add(1, "month"))}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5, mb: 1 }}>
        {nombresDias.map((d) => (
          <Typography
            key={d}
            variant="caption"
            sx={{ textAlign: "center", color: "var(--cya-text-muted)", fontWeight: 700, textTransform: "uppercase" }}
          >
            {d}
          </Typography>
        ))}
        {celdas.map((dia, idx) => {
          if (dia === null) return <Box key={`vacio-${idx}`} />;
          const esHoy = hoy.isSame(mes.clone().date(dia), "day");
          const eventosDia = eventosPorDia[dia];
          const tieneEvento = !!eventosDia;
          const colorEvento = eventosDia?.[0]?.color || "var(--cya-secondary)";
          return (
            <Box
              key={dia}
              onClick={() => setDiaSeleccionado(dia)}
              sx={{
                position: "relative",
                aspectRatio: "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                fontSize: "0.8rem",
                fontWeight: esHoy ? 800 : 500,
                color: esHoy ? "#fff" : "text.primary",
                backgroundColor: esHoy ? "var(--cya-primary)" : "transparent",
                cursor: "pointer",
                transition: "background-color .15s ease",
                "&:hover": {
                  backgroundColor: esHoy ? "var(--cya-primary)" : "var(--cya-bg-alt)",
                },
              }}
            >
              {dia}
              {tieneEvento && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 3,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: esHoy ? "#fff" : colorEvento,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      <Dialog open={diaSeleccionado !== null} onClose={() => setDiaSeleccionado(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", textTransform: "capitalize" }}>
          {fechaDialogo ? fechaDialogo.format("dddd D [de] MMMM") : ""}
          <IconButton onClick={() => setDiaSeleccionado(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {eventosDelDiaSeleccionado.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 3, color: "text.secondary" }}>
              <EventBusyIcon />
              <Typography color="text.secondary">No tienes citas programadas este día.</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {eventosDelDiaSeleccionado.map((e, idx) => (
                <React.Fragment key={idx}>
                  <ListItem disablePadding sx={{ py: 1.2 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 9,
                              height: 9,
                              borderRadius: "50%",
                              backgroundColor: e.color || "var(--cya-secondary)",
                              flexShrink: 0,
                            }}
                          />
                          <strong style={{ color: "var(--cya-primary)" }}>{e.titulo}</strong>
                          {e.estado && <Chip label={e.estado} size="small" color={estadoColor(e.estado) as any} />}
                        </Box>
                      }
                      secondary={e.detalle || "Sin detalles adicionales."}
                    />
                  </ListItem>
                  {idx < eventosDelDiaSeleccionado.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
