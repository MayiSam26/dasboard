import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import baseurl from "../Config/axios";

type Step = "usuario" | "pregunta" | "sin-pregunta" | "nueva-clave" | "listo";

export default function RecuperarClave() {
  const [step, setStep] = React.useState<Step>("usuario");
  const [usuario, setUsuario] = React.useState("");
  const [pregunta, setPregunta] = React.useState("");
  const [respuesta, setRespuesta] = React.useState("");
  const [resetToken, setResetToken] = React.useState("");
  const [nuevaPassword, setNuevaPassword] = React.useState("");
  const [confirmarPassword, setConfirmarPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [mensajeSinPregunta, setMensajeSinPregunta] = React.useState("");

  const handleBuscarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(baseurl + "recuperar/pregunta", { usuario });
      if (data.code === "000") {
        setPregunta(data.data.pregunta);
        setStep("pregunta");
      } else {
        setMensajeSinPregunta(data.message);
        setStep("sin-pregunta");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarRespuesta = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(baseurl + "recuperar/verificar", { usuario, respuesta });
      if (data.code === "000") {
        setResetToken(data.data.resetToken);
        setStep("nueva-clave");
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(baseurl + "recuperar/reset", {
        resetToken,
        nuevaPassword,
      });
      if (data.code === "000") {
        setStep("listo");
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cya-login-shell">
      <div
        className="cya-login-panel"
        style={{
          backgroundImage:
            "linear-gradient(155deg, rgba(228, 96, 47, 0.85) 0%, rgba(63, 158, 92, 0.85) 100%), url(/images/login-bg.jpg)",
        }}
      >
        <img src="/images/logocito.png" alt="Refugio Colitas y Amor" />
        <h1>Recuperar contraseña</h1>
        <p>Responde tu pregunta secreta para volver a acceder al panel.</p>
      </div>

      <div className="cya-login-form-side">
        <div className="cya-login-card">
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {step === "usuario" && (
            <form onSubmit={handleBuscarUsuario}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                ¿Cuál es tu usuario?
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Te mostraremos tu pregunta secreta para verificar que eres tú.
              </Typography>
              <TextField
                fullWidth
                required
                size="small"
                label="Usuario"
                sx={{ mb: 3 }}
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
              <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ textTransform: "none" }}>
                {loading ? "Buscando..." : "Continuar"}
              </Button>
              <Typography sx={{ mt: 3, textAlign: "center" }}>
                <Link to="/">Volver a iniciar sesión</Link>
              </Typography>
            </form>
          )}

          {step === "sin-pregunta" && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                No podemos recuperarla automáticamente
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {mensajeSinPregunta}
              </Typography>
              <Link to="/">Volver a iniciar sesión</Link>
            </>
          )}

          {step === "pregunta" && (
            <form onSubmit={handleVerificarRespuesta}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Tu pregunta secreta
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {pregunta}
              </Typography>
              <TextField
                fullWidth
                required
                size="small"
                label="Tu respuesta"
                sx={{ mb: 3 }}
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
              />
              <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ textTransform: "none" }}>
                {loading ? "Verificando..." : "Verificar respuesta"}
              </Button>
            </form>
          )}

          {step === "nueva-clave" && (
            <form onSubmit={handleResetPassword}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Elige tu nueva contraseña
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                <InputLabel htmlFor="nueva-password">Nueva contraseña</InputLabel>
                <OutlinedInput
                  id="nueva-password"
                  size="small"
                  type={showPassword ? "text" : "password"}
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Nueva contraseña"
                />
              </FormControl>
              <TextField
                fullWidth
                required
                size="small"
                type={showPassword ? "text" : "password"}
                label="Confirmar contraseña"
                sx={{ mb: 3 }}
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
              />
              <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ textTransform: "none" }}>
                {loading ? "Guardando..." : "Guardar nueva contraseña"}
              </Button>
            </form>
          )}

          {step === "listo" && (
            <>
              <Alert severity="success" sx={{ mb: 3 }}>
                Tu contraseña fue actualizada correctamente.
              </Alert>
              <Button fullWidth variant="contained" component={Link} to="/" sx={{ textTransform: "none" }}>
                Ir a iniciar sesión
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
