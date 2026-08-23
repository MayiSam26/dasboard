import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import React from "react";
import axios from "axios";
import moment from "moment";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import baseurl from "../../../Config/axios";
import GridOnIcon from "@mui/icons-material/GridOn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

interface Movimiento {
  tipo: "Ingreso" | "Egreso";
  id: number;
  detalle: string;
  monto: number;
  fecha_declarada: string | null;
  creado_en: string | null;
  creado_por: string | null;
  modificado_en: string | null;
  modificado_por: string | null;
}

interface Resumen {
  total: number;
  conHuella: number;
  sinHuella: number;
  totalIngresos: number;
  totalEgresos: number;
}

function Tarjeta({ etiqueta, valor, color }: { etiqueta: string; valor: string; color: string }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "var(--cya-radius-md)",
        border: "1px solid var(--cya-border)",
        bgcolor: "background.paper",
        height: "100%",
      }}
    >
      <Typography variant="body2" sx={{ color: "var(--cya-text-muted)" }}>
        {etiqueta}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, color }}>
        {valor}
      </Typography>
    </Box>
  );
}

export default function Auditoria() {
  const navigate = useNavigate();

  // Muestra qué hizo cada usuario: solo el Administrador.
  React.useEffect(() => {
    const rol = localStorage.getItem("rol");
    if (rol && rol !== "Administrador") navigate("/panel");
  }, [navigate]);

  const [movimientos, setMovimientos] = React.useState<Movimiento[]>([]);
  const [resumen, setResumen] = React.useState<Resumen | null>(null);
  const [desde, setDesde] = React.useState("");
  const [hasta, setHasta] = React.useState("");
  const [tipo, setTipo] = React.useState("");
  const [cargando, setCargando] = React.useState(false);

  const rangoInvalido = Boolean(desde && hasta && desde > hasta);

  const consultar = React.useCallback(async () => {
    if (desde && hasta && desde > hasta) return;
    setCargando(true);
    try {
      const { data } = await axios.post(baseurl + "auditoria-registros/economica", {
        desde: desde || null,
        hasta: hasta || null,
        tipo: tipo || null,
      });
      setMovimientos(data.data || []);
      setResumen(data.resumen || null);
    } catch {
      setMovimientos([]);
      setResumen(null);
    } finally {
      setCargando(false);
    }
  }, [desde, hasta, tipo]);

  React.useEffect(() => {
    const timer = setTimeout(() => consultar(), 350);
    return () => clearTimeout(timer);
  }, [consultar]);

  const limpiar = () => {
    setDesde("");
    setHasta("");
    setTipo("");
  };

  const filas = React.useMemo(
    () =>
      movimientos.map((m) => ({
        ...m,
        idFila: `${m.tipo}-${m.id}`,
      })),
    [movimientos]
  );

  const filasExportables = () =>
    movimientos.map((m) => ({
      Tipo: m.tipo,
      "N°": m.id,
      Detalle: m.detalle,
      "Monto (S/)": m.monto.toFixed(2),
      "Fecha declarada": m.fecha_declarada ? moment(m.fecha_declarada).format("DD-MM-YYYY") : "—",
      "Registrado el": m.creado_en ? moment(m.creado_en).format("DD-MM-YYYY HH:mm") : "Sin registro",
      "Registrado por": m.creado_por || "Sin registro",
      "Última modificación": m.modificado_en
        ? `${moment(m.modificado_en).format("DD-MM-YYYY HH:mm")} — ${m.modificado_por || "—"}`
        : "—",
    }));

  const exportarExcel = async () => {
    const rows = filasExportables();
    if (!rows.length) return window.alert("No hay movimientos para exportar con estos filtros.");
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Auditoría");
    const salida = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const url = URL.createObjectURL(new Blob([salida], { type: "application/octet-stream" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `auditoria_economica_${moment().format("YYYYMMDD_HHmm")}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportarPDF = async () => {
    const rows = filasExportables();
    if (!rows.length) return window.alert("No hay movimientos para exportar con estos filtros.");
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF({ orientation: "landscape" });
    const ancho = doc.internal.pageSize.getWidth();
    const usuario = localStorage.getItem("user") || "—";

    doc.setFillColor(251, 247, 242);
    doc.rect(0, 0, ancho, 24, "F");
    doc.setDrawColor(228, 96, 47);
    doc.setLineWidth(0.7);
    doc.line(0, 24, ancho, 24);
    doc.setTextColor(228, 96, 47);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Refugio Colitas y Amor", 12, 12);
    doc.setTextColor(90, 90, 90);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Auditoría de movimientos económicos", 12, 19);

    const periodo =
      desde || hasta
        ? `Periodo: ${desde ? moment(desde).format("DD-MM-YYYY") : "inicio"} a ${
            hasta ? moment(hasta).format("DD-MM-YYYY") : "hoy"
          }`
        : "Periodo: todos los movimientos";
    doc.setTextColor(110, 110, 110);
    doc.setFontSize(9);
    doc.text(
      `Generado: ${moment().format("DD-MM-YYYY HH:mm")}   ·   Exportado por: ${usuario}   ·   ${periodo}`,
      12,
      31
    );
    if (resumen) {
      doc.text(
        `Movimientos: ${resumen.total}   ·   Ingresos: S/ ${resumen.totalIngresos.toFixed(
          2
        )}   ·   Egresos: S/ ${resumen.totalEgresos.toFixed(2)}   ·   Sin huella de auditoría: ${
          resumen.sinHuella
        }`,
        12,
        36
      );
    }

    autoTable(doc, {
      startY: 41,
      head: [Object.keys(rows[0])],
      body: rows.map((r: any) => Object.values(r)),
      styles: { fontSize: 8, cellPadding: 2.5, textColor: [60, 60, 60] },
      headStyles: { fillColor: [228, 96, 47], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [251, 247, 242] },
    });

    const paginas = doc.getNumberOfPages();
    const alto = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= paginas; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Página ${i} de ${paginas}`, ancho - 32, alto - 8);
      doc.text("Refugio Colitas y Amor", 12, alto - 8);
    }
    doc.save(`auditoria_economica_${moment().format("YYYYMMDD_HHmm")}.pdf`);
  };

  const columnas: GridColDef[] = [
    {
      field: "tipo",
      headerName: "Tipo",
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (p) => (
        <Chip
          label={p.value}
          size="small"
          color={p.value === "Ingreso" ? "success" : "warning"}
          variant="outlined"
        />
      ),
    },
    { field: "detalle", headerName: "Detalle", flex: 1, minWidth: 180, headerAlign: "center" },
    {
      field: "monto",
      headerName: "Monto (S/)",
      width: 110,
      align: "right",
      headerAlign: "center",
      renderCell: (p) => Number(p.value || 0).toFixed(2),
    },
    {
      field: "fecha_declarada",
      headerName: "Fecha declarada",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (p) => (p.value ? moment(p.value).format("DD-MM-YYYY") : "—"),
    },
    {
      field: "creado_en",
      headerName: "Registrado el (real)",
      width: 170,
      align: "center",
      headerAlign: "center",
      renderCell: (p) => {
        if (!p.value) {
          return (
            <Tooltip title="Se registró antes de que existiera la auditoría">
              <Chip label="Sin registro" size="small" variant="outlined" />
            </Tooltip>
          );
        }
        // Si la fecha declarada no coincide con la real, conviene que salte a la vista.
        const declarada = p.row.fecha_declarada
          ? moment(p.row.fecha_declarada).format("YYYY-MM-DD")
          : null;
        const real = moment(p.value).format("YYYY-MM-DD");
        const difiere = declarada && declarada !== real;
        return (
          <Tooltip title={difiere ? "No coincide con la fecha declarada en el formulario" : ""}>
            <Typography variant="body2" sx={{ color: difiere ? "#b85c00" : "inherit", fontWeight: difiere ? 700 : 400 }}>
              {moment(p.value).format("DD-MM-YYYY HH:mm")}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: "creado_por",
      headerName: "Registrado por",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (p) => p.value || "—",
    },
    {
      field: "modificado_en",
      headerName: "Última modificación",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (p) =>
        p.value ? `${moment(p.value).format("DD-MM-YYYY HH:mm")} — ${p.row.modificado_por || "—"}` : "—",
    },
  ];

  return (
    <Layout>
      <Navar />
      <Content>
        <Header />
        <Body>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Grid item xs={12} md="auto">
                  <Typography variant="h4">Auditoría económica</Typography>
                  <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mt: 0.3 }}>
                    Quién registró cada ingreso y egreso, y a qué hora real lo hizo
                  </Typography>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} className="cya-table-toolbar">
                    <Button className="cya-btn-export" onClick={exportarExcel} variant="outlined" startIcon={<GridOnIcon />}>
                      Excel
                    </Button>
                    <Button className="cya-btn-export" onClick={exportarPDF} variant="outlined" startIcon={<PictureAsPdfIcon />}>
                      PDF
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ marginTop: "20px" }}>
              {resumen && resumen.sinHuella > 0 && (
                <Alert severity="info" sx={{ mb: 2, borderRadius: "var(--cya-radius-md)" }}>
                  {resumen.sinHuella} movimiento(s) se registraron antes de que existiera la auditoría, por eso
                  no tienen fecha real ni usuario. Los nuevos sí la llevan.
                </Alert>
              )}

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Tarjeta etiqueta="Movimientos" valor={String(resumen?.total ?? 0)} color="var(--cya-dark)" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Tarjeta etiqueta="Con huella" valor={String(resumen?.conHuella ?? 0)} color="#3F9E5C" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Tarjeta etiqueta="Total ingresos" valor={`S/ ${(resumen?.totalIngresos ?? 0).toFixed(2)}`} color="#3F9E5C" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Tarjeta etiqueta="Total egresos" valor={`S/ ${(resumen?.totalEgresos ?? 0).toFixed(2)}`} color="#E4602F" />
                </Grid>
              </Grid>

              <Paper variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "var(--cya-border)", mb: 3 }}>
                <Grid container spacing={2} sx={{ p: 2, alignItems: "flex-start" }}>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="tipo-auditoria">Tipo</InputLabel>
                      <Select
                        labelId="tipo-auditoria"
                        label="Tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                      >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="Ingreso">Ingresos</MenuItem>
                        <MenuItem value="Egreso">Egresos</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Desde"
                      type="date"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={desde}
                      onChange={(e) => setDesde(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Hasta"
                      type="date"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={hasta}
                      onChange={(e) => setHasta(e.target.value)}
                      error={rangoInvalido}
                      helperText={rangoInvalido ? "Debe ser posterior a «Desde»" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<FilterAltOffIcon />}
                      disabled={!desde && !hasta && !tipo}
                      onClick={limpiar}
                      sx={{ height: "40px", textTransform: "none" }}
                    >
                      Limpiar
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              <Box sx={{ width: "100%" }} className="cya-table-card">
                <DataGrid
                  rows={filas}
                  columns={columnas}
                  rowHeight={56}
                  loading={cargando}
                  autoHeight
                  initialState={{ pagination: { paginationModel: { pageSize: 8 } } }}
                  pageSizeOptions={[5, 8, 25]}
                  disableRowSelectionOnClick
                  disableColumnFilter
                  isCellEditable={() => false}
                  getRowId={(row) => row.idFila}
                />
              </Box>
            </Grid>
          </Grid>
        </Body>
      </Content>
    </Layout>
  );
}
