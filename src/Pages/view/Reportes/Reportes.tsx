import React, { useEffect } from "react";
import Header from "../../components/Header";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import PetsIcon from "@mui/icons-material/Pets";
import HomeIcon from "@mui/icons-material/Home";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupIcon from "@mui/icons-material/Group";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DescriptionIcon from "@mui/icons-material/Description";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import baseurl from "../../../Config/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

moment.locale("es");

function cssVar(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

const CYA_PRIMARY = cssVar("--cya-primary", "#E4602F");
const CYA_SECONDARY = cssVar("--cya-secondary", "#3F9E5C");
const CYA_ACCENT = "#F4A731";
const CYA_ERROR = "#C0392B";
const CYA_MUTED = "#B7C2C9";

function lastNMonths(n: number) {
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    months.push(moment().subtract(i, "months"));
  }
  return months;
}

function loadImageAsDataUrl(url: string): Promise<string> {
  return fetch(url)
    .then((r) => r.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}
function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: "16px",
        border: "1px solid var(--cya-border)",
        display: "flex",
        alignItems: "center",
        gap: 2,
        height: "100%",
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
          color,
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

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, mt: 4 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(228, 96, 47, 0.12)",
          color: "var(--cya-primary)",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)", lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--cya-text-muted)" }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

const ROL_COLORS: Record<string, string> = {
  Administrador: CYA_PRIMARY,
  Voluntario: CYA_SECONDARY,
  Veterinario: CYA_ACCENT,
};

