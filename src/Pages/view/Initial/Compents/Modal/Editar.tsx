import { Alert, Avatar, Box, Button, IconButton, TextField, Typography, Grid } from "@mui/material";
import React, { useEffect } from "react";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";
import baseurl from "../../../../../Config/axios";
import {
  soloDigitos,
  propsNumericos,
  telefonoValido,
  correoValido,
  LARGO_TELEFONO,
  AYUDA_TELEFONO,
} from "../../../../../utils/campos";

interface props {
  setFlask?: any;
  setOpenModalEdit: any;
  idRefugio: any;
  getRedesSocial: () => void;
}

export default function Editar({ setFlask, setOpenModalEdit, idRefugio, getRedesSocial }: props) {
  const [nombre, setNombre] = React.useState<string>("");
  const [link, setLink] = React.useState<string>("");
  const [telefono, setTelefono] = React.useState<string>("");
  const [correo, setCorreo] = React.useState<string>("");
  const [descripcion, setDescripcion] = React.useState<string>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async () => {
    const url = baseurl + "home/" + idRefugio;
    await axios.get(url).then((response) => {
      const { data } = response;
      setNombre(data.data.nombre);
      setDescripcion(data.data.Descripcion);
      setLink(data.data.logo);
      setTelefono(data.data.telefono);
      setCorreo(data.data.correo);
    });
  };

  useEffect(() => {
    getById();
  }, [idRefugio]);

  const updateRefugio = async () => {
    // Estos datos se publican en el sitio público, así que se valida el
    // formato antes de guardarlos.
    if (!telefonoValido(telefono)) {
      setSeverity("warning");
      setMssg("El teléfono debe tener 9 dígitos numéricos.");
      setOpenAlert(true);
      return;
    }
    if (!correoValido(correo)) {
      setSeverity("warning");
      setMssg("Ingresa un correo electrónico válido.");
      setOpenAlert(true);
      return;
    }

    const url = baseurl + "home/updates/" + idRefugio;
    const body = {
      nombre,
      Descripcion: descripcion,
      logo: link,
      telefono,
      correo,
    };
    await axios
      .put(url, body)
      .then((response) => {
        const { data } = response;
        if (data.code === "000") {
          setFlask?.(data.code);
          setSeverity("success");
          setMssg(data.message);
          setOpenAlert(true);
          setTimeout(() => {
            setOpenModalEdit(false);
            getRedesSocial();
          }, 1800);
        }
      })
      .catch((e) => {
        setSeverity("error");
        setMssg(e?.message || "No se pudo actualizar la información.");
        setOpenAlert(true);
      });
  };

  return (
    <>
      {openAlert && (
        <Alert variant="filled" severity={severity} sx={{ borderRadius: 0 }}>
          {mssg}
        </Alert>
      )}

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
            <HomeIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Editar Información del Refugio
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
              label="Descripción"
              variant="outlined"
              fullWidth
              size="small"
              multiline
              minRows={4}
              value={descripcion ?? ""}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                src={link || undefined}
                variant="rounded"
                sx={{ width: 56, height: 56, border: "1px solid var(--cya-border)", bgcolor: "var(--cya-bg-alt)" }}
              >
                <HomeIcon sx={{ color: "var(--cya-text-muted)" }} />
              </Avatar>
              <TextField
                label="URL del logo"
                variant="outlined"
                fullWidth
                size="small"
                value={link ?? ""}
                onChange={(e) => setLink(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Teléfono"
              variant="outlined"
              fullWidth
              size="small"
              helperText={AYUDA_TELEFONO}
              inputProps={propsNumericos(LARGO_TELEFONO)}
              value={telefono ?? ""}
              onChange={(e) => setTelefono(soloDigitos(e.target.value, LARGO_TELEFONO))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Correo"
              variant="outlined"
              fullWidth
              size="small"
              value={correo ?? ""}
              onChange={(e) => setCorreo(e.target.value)}
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
        <Button onClick={updateRefugio} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Guardar
        </Button>
      </Box>
    </>
  );
}
