import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
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
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

interface props {
  setOpenModal: any;
  getRegistros: () => void;
}

const TIPOS = ["Diagnóstico", "Vacuna", "Tratamiento", "Esterilización", "Control médico"];

export default function Agregar({ setOpenModal, getRegistros }: props) {
  const [animales, setAnimales] = React.useState<any[]>([]);
  const [idanimal, setIdanimal] = React.useState<string>("");
  const [tipo, setTipo] = React.useState<string>("");
  const [descripcion, setDescripcion] = React.useState<string>("");
  const [fecha, setFecha] = React.useState<string>("");
  const [proximaFecha, setProximaFecha] = React.useState<string>("");
  const [sinSeguimiento, setSinSeguimiento] = React.useState<boolean>(false);
  const [observaciones, setObservaciones] = React.useState<string>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Solo mascotas que siguen en el refugio — una vez adoptada o fallecida
    // ya no debería poder registrársele un nuevo control veterinario.
    const url = baseurl + "colitas/list";
    axios
      .post(url, { estado: "En refugio" })
      .then((response) => setAnimales(response.data.data || []))
      .catch(() => setAnimales([]));
  }, []);

  const crear = async () => {
    if (!idanimal || !tipo || !descripcion.trim() || !fecha) {
      setSeverity("error");
      setMssg("Completa la mascota, tipo, descripción y fecha.");
      setOpenAlert(true);
      return;
    }
    const url = baseurl + "veterinaria/create";
    const body = {
      idanimal,
      tipo,
      descripcion,
      fecha,
      proxima_fecha: proximaFecha || null,
      observaciones: observaciones || null,
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
              background: "rgba(63, 158, 92, 0.14)",
              color: "var(--cya-secondary-dark)",
            }}
          >
            <MedicalServicesIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Nuevo Registro Veterinario
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
              <InputLabel>Mascota</InputLabel>
              <Select value={idanimal} label="Mascota" onChange={(e) => setIdanimal(e.target.value)}>
                {animales.map((a: any) => (
                  <MenuItem key={a.idanimal} value={a.idanimal}>
                    {a.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
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
              helperText="Ej: Vacuna antirrábica, desparasitación, radiografía de cadera..."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Próximo control (opcional)"
              type="date"
              variant="outlined"
              fullWidth
              size="small"
              disabled={sinSeguimiento}
              InputLabelProps={{ shrink: true }}
              value={proximaFecha}
              onChange={(e) => setProximaFecha(e.target.value)}
              helperText="Si aplica: próxima dosis, próximo chequeo, etc."
            />
            <FormControlLabel
              sx={{ mt: 0.5, ml: 0 }}
              control={
                <Checkbox
                  size="small"
                  checked={sinSeguimiento}
                  onChange={(e) => {
                    setSinSeguimiento(e.target.checked);
                    if (e.target.checked) setProximaFecha("");
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "var(--cya-text-muted)" }}>
                  No aplica otro control (ej. una sola vacuna, sin seguimiento)
                </Typography>
              }
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
