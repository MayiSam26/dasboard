import { Box, Grid, Grow, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import Header from "../../components/Header";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Navar from "../../components/Navar";
import HeaderBox from "./Components/HeaderBox";
import Layout from "../../components/Layout/Index";
import React, { useEffect } from "react";
import baseurl from "../../../Config/axios";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import Editar from "./Components/Modal/Editar";
import Agregar from "./Components/Modal/Agregar";
import Delete from "./Components/Modal/Delete";
import Search from "./Components/Search";

function SocialCell({ icon, value, color }: { icon: React.ReactNode; value: string; color: string }) {
  if (!value) {
    return <Typography variant="body2" sx={{ color: "var(--cya-text-muted)" }}>—</Typography>;
  }
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, overflow: "hidden" }}>
      <Box sx={{ color, display: "flex" }}>{icon}</Box>
      <Typography
        variant="body2"
        sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function Amo() {
  const [apoderado, setApoderado] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [iddueno, setIdIddueno] = React.useState<any>("");
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [busquedas, setBusqueda] = React.useState<any>("");

  const getApadrinado = React.useCallback(async () => {
    const url = baseurl + "amo/list";
    const body = {
      busqueda: busquedas,
    };
    await axios
      .post(url, body)
      .then((response) => {
        const { data } = response;
        setApoderado(data.data);
      })
      .catch((e) => console.log(e.message));
  }, [busquedas]);

  const handleBusqueda = (value: any) => {
    setBusqueda(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getApadrinado();
    }, 350);
    return () => clearTimeout(timer);
  }, [getApadrinado]);

  const columns: GridColDef<(typeof apoderado)[number]>[] = [
    { field: "nombre", headerName: "Nombre Apoderado", width: 220, headerAlign: "center" },
    {
      field: "facebook",
      headerName: "Facebook",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <SocialCell icon={<FacebookIcon fontSize="small" />} value={params.value} color="#3b5998" />
      ),
    },
    {
      field: "instagram",
      headerName: "Instagram",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <SocialCell icon={<InstagramIcon fontSize="small" />} value={params.value} color="#C13584" />
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
                setOpenModalEdit(true);
                setIdIddueno(params.row.iddueno);
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
                setOpenModalDelete(true);
                setIdIddueno(params.row.iddueno);
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
            <Agregar setOpenModal={setOpenModal} getApadrinado={() => getApadrinado()} />
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
              iddueno={iddueno}
              getApadrinado={() => getApadrinado()}
            />
          </Box>
        </Grow>
      </Modal>
    );
  };

  const ModalDelete = () => {
    return (
      <Modal
        open={openModalDelete}
        onClose={(_e, reason) => {
          if (reason === "backdropClick") return;
          setOpenModalDelete(false);
        }}
        disableEscapeKeyDown
        closeAfterTransition
        sx={modalSx}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grow in={openModalDelete} timeout={280}>
          <Box sx={{ ...modalBoxSx, width: "min(460px, 92vw)" }}>
            <Delete
              setOpenModalDelete={setOpenModalDelete}
              iddueno={iddueno}
              getApadrinado={() => getApadrinado()}
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={apoderado ? apoderado.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Search handleBusqueda={(value: any) => handleBusqueda(value)} />
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={apoderado}
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
                    getRowId={(row) => row.iddueno}
                  />
                </Box>
              </Grid>
            </Grid>
          </Body>
        </Content>
      </Layout>
      {ModalEditar()}
      {ModalAgregar()}
      {ModalDelete()}
    </>
  );
}
