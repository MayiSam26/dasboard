import { Alert, Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
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
import CamposAdoptante, {
  FichaAdoptante,
  FICHA_VACIA,
  fichaDesdeApi,
  fichaParaApi,
  validarFicha,
} from "../CamposAdoptante";

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
  const [ficha, setFicha] = React.useState<FichaAdoptante>(FICHA_VACIA);

  const cambiarFicha = (campo: keyof FichaAdoptante, valor: string) =>
    setFicha((f) => ({ ...f, [campo]: valor }));

 
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
        setFicha(fichaDesdeApi(data.data))
      })
      .catch((e) => console.log(e.message));
  };
  useEffect(() => {
    getById();
  }, []);

  const updateData = async() =>{
    // Mismo criterio que al crear: DNI y teléfono con el formato de Perú.
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

    const problemaFicha = validarFicha(ficha);
    if (problemaFicha) {
      setSeverity("warning");
      setMssg(problemaFicha);
      setOpenAlert(true);
      return;
    }

    const url=baseurl+'adoptante/update/'+idadoptante
    
    const body = {
      Nombre:nombre,
      Apellido:apellido,
      Dni:documento,
      Direccion:direccion,
      telefono:telefono,
      Motivo:motivo,
      ...fichaParaApi(ficha),
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
  //sksks
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
              background: "rgba(228, 96, 47, 0.12)",
              color: "var(--cya-primary)",
            }}
          >
            <PersonIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Editar Adoptante
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModalEdit(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Nombre"
              variant="outlined"
              value={nombre ?? ""}
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
              value={apellido ?? ""}
              size="small"
              onChange={(e) => setApellido(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="DNI"
              variant="outlined"
              value={documento ?? ""}
              fullWidth
              size="small"
              helperText={AYUDA_DNI}
              inputProps={propsNumericos(LARGO_DNI)}
              onChange={(e) => setdocumento(soloDigitos(e.target.value, LARGO_DNI))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Telefono / Celular"
              variant="outlined"
              value={telefono ?? ""}
              fullWidth
              size="small"
              helperText={AYUDA_TELEFONO}
              inputProps={propsNumericos(LARGO_TELEFONO)}
              onChange={(e) => setTelefono(soloDigitos(e.target.value, LARGO_TELEFONO))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dirección (domicilio)"
              variant="outlined"
              value={direccion ?? ""}
              fullWidth
              size="small"
              placeholder="Calle, número, urbanización"
              onChange={(e) => setdireccion(e.target.value)}
            />
          </Grid>

          <CamposAdoptante ficha={ficha} onChange={cambiarFicha} />
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
              Motivo
            </Typography>
            <textarea
              placeholder="Ingrese Observaciones"
              value={motivo ?? ""}
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
          onClick={() => setOpenModalEdit(false)}
          sx={{ textTransform: "none", color: "var(--cya-text-muted)" }}
        >
          Cancelar
        </Button>
        <Button onClick={updateData} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Actualizar
        </Button>
      </Box>
    </>
  );
}
