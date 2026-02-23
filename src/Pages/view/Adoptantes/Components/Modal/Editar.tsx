import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";

interface props {
  setOpenModalEdit?: any;
  idadoptante?: any;
  getAdoptante: () => void;
}
export default function Editar({
  setOpenModalEdit,
  idadoptante,
  getAdoptante,
}: props) {


  const [nombre, setNombre] = React.useState<any>("");
  const [apellido, setApellido] = React.useState<any>("");
  const [documento, setdocumento] = React.useState<any>("");
  const [direccion, setdireccion] = React.useState<any>("");
  const [telefono, setTelefono] = React.useState<any>("");
  const [motivo, setMotivo] = React.useState<any>("");

 
  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async () => {
    const url = baseurl + "adoptante/detail/" + idadoptante;
    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        setNombre(data.data.Nombre)
        setApellido(data.data.Apellido)
        setdocumento(data.data.Dni)
        setdireccion(data.data.Direccion)
        setTelefono(data.data.telefono)
        setMotivo(data.data.Motivo)
      })
      .catch((e) => console.log(e.message));
  };
  useEffect(() => {
    getById();
  }, []);

  const updateData = async() =>{
    const url=baseurl+'adoptante/update/'+idadoptante
    
    const body = {
      Nombre:nombre,
      Apellido:apellido,
      Dni:documento,
      Direccion:direccion,
      telefono:telefono,
      Motivo:motivo
    }
    axios.put(url,body)
    .then((response:any) =>{
        const { data } = response
        if(data.code === '000'){
            setSeverity('success');
            setMssg(data.message);
            setOpenAlert(true);
            setTimeout(() =>{
                  setOpenModalEdit(false)
                  getAdoptante()
              },1800)

        }
    }).catch((e:any)=>{console.log(e.message)})
}
  
  const alert = () => {
    return (
      <Alert variant="filled" severity={severity}>
        {mssg}
      </Alert>
    );
  };

  return (
    <>
      {openAlert ? alert() : null}
      <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
        <Grid item xs={12} sx={{ display: "flex" }}>
          <Grid item xs={10}>
            <Typography variant="h5">Actualizar Estado de Adopcion</Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
            onClick={updateData}
              fullWidth
              variant="contained"
              sx={{
                background: "#65c178",
                fontWeight: "bolder",
                textTransform: "capitalize",
                "&:hover": {
                  background: "#ed6436",
                },
              }}
            >
                Actualizar
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese Nombre"
              variant="outlined"
              value={nombre ?? ""}
              fullWidth
              size="small"
              onChange={(e) => setNombre(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese Apellido"
              variant="outlined"
              fullWidth
              value={apellido ?? ""}
              size="small"
              onChange={(e) => setApellido(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese DNI"
              variant="outlined"
              value={documento ?? ""}
              type="number"
              fullWidth
              size="small"
              onChange={(e) => setdocumento(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese telefono/celular"
              variant="outlined"
              value={telefono ?? ""}
              fullWidth
              size="small"
              onChange={(e) => setTelefono(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese direccion"
              variant="outlined"
              value={direccion ?? ""}
              fullWidth
              size="small"
              onChange={(e) => setdireccion(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <textarea
              placeholder="Ingrese Observaciones"
              value={motivo ?? ""}
              onChange={(e) => setMotivo(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "4px",
                border: "1px solid #c2c2c2",
                padding: "9px",
                maxHeight: "300px",
                height: "130px",
                fontFamily: "inherit",
              }}
            ></textarea>
          </Grid>

        </Grid>
      </Grid>
    </>
  );
}
