import {
  Alert,
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import React from "react";
import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {
  soloDigitos,
  propsNumericos,
  telefonoValido,
  correoValido,
  LARGO_TELEFONO,
  AYUDA_TELEFONO,
} from "../../../../../utils/campos";

interface props {
  setOpenModalEdit: any;
  usuarioSeleccionado: any;
  getUsuarios: () => void;
}

export default function Editar({ setOpenModalEdit, usuarioSeleccionado, getUsuarios }: props) {
  const [correo, setCorreo] = React.useState<string>(usuarioSeleccionado?.correo || "");
  const [rol, setRol] = React.useState<string>(usuarioSeleccionado?.rol || "");
  const [nombres, setNombres] = React.useState<string>(usuarioSeleccionado?.nombres || "");
  const [apellidos, setApellidos] = React.useState<string>(usuarioSeleccionado?.apellidos || "");
  const [telefono, setTelefono] = React.useState<string>(usuarioSeleccionado?.telefono || "");

  const [cambiarPass, setCambiarPass] = React.useState<boolean>(false);
  const [nuevaPassword, setNuevaPassword] = React.useState<string>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const actualizar = async () => {
    if (!correo.trim() || !rol) {
      setSeverity("error");
      setMssg("Completa el correo y el rol.");
      setOpenAlert(true);
      return;
    }
    if (!correoValido(correo.trim())) {
      setSeverity("error");
      setMssg("Ingresa un correo electrónico válido.");
      setOpenAlert(true);
      return;
    }
    if (!telefonoValido(telefono)) {
      setSeverity("error");
      setMssg("El teléfono debe tener 9 dígitos numéricos.");
      setOpenAlert(true);
      return;
    }
    if (cambiarPass && nuevaPassword.length < 4) {
      setSeverity("error");
      setMssg("La nueva contraseña debe tener al menos 4 caracteres.");
      setOpenAlert(true);
      return;
    }

    const url = baseurl + "usuario/update/" + usuarioSeleccionado.iduser;
    const body = {
      correo: correo.trim(),
      rol,
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      telefono: telefono.trim(),
    };

    try {
      const { data } = await axios.put(url, body);
      if (data.code !== "000") {
        setSeverity("error");
        setMssg(data.message);
        setOpenAlert(true);
        return;
      }

      if (cambiarPass) {
        const urlPass = baseurl + "usuario/password/" + usuarioSeleccionado.iduser;
        const { data: dataPass } = await axios.put(urlPass, { nuevaPassword });
        if (dataPass.code !== "000") {
          setSeverity("error");
          setMssg(dataPass.message);
          setOpenAlert(true);
          return;
        }
      }

      setSeverity("success");
      setMssg("Usuario actualizado correctamente");
      setOpenAlert(true);
      setTimeout(() => {
        setOpenModalEdit(false);
        getUsuarios();
      }, 1500);
    } catch (e: any) {
      setSeverity("error");
      setMssg(e?.response?.data?.message || e.message);
      setOpenAlert(true);
    }
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
            <ManageAccountsIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Editar Usuario
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModalEdit(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombres"
              variant="outlined"
              fullWidth
              size="small"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellidos"
              variant="outlined"
              fullWidth
              size="small"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nombre de usuario"
              variant="outlined"
              fullWidth
              size="small"
              value={usuarioSeleccionado?.usuario || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <TextField
              label="Correo electrónico"
              type="email"
              variant="outlined"
              fullWidth
              size="small"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Teléfono"
              variant="outlined"
              fullWidth
              size="small"
              helperText={AYUDA_TELEFONO}
              inputProps={propsNumericos(LARGO_TELEFONO)}
              value={telefono}
              onChange={(e) => setTelefono(soloDigitos(e.target.value, LARGO_TELEFONO))}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Rol</InputLabel>
              <Select value={rol} label="Rol" onChange={(e) => setRol(e.target.value)}>
                <MenuItem value="Administrador">Administrador</MenuItem>
                <MenuItem value="Voluntario">Voluntario</MenuItem>
                <MenuItem value="Veterinario">Veterinario</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={cambiarPass}
                  onChange={(e) => {
                    setCambiarPass(e.target.checked);
                    if (!e.target.checked) setNuevaPassword("");
                  }}
                />
              }
              label="Cambiar contraseña"
            />
            <Collapse in={cambiarPass}>
              <TextField
                label="Nueva contraseña"
                type="password"
                variant="outlined"
                fullWidth
                size="small"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                helperText="Mínimo 4 caracteres. Solo el Administrador puede hacer esto."
                sx={{ mt: 1 }}
              />
            </Collapse>
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
