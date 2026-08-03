import { Box, Chip, Grid, Grow, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import Header from "../../components/Header";
import HeaderBox from "./Components/HeaderBox";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import baseurl from "../../../Config/axios";
import axios from "axios";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import LinkIcon from "@mui/icons-material/Link";
import { useNavigate } from "react-router-dom";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";

export default function RedesSocial() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const [redes, setRedes] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [flask, setFlask] = React.useState<any>("");
  const [idRed, setIdRed] = React.useState<any>("");

  const getRedesSocial = async () => {
    const url = baseurl + "redes-social/list";
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
      field: "nombre",
      headerName: "Nombre",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 700, color: "var(--cya-dark)" }}>{params.value}</Typography>
      ),
    },
    {
      field: "icono",
      headerName: "Icono",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? (
          <Chip label={params.value} size="small" variant="outlined" sx={{ fontFamily: "monospace" }} />
        ) : (
          <Typography variant="body2" sx={{ color: "var(--cya-text-muted)" }}>
            —
          </Typography>
        ),
    },
    {
      field: "link",
      headerName: "Enlace",
      flex: 1,
      minWidth: 220,
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? (
          <Box
            component="a"
            href={params.value}
            target="_blank"
            rel="noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
              color: "var(--cya-primary)",
              textDecoration: "none",
              overflow: "hidden",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <LinkIcon fontSize="small" />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {params.value}
            </span>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "var(--cya-text-muted)" }}>
            Sin enlace
          </Typography>
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
              setIdRed(params.row.idredes);
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
            <Agregar setOpenModal={setOpenModal} setFlask={setFlask} />
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
              setFlask={setFlask}
              idRed={idRed}
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
                <HeaderBox setOpenModal={setOpenModal} count={redes ? redes.length : 0} />
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
                    getRowId={(row) => row.idredes}
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
