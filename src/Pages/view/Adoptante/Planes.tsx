import { Box, Grid, Modal } from "@mui/material";
import Header from "../../components/Header";
import HeaderBox from "../Adoptante/Components/HeaderBox";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import baseurl from "../../../Config/axios";
import axios from "axios";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import Agregar from "../Adoptante/Components/Modal/Agregar";
import Editar from "../Adoptante/Components/Modal/Editar";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import Delete from "./Components/Modal/Delete";

export default function Adoptante() {
  const navigate = useNavigate(); // Usa useNavigate si necesitas redireccionar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige a la página de inicio si no hay token
    }
  }, [navigate]);
  const [plan, setPlan] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [flask, setFlask] = React.useState<any>("");
  const [idPlanMensual, setIdPlanMensual] = React.useState<any>("");

  const getPlanesMensual = async () => {
    const url = baseurl + "plan-mensual/list";
    axios.get(url).then((response) => {
      const { data } = response;
      setPlan(data.data);
    });
  };

  useEffect(() => {
    getPlanesMensual();
  }, []);
  useEffect(() => {
    if (flask === "000") {
      getPlanesMensual();
    }
  }, [flask]);

  

  const columns: GridColDef<(typeof plan)[number]>[] = [
    {
      field: "nombre",
      headerName: "Nombre",
      width: 350,
      editable: true,
    },
    {
      field: "cantidad",
      headerName: "Precio",
      width: 150,
      editable: true,
    },
    {
      field: "img",
      headerName: "Url imagen",
      width: 460,
      editable: true,
      renderCell: (params) => {
        return `${baseurl}${params.row.img}`;
      },
    },
    {
      field: "previo",
      headerName: "Imagen",
      width: 350,
      editable: true,
      renderCell: (params) => {
        return (
          <img
            src={`${baseurl}${params.row.img}`}
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
      field: "view",
      headerName: "Editar",
      width: 100,
      editable: true,
      align: "center",
      renderCell: (params) => (
        <DriveFileRenameOutlineIcon
          onClick={() => {
            setOpenModalEdit(true);
            setIdPlanMensual(params.row.idplanmensual);
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
            setIdPlanMensual(params.row.idplanmensual);
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
            setFlask={setFlask}
            getPlanesMensual={() => getPlanesMensual()}
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
            setFlask={setFlask}
            idPlanMensual={idPlanMensual}
            getPlanesMensual={() => getPlanesMensual()}
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
            setFlask={setFlask}
            idPlanMensual={idPlanMensual}
            getPlanesMensual={() => getPlanesMensual()}
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
                <HeaderBox setOpenModal={setOpenModal} />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={plan}
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
                    getRowId={(row) => row.idplanmensual}
                  />
                </Box>
              </Grid>
            </Grid>
          </Body>
        </Content>
      </Layout>
      {ModalAgregar()}
      {ModalEditar()}
      {ModalDelete()}
    </>
  );
}
