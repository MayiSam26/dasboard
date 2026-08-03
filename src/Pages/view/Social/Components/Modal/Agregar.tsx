import {
  Alert,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import React from "react";
import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";

interface props {
  setOpenModal: any;
  setFlask: any;
}

export default function Agregar({ setOpenModal, setFlask }: props) {
  const [nombre, setNombre] = React.useState<string>("");
  const [icono, setIcono] = React.useState<string>("");
  const [link, setLink] = React.useState<string>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const createRedes = async () => {
    if (!nombre.trim() || !link.trim()) {
      setSeverity("error");
      setMssg("Completa al menos el nombre y el enlace.");
      setOpenAlert(true);
      return;
    }
    const url = baseurl + "redes-social/create";
    const body = { nombre, icono, link };
    await axios
      .post(url, body)
      .then((response) => {
        const { data } = response;
        if (data.code === "000") {
          setFlask(data.code);
          setSeverity("success");
          setMssg(data.message);
          setOpenAlert(true);
          setTimeout(() => {
            setOpenModal(false);
          }, 1800);
        }
      })
      .catch((e) => {
        setSeverity("error");
        setMssg(e?.message || "No se pudo crear la red social.");
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
              background: "rgba(63, 158, 92, 0.14)",
              color: "var(--cya-secondary-dark)",
            }}
          >
            <ShareIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Agregar Red Social
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModal(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre (ej. Facebook, Instagram)"
              variant="outlined"
              fullWidth
              size="small"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Icono"
              variant="outlined"
              fullWidth
              size="small"
              helperText="Nombre o clase del icono usado en el sitio público"
              value={icono}
              onChange={(e) => setIcono(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Enlace"
              variant="outlined"
              fullWidth
              size="small"
              placeholder="https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
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
        <Button onClick={createRedes} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Guardar
        </Button>
      </Box>
    </>
  );
}
