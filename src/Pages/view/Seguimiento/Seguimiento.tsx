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
import CallIcon from "@mui/icons-material/Call";
import HomeIcon from "@mui/icons-material/Home";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";

const TIPO_ICONS: Record<string, React.ReactNode> = {
  Llamada: <CallIcon fontSize="small" />,
  Visita: <HomeIcon fontSize="small" />,
};

export default function Seguimiento() {
  const [seguimientos, setSeguimientos] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [idSeguimiento, setIdSeguimiento] = React.useState<any>("");

  const getSeguimientos = async () => {
    const url = baseurl + "seguimientos/list";
    await axios
      .post(url, {})
      .then((response) => {
        const { data } = response.data;
        setSeguimientos(data);
      })
      .catch(() => setSeguimientos([]));
  };

  React.useEffect(() => {
    getSeguimientos();
  }, []);

  const columns: GridColDef<(typeof seguimientos)[number]>[] = [
    {
      field: "adoptante",
      headerName: "Adoptante",
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
      field: "tipo",
      headerName: "Tipo",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
          {TIPO_ICONS[params.value]}
          {params.value}
        </Box>
      ),
    },
    {
      field: "Fecha_Programada",
      headerName: "Fecha programada",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => moment(params.value).format("DD-MM-YYYY"),
    },
    {
      field: "Estado",
      headerName: "Estado",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value === "realizado" ? "Realizado" : "Pendiente"}
          color={params.value === "realizado" ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      field: "Fecha_Realizado",
      headerName: "Fecha realizado",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.value ? moment(params.value).format("DD-MM-YYYY") : "—"),
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
              setIdSeguimiento(params.row.idseguimiento);
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
          <Agregar setOpenModal={setOpenModal} getSeguimientos={() => getSeguimientos()} />
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
            idSeguimiento={idSeguimiento}
            getSeguimientos={() => getSeguimientos()}
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={seguimientos ? seguimientos.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={seguimientos}
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
                    getRowId={(row) => row.idseguimiento}
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
