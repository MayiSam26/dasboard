import React from "react";
import { Box, Chip, Paper, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import moment from "moment";
import { EventoCalendario } from "./MiniCalendario";

interface Props {
  titulo?: string;
  eventos: EventoCalendario[];
  limite?: number;
}

// Panel de solo lectura: lista las próximas citas/visitas (hoy en adelante,
// sin contar lo ya marcado como Realizado) como recordatorio rápido junto
// al calendario, sin necesidad de entrar a un día en particular.
export default function ProximasCitas({ titulo = "Próximas Citas", eventos, limite = 6 }: Props) {
  const proximas = React.useMemo(
    () =>
      eventos
        .filter((e) => e.fecha && moment(e.fecha).isSameOrAfter(moment(), "day") && e.estado !== "Realizado")
        .sort((a, b) => moment(a.fecha).valueOf() - moment(b.fecha).valueOf())
        .slice(0, limite),
    [eventos, limite]
  );

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #ECE4DA", height: "100%" }}>
      <Typography sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 0.8, mb: 1.5 }}>
        <EventAvailableIcon fontSize="small" sx={{ color: "var(--cya-secondary)" }} />
        {titulo}
      </Typography>
      {proximas.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No tienes citas pendientes por ahora.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {proximas.map((e, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.2,
                borderRadius: "10px",
                border: "1px solid var(--cya-border)",
                borderLeft: `4px solid ${e.color || "var(--cya-primary)"}`,
                backgroundColor: "var(--cya-bg-alt)",
              }}
            >
              <Box
                sx={{
                  minWidth: 46,
                  textAlign: "center",
                  borderRadius: "8px",
                  py: 0.5,
                  backgroundColor: e.color || "var(--cya-primary)",
                  color: "#fff",
                }}
              >
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, lineHeight: 1, textTransform: "uppercase" }}>
                  {moment(e.fecha).format("MMM")}
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 800, lineHeight: 1.1 }}>
                  {moment(e.fecha).format("DD")}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {e.titulo}
                </Typography>
                {e.estado && (
                  <Chip
                    label={e.estado}
                    size="small"
                    color={e.estado === "Pendiente" ? "warning" : "default"}
                    sx={{ mt: 0.3, height: 18, fontSize: "0.65rem" }}
                  />
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
