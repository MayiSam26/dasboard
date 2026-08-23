import { Alert, Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";

import { soloDigitos, propsNumericos, telefonoValido, LARGO_TELEFONO } from "../../../../../utils/campos";
interface props {
  setOpenModalEdit?: any;
  iddueno?: any;
  getApadrinado: () => void;
}
export default function Editar({ setOpenModalEdit, iddueno, getApadrinado }: props) {
  const [nombre, setNombre] = React.useState<any>("");
  const [facebook, setFacebook] = React.useState<any>("");
  const [instagram, setInstagram] = React.useState<any>("");
  const [whatsapp, setWhatsapp] = React.useState<string>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async () => {
    const url = baseurl + "amo/detail/" + iddueno;
    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        setNombre(data.data.nombre);
        setFacebook(data.data.facebook);
        setInstagram(data.data.instagram);
        setWhatsapp(data.data.whatsapp || "");
      })
      .catch((e) => console.log(e.message));
  };
  useEffect(() => {
    getById();
  }, []);

  const updateById = async () => {
    if (!telefonoValido(whatsapp)) {
      setSeverity("warning");
      setMssg("El WhatsApp debe tener 9 dígitos numéricos.");
      setOpenAlert(true);
      return;
    }
    const body = {
      nombre: nombre,
      facebook: facebook,
      instagram: instagram,
      whatsapp: whatsapp,
    };
    const url = baseurl + "amo/update/" + iddueno;
    axios
      .put(url, body)
      .then((response) => {
        const { data } = response;
        if (data.code === "000") {
          setSeverity("success");
          setMssg(data.message);
          setOpenAlert(true);
          setTimeout(() => {
            setOpenModalEdit(false);
            getApadrinado();
          }, 1800);
        } else {
          setSeverity("error");
          setMssg(data.message);
          setOpenAlert(true);
        }
      })
      .catch((e) => console.log(e.message));
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
              background: "rgba(228, 96, 47, 0.12)",
              color: "var(--cya-primary)",
            }}
          >
            <PersonIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Editar Dueño
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModalEdit(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              size="small"
              value={nombre ?? ""}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Facebook"
              variant="outlined"
              fullWidth
              size="small"
              value={facebook ?? ""}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Instagram"
              variant="outlined"
              fullWidth
              size="small"
              value={instagram ?? ""}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="WhatsApp (opcional)"
              variant="outlined"
              fullWidth
              size="small"
              helperText="9 dígitos. En la web NO se muestra el número: solo aparece un botón para escribirle."
              inputProps={propsNumericos(LARGO_TELEFONO)}
              value={whatsapp}
              onChange={(e) => setWhatsapp(soloDigitos(e.target.value, LARGO_TELEFONO))}
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
          onClick={() => setOpenModalEdit(false)}
          sx={{ textTransform: "none", color: "var(--cya-text-muted)" }}
        >
          Cancelar
        </Button>
        <Button onClick={updateById} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Actualizar
        </Button>
      </Box>
    </>
  );
}
