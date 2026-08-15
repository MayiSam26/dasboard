import {
    Alert,
    Autocomplete,
    Box,
    Button,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";

interface props {
    setOpenModal: any;
    getVisitas: () => void;
}

interface autocomplete {
    label: string;
    value: any;
}

export default function Agregar({ setOpenModal, getVisitas }: props) {
    const [voluntarios, setVoluntarios] = React.useState<autocomplete[]>([]);
    const [voluntarioSelect, setVoluntarioSelect] = React.useState<autocomplete | null>(null);

    const [openAlert, setOpenAlert] = React.useState(false);
    const [mssg, setMssg] = React.useState("");
    const [severity, setSeverity] = React.useState<any>("success");

    const [fecha, setFecha] = React.useState("");
    const [nota, setNota] = React.useState("");

    const getVoluntarios = async () => {
        const url = baseurl + "usuario/list";
        await axios.get(url).then((response) => {
            const { data } = response;
            const autocompletes: autocomplete[] = (data.data || [])
                .filter((u: any) => u.rol === "Voluntario")
                .map((u: any) => ({
                    label: `${u.nombres || ""} ${u.apellidos || ""}`.trim() || u.usuario,
                    value: u.iduser,
                }));
            setVoluntarios(autocompletes);
        });
    };

    React.useEffect(() => {
        getVoluntarios();
    }, []);

    const validate = () => {
        const faltantes: string[] = [];
        if (!voluntarioSelect) faltantes.push("Voluntario");
        if (!fecha) faltantes.push("Fecha de visita");
        return faltantes;
    };

    const guardar = async () => {
        const faltantes = validate();
        if (faltantes.length > 0) {
            setSeverity("warning");
            setMssg(`Completa los campos obligatorios: ${faltantes.join(", ")}`);
            setOpenAlert(true);
            return;
        }
        const url = baseurl + "voluntario-visita/create";
        const body = {
            iduser: voluntarioSelect?.value,
            fecha,
            nota: nota.trim() || null,
        };

        try {
            const response: any = await axios.post(url, body);
            const { data } = response;
            if (data.code === "000") {
                setSeverity("success");
                setMssg(data.message);
                setOpenAlert(true);
                getVisitas();
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
                    background: "rgba(63, 158, 92, 0.14)",
                    color: "var(--cya-secondary-dark)",
                  }}
                >
                  <EventIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
                  Asignar Visita
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenModal(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ px: 3, py: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
                <Autocomplete
                    disablePortal
                    options={voluntarios}
                    size="small"
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Voluntario *" />}
                    onChange={(_e, newValue) => setVoluntarioSelect(newValue)}
                />
                <Box>
                    <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
                      Fecha de la visita *
                    </Typography>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        style={{
                            padding: "8px",
                            width: "100%",
                            border: "1px solid var(--cya-border)",
                            borderRadius: "8px",
                            boxSizing: "border-box",
                        }}
                    />
                </Box>
                <TextField
                    label="Nota"
                    variant="outlined"
                    placeholder="Ej. Limpieza de jaulas, paseo de perros..."
                    fullWidth
                    size="small"
                    multiline
                    minRows={2}
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    helperText="Opcional"
                />
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
              <Button onClick={guardar} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
                Guardar
              </Button>
            </Box>
        </>
    );
}
