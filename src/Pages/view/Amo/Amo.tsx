import { Box, Grid, Modal, Paper } from "@mui/material";
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
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline"
import DeleteIcon from "@mui/icons-material/Delete";
import Editar from "./Components/Modal/Editar";
import Agregar from "./Components/Modal/Agregar";
import Delete from "./Components/Modal/Delete";
import Search from "./Components/Search";
export default function Amo() {
    const[apoderado,setApoderado] = React.useState<any>([])
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
    const [iddueno, setIdIddueno] = React.useState<any>("");
    const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
    const [busquedas, setBusqueda] = React.useState<any>("");

    const getApadrinado = async () => {
        const url = baseurl + "amo/list";
        const body ={
          busqueda:''
        }
        await axios.post(url,body).then((response) => {
          const { data } = response;
          setApoderado(data.data);
        });
      };
    const handleBusqueda = (value:any) =>{
      setBusqueda(value)
    }

    useEffect(() =>{
      if(busquedas === ''){
        getApadrinado()
      }
    },[busquedas])
    
    React.useEffect(() => {
        getApadrinado();
      }, []);

      const handleSearch = async() =>{
        const url = baseurl + "amo/list";
        const body ={
          busqueda:busquedas
        }
        await axios.post(url,body).then((response) => {
          const { data } = response;
          setApoderado(data.data);
        }).catch(e => console.log(e.message));
      }
      
      const columns: GridColDef<(typeof apoderado)[number]>[] = [
        {
          field: "nombre",
          headerName: "Nombre Apoderado",
          width: 180,
          editable: true,
        },
        {
          field: "facebook",
          headerName: "Facebook",
          width: 300,
          editable: true,
        },
        {
            field: "instagram",
            headerName: "Instagram",
            width: 300,
            editable: true,
        }, 
        {
          field: "view",
          headerName: "Editar",
          width: 150,
          editable: true,
          align: "center",
          headerAlign:"center",
          renderCell: (params) => (
            <DriveFileRenameOutlineIcon
              onClick={() => {
                setOpenModalEdit(true);
                setIdIddueno(params.row.iddueno);
              }}
              sx={{ textAlign: "center", cursor: "pointer" }}
            />
          ),
        },
        {
          field: "detele",
          headerName: "Eliminar",
          width: 150,
          editable: true,
          align: "center",
          headerAlign:"center",
          renderCell: (params) => (
            <DeleteIcon
              color="error"
              onClick={() => {
                setOpenModalDelete(true);
                setIdIddueno(params.row.iddueno);
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
                getApadrinado={() => getApadrinado()}
              />
            </Box>
          </Modal>
        );
      };

      const ModalEditar = () => {
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
            open={openModalEdit}
            onClose={() => setOpenModalEdit(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Editar
                setOpenModalEdit={setOpenModalEdit}
                iddueno={iddueno}
                getApadrinado={() => getApadrinado()}
              />
            </Box>
          </Modal>
        );
      };

      const ModalDelete = () => {
        const style = {
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        };
        return (
          <Modal
            open={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Delete
                setOpenModalDelete={setOpenModalDelete}
                iddueno={iddueno}
                getApadrinado={() => getApadrinado()}
              />
            </Box>
          </Modal>
        );
      };
    return(
        <>
         <Layout>
                <Navar />
                <Content>
                    <Header />
                    <Body>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <HeaderBox  setOpenModal={() =>setOpenModal(true)} />
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: "20px" }}>
                                <Search 
                                  handleBusqueda={(value:any) => handleBusqueda(value)}
                                  handleSearch={() => handleSearch()}
                                />
                                <Box sx={{ height: 400, width: "100%" }}>
                                    <DataGrid
                                        rows={apoderado}
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
    )
}