export default function Reportes() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    const rol = localStorage.getItem("rol");
    if (!rol || rol === "Administrador") return;
    axios
      .get(baseurl + "permisos/mios")
      .then((response) => {
        const secciones: string[] = response.data.data || [];
        if (!secciones.includes("reportes")) navigate("/panel");
      })
      .catch(() => {}); // fail-open: si falla la consulta no bloqueamos el acceso
  }, [navigate]);

  // Animales
  const [totalAnimales, setTotalAnimales] = React.useState(0);
  const [enRefugio, setEnRefugio] = React.useState(0);
  const [enProcesoAnimal, setEnProcesoAnimal] = React.useState(0);
  const [adoptadosAnimal, setAdoptadosAnimal] = React.useState(0);
  const [tipoMascotas, setTipoMascotas] = React.useState<{ label: string; value: number; color: string }[]>([]);

  // Usuarios
  const [totalUsuarios, setTotalUsuarios] = React.useState(0);
  const [usuariosActivos, setUsuariosActivos] = React.useState(0);
  const [usuariosInactivos, setUsuariosInactivos] = React.useState(0);
  const [usuariosPorRol, setUsuariosPorRol] = React.useState<{ label: string; value: number; color: string }[]>([]);

  // Solicitudes / Adopciones
  const [totalSolicitudes, setTotalSolicitudes] = React.useState(0);
  const [solicitudesProceso, setSolicitudesProceso] = React.useState(0);
  const [solicitudesRechazadas, setSolicitudesRechazadas] = React.useState(0);
  const [totalAdoptadas, setTotalAdoptadas] = React.useState(0);
  const [mesesLabels, setMesesLabels] = React.useState<string[]>([]);
  const [adopcionesPorMes, setAdopcionesPorMes] = React.useState<number[]>([]);

  // Seguimientos
  const [totalSeguimientos, setTotalSeguimientos] = React.useState(0);
  const [seguimientosPendientes, setSeguimientosPendientes] = React.useState(0);
  const [seguimientosRealizados, setSeguimientosRealizados] = React.useState(0);

  const [cargado, setCargado] = React.useState(false);

  useEffect(() => {
    const meses = lastNMonths(6);
    setMesesLabels(meses.map((m) => m.format("MMM YY")));

    const pAnimales = axios
      .post(baseurl + "colitas/list", {})
      .then((res) => {
        const data = res.data.data || [];
        setTotalAnimales(data.length);
        setEnRefugio(data.filter((a: any) => a.estado === "En refugio").length);
        setEnProcesoAnimal(data.filter((a: any) => a.estado === "proceso").length);
        setAdoptadosAnimal(data.filter((a: any) => a.estado === "adoptado").length);

        const tipos: Record<string, number> = {};
        data.forEach((item: any) => {
          const tipoKey = item.tipo_descripcion?.descripcion || "Otro";
          tipos[tipoKey] = (tipos[tipoKey] || 0) + 1;
        });
        const tipoColors = [CYA_PRIMARY, CYA_SECONDARY, CYA_ACCENT, CYA_MUTED];
        setTipoMascotas(
          Object.entries(tipos).map(([label, value], idx) => ({
            label,
            value,
            color: tipoColors[idx % tipoColors.length],
          }))
        );
      })
      .catch(() => {});

    const pUsuarios = axios
      .get(baseurl + "usuario/list")
      .then((res) => {
        const data = res.data.data || [];
        setTotalUsuarios(data.length);
        setUsuariosActivos(data.filter((u: any) => u.activo).length);
        setUsuariosInactivos(data.filter((u: any) => !u.activo).length);

        const roles: Record<string, number> = {};
        data.forEach((u: any) => {
          roles[u.rol] = (roles[u.rol] || 0) + 1;
        });
        setUsuariosPorRol(
          Object.entries(roles).map(([label, value]) => ({
            label,
            value,
            color: ROL_COLORS[label] || CYA_MUTED,
          }))
        );
      })
      .catch(() => {});

    const pAdopciones = axios
      .post(baseurl + "adopciones/list", {})
      .then((res) => {
        const data = res.data.data || [];
        setTotalSolicitudes(data.length);
        setSolicitudesProceso(data.filter((a: any) => a.Estado === "proceso").length);
        setSolicitudesRechazadas(data.filter((a: any) => a.Estado === "rechazado").length);
        const adoptadas = data.filter((a: any) => a.Estado === "adoptado");
        setTotalAdoptadas(adoptadas.length);

        const counts = meses.map(
          (m) => adoptadas.filter((a: any) => a.Fecha_Adopcion && moment(a.Fecha_Adopcion).isSame(m, "month")).length
        );
        setAdopcionesPorMes(counts);
      })
      .catch(() => {});

    const pSeguimientos = axios
      .post(baseurl + "seguimientos/reporte", {})
      .then((res) => {
        const item = (res.data.data || [])[0] || {};
        setTotalSeguimientos(item.total || 0);
        setSeguimientosPendientes(item.pendiente || 0);
        setSeguimientosRealizados(item.realizado || 0);
      })
      .catch(() => {});

    Promise.all([pAnimales, pUsuarios, pAdopciones, pSeguimientos]).then(() => setCargado(true));
  }, []);

  const exportarPDF = async () => {
    const doc = new jsPDF({ orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const usuario = localStorage.getItem("user") || "—";

    doc.setFillColor(251, 247, 242);
    doc.rect(0, 0, pageWidth, 24, "F");
    doc.setDrawColor(228, 96, 47);
    doc.setLineWidth(0.7);
    doc.line(0, 24, pageWidth, 24);

    try {
      const logoDataUrl = await loadImageAsDataUrl(`${window.location.origin}/images/logocito.png`);
      doc.addImage(logoDataUrl, "PNG", 10, 4, 16, 16);
    } catch {
      // Si el logo no carga, seguimos con el resto del reporte igual.
    }

    doc.setTextColor(228, 96, 47);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Refugio Colitas y Amor", 30, 12);
    doc.setTextColor(90, 90, 90);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Reporte General Consolidado", 30, 19);

    doc.setTextColor(110, 110, 110);
    doc.setFontSize(9);
    doc.text(`Generado: ${moment().format("DD-MM-YYYY HH:mm")}   ·   Exportado por: ${usuario}`, 10, 31);

    const filas: any[] = [
      ["Animales", "Total registrados", totalAnimales],
      ["Animales", "En refugio", enRefugio],
      ["Animales", "En proceso de adopción", enProcesoAnimal],
      ["Animales", "Adoptados", adoptadosAnimal],
      ...tipoMascotas.map((t) => ["Animales", `Tipo: ${t.label}`, t.value]),
      ["Usuarios", "Total registrados", totalUsuarios],
      ["Usuarios", "Activos", usuariosActivos],
      ["Usuarios", "Inactivos", usuariosInactivos],
      ...usuariosPorRol.map((r) => ["Usuarios", `Rol: ${r.label}`, r.value]),
      ["Solicitudes de adopción", "Total", totalSolicitudes],
      ["Solicitudes de adopción", "En proceso", solicitudesProceso],
      ["Solicitudes de adopción", "Rechazadas", solicitudesRechazadas],
      ["Adopciones", "Total adoptadas", totalAdoptadas],
      ["Seguimientos", "Total", totalSeguimientos],
      ["Seguimientos", "Pendientes", seguimientosPendientes],
      ["Seguimientos", "Realizados", seguimientosRealizados],
    ];

    autoTable(doc, {
      startY: 36,
      head: [["Sección", "Métrica", "Valor"]],
      body: filas,
      styles: { fontSize: 9, cellPadding: 3, textColor: [60, 60, 60] },
      headStyles: { fillColor: [228, 96, 47], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [251, 247, 242] },
      columnStyles: { 2: { halign: "right" } },
    });

    const pageCount = doc.getNumberOfPages();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - 30, pageHeight - 8);
      doc.text("Refugio Colitas y Amor", 10, pageHeight - 8);
    }

    doc.save(`reporte_general_${moment().format("YYYYMMDD_HHmm")}.pdf`);
  };

  return (
    <>
      <Layout>
        <Navar />
        <Content>
          <Header />
          <Body>
            <Grid container spacing={2} sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Grid item xs={12} md="auto">
                <Typography variant="h4">Reportes Generales</Typography>
                <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mt: 0.3 }}>
                  Información consolidada de animales, usuarios, solicitudes, adopciones y seguimientos.
                </Typography>
              </Grid>
              <Grid item xs={12} md="auto">
                <Button
                  variant="outlined"
                  className="cya-btn-export"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={exportarPDF}
                  disabled={!cargado}
                >
                  Exportar PDF
                </Button>
              </Grid>
            </Grid>

            {/* Animales */}
            <SectionHeader
              icon={<PetsIcon fontSize="small" />}
              title="Animales"
              subtitle="Mascotas registradas en el refugio"
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={<PetsIcon />} label="Total registrados" value={totalAnimales} color={CYA_SECONDARY} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={<HomeIcon />} label="En refugio" value={enRefugio} color={CYA_SECONDARY} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={<HourglassTopIcon />} label="En proceso" value={enProcesoAnimal} color={CYA_ACCENT} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={<FavoriteIcon />} label="Adoptados" value={adoptadosAnimal} color={CYA_PRIMARY} />
              </Grid>
            </Grid>
            {tipoMascotas.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid var(--cya-border)" }}>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>Perros vs. gatos</Typography>
                    <PieChart
                      series={[{ data: tipoMascotas, innerRadius: 45, outerRadius: 90, paddingAngle: 2, cornerRadius: 3 }]}
                      height={330}
                      slotProps={{
                        legend: { direction: "row", position: { vertical: "bottom", horizontal: "middle" } },
                      }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* Usuarios */}
            <SectionHeader
              icon={<GroupIcon fontSize="small" />}
              title="Usuarios"
              subtitle="Cuentas del personal del refugio"
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard icon={<GroupIcon />} label="Total registrados" value={totalUsuarios} color={CYA_SECONDARY} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard icon={<CheckCircleIcon />} label="Activos" value={usuariosActivos} color={CYA_SECONDARY} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard icon={<PersonOffIcon />} label="Inactivos" value={usuariosInactivos} color={CYA_MUTED} />
              </Grid>
            </Grid>
            {usuariosPorRol.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid var(--cya-border)" }}>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>Usuarios por rol</Typography>
                    <PieChart
                      series={[{ data: usuariosPorRol, innerRadius: 45, outerRadius: 90, paddingAngle: 2, cornerRadius: 3 }]}
                      height={330}
                      slotProps={{
                        legend: { direction: "row", position: { vertical: "bottom", horizontal: "middle" } },
                      }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* Solicitudes de adopción */}
            <SectionHeader
              icon={<DescriptionIcon fontSize="small" />}
              title="Solicitudes de Adopción"
              subtitle="Postulaciones recibidas desde el sitio público"
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard icon={<DescriptionIcon />} label="Total" value={totalSolicitudes} color={CYA_SECONDARY} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard icon={<HourglassTopIcon />} label="En proceso" value={solicitudesProceso} color={CYA_ACCENT} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard icon={<CancelIcon />} label="Rechazadas" value={solicitudesRechazadas} color={CYA_ERROR} />
              </Grid>
            </Grid>

            {/* Adopciones */}
            <SectionHeader
              icon={<FavoriteIcon fontSize="small" />}
              title="Adopciones"
              subtitle="Solicitudes finalizadas con éxito"
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <StatCard icon={<FavoriteIcon />} label="Total adoptadas" value={totalAdoptadas} color={CYA_PRIMARY} />
              </Grid>
              <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid var(--cya-border)", height: "100%" }}>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Adopciones por mes</Typography>
                  {mesesLabels.length > 0 && (
                    <BarChart
                      xAxis={[{ scaleType: "band", data: mesesLabels }]}
                      yAxis={[{ tickMinStep: 1, valueFormatter: (v: number) => `${v}` }]}
                      series={[{ data: adopcionesPorMes, color: CYA_PRIMARY, label: "Adopciones" }]}
                      height={240}
                      grid={{ horizontal: true }}
                    />
                  )}
                </Paper>
              </Grid>
            </Grid>

            {/* Seguimientos */}
            <SectionHeader
              icon={<EventAvailableIcon fontSize="small" />}
              title="Seguimientos"
              subtitle="Controles postadopción realizados"
            />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard icon={<EventAvailableIcon />} label="Total" value={totalSeguimientos} color={CYA_SECONDARY} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard icon={<HourglassTopIcon />} label="Pendientes" value={seguimientosPendientes} color={CYA_ACCENT} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard icon={<CheckCircleIcon />} label="Realizados" value={seguimientosRealizados} color={CYA_SECONDARY} />
              </Grid>
            </Grid>
          </Body>
        </Content>
      </Layout>
    </>
  );
}
