import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import React, { useEffect } from "react";
import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import moment from "moment";

interface props {
  setOpenModalEdit: any;
  identrevista: any;
  getEntrevistas: () => void;
}

export default function Editar({ setOpenModalEdit, identrevista, getEntrevistas }: props) {
  const [info, setInfo] = React.useState<any>(null);
  const [respuestas, setRespuestas] = React.useState<string>("");
  const [observaciones, setObservaciones] = React.useState<string>("");
  const [cumple, setCumple] = React.useState<string>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async () => {
    const url = baseurl + "entrevistas/detail/" + identrevista;
    await axios.get(url).then((response) => {
      const { data } = response.data;
      setInfo(data);
      setRespuestas(data?.Respuestas || "");
      setObservaciones(data?.Observaciones || "");
      setCumple(data?.Cumple_Requisitos || "");
    });
  };

  useEffect(() => {
    getById();
  }, []);

  const registrar = async () => {
    if (!observaciones.trim() || !cumple) {
      setSeverity("error");
      setMssg("Indica las observaciones y si cumple los requisitos.");
      setOpenAlert(true);
      return;
    }
    const url = baseurl + "entrevistas/update/" + identrevista;
    const body = { Respuestas: respuestas, Observaciones: observaciones, Cumple_Requisitos: cumple };
    await axios
      .put(url, body)
      .then((response) => {
        const { data } = response;
        if (data.code === "000") {
          setSeverity("success");
          setMssg(data.message);
          setOpenAlert(true);
          setTimeout(() => {
            setOpenModalEdit(false);
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
              background: "rgba(228, 96, 47, 0.12)",
              color: "var(--cya-primary)",
            }}
          >
            <RecordVoiceOverIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Registrar Entrevista
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModalEdit(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Chip
              label={`Programada para el ${
                info?.Fecha_Entrevista ? moment(info.Fecha_Entrevista).format("DD-MM-YYYY") : ""
              }${info?.Hora_Entrevista ? " a las " + info.Hora_Entrevista : ""}`}
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Respuestas del postulante (opcional)"
              variant="outlined"
              fullWidth
              size="small"
              multiline
              minRows={3}
              value={respuestas}
              onChange={(e) => setRespuestas(e.target.value)}
              helperText="Lo que respondió sobre su vivienda, familia y experiencia con mascotas."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Observaciones"
              variant="outlined"
              fullWidth
              size="small"
              multiline
              minRows={3}
              required
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small" required>
              <InputLabel>¿Cumple los requisitos?</InputLabel>
              <Select value={cumple} label="¿Cumple los requisitos?" onChange={(e) => setCumple(e.target.value)}>
                <MenuItem value="Sí">Sí</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
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
        <Button onClick={registrar} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Guardar
        </Button>
      </Box>
    </>
  );
}
