import React from "react";
import baseurl from "../../../Config/axios";
import Header from "../../components/Header";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import HeaderBox from "./Components/HeaderBox";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventIcon from '@mui/icons-material/Event';


import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Grid, Modal, Typography } from "@mui/material";
import moment from "moment";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";

export default function Egreso(){
    const [egreso, setEgreso] = React.useState<any>([]);
    const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
    const [idEgreso, setIdEgreso] = React.useState<any>("");
    const [openModal, setOpenModal] = React.useState<boolean>(false);

    const getEgreso = async () => {
        const url = baseurl + "egreso/list";
        axios.get(url).then((response) => {
          const { data } = response;
          setEgreso(data.data);
        }).catch(e => console.log(e.error));
      };
      React.useEffect(() => {
        getEgreso();
      }, []);



      const columns: GridColDef<(typeof egreso)[number]>[] = [
        {
          field: "Descripcion",
          headerName: "Nombre Egreso",
          width: 350,
          editable: true,
        },
        {
          field: "Monto",
          headerName: "Precio",
          width: 150,
          editable: true,
        },
        {
          field: "fechato",
          headerName: "Fecha egreso",
          width: 860,
          editable: true,
          renderCell: (params) => (
            <>
                {moment(params.value).format('L')}  <EventIcon />
            </>
        )
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
                setIdEgreso(params.row.idregistroegreso);
              }}
              sx={{ textAlign: "center", cursor: "pointer" }}
            />
          ),
        }
      ]
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
                getEgreso={() => getEgreso()}
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
                idEgreso={idEgreso}
                getEgreso={() => getEgreso()}
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
                                <HeaderBox 
                                setOpenModal={()=>setOpenModal(true)}
                                />
                             </Grid>
                             <Grid item xs={12} sx={{ marginTop: "20px" }}>
                                <Box sx={{ height: 400, width: "100%" }}>
                                <DataGrid
                                    rows={egreso}
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
                                    getRowId={(row) => row.idregistroegreso}
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