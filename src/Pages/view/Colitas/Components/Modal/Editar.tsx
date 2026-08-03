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
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PetsIcon from "@mui/icons-material/Pets";
import SaveIcon from "@mui/icons-material/Save";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";

function buildImgUrl(foto: string) {
  const cleanBase = baseurl.replace(/\/+$/, "");
  const cleanFoto = (foto || "").replace(/\\/g, "/").replace(/^\/+/, "");
  return `${cleanBase}/${cleanFoto}`;
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
  const [motivo, setMotivo] = React.useState("");
  const [esterelizado, setEsterilizado] = React.useState("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async () => {
    const url = baseurl + "colitas/detail/" + idAnimal;
    axios.get(url).then((response) => {
      const { data } = response;

      setFoto(data.data.foto);
      setMotivo(data.data.observaciones);
      setEsterilizado(data.data.esterelizacion);
    });
  };
  useEffect(() => {
    getById();
  }, []);

  const updateData = async () => {
    const url = baseurl + "colitas/update/" + idAnimal;

    const formData = new FormData();
    formData.append("esterelizacion", esterelizado);
    formData.append("observaciones", motivo);
    formData.append("foto", file);
    axios
      .put(url, formData)
      .then((response: any) => {
        const { data } = response;
        if (data.code === "000") {
          setOpenAlert(true);
          setSeverity("success");
          setMssg(data.message);
          setTimeout(() => {
            setOpenModalEdit(false);
            getAlbergados();
          }, 1800);
        } else {
          setOpenAlert(true);
          setSeverity("error");
          setMssg(data.message || "No se pudo actualizar.");
        }
      })
      .catch((e) => {
        setOpenAlert(true);
        setSeverity("error");
        setMssg(e?.response?.data?.message || e.message || "No se pudo actualizar.");
      });
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

      <Box sx={{ px: 3, py: 2.5, display: "flex", flexDirection: "column", gap: 2.2 }}>
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

        <FormControl fullWidth>
          <InputLabel id="esterilizado-select-label">Esterilizado</InputLabel>
          <Select
            labelId="esterilizado-select-label"
            id="esterilizado-select"
            value={esterelizado ?? ""}
            label="Esterilizado"
            onChange={(e) => setEsterilizado(e.target.value)}
            size="small"
          >
            <MenuItem value="Si">Si</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
            Observaciones
          </Typography>
          <textarea
            placeholder="Ingrese Observaciones"
            value={motivo ?? ""}
            onChange={(e) => setMotivo(e.target.value)}
            style={{
              width: "100%",
              borderRadius: "8px",
              border: "1px solid var(--cya-border)",
              padding: "10px",
              maxHeight: "300px",
              height: "120px",
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
