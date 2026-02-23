import { Box, Grid, Modal, Typography } from "@mui/material";
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
import Search from "./Components/Search";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";

export default function Adopcion() {
  const [adopciones, setAdopciones] = React.useState<any>([]);

  const [busqueda, setBusquedNombre] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");
  const [reporte, setReporte] = React.useState<any>([]);
  
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [idAdopcion, setIdAdopacion] = React.useState<any>("");
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);

  const getAdopciones = async () => {
    const body = {
      fechaBusqueda: null,
      state: ""
    }
    const url = baseurl + "adopciones/list";
    await axios.post(url,body).then((response) => {
      const { data } = response;
      setAdopciones(data.data);
    });
  };

  React.useEffect(() => {
    getAdopciones();
  }, []);
  const handleBusqueda = (value: any) => {
    setBusquedNombre(value);
  };

  const handleDateTo = (value: any) => {
    setDateTo(moment(value).format("YYYY-MM-DD"));
  };

  const handleSearch = async() =>{
    const fechaBusqueda: Date | null = dateTo === 'Invalid date' ? null : dateTo;
    const body = {
      fechaBusqueda: fechaBusqueda,
      state: busqueda?? ''
    }
    const url = baseurl + "adopciones/list";
    await axios.post(url,body).then((response) => {
      const { data } = response;
      setAdopciones(data.data);
    });
  }

  const getReportes = async () => {
    const url = baseurl + "adopciones/list/reporte";
    await axios.post(url).then((response) => {
      const { data } = response;
      setReporte(data.data);
    });
  };

  React.useEffect(() => {
    getReportes();
  }, []);
  const columns: GridColDef<(typeof adopciones)[number]>[] = [
    {
      field: "adoptante",
      headerName: "Adoptante",
      width: 240,
      editable: true,
      renderCell: (params) =>  params.value.Nombre +" "+params.value.Apellido
    },
    {
      field: "animales",
      headerName: "Colita",
      width: 180,
      editable: true,
      renderCell: (params) => params.value.nombre
    },
    {
      field: "Estado",
      headerName: "Estado",
      width: 180,
      editable: true,
      
    },
    {
      field: "Fecha_Adopcion",
      headerName: "Fecha adopcion",
      width: 180,
      editable: true,
      renderCell: (params) => (
        <>
          {moment(params.value).format("DD-MM-YYYY")} <EventIcon />
        </>
      ),
    },
    {
      field: "Observaciones",
      headerName: "Observaciones",
      width: 280,
      editable: true,
    },
    {
      field: "view",
      headerName: "Editar",
      width: 100,
      editable: true,
      align: "center",
      renderCell: (params) => (
        <DriveFileRenameOutlineIcon
          onClick={() => {
            setOpenModalEdit(true);
            setIdAdopacion(params.row.idadopcion);
          }}
          sx={{ textAlign: "center", cursor: "pointer" }}
        />
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
            getAdopciones={() => getAdopciones()}
            getReportes={() => getReportes()}
          />
        </Box>
      </Modal>
    );
  };
  const ModalEditar = () =>{
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    return(
         <Modal
            open={openModalEdit}
            onClose={() => setOpenModalEdit(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Editar 
                    setOpenModalEdit={setOpenModalEdit}
                    idAdopcion={idAdopcion}
                    getAdopciones={() =>getAdopciones()}
                    updates={() => getReportes()}
                />
            </Box>
        </Modal>
    )
  }
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
                    <Typography variant="body1">Cantidad Adopaciones</Typography>
                    <Typography variant="h3" style={{ fontWeight: 700 }}>
                      {item.cantadopci}
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
                    <Typography variant="body1">Proceso</Typography>
                    <Typography variant="h3" style={{ fontWeight: 700 }}>
                      {item.proceso}
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
                    <Typography variant="body1">Adoptado</Typography>
                    <Typography variant="h3" style={{ fontWeight: 700 }}>
                      {item.adoptado}
                    </Typography>
                  </Box>
                ))}
                </Grid>
              </Grid>
                <Search
                   handleBusqueda={(value: any) => handleBusqueda(value)}
                   handleSearch={() => handleSearch()}
                  handleDateTo={(value: any) => handleDateTo(value)}
                />
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={adopciones}
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
                    getRowId={(row) => row.idadopcion}
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
