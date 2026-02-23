import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import { isNull } from "util";
import { isNullishCoalesce } from "typescript";
import { deflate } from "zlib";
import moment from 'moment';
import formatlocaldate from "../../../../../Config/helpersDate";

interface props {
  setOpenModal: any;
  getAdoptante: () => void;
}
export default function Agregar({ setOpenModal, getAdoptante }: props) {
  const [nombre, setNombre] = React.useState<any>("");
  const [apellido, setApellido] = React.useState<any>("");
  const [documento, setdocumento] = React.useState<any>("");
  const [direccion, setdireccion] = React.useState<any>("");
  const [telefono, setTelefono] = React.useState<any>("");
  const [motivo, setMotivo] = React.useState<any>("");
  const [fromto, setFromto] = React.useState<any>(null);

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

 
  const savedata = async () => {
  

    const body: any = {
      iduser: null,
      Nombre: nombre,
      Apellido:apellido,
      Dni:documento,
      Direccion: direccion,
      telefono: telefono,
      Motivo: motivo,
      Fecha_Registro:formatlocaldate(fromto) ,
    };
    console.log("body",body)
    const url = baseurl + "adopciones/create";
        await axios.post(url,body).then((response) => {
            const { data } = response;
            if(data.code === '000'){
                setSeverity('success');
                setMssg(data.message);
                setOpenAlert(true);
                setTimeout(() =>{
                    setOpenModal(false)
                    getAdoptante()
                },1800)
            }
        })
        .catch((e) => {
                setSeverity('error');
                setMssg(e.message);
                setOpenAlert(true);
        })
  };

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
            <Typography variant="h5">Crear Nuevo Adoptante</Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={savedata}
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
              Guardar
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese Nombre"
              variant="outlined"
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
              size="small"
              onChange={(e) => setApellido(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese DNI"
              variant="outlined"
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
              fullWidth
              size="small"
              onChange={(e) => setdireccion(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <textarea
              placeholder="Ingrese Observaciones"
              //value={descripcion ?? ""}
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
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <input
              type="date"
              onChange={(e) => setFromto(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                border: "1px solid #c2c2c2",
                borderRadius: "4px",
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
