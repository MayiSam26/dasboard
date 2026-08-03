import { Avatar, Box, Chip, Grid, Grow, IconButton, Modal, Tooltip, Typography } from "@mui/material";
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
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleIcon from "@mui/icons-material/Article";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";
import Delete from "./Components/Modal/Delete";
import { useNavigate } from "react-router-dom";

function buildImgUrl(imagen: string) {
  const cleanBase = baseurl.replace(/\/+$/, "");
  const cleanImg = (imagen || "").replace(/\\/g, "/").replace(/^\/+/, "");
  return `${cleanBase}/${cleanImg}`;
}

export default function Noticias() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    const rol = localStorage.getItem("rol");
    if (rol && rol !== "Administrador") navigate("/panel");
  }, [navigate]);

  const [noticias, setNoticias] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [idNoticia, setIdNoticia] = React.useState<any>("");

  const getNoticias = async () => {
    const url = baseurl + "noticias/list";
    await axios
      .post(url, {})
      .then((response) => {
        const { data } = response.data;
        setNoticias(data);
      })
      .catch(() => setNoticias([]));
  };

  React.useEffect(() => {
    getNoticias();
  }, []);

  const columns: GridColDef<(typeof noticias)[number]>[] = [
    {
      field: "imagen",
      headerName: "Portada",
      width: 90,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Avatar
          src={params.value ? buildImgUrl(params.value) : undefined}
          variant="rounded"
          sx={{ width: 44, height: 44, border: "1px solid var(--cya-border)", bgcolor: "var(--cya-bg-alt)" }}
        >
          <ArticleIcon fontSize="small" sx={{ color: "var(--cya-text-muted)" }} />
        </Avatar>
      ),
    },
    {
      field: "titulo",
      headerName: "Título",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 700, color: "var(--cya-dark)" }}>{params.value}</Typography>
      ),
    },
    {
      field: "Estado",
      headerName: "Estado",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Publicado" ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "fecha_publicacion",
      headerName: "Fecha publicación",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.value ? moment(params.value).format("DD-MM-YYYY") : "—"),
    },
    {
      field: "view",
      headerName: "Opción",
      width: 100,
      sortable: false,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Editar">
            <IconButton
              className="cya-icon-edit"
              size="small"
              onClick={() => {
                setIdNoticia(params.row.idnoticia);
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
                setIdNoticia(params.row.idnoticia);
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
          <Agregar setOpenModal={setOpenModal} getNoticias={() => getNoticias()} />
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
          <Editar setOpenModalEdit={setOpenModalEdit} idNoticia={idNoticia} getNoticias={() => getNoticias()} />
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
          <Delete setOpenModalDelete={setOpenModalDelete} idNoticia={idNoticia} getNoticias={() => getNoticias()} />
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={noticias ? noticias.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={noticias}
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
                    getRowId={(row) => row.idnoticia}
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
