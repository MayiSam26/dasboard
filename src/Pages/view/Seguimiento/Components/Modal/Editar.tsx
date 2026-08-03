import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import React, { useEffect } from "react";
import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import moment from "moment";

interface props {
  setOpenModalEdit: any;
  idSeguimiento: any;
  getSeguimientos: () => void;
}

export default function Editar({ setOpenModalEdit, idSeguimiento, getSeguimientos }: props) {
  const [info, setInfo] = React.useState<any>(null);
  const [fechaRealizado, setFechaRealizado] = React.useState<string>(moment().format("YYYY-MM-DD"));
  const [observaciones, setObservaciones] = React.useState<string>("");
  const [recomendaciones, setRecomendaciones] = React.useState<string>("");
  const [file, setFile] = React.useState<File | null>(null);

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async () => {
    const url = baseurl + "seguimientos/detail/" + idSeguimiento;
    await axios.get(url).then((response) => {
      const { data } = response.data;
      setInfo(data);
      if (data?.Fecha_Realizado) setFechaRealizado(moment(data.Fecha_Realizado).format("YYYY-MM-DD"));
      setObservaciones(data?.Observaciones || "");
      setRecomendaciones(data?.Recomendaciones || "");
    });
  };

  useEffect(() => {
    getById();
  }, []);

  const registrar = async () => {
    if (!observaciones.trim()) {
      setSeverity("error");
      setMssg("Indica las observaciones del seguimiento.");
      setOpenAlert(true);
      return;
    }
    const url = baseurl + "seguimientos/update/" + idSeguimiento;
    const formData = new FormData();
    formData.append("Estado", "realizado");
    formData.append("Fecha_Realizado", fechaRealizado);
    formData.append("Observaciones", observaciones);
    formData.append("Recomendaciones", recomendaciones);
    if (file) formData.append("evidencia", file);

    await axios
      .put(url, formData)
      .then((response) => {
        const { data } = response;
        if (data.code === "000") {
          setSeverity("success");
          setMssg(data.message);
          setOpenAlert(true);
          setTimeout(() => {
            setOpenModalEdit(false);
            getSeguimientos();
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
            <EventAvailableIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Registrar Seguimiento
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
              label={`${info?.tipo || ""} programada para el ${
                info?.Fecha_Programada ? moment(info.Fecha_Programada).format("DD-MM-YYYY") : ""
              }`}
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fecha realizado"
              type="date"
              variant="outlined"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={fechaRealizado}
              onChange={(e) => setFechaRealizado(e.target.value)}
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
              helperText="Cómo se encontró al animal, condiciones de la visita/llamada."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Recomendaciones (opcional)"
              variant="outlined"
              fullWidth
              size="small"
              multiline
              minRows={2}
              value={recomendaciones}
              onChange={(e) => setRecomendaciones(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<AttachFileIcon />}
              sx={{ textTransform: "none" }}
            >
              {file ? file.name : "Adjuntar evidencia (opcional)"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </Button>
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
