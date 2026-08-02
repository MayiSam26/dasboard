import { Visibility, VisibilityOff, Pets, PersonOutline, LockOutlined } from "@mui/icons-material";
import { Alert, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import { UserSessionContext } from "../Config/Context";
import axios from "axios";
import baseurl from "../Config/axios";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import formatlocaldate from "../Config/helpersDate";
import { setAuthHeader } from "../Config/axiosSetup";

export default function Home() {
  const navigate = useNavigate();
  const { login } = useContext(UserSessionContext);
  const [usuario, setUsuario] = useState<any>("");
  const [pass, setPass] = useState<any>("");
  const [showPassword, setShowPassword] = React.useState<any>(false);
  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleLogin = async () => {
    try {
      setOpenAlert(false);
      setLoading(true);
      const body = {
        usuario: usuario,
        pass: pass
      };

      const url = baseurl + "session-user";
      const response = await axios.post(url, body);
      const { data } = response;

      if (data.code === '000') {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", data.usuario);
          setAuthHeader(data.token);
        }

        // Intenta guardar auditoría sin bloquear el flujo si falla
        await saveAuditoria();

        // Redirección directa al panel
        window.location.href = "/panel";
      } else {
        setOpenAlert(true);
        setSeverity('error');
        setMssg(data.message || 'Contraseña incorrecta o usuario incorrecto');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setOpenAlert(true);
      setSeverity('error');
      setMssg('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  const saveAuditoria = async () => {
    try {
      const fecha = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

      const body = {
        fechaInicio: formatlocaldate(new Date()),
        modulo: "Login",
        fechaRegistro: fecha,
        resultado: null
      };

      const url = baseurl + "auditoria";
      const token = localStorage.getItem("token");

      const response = await axios.post(url, body, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { data } = response;
      if (data && data.data && data.data.idauditoria) {
        localStorage.setItem("auditoria", data.data.idauditoria);
      }
    } catch (error) {
      console.error("Error no bloqueante al guardar auditoría:", error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show: any) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const alert = () => {
    return (
      <Alert variant="filled" severity={severity}>
        {mssg}
      </Alert>
    );
  };

  return (
    <div className="cya-login-shell">
      <div
        className="cya-login-panel"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(10, 12, 14, 0.35) 0%, rgba(10, 12, 14, 0.72) 100%), url(/images/login-bg.jpg)",
        }}
      >
        <img src="/images/logocito.png" alt="Refugio Colitas y Amor" />
        <h1>Refugio Colitas &amp; Amor</h1>
        <p>
          Panel administrativo del refugio: gestiona adopciones, donantes,
          mascotas y el día a día del refugio desde un solo lugar.
        </p>
      </div>

      <div className="cya-login-form-side">
        <div className="cya-login-card">
          {openAlert ? alert() : null}

          <div className="text-center mb-4">
            <div className="cya-login-icon-badge">
              <Pets />
            </div>
            <h4 className="pb-0">Bienvenido</h4>
            <p className="text-muted mb-0">
              Ingresa tu usuario y contraseña para continuar
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="mb-3">
              <TextField
                fullWidth
                id="outlined-basic"
                size="small"
                label="Ingresa tu Usuario"
                variant="outlined"
                onChange={(e) => setUsuario(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="mb-4">
              <FormControl
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Contraseña
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  size='small'
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPass(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Contraseña"
                />
              </FormControl>
            </div>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ textTransform: 'none' }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>

            <p className="text-center mt-3 mb-0">
              <Link to="/recuperar-clave">¿Olvidaste tu contraseña?</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
