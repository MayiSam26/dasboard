import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, TextField, Typography, Box } from "@mui/material";
import axios from "axios";
import Header from "../../components/Header";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import baseurl from "../../../Config/axios";

export default function MiCuenta() {
  const navigate = useNavigate();
  const [pregunta, setPregunta] = React.useState("");
  const [respuesta, setRespuesta] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ ok: boolean; message: string } | null>(null);

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
