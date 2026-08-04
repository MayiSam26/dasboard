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
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";
import formatlocaldate from "../../../../../Config/helpersDate";

interface props {
    setOpenModalEdit: any;
    idapadrinado: any;
    getApadrinados: () => void;
}

interface autocomplete {
    label: string;
    value: any;
}

export default function Editar({ setOpenModalEdit, idapadrinado, getApadrinados }: props) {
    const [animales, setAnimales] = React.useState<autocomplete[]>([]);
    const [animalSelect, setAnimalSelect] = React.useState<autocomplete | null>(null);

    const [padrinoNombre, setPadrinoNombre] = React.useState("");
    const [padrinoContacto, setPadrinoContacto] = React.useState("");
    const [tipo, setTipo] = React.useState("");
    const [monto, setMonto] = React.useState("");
    const [fechaRegistro, setFechaRegistro] = React.useState("");
    const [estado, setEstado] = React.useState("Activo");

    const [severity, setSeverity] = React.useState<any>("");
    const [mssg, setMssg] = React.useState<any>("");
    const [openAlert, setOpenAlert] = React.useState<boolean>(false);

    React.useEffect(() => {
        // getAnimales/getById se definen acá adentro a propósito (mismo patrón que
        // Perdidos/Editar.tsx): así no hay funciones externas que declarar como
        // dependencia del hook.
        const getAnimales = async (): Promise<autocomplete[]> => {
            const url = baseurl + "colitas/list";
            const response = await axios.post(url, {});
            const autocompletes: autocomplete[] = (response.data.data || []).map((item: any) => ({
                label: item.nombre,
                value: item.idanimal,
            }));
            setAnimales(autocompletes);
            return autocompletes;
        };

        const getById = async (autocompletes: autocomplete[]) => {
            const url = baseurl + "apadrinado/detail/" + idapadrinado;
            const response = await axios.get(url);
            const { data } = response.data;
            setPadrinoNombre(data?.padrino_nombre || "");
            setPadrinoContacto(data?.padrino_contacto || "");
            setTipo(data?.tipo_apadrinamiento || "");
            setMonto(data?.monto != null ? String(data.monto) : "");
            setFechaRegistro(data?.fecha_registro ? moment(data.fecha_registro).format("YYYY-MM-DD") : "");
            setEstado(data?.estado || "Activo");
            const actual = autocompletes.find((a) => a.value === data?.idanimal) || null;
            setAnimalSelect(actual);
        };

        (async () => {
            const autocompletes = await getAnimales();
            await getById(autocompletes);
        })();
    }, [idapadrinado]);

    const validate = () => {
        const faltantes: string[] = [];
        if (!animalSelect) faltantes.push("Animal");
        if (!padrinoNombre.trim()) faltantes.push("Nombre del padrino");
        if (!tipo) faltantes.push("Tipo de apadrinamiento");
        if (!fechaRegistro) faltantes.push("Fecha de registro");
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
        const url = baseurl + "apadrinado/update/" + idapadrinado;
        const body = {
            idanimal: animalSelect?.value,
            padrino_nombre: padrinoNombre.trim(),
            padrino_contacto: padrinoContacto.trim(),
            tipo_apadrinamiento: tipo,
            monto: monto || null,
            fecha_registro: formatlocaldate(fechaRegistro),
            estado,
        };

        try {
            const response: any = await axios.put(url, body);
            const { data } = response;
            if (data.code === "000") {
                setSeverity("success");
                setMssg(data.message);
                setOpenAlert(true);
                getApadrinados();
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
                  <VolunteerActivismIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
                  Editar Apadrinamiento
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
                        options={animales}
                        size="small"
                        fullWidth
                        value={animalSelect}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        renderInput={(params) => <TextField {...params} label="Animal apadrinado *" />}
                        onChange={(_e, newValue) => setAnimalSelect(newValue)}
                    />
                </Grid>
                <Grid item xs={12} sm={7}>
                    <TextField
                        label="Nombre del padrino *"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={padrinoNombre}
                        onChange={(e) => setPadrinoNombre(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        label="Contacto del padrino"
                        variant="outlined"
                        placeholder="Teléfono, correo o red social"
                        fullWidth
                        size="small"
                        value={padrinoContacto}
                        onChange={(e) => setPadrinoContacto(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="tipo-apadrinamiento-edit-label">Tipo de apadrinamiento *</InputLabel>
                        <Select
                            labelId="tipo-apadrinamiento-edit-label"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            label="Tipo de apadrinamiento *"
                        >
                            <MenuItem value="Mensual">Mensual</MenuItem>
                            <MenuItem value="Único">Único</MenuItem>
                            <MenuItem value="Alimentación">Alimentación</MenuItem>
                            <MenuItem value="Médico">Médico</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Monto (S/.)"
                        type="number"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
                      Fecha de registro *
                    </Typography>
                    <input
                        type="date"
                        value={fechaRegistro}
                        onChange={(e) => setFechaRegistro(e.target.value)}
                        style={{
                            padding: "8px",
                            width: "100%",
                            border: "1px solid var(--cya-border)",
                            borderRadius: "8px",
                            boxSizing: "border-box",
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="estado-apadrinamiento-edit-label">Estado *</InputLabel>
                        <Select
                            labelId="estado-apadrinamiento-edit-label"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            label="Estado *"
                        >
                            <MenuItem value="Activo">Activo</MenuItem>
                            <MenuItem value="Finalizado">Finalizado</MenuItem>
                        </Select>
                    </FormControl>
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
