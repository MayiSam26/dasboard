import { Alert, Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import formatlocaldate from "../../../../../Config/helpersDate";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import {
  soloDigitos,
  propsNumericos,
  dniValido,
  telefonoValido,
  LARGO_DNI,
  LARGO_TELEFONO,
  AYUDA_DNI,
  AYUDA_TELEFONO,
} from "../../../../../utils/campos";

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
    // DNI y teléfono con el formato de Perú: el campo ya solo deja escribir
    // dígitos, esto atrapa el caso de dejarlos a medio escribir.
    if (!dniValido(documento)) {
      setSeverity("warning");
      setMssg("El DNI debe tener 8 dígitos numéricos.");
      setOpenAlert(true);
      return;
    }
    if (!telefonoValido(telefono)) {
      setSeverity("warning");
      setMssg("El teléfono debe tener 9 dígitos numéricos.");
      setOpenAlert(true);
      return;
    }

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
      <Alert variant="filled" severity={severity} sx={{ borderRadius: 0 }}>
        {mssg}
      </Alert>
    );
  };
  return (
    <>
      {openAlert ? alert() : null}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2.2,
          borderBottom: "1px solid var(--cya-border)",
          background: "var(--cya-bg-alt)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(63, 158, 92, 0.14)",
              color: "var(--cya-secondary-dark)",
            }}
          >
            <PersonIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Crear Nuevo Adoptante
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModal(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setNombre(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Apellido"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setApellido(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="DNI"
              variant="outlined"
              fullWidth
              size="small"
              helperText={AYUDA_DNI}
              inputProps={propsNumericos(LARGO_DNI)}
              value={documento}
              onChange={(e) => setdocumento(soloDigitos(e.target.value, LARGO_DNI))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Telefono / Celular"
              variant="outlined"
              fullWidth
              size="small"
              helperText={AYUDA_TELEFONO}
              inputProps={propsNumericos(LARGO_TELEFONO)}
              value={telefono}
              onChange={(e) => setTelefono(soloDigitos(e.target.value, LARGO_TELEFONO))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Direccion"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setdireccion(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
              Motivo
            </Typography>
            <textarea
              placeholder="Ingrese Observaciones"
              onChange={(e) => setMotivo(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "8px",
                border: "1px solid var(--cya-border)",
                padding: "10px",
                maxHeight: "300px",
                height: "110px",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            ></textarea>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
              Fecha de registro
            </Typography>
            <input
              type="date"
              onChange={(e) => setFromto(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                border: "1px solid var(--cya-border)",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.2,
          px: 3,
          py: 2,
          borderTop: "1px solid var(--cya-border)",
        }}
      >
        <Button
          onClick={() => setOpenModal(false)}
          sx={{ textTransform: "none", color: "var(--cya-text-muted)" }}
        >
          Cancelar
        </Button>
        <Button onClick={savedata} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Guardar
        </Button>
      </Box>
    </>
  );
}
