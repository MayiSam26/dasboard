import { Box, Chip, Grid, Grow, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import Header from "../../components/Header";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import HeaderBox from "./Components/HeaderBox";
import Search from "./Components/Search";
import React from "react";
import baseurl from "../../../Config/axios";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplayIcon from "@mui/icons-material/Replay";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";
import Delete from "./Components/Modal/Delete";
import { useNavigate } from "react-router-dom";

const TIPO_COLOR: Record<string, "primary" | "secondary" | "info" | "warning" | "success"> = {
  Diagnóstico: "info",
  Vacuna: "success",
  Tratamiento: "warning",
  Esterilización: "secondary",
  "Control médico": "primary",
};

export default function Veterinaria() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    const rol = localStorage.getItem("rol");
    if (!rol || rol === "Administrador") return;
    axios
      .get(baseurl + "permisos/mios")
      .then((response) => {
        const secciones: string[] = response.data.data || [];
        if (!secciones.includes("veterinaria")) navigate("/panel");
      })
      .catch(() => {}); // fail-open: si falla la consulta no bloqueamos el acceso
  }, [navigate]);

  const [registros, setRegistros] = React.useState<any>([]);
  const [busqueda, setBusqueda] = React.useState("");
  const [tipoFiltro, setTipoFiltro] = React.useState("");
  const [desde, setDesde] = React.useState("");
  const [hasta, setHasta] = React.useState("");
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [idRegistro, setIdRegistro] = React.useState<any>("");

  const getRegistros = React.useCallback(async () => {
    // Rango invertido: no consultamos, el Search ya avisa del error.
    if (desde && hasta && desde > hasta) return;
    const url = baseurl + "veterinaria/list";
    await axios
      .post(url, {
        search: busqueda || "",
        tipo: tipoFiltro || null,
        desde: desde || null,
        hasta: hasta || null,
      })
      .then((response) => {
        const { data } = response.data;
        setRegistros(data);
      })
      .catch(() => setRegistros([]));
  }, [busqueda, tipoFiltro, desde, hasta]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setTipoFiltro("");
    setDesde("");
    setHasta("");
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      getRegistros();
    }, 350);
    return () => clearTimeout(timer);
  }, [getRegistros]);

  const cambiarEstado = async (row: any) => {
    const nuevoEstado = row.Estado === "Realizado" ? "Pendiente" : "Realizado";
    const url = baseurl + "veterinaria/estado/" + row.idveterinaria;
    await axios
      .put(url, { Estado: nuevoEstado })
      .then(() => getRegistros())
      .catch((e) => alert(e?.response?.data?.message || e.message));
  };

  const columns: GridColDef<(typeof registros)[number]>[] = [
    {
      field: "animal",
      headerName: "Mascota",
      width: 160,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 700, color: "var(--cya-dark)" }}>{params.value?.nombre || ""}</Typography>
      ),
    },
    {
      field: "tipo",
      headerName: "Tipo",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip label={params.value} color={TIPO_COLOR[params.value] || "default"} size="small" />
      ),
    },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => moment(params.value).format("DD-MM-YYYY"),
    },
    {
      field: "proxima_fecha",
      headerName: "Próximo control",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!params.value) return "—";
        if (params.row.Estado === "Realizado") {
          return (
            <Chip
              label={`✓ ${moment(params.value).format("DD-MM-YYYY")}`}
              size="small"
              color="success"
              variant="outlined"
            />
          );
        }
        const vencido = moment(params.value).isBefore(moment(), "day");
        return (
          <Chip
            label={moment(params.value).format("DD-MM-YYYY")}
            size="small"
            color={vencido ? "error" : "warning"}
            variant="outlined"
          />
        );
      },
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.observaciones || ""}>
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
      width: 130,
      sortable: false,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {params.row.proxima_fecha && (
            <Tooltip title={params.row.Estado === "Realizado" ? "Volver a marcar como pendiente" : "Marcar como realizado"}>
              <IconButton
                size="small"
                sx={{
                  background: params.row.Estado === "Realizado" ? "rgba(184, 92, 0, 0.10)" : "rgba(10, 207, 151, 0.10)",
                  color: params.row.Estado === "Realizado" ? "#b85c00" : "#0acf97",
                }}
                onClick={() => cambiarEstado(params.row)}
              >
                {params.row.Estado === "Realizado" ? <ReplayIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Editar">
            <IconButton
              className="cya-icon-edit"
              size="small"
              onClick={() => {
                setIdRegistro(params.row.idveterinaria);
                setOpenModalEdit(true);
              }}
            >
              <DriveFileRenameOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              sx={{ background: "rgba(250, 92, 124, 0.10)", color: "#fa5c7c" }}
              onClick={() => {
                setIdRegistro(params.row.idveterinaria);
                setOpenModalDelete(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const modalSx = { display: "flex", alignItems: "center", justifyContent: "center", p: 2 };
  const modalBoxSx = {
    width: "min(650px, 92vw)",
    maxHeight: "90vh",
    overflowY: "auto",
    overflowX: "hidden",
    bgcolor: "background.paper",
    borderRadius: "var(--cya-radius-lg)",
    boxShadow: "0 25px 60px rgba(36, 40, 44, 0.35)",
    outline: "none",
  };
  const modalBoxSxSmall = { ...modalBoxSx, width: "min(420px, 92vw)" };

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
          <Agregar setOpenModal={setOpenModal} getRegistros={() => getRegistros()} />
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
          <Editar setOpenModalEdit={setOpenModalEdit} idRegistro={idRegistro} getRegistros={() => getRegistros()} />
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
        <Box sx={modalBoxSxSmall}>
          <Delete setOpenModalDelete={setOpenModalDelete} idRegistro={idRegistro} getRegistros={() => getRegistros()} />
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={registros ? registros.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Search
                  busqueda={busqueda}
                  tipoFiltro={tipoFiltro}
                  desde={desde}
                  hasta={hasta}
                  handleBusqueda={setBusqueda}
                  handleTipoFiltro={setTipoFiltro}
                  handleDesde={setDesde}
                  handleHasta={setHasta}
                  handleLimpiar={limpiarFiltros}
                />
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={registros}
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
                    getRowId={(row) => row.idveterinaria}
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
