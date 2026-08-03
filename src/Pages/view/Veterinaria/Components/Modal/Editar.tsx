import {
  Alert,
  Box,
  Button,
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
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import moment from "moment";

interface props {
  setOpenModalEdit: any;
  idRegistro: any;
  getRegistros: () => void;
}

const TIPOS = ["Diagnóstico", "Vacuna", "Tratamiento", "Esterilización", "Control médico"];

export default function Editar({ setOpenModalEdit, idRegistro, getRegistros }: props) {
  const [tipo, setTipo] = React.useState<string>("");
  const [descripcion, setDescripcion] = React.useState<string>("");
  const [fecha, setFecha] = React.useState<string>("");
  const [proximaFecha, setProximaFecha] = React.useState<string>("");
  const [observaciones, setObservaciones] = React.useState<string>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async () => {
    const url = baseurl + "veterinaria/detail/" + idRegistro;
    await axios.get(url).then((response) => {
      const { data } = response.data;
      setTipo(data?.tipo || "");
      setDescripcion(data?.descripcion || "");
      setFecha(data?.fecha ? moment(data.fecha).format("YYYY-MM-DD") : "");
      setProximaFecha(data?.proxima_fecha ? moment(data.proxima_fecha).format("YYYY-MM-DD") : "");
      setObservaciones(data?.observaciones || "");
    });
  };

  useEffect(() => {
    getById();
  }, []);

  const actualizar = async () => {
    if (!tipo || !descripcion.trim() || !fecha) {
      setSeverity("error");
      setMssg("Completa el tipo, descripción y fecha.");
      setOpenAlert(true);
      return;
    }
    const url = baseurl + "veterinaria/update/" + idRegistro;
    const body = {
      tipo,
      descripcion,
      fecha,
      proxima_fecha: proximaFecha || null,
      observaciones: observaciones || null,
    };
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
            getRegistros();
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
            <MedicalServicesIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Editar Registro Veterinario
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModalEdit(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select value={tipo} label="Tipo" onChange={(e) => setTipo(e.target.value)}>
                {TIPOS.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
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
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              variant="outlined"
              fullWidth
              size="small"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Próximo control (opcional)"
              type="date"
              variant="outlined"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={proximaFecha}
              onChange={(e) => setProximaFecha(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Observaciones (opcional)"
              variant="outlined"
              fullWidth
              size="small"
              multiline
              minRows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
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
        <Button onClick={actualizar} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Guardar
        </Button>
      </Box>
    </>
  );
}
