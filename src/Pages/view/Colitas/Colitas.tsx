import { Box, Grid, Modal } from "@mui/material";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import HeaderBox from "./Components/HeaderBox";
import baseurl from "../../../Config/axios";
import axios from "axios";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import moment from "moment";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EventIcon from "@mui/icons-material/Event";
import Header from "../../components/Header";
import Search from "./Components/Search";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";

export default function Colitas() {
  const [albergados, setAlbergados] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [idAnimal, setIdAnimal] = React.useState<any>("");
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);

  const [busquedaNombre, setBusquedNombre] = React.useState<any>("");
  const [tipoAnimal, setTipoAnimal] = React.useState<any>("");
  const [genero, setGenero] = React.useState<any>("");
  const [tamano, setTamano] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");


 
  const getAlbergados = async () => {
    const body = {
      search: "",
      p_tamano: null,
      p_idtipoanimal: null,
      p_idgenero: null,
      fechaBusqueda: null,
    };
    const url = baseurl + "colitas/list";
    await axios.post(url,body).then((response) => {
      const { data } = response;
      setAlbergados(data.data);
    });
  };

  React.useEffect(() => {
    getAlbergados();
  }, []);

  const columns: GridColDef<(typeof albergados)[number]>[] = [
    {
      field: "nombre",
      headerName: "Nombre",
      width: 120,
      editable: true,
    },
    {
      field: "tamano",
      headerName: "Tamaño",
      width: 130,
      editable: true,
    },
    {
      field: "peso",
      headerName: "Peso",
      width: 100,
      editable: true,
      renderCell: (params) => params.value + " kg",
    },
    {
      field: "Edada_Aprox",
      headerName: "Edad",
      width: 100,
      editable: true,
      renderCell: (params) => params.value + " año(s)",
    },

    {
      field: "Fecha_Ingreso",
      headerName: "Fecha Ingreso",
      width: 150,
      editable: true,
      renderCell: (params) => (
        <>
          {moment(params.value).format("DD-MM-YYYY")} <EventIcon />
        </>
      ),
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 100,
      editable: true,
      align: "center",
    },
    {
      field: "esterelizacion",
      headerName: "Esterelizado",
      width: 100,
      editable: true,
      align: "center",
    },
    {
      field: "tipo_descripcion",
      headerName: "Tipo",
      width: 100,
      editable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => params.value.descripcion
    },
    {
      field: "genero",
      headerName: "Genero",
      width: 100,
      editable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => params.value.descripcion
    },
    {
      field: "foto",
      headerName: "Foto",
      width: 100,
      editable: true,
      renderCell: (params) => {
        return (
          <img
            src={`${baseurl}${params.row.foto}`}
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
      field: "observaciones",
      headerName: "Observaciones",
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
            setIdAnimal(params.row.idanimal);
          }}
          sx={{ textAlign: "center", cursor: "pointer" }}
        />
      ),
    }
  ];


  const handleBusqueda = (value: any) => {
    setBusquedNombre(value);
  };

  const handleTipoAnimal = (value: any) => {
    setTipoAnimal(value);
  };

  const handleGenero = (value: any) => {
    setGenero(value);
  };
  const handleTamno = (value: any) => {
    setTamano(value);
  };

  const handleDateTo = (value: any) => {
    setDateTo(moment(value).format("YYYY-MM-DD"));
  };

  const handleSearch = async() =>{
    const fechaBusqueda: Date | null = dateTo === 'Invalid date' ? null : dateTo;

    const body = {
      search: busquedaNombre?? '',
      p_tamano: tamano ?? null,
      p_idtipoanimal: tipoAnimal?parseInt(tipoAnimal):null,
      p_idgenero: genero?parseInt(genero):null,
      fechaBusqueda: fechaBusqueda,
    }

    const url = baseurl + "colitas/list";
    await axios.post(url,body).then((response) => {
      const { data } = response;
      setAlbergados(data.data);
    });
  }

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
            getAlbergados={() => getAlbergados()}
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
                    idAnimal={idAnimal}
                    getAlbergados={() =>getAlbergados()}
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
                <HeaderBox setOpenModal={() => setOpenModal(true)}  />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Search
                  handleBusqueda={(value: any) => handleBusqueda(value)}
                  handleTipoAnimal={(value: any) => handleTipoAnimal(value)}
                  handleGenero={(value: any) => handleGenero(value)}
                  handleSearch={() => handleSearch()}
                  handleTamno={(value: any) => handleTamno(value)}
                  handleDateTo={(value: any) => handleDateTo(value)}
                />
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={albergados}
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
                    getRowId={(row) => row.idanimal}
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
