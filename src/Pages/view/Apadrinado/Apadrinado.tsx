import { Box, Grid, Modal } from "@mui/material";
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
import EventIcon from '@mui/icons-material/Event';
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline"
import DeleteIcon from "@mui/icons-material/Delete";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";


export default function Apadrinado(){
    const[padrino,setApadrinado] = React.useState<any>([]);
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
    const [idapadrinado, setIdapadrinado] = React.useState<any>("");
    const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);

    const getApadrinado = async () => {
        const url = baseurl + "apadrinado/list";
        await axios.get(url).then((response) => {
          const { data } = response;
          setApadrinado(data.data);
        });
      };
    
      React.useEffect(() => {
        getApadrinado();
      }, []);
      
      const columns: GridColDef<(typeof padrino)[number]>[] = [
        {
          field: "donantes",
          headerName: "Apadrinado",
          width: 230,
          editable: true,
          renderCell: (params) => params.value?.nombre + " " +  params.value?.apellido
        },
        {
          field: "animal",
          headerName: "Colita",
          width: 180,
          editable: true,
          renderCell: (params) => params.value?.nombre
        },
        {
            field: "plan",
            headerName: "Plan Mensual",
            width: 180,
            editable: true,
            renderCell: (params) => params.value?.nombre
          },
        {
            field: "Fecha_Apadrinado",
            headerName: "Fecha apadrinado",
            width: 230,
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
                setIdapadrinado(params.row.idapadrinado);
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
          renderCell: (params) => (
            <DeleteIcon
              color="error"
              onClick={() => {
                setOpenModalDelete(true);
                setIdapadrinado(params.row.idapadrinado);
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
                idapadrinado={idapadrinado}
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
                   <Header/>
                    <Body>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <HeaderBox setOpenModal={() => setOpenModal(true)} />
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: "20px" }}>
                                <Box sx={{ height: 400, width: "100%" }}>
                                    <DataGrid
                                            rows={padrino}
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
                                            getRowId={(row) => row.idapadrinado}
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