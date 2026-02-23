import { Box, Grid, Modal } from "@mui/material";
import Header from "../../components/Header";
import HeaderBox from "../../components/HeaderBox/HeaderBox";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import { DataGrid,GridColDef  } from '@mui/x-data-grid';
import React, { useEffect } from "react";
import baseurl from "../../../Config/axios";
import axios from "axios";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import Agregar from "../../components/Modal/Agregar";
import Editar from "../../components/Modal/Editar";
import { useNavigate } from "react-router-dom";

export default function RedesSocial(){
    const navigate = useNavigate(); // Usa useNavigate si necesitas redireccionar
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirige a la página de inicio si no hay token
        }
    }, [navigate]);
    const[redes,setRedes] = React.useState<any>([])
    const[openModal,setOpenModal]  = React.useState<boolean>(false)
    const[openModalEdit,setOpenModalEdit]  = React.useState<boolean>(false)
    const[flask,setFlask] = React.useState<any>("")
    const[idRed,setIdRed] = React.useState<any>("")

    const getRedesSocial = async () =>{
        const url = baseurl+'redes-social/list'
        axios.get(url)
        .then(response => {
            const{data} = response
            setRedes(data.data)
        })
    }

    useEffect(()=>{
        getRedesSocial()
    },[])
    useEffect(() => {
        if(flask === '000'){
            getRedesSocial()
        }
    },[flask])
    const columns: GridColDef<(typeof redes)[number]>[] = [
        {
          field: 'nombre',
          headerName: 'Nombre',
          width: 150,
          editable: true,
        },
        {
          field: 'icono',
          headerName: 'Icono',
          width: 150,
          editable: true,
        },
        {
          field: 'link',
          headerName: 'Enlace',
          width: 1110,
          editable: true,
        },
        {
            field: '',
            headerName: 'Acciones',
            width: 100,
            editable: true,
            align: 'center',
            renderCell: (params) => (
               <DriveFileRenameOutlineIcon 
               onClick={() =>{
                    setOpenModalEdit(true)
                    setIdRed(params.row.idredes)
                }}
                sx={{ textAlign: 'center',cursor:'pointer' }} />
              ),
          },
      ];
      
      const ModalAgregar = () =>{
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
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                   <Agregar 
                   setOpenModal={setOpenModal}
                    setFlask={setFlask}
                   />
                </Box>
            </Modal>
        )
      }

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
                        setFlask={setFlask}
                        idRed={idRed}
                        getRedesSocial={() =>getRedesSocial()}
                    />
                </Box>
            </Modal>
        )
      }
    return(
        <>
        <Layout>
                <Navar />
                <Content>
                    <Header />
                    <Body>
                       <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <HeaderBox
                                setOpenModal={setOpenModal}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{marginTop:'20px'}}>
                                <Box sx={{ height: 400, width: '100%' }}>
                                        <DataGrid
                                            rows={redes}
                                            columns={columns}
                                            initialState={{
                                            pagination: {
                                                paginationModel: {
                                                pageSize: 8,
                                                },
                                            },
                                            }}
                                            pageSizeOptions={[8]}
                                            checkboxSelection
                                            disableRowSelectionOnClick
                                            getRowId={(row) => row.idredes}
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
    )
}