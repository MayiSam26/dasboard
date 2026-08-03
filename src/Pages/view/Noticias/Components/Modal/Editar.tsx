import {
  Alert,
  Avatar,
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
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArticleIcon from "@mui/icons-material/Article";
import moment from "moment";

interface props {
  setOpenModalEdit: any;
  idNoticia: any;
  getNoticias: () => void;
}

function buildImgUrl(imagen: string) {
  const cleanBase = baseurl.replace(/\/+$/, "");
  const cleanImg = (imagen || "").replace(/\\/g, "/").replace(/^\/+/, "");
  return `${cleanBase}/${cleanImg}`;
}

export default function Editar({ setOpenModalEdit, idNoticia, getNoticias }: props) {
  const [titulo, setTitulo] = React.useState<string>("");
  const [resumen, setResumen] = React.useState<string>("");
  const [contenido, setContenido] = React.useState<string>("");
  const [estado, setEstado] = React.useState<string>("Borrador");
  const [fecha, setFecha] = React.useState<string>("");
  const [imagenActual, setImagenActual] = React.useState<string>("");
  const [file, setFile] = React.useState<File | null>(null);

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async () => {
    const url = baseurl + "noticias/detail/" + idNoticia;
    await axios.get(url).then((response) => {
      const { data } = response.data;
      setTitulo(data?.titulo || "");
      setResumen(data?.resumen || "");
      setContenido(data?.contenido || "");
      setEstado(data?.Estado || "Borrador");
      setFecha(data?.fecha_publicacion ? moment(data.fecha_publicacion).format("YYYY-MM-DD") : "");
      setImagenActual(data?.imagen || "");
    });
  };

  useEffect(() => {
    getById();
  }, []);

  const actualizar = async () => {
    if (!titulo.trim() || !contenido.trim()) {
      setSeverity("error");
      setMssg("El título y el contenido son obligatorios.");
      setOpenAlert(true);
      return;
    }
    const url = baseurl + "noticias/update/" + idNoticia;
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("resumen", resumen);
    formData.append("contenido", contenido);
    formData.append("Estado", estado);
    formData.append("fecha_publicacion", fecha);
    if (file) formData.append("imagen", file);

    await axios
      .put(url, formData)
      .then((response) => {
        const { data } = response;
        if (data.code === "000") {
          setSeverity("success");
          setMssg(data.message);
          setOpenAlert(true);
          setTimeout(() => {
            setOpenModalEdit(false);
            getNoticias();
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
            <ArticleIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Editar Noticia
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModalEdit(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Título"
              variant="outlined"
              fullWidth
              size="small"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Resumen (opcional)"
              variant="outlined"
              fullWidth
              size="small"
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contenido"
              variant="outlined"
              fullWidth
              size="small"
              multiline
              minRows={5}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select value={estado} label="Estado" onChange={(e) => setEstado(e.target.value)}>
                <MenuItem value="Borrador">Borrador</MenuItem>
                <MenuItem value="Publicado">Publicado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Fecha de publicación"
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {imagenActual && (
                <Avatar
                  src={buildImgUrl(imagenActual)}
                  variant="rounded"
                  sx={{ width: 56, height: 56, border: "1px solid var(--cya-border)" }}
                />
              )}
              <Button component="label" variant="outlined" startIcon={<AttachFileIcon />} sx={{ textTransform: "none" }}>
                {file ? file.name : "Cambiar imagen de portada"}
                <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </Button>
            </Box>
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
