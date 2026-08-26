import { Box, Chip, Grid, Grow, IconButton, Modal, Tooltip } from "@mui/material";
import Header from "../../components/Header";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import HeaderBox from "./Components/HeaderBox";

import React from "react";
import baseurl from "../../../Config/axios";
import axios from "axios";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UndoIcon from "@mui/icons-material/Undo";
import { Snackbar, Alert } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Search from "./Components/Search";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";
import Delete from "./Components/Modal/Delete";

interface Voluntario {
  label: string;
  value: number;
}

export default function Voluntariado() {
  const navigate = useNavigate();

  // La pantalla ya no es exclusiva del Administrador: si el Administrador le
  // habilita la sección a Voluntariado desde Permisos de Roles, el voluntario
  // entra y ve solo sus visitas (el servidor filtra por su usuario). Lo que sí
  // queda reservado al Administrador es asignar, editar y eliminar.
  const esAdmin = localStorage.getItem("rol") === "Administrador";

  React.useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [visitaSeleccionada, setVisitaSeleccionada] = React.useState<any>(null);
  const [visitas, setVisitas] = React.useState<any>([]);
  const [voluntarios, setVoluntarios] = React.useState<Voluntario[]>([]);
  const [iduser, setIduser] = React.useState<any>("");
  const [mes, setMes] = React.useState<any>("");
  const [aviso, setAviso] = React.useState<{ texto: string; tipo: "success" | "error" } | null>(null);

  const getVisitas = React.useCallback(async () => {
    const body: any = {};
    if (iduser) body.iduser = iduser;
    if (mes) body.mes = mes;
    const url = baseurl + "voluntario-visita/list";
    await axios
      .post(url, body)
      .then((response) => {
        const { data } = response;
        setVisitas(data.data);
      })
      .catch(() => {
        setVisitas([]);
      });
  }, [iduser, mes]);

  // Búsqueda automática con una pequeña espera, mismo patrón del resto del panel.
  React.useEffect(() => {
    const timer = setTimeout(() => {
      getVisitas();
    }, 350);
    return () => clearTimeout(timer);
  }, [getVisitas]);

  React.useEffect(() => {
    const url = baseurl + "usuario/list";
    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        const opciones: Voluntario[] = (data.data || [])
          .filter((u: any) => u.rol === "Voluntario")
          .map((u: any) => ({
            label: `${u.nombres || ""} ${u.apellidos || ""}`.trim() || u.usuario,
            value: u.iduser,
          }));
        setVoluntarios(opciones);
      })
      .catch(() => setVoluntarios([]));
  }, []);

  // Atajo para marcar la visita como realizada sin abrir el formulario. Es
  // reversible: si se marca por error, el mismo botón la devuelve a pendiente.
  const cambiarEstado = async (visita: any) => {
    const nuevo = visita.Estado === "Realizado" ? "Pendiente" : "Realizado";
    try {
      const { data } = await axios.put(baseurl + "voluntario-visita/estado/" + visita.idvisita, {
        Estado: nuevo,
      });
      if (data.code === "000") {
        setAviso({
          texto: nuevo === "Realizado" ? "Visita marcada como realizada." : "Visita devuelta a pendiente.",
          tipo: "success",
        });
        getVisitas();
      } else {
        setAviso({ texto: data.message || "No se pudo cambiar el estado.", tipo: "error" });
      }
    } catch (e: any) {
      setAviso({
        texto: e?.response?.data?.message || e.message || "No se pudo cambiar el estado.",
        tipo: "error",
      });
    }
  };

  const handleClearFilters = () => {
    setIduser("");
    setMes("");
  };

  const columns: GridColDef<(typeof visitas)[number]>[] = [
    {
      field: "voluntario",
      headerName: "Voluntario",
      width: 200,
      headerAlign: "center",
      renderCell: (params) =>
        `${params.value?.nombres || ""} ${params.value?.apellidos || ""}`.trim() || params.value?.usuario || "—",
    },
    {
      field: "fecha",
      headerName: "Fecha de visita",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.value ? moment(params.value).format("DD-MM-YYYY") : "—"),
    },
    {
      field: "nota",
      headerName: "Nota",
      width: 220,
      headerAlign: "center",
      renderCell: (params) => params.value || "—",
    },
    {
      field: "Estado",
      headerName: "Estado",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip
          title={
            params.value === "Realizado"
              ? "Marcar como pendiente"
              : "Marcar como realizada"
          }
        >
          <Chip
            label={params.value}
            color={params.value === "Realizado" ? "success" : "warning"}
            size="small"
            onClick={() => cambiarEstado(params.row)}
            sx={{ cursor: "pointer" }}
          />
        </Tooltip>
      ),
    },
    {
      field: "view",
      headerName: "Opción",
      width: 140,
      sortable: false,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Tooltip
            title={
              params.row.Estado === "Realizado"
                ? "Volver a pendiente"
                : "Marcar como realizada"
            }
          >
            <IconButton
              size="small"
              sx={{ color: params.row.Estado === "Realizado" ? "#8a8f98" : "#2e7d32" }}
              onClick={() => cambiarEstado(params.row)}
            >
              {params.row.Estado === "Realizado" ? (
                <UndoIcon fontSize="small" />
              ) : (
                <CheckCircleIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          {!esAdmin ? null : (
          <>
          <Tooltip title="Editar">
            <IconButton
              className="cya-icon-edit"
              size="small"
              onClick={() => {
                setVisitaSeleccionada(params.row);
                setOpenModalEdit(true);
              }}
            >
              <DriveFileRenameOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              sx={{ ml: 0.5, color: "#c0392b" }}
              onClick={() => {
                setVisitaSeleccionada(params.row);
                setOpenModalDelete(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          </>
          )}
        </>
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

  const ModalAgregar = () => (
    <Modal
      open={openModal}
      onClose={(_e, reason) => {
        if (reason === "backdropClick") return;
        setOpenModal(false);
      }}
      disableEscapeKeyDown
      closeAfterTransition
      sx={modalSx}
    >
      <Grow in={openModal} timeout={280}>
        <Box sx={modalBoxSx}>
          <Agregar setOpenModal={setOpenModal} getVisitas={() => getVisitas()} />
        </Box>
      </Grow>
    </Modal>
  );

  const ModalEditar = () => (
    <Modal
      open={openModalEdit}
      onClose={(_e, reason) => {
        if (reason === "backdropClick") return;
        setOpenModalEdit(false);
      }}
      disableEscapeKeyDown
      closeAfterTransition
      sx={modalSx}
    >
      <Grow in={openModalEdit} timeout={280}>
        <Box sx={modalBoxSx}>
          <Editar
            setOpenModalEdit={setOpenModalEdit}
            visita={visitaSeleccionada}
            getVisitas={() => getVisitas()}
          />
        </Box>
      </Grow>
    </Modal>
  );

  const ModalDelete = () => (
    <Modal
      open={openModalDelete}
      onClose={(_e, reason) => {
        if (reason === "backdropClick") return;
        setOpenModalDelete(false);
      }}
      disableEscapeKeyDown
      closeAfterTransition
      sx={modalSx}
    >
      <Grow in={openModalDelete} timeout={280}>
        <Box sx={{ ...modalBoxSx, width: "min(420px, 92vw)" }}>
          <Delete
            setOpenModalDelete={setOpenModalDelete}
            idvisita={visitaSeleccionada?.idvisita}
            getVisitas={() => getVisitas()}
          />
        </Box>
      </Grow>
    </Modal>
  );

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
                  setOpenModal={esAdmin ? () => setOpenModal(true) : null}
                  count={visitas ? visitas.length : 0}
                />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Search
                  voluntarios={voluntarios}
                  handleVoluntario={(value: any) => setIduser(value)}
                  handleMes={(value: any) => setMes(value)}
                  onClear={handleClearFilters}
                />
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={visitas}
                    columns={columns}
                    rowHeight={60}
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
                    getRowId={(row) => row.idvisita}
                  />
                </Box>
              </Grid>
            </Grid>
          </Body>
        </Content>
      </Layout>
      {ModalAgregar()}
      {ModalEditar()}
      {ModalDelete()}
      <Snackbar
        open={Boolean(aviso)}
        autoHideDuration={3000}
        onClose={() => setAviso(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={aviso?.tipo || "success"} variant="filled" onClose={() => setAviso(null)}>
          {aviso?.texto}
        </Alert>
      </Snackbar>
    </>
  );
}
