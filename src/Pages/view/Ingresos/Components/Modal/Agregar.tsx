import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { soloDecimal } from "../../../../../utils/campos";
interface props {
  setOpenModal: any;
  getIngresos: () => void;
  getReportes: () => void;
}

interface autocomplete {
  label: string;
  value: any;
}
export default function Agregar({
  setOpenModal,
  getIngresos,
  getReportes,
}: props) {
  const [donante, setDonante] = React.useState<autocomplete[]>([]);
  const [monto, setMonto] = React.useState<any>("");
  const [suministro, setSuministro] = React.useState<any>("");

  const [donateSelect, setDonateSelect] = React.useState<any>("");
  const [donacion, setDonacion] = React.useState<any>("");
  const [tipoyape, setTipoYape] = React.useState<any>("");
  const [file, setFile] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);
  const [sending, setSending] = React.useState<boolean>(false);
  const [confirmar, setConfirmar] = React.useState<boolean>(false);

  // El ingreso no se puede editar ni eliminar después de guardarlo (así se
  // evita la malversación de registros), por eso se pide una confirmación
  // explícita antes de mandarlo. Se valida primero para no preguntar por
  // datos que igual iban a ser rechazados.
  const intentarGuardar = () => {
    if (!donateSelect || !monto || Number(monto) <= 0 || !suministro || !donacion || !tipoyape || !dateTo) {
      setSeverity("warning");
      setMssg("Completa el donante, el monto, la fecha y todos los campos obligatorios.");
      setOpenAlert(true);
      return;
    }
    setConfirmar(true);
  };

  const createData = async () => {
    setConfirmar(false);
    setSending(true);
    const url = baseurl + "ingresos/create";
    const formData = new FormData();
    formData.append("iddonantes", donateSelect);
    formData.append("monto", monto);
    formData.append("suministro", suministro);
    formData.append("fecha_registro", dateTo);
    formData.append("donacion", donacion);
    formData.append("pago", tipoyape);
    formData.append("evidencia", file);

    //const fechaActual = new Date().toISOString();
    //formData.append("fechaRegistro", fechaActual);
    //formData.append("Fecha_Ingreso", dateTo);
    try {
      const response: any = await axios.post(url, formData);
      const { data } = response;
      if (data.code === "000") {
        setSeverity("success");
        setMssg(data.message);
        getReportes();
        setOpenAlert(true);
        getIngresos();
        setTimeout(() => {
          setOpenModal(false);
        }, 1800);
      } else {
        setSeverity("error");
        setMssg(data.message);
        setOpenAlert(true);
      }
    } catch (e: any) {
      setSeverity("error");
      setMssg(e?.response?.data?.message || e.message || "No se pudo guardar.");
      setOpenAlert(true);
    } finally {
      setSending(false);
    }
  };

  const getDonante = async () => {
    const url = baseurl + "donante/list";
    await axios.get(url).then((response) => {
      const { data } = response;

      const autocompletes: autocomplete[] = [];
      data.data.map((item: any) => {
        const dates = {
          label: item.fullname,
          value: item.iddonantes,
        };
        autocompletes.push(dates);
      });

      setDonante(autocompletes);
    })
    .catch(() => setDonante([]));
  };

  const handleDonantes = (
    event: React.ChangeEvent<{}>,
    newValue: autocomplete | null
  ) => {
    if (newValue) {
      setDonateSelect(newValue.value);
    } else {
      setDonateSelect(null);
    }
  };

  useEffect(() => {
    getDonante();
  }, []);
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
            Agregar Nuevo Ingreso
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModal(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={donante}
              value={donante.find((item) => item.value === donateSelect) ?? null}
              size="small"
              fullWidth
              renderInput={(params) => <TextField {...params} label="Donantes" />}
              onChange={handleDonantes}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Monto (S/)"
              variant="outlined"
              fullWidth
              type="text"
              inputProps={{ inputMode: "decimal" }}
              size="small"
              value={monto ?? ""}
              onChange={(e) => setMonto(soloDecimal(e.target.value))}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="suministro-label">¿Es Suministro?</InputLabel>
              <Select
                labelId="suministro-label"
                id="suministro-select"
                value={suministro}
                label="¿Es Suministro?"
                onChange={(e) => setSuministro(e.target.value)}
              >
                <MenuItem value="Sí">Sí</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="donacion-label">Donación</InputLabel>
              <Select
                labelId="donacion-label"
                defaultValue=""
                label="Donación"
                onChange={(e) => setDonacion(e.target.value)}
              >
                <MenuItem value="monetaria">Monetaria</MenuItem>
                <MenuItem value="comida">Comida</MenuItem>
                <MenuItem value="otros">Otros</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-pago-label">Tipo de pago</InputLabel>
              <Select
                labelId="tipo-pago-label"
                defaultValue=""
                label="Tipo de pago"
                onChange={(e) => setTipoYape(e.target.value)}
              >
                <MenuItem value="yape">Yape</MenuItem>
                <MenuItem value="plin">Plin</MenuItem>
                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                <MenuItem value="ninguna">Ninguna</MenuItem>
              </Select>
            </FormControl>
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
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
              Evidencia
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
        <Button onClick={intentarGuardar} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add" disabled={sending}>
          {sending ? "Guardando..." : "Guardar"}
        </Button>
      </Box>

      <Dialog
        open={confirmar}
        onClose={() => setConfirmar(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "var(--cya-radius-lg)" } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.2, pb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(201, 154, 46, 0.16)",
              color: "#B85C00",
              flexShrink: 0,
            }}
          >
            <WarningAmberIcon fontSize="small" />
          </Box>
          <Typography component="span" variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Confirmar registro
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "var(--cya-dark)", mb: 1.5 }}>
            ¿Estás segura de que los datos están correctamente registrados?
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: "var(--cya-radius-md)" }}>
            Ten en cuenta que después <strong>no se podrá editar ni eliminar</strong> este ingreso.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setConfirmar(false)}
            sx={{ textTransform: "none", color: "var(--cya-text-muted)" }}
          >
            No, revisar
          </Button>
          <Button onClick={createData} variant="contained" className="cya-btn-add" startIcon={<SaveIcon />}>
            Sí, guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
