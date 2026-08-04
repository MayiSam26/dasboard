import {
    Alert,
    Autocomplete,
    Avatar,
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PetsIcon from "@mui/icons-material/Pets";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";
import formatlocaldate from "../../../../../Config/helpersDate";

function buildImgUrl(foto: string) {
    const cleanBase = baseurl.replace(/\/+$/, "");
    const cleanFoto = (foto || "").replace(/\\/g, "/").replace(/^\/+/, "");
    return `${cleanBase}/${cleanFoto}`;
}

interface props {
    setOpenModalEdit: any;
    idperdido: any;
    getPerdidos: () => void;
}

interface autocomplete {
    label: string;
    value: any;
}

export default function Editar({ setOpenModalEdit, idperdido, getPerdidos }: props) {
    const [amo, setAmo] = React.useState<autocomplete[]>([]);
    const [amoSelect, setAmoSelect] = React.useState<autocomplete | null>(null);

    const [nombre, setNombre] = React.useState("");
    const [edad, setEdad] = React.useState("");
    const [descripcion, setDescripcion] = React.useState("");
    const [genero, setGenero] = React.useState<any>("");
    const [tipoAnimal, setTipoAnimal] = React.useState<any>("");
    const [tamano, setTamano] = React.useState<any>("");
    const [status, setStatus] = React.useState<any>("P");
    const [fechaExtravio, setFechaExtravio] = React.useState<any>("");
    const [foto, setFoto] = React.useState<string>("");
    const [fotoError, setFotoError] = React.useState(false);

    const [file, setFile] = React.useState<any>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string>("");
    const previewUrlRef = React.useRef<string>("");

    const [severity, setSeverity] = React.useState<any>("");
    const [mssg, setMssg] = React.useState<any>("");
    const [openAlert, setOpenAlert] = React.useState<boolean>(false);

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

    useEffect(() => {
        // getAmo/getById se definen acá adentro (no afuera del efecto) a propósito:
        // así no hay funciones externas que declarar como dependencia del hook,
        // evitando por completo la advertencia de dependencias faltantes.
        const getAmo = async (): Promise<autocomplete[]> => {
            const url = baseurl + "amo/list";
            const response = await axios.post(url, { busqueda: "" });
            const autocompletes: autocomplete[] = (response.data.data || []).map((item: any) => ({
                label: item.nombre,
                value: item.iddueno,
            }));
            setAmo(autocompletes);
            return autocompletes;
        };

        const getById = async (autocompletes: autocomplete[]) => {
            const url = baseurl + "perdidos/detail/" + idperdido;
            const response = await axios.get(url);
            const { data } = response.data;
            setNombre(data?.Nombre || "");
            setEdad(data?.Edad || "");
            setDescripcion(data?.Observaciones || "");
            setGenero(data?.idgenero ? String(data.idgenero) : "");
            setTipoAnimal(data?.idtipoanimal ? String(data.idtipoanimal) : "");
            setTamano(data?.tamano || "");
            setStatus(data?.status || "P");
            setFechaExtravio(data?.Fecha_Extravio ? moment(data.Fecha_Extravio).format("YYYY-MM-DD") : "");
            setFoto(data?.foto || "");
            const actual = autocompletes.find((a) => a.value === data?.iddueno) || null;
            setAmoSelect(actual);
        };

        (async () => {
            const autocompletes = await getAmo();
            await getById(autocompletes);
        })();
    }, [idperdido]);

    const validate = () => {
        const faltantes: string[] = [];
        if (!amoSelect) faltantes.push("Amo");
        if (!nombre.trim()) faltantes.push("Nombre");
        if (!edad) faltantes.push("Edad");
        if (!tamano) faltantes.push("Tamaño");
        if (!genero) faltantes.push("Genero");
        if (!tipoAnimal) faltantes.push("Tipo");
        if (!descripcion.trim()) faltantes.push("Observaciones");
        if (!fechaExtravio) faltantes.push("Fecha de extravío");
        return faltantes;
    };

    const actualizar = async () => {
        const faltantes = validate();
        if (faltantes.length > 0) {
            setSeverity("warning");
            setMssg(`Completa los campos obligatorios: ${faltantes.join(", ")}`);
            setOpenAlert(true);
            return;
        }
        const url = baseurl + "perdidos/update/" + idperdido;
        const formData = new FormData();
        formData.append("iddueno", amoSelect?.value ?? "");
        formData.append("Nombre", nombre);
        formData.append("Edad", edad);
        formData.append("idtipoanimal", tipoAnimal);
        formData.append("idgenero", genero);
        formData.append("tamano", tamano);
        formData.append("status", status);
        formData.append("Observaciones", descripcion);
        formData.append("Fecha_Extravio", formatlocaldate(fechaExtravio));
        if (file) formData.append("foto", file);

        try {
            const response: any = await axios.put(url, formData);
            const { data } = response;
            if (data.code === "000") {
                setSeverity("success");
                setMssg(data.message);
                setOpenAlert(true);
                getPerdidos();
                setTimeout(() => {
                    setOpenModalEdit(false);
                }, 1500);
            } else {
                setSeverity("error");
                setMssg(data.message);
                setOpenAlert(true);
            }
        } catch (e: any) {
            setSeverity("error");
            setMssg(e?.response?.data?.message || e.message || "No se pudo actualizar.");
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
                  <SearchOffIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
                  Editar Mascota Perdida
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenModalEdit(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ px: 3, py: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        options={amo}
                        size="small"
                        fullWidth
                        value={amoSelect}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        renderInput={(params) => <TextField {...params} label="Amo *" />}
                        onChange={(_e, newValue) => setAmoSelect(newValue)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Ingrese Nombre *"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Edad *"
                        variant="outlined"
                        placeholder="Ej: 2 años, 8 meses"
                        fullWidth
                        size="small"
                        value={edad}
                        onChange={(e) => setEdad(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="tamano-edit-label">Tamaño *</InputLabel>
                        <Select
                            labelId="tamano-edit-label"
                            value={tamano}
                            onChange={(e) => setTamano(e.target.value)}
                            label="Tamaño *"
                        >
                            <MenuItem value="pequeño">Pequeño</MenuItem>
                            <MenuItem value="mediano">Mediano</MenuItem>
                            <MenuItem value="grande">Grande</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="status-edit-label">Estado *</InputLabel>
                        <Select
                            labelId="status-edit-label"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            label="Estado *"
                        >
                            <MenuItem value="P">Perdido</MenuItem>
                            <MenuItem value="E">Encontrado</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="genero-edit-label">Genero *</InputLabel>
                        <Select
                            labelId="genero-edit-label"
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}
                            label="Genero *"
                        >
                            <MenuItem value="1">Macho</MenuItem>
                            <MenuItem value="2">Hembra</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="tipo-edit-label">Tipo *</InputLabel>
                        <Select
                            labelId="tipo-edit-label"
                            value={tipoAnimal}
                            onChange={(e) => setTipoAnimal(e.target.value)}
                            label="Tipo *"
                        >
                            <MenuItem value="1">Perro</MenuItem>
                            <MenuItem value="2">Gato</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
                      Observaciones *
                    </Typography>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        style={{
                            width: "100%",
                            borderRadius: "8px",
                            border: "1px solid var(--cya-border)",
                            padding: "10px",
                            maxHeight: "300px",
                            height: "110px",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                        }}
                    ></textarea>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
                      Fecha de extravío *
                    </Typography>
                    <input
                        type="date"
                        value={fechaExtravio}
                        onChange={(e) => setFechaExtravio(e.target.value)}
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
                      Foto
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      {previewUrl || (foto && !fotoError) ? (
                        <Avatar
                          key={previewUrl || foto}
                          src={previewUrl || buildImgUrl(foto)}
                          variant="rounded"
                          sx={{ width: 56, height: 56, border: "1px solid var(--cya-border)" }}
                          onError={() => setFotoError(true)}
                        />
                      ) : (
                        <Avatar variant="rounded" sx={{ width: 56, height: 56, bgcolor: "var(--cya-bg-alt)" }}>
                          <PetsIcon sx={{ color: "var(--cya-text-muted)" }} />
                        </Avatar>
                      )}
                      <input
                          type="file"
                          accept="image/*"
                          style={{
                              border: '1px solid var(--cya-border)',
                              padding: '8px',
                              width: '100%',
                              borderRadius: '8px',
                              boxSizing: "border-box",
                          }}
                          onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                      />
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
