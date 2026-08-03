import { Box, Chip, Grid, Grow, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import Header from "../../components/Header";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import HeaderBox from "./Components/HeaderBox";
import React from "react";
import baseurl from "../../../Config/axios";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import PetsIcon from "@mui/icons-material/Pets";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CancelIcon from "@mui/icons-material/Cancel";
import Search from "./Components/Search";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";

function ReporteCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 2,
        borderRadius: "var(--cya-radius-md)",
        border: "1px solid var(--cya-border)",
        bgcolor: "background.paper",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}1F`,
          color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: "var(--cya-text-muted)" }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
          {value ?? 0}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Adopcion() {
  const [adopciones, setAdopciones] = React.useState<any>([]);

  const [busqueda, setBusquedNombre] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");
  const [reporte, setReporte] = React.useState<any>([]);

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [idAdopcion, setIdAdopacion] = React.useState<any>("");

  const getAdopciones = async () => {
    const body = {
      fechaBusqueda: null,
      state: "",
    };
    const url = baseurl + "adopciones/list";
    await axios
      .post(url, body)
      .then((response) => {
        const { data } = response;
        setAdopciones(data.data);
      })
      .catch(() => setAdopciones([]));
  };

  React.useEffect(() => {
    getAdopciones();
  }, []);
  const handleBusqueda = (value: any) => {
    setBusquedNombre(value);
  };

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

  const handleSearch = async () => {
    const body = {
      fechaBusqueda: dateTo || null,
      state: busqueda ?? "",
    };
    const url = baseurl + "adopciones/list";
    await axios
      .post(url, body)
      .then((response) => {
        const { data } = response;
        setAdopciones(data.data);
      })
      .catch(() => setAdopciones([]));
  };

  const getReportes = async () => {
    const url = baseurl + "adopciones/list/reporte";
    await axios.post(url).then((response) => {
      const { data } = response;
      setReporte(data.data);
    });
  };

  React.useEffect(() => {
    getReportes();
  }, []);

  const columns: GridColDef<(typeof adopciones)[number]>[] = [
    {
      field: "adoptante",
      headerName: "Adoptante",
      width: 190,
      headerAlign: "center",
      renderCell: (params) => `${params.value.Nombre} ${params.value.Apellido}`,
    },
    {
      field: "animales",
      headerName: "Colita",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value.nombre,
    },
    {
      field: "Estado",
      headerName: "Estado",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const label =
          params.value === "adoptado" ? "Adoptado" : params.value === "rechazado" ? "Rechazado" : "Proceso";
        const color =
          params.value === "adoptado" ? "success" : params.value === "rechazado" ? "error" : "warning";
        return <Chip label={label} color={color} size="small" />;
      },
    },
    {
      field: "Fecha_Adopcion",
      headerName: "Fecha adopción",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => moment(params.value).format("DD-MM-YYYY"),
    },
    {
      field: "Observaciones",
      headerName: "Observaciones",
      flex: 1,
      minWidth: 180,
      headerAlign: "center",
      renderCell: (params) => {
        const esRechazado = params.row.Estado === "rechazado" && params.row.MotivoRechazo;
        const texto = esRechazado ? `Motivo de rechazo: ${params.row.MotivoRechazo}` : params.value;
        return (
          <Tooltip title={texto || ""}>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                color: esRechazado ? "var(--cya-primary)" : "inherit",
              }}
            >
              {texto}
            </span>
          </Tooltip>
        );
      },
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
              setIdAdopacion(params.row.idadopcion);
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
            <Agregar
              setOpenModal={setOpenModal}
              getAdopciones={() => getAdopciones()}
              getReportes={() => getReportes()}
            />
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
              idAdopcion={idAdopcion}
              getAdopciones={() => getAdopciones()}
              updates={() => getReportes()}
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={adopciones ? adopciones.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {reporte.map((item: any, idx: number) => (
                    <React.Fragment key={idx}>
                      <Grid item xs={12} sm={6} md={3}>
                        <ReporteCard
                          icon={<PetsIcon />}
                          label="Cantidad Adopciones"
                          value={item.cantadopci}
                          color="#E4602F"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <ReporteCard
                          icon={<HourglassBottomIcon />}
                          label="En proceso"
                          value={item.proceso}
                          color="#C99A2E"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <ReporteCard
                          icon={<FavoriteIcon />}
                          label="Adoptado"
                          value={item.adoptado}
                          color="#3F9E5C"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <ReporteCard
                          icon={<CancelIcon />}
                          label="Rechazado"
                          value={item.rechazado}
                          color="#C0392B"
                        />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
                <Search
                  handleBusqueda={(value: any) => handleBusqueda(value)}
                  handleSearch={() => handleSearch()}
                  handleDateTo={(value: any) => handleDateTo(value)}
                />
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={adopciones}
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
                    getRowId={(row) => row.idadopcion}
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
