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
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

interface props {
  setOpenModal: any;
  getEntrevistas: () => void;
}

export default function Agregar({ setOpenModal, getEntrevistas }: props) {
  const [adopciones, setAdopciones] = React.useState<any[]>([]);
  const [idadopcion, setIdadopcion] = React.useState<string>("");
  const [fecha, setFecha] = React.useState<string>("");
  const [hora, setHora] = React.useState<string>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  React.useEffect(() => {
    const url = baseurl + "adopciones/list";
    axios
      .post(url, { state: "proceso" })
      .then((response) => setAdopciones(response.data.data || []))
      .catch(() => setAdopciones([]));
  }, []);

  const crear = async () => {
    if (!idadopcion || !fecha) {
      setSeverity("error");
      setMssg("Completa la solicitud y la fecha de la entrevista.");
      setOpenAlert(true);
      return;
    }
    const url = baseurl + "entrevistas/create";
    const body = { idadopcion, Fecha_Entrevista: fecha, Hora_Entrevista: hora || null };
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
            getEntrevistas();
          }, 1500);
        } else {
          setSeverity("error");
          setMssg(data.message);
          setOpenAlert(true);
        }
      })
      .catch((e) => {
        setSeverity("error");
        setMssg(e?.response?.data?.message || e.message);
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
            <RecordVoiceOverIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Programar Entrevista
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModal(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Solicitud de adopción</InputLabel>
              <Select value={idadopcion} label="Solicitud de adopción" onChange={(e) => setIdadopcion(e.target.value)}>
                {adopciones.length === 0 && (
                  <MenuItem value="" disabled>
                    No hay solicitudes en proceso
                  </MenuItem>
                )}
                {adopciones.map((a: any) => (
                  <MenuItem key={a.idadopcion} value={a.idadopcion}>
                    {a.adoptante?.Nombre} {a.adoptante?.Apellido} — {a.animales?.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Fecha"
              type="date"
              variant="outlined"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Hora (opcional)"
              type="time"
              variant="outlined"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={hora}
              onChange={(e) => setHora(e.target.value)}
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
        <Button onClick={crear} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Guardar
        </Button>
      </Box>
    </>
  );
}
