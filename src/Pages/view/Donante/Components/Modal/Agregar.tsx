import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import formatlocaldate from "../../../../../Config/helpersDate";

interface props {
  setOpenModal: any;
  getDonante: () => void;
}

interface autocomplete {
  label: string;
  value: any;
}
export default function Agregar({ setOpenModal, getDonante }: props) {
  const [fullname, setFullname] = React.useState<any>("");
  const [redsocial, setSocial] = React.useState<any>("");
  const [idtipopersona, setTipo] = React.useState<any>("");
  const [ruc, setRuc] = React.useState<any>("");
  const [dni, setDNI] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const createData = async () => {
    const url = baseurl + "donante/create";
    const body = {
      idtipopersona: idtipopersona,
      fullname: fullname,
      redsocial: redsocial,
      Ruc: ruc,
      Dni: dni,
      Fecha_Registro:formatlocaldate(dateTo),
    };
    await axios
      .post(url, body)
      .then((response) => {
        const { data } = response;
        if (data.code === "000") {
          setSeverity("success");
          setMssg(data.message);
          setOpenAlert(true);
          setTimeout(() => {
            setOpenModal(false);
            getDonante();
          }, 1800);
        }
      })
      .catch((e) => {
        setSeverity("error");
        setMssg(e.message);
        setOpenAlert(true);
      });
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
            <VolunteerActivismIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Agregar Nuevo Donante
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
              label="Nombre completo"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setFullname(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="red-social-label">Red Social</InputLabel>
              <Select
                labelId="red-social-label"
                defaultValue=""
                onChange={(e) => setSocial(e.target.value)}
                label="Red Social"
              >
                <MenuItem value="Facebook">Facebook</MenuItem>
                <MenuItem value="Instagram">Instagram</MenuItem>
                <MenuItem value="Tiktok">Tiktok</MenuItem>
                <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                <MenuItem value="Ninguno">Ninguno</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-persona-label">Tipo Persona</InputLabel>
              <Select
                labelId="tipo-persona-label"
                defaultValue=""
                onChange={(e) => setTipo(e.target.value)}
                label="Tipo Persona"
              >
                <MenuItem value="1">Persona Natural</MenuItem>
                <MenuItem value="2">Persona Jurídica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="RUC"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setRuc(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="DNI"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setDNI(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
              Fecha de registro
            </Typography>
            <input
              type="date"
              onChange={(e) => setDateTo(e.target.value)}
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
        <Button onClick={createData} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Guardar
        </Button>
      </Box>
    </>
  );
}
