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
import FactCheckIcon from "@mui/icons-material/FactCheck";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";

export default function Entrevista() {
  const [entrevistas, setEntrevistas] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [identrevista, setIdentrevista] = React.useState<any>("");

  const getEntrevistas = async () => {
    const url = baseurl + "entrevistas/list";
    await axios
      .post(url, {})
      .then((response) => {
        const { data } = response.data;
        setEntrevistas(data);
      })
      .catch(() => setEntrevistas([]));
  };

  React.useEffect(() => {
    getEntrevistas();
  }, []);

  const columns: GridColDef<(typeof entrevistas)[number]>[] = [
    {
      field: "adoptante",
      headerName: "Postulante",
      width: 190,
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? `${params.value.Nombre} ${params.value.Apellido}` : "",
    },
    {
      field: "animal",
      headerName: "Colita",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value?.nombre || "",
    },
    {
      field: "Fecha_Entrevista",
      headerName: "Fecha",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => moment(params.value).format("DD-MM-YYYY"),
    },
    {
      field: "Hora_Entrevista",
      headerName: "Hora",
      width: 90,
      align: "center",
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
        <Chip
          label={params.value === "realizada" ? "Realizada" : "Pendiente"}
          color={params.value === "realizada" ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      field: "Cumple_Requisitos",
      headerName: "Cumple requisitos",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? (
          <Chip
            label={params.value}
            color={params.value === "Sí" ? "success" : "error"}
            size="small"
            variant="outlined"
          />
        ) : (
          "—"
        ),
    },
    {
      field: "Observaciones",
      headerName: "Observaciones",
      flex: 1,
      minWidth: 180,
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
        <Tooltip title="Registrar resultado">
          <IconButton
            className="cya-icon-edit"
            size="small"
            onClick={() => {
              setOpenModalEdit(true);
              setIdentrevista(params.row.identrevista);
            }}
          >
            <FactCheckIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const modalSx = { display: "flex", alignItems: "center", justifyContent: "center", p: 2 };
  const modalBoxSx = {
    width: "min(600px, 92vw)",
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
          <Agregar setOpenModal={setOpenModal} getEntrevistas={() => getEntrevistas()} />
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
            identrevista={identrevista}
            getEntrevistas={() => getEntrevistas()}
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={entrevistas ? entrevistas.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={entrevistas}
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
                    getRowId={(row) => row.identrevista}
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
