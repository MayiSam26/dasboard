import {
  Alert,
  Box,
  Button,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import Body from "../../components/Layout/Body";
import Content from "../../components/Layout/Content";
import Layout from "../../components/Layout/Index";
import Navar from "../../components/Navar";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";
import axios from "axios";
import baseurl from "../../../Config/axios";
import { useNavigate } from "react-router-dom";

interface Permiso {
  rol: string;
  seccion: string;
  visible: boolean;
}

// Mismas claves y etiquetas que las secciones "configurable" de Navar.tsx.
const SECCIONES: { key: string; label: string }[] = [
  { key: "refugio", label: "Refugio (Información, Red Social, Noticias)" },
  { key: "colitas", label: "Colitas" },
  { key: "perdidos", label: "Mascotas Perdidas" },
  { key: "veterinaria", label: "Veterinaria" },
  { key: "adopcion", label: "Adopción" },
  { key: "donaciones", label: "Donaciones" },
  { key: "reportes", label: "Reportes" },
];

const ROLES: string[] = ["Voluntario", "Veterinario"];

export default function Permisos() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const rol = localStorage.getItem("rol");
    if (rol && rol !== "Administrador") {
      navigate("/panel");
    }
  }, [navigate]);

  const [matriz, setMatriz] = React.useState<Permiso[]>([]);
  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getPermisos = async () => {
    const url = baseurl + "permisos/list";
    await axios
      .get(url)
      .then((response) => {
        const { data } = response.data;
        setMatriz(data || []);
      })
      .catch(() => setMatriz([]));
  };

  React.useEffect(() => {
    getPermisos();
  }, []);

  const isVisible = (rol: string, seccion: string) =>
    matriz.find((p) => p.rol === rol && p.seccion === seccion)?.visible ?? false;

  const toggle = (rol: string, seccion: string) => {
    setMatriz((prev) => {
      const existe = prev.some((p) => p.rol === rol && p.seccion === seccion);
      if (existe) {
        return prev.map((p) =>
          p.rol === rol && p.seccion === seccion ? { ...p, visible: !p.visible } : p
        );
      }
      return [...prev, { rol, seccion, visible: true }];
    });
  };

  const guardar = async () => {
    const url = baseurl + "permisos/update";
    try {
      const response = await axios.put(url, { permisos: matriz });
      const { data } = response;
      if (data.code === "000") {
        setSeverity("success");
        setMssg(data.message);
        setOpenAlert(true);
        getPermisos();
      } else {
        setSeverity("error");
        setMssg(data.message);
        setOpenAlert(true);
      }
    } catch (e: any) {
      setSeverity("error");
      setMssg(e?.response?.data?.message || e.message || "No se pudo guardar.");
      setOpenAlert(true);
    }
  };

  return (
    <>
      <Layout>
        <Navar />
        <Content>
          <Header />
          <Body>
            {openAlert && (
              <Alert variant="filled" severity={severity} sx={{ mb: 2 }} onClose={() => setOpenAlert(false)}>
                {mssg}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h4">Permisos de Roles</Typography>
                  <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mt: 0.3 }}>
                    Elige qué módulos puede ver cada rol en el panel. Administrador siempre ve todo.
                  </Typography>
                </Box>
                <Button
                  className="cya-btn-add"
                  onClick={guardar}
                  variant="contained"
                  startIcon={<SaveIcon />}
                >
                  Guardar
                </Button>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "10px" }}>
                <Box className="cya-table-card" sx={{ width: "100%" }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Módulo</TableCell>
                          {ROLES.map((rol) => (
                            <TableCell key={rol} align="center" sx={{ fontWeight: 700 }}>
                              {rol}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {SECCIONES.map((seccion) => (
                          <TableRow key={seccion.key}>
                            <TableCell>{seccion.label}</TableCell>
                            {ROLES.map((rol) => (
                              <TableCell key={rol} align="center">
                                <Checkbox
                                  checked={isVisible(rol, seccion.key)}
                                  onChange={() => toggle(rol, seccion.key)}
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            </Grid>
          </Body>
        </Content>
      </Layout>
    </>
  );
}
