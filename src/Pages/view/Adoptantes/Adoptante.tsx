import { Box, Grid, Grow, IconButton, Modal, Tooltip } from "@mui/material";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import Body from "../../components/Layout/Body";
import HeaderBox from "./Components/HeaderBox";
import baseurl from "../../../Config/axios";
import axios from "axios";
import React from "react";
import moment from "moment";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "../../components/Header";
import Search from "./Components/Search";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";
import { dibujarLogoCabecera } from "../../../utils/logoPdf";

export default function Adoptante() {
  const [adoptante, setAdoptante] = React.useState<any>([]);

  const [busquedNombre, setBusquedNombre] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");
  const [telefonoFiltro, setTelefonoFiltro] = React.useState<any>("");

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [idadoptante, setIdAdoptante] = React.useState<any>("");

  const getAdoptante = React.useCallback(async () => {
    const body = {
      search: busquedNombre || "",
      fechaBusqueda: dateTo || null,
      telefono: telefonoFiltro || null,
    };
    const url = baseurl + "adoptante/list";
    await axios
      .post(url, body)
      .then((response) => {
        const { data } = response;
        setAdoptante(data.data);
      })
      .catch(() => {
        // Si el filtro manda algo raro (o el servidor falla), no tumbamos
        // la app: mostramos "sin resultados" en vez de un error visible.
        setAdoptante([]);
      });
  }, [busquedNombre, dateTo, telefonoFiltro]);

  // Búsqueda automática con debounce, igual que en Colitas.
  React.useEffect(() => {
    const timer = setTimeout(() => {
      getAdoptante();
    }, 350);
    return () => clearTimeout(timer);
  }, [getAdoptante]);

  const handleBusqueda = (value: any) => setBusquedNombre(value);
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
  const handleTelefono = (value: any) => setTelefonoFiltro(value);
  const handleClearFilters = () => {
    setBusquedNombre("");
    setDateTo("");
    setTelefonoFiltro("");
  };

  const buildExportRows = React.useCallback(
    () =>
      (adoptante || []).map((a: any) => ({
        Nombre: a.Nombre,
        Apellido: a.Apellido,
        DNI: a.Dni,
        "Teléfono / Celular": a.telefono,
        Direccion: a.Direccion,
        Motivo: a.Motivo,
        "Fecha Registro": a.Fecha_Registro ? moment(a.Fecha_Registro).format("DD-MM-YYYY") : "",
      })),
    [adoptante]
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
    XLSX.utils.book_append_sheet(wb, ws, "Adoptantes");
    // XLSX.writeFile detecta Electron y usa fs en vez de descargar en el
    // navegador; forzamos la descarga manual con un Blob (mismo fix que en Colitas).
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `adoptantes_${moment().format("YYYYMMDD_HHmm")}.xlsx`;
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

    doc.setFillColor(251, 247, 242);
    doc.rect(0, 0, pageWidth, 24, "F");
    doc.setDrawColor(228, 96, 47);
    doc.setLineWidth(0.7);
    doc.line(0, 24, pageWidth, 24);

    // Devuelve dónde empieza el texto, porque el logo no es cuadrado y su
    // ancho depende de la proporción del archivo (ver utils/logoPdf).
    const xTexto = await dibujarLogoCabecera(doc);

    doc.setTextColor(228, 96, 47);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Refugio Colitas y Amor", xTexto, 12);
    doc.setTextColor(90, 90, 90);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Reporte de Adoptantes", xTexto, 19);

    doc.setTextColor(110, 110, 110);
    doc.setFontSize(9);
    doc.text(
      `Generado: ${moment().format("DD-MM-YYYY HH:mm")}   ·   Exportado por: ${usuario}   ·   Total: ${rows.length} adoptante(s)`,
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

    doc.save(`adoptantes_${moment().format("YYYYMMDD_HHmm")}.pdf`);
  };

  const columns: GridColDef<(typeof adoptante)[number]>[] = [
    { field: "Nombre", headerName: "Nombre", width: 130, align: "center", headerAlign: "center" },
    { field: "Apellido", headerName: "Apellido", width: 150, align: "center", headerAlign: "center" },
    {
      field: "Fecha_Registro",
      headerName: "Fecha Registro",
      width: 115,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => moment(params.value).format("DD-MM-YYYY"),
    },
    { field: "Dni", headerName: "DNI", width: 100, align: "center", headerAlign: "center" },
    { field: "telefono", headerName: "Telefono / Celular", width: 140, align: "center", headerAlign: "center" },
    { field: "Direccion", headerName: "Direccion", width: 170, align: "center", headerAlign: "center" },
    {
      field: "Motivo",
      headerName: "Motivo",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {params.value}
          </span>
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
              setIdAdoptante(params.row.idadoptante);
            }}
          >
            <DriveFileRenameOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
  const modalSx = { display: "flex", alignItems: "center", justifyContent: "center", p: 2 };
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
            <Agregar setOpenModal={setOpenModal} getAdoptante={() => getAdoptante()} />
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
              idadoptante={idadoptante}
              getAdoptante={() => getAdoptante()}
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
                  count={adoptante ? adoptante.length : 0}
                />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Search
                  handleBusqueda={(value: any) => handleBusqueda(value)}
                  handleDateTo={(value: any) => handleDateTo(value)}
                  handleTelefono={(value: any) => handleTelefono(value)}
                  onClear={handleClearFilters}
                />
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={adoptante}
                    columns={columns}
                    rowHeight={56}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 8,
                        },
                      },
                    }}
                    autoHeight
                    pageSizeOptions={[5, 8, 25]}
                    disableRowSelectionOnClick
                    disableColumnFilter
                    isCellEditable={() => false}
                    getRowId={(row) => row.idadoptante}
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
