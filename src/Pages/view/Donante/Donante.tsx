import { Box, Chip, Grid, Grow, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import HeaderBox from "./Components/HeaderBox";
import baseurl from "../../../Config/axios";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import BlockIcon from "@mui/icons-material/Block";
import React, { useEffect } from "react";
import moment from "moment";
import Header from "../../components/Header";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";
import Search from "./Components/Search";
import { soloDigitos, dniValido, rucValido, LARGO_DNI, LARGO_RUC } from "../../../utils/campos";

const SOCIAL_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  Facebook: { icon: <FacebookIcon fontSize="small" />, color: "#3b5998" },
  Instagram: { icon: <InstagramIcon fontSize="small" />, color: "#C13584" },
  Tiktok: { icon: <MusicNoteIcon fontSize="small" />, color: "#000000" },
  WhatsApp: { icon: <WhatsAppIcon fontSize="small" />, color: "#25D366" },
  Ninguno: { icon: <BlockIcon fontSize="small" />, color: "#9e9e9e" },
};

export default function Donante() {
  const [donante, setDonante] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [idDonante, setIdDonante] = React.useState<any>("");
  const [busqueda, setBusqueda] = React.useState<string>("");

  const [fullname, setFullname] = React.useState<string>("");
  const [redsocial, setRedsocial] = React.useState<string>("");
  const [idtipopersona, setIdtipopersona] = React.useState<string>("");
  const [ruc, setRuc] = React.useState<string>("");
  const [dni, setDni] = React.useState<string>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getDonante = async () => {
    const url = baseurl + "donante/list";
    await axios
      .get(url)
      .then((response) => {
        const { data } = response;
        setDonante(data.data);
      })
      .catch(() => setDonante([]));
  };

  useEffect(() => {
    if (idDonante) {
      getEditDonante(idDonante);
    }
  }, [idDonante]);

  const getEditDonante = async (idDonante: any) => {
    const url = baseurl + "donante/detail/" + idDonante;
    await axios
      .get(url)
      .then((response) => {
        const { data } = response;

        setFullname(data.data.fullname);
        setRedsocial(data.data.redsocial);
        setIdtipopersona(String(data.data.idtipopersona));
        setRuc(data.data.Ruc);
        setDni(data.data.Dni);
      })
      .catch((e) => console.log(e.message));
  };

  const changeEditDonante = async () => {
    if (!dniValido(dni)) {
      setSeverity("warning");
      setMssg("El DNI debe tener 8 dígitos numéricos.");
      setOpenAlert(true);
      return;
    }
    if (!rucValido(ruc)) {
      setSeverity("warning");
      setMssg("El RUC debe tener 11 dígitos numéricos.");
      setOpenAlert(true);
      return;
    }

    const body = {
      idtipopersona: idtipopersona,
      fullname: fullname,
      redsocial: redsocial,
      Ruc: ruc,
      Dni: dni,
    };

    const url = baseurl + "donante/update/" + idDonante;

    try {
      const response = await axios.put(url, body);
      const { data } = response;

      if (data.code === "000") {
        setSeverity("success");
        setMssg(data.message);
        setOpenAlert(true);

        setTimeout(() => {
          setOpenModalEdit(false);
          setOpenAlert(false);
          getDonante();
        }, 1800);
      } else {
        setSeverity("error");
        setMssg(data.message);
        setOpenAlert(true);
      }
    } catch (error: any) {
      setSeverity("error");
      setMssg(error?.message || "Error al actualizar el donante");
      setOpenAlert(true);
    }
  };

  const handleFullname = (value: string) => setFullname(value);
  const handleRedsocial = (value: string) => setRedsocial(value);
  const handleIdtipopersona = (value: string) => setIdtipopersona(value);
  // Documentos de Perú: solo dígitos, con el largo exacto de cada uno.
  const handleRuc = (value: string) => setRuc(soloDigitos(value, LARGO_RUC));
  const handleDni = (value: string) => setDni(soloDigitos(value, LARGO_DNI));

  React.useEffect(() => {
    getDonante();
  }, []);

  // El backend no soporta filtros (sp_getdonante() trae todo), así que la
  // búsqueda se hace en el cliente sobre la lista ya cargada.
  const donanteFiltrado = React.useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return donante;
    return (donante || []).filter((d: any) =>
      [d.fullname, d.Ruc, d.Dni].some((campo) => (campo || "").toString().toLowerCase().includes(texto))
    );
  }, [donante, busqueda]);

  const columns: GridColDef<(typeof donante)[number]>[] = [
    { field: "fullname", headerName: "Nombre Completo", width: 180, headerAlign: "center" },
    {
      field: "redsocial",
      headerName: "Red Social",
      width: 130,
      resizable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const social = SOCIAL_ICONS[params.value] || SOCIAL_ICONS["Ninguno"];
        return (
          <Tooltip title={params.value || "Ninguno"}>
            <Box component="span" sx={{ display: "inline-flex", verticalAlign: "middle", color: social.color }}>
              {social.icon}
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: "persona",
      headerName: "Tipo Persona",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value?.nombre}
          size="small"
          color={params.value?.nombre?.toLowerCase().includes("jurid") ? "info" : "default"}
          variant={params.value?.nombre?.toLowerCase().includes("jurid") ? "filled" : "outlined"}
        />
      ),
    },
    { field: "Ruc", headerName: "RUC", width: 120, align: "center", headerAlign: "center" },
    { field: "Dni", headerName: "DNI", width: 100, align: "center", headerAlign: "center" },
    {
      field: "Fecha_Registro",
      headerName: "Fecha Registro",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => moment(params.value).format("DD-MM-YYYY"),
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
              setIdDonante(params.row.iddonantes);
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
            <Agregar setOpenModal={setOpenModal} getDonante={() => getDonante()} />
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
          setOpenAlert(false);
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
              getDonante={() => getDonante()}
              handleFullname={(value) => handleFullname(value)}
              handleRedsocial={(value) => handleRedsocial(value)}
              handleIdtipopersona={(value) => handleIdtipopersona(value)}
              handleRuc={(value) => handleRuc(value)}
              handleDni={(value) => handleDni(value)}
              changeEditDonante={changeEditDonante}
              severity={severity}
              mssg={mssg}
              openAlert={openAlert}
              fullname={fullname}
              redsocial={redsocial}
              idtipopersona={idtipopersona}
              ruc={ruc}
              dni={dni}
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={donante ? donante.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Search handleBusqueda={(value: any) => setBusqueda(value)} />
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={donanteFiltrado}
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
                    getRowId={(row) => row.iddonantes}
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
