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
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import PetsIcon from "@mui/icons-material/Pets";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import Search from "./Components/Search";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";
import Delete from "./Components/Modal/Delete";

function buildImgUrl(foto: string) {
  const cleanBase = baseurl.replace(/\/+$/, "");
  const cleanFoto = (foto || "").replace(/\\/g, "/").replace(/^\/+/, "");
  return `${cleanBase}/${cleanFoto}`;
}

function AnimalPhoto({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = React.useState(false);
  if (!src || error) {
    return (
      <Avatar
        variant="rounded"
        sx={{ width: 48, height: 48, borderRadius: "8px", bgcolor: "var(--cya-bg-alt)", color: "var(--cya-primary)" }}
      >
        <PetsIcon fontSize="small" />
      </Avatar>
    );
  }
  return (
    <Avatar
      src={src}
      alt={alt}
      variant="rounded"
      sx={{ width: 48, height: 48, borderRadius: "8px" }}
      onError={() => setError(true)}
    />
  );
}

export default function Apadrinado() {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [idapadrinado, setIdapadrinado] = React.useState<any>("");
  const [apadrinados, setApadrinados] = React.useState<any>([]);
  const [busqueda, setBusqueda] = React.useState<any>("");
  const [tipo, setTipo] = React.useState<any>("");
  const [estado, setEstado] = React.useState<any>("");

  const getApadrinados = React.useCallback(async () => {
    const body = {
      busqueda: busqueda || "",
      tipo_apadrinamiento: tipo || null,
      estado: estado || null,
    };
    const url = baseurl + "apadrinado/list";
    await axios
      .post(url, body)
      .then((response) => {
        const { data } = response;
        setApadrinados(data.data);
      })
      .catch(() => {
        setApadrinados([]);
      });
  }, [busqueda, tipo, estado]);

  // Búsqueda automática con una pequeña espera, mismo patrón que Perdidos.tsx.
  React.useEffect(() => {
    const timer = setTimeout(() => {
      getApadrinados();
    }, 350);
    return () => clearTimeout(timer);
  }, [getApadrinados]);

  const handleClearFilters = () => {
    setBusqueda("");
    setTipo("");
    setEstado("");
  };

  const columns: GridColDef<(typeof apadrinados)[number]>[] = [
    {
      field: "animal",
      headerName: "Animal",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AnimalPhoto
            key={params.value?.foto}
            src={buildImgUrl(params.value?.foto)}
            alt={params.value?.nombre || ""}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {params.value?.nombre || "—"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "padrino_nombre",
      headerName: "Padrino",
      width: 170,
      headerAlign: "center",
      renderCell: (params) => params.value || "—",
    },
    {
      field: "padrino_contacto",
      headerName: "Contacto",
      width: 170,
      headerAlign: "center",
      renderCell: (params) => params.value || "—",
    },
    {
      field: "tipo_apadrinamiento",
      headerName: "Tipo",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Chip label={params.value} size="small" color="secondary" />,
    },
    {
      field: "monto",
      headerName: "Monto",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.value != null ? `S/. ${Number(params.value).toFixed(2)}` : "—"),
    },
    {
      field: "fecha_registro",
      headerName: "Fecha registro",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.value ? moment(params.value).format("DD-MM-YYYY") : "—"),
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === "Activo" ? "success" : "default"} size="small" />
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
                setIdapadrinado(params.row.idapadrinado);
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
                setIdapadrinado(params.row.idapadrinado);
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
          <Agregar setOpenModal={setOpenModal} getApadrinados={() => getApadrinados()} />
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
            idapadrinado={idapadrinado}
            getApadrinados={() => getApadrinados()}
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
            idapadrinado={idapadrinado}
            getApadrinados={() => getApadrinados()}
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={apadrinados ? apadrinados.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Search
                  handleBusqueda={(value: any) => setBusqueda(value)}
                  handleTipo={(value: any) => setTipo(value)}
                  handleEstado={(value: any) => setEstado(value)}
                  onClear={handleClearFilters}
                />
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={apadrinados}
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
                    getRowId={(row) => row.idapadrinado}
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
