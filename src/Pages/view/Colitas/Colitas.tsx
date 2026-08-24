import { Avatar, Box, Chip, Grid, Grow, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import HeaderBox from "./Components/HeaderBox";
import baseurl from "../../../Config/axios";
import axios from "axios";
import React from "react";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import PetsIcon from "@mui/icons-material/Pets";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import moment from "moment";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TbCat, TbDog } from "react-icons/tb";
import Header from "../../components/Header";
import Search from "./Components/Search";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";

// react-icons + los tipos de React 18 no siempre coinciden en el tipo de
// retorno (ReactNode vs JSX.Element); se castean una sola vez acá.
const CatIcon = TbCat as React.FC<{ size?: number; color?: string }>;
const DogIcon = TbDog as React.FC<{ size?: number; color?: string }>;

function buildImgUrl(foto: string) {
  const cleanBase = baseurl.replace(/\/+$/, "");
  const cleanFoto = (foto || "").replace(/\\/g, "/").replace(/^\/+/, "");
  return `${cleanBase}/${cleanFoto}`;
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

function AnimalPhoto({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = React.useState(false);
  if (!src || error) {
    return (
      <Avatar
        variant="rounded"
        sx={{ width: 48, height: 48, borderRadius: "8px", bgcolor: "var(--cya-bg-alt)", color: "var(--cya-primary)" }}
      >
        <PetsIcon fontSize="small" />
      </Avatar>
    );
  }
  return (
    <Avatar
      src={src}
      alt={alt}
      variant="rounded"
      sx={{ width: 48, height: 48, borderRadius: "8px" }}
      onError={() => setError(true)}
    />
  );
}

function estadoChipProps(estado: string): { label: string; color: "success" | "warning" | "error" | "info"; sx?: object } {
  const e = (estado || "").toLowerCase();
  if (e.includes("fallecid")) return { label: estado, color: "error", sx: { bgcolor: "#000", color: "#fff" } };
  if (e.includes("adopt")) return { label: estado, color: "success" };
  if (e.includes("baja")) return { label: estado, color: "error", sx: { bgcolor: "#6b7280", color: "#fff" } };
  if (e.includes("tratamiento") || e.includes("proceso")) return { label: estado, color: "warning" };
  if (e.includes("perdid")) return { label: estado, color: "error" };
  return { label: estado || "—", color: "info" };
}

function esterilizadoChip(value: string): { label: string; color: "success" | "default" } {
  const v = (value || "").toLowerCase();
  const yes = v === "si" || v === "sí" || v === "yes";
  return { label: yes ? "Sí" : "No", color: yes ? "success" : "default" };
}

export default function Colitas() {
  const [albergados, setAlbergados] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [idAnimal, setIdAnimal] = React.useState<any>("");

  const [busquedaNombre, setBusquedNombre] = React.useState<any>("");
  const [tipoAnimal, setTipoAnimal] = React.useState<any>("");
  const [genero, setGenero] = React.useState<any>("");
  const [tamano, setTamano] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");
  const [estadoFiltro, setEstadoFiltro] = React.useState<any>("");

  const getAlbergados = React.useCallback(async () => {
    const body = {
      search: busquedaNombre || "",
      p_tamano: tamano || null,
      p_idtipoanimal: tipoAnimal ? parseInt(tipoAnimal) : null,
      p_idgenero: genero ? parseInt(genero) : null,
      fechaBusqueda: dateTo || null,
      estado: estadoFiltro || null,
    };
    const url = baseurl + "colitas/list";
    await axios
      .post(url, body)
      .then((response) => {
        const { data } = response;
        setAlbergados(data.data);
      })
      .catch(() => {
        // Si el filtro manda algo raro (o el servidor falla), no tumbamos
        // la app: mostramos "sin resultados" en vez de un error visible.
        setAlbergados([]);
      });
  }, [busquedaNombre, tamano, tipoAnimal, genero, dateTo, estadoFiltro]);

  // Búsqueda automática: se dispara sola cuando cambia cualquier filtro,
  // con una pequeña espera para no disparar una petición por cada tecla.
  React.useEffect(() => {
    const timer = setTimeout(() => {
      getAlbergados();
    }, 350);
    return () => clearTimeout(timer);
  }, [getAlbergados]);

  const handleBusqueda = (value: any) => setBusquedNombre(value);
  const handleTipoAnimal = (value: any) => setTipoAnimal(value);
  const handleGenero = (value: any) => setGenero(value);
  const handleTamno = (value: any) => setTamano(value);
  const handleDateTo = (value: any) => {
    // Mientras se escribe un input type="date" a mano, el navegador puede
    // disparar onChange con años a medio completar (ej. "0020-04-14").
    // Solo aceptamos la fecha si viene completa y es un año razonable.
    const parsed = moment(value, "YYYY-MM-DD", true);
    if (!parsed.isValid() || parsed.year() < 1900 || parsed.year() > 2100) {
      setDateTo("");
      return;
    }
    setDateTo(parsed.format("YYYY-MM-DD"));
  };
  const handleEstadoFiltro = (value: any) => setEstadoFiltro(value);
  const handleClearFilters = () => {
    setBusquedNombre("");
    setTipoAnimal("");
    setGenero("");
    setTamano("");
    setDateTo("");
    setEstadoFiltro("");
  };

  const buildExportRows = React.useCallback(
    () =>
      (albergados || []).map((a: any) => ({
        Nombre: a.nombre,
        Tamaño: a.tamano,
        "Peso (kg)": a.peso,
        Edad: a.edad_texto || "",
        "Fecha Ingreso": a.Fecha_Ingreso ? moment(a.Fecha_Ingreso).format("DD-MM-YYYY") : "",
        Genero: a.genero?.descripcion || "",
        Tipo: a.tipo_descripcion?.descripcion || "",
        Estado: a.estado,
        Esterilizado: a.esterelizacion,
        "Motivo del estado": a.motivo_estado || "",
        Observaciones: a.observaciones || "",
      })),
    [albergados]
  );

  // jspdf + xlsx pesan ~700 KB juntos. Se cargan solo cuando el usuario
  // exporta, no al abrir la pantalla (antes se descargaban siempre).
  const exportToExcel = async () => {
    const rows = buildExportRows();
    if (rows.length === 0) {
      window.alert("No hay datos para exportar con los filtros actuales.");
      return;
    }
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Albergados");
    // Generamos el archivo como buffer y lo bajamos con un <a> manual: el
    // dashboard corre dentro de Electron y XLSX.writeFile detecta ese
    // entorno como Node.js, intentando escribir con fs en vez de descargar.
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `colitas_albergados_${moment().format("YYYYMMDD_HHmm")}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    const rows = buildExportRows();
    if (rows.length === 0) {
      window.alert("No hay datos para exportar con los filtros actuales.");
      return;
    }

    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF({ orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const usuario = localStorage.getItem("user") || "—";

    // Barra de encabezado neutra (blanco/gris), con una línea naranja como
    // acento de marca en vez de un bloque de color sólido.
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
    doc.text("Reporte de Mascotas Albergadas", 30, 19);

    doc.setTextColor(110, 110, 110);
    doc.setFontSize(9);
    doc.text(
      `Generado: ${moment().format("DD-MM-YYYY HH:mm")}   ·   Exportado por: ${usuario}   ·   Total: ${rows.length} mascota(s)`,
      10,
      31
    );

    autoTable(doc, {
      startY: 36,
      head: [Object.keys(rows[0])],
      body: rows.map((r: any) => Object.values(r)),
      styles: { fontSize: 8, cellPadding: 3, textColor: [60, 60, 60] },
      headStyles: { fillColor: [228, 96, 47], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [251, 247, 242] },
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

    doc.save(`colitas_albergados_${moment().format("YYYYMMDD_HHmm")}.pdf`);
  };

  const columns: GridColDef<(typeof albergados)[number]>[] = [
    {
      field: "nombre",
      headerName: "Mascota",
      width: 160,
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AnimalPhoto key={params.row.foto} src={buildImgUrl(params.row.foto)} alt={params.row.nombre} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.nombre}
          </Typography>
        </Box>
      ),
    },
    { field: "tamano", headerName: "Tamaño", width: 100, align: "center", headerAlign: "center" },
    {
      field: "peso",
      headerName: "Peso (kg)",
      width: 95,
      align: "center",
      headerAlign: "center",
    },
    {
      // La edad la calcula el servidor desde la fecha de nacimiento, así que
      // se muestra tal cual llega ("~3 años, 5 meses"). El "~" marca las
      // estimadas. Se ordena por meses para que el orden sea el real.
      field: "edad_texto",
      headerName: "Edad",
      width: 130,
      align: "center",
      headerAlign: "center",
      sortComparator: (v1, v2, p1, p2) =>
        (p1.api.getRow(p1.id)?.edad_meses ?? -1) - (p2.api.getRow(p2.id)?.edad_meses ?? -1),
      renderCell: (params) => params.value || "—",
    },
    {
      field: "genero",
      headerName: "Genero",
      width: 90,
      resizable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const desc: string = params.value?.descripcion || "";
        const isMacho = desc.toLowerCase().includes("macho");
        return (
          <Tooltip title={desc}>
            {isMacho ? (
              <MaleIcon sx={{ color: "#4A90D9" }} fontSize="small" />
            ) : (
              <FemaleIcon sx={{ color: "#D96BAA" }} fontSize="small" />
            )}
          </Tooltip>
        );
      },
    },
    {
      field: "tipo_descripcion",
      headerName: "Tipo",
      width: 70,
      resizable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const desc: string = params.value?.descripcion || "";
        const isGato = desc.toLowerCase().includes("gato");
        // react-icons no reenvía ref, y Tooltip lo necesita en su hijo directo;
        // por eso va envuelto en un <span> (vía Box) en vez de pasarlo directo.
        return (
          <Tooltip title={desc}>
            <Box
              component="span"
              sx={{ display: "inline-flex", verticalAlign: "middle" }}
            >
              {isGato ? (
                <CatIcon size={20} color="var(--cya-primary)" />
              ) : (
                <DogIcon size={20} color="var(--cya-secondary-dark)" />
              )}
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 130,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const { label, color, sx } = estadoChipProps(params.value);
        return <Chip label={label} color={color} size="small" className="cya-status-chip" sx={sx} />;
      },
    },
    {
      field: "esterelizacion",
      headerName: "Esteriliz.",
      width: 100,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const { label, color } = esterilizadoChip(params.value);
        return <Chip label={label} color={color} size="small" variant={color === "default" ? "outlined" : "filled"} />;
      },
    },
    {
      field: "Fecha_Ingreso",
      headerName: "Fecha Ingreso",
      width: 115,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => moment(params.value).format("DD-MM-YYYY"),
    },
    {
      field: "observaciones",
      headerName: "Observaciones",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "view",
      headerName: "Opción",
      width: 80,
      sortable: false,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title="Editar">
          <IconButton
            className="cya-icon-edit"
            size="small"
            onClick={() => {
              setOpenModalEdit(true);
              setIdAnimal(params.row.idanimal);
            }}
          >
            <DriveFileRenameOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  // ✅ ESTILO NUEVO PARA MODALES (RESPONSIVE + SCROLL)
  // El centrado se hace con flexbox en el <Modal> (no con position:absolute +
  // transform en el Box): Grow también anima la propiedad `transform` y pisaba
  // el translate(-50%,-50%), lo que hacía que el modal apareciera desplazado
  // hacia abajo/derecha en vez de centrado.
  const modalSx = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 2,
  };

  const modalBoxSx = {
    width: "min(700px, 92vw)",
    maxHeight: "90vh",
    overflowY: "auto",
    overflowX: "hidden",
    bgcolor: "background.paper",
    borderRadius: "var(--cya-radius-lg)",
    boxShadow: "0 25px 60px rgba(36, 40, 44, 0.35)",
    outline: "none",
  };

  // Evitamos que un clic afuera o el Escape cierren el modal por accidente y
  // se pierda lo que se estaba escribiendo: solo cierra por los botones
  // explícitos (X / Cancelar / Guardar) dentro del propio formulario.
  const ModalAgregar = () => {
    return (
      <Modal
        open={openModal}
        onClose={(_e, reason) => {
          if (reason === "backdropClick") return;
          setOpenModal(false);
        }}
        disableEscapeKeyDown
        closeAfterTransition
        sx={modalSx}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grow in={openModal} timeout={280}>
          <Box sx={modalBoxSx}>
            <Agregar setOpenModal={setOpenModal} getAlbergados={getAlbergados} />
          </Box>
        </Grow>
      </Modal>
    );
  };

  const ModalEditar = () => {
    return (
      <Modal
        open={openModalEdit}
        onClose={(_e, reason) => {
          if (reason === "backdropClick") return;
          setOpenModalEdit(false);
        }}
        disableEscapeKeyDown
        closeAfterTransition
        sx={modalSx}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grow in={openModalEdit} timeout={280}>
          <Box sx={modalBoxSx}>
            <Editar
              setOpenModalEdit={setOpenModalEdit}
              idAnimal={idAnimal}
              getAlbergados={getAlbergados}
            />
          </Box>
        </Grow>
      </Modal>
    );
  };

  return (
    <>
      <Layout>
        <Navar />
        <Content>
          <Header />
          <Body>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <HeaderBox
                  setOpenModal={() => setOpenModal(true)}
                  onExportExcel={exportToExcel}
                  onExportPDF={exportToPDF}
                  count={albergados.length}
                />
              </Grid>

              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Search
                  handleBusqueda={handleBusqueda}
                  handleTipoAnimal={handleTipoAnimal}
                  handleGenero={handleGenero}
                  handleTamno={handleTamno}
                  handleDateTo={handleDateTo}
                  handleEstado={handleEstadoFiltro}
                  onClear={handleClearFilters}
                />

                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={albergados}
                    columns={columns}
                    rowHeight={70}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 8 },
                      },
                      sorting: {
                        sortModel: [{ field: "Fecha_Ingreso", sort: "desc" }],
                      },
                    }}
                    autoHeight
                    pageSizeOptions={[5, 8, 25]}
                    disableRowSelectionOnClick
                    disableColumnFilter
                    isCellEditable={() => false}
                    getRowId={(row) => row.idanimal}
                  />
                </Box>
              </Grid>
            </Grid>
          </Body>
        </Content>
      </Layout>

      {ModalAgregar()}
      {ModalEditar()}
    </>
  );
}
