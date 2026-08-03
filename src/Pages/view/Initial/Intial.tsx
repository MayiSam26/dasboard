import { Avatar, Box, Grid, Grow, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import Header from "../../components/Header";
import HeaderBox from "../../view/Initial/Compents/HeaderBox";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import baseurl from "../../../Config/axios";
import axios from "axios";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import HomeIcon from "@mui/icons-material/Home";
import Editar from "../../view/Initial/Compents/Modal/Editar";
import { useNavigate } from "react-router-dom";

export default function Intial() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const [redes, setRedes] = React.useState<any>([]);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [flask, setFlask] = React.useState<any>("");
  const [idRefugio, setIdRefugio] = React.useState<any>("");

  const getRedesSocial = async () => {
    const url = baseurl + "home/list";
    await axios
      .get(url)
      .then((response) => {
        const { data } = response;
        setRedes(data.data);
      })
      .catch(() => setRedes([]));
  };

  useEffect(() => {
    getRedesSocial();
  }, []);
  useEffect(() => {
    if (flask === "000") {
      getRedesSocial();
    }
  }, [flask]);

  const columns: GridColDef<(typeof redes)[number]>[] = [
    {
      field: "logo",
      headerName: "Logo",
      width: 90,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Avatar
          src={params.value || undefined}
          variant="rounded"
          sx={{ width: 40, height: 40, border: "1px solid var(--cya-border)", bgcolor: "var(--cya-bg-alt)" }}
        >
          <HomeIcon fontSize="small" sx={{ color: "var(--cya-text-muted)" }} />
        </Avatar>
      ),
    },
    {
      field: "nombre",
      headerName: "Nombre",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 700, color: "var(--cya-dark)" }}>{params.value}</Typography>
      ),
    },
    {
      field: "Descripcion",
      headerName: "Descripción",
      flex: 1,
      minWidth: 220,
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
    { field: "telefono", headerName: "Teléfono", width: 130, align: "center", headerAlign: "center" },
    { field: "correo", headerName: "Correo", width: 200, align: "center", headerAlign: "center" },
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
              setIdRefugio(params.row.idrefugio);
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
    width: "min(600px, 92vw)",
    maxHeight: "90vh",
    overflowY: "auto",
    overflowX: "hidden",
    bgcolor: "background.paper",
    borderRadius: "var(--cya-radius-lg)",
    boxShadow: "0 25px 60px rgba(36, 40, 44, 0.35)",
    outline: "none",
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
              setFlask={setFlask}
              idRefugio={idRefugio}
              getRedesSocial={() => getRedesSocial()}
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
                <HeaderBox count={redes ? redes.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={redes}
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
                    getRowId={(row) => row.idrefugio}
                  />
                </Box>
              </Grid>
            </Grid>
          </Body>
        </Content>
      </Layout>
      {ModalEditar()}
    </>
  );
}
