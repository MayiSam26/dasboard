import {
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import React from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import baseurl from "../../Config/axios";

const POLL_MS = 60000;

interface NotifItem {
  key: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  path: string;
  date: string | null;
  overdue?: boolean;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [items, setItems] = React.useState<NotifItem[]>([]);

  const cargarNotificaciones = React.useCallback(async () => {
    const rol = localStorage.getItem("rol");
    const nextItems: NotifItem[] = [];

    try {
      const { data } = await axios.post(baseurl + "adopciones/list", {
        fechaBusqueda: null,
        state: "proceso",
      });
      (data?.data || []).forEach((row: any) => {
        nextItems.push({
          key: "adopcion-" + row.idadopcion,
          icon: <HowToRegIcon fontSize="small" sx={{ color: "var(--cya-primary)" }} />,
          title: "Solicitud de adopción pendiente",
          subtitle: `${row.adoptante?.Nombre || ""} ${row.adoptante?.Apellido || ""} — ${
            row.animales?.nombre || "colita"
          }`,
          path: "/panel/adopcion",
          date: row.Fecha_Adopcion || row.fecharegistro || null,
        });
      });
    } catch {
      // silencioso: si falla, simplemente no aporta notificaciones esta ronda
    }

    try {
      const { data } = await axios.post(baseurl + "entrevistas/list", {});
      (data?.data || [])
        .filter((row: any) => row.Estado !== "realizada")
        .forEach((row: any) => {
          nextItems.push({
            key: "entrevista-" + row.identrevista,
            icon: <FactCheckIcon fontSize="small" sx={{ color: "#3f9e5c" }} />,
            title: "Entrevista pendiente",
            subtitle: `${row.adoptante?.Nombre || ""} ${row.adoptante?.Apellido || ""} — ${
              row.animal?.nombre || "colita"
            }`,
            path: "/panel/entrevistas",
            date: row.Fecha_Entrevista || null,
          });
        });
    } catch {
      // idem
    }

    try {
      const { data } = await axios.post(baseurl + "seguimientos/list", {});
      (data?.data || [])
        .filter((row: any) => row.Estado !== "realizado")
        .forEach((row: any) => {
          nextItems.push({
            key: "seguimiento-" + row.idseguimiento,
            icon: <AssignmentTurnedInIcon fontSize="small" sx={{ color: "#e4602f" }} />,
            title: "Seguimiento postadopción pendiente",
            subtitle: `${row.adoptante?.Nombre || ""} ${row.adoptante?.Apellido || ""} — ${
              row.animal?.nombre || "colita"
            }`,
            path: "/panel/seguimiento",
            date: row.Fecha_Programada || null,
          });
        });
    } catch {
      // idem
    }

    if (rol === "Administrador" || rol === "Veterinario") {
      try {
        const { data } = await axios.post(baseurl + "veterinaria/list", {});
        (data?.data || [])
          .filter(
            (row: any) =>
              row.proxima_fecha && moment(row.proxima_fecha).isSameOrBefore(moment().add(7, "days"), "day")
          )
          .forEach((row: any) => {
            const vencido = moment(row.proxima_fecha).isBefore(moment(), "day");
            nextItems.push({
              key: "veterinaria-" + row.idveterinaria,
              icon: <MedicalServicesIcon fontSize="small" sx={{ color: "#c0392b" }} />,
              title: vencido ? "Control veterinario vencido" : "Control veterinario próximo",
              subtitle: `${row.animal?.nombre || "colita"} — ${row.tipo || ""}`,
              path: "/panel/veterinaria",
              date: row.proxima_fecha,
              overdue: vencido,
            });
          });
      } catch {
        // idem
      }
    }

    nextItems.sort((a, b) => {
      if (a.overdue && !b.overdue) return -1;
      if (!a.overdue && b.overdue) return 1;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return moment(a.date).valueOf() - moment(b.date).valueOf();
    });

    setItems(nextItems);
  }, []);

  React.useEffect(() => {
    cargarNotificaciones();
    const timer = setInterval(cargarNotificaciones, POLL_MS);
    return () => clearInterval(timer);
  }, [cargarNotificaciones]);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "var(--cya-topbar-icon, #6c757d)" }}>
        <Badge badgeContent={items.length} color="error" max={9}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ width: 340, maxHeight: 420, overflowY: "auto" }}>
          <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid var(--cya-border)" }}>
            <Typography sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>Notificaciones</Typography>
            <Typography variant="caption" sx={{ color: "var(--cya-text-muted)" }}>
              {items.length === 0 ? "Todo al día" : `${items.length} pendiente(s)`}
            </Typography>
          </Box>
          {items.length === 0 ? (
            <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "var(--cya-text-muted)" }}>
                No hay nada pendiente por ahora.
              </Typography>
            </Box>
          ) : (
            items.map((item, i) => (
              <React.Fragment key={item.key}>
                <ListItemButton
                  onClick={() => {
                    setAnchorEl(null);
                    navigate(item.path);
                  }}
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.2, py: 1.2, px: 2 }}
                >
                  <Box sx={{ mt: 0.3 }}>{item.icon}</Box>
                  <ListItemText
                    primary={item.title}
                    secondary={
                      <>
                        {item.subtitle}
                        {item.date && (
                          <>
                            <br />
                            <span style={{ color: item.overdue ? "#c0392b" : undefined }}>
                              {moment(item.date).format("DD-MM-YYYY")}
                              {item.overdue ? " (vencido)" : ""}
                            </span>
                          </>
                        )}
                      </>
                    }
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 700, color: "var(--cya-dark)" }}
                    secondaryTypographyProps={{ fontSize: 12.5 }}
                  />
                </ListItemButton>
                {i < items.length - 1 && <Divider component="li" sx={{ listStyle: "none" }} />}
              </React.Fragment>
            ))
          )}
        </Box>
      </Popover>
    </>
  );
}
