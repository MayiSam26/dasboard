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
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";
import { useNavigate } from "react-router-dom";

const ROL_COLOR: Record<string, "primary" | "secondary" | "info"> = {
  Administrador: "primary",
  Voluntario: "secondary",
  Veterinario: "info",
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = React.useState<any>(null);

  const usuarioActual = localStorage.getItem("user");
  const navigate = useNavigate();

  React.useEffect(() => {
    const rol = localStorage.getItem("rol");
    if (rol && rol !== "Administrador") {
      navigate("/panel");
    }
  }, [navigate]);

  const getUsuarios = async () => {
    const url = baseurl + "usuario/list";
    await axios
      .get(url)
      .then((response) => {
        const { data } = response.data;
        setUsuarios(data);
      })
      .catch(() => setUsuarios([]));
  };

  React.useEffect(() => {
    getUsuarios();
  }, []);

  const cambiarEstado = async (row: any) => {
    const url = baseurl + "usuario/estado/" + row.iduser;
    await axios
      .put(url, { activo: !row.activo })
      .then(() => getUsuarios())
      .catch((e) => alert(e?.response?.data?.message || e.message));
  };

  const columns: GridColDef<(typeof usuarios)[number]>[] = [
    {
      field: "usuario",
      headerName: "Usuario",
      width: 170,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 700, color: "var(--cya-dark)" }}>{params.value}</Typography>
      ),
    },
    {
      field: "nombreCompleto",
      headerName: "Nombre completo",
      width: 190,
      headerAlign: "center",
      valueGetter: (_value, row) => [row.nombres, row.apellidos].filter(Boolean).join(" "),
      renderCell: (params) => params.value || "—",
    },
    {
      field: "correo",
      headerName: "Correo",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      renderCell: (params) => params.value || "—",
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => params.value || "—",
    },
    {
      field: "fecha_registro",
      headerName: "Fecha de registro",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString("es-PE") : "—",
    },
    {
      field: "rol",
      headerName: "Rol",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip label={params.value} color={ROL_COLOR[params.value] || "default"} size="small" />
      ),
    },
    {
      field: "activo",
      headerName: "Estado",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip label={params.value ? "Activo" : "Inactivo"} color={params.value ? "success" : "default"} size="small" />
      ),
    },
    {
      field: "view",
      headerName: "Opción",
      width: 100,
      sortable: false,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const esUnoMismo = params.row.usuario === usuarioActual;
        return (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Editar">
              <IconButton
                className="cya-icon-edit"
                size="small"
                onClick={() => {
                  setUsuarioSeleccionado(params.row);
                  setOpenModalEdit(true);
                }}
              >
                <DriveFileRenameOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={esUnoMismo ? "No puedes desactivar tu propia cuenta" : params.row.activo ? "Desactivar" : "Activar"}>
              <span>
                <IconButton
                  size="small"
                  disabled={esUnoMismo}
                  sx={{
                    background: params.row.activo ? "rgba(250, 92, 124, 0.10)" : "rgba(10, 207, 151, 0.10)",
                    color: params.row.activo ? "#fa5c7c" : "#0acf97",
                  }}
                  onClick={() => cambiarEstado(params.row)}
                >
                  {params.row.activo ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const modalSx = { display: "flex", alignItems: "center", justifyContent: "center", p: 2 };
  const modalBoxSx = {
    width: "min(500px, 92vw)",
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
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grow in={openModal} timeout={280}>
        <Box sx={modalBoxSx}>
          <Agregar setOpenModal={setOpenModal} getUsuarios={() => getUsuarios()} />
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
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grow in={openModalEdit} timeout={280}>
        <Box sx={modalBoxSx}>
          <Editar
            setOpenModalEdit={setOpenModalEdit}
            usuarioSeleccionado={usuarioSeleccionado}
            getUsuarios={() => getUsuarios()}
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={usuarios ? usuarios.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={usuarios}
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
                    getRowId={(row) => row.iduser}
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
