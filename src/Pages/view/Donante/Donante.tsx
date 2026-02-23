import { Box, Grid, Modal } from "@mui/material";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import HeaderBox from "./Components/HeaderBox";
import baseurl from "../../../Config/axios";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import React, { useEffect } from "react";
import moment from "moment";
import EventIcon from "@mui/icons-material/Event";
import Header from "../../components/Header";
import Agregar from "./Components/Modal/Agregar";
import Editar from "./Components/Modal/Editar";

export default function Donante() {
  const [donante, setDonante] = React.useState<any>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = React.useState<boolean>(false);
  const [idDonante, setIdDonante] = React.useState<any>("");

  const [fullname, setFullname] = React.useState<string>("");
  const [redsocial, setRedsocial] = React.useState<string>("");
  const [idtipopersona, setIdtipopersona] = React.useState<string>("");
  const [ruc, setRuc] = React.useState<string>("");
  const [dni, setDni] = React.useState<string>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getDonante = async () => {
    const url = baseurl + "donante/list";
    await axios.get(url).then((response) => {
      const { data } = response;
      setDonante(data.data);
    });
  };

  useEffect(() => {
    if (idDonante) {
      getEditDonante(idDonante);
    }
  }, [idDonante]);

  const getEditDonante = async (idDonante: any) => {
    const url = baseurl + "donante/detail/" + idDonante;
    await axios.get(url).then((response) => {
      const { data } = response;

      setFullname(data.data.fullname);
      setRedsocial(data.data.redsocial);
      setIdtipopersona(String(data.data.idtipopersona));
      setRuc(data.data.Ruc);
      setDni(data.data.Dni);
    });
  };

  const changeEditDonante = async () => {
    const body = {
      idtipopersona: idtipopersona,
      fullname: fullname,
      redsocial: redsocial,
      Ruc: ruc,
      Dni: dni,
    };

    const url = baseurl + "donante/update/" + idDonante;

    try {
      const response = await axios.put(url, body);
      const { data } = response;

      if (data.code === "000") {
        setSeverity("success");
        setMssg(data.message);
        setOpenAlert(true);

        setTimeout(() => {
          setOpenModalEdit(false); // ✅ corregido (antes estaba setOpenModal(false))
          setOpenAlert(false);
          getDonante();
        }, 1800);
      } else {
        setSeverity("error");
        setMssg(data.message);
        setOpenAlert(true);
      }
    } catch (error: any) {
      setSeverity("error");
      setMssg(error?.message || "Error al actualizar el donante");
      setOpenAlert(true);
    }
  };

  const handleFullname = (value: string) => setFullname(value);
  const handleRedsocial = (value: string) => setRedsocial(value);
  const handleIdtipopersona = (value: string) => setIdtipopersona(value);
  const handleRuc = (value: string) => setRuc(value);
  const handleDni = (value: string) => setDni(value);

  React.useEffect(() => {
    getDonante();
  }, []);

  const columns: GridColDef<(typeof donante)[number]>[] = [
    {
      field: "fullname",
      headerName: "Nombre Completo",
      width: 180,
      editable: true,
    },
    {
      field: "redsocial",
      headerName: "Redes Social",
      width: 180,
      editable: true,
    },
    {
      field: "persona",
      headerName: "Tipo Persona",
      width: 200,
      editable: true,
      renderCell: (params) => {
        return <>{params.value.nombre}</>;
      },
    },
    {
      field: "Ruc",
      headerName: "RUC",
      width: 160,
      editable: true,
    },
    {
      field: "Dni",
      headerName: "DNI",
      width: 160,
      editable: true,
    },
    {
      field: "Fecha_Registro",
      headerName: "Fecha Registro",
      width: 230,
      editable: true,
      renderCell: (params) => (
        <>
          {moment(params.value).format("DD-MM-YYYY")} <EventIcon />
        </>
      ),
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
            setIdDonante(params.row.iddonantes);
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
          <Agregar setOpenModal={setOpenModal} getDonante={() => getDonante()} />
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
        onClose={() => {
          setOpenModalEdit(false);
          setOpenAlert(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Editar
            setOpenModalEdit={setOpenModalEdit}
            getDonante={() => getDonante()}
            handleFullname={(value) => handleFullname(value)}
            handleRedsocial={(value) => handleRedsocial(value)}
            handleIdtipopersona={(value) => handleIdtipopersona(value)}
            handleRuc={(value) => handleRuc(value)}
            handleDni={(value) => handleDni(value)}
            changeEditDonante={changeEditDonante}
            severity={severity}
            mssg={mssg}
            openAlert={openAlert}
            fullname={fullname}
            redsocial={redsocial}
            idtipopersona={idtipopersona}
            ruc={ruc}
            dni={dni}
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
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={donante}
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
                    getRowId={(row) => row.iddonantes}
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
