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
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { TbCat, TbDog } from "react-icons/tb";
import Search from "./Components/Search";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";
import Delete from "./Components/Modal/Delete";

// react-icons + los tipos de React 18 no siempre coinciden en el tipo de
// retorno (ReactNode vs JSX.Element); se castean una sola vez acá.
const CatIcon = TbCat as React.FC<{ size?: number; color?: string }>;
const DogIcon = TbDog as React.FC<{ size?: number; color?: string }>;

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

export default function Perdidos() {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [idperdido, setIdperdido] = React.useState<any>("");
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [perdidos, setPerdidos] = React.useState<any>([]);
  const [busquedaNombre, setBusquedNombre] = React.useState<any>("");
  const [tipoAnimal, setTipoAnimal] = React.useState<any>("");
  const [genero, setGenero] = React.useState<any>("");
  const [status, setStatus] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");

  const getPerdidos = React.useCallback(async () => {
    const body = {
      nombreBusqueda: busquedaNombre || "",
      idTipoAnimalBusqueda: tipoAnimal ? parseInt(tipoAnimal) : null,
      idGeneroBusqueda: genero ? parseInt(genero) : null,
      statusBusqueda: status || null,
      fechaBusqueda: dateTo || null,
    };
    const url = baseurl + "perdidos/list";
    await axios
      .post(url, body)
      .then((response) => {
        const { data } = response;
        setPerdidos(data.data);
      })
      .catch(() => {
        // Si el filtro manda algo raro (o el servidor falla), no tumbamos
        // la app: mostramos "sin resultados" en vez de un error visible.
        setPerdidos([]);
      });
  }, [busquedaNombre, tipoAnimal, genero, status, dateTo]);

  // Búsqueda automática: se dispara sola cuando cambia cualquier filtro,
  // con una pequeña espera para no disparar una petición por cada tecla.
  React.useEffect(() => {
    const timer = setTimeout(() => {
      getPerdidos();
    }, 350);
    return () => clearTimeout(timer);
  }, [getPerdidos]);

  const handleBusqueda = (value: any) => {
    setBusquedNombre(value);
  };

  const handleTipoAnimal = (value: any) => {
    setTipoAnimal(value);
  };

  const handleGenero = (value: any) => {
    setGenero(value);
  };
  const handleStatus = (value: any) => {
    setStatus(value);
  };

  const handleDateTo = (value: any) => {
    // Mientras se escribe un input type="date" a mano, el navegador puede
    // disparar onChange con años a medio completar (ej. "0020-04-14").
    // Solo aceptamos la fecha si viene completa y es un año razonable.
    const parsed = moment(value, "YYYY-MM-DD", true);
    if (!parsed.isValid() || parsed.year() < 1900 || parsed.year() > 2100) {
      setDateTo("");
      return;
    }
    setDateTo(parsed.format("YYYY-MM-DD"));
  };

  const handleClearFilters = () => {
    setBusquedNombre("");
    setTipoAnimal("");
    setGenero("");
    setStatus("");
    setDateTo("");
  };

  const columns: GridColDef<(typeof perdidos)[number]>[] = [
    {
      field: "Nombre",
      headerName: "Colitas",
      width: 180,
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AnimalPhoto key={params.row.foto} src={buildImgUrl(params.row.foto)} alt={params.row.Nombre} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.Nombre}
          </Typography>
        </Box>
      ),
    },
    {
      field: "Edad",
      headerName: "Edad",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value || "—",
    },
    { field: "tamano", headerName: "Tamaño", width: 100, align: "center", headerAlign: "center" },
    {
      field: "genero",
      headerName: "Genero",
      width: 90,
      resizable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const desc: string = params.value?.descripcion || "";
        const isMacho = desc.toLowerCase().includes("macho");
        return (
          <Tooltip title={desc}>
            {isMacho ? (
              <MaleIcon sx={{ color: "#4A90D9" }} fontSize="small" />
            ) : (
              <FemaleIcon sx={{ color: "#D96BAA" }} fontSize="small" />
            )}
          </Tooltip>
        );
      },
    },
    {
      field: "tipo",
      headerName: "Tipo",
      width: 70,
      resizable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const desc: string = params.value?.descripcion || "";
        const isGato = desc.toLowerCase().includes("gato");
        return (
          <Tooltip title={desc}>
            <Box component="span" sx={{ display: "inline-flex", verticalAlign: "middle" }}>
              {isGato ? (
                <CatIcon size={20} color="var(--cya-primary)" />
              ) : (
                <DogIcon size={20} color="var(--cya-secondary-dark)" />
              )}
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: "dueno",
      headerName: "Dueño",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value?.nombre,
    },
    {
      field: "status",
      headerName: "Estado",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value === "P" ? "Perdido" : "Encontrado"}
          color={params.value === "P" ? "error" : "success"}
          size="small"
        />
      ),
    },
    {
      field: "Fecha_Extravio",
      headerName: "Fecha Extravío",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => moment(params.value).format("DD-MM-YYYY"),
    },
    {
      field: "Observaciones",
      headerName: "Observaciones",
      flex: 1,
      minWidth: 160,
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
                setIdperdido(params.row.idmascotaperdida);
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
                setIdperdido(params.row.idmascotaperdida);
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
            <Agregar setOpenModal={setOpenModal} getPerdidos={() => getPerdidos()} />
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
      >
        <Grow in={openModalEdit} timeout={280}>
          <Box sx={modalBoxSx}>
            <Editar setOpenModalEdit={setOpenModalEdit} idperdido={idperdido} getPerdidos={() => getPerdidos()} />
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
      >
        <Grow in={openModalDelete} timeout={280}>
          <Box sx={{ ...modalBoxSx, width: "min(420px, 92vw)" }}>
            <Delete setOpenModalDelete={setOpenModalDelete} idperdido={idperdido} getPerdidos={() => getPerdidos()} />
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={perdidos ? perdidos.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Search
                  handleBusqueda={(value: any) => handleBusqueda(value)}
                  handleTipoAnimal={(value: any) => handleTipoAnimal(value)}
                  handleGenero={(value: any) => handleGenero(value)}
                  handleStatus={(value: any) => handleStatus(value)}
                  handleDateTo={(value: any) => handleDateTo(value)}
                  onClear={handleClearFilters}
                />
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={perdidos}
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
                    getRowId={(row) => row.idmascotaperdida}
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
