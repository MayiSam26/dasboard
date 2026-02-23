import { Alert, Box, Button, Grid, Modal, Typography } from "@mui/material";
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
import EventIcon from "@mui/icons-material/Event";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Reporte from "./Components/Modal/Reporte";
import Agregar from "./Components/Modal/Agregar";

export default function Ingresos() {
  const [ingresos, setIngresos] = React.useState<any>([]);
  const [reporte, setReporte] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalReporte, setOpenReporte] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [idIngresos, setIdIngreso] = React.useState<any>("");
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);

  const getIngresos = async () => {
    const url = baseurl + "ingresos/list";
    await axios.get(url).then((response) => {
      const { data } = response;
      console.log(data)
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
      field: "donante",
      headerName: "Donante",
      width: 120,
      editable: true,
      renderCell: (params) => params.value.fullname
        
      
    },
    {
      field: "monto",
      headerName: "Monto",
      width: 130,
      editable: true,
    },
    {
      field: "suministro",
      headerName: "Suministro",
      width: 150,
      editable: true,
    },
    {
      field: "donacion",
      headerName: "Donacion",
      width: 150,
      editable: true,
    },
    {
      field: "pago",
      headerName: "Tipo pago",
      width: 150,
      editable: true,
    },
    {
      field: "evidencia",
      headerName: "Evidencia",
      width: 150,
      editable: true,
      renderCell: (params) => {
              return (
                <img
                  src={`${baseurl}${params.row.evidencia}`}
                  alt="Imagen"
                  style={{
                    objectFit: "cover",
                    backgroundSize: "cover",
                    padding: "5px",
                    width: "100px",
                  }}
                />
              );
            },
    },
    {
      field: "fecha_registro",
      headerName: "Fecha Registro",
      width: 250,
      editable: true,
      renderCell: (params) => (
        <>
          {moment(params.value).format("DD-MM-YYYY")} <EventIcon />
        </>
      ),
    }
  ];

  const ModalAgregar = () => {
    const style = {
      position: "absolute" as "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 700,
      bgcolor: "background.paper",
      border: "2px solid #000",
      boxShadow: 24,
      p: 4,
    };
    return (
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Agregar
            setOpenModal={setOpenModal}
            getIngresos={() => getIngresos()}
            getReportes={() => getReportes()}
          />
        </Box>
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
                <HeaderBox setOpenModal={() => setOpenModal(true)}/>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Alert severity="warning">¡Una vez creado los datos no se podran Modificar o Eliminar!</Alert>
                <Grid container spacing={4}>
                <Grid item xs={12} md={2}>
                {reporte.map((item: any) => (
                  <Box
                    height={80}
                    my={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={4}
                    p={2}
                    px={1}
                    sx={{ border: "1px solid #c2c2c2",width:'100%' }}
                  >
                    <Typography variant="body1">Cantidad Donaciones</Typography>
                    <Typography variant="h3" style={{ fontWeight: 700 }}>
                      {item.cantIngreso}
                    </Typography>
                  </Box>
                ))}
                </Grid>
                <Grid item xs={12} md={2}>
                {reporte.map((item: any) => (
                  <Box
                    height={80}
                    my={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={4}
                    p={2}
                    px={1}
                    sx={{ border: "1px solid #c2c2c2",width:'100%' }}
                  >
                    <Typography variant="body1">Suministro</Typography>
                    <Typography variant="h3" style={{ fontWeight: 700 }}>
                      {item.ninguno}
                    </Typography>
                  </Box>
                ))}
                </Grid>
               
                <Grid item xs={12} md={2}>
                {reporte.map((item: any) => (
                  <Box
                    height={80}
                    my={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={4}
                    p={2}
                    px={1}
                    sx={{ border: "1px solid #c2c2c2",width:'100%' }}
                  >
                    <Typography variant="body1">Tipo Yape</Typography>
                    <Typography variant="h3" style={{ fontWeight: 700 }}>
                      {item.yape}
                    </Typography>
                  </Box>
                ))}
                </Grid>

                <Grid item xs={12} md={2}>
                {reporte.map((item: any) => (
                  <Box
                    height={80}
                    my={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={4}
                    p={2}
                    px={1}
                    sx={{ border: "1px solid #c2c2c2",width:'100%' }}
                  >
                    <Typography variant="body1">Tipo Plin</Typography>
                    <Typography variant="h3" style={{ fontWeight: 700 }}>
                      {item.plin}
                    </Typography>
                  </Box>
                ))}
                </Grid>
                </Grid>
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={ingresos}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 8,
                        },
                      },
                    }}
                    autoHeight
                    pageSizeOptions={[3]}
                    checkboxSelection
                    disableRowSelectionOnClick
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
