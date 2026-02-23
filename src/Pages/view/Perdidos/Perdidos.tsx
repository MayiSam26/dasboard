import { Box, Grid, Modal, Typography } from "@mui/material";
import Header from "../../components/Header";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import HeaderBox from "./Components/HeaderBox";

import React, { useEffect } from "react";
import baseurl from "../../../Config/axios";
import axios from "axios";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EventIcon from "@mui/icons-material/Event";
import moment from "moment";
import Search from "./Components/Search";
import Agregar from "./Components/Modal/Agregar";

export default function Perdidos() {
  
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [iddueno, setIdIddueno] = React.useState<any>("");
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [perdidos, setPerdidos] = React.useState<any>("");
  const [busquedaNombre, setBusquedNombre] = React.useState<any>("")
  const [tipoAnimal, setTipoAnimal] = React.useState<any>("")
  const [genero, setGenero] = React.useState<any>("")
  const [status, setStatus] = React.useState<any>("")
  const [dateTo, setDateTo] = React.useState<any>("")

  const getPerdidos = async () => {
    const body ={
        nombreBusqueda:'',
        idTipoAnimalBusqueda:null,
        idGeneroBusqueda:null,
        statusBusqueda:null,
        fechaBusqueda:null
      }
    const url = baseurl + "perdidos/list";
    await axios.post(url,body).then((response) => {
      const { data } = response;
      setPerdidos(data.data);
    });
  };

  React.useEffect(() => {
    getPerdidos();
  }, []);

  const handleBusqueda = (value:any) =>{
    setBusquedNombre(value)
  }

  const handleTipoAnimal = (value:any) =>{
    setTipoAnimal(value)
  }
  
  const handleGenero = (value:any) =>{
    setGenero(value)
  }
  const handleStatus = (value:any) =>{
    setStatus(value)
  }

  const handleDateTo = (value:any) =>{
    setDateTo(moment(value).format('YYYY-MM-DD'))
  }

  const handleSearch = async() =>{
    const fechaBusqueda: Date | null = dateTo === 'Invalid date' ? null : dateTo;

    const body ={
        nombreBusqueda:busquedaNombre?? "",
        idTipoAnimalBusqueda:tipoAnimal?parseInt(tipoAnimal):null,
        idGeneroBusqueda:genero?parseInt(genero):null,
        statusBusqueda:status?status:null,
        fechaBusqueda:fechaBusqueda
      }
    const url = baseurl + "perdidos/list";
    await axios.post(url,body).then((response) => {
      const { data } = response;
      setPerdidos(data.data);
    });
  }

   useEffect(() =>{
        if(busquedaNombre === ""){
            getPerdidos()
        }
   },[busquedaNombre])
  const columns: GridColDef<(typeof perdidos)[number]>[] = [
    {
      field: "Nombre",
      headerName: "Colitas",
      width: 150,
      editable: true,
    },
    {
      field: "Edad",
      headerName: "Edad",
      width: 150,
      editable: true,
      renderCell: (params) => <>{params.value + " años"}</>,
    },
    {
      field: "tamano",
      headerName: "Tamano",
      width: 150,
      editable: true,
    },
    {
      field: "genero",
      headerName: "Genero",
      width: 150,
      editable: true,
      renderCell: (params) => <>{params.value.descripcion}</>,
    },
    {
      field: "tipo",
      headerName: "tipo",
      width: 80,
      editable: true,
      renderCell: (params) => <>{params.value.descripcion}</>,
    },
    {
      field: "dueno",
      headerName: "Dueño",
      width: 150,
      editable: true,
      renderCell: (params) => <>{params.value.nombre}</>,
    },
    {
      field: "status",
      headerName: "Estado",
      width: 150,
      editable: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              background: "transparent",
              width: "100%",
              textAlign: "center",
              border: "1px #c2c2c2 solid",
              borderRadius: "20px",
              px: 1,
            }}
          >
            {params.value == 'P'? 'Perdido':'Encontrado'}
          </Typography>
        </Box>
      ),
    },
    {
      field: "Fecha_Extravio",
      headerName: "Fecha Extravio",
      width: 150,
      editable: true,
      renderCell: (params) => (
        <>
          {moment(params.value).format("L")} <EventIcon />
        </>
      ),
    },
    {
      field: "Observaciones",
      headerName: "Observaciones",
      width: 150,
      editable: true,
    },
    {
      field: "view",
      headerName: "Editar",
      width: 100,
      editable: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <DriveFileRenameOutlineIcon
          onClick={() => {
            setOpenModalEdit(true);
            setIdIddueno(params.row.idmascotaperdida);
          }}
          sx={{ textAlign: "center", cursor: "pointer" }}
        />
      ),
    },
    {
      field: "detele",
      headerName: "Eliminar",
      width: 100,
      editable: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <DeleteIcon
          color="error"
          onClick={() => {
            setOpenModalDelete(true);
            setIdIddueno(params.row.idmascotaperdida);
          }}
          sx={{ textAlign: "center", cursor: "pointer" }}
        />
      ),
    },
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
            getPerdidos={() => getPerdidos()}
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
                <HeaderBox setOpenModal={() => setOpenModal(true)} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Search
                  handleBusqueda={(value: any) => handleBusqueda(value)}
                  handleTipoAnimal={(value: any) => handleTipoAnimal(value)}
                  handleGenero={(value: any) => handleGenero(value)}
                  handleSearch={() => handleSearch()}
                  handleStatus={(value: any) => handleStatus(value)}
                  handleDateTo={(value: any) => handleDateTo(value)}
                />
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={perdidos}
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
                    getRowId={(row) => row.idmascotaperdida}
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
