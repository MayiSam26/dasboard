import React, { useEffect } from "react";
import Header from "../components/Header";
import Body from "../components/Layout/Body";
import Content from "../components/Layout/Content";
import Layout from "../components/Layout/Index";
import Navar from "../components/Navar";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import PetsIcon from "@mui/icons-material/Pets";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CloseIcon from "@mui/icons-material/Close";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AssignmentIcon from "@mui/icons-material/Assignment";
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import baseurl from "../../Config/axios";

moment.locale("es");

function cssVar(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

// Primario/secundario siguen la paleta elegida en "Mi cuenta"; acento y
// neutro se mantienen fijos (uso semántico: pendiente/otro).
const CYA_PRIMARY = cssVar("--cya-primary", "#E4602F");
const CYA_SECONDARY = cssVar("--cya-secondary", "#3F9E5C");
const CYA_ACCENT = "#F4A731";
const CYA_MUTED = "#B7C2C9";
const CYA_ERROR = "#C0392B";

function lastNMonths(n: number) {
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    months.push(moment().subtract(i, "months"));
  }
  return months;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  onClick?: () => void;
}

function StatCard({ icon, label, value, color, onClick }: StatCardProps) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2.5,
        borderRadius: "16px",
        border: "1px solid #ECE4DA",
        display: "flex",
        alignItems: "center",
        gap: 2,
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        transition: "transform .15s ease, box-shadow .15s ease",
        "&:hover": onClick
          ? { transform: "translateY(-2px)", boxShadow: "0 10px 24px rgba(36,40,44,.10)" }
          : undefined,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          minWidth: 52,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${color}1F`,
          color: color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function HomePanel() {
  const [user, userName] = React.useState<any>("");
  const navigate = useNavigate();

  // El Veterinario no tiene acceso a Adopción/Usuarios/Donaciones (ver
  // Permisos de Roles), así que su resumen no debe pedir ni mostrar esos
  // datos — antes se veían en 0 porque esas llamadas fallaban en silencio.
  const rol = localStorage.getItem("rol");
  const esVeterinario = rol === "Veterinario";

  const [totalMascotas, setTotalMascotas] = React.useState(0);
  const [totalAdoptadas, setTotalAdoptadas] = React.useState(0);
  const [totalUsuarios, setTotalUsuarios] = React.useState(0);
  const [solicitudesPendientes, setSolicitudesPendientes] = React.useState<any[]>([]);
  const [openSolicitudes, setOpenSolicitudes] = React.useState(false);

  const [mesesLabels, setMesesLabels] = React.useState<string[]>([]);
  const [adopcionesPorMes, setAdopcionesPorMes] = React.useState<number[]>([]);
  const [donacionesPorMes, setDonacionesPorMes] = React.useState<number[]>([]);

  const [estadoMascotas, setEstadoMascotas] = React.useState<{ label: string; value: number; color: string }[]>([]);
  const [tipoMascotas, setTipoMascotas] = React.useState<{ label: string; value: number; color: string }[]>([]);

  // Solo para el rol Veterinario
  const [totalControles, setTotalControles] = React.useState(0);
  const [controlesPendientes, setControlesPendientes] = React.useState<any[]>([]);
  const [controlesVencidos, setControlesVencidos] = React.useState<any[]>([]);
  const [openControles, setOpenControles] = React.useState(false);
  const [controlesPorMes, setControlesPorMes] = React.useState<number[]>([]);

  useEffect(() => {
    userName(localStorage.getItem("user"));
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const meses = lastNMonths(6);
    setMesesLabels(meses.map((m) => m.format("MMM YY")));

    // Colitas: total, estado, tipo
    axios
      .post(baseurl + "colitas/list", {})
      .then((res) => {
        const data = res.data.data || [];
        setTotalMascotas(data.length);

        const estados: Record<string, number> = {};
        const tipos: Record<string, number> = {};
        data.forEach((item: any) => {
          const estadoKey = item.estado || "Sin estado";
          estados[estadoKey] = (estados[estadoKey] || 0) + 1;
          const tipoKey = item.tipo_descripcion?.descripcion || "Otro";
          tipos[tipoKey] = (tipos[tipoKey] || 0) + 1;
        });

        const estadoColors: Record<string, string> = {
          "En refugio": CYA_SECONDARY,
          proceso: CYA_ACCENT,
          adoptado: CYA_PRIMARY,
        };
        setEstadoMascotas(
          Object.entries(estados).map(([label, value]) => ({
            label,
            value,
            color: estadoColors[label] || CYA_MUTED,
          }))
        );

        const tipoColors = [CYA_PRIMARY, CYA_SECONDARY, CYA_ACCENT, CYA_MUTED];
        setTipoMascotas(
          Object.entries(tipos).map(([label, value], idx) => ({
            label,
            value,
            color: tipoColors[idx % tipoColors.length],
          }))
        );
      })
      .catch((e) => console.log(e.message));

    if (esVeterinario) {
      // Controles veterinarios: total, pendientes (próximos 7 días), vencidos, por mes
      axios
        .post(baseurl + "veterinaria/list", {})
        .then((res) => {
          const data = res.data.data || [];
          setTotalControles(data.length);
          setControlesPendientes(
            data.filter(
              (r: any) =>
                r.proxima_fecha &&
                r.Estado !== "Realizado" &&
                moment(r.proxima_fecha).isSameOrAfter(moment(), "day") &&
                moment(r.proxima_fecha).isSameOrBefore(moment().add(7, "days"), "day")
            )
          );
          setControlesVencidos(
            data.filter(
              (r: any) => r.proxima_fecha && r.Estado !== "Realizado" && moment(r.proxima_fecha).isBefore(moment(), "day")
            )
          );

          const counts = meses.map((m) => data.filter((r: any) => r.fecha && moment(r.fecha).isSame(m, "month")).length);
          setControlesPorMes(counts);
        })
        .catch((e) => console.log(e.message));
      return;
    }

    // Adopciones: adoptadas + por mes + solicitudes pendientes (Estado: proceso)
    axios
      .post(baseurl + "adopciones/list", {})
      .then((res) => {
        const data = res.data.data || [];
        setTotalAdoptadas(data.filter((a: any) => a.Estado === "adoptado").length);
        setSolicitudesPendientes(data.filter((a: any) => a.Estado === "proceso"));

        const counts = meses.map((m) =>
          data.filter((a: any) => a.Fecha_Adopcion && moment(a.Fecha_Adopcion).isSame(m, "month")).length
        );
        setAdopcionesPorMes(counts);
      })
      .catch((e) => console.log(e.message));

    // Usuarios: total
    axios
      .get(baseurl + "usuario/list")
      .then((res) => {
        const data = res.data.data || [];
        setTotalUsuarios(data.length);
      })
      .catch((e) => console.log(e.message));

    // Ingresos: por mes
    axios
      .get(baseurl + "ingresos/list")
      .then((res) => {
        const data = res.data.data || [];

        const sums = meses.map((m) =>
          data
            .filter((i: any) => i.fecha_registro && moment(i.fecha_registro).isSame(m, "month"))
            .reduce((sum: number, i: any) => sum + Number(i.monto || 0), 0)
        );
        setDonacionesPorMes(sums);
      })
      .catch((e) => console.log(e.message));
  }, [esVeterinario]);

  return (
    <>
      <Layout>
        <Navar />
        <Content>
          <Header />
          <Body>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Hola, <span style={{ color: CYA_SECONDARY }}>{user}</span> 👋
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Este es el resumen de Colitas &amp; Amor.
            </Typography>

            {esVeterinario ? (
              <>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<PetsIcon />}
                      label="Total de Colitas Registradas"
                      value={totalMascotas}
                      color={CYA_SECONDARY}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<AssignmentIcon />}
                      label="Controles Pendientes (7 días)"
                      value={controlesPendientes.length}
                      color={CYA_ACCENT}
                      onClick={() => setOpenControles(true)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<EventBusyIcon />}
                      label="Controles Vencidos"
                      value={controlesVencidos.length}
                      color={CYA_ERROR}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<MedicalServicesIcon />}
                      label="Total de Controles Registrados"
                      value={totalControles}
                      color={CYA_SECONDARY}
                    />
                  </Grid>
                </Grid>

                <Dialog open={openControles} onClose={() => setOpenControles(false)} maxWidth="sm" fullWidth>
                  <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    Controles veterinarios pendientes
                    <IconButton onClick={() => setOpenControles(false)}>
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent dividers>
                    {controlesPendientes.length === 0 && (
                      <Typography color="text.secondary">No hay controles pendientes por revisar.</Typography>
                    )}
                    <List disablePadding>
                      {controlesPendientes.map((c: any, idx: number) => (
                        <React.Fragment key={c.idveterinaria}>
                          <ListItem disablePadding sx={{ py: 1.2 }}>
                            <ListItemText
                              primary={
                                <>
                                  <strong style={{ color: CYA_PRIMARY }}>{c.animal?.nombre || "Colita"}</strong> — {c.tipo}
                                </>
                              }
                              secondary={`Próximo control: ${moment(c.proxima_fecha).format("LL")}`}
                            />
                          </ListItem>
                          {idx < controlesPendientes.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  </DialogContent>
                </Dialog>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #ECE4DA", height: "100%" }}>
                      <Typography sx={{ fontWeight: 700, mb: 1 }}>Controles veterinarios por mes</Typography>
                      {mesesLabels.length > 0 && (
                        <BarChart
                          xAxis={[{ scaleType: "band", data: mesesLabels }]}
                          yAxis={[{ tickMinStep: 1, valueFormatter: (v: number) => `${v}` }]}
                          series={[{ data: controlesPorMes, color: CYA_SECONDARY, label: "Controles" }]}
                          height={280}
                          grid={{ horizontal: true }}
                        />
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #ECE4DA", height: "100%" }}>
                      <Typography sx={{ fontWeight: 700, mb: 1 }}>Estado de las mascotas</Typography>
                      {estadoMascotas.length > 0 && (
                        <PieChart
                          series={[
                            {
                              data: estadoMascotas,
                              innerRadius: 45,
                              outerRadius: 90,
                              paddingAngle: 2,
                              cornerRadius: 3,
                            },
                          ]}
                          height={350}
                          slotProps={{
                            legend: { direction: "row", position: { vertical: "bottom", horizontal: "middle" } },
                          }}
                        />
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<PetsIcon />}
                      label="Total de Colitas Registradas"
                      value={totalMascotas}
                      color={CYA_SECONDARY}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<FavoriteIcon />}
                      label="Colitas Adoptadas"
                      value={totalAdoptadas}
                      color={CYA_PRIMARY}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<HourglassTopIcon />}
                      label="Solicitudes Pendientes de Adopción"
                      value={solicitudesPendientes.length}
                      color={CYA_ACCENT}
                      onClick={() => setOpenSolicitudes(true)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<PeopleAltIcon />}
                      label="Total de Usuarios Registrados"
                      value={totalUsuarios}
                      color={CYA_SECONDARY}
                    />
                  </Grid>
                </Grid>

                <Dialog open={openSolicitudes} onClose={() => setOpenSolicitudes(false)} maxWidth="sm" fullWidth>
                  <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    Solicitudes pendientes de adopción
                    <IconButton onClick={() => setOpenSolicitudes(false)}>
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent dividers>
                    {solicitudesPendientes.length === 0 && (
                      <Typography color="text.secondary">No hay solicitudes pendientes por revisar.</Typography>
                    )}
                    <List disablePadding>
                      {solicitudesPendientes.map((s: any, idx: number) => (
                        <React.Fragment key={s.idadopcion}>
                          <ListItem disablePadding sx={{ py: 1.2 }}>
                            <ListItemText
                              primary={
                                <>
                                  <strong>{s.adoptante?.Nombre} {s.adoptante?.Apellido}</strong> quiere adoptar a{" "}
                                  <strong style={{ color: CYA_PRIMARY }}>{s.animales?.nombre}</strong>
                                </>
                              }
                              secondary={
                                <>
                                  DNI: {s.adoptante?.Dni} · Tel: {s.adoptante?.telefono}
                                  <br />
                                  Motivo: {s.Observaciones}
                                  <br />
                                  Solicitado: {moment(s.fecharegistro).format("LL")}
                                </>
                              }
                            />
                          </ListItem>
                          {idx < solicitudesPendientes.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  </DialogContent>
                </Dialog>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #ECE4DA", height: "100%" }}>
                      <Typography sx={{ fontWeight: 700, mb: 1 }}>Adopciones por mes</Typography>
                      {mesesLabels.length > 0 && (
                        <BarChart
                          xAxis={[{ scaleType: "band", data: mesesLabels }]}
                          yAxis={[{ tickMinStep: 1, valueFormatter: (v: number) => `${v}` }]}
                          series={[{ data: adopcionesPorMes, color: CYA_PRIMARY, label: "Adopciones" }]}
                          height={280}
                          grid={{ horizontal: true }}
                        />
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #ECE4DA", height: "100%" }}>
                      <Typography sx={{ fontWeight: 700, mb: 1 }}>Estado de las mascotas</Typography>
                      {estadoMascotas.length > 0 && (
                        <PieChart
                          series={[
                            {
                              data: estadoMascotas,
                              innerRadius: 45,
                              outerRadius: 90,
                              paddingAngle: 2,
                              cornerRadius: 3,
                            },
                          ]}
                          height={350}
                          slotProps={{
                            legend: { direction: "row", position: { vertical: "bottom", horizontal: "middle" } },
                          }}
                        />
                      )}
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #ECE4DA", height: "100%" }}>
                      <Typography sx={{ fontWeight: 700, mb: 1 }}>Donaciones por mes (S/.)</Typography>
                      {mesesLabels.length > 0 && (
                        <BarChart
                          xAxis={[{ scaleType: "band", data: mesesLabels }]}
                          yAxis={[{ valueFormatter: (v: number) => `S/. ${v.toFixed(0)}` }]}
                          series={[
                            {
                              data: donacionesPorMes,
                              color: CYA_SECONDARY,
                              label: "Recaudado",
                              valueFormatter: (v: number | null) => `S/. ${(v ?? 0).toFixed(2)}`,
                            },
                          ]}
                          height={280}
                          grid={{ horizontal: true }}
                        />
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #ECE4DA", height: "100%" }}>
                      <Typography sx={{ fontWeight: 700, mb: 1 }}>Perros vs. gatos</Typography>
                      {tipoMascotas.length > 0 && (
                        <PieChart
                          series={[
                            {
                              data: tipoMascotas,
                              innerRadius: 45,
                              outerRadius: 90,
                              paddingAngle: 2,
                              cornerRadius: 3,
                            },
                          ]}
                          height={350}
                          slotProps={{
                            legend: { direction: "row", position: { vertical: "bottom", horizontal: "middle" } },
                          }}
                        />
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </>
            )}
          </Body>
        </Content>
      </Layout>
    </>
  );
}
