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

  React.useEffect(() => {
    const rol = localStorage.getItem("rol");
    if (rol && rol !== "Administrador") {
      navigate("/panel");
    }
  }, [navigate]);

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [visitaSeleccionada, setVisitaSeleccionada] = React.useState<any>(null);
  const [visitas, setVisitas] = React.useState<any>([]);
  const [voluntarios, setVoluntarios] = React.useState<Voluntario[]>([]);
  const [iduser, setIduser] = React.useState<any>("");
  const [mes, setMes] = React.useState<any>("");

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
        <Chip label={params.value} color={params.value === "Realizado" ? "success" : "warning"} size="small" />
      ),
    },
    {
      field: "view",
      headerName: "Opción",
      width: 90,
      sortable: false,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={visitas ? visitas.length : 0} />
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
    </>
  );
}
