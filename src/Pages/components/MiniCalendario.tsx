import React from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EventIcon from "@mui/icons-material/Event";
import moment from "moment";

export interface EventoCalendario {
  fecha: string; // YYYY-MM-DD
  titulo: string;
}

interface Props {
  titulo?: string;
  eventos: EventoCalendario[];
}

export default function MiniCalendario({ titulo = "Mi Calendario", eventos }: Props) {
  const [mes, setMes] = React.useState(() => moment().startOf("month"));

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

  const eventosDelMes = React.useMemo(
    () =>
      Object.values(eventosPorDia)
        .flat()
        .sort((a, b) => moment(a.fecha).valueOf() - moment(b.fecha).valueOf()),
    [eventosPorDia]
  );

  const diasEnMes = mes.daysInMonth();
  const primerDiaSemana = (mes.day() - moment.localeData().firstDayOfWeek() + 7) % 7;
  const nombresDias = moment.weekdaysMin(true);
  const hoy = moment();

  const celdas: (number | null)[] = [
    ...Array(primerDiaSemana).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];

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
          const tieneEvento = !!eventosPorDia[dia];
          return (
            <Box
              key={dia}
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
              }}
            >
              {dia}
              {tieneEvento && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 3,
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    backgroundColor: esHoy ? "#fff" : "var(--cya-secondary)",
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      <Typography variant="body2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
        Citas de este mes
      </Typography>
      {eventosDelMes.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No tienes citas programadas este mes.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
          {eventosDelMes.map((e, idx) => (
            <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--cya-primary)", minWidth: 70 }}>
                {moment(e.fecha).format("DD MMM")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {e.titulo}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
