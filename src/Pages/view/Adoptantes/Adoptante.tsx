import { Box, Grid, Modal } from "@mui/material";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import Body from "../../components/Layout/Body";
import HeaderBox from "./Components/HeaderBox";
import baseurl from "../../../Config/axios";
import axios from "axios";
import React, { useEffect } from "react";
import moment from "moment";
import EventIcon from "@mui/icons-material/Event";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";
import Search from "./Components/Search";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";

export default function Adoptante() {
  const [adoptante, setAdoptante] = React.useState<any>([]);

  const [busquedNombre, setBusquedNombre] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [idadoptante, setIdAdoptante] = React.useState<any>("");
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);

  const getAdoptante = async () => {
    const body = { search: "", fechaBusqueda: null };
    const url = baseurl + "adoptante/list";
    await axios.post(url,body).then((response) => {
      const { data } = response;
      setAdoptante(data.data);
    });
  };

  React.useEffect(() => {
    getAdoptante();
  }, []);

  const handleBusqueda = (value: any) => {
    setBusquedNombre(value);
  };
  const handleDateTo = (value: any) => {
    setDateTo(moment(value).format("YYYY-MM-DD"));
  };

  useEffect(() =>{
    if(busquedNombre === ""){
      getAdoptante()
    }
  },[busquedNombre])
  const handleSearch = async() =>{
    const fechaBusqueda: Date | null = dateTo === 'Invalid date' ? null : dateTo;

    const body = {
      search: busquedNombre?? '',
      fechaBusqueda: fechaBusqueda,
    }

    const url = baseurl + "adoptante/list";
    await axios.post(url,body).then((response) => {
      const { data } = response;
      setAdoptante(data.data);
    });
  }

  const columns: GridColDef<(typeof adoptante)[number]>[] = [
    {
      field: "Nombre",
      headerName: "Nombre",
      width: 180,
      editable: true,
    },
    {
      field: "Apellido",
      headerName: "Apellido",
      width: 180,
      editable: true,
    },
    {
      field: "Fecha_Registro",
      headerName: "Fecha Registro",
      width: 150,
      editable: true,
      renderCell: (params) => (
        <>
          {moment(params.value).format("DD-MM-YYYY")} <EventIcon />
        </>
      ),
    },
    {
      field: "Dni",
      headerName: "DNI",
      width: 130,
      editable: true,
    },
    {
      field: "telefono",
      headerName: "Telefono / Celular",
      width: 160,
      editable: true,
    },
    {
      field: "Direccion",
      headerName: "Direccion",
      width: 200,
      editable: true,
    },
    {
      field: "Motivo",
      headerName: "Motivo",
      width: 250,
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
            setIdAdoptante(params.row.idadoptante);
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
            getAdoptante={() => getAdoptante()}
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
                    idadoptante={idadoptante}
                    getAdoptante={() =>getAdoptante()}
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
              <Search
                  handleBusqueda={(value: any) => handleBusqueda(value)}
                  handleSearch={() => handleSearch()}
                  handleDateTo={(value: any) => handleDateTo(value)}
                />
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={adoptante}
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
                    getRowId={(row) => row.idadoptante}
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
