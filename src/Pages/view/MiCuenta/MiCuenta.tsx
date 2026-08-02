import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Avatar, Box, Button, Divider, IconButton, TextField, Typography } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import Header from "../../components/Header";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import baseurl from "../../../Config/axios";
import { themePresets, getSavedThemeId, saveTheme, ThemePreset } from "../../../Config/themePresets";

function buildImgUrl(foto: string) {
  const cleanBase = baseurl.replace(/\/+$/, "");
  const cleanFoto = (foto || "").replace(/\\/g, "/").replace(/^\/+/, "");
  return `${cleanBase}/${cleanFoto}`;
}

export default function MiCuenta() {
  const navigate = useNavigate();
  const [pregunta, setPregunta] = React.useState("");
  const [respuesta, setRespuesta] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ ok: boolean; message: string } | null>(null);

  const [foto, setFoto] = React.useState<string | null>(localStorage.getItem("userFoto"));
  const [subiendoFoto, setSubiendoFoto] = React.useState(false);
  const [fotoError, setFotoError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [selectedThemeId, setSelectedThemeId] = React.useState(getSavedThemeId());

  const handleSelectTheme = (preset: ThemePreset) => {
    saveTheme(preset);
    setSelectedThemeId(preset.id);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.post(baseurl + "usuario/pregunta", { pregunta, respuesta });
      setResult({ ok: data.code === "000", message: data.message });
      if (data.code === "000") setRespuesta("");
    } catch (err: any) {
      setResult({
        ok: false,
        message: err?.response?.data?.message || "No se pudo guardar. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFotoError("");
    setSubiendoFoto(true);

    const formData = new FormData();
    formData.append("foto", file);

    try {
      const { data } = await axios.post(baseurl + "usuario/foto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.code === "000") {
        setFoto(data.data.foto);
        localStorage.setItem("userFoto", data.data.foto);
        // El header no comparte estado con esta página; recargamos para
        // que la nueva foto se vea también ahí.
        setTimeout(() => window.location.reload(), 700);
      } else {
        setFotoError(data.message);
      }
    } catch (err: any) {
      setFotoError(err?.response?.data?.message || "No se pudo subir la foto.");
    } finally {
      setSubiendoFoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <Navar />
      <Content>
        <Header />
        <Body>
          <Box sx={{ maxWidth: 480, mx: "auto", mt: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Mi cuenta
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 3 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={foto ? buildImgUrl(foto) : undefined}
                  sx={{ width: 96, height: 96, bgcolor: "#3F9E5C", fontSize: "2rem" }}
                >
                  {(localStorage.getItem("user") || "?").charAt(0).toUpperCase()}
                </Avatar>
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={subiendoFoto}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#E4602F",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#C74E23" },
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFotoChange}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subiendoFoto ? "Subiendo foto..." : "Haz clic en el ícono para cambiar tu foto"}
              </Typography>
              {fotoError && (
                <Alert severity="error" sx={{ mt: 1, width: "100%" }}>
                  {fotoError}
                </Alert>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Apariencia
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Elige la paleta de colores del panel administrativo.
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 3 }}>
              {themePresets.map((preset) => (
                <Box
                  key={preset.id}
                  title={preset.name}
                  onClick={() => handleSelectTheme(preset)}
                  className={`cya-theme-swatch${selectedThemeId === preset.id ? " cya-selected" : ""}`}
                  sx={{
                    background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.secondary} 50%)`,
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Pregunta secreta
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Configura tu pregunta secreta para poder recuperar tu contraseña
              sin depender de un administrador.
            </Typography>

            {result && (
              <Alert severity={result.ok ? "success" : "error"} sx={{ mb: 2 }}>
                {result.message}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                required
                size="small"
                label="Tu pregunta secreta"
                placeholder="Ej: ¿Cuál es el nombre de tu primera mascota?"
                sx={{ mb: 2 }}
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
              />
              <TextField
                fullWidth
                required
                size="small"
                label="Respuesta"
                sx={{ mb: 3 }}
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
              />
              <Button type="submit" variant="contained" disabled={loading} sx={{ textTransform: "none" }}>
                {loading ? "Guardando..." : "Guardar pregunta secreta"}
              </Button>
            </form>
          </Box>
        </Body>
      </Content>
    </Layout>
  );
}
