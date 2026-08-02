import { Alert, Avatar, Box, Chip, Grid, Typography } from "@mui/material";
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
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PaymentsIcon from "@mui/icons-material/Payments";
import Agregar from "./Components/Modal/Agregar";
import { Modal, Grow } from "@mui/material";

function buildImgUrl(evidencia: string) {
  const cleanBase = baseurl.replace(/\/+$/, "");
  const cleanEvidencia = (evidencia || "").replace(/\\/g, "/").replace(/^\/+/, "");
  return `${cleanBase}/${cleanEvidencia}`;
}

function EvidenciaCell({ src }: { src: string }) {
  const [error, setError] = React.useState(false);
  if (!src || error) {
    return (
      <Avatar
        variant="rounded"
        sx={{ width: 40, height: 40, borderRadius: "8px", bgcolor: "var(--cya-bg-alt)", color: "var(--cya-primary)" }}
      >
        <PaymentsIcon fontSize="small" />
      </Avatar>
    );
  }
  return (
    <Avatar
      src={src}
      variant="rounded"
      sx={{ width: 40, height: 40, borderRadius: "8px" }}
      onError={() => setError(true)}
    />
  );
}

function ReporteCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 2,
        borderRadius: "var(--cya-radius-md)",
        border: "1px solid var(--cya-border)",
        bgcolor: "background.paper",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}1F`,
          color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: "var(--cya-text-muted)" }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
          {value ?? 0}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Ingresos() {
  const [ingresos, setIngresos] = React.useState<any>([]);
  const [reporte, setReporte] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const getIngresos = async () => {
    const url = baseurl + "ingresos/list";
    await axios.get(url).then((response) => {
      const { data } = response;
      setIngresos(data.data);
    });
  };

  const getReportes = async () => {
    const url = baseurl + "ingresos/reporte";
    await axios.post(url).then((response) => {
      const { data } = response;
      setReporte(data.data);
    });
  };

  React.useEffect(() => {
    getIngresos();
    getReportes();
  }, []);

  const columns: GridColDef<(typeof ingresos)[number]>[] = [
    {
      field: "evidencia",
      headerName: "Evidencia",
      width: 80,
      resizable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <EvidenciaCell src={buildImgUrl(params.row.evidencia)} />,
    },
    {
      field: "donante",
      headerName: "Donante",
      width: 160,
      headerAlign: "center",
      renderCell: (params) => params.value?.fullname,
    },
    {
      field: "monto",
      headerName: "Monto (S/)",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "suministro",
      headerName: "Suministro",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "Sí" ? "success" : "default"}
          variant={params.value === "Sí" ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "donacion",
      headerName: "Donación",
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const v = (params.value || "").toLowerCase();
        const color = v === "monetaria" ? "success" : v === "comida" ? "warning" : "default";
        return <Chip label={params.value} size="small" color={color as any} />;
      },
    },
    {
      field: "pago",
      headerName: "Tipo pago",
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const v = (params.value || "").toLowerCase();
        const color = v === "yape" || v === "plin" ? "info" : v === "tarjeta" ? "secondary" : "default";
        return <Chip label={params.value} size="small" color={color as any} />;
      },
    },
    {
      field: "fecha_registro",
      headerName: "Fecha Registro",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => moment(params.value).format("DD-MM-YYYY"),
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
            <Agregar
              setOpenModal={setOpenModal}
              getIngresos={() => getIngresos()}
              getReportes={() => getReportes()}
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} count={ingresos ? ingresos.length : 0} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Alert severity="warning" sx={{ mb: 2, borderRadius: "var(--cya-radius-md)" }}>
                  ¡Una vez creado los datos no se podrán modificar o eliminar!
                </Alert>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {reporte.map((item: any, idx: number) => (
                    <React.Fragment key={idx}>
                      <Grid item xs={12} sm={6} md={3}>
                        <ReporteCard
                          icon={<VolunteerActivismIcon />}
                          label="Cantidad Donaciones"
                          value={item.cantIngreso}
                          color="#E4602F"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <ReporteCard
                          icon={<HourglassBottomIcon />}
                          label="Suministro"
                          value={item.ninguno}
                          color="#C99A2E"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <ReporteCard
                          icon={<PhoneIphoneIcon />}
                          label="Tipo Yape"
                          value={item.yape}
                          color="#3F9E5C"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <ReporteCard
                          icon={<PhoneIphoneIcon />}
                          label="Tipo Plin"
                          value={item.plin}
                          color="#2F7D46"
                        />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
                <Box sx={{ width: "100%" }} className="cya-table-card">
                  <DataGrid
                    rows={ingresos}
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
                    getRowId={(row) => row.idtblingreso}
                  />
                </Box>
              </Grid>
            </Grid>
          </Body>
        </Content>
      </Layout>
      {ModalAgregar()}
    </>
  );
}
