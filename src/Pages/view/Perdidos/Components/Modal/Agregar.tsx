import {
    Alert,
    Autocomplete,
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
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";

interface props {
    setOpenModal: any;
    getPerdidos: () => void;
}

interface autocomplete {
    label: string;
    value: any;
}
export default function Agregar({ setOpenModal, getPerdidos }: props) {
    const [amo, setAmo] = React.useState<autocomplete[]>([]);

    const [openAlert, setOpenAlert] = React.useState(false);
    const [mssg, setMssg] = React.useState("");
    const [severity, setSeverity] = React.useState<any>("success");

    const [nombre, setNombre] = React.useState("");
    const [edad, setEdad] = React.useState("");
    const [descripcion, setDescripcion] = React.useState("");
    const [file, setFile] = React.useState<any>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string>("");
    const previewUrlRef = React.useRef<string>("");

    const [amoSelect, setAmoSelect] = React.useState<any>("");
    const [genero, setGenero] = React.useState<any>("");
    const [tipoAnimal, setTipoAnimal] = React.useState<any>("");
    const [tamano, setTamano] = React.useState<any>("");
    const [status, setStatus] = React.useState<any>("P");
    const [fechaExtravio, setFechaExtravio] = React.useState<any>("");

    const handleFileChange = (selected: File | null) => {
        setFile(selected);
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        const nextUrl = selected ? URL.createObjectURL(selected) : "";
        previewUrlRef.current = nextUrl;
        setPreviewUrl(nextUrl);
    };

    React.useEffect(() => {
        return () => {
            if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        };
    }, []);

    const getAmo = async () => {
        const url = baseurl + "amo/list";
        const body = {
            busqueda: "",
        };
        await axios.post(url, body).then((response) => {
            const { data } = response;
            const autocompletes: autocomplete[] = [];
            data.data.map((item: any) => {
                const dates = {
                    label: item.nombre,
                    value: item.iddueno,
                };
                autocompletes.push(dates);
            });

            setAmo(autocompletes);
        });
    };

    React.useEffect(() => {
        getAmo();
    }, []);

    const handleGenero = (value: any) => {
        setGenero(value);
    };

    const handleTipoAnimal = (value: any) => {
        setTipoAnimal(value);
    };

    const handleDonantes = (
        event: React.ChangeEvent<{}>,
        newValue: autocomplete | null
    ) => {
        if (newValue) {
            setAmoSelect(newValue.value);
        } else {
            setAmoSelect(null);
        }
    };

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
        if (!file) faltantes.push("Foto");
        return faltantes;
    };

    const savePerdido = async () => {
        const faltantes = validate();
        if (faltantes.length > 0) {
            setSeverity("warning");
            setMssg(`Completa los campos obligatorios: ${faltantes.join(", ")}`);
            setOpenAlert(true);
            return;
        }
        const url = baseurl + "perdidos/create";
        const formData = new FormData();
        formData.append("iddueno", amoSelect);
        formData.append("Nombre", nombre);
        formData.append("Edad", edad);
        formData.append("idtipoanimal", tipoAnimal);
        formData.append("idgenero", genero);
        formData.append("tamano", tamano);
        formData.append("status", status);
        formData.append("Observaciones", descripcion);
        formData.append("Fecha_Extravio", fechaExtravio);
        formData.append("foto", file);

        try {
            const response: any = await axios.post(url, formData);
            const { data } = response;
            if (data.code === "000") {
                setSeverity("success");
                setMssg(data.message);
                setOpenAlert(true);
                getPerdidos();
                setTimeout(() => {
                    setOpenModal(false);
                }, 1500);
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
                    background: "rgba(63, 158, 92, 0.14)",
                    color: "var(--cya-secondary-dark)",
                  }}
                >
                  <SearchOffIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
                  Agregar Mascota Perdida
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenModal(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ px: 3, py: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={amo}
                        size="small"
                        fullWidth
                        renderInput={(params) => (
                            <TextField {...params} label="Amo *" />
                        )}
                        onChange={handleDonantes}
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
                        label="Ingrese edad *"
                        variant="outlined"
                        type="number"
                        fullWidth
                        size="small"
                        value={edad}
                        onChange={(e) => setEdad(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="tamano-select-label">Tamaño *</InputLabel>
                        <Select
                            labelId="tamano-select-label"
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
                        <InputLabel id="status-select-label">Estado *</InputLabel>
                        <Select
                            labelId="status-select-label"
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
                        <InputLabel id="genero-select-label3">Genero *</InputLabel>
                        <Select
                            labelId="genero-select-label3"
                            value={genero}
                            onChange={(e) => handleGenero(e.target.value)}
                            label="Genero *"
                        >
                            <MenuItem value="1">Macho</MenuItem>
                            <MenuItem value="2">Hembra</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="tipo-select-label4">Tipo *</InputLabel>
                        <Select
                            labelId="tipo-select-label4"
                            value={tipoAnimal}
                            onChange={(e) => handleTipoAnimal(e.target.value)}
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
                        placeholder="Ingrese Observaciones"
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
                      Foto *
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      {previewUrl && (
                        <Box
                          component="img"
                          src={previewUrl}
                          alt="Vista previa"
                          sx={{ width: 56, height: 56, borderRadius: "10px", objectFit: "cover", border: "1px solid var(--cya-border)" }}
                        />
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
                onClick={() => setOpenModal(false)}
                sx={{ textTransform: "none", color: "var(--cya-text-muted)" }}
              >
                Cancelar
              </Button>
              <Button
                onClick={savePerdido}
                variant="contained"
                startIcon={<SaveIcon />}
                className="cya-btn-add"
              >
                Guardar
              </Button>
            </Box>
        </>
    );
}
