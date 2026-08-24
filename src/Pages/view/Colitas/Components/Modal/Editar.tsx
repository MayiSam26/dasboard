import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
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
import CloseIcon from "@mui/icons-material/Close";
import PetsIcon from "@mui/icons-material/Pets";
import SaveIcon from "@mui/icons-material/Save";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import { soloDecimal, soloDigitos } from "../../../../../utils/campos";
import {
  ESTADOS,
  GENEROS,
  MOTIVOS_SUGERIDOS,
  TAMANOS,
  TIPOS,
  exigeMotivo,
} from "../../constantes";

function buildImgUrl(foto: string) {
  const cleanBase = baseurl.replace(/\/+$/, "");
  const cleanFoto = (foto || "").replace(/\\/g, "/").replace(/^\/+/, "");
  return `${cleanBase}/${cleanFoto}`;
}

/** "2026-08-24T00:00:00.000Z" | Date -> "2026-08-24" para los <input type=date>. */
function soloFecha(valor: any): string {
  if (!valor) return "";
  const s = String(valor);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

interface props {
  setOpenModalEdit?: any;
  idAnimal?: any;
  getAlbergados: () => void;
}
export default function Editar({
  setOpenModalEdit,
  idAnimal,
  getAlbergados,
}: props) {
  const [file, setFile] = React.useState<any>("");
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const previewUrlRef = React.useRef<string>("");
  const [foto, setFoto] = React.useState("");
  const [fotoError, setFotoError] = React.useState(false);

  // Al elegir un archivo nuevo se genera una URL local para previsualizarlo
  // de inmediato, sin esperar a que el servidor confirme la subida. Se
  // libera la URL anterior (la del propio cambio y la que quede al
  // desmontar el modal) para no acumular memoria.
  const handleFileChange = (selected: File | null) => {
    setFile(selected);
    setFotoError(false);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextUrl = selected ? URL.createObjectURL(selected) : "";
    previewUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const [nombre, setNombre] = React.useState("");
  const [tipo, setTipo] = React.useState("");
  const [genero, setGenero] = React.useState("");
  const [tamano, setTamano] = React.useState("");
  const [peso, setPeso] = React.useState("");
  const [fechaIngreso, setFechaIngreso] = React.useState("");

  // Edad: o se conoce la fecha exacta de nacimiento, o se declara una edad
  // aproximada. El servidor guarda siempre una fecha, así que la edad avanza
  // sola en los dos casos.
  const [conoceNacimiento, setConoceNacimiento] = React.useState(false);
  const [fechaNacimiento, setFechaNacimiento] = React.useState("");
  const [edadAprox, setEdadAprox] = React.useState("");
  const [edadActual, setEdadActual] = React.useState("");

  const [observaciones, setObservaciones] = React.useState("");
  const [esterelizado, setEsterilizado] = React.useState("");
  const [estado, setEstado] = React.useState("");
  const [motivoEstado, setMotivoEstado] = React.useState("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async (id: any) => {
    const url = baseurl + "colitas/detail/" + id;
    axios.get(url).then((response) => {
      const d = response.data.data;
      if (!d) return;
      setFoto(d.foto);
      setNombre(d.nombre ?? "");
      setTipo(d.idtipoanimal != null ? String(d.idtipoanimal) : "");
      setGenero(d.idgenero != null ? String(d.idgenero) : "");
      setTamano(d.tamano ?? "");
      setPeso(d.peso != null ? String(d.peso) : "");
      setFechaIngreso(soloFecha(d.Fecha_Ingreso));
      setObservaciones(d.observaciones ?? "");
      setEsterilizado(d.esterelizacion ?? "");
      setEstado(d.estado ?? "");
      setMotivoEstado(d.motivo_estado ?? "");
      setEdadActual(d.edad_texto ?? "");
      setConoceNacimiento(Boolean(d.nacimiento_exacto));
      setFechaNacimiento(soloFecha(d.fecha_nacimiento));
      setEdadAprox(d.Edada_Aprox != null ? String(d.Edada_Aprox) : "");
    });
  };
  useEffect(() => {
    getById(idAnimal);
  }, [idAnimal]);

  const avisar = (tipoAviso: string, texto: string) => {
    setSeverity(tipoAviso);
    setMssg(texto);
    setOpenAlert(true);
  };

  const updateData = async () => {
    if (!nombre.trim()) return avisar("error", "El nombre no puede quedar vacío.");
    if (exigeMotivo(estado) && !motivoEstado.trim()) {
      return avisar("error", `Para marcar la mascota como "${estado}" hay que indicar el motivo.`);
    }
    if (conoceNacimiento && !fechaNacimiento) {
      return avisar("error", "Indica la fecha de nacimiento o desmarca la casilla.");
    }

    const url = baseurl + "colitas/update/" + idAnimal;
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("idtipoanimal", tipo);
    formData.append("idgenero", genero);
    formData.append("tamano", tamano);
    formData.append("peso", peso);
    formData.append("esterelizacion", esterelizado);
    formData.append("observaciones", observaciones);
    formData.append("estado", estado);
    formData.append("motivo_estado", exigeMotivo(estado) ? motivoEstado : "");
    if (fechaIngreso) formData.append("Fecha_Ingreso", fechaIngreso);
    // Solo se manda uno de los dos: el servidor deduce la fecha cuando llega
    // la edad aproximada.
    if (conoceNacimiento) {
      formData.append("fecha_nacimiento", fechaNacimiento);
    } else if (edadAprox !== "") {
      formData.append("Edada_Aprox", edadAprox);
    }
    if (file) formData.append("foto", file);

    axios
      .put(url, formData)
      .then((response: any) => {
        const { data } = response;
        if (data.code === "000") {
          avisar("success", data.message);
          setTimeout(() => {
            setOpenModalEdit(false);
            getAlbergados();
          }, 1500);
        } else {
          avisar("error", data.message || "No se pudo actualizar.");
        }
      })
      .catch((e) => {
        avisar("error", e?.response?.data?.message || e.message || "No se pudo actualizar.");
      });
  };

  const alert = () => {
    return (
      <Alert variant="filled" severity={severity} sx={{ borderRadius: 0 }}>
        {mssg}
      </Alert>
    );
  };

  const sugerencias = MOTIVOS_SUGERIDOS[estado] || [];

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
              background: "rgba(228, 96, 47, 0.12)",
              color: "var(--cya-primary)",
            }}
          >
            <PetsIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Editar Colita
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModalEdit(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          flexDirection: "column",
          gap: 2.2,
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {previewUrl || (foto && !fotoError) ? (
            <Avatar
              key={previewUrl || foto}
              src={previewUrl || buildImgUrl(foto)}
              variant="rounded"
              onError={() => setFotoError(true)}
              sx={{ width: 76, height: 76, borderRadius: "14px" }}
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={{
                width: 76,
                height: 76,
                borderRadius: "14px",
                bgcolor: "var(--cya-bg-alt)",
                color: "var(--cya-primary)",
                border: "1px dashed var(--cya-border)",
              }}
            >
              <PetsIcon />
            </Avatar>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
              Foto de la mascota
            </Typography>
            <input
              type="file"
              accept="image/*"
              style={{
                border: "1px solid var(--cya-border)",
                padding: "8px",
                width: "100%",
                borderRadius: "8px",
                fontSize: "0.85rem",
              }}
              onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              fullWidth
              size="small"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-label">Tipo</InputLabel>
              <Select
                labelId="tipo-label"
                label="Tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                {TIPOS.map((t) => (
                  <MenuItem key={t.valor} value={t.valor}>
                    {t.etiqueta}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="genero-label">Género</InputLabel>
              <Select
                labelId="genero-label"
                label="Género"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              >
                {GENEROS.map((g) => (
                  <MenuItem key={g.valor} value={g.valor}>
                    {g.etiqueta}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="tamano-label">Tamaño</InputLabel>
              <Select
                labelId="tamano-label"
                label="Tamaño"
                value={tamano}
                onChange={(e) => setTamano(e.target.value)}
              >
                {TAMANOS.map((t) => (
                  <MenuItem key={t.valor} value={t.valor}>
                    {t.etiqueta}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Peso (kg)"
              fullWidth
              size="small"
              type="text"
              inputProps={{ inputMode: "decimal" }}
              value={peso}
              onChange={(e) => setPeso(soloDecimal(e.target.value))}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Fecha de ingreso"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            border: "1px solid var(--cya-border)",
            borderRadius: "10px",
            p: 2,
            background: "var(--cya-bg-alt)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--cya-dark)" }}>
              Edad
            </Typography>
            {edadActual ? (
              <Chip label={`Hoy: ${edadActual}`} size="small" color="info" />
            ) : null}
          </Box>
          <Typography variant="caption" sx={{ color: "var(--cya-text-muted)" }}>
            La edad se calcula sola a partir del nacimiento, así que no hay que
            actualizarla cada año.
          </Typography>

          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Checkbox
                checked={conoceNacimiento}
                onChange={(e) => setConoceNacimiento(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2">Se conoce la fecha exacta de nacimiento</Typography>
            }
          />

          {conoceNacimiento ? (
            <TextField
              label="Fecha de nacimiento"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          ) : (
            <TextField
              label="Edad aproximada al ingresar (años)"
              helperText="Se combina con la fecha de ingreso para estimar el nacimiento."
              fullWidth
              size="small"
              type="text"
              inputProps={{ inputMode: "numeric" }}
              value={edadAprox}
              onChange={(e) => setEdadAprox(soloDigitos(e.target.value, 2))}
            />
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="estado-select-label">Estado</InputLabel>
              <Select
                labelId="estado-select-label"
                id="estado-select"
                value={estado ?? ""}
                label="Estado"
                onChange={(e) => setEstado(e.target.value)}
              >
                {ESTADOS.map((e) => (
                  <MenuItem key={e.valor} value={e.valor}>
                    {e.etiqueta}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="esterilizado-select-label">Esterilizado</InputLabel>
              <Select
                labelId="esterilizado-select-label"
                id="esterilizado-select"
                value={esterelizado ?? ""}
                label="Esterilizado"
                onChange={(e) => setEsterilizado(e.target.value)}
              >
                <MenuItem value="Si">Si</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {exigeMotivo(estado) ? (
          <Box
            sx={{
              border: "1px solid var(--cya-primary)",
              borderRadius: "10px",
              p: 2,
              background: "rgba(228, 96, 47, 0.06)",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Motivo (obligatorio)
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--cya-text-muted)" }}>
              Queda registrado junto con tu usuario y la fecha del cambio.
            </Typography>
            {sugerencias.length ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7, my: 1 }}>
                {sugerencias.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    size="small"
                    variant={motivoEstado === s ? "filled" : "outlined"}
                    onClick={() => setMotivoEstado(s)}
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Box>
            ) : null}
            <TextField
              placeholder="Explica por qué"
              fullWidth
              size="small"
              multiline
              minRows={2}
              value={motivoEstado}
              onChange={(e) => setMotivoEstado(e.target.value)}
            />
          </Box>
        ) : null}

        <Box>
          <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
            Observaciones
          </Typography>
          <textarea
            placeholder="Ingrese Observaciones"
            value={observaciones ?? ""}
            onChange={(e) => setObservaciones(e.target.value)}
            style={{
              width: "100%",
              borderRadius: "8px",
              border: "1px solid var(--cya-border)",
              padding: "10px",
              maxHeight: "300px",
              height: "100px",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          ></textarea>
        </Box>
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
        <Button
          onClick={updateData}
          variant="contained"
          startIcon={<SaveIcon />}
          className="cya-btn-add"
        >
          Actualizar
        </Button>
      </Box>
    </>
  );
}
