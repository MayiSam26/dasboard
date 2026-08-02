import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PetsIcon from "@mui/icons-material/Pets";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";
import formatlocaldate from "../../../../../Config/helpersDate";

interface props {
  setOpenModal: any;
  getAlbergados: () => void;
}
export default function Agregar({ setOpenModal, getAlbergados }: props) {
  const [nombre, setNombre] = React.useState<any>("");
  const [tamano, setTamano] = React.useState<any>("");
  const [peso, setPeso] = React.useState<any>("");
  const [edad, setEdad] = React.useState<any>("");
  const [estado] = React.useState<any>("En refugio");
  const [esterilizado, setEsterilizado] = React.useState<any>("");
  const [genero, setGenero] = React.useState<any>("");
  const [tipo, setTipo] = React.useState<any>("");
  const [observacion, setObservacion] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");
  const [file, setFile] = React.useState<any>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const validate = () => {
    const faltantes: string[] = [];
    if (!nombre.trim()) faltantes.push("Nombre");
    if (!tamano) faltantes.push("Tamaño");
    if (!genero) faltantes.push("Genero");
    if (!tipo) faltantes.push("Tipo");
    return faltantes;
  };

  const createColitas = async () => {
    const faltantes = validate();
    if (faltantes.length > 0) {
      setSeverity("warning");
      setMssg(`Completa los campos obligatorios: ${faltantes.join(", ")}`);
      setOpenAlert(true);
      return;
    }
    const url = baseurl + "colitas/create";
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("idtipoanimal", tipo);
    formData.append("idadopcion", "");
    formData.append("idgenero", genero);
    formData.append("tamano", tamano);
    formData.append("peso", peso);
    formData.append("Edada_Aprox", edad);
    formData.append("foto", file);
    formData.append("observaciones", observacion);
    formData.append("estado", estado);
    formData.append("esterelizacion", esterilizado);
    const fechaActual = new Date().toISOString();
    formData.append("fechaRegistro", fechaActual);
    // No mandamos la fecha "pelada" (00:00:00): en el límite de medianoche,
    // la conversión de zona horaria del servidor puede correr el día
    // guardado al siguiente (por eso "Blanquita" se guardó como 02-08 en vez
    // de 01-08). Con una hora del día de por medio, ese salto no ocurre.
    formData.append("Fecha_Ingreso", formatlocaldate(dateTo));
    const response: any = await axios.post(url, formData);
    const { data } = response;
    if (data.code === "000") {
      saveAuditoria();
      setSeverity("success");
      setMssg(data.message);
      setOpenAlert(true);
      getAlbergados();
      setTimeout(() => {
        setOpenModal(false);
      }, 1800);
    } else {
      setSeverity("error");
      setMssg(data.message);
      setOpenAlert(true);
    }
  };

  const saveAuditoria = async () => {
    const id = localStorage.getItem("auditoria");
    let fecha = moment(new Date()).add(5, "hours").format("YYYY-MM-DD HH:mm:ss");
    const body = {
      modulo: "colitas",
      fechaRegistro: fecha,
    };

    const url = baseurl + "auditoria/update/" + id;
    const response = await axios.put(url, body);
    const { data } = response;
    console.log(data);
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
            <PetsIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Agregar Colita
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModal(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <TextField
              label="Nombre *"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setNombre(e.target.value)}
            />
            <Chip label={`Estado: ${estado}`} size="small" color="info" />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="tamano-select-label">Tamaño *</InputLabel>
              <Select
                labelId="tamano-select-label"
                label="Tamaño *"
                defaultValue=""
                onChange={(e) => setTamano(e.target.value)}
              >
                <MenuItem value="mediano">Mediano</MenuItem>
                <MenuItem value="pequeño">Pequeño</MenuItem>
                <MenuItem value="grande">Grande</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Peso (kg)"
              variant="outlined"
              type="number"
              fullWidth
              size="small"
              onChange={(e) => setPeso(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Edad (años)"
              variant="outlined"
              type="number"
              fullWidth
              size="small"
              onChange={(e) => setEdad(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="esterilizado-select-label">Esterilizado</InputLabel>
              <Select
                labelId="esterilizado-select-label"
                label="Esterilizado"
                defaultValue=""
                onChange={(e) => setEsterilizado(e.target.value)}
              >
                <MenuItem value="si">Si</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="genero-select-label">Genero *</InputLabel>
              <Select
                labelId="genero-select-label"
                label="Genero *"
                defaultValue=""
                onChange={(e) => setGenero(e.target.value)}
              >
                <MenuItem value="1">Macho</MenuItem>
                <MenuItem value="2">Hembra</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-select-label">Tipo *</InputLabel>
              <Select
                labelId="tipo-select-label"
                label="Tipo *"
                defaultValue=""
                onChange={(e) => setTipo(e.target.value)}
              >
                <MenuItem value="1">Gato</MenuItem>
                <MenuItem value="2">Perro</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
              Fecha de ingreso
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

          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
              Observaciones
            </Typography>
            <textarea
              placeholder="Ingrese Observaciones"
              onChange={(e) => setObservacion(e.target.value)}
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

          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
              Foto
            </Typography>
            <input
              type="file"
              accept="image/*"
              style={{
                border: "1px solid var(--cya-border)",
                padding: "8px",
                width: "100%",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
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
        <Button onClick={createColitas} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Guardar
        </Button>
      </Box>
    </>
  );
}
